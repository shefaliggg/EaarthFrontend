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
    socket.disconnect();
    socket = null;
  }

  // Get the base URL from environment or default to current origin
  const baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  
  console.log("🔌 Initializing new socket connection to:", baseURL);
  
  socket = io(baseURL, {
    auth: {
      token: localStorage.getItem("token"), // or however you store your auth token
      userId, // Send userId for authentication
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("✅ Socket.IO connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket.IO disconnected:", reason);
  });

  socket.on("error", (error) => {
    console.error("❌ Socket.IO error:", error);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket.IO connection error:", error);
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
    socket.disconnect();
    socket = null;
    console.log("👋 Socket.IO disconnected");
  }
};

// import { currentEnv } from "./enviroment";

// export const socketConfig = {
//   transports: ["websocket"],
//   path: "/socket.io/",
//   withCredentials: true,
// };

// export const socketBaseURL = currentEnv === "development"
//   ? import.meta.env.VITE_SOCKET_IO_API_URL_DEV
//   : import.meta.env.VITE_SOCKET_IO_API_URL_PROD;