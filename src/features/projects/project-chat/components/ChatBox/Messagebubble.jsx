// src/features/chat/components/ChatBox/Messagebubble.jsx
// ✅ PRODUCTION: Individual message bubble with all features

import React, { useState } from "react";
import {
  Reply,
  Edit3,
  Trash2,
  Copy,
  Forward,
  Star,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Download,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  File,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import EmojiPicker from "emoji-picker-react";
import DeleteMessageDialog from "../../Dialogs/DeleteMessageDialog";
import ForwardMessageDialog from "../../Dialogs/ForwardMessageDialog";
import ImagePreviewDialog from "../../Dialogs/ImagePreviewDialog";
import chatApi from "../../api/chat.api";
import useChatStore from "../../store/chat.store";

// Helper to get file icon
const getFileIcon = (type) => {
  if (type === "image") return ImageIcon;
  if (type === "video") return VideoIcon;
  return FileText;
};

// Helper to check if can edit/delete
const canEditMessage = (message) => {
  if (!message.isOwn) return false;
  const fifteenMinutes = 15 * 60 * 1000;
  return Date.now() - message.timestamp < fifteenMinutes;
};

export default function MessageBubble({
  message,
  isGroupStart,
  isGroupEnd,
  isSelected,
  onSelect,
  hoveredMessageId,
  setHoveredMessageId,
  showReactionPicker,
  setShowReactionPicker,
  onScrollToReply,
  searchQuery,
  selectedChatId,
  onReply,
  onEdit,
}) {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const { loadMessages } = useChatStore();

  const isHovered = hoveredMessageId === message.id;
  const canEdit = canEditMessage(message);
  const canDelete = message.isOwn;

  // Message action handlers
  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setShowActions(false);
    }
  };

  const handleReply = () => {
    const senderId = message._raw?.senderId?._id || message._raw?.senderId;
    
    if (!senderId) {
      console.error("❌ Cannot reply: senderId missing");
      return;
    }

    onReply({
      messageId: message.id,
      senderId: senderId,
      preview: (message.content || "").substring(0, 200),
      type: (message.type || "text").toUpperCase(),
      senderName: message.sender || "Unknown",
    });
    setShowActions(false);
  };

  const handleEdit = () => {
    onEdit(message);
    setShowActions(false);
  };

  const handleForward = () => {
    setShowForwardDialog(true);
    setShowActions(false);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
    setShowActions(false);
  };

  const handleToggleFavorite = async () => {
    try {
      const isFavorited = message._raw?.starredBy?.includes(
        useChatStore.getState().currentUserId
      );
      await chatApi.toggleFavorite(selectedChatId, message.id, !isFavorited);
      await loadMessages(selectedChatId);
      setShowActions(false);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleReaction = async (emojiData) => {
    try {
      await chatApi.toggleReaction(selectedChatId, message.id, emojiData.emoji);
      await loadMessages(selectedChatId);
      setShowReactionPicker(null);
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  // State indicator icon
  const StateIcon = () => {
    if (message.state === "sending") {
      return <Clock className="w-3.5 h-3.5 text-muted-foreground animate-pulse" />;
    }
    if (message.state === "sent") {
      return <Check className="w-3.5 h-3.5 text-muted-foreground" />;
    }
    if (message.state === "delivered") {
      return <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />;
    }
    if (message.state === "seen") {
      return <CheckCheck className="w-3.5 h-3.5 text-primary" />;
    }
    if (message.state === "failed") {
      return <span className="text-xs text-red-500">Failed</span>;
    }
    return null;
  };

  return (
    <>
      <div
        id={`message-${message.id}`}
        className={cn(
          "group relative px-2 py-0.5 transition-colors rounded-lg",
          isSelected && "bg-primary/5",
          isHovered && "bg-muted/30"
        )}
        onMouseEnter={() => setHoveredMessageId(message.id)}
        onMouseLeave={() => setHoveredMessageId(null)}
      >
        <div
          className={cn(
            "flex gap-2.5 items-end",
            message.isOwn && "flex-row-reverse"
          )}
        >
          {/* Avatar (only show at group start for others) */}
          {!message.isOwn && isGroupStart && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
              {message.avatar}
            </div>
          )}
          {!message.isOwn && !isGroupStart && <div className="w-8 flex-shrink-0" />}

          {/* Message content */}
          <div
            className={cn(
              "flex flex-col gap-1 max-w-[70%]",
              message.isOwn && "items-end"
            )}
          >
            {/* Sender name (only at group start) */}
            {!message.isOwn && isGroupStart && (
              <div className="text-xs font-semibold text-muted-foreground ml-2">
                {message.sender}
              </div>
            )}

            {/* Reply preview */}
            {message.replyTo && (
              <div
                onClick={() => onScrollToReply(message.replyTo.messageId)}
                className={cn(
                  "text-xs p-2 rounded-lg border-l-2 cursor-pointer hover:bg-muted/30 transition-colors",
                  message.isOwn
                    ? "bg-primary/5 border-primary-foreground/30"
                    : "bg-muted/50 border-primary/50"
                )}
              >
                <div className="font-semibold text-primary mb-0.5">
                  {message.replyTo.sender}
                </div>
                <div className="text-muted-foreground line-clamp-2">
                  {message.replyTo.content}
                </div>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={cn(
                "relative px-3 py-2 rounded-2xl shadow-sm",
                message.isOwn
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted rounded-bl-sm",
                isGroupEnd && message.isOwn && "rounded-br-2xl",
                isGroupEnd && !message.isOwn && "rounded-bl-2xl",
                message.deleted && "opacity-60 italic"
              )}
            >
              {/* Deleted message */}
              {message.deleted && (
                <div className="text-xs opacity-70">
                  This message was deleted
                </div>
              )}

              {/* Text content */}
              {!message.deleted && message.content && (
                <div className="text-sm break-words whitespace-pre-wrap">
                  {message.content}
                </div>
              )}

              {/* File attachments */}
              {!message.deleted && message.type !== "text" && message.url && (
                <div className="mt-2">
                  {/* Image */}
                  {message.type === "image" && (
                    <div
                      onClick={() => setShowImagePreview(true)}
                      className="cursor-pointer rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={message.url}
                        alt={message.fileName || "Image"}
                        className="max-w-xs max-h-64 rounded-lg"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23ddd' width='200' height='200'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage failed to load%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  )}

                  {/* Video */}
                  {message.type === "video" && (
                    <video
                      controls
                      className="max-w-xs max-h-64 rounded-lg"
                      src={message.url}
                    >
                      Your browser does not support video playback.
                    </video>
                  )}

                  {/* File */}
                  {(message.type === "file" || message.type === "audio") && (
                    <a
                      href={message.url}
                      download={message.fileName}
                      className="flex items-center gap-2 p-2 rounded-lg bg-background/10 hover:bg-background/20 transition-colors"
                    >
                      <File className="w-5 h-5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">
                          {message.fileName || "File"}
                        </div>
                        {message.fileSize && (
                          <div className="text-[10px] opacity-70">
                            {message.fileSize}
                          </div>
                        )}
                      </div>
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}

              {/* Reactions */}
              {message.reactions && Object.keys(message.reactions).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {Object.entries(message.reactions).map(([emoji, count]) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction({ emoji })}
                      className="px-2 py-0.5 rounded-full bg-background/20 hover:bg-background/30 transition-colors text-xs flex items-center gap-1"
                    >
                      <span>{emoji}</span>
                      <span className="font-medium">{count}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Time & status */}
              <div
                className={cn(
                  "flex items-center gap-1.5 mt-1 text-[10px]",
                  message.isOwn ? "justify-end" : "justify-start",
                  message.isOwn
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                <span>{message.time}</span>
                {message.edited && <span>(edited)</span>}
                {message.isOwn && <StateIcon />}
              </div>
            </div>
          </div>

          {/* Quick actions (show on hover) */}
          {isHovered && !message.deleted && (
            <div
              className={cn(
                "absolute -top-3 flex items-center gap-1 bg-card border rounded-lg shadow-lg p-1 z-10 animate-in fade-in slide-in-from-top-1 duration-200",
                message.isOwn ? "right-12" : "left-12"
              )}
            >
              <button
                onClick={handleReply}
                className="p-1.5 hover:bg-muted rounded transition-colors"
                title="Reply"
              >
                <Reply className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() =>
                  setShowReactionPicker(
                    showReactionPicker === message.id ? null : message.id
                  )
                }
                className="p-1.5 hover:bg-muted rounded transition-colors"
                title="React"
              >
                😊
              </button>

              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 hover:bg-muted rounded transition-colors"
                title="More"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Actions dropdown */}
          {showActions && isHovered && (
            <div
              className={cn(
                "absolute top-6 bg-card border rounded-lg shadow-xl py-1 min-w-[160px] z-20 animate-in fade-in slide-in-from-top-2 duration-200",
                message.isOwn ? "right-12" : "left-12"
              )}
            >
              <button
                onClick={handleCopy}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>

              <button
                onClick={handleForward}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Forward className="w-4 h-4" />
                Forward
              </button>

              <button
                onClick={handleToggleFavorite}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                {message._raw?.starredBy?.includes(
                  useChatStore.getState().currentUserId
                )
                  ? "Unfavorite"
                  : "Favorite"}
              </button>

              {canEdit && (
                <button
                  onClick={handleEdit}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              )}

              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          )}

          {/* Emoji picker */}
          {showReactionPicker === message.id && (
            <div
              className={cn(
                "absolute top-6 z-30",
                message.isOwn ? "right-12" : "left-12"
              )}
            >
              <EmojiPicker
                onEmojiClick={handleReaction}
                theme="auto"
                searchDisabled
                emojiStyle="native"
                width={300}
                height={350}
              />
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <DeleteMessageDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message={message}
        selectedChatId={selectedChatId}
        canDeleteForEveryone={canEdit}
      />

      <ForwardMessageDialog
        open={showForwardDialog}
        onOpenChange={setShowForwardDialog}
        message={message}
        selectedChatId={selectedChatId}
      />

      <ImagePreviewDialog
        open={showImagePreview}
        onOpenChange={setShowImagePreview}
        imageUrl={message.url}
      />
    </>
  );
}