import { create } from "zustand";
import { devtools } from "zustand/middleware";
import chatApi from "../api/chat.api";
import { mapConversationType } from "../utils/Chattypemapper";
import { getChatSocket } from "../../../../shared/config/socketConfig";
import { store } from "../../../../app/store";
import {
  computeMessageState,
  generateConversationLastMessagePreview,
  transformConversation,
  transformMessage,
} from "../utils/messageHelpers";
import { toast } from "sonner";
import useCallStore from "./call.store";

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

        socket.on("conversation:new", (conversation) => {
          console.log("📥 New conversation received:", conversation);

          const currentUserId = getCurrentUserId();

          const formatted = transformConversation(conversation, currentUserId);

          set((state) => {
            // Prevent duplicates
            if (state.conversations.some((c) => c.id === formatted.id)) {
              return state;
            }

            return {
              conversations: [formatted, ...state.conversations],
            };
          });
        });

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
          const existingMessages =
            get().messagesByConversation[conversationId]?.messages || [];
          if (existingMessages.length > 0) {
            get().addMessageToConversation(conversationId, message);
          }

          const preview = generateConversationLastMessagePreview(message);
          if (!preview) return;

          get().updateConversationLastMessage(conversationId, {
            _id: message._id,
            text: preview,
            createdAt: message.updatedAt || message.createdAt,
            senderId: message.senderId?._id || message.senderId,
            senderName: message.senderId?.displayName || "Member",
            type: message.type,
          });

          // dispatch(
          //   addNotification({
          //     id: message._id,
          //     type: "CHAT",
          //     title: message.senderName,
          //     message: message.text,
          //     conversationId,
          //   }),
          // );
        });

        socket.on("message:updated", ({ conversationId, message }) => {
          console.log("🔄 Message updated:", message);
          if (!message) return;

          const currentUserId = getCurrentUserId();

          const existingMessages =
            get().messagesByConversation[conversationId]?.messages || [];

          if (existingMessages.length > 0) {
            const conversation = get().conversations.find(
              (c) => c.id === conversationId,
            );

            const memberCount = conversation?.members?.length || 2;

            const transformed = transformMessage(message, {
              currentUserId,
              conversationMembersCount: memberCount,
            });

            get().updateMessageInConversation(transformed.id, {
              content: transformed.content,
              caption: transformed.caption,
              callInfo: transformed.callInfo,
              state: transformed.state,
              seenBy: transformed.seenBy,
              deliveredTo: transformed.deliveredTo,
              edited: transformed.edited,
              editedAt: transformed.editedAt,
            });
          }
          // 2️⃣ Update sidebar only if this is the latest message
          const lastMessage = existingMessages[existingMessages.length - 1];

          if (lastMessage?.id === message._id) {
            const preview = generateConversationLastMessagePreview(message);
            if (!preview) return;

            get().updateConversationLastMessage(conversationId, {
              _id: message._id,
              text: preview,
              createdAt: message.updatedAt || message.createdAt,
              senderId: message.senderId?._id || message.senderId,
              senderName: message.senderId?.displayName || "Member",
              type: message.type,
            });
          }
        });

        socket.on("message:edited", ({ message, conversationId }) => {
          console.log("✏️ Message edited:", {
            messageId: message._id,
            text: message.content?.text,
          });
          socket.emit("message:delivered", {
            messageId: message._id,
          });

          const conversation = get().conversations.find(
            (c) => c.id === conversationId,
          );

          const memberCount = conversation?.members || 2;
          get().updateMessageInConversation(message._id, {
            content: message.content.text,
            editedAt: message.status.editedAt,
            state: computeMessageState(message, memberCount),
            seenBy: message?.seenBy || [],
            deliveredTo: message?.deliveredTo || [],
            edited: true,
          });
        });

        socket.on(
          "message:delivery-update",
          ({ messageId, userId, conversationId }) => {
            console.log("🚚 Delivery update received:", { messageId, userId });
            const state = get();
            const messages =
              state.messagesByConversation[conversationId]?.messages || [];
            const existingMsg = messages.find((m) => m.id === messageId);

            if (existingMsg) {
              const deliveredTo = [...(existingMsg.deliveredTo || [])];
              const exists = deliveredTo.some((d) => d.userId === userId);

              if (!exists) {
                deliveredTo.push({
                  userId,
                  deliveredAt: new Date().toISOString(),
                });

                const conversation = state.conversations.find(
                  (c) => c.id === conversationId,
                );
                const memberCount = conversation?.members?.length || 2;

                get().updateMessageInConversation(messageId, {
                  deliveredTo,
                  state: computeMessageState(
                    { ...existingMsg, deliveredTo },
                    memberCount,
                  ),
                });
              }
            }
          },
        );

        socket.on("message:deleted", ({ conversationId, messageId }) => {
          console.log("🗑️ Message deleted:", messageId);

          get().markMessageAsDeleted(messageId);

          const existing =
            get().messagesByConversation[conversationId]?.messages || [];

          if (!existing.length) return;

          const lastMessage = existing[existing.length - 1];

          if (lastMessage?.id === messageId) {
            get().updateConversationLastMessage(conversationId, {
              _id: messageId,
              text: "This message was deleted",
              senderId: lastMessage.senderId,
              senderName: lastMessage.sender,
              createdAt: new Date(),
              senderId: lastMessage.senderId,
            });
          }
        });

        socket.on("message:pinned", ({ message, conversationId }) => {
          console.log("📌 Message pinned:", message);
          set((state) => {
            const updatedConversations = state.conversations.map((c) =>
              c.id === conversationId ? { ...c, pinnedMessage: message } : c,
            );

            const updatedSelectedChat =
              state.selectedChat?.id === conversationId
                ? { ...state.selectedChat, pinnedMessage: message }
                : state.selectedChat;

            return {
              conversations: updatedConversations,
              selectedChat: updatedSelectedChat,
            };
          });
        });

        socket.on("message:reaction", ({ messageId, reactions }) => {
          console.log("❤️ Message reaction:", { messageId, reactions });
          const updatedReactions = (reactions || []).reduce((acc, r) => {
            const emoji = r.emoji;
            const userId = r.userId?._id?.toString() || r.userId?.toString();

            if (!acc[emoji]) acc[emoji] = [];

            acc[emoji].push(userId);

            return acc;
          }, {});
          get().updateMessageReaction(messageId, updatedReactions);
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
          ); // Add action name for debuggcing
        });

        socket.on("user:online", (userId) => {
          console.log("user online", userId);
          const state = get();

          const updated = new Set(state.onlineUsers);
          updated.add(userId.toString()); // normalize
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
          console.log("users presence update", userIds);

          const onlineSet = new Set(userIds.map((id) => id.toString()));
          set({ onlineUsers: onlineSet });
        });

        useCallStore.getState().attachCallSocketListeners();

        console.log("✅ Chat + Call socket listeners attached");
      },

      getGroupOnlineCount: (group) => {
        if (!Array.isArray(group?.members)) return 0;

        const online = get().onlineUsers;

        return group.members.filter((member) => {
          const id = member.userId?._id?.toString();
          return id && online.has(id);
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

      loadConversations: async (projectId, type, search) => {
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
          search,
          type,
          currentUserId,
        });
        set({ isLoadingConversations: true });

        try {
          const conversations = await chatApi.getConversations(
            projectId,
            search,
          );

          console.log("✅ Conversations received:", conversations);

          if (!conversations || conversations.length === 0) {
            console.warn("⚠️ No conversations returned from API");
            set({ conversations: [], isLoadingConversations: false });
            return;
          }

          const transformed = conversations.map((conv) =>
            transformConversation(conv, currentUserId),
          );

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

      createDirectConversation: async (projectId, targetUserId) => {
        try {
          const existing = get().conversations.find(
            (c) =>
              c.type === "dm" &&
              c.userId?.toString() === targetUserId.toString(),
          );

          if (existing) {
            return existing;
          }

          const response = await chatApi.createDirectConversation(
            projectId,
            targetUserId,
          );

          const conv = response;

          const currentUserId = getCurrentUserId();

          const formatted = transformConversation(conv, currentUserId);

          // 🔥 Add to conversation list immediately
          set((state) => ({
            conversations: [formatted, ...state.conversations],
          }));

          return formatted;
        } catch (error) {
          console.error("❌ Failed to create direct conversation:", error);
          throw error;
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
            messagesLoaded: false,
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
                messagesLoaded: true,
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

        // 🔥 detect retry
        const isRetry = !!messageData.clientTempId;

        const clientTempId =
          messageData.clientTempId || `temp-${crypto.randomUUID()}`;

        const now = new Date();

        // 🔥 helper to cleanup blobs
        const cleanupBlobs = (files = []) => {
          files.forEach((f) => {
            if (f.url?.startsWith("blob:")) {
              URL.revokeObjectURL(f.url);
            }
          });
        };

        // 🔥 build optimistic message ONLY if not retry
        let optimisticMessage;

        if (!isRetry) {
          optimisticMessage = {
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
                  url: URL.createObjectURL(file), // preview
                  file, // 🔥 KEEP ORIGINAL FILE
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
        }

        if (isFileUpload) {
          if (!isRetry) {
            messageData?.formData.append("clientTempId", clientTempId);
          }
        }

        const existing = get().messagesByConversation[conversationId] || {
          messages: [],
          hasMore: false,
          cursor: null,
        };

        // 🔥 only add optimistic if NOT retry
        if (!isRetry) {
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

          get().updateConversationLastMessage(conversationId, {
            _id: optimisticMessage.id,
            text: optimisticMessage.content,
            senderId: optimisticMessage.senderId,
            senderName: optimisticMessage.sender,
            type: optimisticMessage.type,
            createdAt: new Date(),
          });
        }

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

          // 🔥 cleanup blobs after success
          const updated = get().messagesByConversation[conversationId];
          const msg = updated?.messages.find(
            (m) => m.clientTempId === clientTempId,
          );

          if (msg?.files) cleanupBlobs(msg.files);

          set({
            messagesByConversation: {
              ...get().messagesByConversation,
              [conversationId]: {
                ...updated,
                messages: updated.messages.map((m) => {
                  if (m.clientTempId !== clientTempId) return m;
                  if (m.state === "delivered" || m.state === "seen") {
                    return m;
                  }
                  return { ...m, state: "sent" };
                }),
              },
            },
            isSendingMessage: false,
          });

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
        const {
          id,
          content,
          type,
          replyTo,
          files = [],
          clientTempId,
          caption,
          projectId,
        } = message;

        console.log("🔁 Retry message:", message);

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

        const hasFiles = files.length > 0;

        if (hasFiles) {
          const formData = new FormData();

          formData.append("projectId", projectId);
          formData.append("type", type.toUpperCase());
          formData.append("caption", caption || "");
          formData.append("clientTempId", clientTempId);

          files.forEach((f) => {
            if (f.file) {
              formData.append("attachments", f.file);
            }
          });

          if (replyTo) {
            formData.append("replyTo[messageId]", replyTo.messageId);
            formData.append("replyTo[senderId]", replyTo.senderId);
            formData.append("replyTo[preview]", replyTo.preview || "");
            formData.append("replyTo[type]", replyTo.type);
          }

          return get().sendMessage(conversationId, DEFAULT_PROJECT_ID, {
            formData,
            clientTempId,
          });
        }

        return get().sendMessage(conversationId, DEFAULT_PROJECT_ID, {
          text: content,
          type: type.toUpperCase(),
          replyTo,
          clientTempId,
        });
      },

      editMessage: async (conversationId, messageId, newText) => {
        const state = get();
        const conv = state.messagesByConversation[conversationId];

        if (!conv) return;

        const messageIndex = conv.messages.findIndex((m) => m.id === messageId);
        if (messageIndex === -1) return;

        const oldMessage = conv.messages[messageIndex];

        // 🔥 OPTIMISTIC UPDATE
        get().updateMessageInConversation(messageId, {
          content: newText,
          edited: true,
          state: "sending",
          editedAt: new Date().toISOString(),
        });

        try {
          await chatApi.editMessage(conversationId, messageId, newText);
        } catch (error) {
          console.error("❌ editMessage failed:", error);

          // ROLLBACK if API fails
          get().updateMessageInConversation(messageId, {
            content: oldMessage.content,
            edited: oldMessage.edited,
            editedAt: oldMessage.editedAt,
          });
        }
      },

      toggleFavoriteMessage: async (conversationId, messageId, isFavorited) => {
        const state = get();
        const conv = state.messagesByConversation[conversationId];
        if (!conv) return;

        const previous = conv.messages;

        // ⭐ OPTIMISTIC UPDATE
        get().updateMessageInConversation(messageId, {
          isStarred: !isFavorited,
        });

        const promise = chatApi.toggleFavorite(
          conversationId,
          messageId,
          !isFavorited,
        );

        return toast.promise(promise, {
          error: (err) => {
            // 🔁 rollback
            set({
              messagesByConversation: {
                ...get().messagesByConversation,
                [conversationId]: {
                  ...conv,
                  messages: previous,
                },
              },
            });

            return err?.response?.data?.message || "Failed to update favorite";
          },
        });
      },

      reactToMessage: async (conversationId, message, emoji) => {
        const state = get();
        const conv = state.messagesByConversation[conversationId];
        const currentUserId = getCurrentUserId();

        if (!conv) return;

        const previous = conv.messages;

        // 🧠 check if already reacted
        const alreadyReacted =
          message.reactions?.[emoji]?.includes(currentUserId);

        // 🔥 clone reactions safely
        const updatedReactions = { ...(message.reactions || {}) };

        if (alreadyReacted) {
          // ❌ remove reaction
          updatedReactions[emoji] = updatedReactions[emoji].filter(
            (id) => id !== currentUserId,
          );

          // cleanup empty emoji
          if (updatedReactions[emoji].length === 0) {
            delete updatedReactions[emoji];
          }
        } else {
          // ✅ add reaction
          if (!updatedReactions[emoji]) {
            updatedReactions[emoji] = [];
          }

          updatedReactions[emoji].push(currentUserId);
        }

        // ⚡ OPTIMISTIC UPDATE
        get().updateMessageInConversation(message.id, {
          reactions: updatedReactions,
        });

        const promise = chatApi.toggleReaction(
          conversationId,
          message.id,
          emoji,
        );

        return toast.promise(promise, {
          error: (err) => {
            // 🔁 rollback
            set({
              messagesByConversation: {
                ...get().messagesByConversation,
                [conversationId]: {
                  ...conv,
                  messages: previous,
                },
              },
            });

            return err?.response?.data?.message || "Failed to react";
          },
        });
      },

      togglePinMessage: async (conversationId, messageId) => {
        const state = get();

        const previousConversations = state.conversations;
        const previousSelectedChat = state.selectedChat;

        const isUnpin =
          state.conversations.find((c) => c.id === conversationId)
            ?.pinnedMessage?.messageId === messageId;

        const optimisticPinned = isUnpin
          ? null
          : {
              messageId,
              text: "Pinning message...",
              attachmentCount: 0,
              isCallMessage: null,
            };

        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, pinnedMessage: optimisticPinned }
              : c,
          ),
          selectedChat:
            state.selectedChat?.id === conversationId
              ? { ...state.selectedChat, pinnedMessage: optimisticPinned }
              : state.selectedChat,
        }));

        const promise = chatApi.pinMessage(conversationId, messageId);

        return toast.promise(promise, {
          error: (err) => {
            // rollback both
            set({
              conversations: previousConversations,
              selectedChat: previousSelectedChat,
            });

            return err?.response?.data?.message || "Failed to Pin Message";
          },
        });
      },

      deleteMessageForMe: async (conversationId, messageId) => {
        const state = get();
        const conv = state.messagesByConversation[conversationId];
        if (!conv) return;

        const oldMessages = conv.messages;

        // optimistic remove
        set({
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: {
              ...conv,
              messages: conv.messages.filter((m) => m.id !== messageId),
            },
          },
        });

        const promise = chatApi.deleteMessageForMe(conversationId, messageId);

        return toast.promise(promise, {
          error: (err) => {
            // rollback
            set({
              messagesByConversation: {
                ...get().messagesByConversation,
                [conversationId]: {
                  ...conv,
                  messages: oldMessages,
                },
              },
            });

            return err?.response?.data?.message || "Failed to delete message";
          },
        });
      },

      deleteMessageForEveryone: async (conversationId, messageId) => {
        const state = get();
        const conv = state.messagesByConversation[conversationId];
        if (!conv) return;

        const oldMessages = conv.messages;
        const lastMessage = conv.messages[conv.messages.length - 1];

        const prevConversation = get().conversations.find(
          (c) => c.id === conversationId,
        );

        const isLast = lastMessage?.id === messageId;

        // optimistic soft delete
        get().updateMessageInConversation(messageId, {
          deleted: true,
          content: "",
        });

        if (isLast) {
          get().updateConversationLastMessage(conversationId, {
            _id: lastMessage?.id,
            text: "This message was deleted",
            createdAt: new Date(),
            senderId: lastMessage.senderId,
            senderName: lastMessage.sender,
            type: lastMessage.type,
          });
        }

        const promise = chatApi.deleteMessageForEveryone(
          conversationId,
          messageId,
        );

        return toast.promise(promise, {
          error: (err) => {
            // rollback
            set({
              messagesByConversation: {
                ...get().messagesByConversation,
                [conversationId]: {
                  ...conv,
                  messages: oldMessages,
                },
              },
              conversations: get().conversations.map((c) =>
                c.id === conversationId ? prevConversation : c,
              ),
            });

            return err?.response?.data?.message || "Delete failed";
          },
        });
      },

      addMessageToConversation: (conversationId, message) => {
        const currentUserId = getCurrentUserId();

        const conversation = get().conversations.find(
          (c) => c.id === conversationId,
        );

        const memberCount = conversation?.members?.length || 2;

        const transformed = transformMessage(message, {
          currentUserId,
          conversationMembersCount: memberCount,
        });

        set((state) => {
          const existing = state.messagesByConversation[conversationId] || {
            messages: [],
            hasMore: false,
            cursor: null,
          };

          const incomingClientTempId = message.clientTempId;

          let updatedMessages = [...existing.messages];

          // Replace optimistic message
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
                callInfo: transformed.callInfo,
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

          // Prevent duplicate
          if (
            updatedMessages.some(
              (m) =>
                m.id === transformed.id ||
                (transformed.clientTempId &&
                  m.clientTempId === transformed.clientTempId),
            )
          ) {
            return state;
          }

          // Append new message
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
        const currentUserId = getCurrentUserId();
        const createdAt = message.createdAt || new Date().toISOString();

        const conversations = get().conversations.map((conv) => {
          if (conv.id !== conversationId) return conv;

          const isOwn =
            message.senderId?.toString() === currentUserId?.toString();

          const isSelected = get().selectedChat?.id === conversationId;

          return {
            ...conv,
            lastMessage: {
              id: message._id || message.id,
              text: message.content?.text || message.text || "",
              senderId: message.senderId,
              senderName:
                message.senderName || message.senderId?.displayName || "You",
              type: message.type || "TEXT",
              createdAt,
            },
            timestamp: new Date(createdAt).getTime(),
            unread: isOwn || isSelected ? conv.unread : conv.unread + 1,
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

      updateMessageReaction: (messageId, reactions) => {
        get().updateMessageInConversation(messageId, { reactions: reactions });
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

        const prevConversation = get().conversations.find(
          (c) => c.id === conversationId,
        );

        set({
          conversations: get().conversations.map((c) =>
            c.id === conversationId ? { ...c, unread: 0 } : c,
          ),
        });

        try {
          await chatApi.markAsRead(conversationId);
        } catch (error) {
          console.error("❌ Failed to mark as read:", error);

          if (!prevConversation) return;

          set({
            conversations: get().conversations.map((c) =>
              c.id === conversationId ? prevConversation : c,
            ),
          });
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
