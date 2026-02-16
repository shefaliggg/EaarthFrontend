import React, { useState, useRef, useEffect } from "react";
import {
  Reply,
  Edit3,
  Trash2,
  Copy,
  Forward,
  Star,
  Smile,
  Check,
  CheckCheck,
  Clock,
  X,
  Download,
  Play,
  Pause,
  Volume2,
  FileText,
  CornerDownRight,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { AutoHeight } from "@/shared/components/wrappers/AutoHeight";
import DeleteMessageDialog from "../../Dialogs/DeleteMessageDialog";
import ForwardMessageDialog from "../../Dialogs/ForwardMessageDialog";
import ImagePreviewDialog from "../../Dialogs/ImagePreviewDialog";
import useChatStore from "../../store/chat.store";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const getFileUrl = (fileKey) => {
  if (!fileKey) return null;

  if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
    return fileKey;
  }

  const S3_BASE_URL =
    import.meta.env.VITE_S3_BASE_URL || "https://your-bucket.s3.amazonaws.com";
  return `${S3_BASE_URL}/${fileKey}`;
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
  onReaction,
  onToggleFavorite,
  canEdit,
  canDeleteForEveryone,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const retryMessage = useChatStore((state) => state.retryMessage);
  const { selectedChat } = useChatStore();

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const showActions = hoveredMessageId === message.id;
  const isOwn = message.isOwn;
  const isFavorited = message._raw?.starredBy?.length > 0;
  const isForwarded = !!message._raw?.forwardedFrom?.conversationId;

  useEffect(() => {
    if (isPlaying && message.type === "voice") {
      const interval = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 100 / message.totalDuration;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (!isPlaying) {
      setPlayProgress(0);
    }
  }, [isPlaying, message.type, message.totalDuration]);

  const highlightText = (text) => {
    if (!searchQuery || !text) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  // ✅ Message action handlers
  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      alert("Message copied to clipboard!");
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleForward = () => {
    setShowForwardDialog(true);
  };

  const handleImageClick = (imageUrl) => {
    setPreviewImageUrl(imageUrl);
    setShowImagePreview(true);
  };

  if (message.deleted) {
    return (
      <div
        id={`message-${message.id}`}
        className={cn(
          "flex gap-3 group transition-all",
          isOwn ? "flex-row-reverse" : "flex-row",
          isGroupStart ? "mt-4" : "mt-1",
        )}
      >
        {!isOwn && <div className="w-8" />}
        <div
          className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}
        >
          <div className="bg-muted/50 px-3 py-2 rounded-xl italic text-sm text-muted-foreground flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            This message was deleted
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`message-${message.id}`}
      className={cn(
        "flex gap-3 group transition-all",
        isOwn ? "flex-row-reverse" : "flex-row",
        isGroupStart ? "mt-4" : "mt-1",
      )}
      role="article"
      aria-label={`Message from ${message.sender} at ${message.time}`}
    >
      {!isOwn && (
        <div className={cn("w-8", isGroupStart ? "" : "invisible")}>
          {isGroupStart && (
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted text-xs">
                {message.avatar}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <div
        onMouseEnter={() => setHoveredMessageId(message.id)}
        onMouseLeave={() => setHoveredMessageId(null)}
        className={cn("flex flex-col max-w-[60%]")}
      >
        {!isOwn && isGroupStart && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="font-semibold text-xs text-foreground">
              {message.sender}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {message.time}
            </span>
            {message.readBy && (
              <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                Read by {message.readBy}
              </Badge>
            )}
          </div>
        )}

        <AutoHeight className="w-full">
          <div className={cn("flex gap-3 w-fit", isOwn ? "flex-row-reverse ml-auto" : "")}>
            <div
              className={cn(
                "relative p-1 transition-all break-words max-w-full w-fit",
                isOwn ? "ml-auto" : "",
                isOwn
                  ? "bg-primary dark:bg-primary/40 text-background"
                  : "bg-muted",
                isOwn && "rounded-2xl rounded-tr-none",
                // isOwn && isGroupEnd && "",
                !isOwn && "rounded-2xl rounded-tl-none",
                // !isOwn && isGroupStart && "rounded-2xl ",
                isSelected && "ring-2 ring-primary/50 scale-[1.02]",
              )}
            >
              <div className="">
                {/* Forwarded indicator */}
                {isForwarded && (
                  <div
                    className={cn(
                      "flex items-center gap-1.5 pb-1 pr-2",
                      isOwn ? "border-primary-foreground/20" : "border-border",
                    )}
                  >
                    <CornerDownRight
                      className={cn(
                        "w-2 h-2",
                        isOwn
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[9px] italic font-medium",
                        isOwn
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground",
                      )}
                    >
                      Forwarded
                    </span>
                  </div>
                )}

                {/* Reply preview */}
                {message.replyTo && (
                  <div
                    onClick={() => onScrollToReply(message.replyTo.messageId)}
                    className={cn(
                      "mb-1 pl-2 pr-4 py-1 rounded-md border-l-2 cursor-pointer transition-colors max-w-full",
                      isOwn
                        ? "bg-purple-200 border-primary-foreground dark:border-primary-foreground/50 hover:bg-muted/80"
                        : "bg-background/60 border-primary hover:bg-background/80",
                    )}
                  >
                    <div className="text-[10px] font-semibold text-primary mb-0.5 truncate">
                      {message.replyTo.sender || "Unknown"}
                    </div>
                    <div
                      className={cn(
                        "text-[11px] truncate",
                        isOwn
                          ? "text-muted-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {message.replyTo.content || message.replyTo.preview || ""}
                    </div>
                  </div>
                )}

                {/* Message Content */}
                {(message.type === "text" || !message.type) &&
                  message.content && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words px-2">
                      {highlightText(message.content)}
                    </p>
                  )}

                {/* Image rendering */}
                {message.type === "image" && message.url && (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleImageClick(getFileUrl(message.url))}
                  >
                    <img
                      src={getFileUrl(message.url)}
                      alt="Shared image"
                      className="rounded-xl max-w-[300px] max-h-[300px] object-cover hover:opacity-90 transition-opacity border border-primary/10"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23ccc' width='300' height='300'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage failed to load%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                )}

                {/* Video rendering */}
                {message.type === "video" && message.url && (
                  <video
                    ref={videoRef}
                    src={getFileUrl(message.url)}
                    controls
                    className="rounded-xl max-w-[300px] max-h-[300px]"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}

                {/* Audio rendering */}
                {message.type === "audio" && message.url && (
                  <div className="flex items-center gap-3 min-w-[200px] bg-muted/50 p-3 rounded-xl">
                    <button
                      onClick={() => {
                        if (audioRef.current) {
                          if (isPlaying) {
                            audioRef.current.pause();
                          } else {
                            audioRef.current.play();
                          }
                          setIsPlaying(!isPlaying);
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-primary" />
                      ) : (
                        <Play className="w-5 h-5 text-primary" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${playProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Audio message
                      </p>
                    </div>
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <audio
                      ref={audioRef}
                      src={getFileUrl(message.url)}
                      onEnded={() => setIsPlaying(false)}
                    />
                  </div>
                )}

                {/* Document/File rendering */}
                {(message.type === "file" || message.type === "document") &&
                  message.url && (
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {message.fileName || "Document"}
                        </p>
                        {message.fileSize && (
                          <p className="text-xs text-muted-foreground">
                            {message.fileSize}
                          </p>
                        )}
                      </div>
                      <a
                        href={getFileUrl(message.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="p-2 hover:bg-muted rounded-xl transition-colors"
                        aria-label="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                {isOwn && (
                  <div className="flex items-center justify-end gap-1 mt-1 pl-3">
                    {message.edited && (
                      <span
                        className={cn(
                          "text-[10px] italic mr-1",
                          isOwn
                            ? "text-primary-foreground/50"
                            : "text-muted-foreground",
                        )}
                      >
                        (edited)
                      </span>
                    )}
                    <span className="text-[10px] text-primary-foreground/70">
                      {message.time}
                    </span>
                    <MessageStateIcon state={message.state} />
                  </div>
                )}
              </div>
            </div>
            {message.state === "failed" && (
              <button
                onClick={() => retryMessage( selectedChat.id,message)}
                className="text-destructive hover:scale-110"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div
              className={cn(
                "flex gap-1 mt-1",
                isOwn ? "flex-row-reverse" : "flex-row",
              )}
            >
              {Object.entries(message.reactions).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => onReaction(message.id, emoji)}
                  className="bg-primary/20 hover:bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-all hover:scale-110"
                >
                  <span>{emoji}</span>
                  <span className="text-[10px] font-medium">{count}</span>
                </button>
              ))}
            </div>
          )}

          {showActions && (
            <div
              className={cn(
                "flex gap-1 mt-1.5 transition-all duration-300 ease-out",
                isOwn ? "justify-end" : "justify-start",
              )}
            >
              <ActionButton
                icon={Reply}
                tooltip="Reply"
                onClick={(e) => {
                  e.stopPropagation();
                  onReply(message);
                }}
              />
              <ActionButton
                icon={Star}
                tooltip={isFavorited ? "Unstar" : "Star"}
                className={isFavorited ? "text-yellow-500" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(message.id, isFavorited);
                }}
              />
              <ActionButton
                icon={Forward}
                tooltip="Forward"
                onClick={(e) => {
                  e.stopPropagation();
                  handleForward();
                }}
              />
              <ActionButton
                icon={Copy}
                tooltip="Copy"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
              />
              <ActionButton
                icon={Smile}
                tooltip="React"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReactionPicker(
                    showReactionPicker === message.id ? null : message.id,
                  );
                }}
              />
              {isOwn && canEdit && (
                <ActionButton
                  icon={Edit3}
                  tooltip="Edit"
                  className="text-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(message);
                  }}
                />
              )}
              <ActionButton
                icon={Trash2}
                tooltip="Delete"
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              />
            </div>
          )}
        </AutoHeight>

        {showReactionPicker === message.id && (
          <div
            className={cn(
              "flex gap-1.5 mt-2 p-2 bg-card border rounded-xl shadow-lg z-10 transition-all duration-200 ease-out",
              isOwn ? "flex-row-reverse" : "flex-row",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  onReaction(message.id, emoji);
                }}
                className="text-xl hover:scale-125 transition-transform p-1"
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Dialogs */}
      <DeleteMessageDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        message={message}
        selectedChatId={selectedChatId}
        canDeleteForEveryone={canDeleteForEveryone}
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
        imageUrl={previewImageUrl}
      />
    </div>
  );
}

function ActionButton({ icon: Icon, tooltip, className, onClick }) {
  return (
    <button
      title={tooltip}
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-xl bg-muted/80 hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95",
        className,
      )}
      aria-label={tooltip}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function MessageStateIcon({ state }) {
  switch (state) {
    case "sending":
      return (
        <Clock className="w-3 h-3 text-primary-foreground/50 animate-pulse" />
      );
    case "sent":
      return <Check className="w-3 h-3 text-primary-foreground/70" />;
    case "delivered":
      return <CheckCheck className="w-3 h-3 text-primary-foreground/70" />;
    case "seen":
      return <CheckCheck className="w-3 h-3 text-green-900" />;
    case "failed":
      return <X className="w-3 h-3 text-red-500" />;
    default:
      return null;
  }
}
