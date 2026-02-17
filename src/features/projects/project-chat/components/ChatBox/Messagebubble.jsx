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
import ReplyPreviewContent from "./ReplyPreviewContent";
import { toast } from "sonner";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const getFileUrl = (fileKey) => {
  if (!fileKey || typeof fileKey !== "string") return null;

  if (
    fileKey.startsWith("http://") ||
    fileKey.startsWith("https://") ||
    fileKey.startsWith("blob:")
  ) {
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
  const isForwarded = message.isForwarded;

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
      toast.success("Message copied to clipboard!");
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

  console.log("message replty data", message.replyTo);

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
        isGroupStart ? "mt-4" : "mt-0",
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
            <Badge variant="outline" className="text-[9px] h-4 px-1.5">
              Read by {message.readBy}
            </Badge>
          </div>
        )}

        <AutoHeight className="w-full">
          <div
            className={cn(
              "flex gap-3 w-fit",
              isOwn ? "flex-row-reverse ml-auto" : "",
            )}
          >
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
                      "mb-1 pl-3 pr-4 py-1 rounded-lg border-l-2 cursor-pointer transition-all duration-150 max-w-full hover:shadow-sm",
                      isOwn
                        ? "bg-purple-200 dark:bg-muted text-foreground  border-primary-foreground dark:border-primary-foreground/50 hover:bg-muted/80"
                        : "bg-background/60 border-primary hover:bg-background/80",
                    )}
                  >
                    <div className="text-[10px] font-semibold text-primary mb-0.5 truncate">
                      {message.replyTo.sender || "Unknown"}
                    </div>

                    <ReplyPreviewContent reply={message.replyTo} />
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
                {message.type === "image" && message.files?.length > 0 && (
                  <div
                    className={`grid ${message.files?.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-1 `}
                  >
                    {message.files.map((file, index) => {
                      const imageUrl = getFileUrl(file?.url);

                      return (
                        <div className="overflow-hidden aspect-4/3 h-[150px]">
                          <img
                            key={index}
                            src={imageUrl}
                            alt={`Shared image ${index + 1}`}
                            onClick={() => handleImageClick(imageUrl)}
                            className="cursor-pointer rounded-xl w-full h-full object-cover hover:opacity-90 transition-opacity border border-primary/10"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
                {message.caption && (
                  <p className="mt-2 text-sm px-2">{message.caption}</p>
                )}

                {/* Video rendering */}
                {message.type === "video" && message.files?.length > 0 && (
                  <div className="space-y-2">
                    {message.files.map((file, index) => {
                      const videoUrl = getFileUrl(file.url);

                      return (
                        <video
                          key={index}
                          ref={videoRef}
                          src={videoUrl}
                          controls
                          className="rounded-xl max-w-[300px] max-h-[300px]"
                        >
                          Your browser does not support the video tag.
                        </video>
                      );
                    })}

                    {message.caption && (
                      <p className="text-sm mt-1">{message.caption}</p>
                    )}
                  </div>
                )}

                {/* Audio rendering */}
                {message.type === "audio" && message.files?.length === 1 && (
                  <div className="flex items-center gap-3 min-w-[200px] bg-muted/50 p-3 rounded-xl">
                    <button
                      onClick={() => {
                        if (!audioRef.current) return;

                        if (isPlaying) {
                          audioRef.current.pause();
                        } else {
                          audioRef.current.play();
                        }

                        setIsPlaying(!isPlaying);
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
                        Voice message
                      </p>
                    </div>

                    <Volume2 className="w-4 h-4 text-muted-foreground" />

                    <audio
                      ref={audioRef}
                      src={getFileUrl(message.files[0].url)}
                      onEnded={() => {
                        setIsPlaying(false);
                        setPlayProgress(0);
                      }}
                    />
                  </div>
                )}

                {/* Document/File rendering */}
                {(message.type === "file" || message.type === "document") &&
                  message.files?.length > 0 &&
                  message.files.map((file, index) => {
                    const fileUrl = getFileUrl(file.url);

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 min-w-[200px]"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {file.name || "Document"}
                          </p>
                          {file.size && (
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          )}
                        </div>

                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="p-2 hover:bg-muted rounded-xl"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    );
                  })}

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
                onClick={() => retryMessage(selectedChat.id, message)}
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
                icon={Forward}
                tooltip="Forward"
                onClick={(e) => {
                  e.stopPropagation();
                  handleForward();
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
