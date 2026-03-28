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
  Image,
  Mic2,
  Mic,
  Edit2,
  Pin,
  Video,
  Phone,
  Heart,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { AutoHeight } from "@/shared/components/wrappers/AutoHeight";
import DeleteMessageDialog from "../../../Dialogs/DeleteMessageDialog";
import ForwardMessageDialog from "../../../Dialogs/ForwardMessageDialog";
import ImagePreviewDialog from "../../../Dialogs/ImagePreviewDialog";
import useChatStore from "../../../store/chat.store";
import ReplyPreviewContent from "../ReplyPreviewContent";
import { toast } from "sonner";
import { formatDuration, getReadByCount } from "../../../utils/messageHelpers";
import {
  convertToPrettyText,
  getCurrentUserId,
} from "../../../../../../shared/config/utils";
import { Button } from "../../../../../../shared/components/ui/button";
import CallMessagePreview from "../CallMessagePreview";
import useCallStore from "../../../store/call.store";
import { InfoTooltip } from "../../../../../../shared/components/InfoTooltip";
import { canUserSendMessage } from "../../../utils/chatPermissions";
import MessageActionButton from "./MessageActionButton";
import MessageStateIcon from "./MessageStateIcon";
import MessageFile from "./MessageFile";
import MessageAudio from "./MessageAudio";
import MessageVideo from "./MessageVideo";
import MessageImage from "./MessageImage";

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
  showReactionPicker,
  setShowReactionPicker,
  onScrollToReply,
  searchQuery,
  selectedChatId,
  onReply,
  onEdit,
  canEdit,
  canDeleteForEveryone,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [isReacting, setIsReacting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageFile, setPreviewImageFile] = useState(null);
  const retryMessage = useChatStore((state) => state.retryMessage);
  const {
    selectedChat,
    reactToMessage,
    togglePinMessage,
    toggleFavoriteMessage,
  } = useChatStore();
  const { joinCallSafely } = useCallStore();

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const reactionPickerRef = useRef(null);

  const isOwn = message.isOwn;
  const isFavorited = message.isStarred;
  const isForwarded = message.isForwarded;
  const isSending = message.state === "sending";

  const { canSend } = canUserSendMessage(selectedChat, getCurrentUserId());

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reactionPickerRef.current &&
        !reactionPickerRef.current.contains(event.target)
      ) {
        setShowReactionPicker(null);
      }
    };

    if (showReactionPicker === message.id) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReactionPicker, message.id]);

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

  const handleReaction = async (emoji) => {
    setIsReacting(true);
    await reactToMessage(selectedChatId, message, emoji);
    setShowReactionPicker(null);
    setIsReacting(false);
  };

  const handleToggleFavorite = async () => {
    await toggleFavoriteMessage(selectedChatId, message.id, isFavorited);
  };

  const handlePin = async () => {
    await togglePinMessage(selectedChatId, message.id);
  };

  const handleImageClick = (imageFIle) => {
    setPreviewImageFile(imageFIle);
    setShowImagePreview(true);
  };

  const attachments = message.files || [];

  const isMedia = (mime) =>
    mime?.startsWith("image/") || mime?.startsWith("video/");

  const hasNonMedia = attachments.some((f) => !isMedia(f.mime));

  const isMediaGrid = attachments.length > 1 && !hasNonMedia;

  const attachmentLayoutClass = isMediaGrid
    ? "grid grid-cols-2 gap-1.5"
    : "flex flex-col gap-2";

  if (message.deleted) {
    return (
      <div
        id={`message-${message.id}`}
        data-message-id={message.id}
        className={cn(
          "flex gap-3 group transition-all",
          isOwn ? "flex-row-reverse" : "flex-row",
          isGroupStart ? "mt-4" : "mt-0",
        )}
      >
        {!isOwn && (
          <div className={cn(selectedChat.type !== "dm" ? "w-8" : "")} />
        )}
        <div
          className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}
        >
          <div className="bg-muted/50 px-3 py-2 rounded-lg italic text-sm text-muted-foreground flex items-center gap-2">
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
      data-message-id={message.id}
      className={cn(
        "flex gap-3 transition-all",
        isOwn ? "flex-row-reverse" : "flex-row",
        isGroupStart ? "mt-4" : "mt-0",
        selectedChat.type === "dm" && "ml-4",
      )}
      role="article"
      aria-label={`Message from ${message.sender} at ${message.time}`}
    >
      {!isOwn && selectedChat.type !== "dm" && (
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

      <div className={cn("flex flex-col max-w-[60%]")}>
        {!isOwn && isGroupStart && selectedChat.type !== "dm" && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="font-semibold text-xs text-primary">
              {message.sender}
            </span>
            <Badge
              variant="outline"
              className="text-[9px] text-muted-foreground h-4 px-1.5 border-muted"
            >
              Read by {getReadByCount(message, getCurrentUserId())}
            </Badge>
          </div>
        )}

        <div className="w-full group">
          <div
            className={cn(
              "flex gap-3",
              isOwn ? "flex-row-reverse ml-auto" : "",
            )}
          >
            <div
              className={cn(
                "relative p-1 transition-all break-words max-w-full",
                isOwn ? "ml-auto" : "",
                isOwn
                  ? "bg-primary dark:bg-primary/40 text-background"
                  : "bg-muted",
                isOwn && "rounded-md rounded-tr-none",
                // isOwn && isGroupEnd && "",
                !isOwn && "rounded-md rounded-tl-none",
                // !isOwn && isGroupStart && "rounded-2xl ",
                isSelected &&
                  "ring-2 ring-purple-950 dark:ring-purple-300 scale-[1.02]",
              )}
            >
              <div className="">
                {/* Forwarded indicator */}
                {isForwarded && (
                  <div
                    className={cn(
                      "flex items-center gap-1 pb-0.5 pr-2 pl-1 min-w-20",
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
                    onClick={() =>
                      onScrollToReply(
                        message.replyTo.clientId || message.replyTo.messageId,
                      )
                    }
                    className={cn(
                      "mb-1 pl-3 pr-4 py-1 rounded-md border-l-2 cursor-pointer transition-all duration-150 max-w-full hover:shadow-sm",
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

                {message.type === "text" && message.content && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words px-2">
                    {highlightText(message.content)}
                  </p>
                )}

                {message?.type === "call" && (
                  <CallMessagePreview
                    callInfo={message.callInfo}
                    currentUserId={getCurrentUserId()}
                    // conversationCall={conversation?.call}
                    onJoin={() =>
                      joinCallSafely({
                        conversationId: selectedChatId,
                        callType: message.callInfo.type || "AUDIO",
                      })
                    }
                    isOwn={isOwn}
                  />
                )}

                {attachments.length > 0 && (
                  <div className={cn(attachmentLayoutClass, "gap-1.5")}>
                    {attachments.map((file, index) => {
                      const url = getFileUrl(file.url);

                      return (
                        <div key={index} className="relative">
                          {/* ⏳ Sending overlay ONLY for this attachment */}
                          {isSending && (
                            <div className="absolute inset-0 z-10 bg-black/40 rounded-lg flex items-center justify-center">
                              <Clock className="w-5 h-5 animate-pulse text-white/80" />
                            </div>
                          )}

                          {file.mime.startsWith("image/") && (
                            <MessageImage
                              message={message}
                              file={file}
                              url={url}
                              onClick={handleImageClick}
                              single={!isMediaGrid}
                            />
                          )}

                          {file.mime.startsWith("video/") && (
                            <MessageVideo
                              message={message}
                              file={file}
                              url={url}
                              single={!isMediaGrid}
                            />
                          )}

                          {file.mime.startsWith("audio/") && (
                            <MessageAudio
                              message={message}
                              file={file}
                              url={url}
                              single={!isMediaGrid}
                              isOwn={isOwn}
                            />
                          )}

                          {!file.mime.startsWith("image/") &&
                            !file.mime.startsWith("video/") &&
                            !file.mime.startsWith("audio/") && (
                              <MessageFile
                                message={message}
                                file={file}
                                url={url}
                                single={!isMediaGrid}
                                isOwn={isOwn}
                              />
                            )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {message.caption && (
                  <p
                    className={cn(
                      "mt-2 text-sm px-2",
                      isMediaGrid ? "max-w-[330px]" : "max-w-[260px]",
                    )}
                  >
                    {message.caption}
                  </p>
                )}

                <div
                  className={cn(
                    "flex items-center justify-end gap-1 mt-0 pl-3",
                    !isOwn && "pr-2",
                  )}
                >
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
                  {isFavorited && (
                    <Heart fill="red" className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={cn(
                      "text-[10px]",
                      isOwn
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground/70",
                    )}
                  >
                    {message.time}
                  </span>
                  {isOwn && <MessageStateIcon state={message.state} />}
                </div>
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
                "flex gap-1 mb-1",
                isOwn ? "flex-row-reverse" : "flex-row",
              )}
            >
              {Object.entries(message.reactions).map(([emoji, users]) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  disabled={isReacting}
                  className="bg-primary/20 hover:bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-all hover:scale-110"
                >
                  <span>{emoji}</span>
                  <span className="text-[10px] font-medium">
                    {users.length}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div
            className={cn(
              "flex gap-1 transition-all duration-300 ease-out",
              isOwn ? "justify-end" : "justify-start",
              "opacity-0 translate-y-1 scale-95",
              "max-h-0 overflow-hidden opacity-0 scale-95",
              "group-hover:max-h-20 group-hover:opacity-100 group-hover:scale-100 group-hover:mt-0.5 group-hover:mb-2",
            )}
          >
            {canSend && (
              <>
                <MessageActionButton
                  icon={Reply}
                  tooltip="Reply"
                  disabled={isSending}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReply(message);
                  }}
                />
                {message?.type !== "call" && (
                  <>
                    <MessageActionButton
                      icon={Forward}
                      tooltip="Forward"
                      disabled={isSending}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleForward();
                      }}
                    />
                  </>
                )}

                <MessageActionButton
                  icon={Smile}
                  tooltip="React"
                  disabled={isSending}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReactionPicker(
                      showReactionPicker === message.id ? null : message.id,
                    );
                  }}
                />
                <MessageActionButton
                  icon={Heart}
                  tooltip={isFavorited ? "Remove from Favorites" : "Favorite"}
                  disabled={isSending}
                  className={isFavorited ? "text-red-500" : ""}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite();
                  }}
                />

                <MessageActionButton
                  icon={Pin}
                  tooltip="Pin"
                  disabled={isSending}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePin();
                  }}
                />
              </>
            )}
            {message?.type !== "call" && (
              <MessageActionButton
                icon={Copy}
                tooltip="Copy"
                disabled={isSending}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
              />
            )}
            {canSend && (
              <>
                {isOwn && canEdit && message.type !== "call" && (
                  <MessageActionButton
                    icon={Edit2}
                    tooltip="Edit"
                    disabled={isSending}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(message);
                    }}
                  />
                )}
                <MessageActionButton
                  icon={Trash2}
                  tooltip="Delete"
                  disabled={isSending}
                  className="text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                />
              </>
            )}
          </div>
        </div>

        {showReactionPicker === message.id && (
          <div
            className={cn(
              "flex gap-1.5 mt-2 p-2 bg-card border rounded-lg shadow-lg z-10 transition-all duration-200 ease-out",
              isOwn ? "flex-row-reverse" : "flex-row",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                disabled={isReacting}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReaction(emoji);
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
        message={message}
        imageFile={previewImageFile}
      />
    </div>
  );
}
