// src/features/chat/socket/socketConfig.js
// ✅ FIXED: Socket.IO configuration with correct backend URL

import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (userId) => {
  // If socket already exists and is connected, return it
  if (socket && socket.connected) {
    console.log("♻️ Socket already connected, reusing existing connection");
    return socket;
  }

  // If socket exists but disconnected, disconnect it first
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  // ✅ CRITICAL FIX: Use API base URL from environment (port 5000), NOT frontend URL (port 5173)
  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  
  console.log("🔌 Initializing new socket connection to:", baseURL);
  console.log("👤 User ID:", userId);
  
  socket = io(baseURL, {
    auth: {
      userId, // Send userId for authentication
    },
    transports: ["websocket", "polling"], // Try websocket first, fallback to polling
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 10000, // 10 second timeout
    withCredentials: true, // Important for CORS with credentials
  });

  socket.on("connect", () => {
    console.log("✅ Socket.IO connected:", socket.id);
    // Emit user online event
    socket.emit("user:online", userId);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket.IO disconnected:", reason);
  });

  socket.on("error", (error) => {
    console.error("❌ Socket.IO error:", error);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket.IO connection error:", error);
    console.log("💡 Trying to connect to:", baseURL);
    console.log("💡 Make sure backend is running on port 5000");
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("🔄 Socket.IO reconnected after", attemptNumber, "attempts");
  });

  socket.on("reconnect_error", (error) => {
    console.error("❌ Socket.IO reconnection error:", error);
  });

  socket.on("reconnect_failed", () => {
    console.error("❌ Socket.IO reconnection failed after all attempts");
  });

  return socket;
};

export const getIO = () => {
  if (!socket) {
    console.warn("⚠️ Socket not initialized yet. Call initializeSocket first.");
    return null;
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.log("👋 Socket.IO disconnected");
  }
};