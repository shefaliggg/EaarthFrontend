// src/shared/config/socketConfig.js
// ✅ FIXED: Proper socket initialization with better error handling

import { io } from "socket.io-client";
import { currentEnv } from "./enviroment";

export const baseSocketConfig = {
  transports: ["websocket", "polling"],
  path: "/socket.io/",
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  timeout: 20000,
};

export const socketBaseURL =
  currentEnv === "development"
    ? import.meta.env.VITE_SOCKET_IO_API_URL_DEV
    : import.meta.env.VITE_SOCKET_IO_API_URL_PROD;

let socket = null;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const initSocket = (userId) => {
  // If socket exists and is connected, return it
  if (socket?.connected) {
    console.log("♻️ Reusing existing socket connection:", socket.id);
    return socket;
  }

  // If socket exists but disconnected, clean it up
  if (socket) {
    console.log("🧹 Cleaning up old socket instance");
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  console.log("🔌 Initializing new socket connection...", {
    url: socketBaseURL,
    userId: userId || "anonymous",
  });

  try {
    socket = io(socketBaseURL, {
      auth: userId ? { userId } : {},
      ...baseSocketConfig,
    });

    socket.on("connect", () => {
      connectionAttempts = 0;
      console.log("✅ Socket connected:", {
        id: socket.id,
        userId: userId || "anonymous",
        transport: socket.io.engine.transport.name,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      
      if (reason === "io server disconnect") {
        // Server initiated disconnect, reconnect manually
        socket.connect();
      }
    });

    socket.on("connect_error", (error) => {
      connectionAttempts++;
      console.error("❌ Socket connection error:", {
        attempt: connectionAttempts,
        error: error.message,
      });

      if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error("💀 Max reconnection attempts reached");
        socket.disconnect();
      }
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Reconnection attempt:", attemptNumber);
    });

    socket.on("reconnect_failed", () => {
      console.error("💀 Socket reconnection failed");
    });

    return socket;
  } catch (error) {
    console.error("❌ Failed to initialize socket:", error);
    return null;
  }
};

export const getSocket = () => {
  if (!socket) {
    console.warn("⚠️ Socket not initialized - call initSocket() first");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log("👋 Disconnecting socket");
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    connectionAttempts = 0;
  }
};

export const isSocketConnected = () => {
  return socket?.connected || false;
};