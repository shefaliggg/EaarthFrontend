import { io } from "socket.io-client";
import { currentEnv } from "./enviroment";

export const socketBaseURL =
  currentEnv === "development"
    ? import.meta.env.VITE_SOCKET_IO_API_URL_DEV
    : import.meta.env.VITE_SOCKET_IO_API_URL_PROD;

const baseConfig = {
  transports: ["websocket", "polling"],

  withCredentials: true,

  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,

  timeout: 20000,
};

let publicSocket = null;
let chatSocket = null;
let notificationSocket = null;

// ===== PUBLIC SOCKET =====
export const initPublicSocket = () => {
  if (publicSocket?.connected) return publicSocket;

  publicSocket = io(`${socketBaseURL}/public`, baseConfig);

  publicSocket.on("connect", () => {
    console.log("✅ Public socket connected:", publicSocket.id);
  });

  publicSocket.on("disconnect", (reason) => {
    console.log("🔌 Public socket disconnected:", reason);
  });

  publicSocket.on("reconnect_attempt", (attempt) => {
    console.log("🔄 Public socket reconnect attempt:", attempt);
  });

  publicSocket.on("reconnect_failed", () => {
    console.error("💀 Public socket reconnect failed");
  });

  publicSocket.on("reconnect_attempt", (attempt) => {
    console.log("🔄 Public socket reconnect attempt:", attempt);
  });

  publicSocket.on("reconnect_failed", () => {
    console.error("💀 Public socket reconnect failed");
  });
  return publicSocket;
};

// ===== CHAT SOCKET =====
export const initChatSocket = (userId) => {
  if (chatSocket?.connected) return chatSocket;

  chatSocket = io(`${socketBaseURL}/chat`, {
    ...baseConfig,
    auth: { userId },
  });

  chatSocket.on("connect", () => {
    console.log("✅ Chat connected:", chatSocket.id);
  });

  chatSocket.on("disconnect", (reason) => {
    console.log("🔌 Chat disconnected:", reason);
  });

  chatSocket.on("reconnect_attempt", (attempt) => {
    console.log("🔄 Chat reconnect attempt:", attempt);
  });

  chatSocket.on("reconnect_failed", () => {
    console.error("💀 Chat reconnect failed");
  });

  return chatSocket;
};

// ===== NOTIFICATION SOCKET =====
export const initNotificationSocket = (userId) => {
  if (notificationSocket?.connected) return notificationSocket;

  notificationSocket = io(`${socketBaseURL}/notifications`, {
    ...baseConfig,
    auth: { userId },
  });

  notificationSocket.on("connect", () => {
    console.log("✅ Notification socket connected:", notificationSocket.id);
  });

  notificationSocket.on("disconnect", (reason) => {
    console.log("🔌 Notification socket disconnected:", reason);
  });

  notificationSocket.on("reconnect_attempt", (attempt) => {
    console.log("🔄 Notification socket reconnect attempt:", attempt);
  });

  notificationSocket.on("reconnect_failed", () => {
    console.error("💀 Notification socket reconnect failed");
  });

  return notificationSocket;
};

export const getChatSocket = () => chatSocket;
export const getNotificationSocket = () => notificationSocket;

export const disconnectAllSockets = () => {
  publicSocket?.disconnect();
  chatSocket?.disconnect();
  notificationSocket?.disconnect();

  publicSocket = null;
  chatSocket = null;
  notificationSocket = null;
};
