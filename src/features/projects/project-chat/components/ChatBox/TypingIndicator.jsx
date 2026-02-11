// src/features/chat/components/ChatBox/TypingIndicator.jsx
// ✅ PRODUCTION-READY: Shows who is typing in real-time

import React from "react";
import useChatStore from "../../store/chat.store";

export default function TypingIndicator({ conversationId }) {
  const typingUsers = useChatStore((state) => 
    state.typingUsers[conversationId] || []
  );
  
  const currentUserId = useChatStore((state) => state.currentUserId);

  // Filter out current user
  const othersTyping = typingUsers.filter((userId) => userId !== currentUserId);

  if (othersTyping.length === 0) return null;

  const displayText = othersTyping.length === 1
    ? "Someone is typing..."
    : `${othersTyping.length} people are typing...`;

  return (
    <div className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="font-medium">{displayText}</span>
    </div>
  );
}