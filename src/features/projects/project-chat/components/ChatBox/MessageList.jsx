import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import MessageBubble from "./messageBubble/Messagebubble";
import TypingIndicator from "./TypingIndicator";
import useChatStore from "../../store/chat.store";
import ChatLoaderSkeleton from "../skeltons/ChatLoaderSkeleton";
import { formatSystemMessage } from "../../utils/messageHelpers";
import useMessageNavigation from "../../hooks/useMessageNavigation";

export default function MessageList({
  messages,
  onReply,
  onEdit,
  onReaction,
  onToggleFavorite,
}) {
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [searchQuery] = useState("");
  const { selectedChat, selectedMessage, setSelectedMessage } = useChatStore();

  const { scrollToMessage } = useMessageNavigation();

  const canEditMessage = (message) => {
    if (!message.isOwn) return false;
    const EDIT_WINDOW = 15 * 60 * 1000;
    return Date.now() - message.timestamp < EDIT_WINDOW;
  };

  const canDeleteForEveryone = (message) => {
    if (!message.isOwn) return false;
    const EDIT_WINDOW = 60 * 60 * 1000;
    return Date.now() - message.timestamp < EDIT_WINDOW;
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
              key={msg.id + index}
              className="flex justify-center my-3"
              role="separator"
            >
              <div className="bg-muted/50 px-2 py-0.5 rounded-full text-[11px] text-muted-foreground font-medium">
                {msg.date}
              </div>
            </div>
          );
        }

        // System message
        if (msg.type === "system") {
          const text = formatSystemMessage(msg, selectedChat?.members, "full");

          return (
            <div
              key={msg.id + index}
              className="flex justify-center my-3"
              role="status"
            >
              <div className="bg-muted/30 px-3 py-1.5 rounded-lg text-xs text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5" />
                {text}
                <span className="text-[10px]">{msg.time}</span>
              </div>
            </div>
          );
        }

        // Regular message
        return (
          <MessageBubble
            key={msg.id + index}
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
