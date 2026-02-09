import { currentEnv } from "./enviroment";

export const socketConfig = {
  transports: ["websocket"],
  path: "/socket.io/",
  withCredentials: true,
};

export const socketBaseURL = currentEnv === "development"
  ? import.meta.env.VITE_SOCKET_IO_API_URL_DEV
  : import.meta.env.VITE_SOCKET_IO_API_URL_PROD;
