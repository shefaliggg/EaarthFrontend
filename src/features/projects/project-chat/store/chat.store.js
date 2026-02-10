import { create } from "zustand";
import { devtools } from "zustand/middleware";
import chatApi from "../api/chat.api";
import { mapConversationType } from "../utils/Chattypemapper";
import { initializeSocket as initSocket, getIO, disconnectSocket as closeSocket } from "../config/socketConfig";

// ⚠️ TEMPORARY: Hardcoded project ID fallback
// TODO: Remove this once conversation.projectId is reliably available from backend
const DEFAULT_PROJECT_ID = "697c899668977a7ca2b27462";

const useChatStore = create(
  devtools(
    (set, get) => ({
      // State
      conversations: [],
      messagesByConversation: {},
      selectedChat: null,
      currentUserId: null,
      isLoadingConversations: false,
      isLoadingMessages: false,
      isSendingMessage: false,
      socket: null,
      socketInitialized: false,

      // Initialize socket connection
      initializeSocket: (userId) => {
        try {
          // Check if already initialized
          if (get().socketInitialized && get().socket?.connected) {
            console.log("♻️ Socket already initialized and connected");
            return get().socket;
          }

          const existingSocket = get().socket;
          if (existingSocket) {
            existingSocket.disconnect();
          }

          console.log("🔌 Initializing new socket for user:", userId);
          const socket = initSocket(userId);
          
          if (!socket) {
            console.error("❌ Failed to initialize socket");
            return null;
          }
        
          socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
            set({ socketInitialized: true });
          });

          socket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
            set({ socketInitialized: false });
          });

          // Listen for new messages
          socket.on("message:new", ({ conversationId, message }) => {
            console.log("📨 New message received:", { conversationId, message });
            get().addMessageToConversation(conversationId, message);
            get().updateConversationLastMessage(conversationId, message);
          });

          // Listen for message edits
          socket.on("message:edited", ({ messageId, text, editedAt }) => {
            console.log("✏️ Message edited:", { messageId, text });
            get().updateMessageInConversation(messageId, { 
              content: text, 
              editedAt, 
              edited: true 
            });
          });

          // Listen for message deletions
          socket.on("message:deleted", ({ messageId }) => {
            console.log("🗑️ Message deleted:", messageId);
            get().markMessageAsDeleted(messageId);
          });

          // Listen for reactions
          socket.on("message:reaction", ({ messageId, userId, emoji }) => {
            console.log("😊 Reaction added:", { messageId, emoji });
            get().updateMessageReaction(messageId, userId, emoji);
          });

          // Listen for read receipts
          socket.on("conversation:read", ({ conversationId, userId }) => {
            console.log("👁️ Conversation read:", { conversationId, userId });
            get().markConversationMessagesAsRead(conversationId, userId);
          });

          // Listen for message pins
          socket.on("message:pinned", ({ messageId }) => {
            console.log("📌 Message pinned:", messageId);
          });

          set({ socket, socketInitialized: true });
          return socket;
        } catch (error) {
          console.error("❌ Error initializing socket:", error);
          set({ socketInitialized: false });
          return null;
        }
      },

      // Cleanup socket connection
      disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
          closeSocket();
          set({ socket: null, socketInitialized: false });
        }
      },

      // Join conversation room
      joinConversation: (conversationId) => {
        const socket = get().socket;
        if (socket?.connected) {
          socket.emit("join:conversation", conversationId);
          console.log("🚪 Joined conversation:", conversationId);
        } else {
          console.warn("⚠️ Cannot join conversation - socket not connected");
        }
      },

      // Leave conversation room
      leaveConversation: (conversationId) => {
        const socket = get().socket;
        if (socket?.connected) {
          socket.emit("leave:conversation", conversationId);
          console.log("🚪 Left conversation:", conversationId);
        }
      },

      // Set selected chat
      setSelectedChat: (chat) => {
        console.log("📌 Setting selected chat:", chat);
        
        // Leave previous conversation
        const prevChat = get().selectedChat;
        if (prevChat?.id) {
          get().leaveConversation(prevChat.id);
        }
        
        // Join new conversation
        if (chat?.id) {
          get().joinConversation(chat.id);
        }
        
        set({ selectedChat: chat });
      },

      // Set current user ID and initialize socket
      setCurrentUserId: (userId) => {
        console.log("👤 Setting current user ID:", userId);
        set({ currentUserId: userId });
        
        // Initialize socket IMMEDIATELY with user ID
        get().initializeSocket(userId);
      },

      // Load conversations
      loadConversations: async (projectId, type) => {
        console.log("🔄 Loading conversations:", { projectId, type });
        
        if (!projectId) {
          console.error("❌ No projectId provided");
          return;
        }

        const currentUserId = get().currentUserId;
        if (!currentUserId) {
          console.error("❌ No currentUserId set! Set user ID first.");
          return;
        }

        set({ isLoadingConversations: true });
        
        try {
          // Fetch conversations from API
          const conversations = await chatApi.getConversations(projectId);
          console.log("✅ Raw conversations from API:", conversations);

          // Transform conversations
          const transformedConversations = conversations
            .map((conv) => {
              console.log(`📋 Processing conversation ${conv._id}:`, {
                type: conv.type,
                department: conv.department,
                membersCount: conv.members?.length,
                projectId: conv.projectId
              });
              
              const frontendType = mapConversationType(conv.type);
              console.log(`  Type mapping: ${conv.type} → ${frontendType}`);
              
              const unreadCount = conv.unreadCount || 0;

              // For DIRECT messages, find the other user
              let otherUser = null;
              if (conv.type === "DIRECT" && conv.members) {
                otherUser = conv.members.find(
                  (m) => m.userId?._id?.toString() !== currentUserId.toString()
                );
                console.log("  👥 Other user in DM:", otherUser?.userId?.name);
              }

              // Check if user can send messages
              const currentMember = conv.members?.find(
                (m) => m.userId?._id?.toString() === currentUserId.toString()
              );
              const canSendMessage = currentMember?.canSendMessage !== false;

              // Build conversation object
              const conversation = {
                id: conv._id,
                type: frontendType,
                
                // ⚠️ IMPORTANT: Store projectId from backend for later use
                projectId: conv.projectId,
                
                // Name based on type
                name: 
                  conv.type === "PROJECT_ALL" 
                    ? "All Departments" 
                    : conv.type === "DEPARTMENT"
                      ? conv.department?.name || "Department"
                      : otherUser?.userId?.name || "Unknown User",
                
                // Department-specific
                department: conv.department?._id,
                departmentName: conv.department?.name,
                
                // Direct message-specific
                userId: otherUser?.userId?._id,
                avatar: otherUser?.userId?.name?.charAt(0)?.toUpperCase() || 
                        conv.department?.name?.charAt(0)?.toUpperCase() || "U",
                role: otherUser?.userId?.role || "Member",
                status: "online",
                
                // Common fields
                members: conv.members?.length || 0,
                online: 0,
                unread: unreadCount,
                mentions: 0,
                lastMessage: conv.lastMessage?.preview || "",
                timestamp: conv.lastMessage?.createdAt 
                  ? new Date(conv.lastMessage.createdAt).getTime()
                  : Date.now(),
                isPinned: conv.pinnedFor?.some(
                  (id) => id.toString() === currentUserId.toString()
                ) || false,
                isMuted: false,
                isFavorite: false,
                canSendMessage,
                
                // Raw backend data
                _raw: conv,
              };

              console.log(`  ✅ Transformed to:`, conversation.name, conversation.type);
              return conversation;
            });

          console.log(`✅ Total transformed: ${transformedConversations.length} conversations`);
          set({ conversations: transformedConversations, isLoadingConversations: false });
        } catch (error) {
          console.error("❌ Failed to load conversations:", error);
          console.error("Error details:", error.response?.data || error.message);
          set({ isLoadingConversations: false, conversations: [] });
        }
      },

      // Load messages for a conversation
      loadMessages: async (conversationId, loadMore = false) => {
        console.log("📨 Loading messages:", { conversationId, loadMore });
        
        if (!conversationId) {
          console.error("❌ No conversationId provided");
          return;
        }

        set({ isLoadingMessages: true });
        
        try {
          const existing = get().messagesByConversation[conversationId] || {
            messages: [],
            hasMore: true,
            cursor: null,
          };

          const cursor = loadMore ? existing.cursor : null;
          console.log("📡 Fetching messages with cursor:", cursor);
          
          const result = await chatApi.getMessages(conversationId, 20, cursor);
          console.log("✅ Raw messages from API:", result);

          const currentUserId = get().currentUserId;

          // Transform backend messages to frontend format
          const transformedMessages = result.messages.map((msg) => {
            const isOwn = msg.senderId?._id?.toString() === currentUserId?.toString();

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
              url: msg.content?.files?.[0]?.url,
              fileName: msg.content?.files?.[0]?.name,
              fileSize: msg.content?.files?.[0]?.size
                ? `${(msg.content.files[0].size / 1024).toFixed(2)} KB`
                : null,
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
              replyTo: msg.replyTo?.messageId
                ? {
                    id: msg.replyTo.messageId,
                    messageId: msg.replyTo.messageId,
                    sender: msg.replyTo.senderId?.name || "Unknown",
                    content: msg.replyTo.preview || "",
                    preview: msg.replyTo.preview || "",
                  }
                : null,
              _raw: msg,
            };
          });

          const updatedMessages = loadMore
            ? [...existing.messages, ...transformedMessages]
            : transformedMessages;

          console.log("✅ Final transformed messages:", updatedMessages.length);

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
          console.error("Error details:", error.response?.data);
          set({ isLoadingMessages: false });
        }
      },

      // ✅ FIXED: Send message with complete replyTo object
      sendMessage: async (conversationId, projectIdParam, messageData) => {
        console.log("📤 Store: Sending message:", { conversationId, projectIdParam, messageData });
        
        const currentUserId = get().currentUserId;
        
        if (!currentUserId) {
          console.error("❌ No currentUserId set! Cannot send message.");
          throw new Error("User not authenticated");
        }

        // ⚠️ Get projectId from conversation or use fallback
        const selectedChat = get().selectedChat;
        const projectId = projectIdParam || selectedChat?.projectId || DEFAULT_PROJECT_ID;

        if (!projectId) {
          console.error("❌ No project ID available");
          throw new Error("Project ID is required to send messages");
        }

        console.log("✅ Using projectId:", projectId, {
          fromParam: !!projectIdParam,
          fromConversation: !!selectedChat?.projectId,
          fromFallback: projectId === DEFAULT_PROJECT_ID
        });

        const tempId = `temp-${Date.now()}`;
        const optimisticMessage = {
          id: tempId,
          sender: "You",
          avatar: "YO",
          time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
          timestamp: Date.now(),
          content: messageData.text || "",
          type: messageData.type?.toLowerCase() || "text",
          isOwn: true,
          state: "sending",
          replyTo: messageData.replyTo ? {
            id: messageData.replyTo.messageId,
            messageId: messageData.replyTo.messageId,
            sender: "User", // Placeholder
            content: messageData.replyTo.preview,
            preview: messageData.replyTo.preview,
          } : null,
        };

        // Get existing messages or create empty state
        const existing = get().messagesByConversation[conversationId] || {
          messages: [],
          hasMore: false,
          cursor: null,
        };

        // Optimistic update - add message immediately
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
          // ✅ Build the request payload matching backend validation
          const payload = {
            projectId, // ✅ Always include projectId
            type: (messageData.type || "TEXT").toUpperCase(),
            text: messageData.text,
          };
          
          // ✅ Only add replyTo if it exists - send complete object
          if (messageData.replyTo) {
            payload.replyTo = {
              messageId: messageData.replyTo.messageId,
              senderId: messageData.replyTo.senderId,
              preview: messageData.replyTo.preview,
              type: messageData.replyTo.type,
            };
            console.log("✅ Including replyTo in payload:", payload.replyTo);
          }

          // ✅ Add forwardedFrom if exists
          if (messageData.forwardedFrom) {
            payload.forwardedFrom = messageData.forwardedFrom;
          }

          console.log("📡 Calling API with payload:", payload);
          
          const sentMessage = await chatApi.sendMessage(conversationId, payload);

          console.log("✅ Message sent successfully:", sentMessage);

          // Replace optimistic message with real one
          const updated = get().messagesByConversation[conversationId];
          const messages = updated.messages.map(msg => {
            if (msg.id === tempId) {
              return {
                id: sentMessage._id,
                sender: "You",
                avatar: "YO",
                time: new Date(sentMessage.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }),
                timestamp: new Date(sentMessage.createdAt).getTime(),
                content: sentMessage.content?.text || "",
                type: sentMessage.type?.toLowerCase(),
                isOwn: true,
                state: "sent",
                replyTo: sentMessage.replyTo?.messageId ? {
                  id: sentMessage.replyTo.messageId,
                  messageId: sentMessage.replyTo.messageId,
                  sender: sentMessage.replyTo.senderId?.name || "Unknown",
                  content: sentMessage.replyTo.preview || "",
                  preview: sentMessage.replyTo.preview || "",
                } : null,
                _raw: sentMessage,
              };
            }
            return msg;
          });

          set({
            messagesByConversation: {
              ...get().messagesByConversation,
              [conversationId]: {
                ...updated,
                messages,
              },
            },
            isSendingMessage: false,
          });

          return sentMessage;
        } catch (error) {
          console.error("❌ Failed to send message:", error);
          console.error("Error details:", error.response?.data);
          
          // Mark optimistic message as failed
          const updated = get().messagesByConversation[conversationId];
          const messages = updated.messages.map(msg => {
            if (msg.id === tempId) {
              return { ...msg, state: "failed" };
            }
            return msg;
          });

          set({
            messagesByConversation: {
              ...get().messagesByConversation,
              [conversationId]: {
                ...updated,
                messages,
              },
            },
            isSendingMessage: false,
          });

          throw error;
        }
      },

      // Add message to conversation (from socket)
      addMessageToConversation: (conversationId, message) => {
        const currentUserId = get().currentUserId;
        const existing = get().messagesByConversation[conversationId];
        
        if (!existing) return;

        // Check if message already exists (prevent duplicates)
        const messageExists = existing.messages.some(m => m.id === message._id);
        if (messageExists) {
          console.log("⚠️ Message already exists, skipping:", message._id);
          return;
        }

        const transformedMessage = {
          id: message._id,
          sender: message.senderId?.name || "Unknown",
          avatar: message.senderId?.name?.charAt(0)?.toUpperCase() || "U",
          time: new Date(message.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
          timestamp: new Date(message.createdAt).getTime(),
          content: message.content?.text || "",
          type: message.type?.toLowerCase(),
          isOwn: message.senderId?._id === currentUserId,
          state: "delivered",
          replyTo: message.replyTo?.messageId ? {
            id: message.replyTo.messageId,
            messageId: message.replyTo.messageId,
            sender: message.replyTo.senderId?.name || "Unknown",
            content: message.replyTo.preview || "",
            preview: message.replyTo.preview || "",
          } : null,
          _raw: message,
        };

        set({
          messagesByConversation: {
            ...get().messagesByConversation,
            [conversationId]: {
              ...existing,
              messages: [...existing.messages, transformedMessage],
            },
          },
        });
      },

      // Update conversation last message
      updateConversationLastMessage: (conversationId, message) => {
        const conversations = get().conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: message.content?.text || "",
              timestamp: new Date(message.createdAt).getTime(),
              unread: conv.unread + (message.senderId?._id !== get().currentUserId ? 1 : 0),
            };
          }
          return conv;
        });

        set({ conversations });
      },

      // Update message in conversation
      updateMessageInConversation: (messageId, updates) => {
        const messagesByConversation = { ...get().messagesByConversation };
        
        Object.keys(messagesByConversation).forEach(convId => {
          const messages = messagesByConversation[convId].messages.map(msg => {
            if (msg.id === messageId) {
              return { ...msg, ...updates };
            }
            return msg;
          });
          
          messagesByConversation[convId] = {
            ...messagesByConversation[convId],
            messages,
          };
        });

        set({ messagesByConversation });
      },

      // Mark message as deleted
      markMessageAsDeleted: (messageId) => {
        get().updateMessageInConversation(messageId, { deleted: true });
      },

      // Update message reaction
      updateMessageReaction: (messageId, userId, emoji) => {
        const selectedChat = get().selectedChat;
        if (selectedChat?.id) {
          get().loadMessages(selectedChat.id);
        }
      },

      // Mark conversation messages as read
      markConversationMessagesAsRead: (conversationId, userId) => {
        const existing = get().messagesByConversation[conversationId];
        if (!existing) return;

        const messages = existing.messages.map(msg => ({
          ...msg,
          state: msg.isOwn ? "seen" : msg.state,
          readBy: msg.isOwn ? (msg.readBy || 0) + 1 : msg.readBy,
        }));

        set({
          messagesByConversation: {
            ...get().messagesByConversation,
            [conversationId]: {
              ...existing,
              messages,
            },
          },
        });
      },

      // Mark conversation as read
      markAsRead: async (conversationId) => {
        try {
          await chatApi.markAsRead(conversationId);

          // Update local state
          const conversations = get().conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, unread: 0 } : conv
          );

          set({ conversations });
        } catch (error) {
          console.error("❌ Failed to mark as read:", error);
        }
      },
    }),
    { name: "ChatStore" }
  )
);

export default useChatStore;