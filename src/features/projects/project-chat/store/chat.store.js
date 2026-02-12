// src/features/chat/store/chat.store.js
// ✅ FINAL FIX: Prevent infinite loops in typing state

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import chatApi from "../api/chat.api";
import { mapConversationType } from "../utils/Chattypemapper";
import { getSocket, initSocket } from "../../../../shared/config/socketConfig";
import { store } from "../../../../app/store";

const DEFAULT_PROJECT_ID = "697c899668977a7ca2b27462";

const getCurrentUserId = () => store.getState().user.currentUser?._id;

const getFileUrl = (fileKey) => {
  if (!fileKey) return null;
  if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
    return fileKey;
  }
  const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL || "https://your-bucket.s3.amazonaws.com";
  return `${S3_BASE_URL}/${fileKey}`;
};

function transformMessage(msg, currentUserId) {
  const isOwn =
    msg.senderId?._id?.toString() === currentUserId?.toString() ||
    msg.senderId?.toString() === currentUserId?.toString();

  let url = null;
  let fileName = null;
  let fileSize = null;

  if (msg.content?.files && msg.content.files.length > 0) {
    const file = msg.content.files[0];
    url = file.url;
    fileName = file.name;
    fileSize = file.size ? `${(file.size / 1024).toFixed(2)} KB` : null;
  }

  let replyTo = null;
  if (msg.replyTo?.messageId) {
    replyTo = {
      messageId: msg.replyTo.messageId,
      sender: msg.replyTo.senderId?.displayName || "Unknown",
      content: msg.replyTo.preview || "",
      preview: msg.replyTo.preview || "",
    };
  }

  return {
    id: msg._id,
    sender: msg.senderId?.displayName || "Unknown",
    avatar: msg.senderId?.displayName?.charAt(0)?.toUpperCase() || "U",
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
      currentUserId: null,
      isLoadingConversations: false,
      isLoadingMessages: false,
      isSendingMessage: false,
      typingUsers: {},
      socketInitialized: false,
      
      initializeChatSocket: (userId) => {
        try {
          console.log("🔌 Initializing chat socket for user:", userId);
          
          let socket = getSocket();
          
          if (!socket || !socket.connected) {
            socket = initSocket(userId);
          }
          
          if (!socket) {
            console.error("❌ Failed to initialize socket");
            return;
          }

          set({ socketInitialized: true });

          socket.off("message:new");
          socket.off("message:edited");
          socket.off("message:deleted");
          socket.off("message:reaction");
          socket.off("conversation:read");
          socket.off("typing:start");
          socket.off("typing:stop");
          socket.off("user:online");
          socket.off("user:offline");
          socket.off("conversation:online-count");

          socket.on("message:new", ({ conversationId, message }) => {
            console.log("📨 New message received:", { conversationId, message });
            get().addMessageToConversation(conversationId, message);
            get().updateConversationLastMessage(conversationId, message);
          });

          socket.on("message:edited", ({ messageId, text, editedAt }) => {
            console.log("✏️ Message edited:", { messageId, text });
            get().updateMessageInConversation(messageId, {
              content: text,
              editedAt,
              edited: true,
            });
          });

          socket.on("message:deleted", ({ messageId }) => {
            console.log("🗑️ Message deleted:", messageId);
            get().markMessageAsDeleted(messageId);
          });

          socket.on("message:reaction", ({ messageId, userId, emoji }) => {
            console.log("❤️ Message reaction:", { messageId, emoji });
            get().updateMessageReaction(messageId, userId, emoji);
          });

          socket.on("conversation:read", ({ conversationId, userId }) => {
            console.log("👁️ Conversation read:", { conversationId, userId });
            get().markConversationMessagesAsRead(conversationId, userId);
          });

          // ✅ CRITICAL FIX: Immutable typing state updates
          socket.on("typing:start", ({ conversationId, userId }) => {
            const state = get();
            
            // Ignore self
            if (userId === state.currentUserId) return;
            
            const currentArray = state.typingUsers[conversationId] || [];
            
            // Don't add if already exists
            if (currentArray.includes(userId)) return;
            
            // ✅ Create NEW object with NEW array (immutable)
            set({
              typingUsers: {
                ...state.typingUsers,
                [conversationId]: [...currentArray, userId],
              },
            }, false, "typing:start"); // ✅ Add action name for debugging
          });

          socket.on("typing:stop", ({ conversationId, userId }) => {
            const state = get();
            const currentArray = state.typingUsers[conversationId] || [];
            
            // ✅ Create NEW object with NEW filtered array (immutable)
            set({
              typingUsers: {
                ...state.typingUsers,
                [conversationId]: currentArray.filter((id) => id !== userId),
              },
            }, false, "typing:stop"); // ✅ Add action name for debugging
          });

          socket.on("user:online", (userId) => {
            console.log("🟢 User online:", userId);
          });

          socket.on("user:offline", (userId) => {
            console.log("🔴 User offline:", userId);
          });

          socket.on("conversation:online-count", ({ conversationId, onlineCount }) => {
            console.log("👥 Online count:", { conversationId, onlineCount });
            get().updateConversation(conversationId, { online: onlineCount });
          });

          console.log("✅ Chat socket listeners attached");
        } catch (error) {
          console.error("❌ Socket initialization error:", error);
          set({ socketInitialized: true });
        }
      },

      joinConversation: (conversationId) => {
        try {
          const socket = getSocket();
          if (!socket?.connected) {
            console.warn("⚠️ Cannot join conversation: socket not connected");
            return;
          }
          
          console.log("📥 Joining conversation:", conversationId);
          socket.emit("conversation:join", conversationId);
        } catch (error) {
          console.error("❌ Error joining conversation:", error);
        }
      },

      leaveConversation: (conversationId) => {
        try {
          const socket = getSocket();
          if (!socket?.connected) return;
          
          console.log("📤 Leaving conversation:", conversationId);
          socket.emit("conversation:leave", conversationId);
        } catch (error) {
          console.error("❌ Error leaving conversation:", error);
        }
      },

      emitTypingStart: (conversationId) => {
        try {
          const socket = getSocket();
          if (!socket?.connected || !conversationId) return;
          
          socket.emit("typing:start", { conversationId });
        } catch (error) {
          console.error("❌ Error emitting typing start:", error);
        }
      },

      emitTypingStop: (conversationId) => {
        try {
          const socket = getSocket();
          if (!socket?.connected || !conversationId) return;
          
          socket.emit("typing:stop", { conversationId });
        } catch (error) {
          console.error("❌ Error emitting typing stop:", error);
        }
      },

      setSelectedChat: (chat) => {
        const prevChat = get().selectedChat;
        if (prevChat?.id) get().leaveConversation(prevChat.id);
        if (chat?.id) get().joinConversation(chat.id);
        set({ selectedChat: chat });
      },

      setCurrentUserId: (userId) => {
        set({ currentUserId: userId });
        get().initializeChatSocket(userId);
      },

      loadConversations: async (projectId, type) => {
        if (!projectId) {
          console.error("❌ No projectId provided");
          return;
        }

        const currentUserId = get().currentUserId;
        if (!currentUserId) {
          console.error("❌ No currentUserId set");
          return;
        }

        console.log("🔄 Loading conversations...", { projectId, type, currentUserId });
        set({ isLoadingConversations: true });

        try {
          const conversations = await chatApi.getConversations(projectId);
          
          console.log("✅ Conversations received:", conversations.length);

          if (!conversations || conversations.length === 0) {
            console.warn("⚠️ No conversations returned from API");
            set({ conversations: [], isLoadingConversations: false });
            return;
          }

          const transformed = conversations.map((conv) => {
            const frontendType = mapConversationType(conv.type);
            const unreadCount = conv.unreadCount || 0;

            let otherUser = null;
            if (conv.type === "DIRECT" && conv.members) {
              otherUser = conv.members.find(
                (m) => m.userId?._id?.toString() !== currentUserId.toString()
              );
            }

            const currentMember = conv.members?.find(
              (m) => m.userId?._id?.toString() === currentUserId.toString()
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
                  (id) => id.toString() === currentUserId.toString()
                ) || false,
              isMuted: false,
              isFavorite: false,
              canSendMessage,
              _raw: conv,
            };
          });

          console.log("✅ Transformed conversations:", transformed.length);
          set({ conversations: transformed, isLoadingConversations: false });
        } catch (error) {
          console.error("❌ Failed to load conversations:", error);
          console.error("Error details:", error.response?.data || error.message);
          set({ isLoadingConversations: false, conversations: [] });
        }
      },

      updateConversation: (conversationId, updates) => {
        set({
          conversations: get().conversations.map((c) =>
            c.id === conversationId ? { ...c, ...updates } : c
          ),
        });
      },

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
            transformMessage(msg, currentUserId)
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

      sendMessage: async (conversationId, projectIdParam, messageData) => {
        const currentUserId = get().currentUserId;
        if (!currentUserId) throw new Error("User not authenticated");

        const selectedChat = get().selectedChat;
        const projectId =
          projectIdParam || selectedChat?.projectId || DEFAULT_PROJECT_ID;

        if (!projectId) throw new Error("Project ID is required");

        const isFileUpload = !!messageData.formData;
        const tempId = `temp-${Date.now()}`;

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

        if (isFileUpload) {
          const replyToMessageId = messageData.formData.get("replyTo[messageId]");
          if (replyToMessageId) {
            optimisticMessage.replyTo = {
              messageId: replyToMessageId,
              sender: messageData.formData.get("replyTo[senderName]") || "Unknown",
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
            sentMessage = await chatApi.sendMessage(
              conversationId,
              messageData.formData
            );
          } else {
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

          const transformed = transformMessage(sentMessage, currentUserId);
          transformed.isOwn = true;
          transformed.state = "sent";

          const updated = get().messagesByConversation[conversationId];
          set({
            messagesByConversation: {
              ...get().messagesByConversation,
              [conversationId]: {
                ...updated,
                messages: updated.messages.map((m) =>
                  m.id === tempId ? transformed : m
                ),
              },
            },
            isSendingMessage: false,
          });

          return sentMessage;
        } catch (error) {
          console.error("❌ Failed to send message:", error);

          const updated = get().messagesByConversation[conversationId];
          set({
            messagesByConversation: {
              ...get().messagesByConversation,
              [conversationId]: {
                ...updated,
                messages: updated.messages.map((m) =>
                  m.id === tempId ? { ...m, state: "failed" } : m
                ),
              },
            },
            isSendingMessage: false,
          });

          throw error;
        }
      },

      addMessageToConversation: (conversationId, message) => {
        const currentUserId = get().currentUserId;
        const existing = get().messagesByConversation[conversationId];
        if (!existing) return;

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
            message.senderId?._id?.toString() === get().currentUserId?.toString();
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
              m.id === messageId ? { ...m, ...updates } : m
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
              c.id === conversationId ? { ...c, unread: 0 } : c
            ),
          });
        } catch (error) {
          console.error("❌ Failed to mark as read:", error);
        }
      },

      disconnectSocket: () => {
        try {
          const socket = getSocket();
          if (socket) {
            const selectedChat = get().selectedChat;
            if (selectedChat?.id) {
              socket.emit("conversation:leave", selectedChat.id);
            }

            socket.off("message:new");
            socket.off("message:edited");
            socket.off("message:deleted");
            socket.off("message:reaction");
            socket.off("conversation:read");
            socket.off("typing:start");
            socket.off("typing:stop");
            socket.off("user:online");
            socket.off("user:offline");
            socket.off("conversation:online-count");

            set({ 
              socketInitialized: false,
              typingUsers: {} 
            });
          }
        } catch (error) {
          console.error("❌ Error disconnecting socket:", error);
        }
      },
    }),
    { name: "ChatStore" }
  )
);

export default useChatStore;