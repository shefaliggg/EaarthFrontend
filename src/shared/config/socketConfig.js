import { currentEnv } from "./enviroment";
import { io } from "socket.io-client";

export const baseSocketConfig = {
  transports: ["websocket"],
  path: "/socket.io/",
  withCredentials: true,
};

export const socketBaseURL =
  currentEnv === "development"
    ? import.meta.env.VITE_SOCKET_IO_API_URL_DEV
    : import.meta.env.VITE_SOCKET_IO_API_URL_PROD;

let socket = null;

export const initSocket = (userId) => {
  if (socket && socket.connected) return socket;

 socket = io(socketBaseURL, {
    auth: userId ? { userId } : {},   // anonymous allowed
    ...baseSocketConfig,
  });

socket.on("connect", () => {
    console.log(
      userId
        ? "🌐 Auth socket connected:"
        : "👻 Anonymous socket connected:",
      socket.id
    );
  });

  socket.on("disconnect", () => {
    console.log("🌙 socket disconnected");
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
