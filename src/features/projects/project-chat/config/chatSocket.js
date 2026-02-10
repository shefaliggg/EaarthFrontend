import { io } from "socket.io-client";
import { store } from "../../../../app/store";
import { socketBaseURL, socketConfig } from "../../../../shared/config/socketConfig";

let chatSocket = null;

export const getChatSocket = () => {
  if (!chatSocket) {
    chatSocket = io(socketBaseURL, {
      ...socketConfig,
      autoConnect: false,
    });
  }
  return chatSocket;
};

let listenersAttached = false;

export const initChatSocket = (userId) => {
  const socket = getChatSocket();

  if (!socket.connected) {
    socket.connect();
    socket.emit("user:online", userId);
  }

  if (listenersAttached) return;
  listenersAttached = true;

  // ---- MESSAGE EVENTS ----
  chatSocket.on("message:new", ({ conversationId, message }) => {
    // store.dispatch(messageReceived({ conversationId, message }));
    console.log("New message received:", { conversationId, message });
  });

  chatSocket.on("message:edited", (payload) => {
    // store.dispatch(messageEdited(payload));
    console.log("Message edited:", payload);
  });

  chatSocket.on("message:deleted", (payload) => {
    // store.dispatch(messageDeleted(payload));
    console.log("Message deleted:", payload);
  });

  // ---- READ RECEIPTS ----
  chatSocket.on("conversation:read", (payload) => {
    // store.dispatch(conversationRead(payload));
    console.log("Conversation read:", payload);
  });

  // ---- TYPING ----
  chatSocket.on("typing:start", (payload) => {
    // store.dispatch(typingStarted(payload));
    console.log("Typing started:", payload);
  });

  chatSocket.on("typing:stop", (payload) => {
    // store.dispatch(typingStopped(payload));
    console.log("Typing stopped:", payload);
  });

  // ---- PRESENCE ----
  chatSocket.on("user:online", (userId) => {
    // store.dispatch(userOnline(userId));
    console.log("User online:", userId);
  });

  chatSocket.on("user:offline", (userId) => {
    // store.dispatch(userOffline(userId));
    console.log("User offline:", userId);
  });
};
