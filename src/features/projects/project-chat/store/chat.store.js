import { create } from "zustand";
import { devtools } from "zustand/middleware";
import chatApi from "../api/chat.api";
import { mapConversationType } from "../utils/Chattypemapper";
import { disconnect, getSocket } from "../../../../shared/config/socketConfig";
import { store } from "../../../../app/store";

const DEFAULT_PROJECT_ID = "697c899668977a7ca2b27462";

const getCurrentUserId = () =>
  store.getState().user.currentUser?._id;

const getFileUrl = (fileKey) => {
  if (!fileKey) return null;

  if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
    return fileKey;
  }

  const S3_BASE_URL =
    import.meta.env.VITE_S3_BASE_URL || "https://your-bucket.s3.amazonaws.com";
  return `${S3_BASE_URL}/${fileKey}`;
};

// ✅ Transform message from backend to frontend format
function transformMessage(msg, currentUserId) {
  const isOwn =
    msg.senderId?._id?.toString() === currentUserId?.toString() ||
    msg.senderId?.toString() === currentUserId?.toString();

  // Extract file information
  let url = null;
  let fileName = null;
  let fileSize = null;

  if (msg.content?.files && msg.content.files.length > 0) {
    const file = msg.content.files[0];
    url = getFileUrl(file.url);
    fileName = file.name;
    fileSize = file.size ? `${(file.size / 1024).toFixed(2)} KB` : null;
  }

  // Normalize replyTo
  let replyTo = null;
  if (msg.replyTo?.messageId) {
    replyTo = {
      messageId: msg.replyTo.messageId,
      sender: msg.replyTo.senderId?.name || "Unknown",
      content: msg.replyTo.preview || "",
      preview: msg.replyTo.preview || "",
    };
  }

  return {
    id: msg._id,
    sender: msg.senderId?.name || "Unknown",
    avatar: msg.senderId?.name?.charAt(0)?.toUpperCase() || "U",
    time: new Date(msg.createdAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    timestamp: new Date(msg.createdAt).getTime(),
    content: msg.content?.text || "",
    type: msg.type?.toLowerCase(),
    url,
    fileName,
    fileSize,
    isOwn,
    state: msg.seenBy?.length > 0 ? "seen" : "delivered",
    readBy: msg.seenBy?.length || 0,
    edited: msg.status?.edited || false,
    editedAt: msg.status?.editedAt,
    deleted: msg.status?.deletedForEveryone || false,
    reactions: msg.reactions?.reduce((acc, r) => {
      acc[r.emoji] = (acc[r.emoji] || 0) + 1;
      return acc;
    }, {}),
    replyTo,
    _raw: msg,
  };
}

const useChatStore = create(
  devtools(
    (set, get) => ({
      conversations: [],
      messagesByConversation: {},
      selectedChat: null,
      isLoadingConversations: false,
      isLoadingMessages: false,
      isSendingMessage: false,
      typingUsers: {}, // { conversationId: [userId1, userId2] }

      attachSocketListeners: () => {
        const socket = getSocket();
        if (!socket) return;

        console.log("🔌 Chat listeners attached");

        socket.on("message:new", ({ conversationId, message }) => {
          get().addMessageToConversation(conversationId, message);
          get().updateConversationLastMessage(conversationId, message);
        });

        socket.on("message:edited", ({ messageId, text, editedAt }) => {
          get().updateMessageInConversation(messageId, {
            content: text,
            editedAt,
            edited: true,
          });
        });

        socket.on("message:deleted", ({ messageId }) => {
          get().markMessageAsDeleted(messageId);
        });

        socket.on("message:reaction", ({ messageId, userId, emoji }) => {
          get().updateMessageReaction(messageId, userId, emoji);
        });

        socket.on("conversation:read", ({ conversationId, userId }) => {
          get().markConversationMessagesAsRead(conversationId, userId);
        });

        socket.on("typing:start", ({ conversationId, userId }) => {
          set((state) => {
            const existing = state.typingUsers[conversationId] || [];
            if (existing.includes(userId)) return state;
            return {
              typingUsers: {
                ...state.typingUsers,
                [conversationId]: [...existing, userId],
              },
            };
          });
        });

        socket.on("typing:stop", ({ conversationId, userId }) => {
          set((state) => {
            const prev = state.typingUsers[conversationId] || [];
            const next = prev.filter((id) => id !== userId);
            if (prev.length === next.length) return state;
            return {
              typingUsers: {
                ...state.typingUsers,
                [conversationId]: next,
              },
            };
          });
        });
      },

      joinConversation: (conversationId) => {
        const socket = getSocket();
        socket?.emit("conversation:join", conversationId);
      },

      leaveConversation: (conversationId) => {
        const socket = getSocket();
        socket?.emit("conversation:leave", conversationId);
      },

      // ═══════════════════════════════════════
      // CHAT SELECTION
      // ═══════════════════════════════════════
      setSelectedChat: (chat) => {
        const prevChat = get().selectedChat;
        if (prevChat?.id) get().leaveConversation(prevChat.id);
        if (chat?.id) get().joinConversation(chat.id);
        set({ selectedChat: chat });
      },

      setCurrentUserId: (userId) => {
        set({ currentUserId: userId });
        get().attachSocketListeners(userId);
      },

      // ═══════════════════════════════════════
      // CONVERSATIONS
      // ═══════════════════════════════════════
      loadConversations: async (projectId, type) => {
        if (!projectId) return;

        const currentUserId = get().currentUserId;
        if (!currentUserId) {
          console.error("❌ No currentUserId set");
          return;
        }

        set({ isLoadingConversations: true });

        try {
          const conversations = await chatApi.getConversations(projectId);

          const transformed = conversations.map((conv) => {
            const frontendType = mapConversationType(conv.type);
            const unreadCount = conv.unreadCount || 0;

            let otherUser = null;
            if (conv.type === "DIRECT" && conv.members) {
              otherUser = conv.members.find(
                (m) => m.userId?._id?.toString() !== currentUserId.toString(),
              );
            }

            const currentMember = conv.members?.find(
              (m) => m.userId?._id?.toString() === currentUserId.toString(),
            );
            const canSendMessage = currentMember?.canSendMessage !== false;

            return {
              id: conv._id,
              type: frontendType,
              projectId: conv.projectId,
              name:
                conv.type === "PROJECT_ALL"
                  ? "All Departments"
                  : conv.type === "DEPARTMENT"
                    ? conv.department?.name || "Department"
                    : otherUser?.userId?.name || "Unknown User",
              department: conv.department?._id,
              departmentName: conv.department?.name,
              userId: otherUser?.userId?._id,
              avatar:
                otherUser?.userId?.name?.charAt(0)?.toUpperCase() ||
                conv.department?.name?.charAt(0)?.toUpperCase() ||
                "U",
              role: otherUser?.userId?.role || "Member",
              status: "online",
              members: conv.members?.length || 0,
              online: 0,
              unread: unreadCount,
              mentions: 0,
              lastMessage: conv.lastMessage?.preview || "",
              timestamp: conv.lastMessage?.createdAt
                ? new Date(conv.lastMessage.createdAt).getTime()
                : Date.now(),
              isPinned:
                conv.pinnedFor?.some(
                  (id) => id.toString() === currentUserId.toString(),
                ) || false,
              isMuted: false,
              isFavorite: false,
              canSendMessage,
              _raw: conv,
            };
          });

          set({ conversations: transformed, isLoadingConversations: false });
        } catch (error) {
          console.error("❌ Failed to load conversations:", error);
          set({ isLoadingConversations: false, conversations: [] });
        }
      },

      // ✅ NEW: Update single conversation (for optimistic updates)
      updateConversation: (conversationId, updates) => {
        set({
          conversations: get().conversations.map((c) =>
            c.id === conversationId ? { ...c, ...updates } : c,
          ),
        });
      },

      // ═══════════════════════════════════════
      // MESSAGES
      // ═══════════════════════════════════════
      loadMessages: async (conversationId, loadMore = false) => {
        if (!conversationId) return;

        set({ isLoadingMessages: true });

        try {
          const existing = get().messagesByConversation[conversationId] || {
            messages: [],
            hasMore: true,
            cursor: null,
          };

          const cursor = loadMore ? existing.cursor : null;
          const result = await chatApi.getMessages(conversationId, 20, cursor);

          const currentUserId = get().currentUserId;

          const transformed = result.messages.map((msg) =>
            transformMessage(msg, currentUserId),
          );

          const updatedMessages = loadMore
            ? [...transformed, ...existing.messages]
            : transformed;

          set({
            messagesByConversation: {
              ...get().messagesByConversation,
              [conversationId]: {
                messages: updatedMessages,
                hasMore: result.hasMore,
                cursor: result.nextCursor,
              },
            },
            isLoadingMessages: false,
          });
        } catch (error) {
          console.error("❌ Failed to load messages:", error);
          set({ isLoadingMessages: false });
        }
      },

      // ═══════════════════════════════════════
      // SEND MESSAGE
      // ═══════════════════════════════════════
      sendMessage: async (conversationId, projectIdParam, messageData) => {
        const currentUserId = get().currentUserId;
        if (!currentUserId) throw new Error("User not authenticated");

        const selectedChat = get().selectedChat;
        const projectId =
          projectIdParam || selectedChat?.projectId || DEFAULT_PROJECT_ID;

        if (!projectId) throw new Error("Project ID is required");

        const isFileUpload = !!messageData.formData;
        const tempId = `temp-${Date.now()}`;

        // ✅ Create optimistic message
        const optimisticMessage = {
          id: tempId,
          sender: "You",
          avatar: "Y",
          time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
          timestamp: Date.now(),
          content: isFileUpload ? "" : messageData.text || "",
          type: isFileUpload
            ? messageData.formData.get("type")?.toLowerCase() || "file"
            : messageData.type?.toLowerCase() || "text",
          isOwn: true,
          state: "sending",
          fileName: isFileUpload
            ? messageData.formData.get("attachments")?.name
            : null,
          replyTo: null,
          _raw: null,
        };

        // Extract replyTo from FormData if present
        if (isFileUpload) {
          const replyToMessageId =
            messageData.formData.get("replyTo[messageId]");
          if (replyToMessageId) {
            optimisticMessage.replyTo = {
              messageId: replyToMessageId,
              sender:
                messageData.formData.get("replyTo[senderName]") || "Unknown",
              content: messageData.formData.get("replyTo[preview]") || "",
              preview: messageData.formData.get("replyTo[preview]") || "",
            };
          }
        } else if (messageData.replyTo) {
          optimisticMessage.replyTo = {
            messageId: messageData.replyTo.messageId,
            sender: messageData.replyTo.senderName || "Unknown",
            content: messageData.replyTo.preview || "",
            preview: messageData.replyTo.preview || "",
          };
        }

        const existing = get().messagesByConversation[conversationId] || {
          messages: [],
          hasMore: false,
          cursor: null,
        };

        // ✅ Optimistic update
        set({
          messagesByConversation: {
            ...get().messagesByConversation,
            [conversationId]: {
              ...existing,
              messages: [...existing.messages, optimisticMessage],
            },
          },
          isSendingMessage: true,
        });

        try {
          let sentMessage;

          if (isFileUpload) {
            console.log("📤 Sending file upload");
            sentMessage = await chatApi.sendMessage(
              conversationId,
              messageData.formData,
            );
          } else {
            console.log("📤 Sending text message");
            const payload = {
              projectId,
              type: (messageData.type || "TEXT").toUpperCase(),
              text: messageData.text || "",
            };

            if (messageData.replyTo) {
              payload.replyTo = {
                messageId: messageData.replyTo.messageId,
                senderId: messageData.replyTo.senderId,
                preview: messageData.replyTo.preview,
                type: messageData.replyTo.type,
              };
            }

            if (messageData.forwardedFrom) {
              payload.forwardedFrom = messageData.forwardedFrom;
            }

            sentMessage = await chatApi.sendMessage(conversationId, payload);
          }

          console.log("✅ Message sent successfully:", sentMessage);

          // Transform the response
          const transformed = transformMessage(sentMessage, currentUserId);
          transformed.isOwn = true;
          transformed.state = "sent";

          // Replace optimistic message
          const updated = get().messagesByConversation[conversationId];
          set({
            messagesByConversation: {
              ...get().messagesByConversation,
              [conversationId]: {
                ...updated,
                messages: updated.messages.map((m) =>
                  m.id === tempId ? transformed : m,
                ),
              },
            },
            isSendingMessage: false,
          });

          return sentMessage;
        } catch (error) {
          console.error("❌ Failed to send message:", error);

          // Mark optimistic message as failed
          const updated = get().messagesByConversation[conversationId];
          set({
            messagesByConversation: {
              ...get().messagesByConversation,
              [conversationId]: {
                ...updated,
                messages: updated.messages.map((m) =>
                  m.id === tempId ? { ...m, state: "failed" } : m,
                ),
              },
            },
            isSendingMessage: false,
          });

          throw error;
        }
      },

      // ═══════════════════════════════════════
      // SOCKET EVENT HANDLERS
      // ═══════════════════════════════════════
      addMessageToConversation: (conversationId, message) => {
        const currentUserId = get().currentUserId;
        const existing = get().messagesByConversation[conversationId];
        if (!existing) return;

        // Dedup
        if (existing.messages.some((m) => m.id === message._id)) return;

        const transformed = transformMessage(message, currentUserId);

        set({
          messagesByConversation: {
            ...get().messagesByConversation,
            [conversationId]: {
              ...existing,
              messages: [...existing.messages, transformed],
            },
          },
        });
      },

      updateConversationLastMessage: (conversationId, message) => {
        const conversations = get().conversations.map((conv) => {
          if (conv.id !== conversationId) return conv;
          const isOwn =
            message.senderId?._id?.toString() ===
            get().currentUserId?.toString();
          return {
            ...conv,
            lastMessage: message.content?.text || "",
            timestamp: new Date(message.createdAt).getTime(),
            unread: isOwn ? conv.unread : conv.unread + 1,
          };
        });
        set({ conversations });
      },

      updateMessageInConversation: (messageId, updates) => {
        const all = { ...get().messagesByConversation };
        Object.keys(all).forEach((convId) => {
          all[convId] = {
            ...all[convId],
            messages: all[convId].messages.map((m) =>
              m.id === messageId ? { ...m, ...updates } : m,
            ),
          };
        });
        set({ messagesByConversation: all });
      },

      markMessageAsDeleted: (messageId) => {
        get().updateMessageInConversation(messageId, { deleted: true });
      },

      updateMessageReaction: (messageId, userId, emoji) => {
        const selectedChat = get().selectedChat;
        if (selectedChat?.id) get().loadMessages(selectedChat.id);
      },

      markConversationMessagesAsRead: (conversationId, userId) => {
        const existing = get().messagesByConversation[conversationId];
        if (!existing) return;

        set({
          messagesByConversation: {
            ...get().messagesByConversation,
            [conversationId]: {
              ...existing,
              messages: existing.messages.map((m) => ({
                ...m,
                state: m.isOwn ? "seen" : m.state,
                readBy: m.isOwn ? (m.readBy || 0) + 1 : m.readBy,
              })),
            },
          },
        });
      },

      markAsRead: async (conversationId) => {
        try {
          await chatApi.markAsRead(conversationId);
          set({
            conversations: get().conversations.map((c) =>
              c.id === conversationId ? { ...c, unread: 0 } : c,
            ),
          });
        } catch (error) {
          console.error("❌ Failed to mark as read:", error);
        }
      },
    }),
    { name: "ChatStore" },
  ),
);

export default useChatStore;
