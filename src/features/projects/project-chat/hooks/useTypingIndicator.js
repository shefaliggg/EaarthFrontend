// src/features/chat/hooks/useTypingIndicator.js
// ✅ Hook for typing indicator with debounce

import { useRef, useCallback } from "react";
import useChatStore from "../store/chat.store";

export const useTypingIndicator = (conversationId) => {
  const typingTimeout = useRef(null);
  const socket = useChatStore((state) => state.socket);

  const emitTypingStart = useCallback(() => {
    if (!socket || !conversationId) return;

    socket.emit("typing:start", { conversationId });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing:stop", { conversationId });
    }, 1200);
  }, [socket, conversationId]);

  const emitTypingStop = useCallback(() => {
    if (!socket || !conversationId) return;
    
    clearTimeout(typingTimeout.current);
    socket.emit("typing:stop", { conversationId });
  }, [socket, conversationId]);

  return { emitTypingStart, emitTypingStop };
};