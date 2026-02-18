import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import MessageBubble from "./Messagebubble";
import TypingIndicator from "./TypingIndicator";
import useChatStore from "../../store/chat.store";
import ChatLoaderSkeleton from "../skeltons/ChatLoaderSkeleton";

export default function MessageList({
  messages,
  messagesData,
  isLoadingMessages,
  onReply,
  onEdit,
  onReaction,
  onToggleFavorite,
}) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [searchQuery] = useState("");
  const { selectedChat } = useChatStore();

  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    setSelectedMessage(messageId);
    setTimeout(() => setSelectedMessage(null), 2000);
  };

  const canEditMessage = (message) => {
    if (!message.isOwn) return false;
    const fifteenMinutes = 15 * 60 * 1000;
    return Date.now() - message.timestamp < fifteenMinutes;
  };

  const canDeleteForEveryone = (message) => {
    if (!message.isOwn) return false;
    const fifteenMinutes = 15 * 60 * 1000;
    return Date.now() - message.timestamp < fifteenMinutes;
  };

  return (
    <>
      {/* Messages */}
      {messages.map((msg, index) => {
        const prevMsg = messages[index - 1];
        const nextMsg = messages[index + 1];
        const isGroupStart =
          !prevMsg ||
          prevMsg.senderId !== msg.senderId ||
          prevMsg.type === "date-separator" ||
          prevMsg.type === "system";
        const isGroupEnd =
          !nextMsg ||
          nextMsg.senderId !== msg.senderId ||
          nextMsg.type === "date-separator" ||
          nextMsg.type === "system";

        // Date separator
        if (msg.type === "date-separator") {
          return (
            <div
              key={msg.id}
              className="flex justify-center my-4"
              role="separator"
            >
              <div className="bg-muted/50 px-3 py-1.5 rounded-full text-xs text-muted-foreground font-medium">
                {msg.date}
              </div>
            </div>
          );
        }

        // System message
        if (msg.type === "system") {
          return (
            <div
              key={msg.id}
              className="flex justify-center my-3"
              role="status"
            >
              <div className="bg-muted/30 px-3 py-1.5 rounded-lg text-xs text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5" />
                {msg.content}
                <span className="text-[10px]">{msg.time}</span>
              </div>
            </div>
          );
        }

        // Regular message
        return (
          <MessageBubble
            key={msg.clientTempId || msg.id}
            message={msg}
            isGroupStart={isGroupStart}
            isGroupEnd={isGroupEnd}
            isSelected={selectedMessage === msg.id}
            onSelect={() => setSelectedMessage(msg.id)}
            hoveredMessageId={hoveredMessageId}
            setHoveredMessageId={setHoveredMessageId}
            showReactionPicker={showReactionPicker}
            setShowReactionPicker={setShowReactionPicker}
            onScrollToReply={scrollToMessage}
            searchQuery={searchQuery}
            selectedChatId={selectedChat?.id}
            onReply={onReply}
            onEdit={onEdit}
            onReaction={onReaction}
            onToggleFavorite={onToggleFavorite}
            canEdit={canEditMessage(msg)}
            canDeleteForEveryone={canDeleteForEveryone(msg)}
          />
        );
      })}
    </>
  );
}
