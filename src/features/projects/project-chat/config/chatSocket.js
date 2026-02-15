// // src/features/projects/project-chat/config/chatSocket.js
// // ✅ Chat-specific Socket.IO client configuration

// import { io } from "socket.io-client";

// let chatSocket = null;

// /**
//  * Get or create the chat socket instance
//  * @returns {Socket} Socket.IO client instance
//  */
// export const getChatSocket = () => {
//   if (!chatSocket) {
//     const baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    
//     chatSocket = io(baseURL, {
//       autoConnect: false,
//       transports: ["websocket", "polling"],
//       reconnection: true,
//       reconnectionDelay: 1000,
//       reconnectionAttempts: 5,
//       withCredentials: true,
//     });

//     // Connection event listeners
//     chatSocket.on("connect", () => {
//       console.log("✅ Chat Socket connected:", chatSocket.id);
//     });

//     chatSocket.on("disconnect", (reason) => {
//       console.log("❌ Chat Socket disconnected:", reason);
//     });

//     chatSocket.on("connect_error", (error) => {
//       console.error("❌ Chat Socket connection error:", error);
//     });
//   }

//   return chatSocket;
// };

// /**
//  * Initialize chat socket with user authentication
//  * @param {string} userId - Current user ID
//  */
// export const initChatSocket = (userId) => {
//   const socket = getChatSocket();

//   if (!userId) {
//     console.warn("⚠️ Cannot init chat socket without userId");
//     return;
//   }

//   // Connect if not already connected
//   if (!socket.connected) {
//     socket.auth = { userId };
//     socket.connect();
//     socket.emit("user:online", userId);
//   }

//   return socket;
// };

// /**
//  * Disconnect chat socket
//  */
// export const disconnectChatSocket = () => {
//   if (chatSocket?.connected) {
//     chatSocket.disconnect();
//     console.log("👋 Chat Socket disconnected");
//   }
// };

// /**
//  * Join a conversation room
//  * @param {string} conversationId - Conversation ID to join
//  */
// export const joinConversation = (conversationId) => {
//   const socket = getChatSocket();
//   if (socket?.connected) {
//     socket.emit("conversation:join", conversationId);
//     console.log("📥 Joined conversation:", conversationId);
//   }
// };

// /**
//  * Leave a conversation room
//  * @param {string} conversationId - Conversation ID to leave
//  */
// export const leaveConversation = (conversationId) => {
//   const socket = getChatSocket();
//   if (socket?.connected) {
//     socket.emit("conversation:leave", conversationId);
//     console.log("📤 Left conversation:", conversationId);
//   }
// };

// /**
//  * Emit typing start event
//  * @param {string} conversationId - Conversation ID
//  */
// export const emitTypingStart = (conversationId) => {
//   const socket = getChatSocket();
//   if (socket?.connected) {
//     socket.emit("typing:start", { conversationId });
//   }
// };

// /**
//  * Emit typing stop event
//  * @param {string} conversationId - Conversation ID
//  */
// export const emitTypingStop = (conversationId) => {
//   const socket = getChatSocket();
//   if (socket?.connected) {
//     socket.emit("typing:stop", { conversationId });
//   }
// };

// export default {
//   getChatSocket,
//   initChatSocket,
//   disconnectChatSocket,
//   joinConversation,
//   leaveConversation,
//   emitTypingStart,
//   emitTypingStop,
// };