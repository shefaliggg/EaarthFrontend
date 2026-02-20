import { create } from "zustand";
import { devtools } from "zustand/middleware";
import chatApi from "../api/chat.api";
import { mapConversationType } from "../utils/Chattypemapper";
import { getChatSocket } from "../../../../shared/config/socketConfig";
import { store } from "../../../../app/store";
import { computeMessageState, transformMessage } from "../utils/messageHelpers";
import { toast } from "sonner";

export const DEFAULT_PROJECT_ID = "697c899668977a7ca2b27462";

const getCurrentUserId = () => {
  const state = store.getState();
  return state.auth?.user?._id || state.user?.currentUser?._id || null;
};

const useChatStore = create(
  devtools(
    (set, get) => ({
      conversations: [],
      onlineUsers: new Set(),
      messagesByConversation: {},
      selectedChat: null,
      isLoadingConversations: false,
      isLoadingMessages: false,
      isSendingMessage: false,
      typingUsers: {},

      attachSocketListeners: () => {
        const socket = getChatSocket();
        if (!socket) return;

        socket.removeAllListeners();

        socket.on("message:new", ({ conversationId, message }) => {
          console.log("📨 New message received:", {
            conversationId,
            message,
          });
          socket.emit("message:delivered", {
            messageId: message._id,
          });
          set({
            typingUsers: {
              ...get().typingUsers,
              [conversationId]: (
                get().typingUsers[conversationId] || []
              ).filter(
                (u) => u.userId !== message.senderId?._id || message.senderId, // <-- use senderId here
              ),
            },
          });
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

        socket.on("typing:start", ({ conversationId, userId, name }) => {
          const state = get();
          const currentUserId = getCurrentUserId();
          if (userId === currentUserId) return;

          const currentArray = state.typingUsers[conversationId] || [];

          // ✅ Proper duplicate check
          if (currentArray.some((u) => u.userId === userId)) return;

          set({
            typingUsers: {
              ...state.typingUsers,
              [conversationId]: [...currentArray, { userId, name }],
            },
          });

          // ⏳ auto remove after 5 seconds
          setTimeout(() => {
            const latest = get().typingUsers[conversationId] || [];

            set({
              typingUsers: {
                ...get().typingUsers,
                [conversationId]: latest.filter((u) => u.userId !== userId),
              },
            });
          }, 3000);
        });

        socket.on("typing:stop", ({ conversationId, userId }) => {
          const state = get();
          const currentArray = state.typingUsers[conversationId] || [];

          set(
            {
              typingUsers: {
                ...state.typingUsers,
                [conversationId]: currentArray.filter(
                  (u) => u.userId !== userId,
                ),
              },
            },
            false,
            "typing:stop",
          ); // Add action name for debugging
        });

        socket.on("user:online", (userId) => {
          console.log("user online", userId);
          const state = get();

          const updated = new Set(state.onlineUsers);
          updated.add(userId);

          set({ onlineUsers: updated });
        });

        socket.on("user:offline", (userId) => {
          console.log("user offline", userId);
          const state = get();

          const updated = new Set(state.onlineUsers);
          updated.delete(userId);

          set({ onlineUsers: updated });
        });

        socket.on("presence:init", (userIds) => {
          const onlineSet = new Set(userIds);

          set({ onlineUsers: onlineSet });
        });

        console.log("✅ Chat socket listeners attached");
      },

      getGroupOnlineCount: (group) => {
        if (!Array.isArray(group?.members)) return 0;

        const online = get().onlineUsers;

        return group.members.filter((member) => {
          const id = member.userId;

          return id && online.has(id.toString());
        }).length;
      },

      joinConversation: (conversationId) => {
        try {
          const socket = getChatSocket();
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
          const socket = getChatSocket();
          if (!socket?.connected) return;

          console.log("📤 Leaving conversation:", conversationId);
          socket.emit("conversation:leave", conversationId);
        } catch (error) {
          console.error("❌ Error leaving conversation:", error);
        }
      },

      emitTypingStart: (conversationId) => {
        try {
          const socket = getChatSocket();
          if (!socket?.connected || !conversationId) return;

          socket.emit("typing:start", { conversationId });
        } catch (error) {
          console.error("❌ Error emitting typing start:", error);
        }
      },

      emitTypingStop: (conversationId) => {
        try {
          const socket = getChatSocket();
          if (!socket?.connected || !conversationId) return;

          socket.emit("typing:stop", { conversationId });
        } catch (error) {
          console.error("❌ Error emitting typing stop:", error);
        }
      },

      setSelectedChat: (chat) => {
        const prev = get().selectedChat;

        if (prev?.id) {
          get().leaveConversation(prev.id);
        }

        if (chat?.id) {
          get().joinConversation(chat.id);
        }

        set((state) => ({
          selectedChat: chat,
          typingUsers: {
            ...state.typingUsers,
            [chat?.id]: [],
          },
        }));
      },

      loadConversations: async (projectId, type) => {
        if (!projectId) {
          console.error("❌ No projectId provided");
          return;
        }

        const currentUserId = getCurrentUserId();

        if (!currentUserId) {
          console.error("❌ No currentUserId set");
          return;
        }

        console.log("🔄 Loading conversations...", {
          projectId,
          type,
          currentUserId,
        });
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
                  ? "General"
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
              members: Array.isArray(conv.members) ? conv.members : [],
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

          // console.log("✅ Transformed conversations:", transformed.length);
          set({ conversations: transformed, isLoadingConversations: false });
        } catch (error) {
          console.error("❌ Failed to load conversations:", error);
          console.error(
            "Error details:",
            error.response?.data || error.message,
          );
          set({ isLoadingConversations: false, conversations: [] });
        }
      },

      updateConversation: (conversationId, updates) => {
        set({
          conversations: get().conversations.map((c) =>
            c.id === conversationId ? { ...c, ...updates } : c,
          ),
        });
      },

      loadMessages: async (conversationId, loadMore = false) => {
        if (!conversationId) return;
        const currentUserId = getCurrentUserId();

        set({ isLoadingMessages: true });

        try {
          const existing = get().messagesByConversation[conversationId] || {
            messages: [],
            hasMore: true,
            cursor: null,
          };

          const cursor = loadMore ? existing.cursor : null;
          const result = await chatApi.getMessages(conversationId, 20, cursor);

          const conversation = get().conversations.find(
            (c) => c.id === conversationId,
          );

          const memberCount = conversation?.members || 2;

          const transformed = result.messages.map((msg) =>
            transformMessage(msg, {
              currentUserId,
              conversationMembersCount: memberCount,
            }),
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
        const currentUserId = getCurrentUserId();
        const selectedChat = get().selectedChat;
        const projectId =
          projectIdParam || selectedChat?.projectId || DEFAULT_PROJECT_ID;

        if (!projectId) throw new Error("Project ID is required");

        const isFileUpload = !!messageData.formData;

        // 🔥 deterministic temp id
        const clientTempId = `temp-${crypto.randomUUID()}`;
        const now = new Date();

        const optimisticMessage = {
          id: clientTempId,
          clientTempId,

          conversationId,
          projectId,

          sender: "You",
          senderId: currentUserId,
          avatar: "Y",

          time: now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),

          timestamp: now.getTime(),

          content: messageData.text || "",
          caption: isFileUpload
            ? messageData.formData.get("caption") || ""
            : messageData.caption || "",

          type: isFileUpload
            ? messageData.formData.get("type")?.toLowerCase() || "file"
            : messageData.type?.toLowerCase() || "text",

          files: isFileUpload
            ? messageData.formData.getAll("attachments").map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
                size: file.size,
                mime: file.type,
              }))
            : messageData.files || [],

          isOwn: true,
          state: "sending",

          readBy: 0,
          deliveredTo: 0,

          edited: false,
          editedAt: null,
          deleted: false,

          reactions: {},

          replyTo: null,
          forwardedFrom: messageData.forwardedFrom || null,
          isForwarded: !!messageData.forwardedFrom,

          isStarred: false,
          system: null,

          _raw: null,
        };

        // Reply handling
        if (messageData.replyFull) {
          const original = messageData.replyFull;

          optimisticMessage.replyTo = {
            messageId: original.id,
            sender: original.sender,
            senderId: original.senderId,
            preview:
              original.content ||
              original.caption ||
              (original.files?.length ? "Attachment" : ""),
            type: original.type?.toLowerCase(),
            files: original.files || [],
            caption: original.caption || "",
            deleted: original.deleted || false,
          };
        }

        if (isFileUpload) {
          // 🔥 attach temp id to formData
          messageData.formData.append("clientTempId", clientTempId);
        }

        const existing = get().messagesByConversation[conversationId] || {
          messages: [],
          hasMore: false,
          cursor: null,
        };

        // 🔥 Add optimistic message
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
              messageData.formData,
            );
          } else {
            const payload = {
              projectId,
              type: (messageData.type || "TEXT").toUpperCase(),
              text: messageData.text || "",
              caption: messageData.caption || "",
              files: messageData.files || [],
              clientTempId,
            };

            if (messageData.replyTo) payload.replyTo = messageData.replyTo;
            if (messageData.forwardedFrom)
              payload.forwardedFrom = messageData.forwardedFrom;

            sentMessage = await chatApi.sendMessage(conversationId, payload);
          }
          set({ isSendingMessage: false });

          return sentMessage;
        } catch (error) {
          console.error("❌ Failed to send message:", error);
          toast.error("Failed to send message. Please try again.", {
            description: error.response?.data?.message || error.message,
          });

          const updated = get().messagesByConversation[conversationId];

          set({
            messagesByConversation: {
              ...get().messagesByConversation,
              [conversationId]: {
                ...updated,
                messages: updated.messages.map((m) =>
                  m.clientTempId === clientTempId
                    ? { ...m, state: "failed" }
                    : m,
                ),
              },
            },
            isSendingMessage: false,
          });

          throw error;
        }
      },

      retryMessage: async (conversationId, message) => {
        const { id, content, type, replyTo } = message;

        // set back to sending
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: {
              ...state.messagesByConversation[conversationId],
              messages: state.messagesByConversation[
                conversationId
              ].messages.map((m) =>
                m.id === id ? { ...m, state: "sending" } : m,
              ),
            },
          },
        }));

        // resend
        return get().sendMessage(conversationId, null, {
          text: content,
          type: type.toUpperCase(),
          replyTo,
        });
      },

      addMessageToConversation: (conversationId, message) => {
        const currentUserId = getCurrentUserId();

        set((state) => {
          const existing = state.messagesByConversation[conversationId] || {
            messages: [],
            hasMore: false,
            cursor: null,
          };

          const conversation = state.conversations.find(
            (c) => c.id === conversationId,
          );

          const memberCount = conversation?.members || 2;

          const transformed = transformMessage(message, {
            currentUserId,
            conversationMembersCount: memberCount,
          });

          const incomingClientTempId = message.clientTempId;

          let updatedMessages = [...existing.messages];

          // 🔥 Replace optimistic message
          if (incomingClientTempId) {
            const index = updatedMessages.findIndex(
              (m) => m.clientTempId === incomingClientTempId,
            );

            if (index !== -1) {
              const existingMsg = updatedMessages[index];

              updatedMessages[index] = {
                ...existingMsg,

                id: transformed.id,
                time: transformed.time,
                timestamp: transformed.timestamp,

                files: transformed.files,

                state: transformed.state,
                readBy: transformed.readBy,
                deliveredTo: transformed.deliveredTo,

                edited: transformed.edited,
                editedAt: transformed.editedAt,
                deleted: transformed.deleted,

                reactions: transformed.reactions,
                _raw: transformed._raw,
              };

              return {
                messagesByConversation: {
                  ...state.messagesByConversation,
                  [conversationId]: {
                    ...existing,
                    messages: updatedMessages,
                  },
                },
              };
            }
          }

          // 🔥 Prevent duplicate by real ID
          if (updatedMessages.some((m) => m.id === transformed.id)) {
            return state;
          }

          // 🔥 Append if new
          updatedMessages.push(transformed);

          return {
            messagesByConversation: {
              ...state.messagesByConversation,
              [conversationId]: {
                ...existing,
                messages: updatedMessages,
              },
            },
          };
        });
      },

      updateConversationLastMessage: (conversationId, message) => {
        const conversations = get().conversations.map((conv) => {
          if (conv.id !== conversationId) return conv;

          const isOwn =
            message.senderId?._id?.toString() ===
            getCurrentUserId()?.toString();
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
        const currentUserId = getCurrentUserId();
        const existing = get().messagesByConversation[conversationId];
        if (!existing) return;

        const conversation = get().conversations.find(
          (c) => c.id === conversationId,
        );
        const memberCount = conversation?.members?.length || 2;
        const now = new Date();

        const updatedMessages = existing.messages.map((msg) => {
          const seenBy = Array.isArray(msg.seenBy) ? [...msg.seenBy] : [];
          const deliveredTo = Array.isArray(msg.deliveredTo)
            ? [...msg.deliveredTo]
            : [];
          if (
            userId &&
            !seenBy.some((s) => s.userId?.toString() === userId.toString())
          ) {
            seenBy.push({ userId, seenAt: now });
          }
          if (
            userId &&
            !deliveredTo.some((s) => s.userId?.toString() === userId.toString())
          ) {
            deliveredTo.push({ userId, deliveredAt: now });
          }

          // recompute state using helper
          const state = computeMessageState(
            { ...msg, seenBy, deliveredTo },
            memberCount,
          );

          return {
            ...msg,
            seenBy,
            deliveredTo,
            state,
          };
        });

        // update messages in store
        set({
          messagesByConversation: {
            ...get().messagesByConversation,
            [conversationId]: {
              ...existing,
              messages: updatedMessages,
            },
          },
        });
      },

      emitConversationRead: async (conversationId) => {
        if (!conversationId) return;

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

      downloadAttachment: async (conversationId, messageId, attachment) => {
        const downloadPromise = chatApi.downloadMessageAttachments(
          conversationId,
          messageId,
          attachment._id,
        );

        return toast.promise(downloadPromise, {
          loading: "Downloading file...",
          success: async (response) => {
            const blob = new Blob([response.data]);
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = attachment.name || "file";
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(blobUrl);

            return "Download complete";
          },
          error: (err) => err?.response?.data?.message || "Download failed",
        });
      },
    }),
    { name: "ChatStore" },
  ),
);

export default useChatStore;
