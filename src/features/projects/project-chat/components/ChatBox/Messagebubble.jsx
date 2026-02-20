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
import { formatDuration, getReadByCount } from "../../utils/messageHelpers";
import { getCurrentUserId } from "../../../../../shared/config/utils";
import { Button } from "../../../../../shared/components/ui/button";

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
  const [previewImageFile, setPreviewImageFile] = useState(null);
  const retryMessage = useChatStore((state) => state.retryMessage);
  const { selectedChat } = useChatStore();

  const videoRef = useRef(null);
  const audioRef = useRef(null);

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

  const handleImageClick = (imageFIle) => {
    setPreviewImageFile(imageFIle);
    setShowImagePreview(true);
  };

  if (message.replyTo) {
    console.log("reply fron backend", message);
  }

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
      id={`message-${message.clientTempId || message.id}`}
      className={cn(
        "flex gap-3 transition-all",
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

      <div className={cn("flex flex-col max-w-[60%]")}>
        {!isOwn && isGroupStart && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="font-semibold text-xs text-foreground">
              {message.sender}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {message.time}
            </span>
            <Badge variant="outline" className="text-[9px] h-4 px-1.5">
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
                isSelected && "ring-2 ring-primary/50 scale-[1.02]",
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

                {message.files && message.files.length > 0 && (
                  <div
                    className={`grid ${message.files.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-1`}
                  >
                    {message.files.map((file, index) => {
                      const url = getFileUrl(file.url);
                      if (file.mime.startsWith("image/"))
                        return (
                          <MessageImage
                            message={message}
                            key={index}
                            file={file}
                            url={url}
                            onClick={handleImageClick}
                            single={message.files.length === 1}
                          />
                        );
                      if (file.mime.startsWith("video/"))
                        return (
                          <MessageVideo
                            message={message}
                            key={index}
                            file={file}
                            url={url}
                            single={message.files.length === 1}
                          />
                        );
                      if (file.mime.startsWith("audio/"))
                        return (
                          <MessageAudio
                            message={message}
                            key={index}
                            file={file}
                            url={url}
                            single={message.files.length === 1}
                          />
                        );
                      return (
                        <MessageFile
                          message={message}
                          key={index}
                          file={file}
                          url={url}
                          single={message.files.length === 1}
                        />
                      );
                    })}
                  </div>
                )}

                {message.caption && (
                  <p className="mt-2 text-sm px-2">{message.caption}</p>
                )}

                {isOwn && (
                  <div className="flex items-center justify-end gap-1 mt-0 pl-3">
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

          <div
            className={cn(
              "flex gap-1 transition-all duration-300 ease-out",
              isOwn ? "justify-end" : "justify-start",
              "opacity-0 translate-y-1 scale-95",
              "max-h-0 overflow-hidden opacity-0 scale-95",
              "group-hover:max-h-20 group-hover:opacity-100 group-hover:scale-100 group-hover:mt-0.5 group-hover:mb-1",
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
        </div>

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
        message={message}
        imageFile={previewImageFile}
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
      return <CheckCheck className="w-3 h-3 text-green-400" />;
    case "failed":
      return <X className="w-3 h-3 text-red-500" />;
    default:
      return null;
  }
}

function MessageImage({ file, url, onClick, single = true }) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div
      className={`overflow-hidden relative  w-full ${single ? " max-w-[240px] max-h-[240px]" : " max-w-[160px] max-h-[160px]"} bg-muted/90 rounded-sm relative ${!loaded ? "aspect-4/3" : ""}`}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-200 dark:bg-purple-800 animate-pulse">
          <Image className="w-6 h-6 text-primary" />
        </div>
      )}
      <img
        src={url}
        alt={file.name || "Shared image"}
        onClick={() => onClick(file)}
        onLoad={() => setLoaded(true)}
        className={`cursor-pointer rounded-sm w-full h-auto object-cover ${single ? "" : "aspect-square"} transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
      />

      <a
        href={url}
        rel="noopener noreferrer"
        download
        onClick={() => toast.info("Downloading Image..")}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}

function MessageVideo({ file, url, single = true }) {
  return (
    <div className="relative group">
      <video
        src={url}
        controls
        className={`rounded-xl  w-full  bg-muted/90 ${single ? "max-w-[240px] max-h-[240px]" : "aspect-square max-w-[160px] max-h-[160px]"}`}
      >
        Your browser does not support the video tag.
      </video>
      <a
        href={url}
        rel="noopener noreferrer"
        download
        onClick={() => toast.info("Downloading Video..")}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
}

function MessageAudio({ message, file, url, single = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [duration, setDuration] = useState(file?.duration || 0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef(null);

  // const isAudioFile = false;
  // const isVoiceMessage = true
  const isAudioFile = message.type.toLowerCase() === "media";
  const isVoiceMessage = message.type.toLowerCase() === "audio";

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setPlayProgress((prev) => {
          if (!audioRef.current) return 0;
          const progress =
            (audioRef.current.currentTime / audioRef.current.duration) * 100;
          if (progress >= 100) {
            setIsPlaying(false);
            clearInterval(interval);
          }
          return progress;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <div
      className={`flex items-center gap-2 w-full col-span-2 
        ${single ? "min-w-[260px] max-w-[260px]" : "min-w-[160px] max-w-full"} 
        ${isAudioFile ? "bg-muted/90" : "bg-primary"} 
        p-3 px-2 rounded-md`}
    >
      <button
        onClick={() => {
          if (!audioRef.current) return;
          audioRef.current.playbackRate = playbackRate;
          if (isPlaying) audioRef.current.pause();
          else audioRef.current.play();
          setIsPlaying(!isPlaying);
        }}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
      ${
        isVoiceMessage
          ? "bg-white/20 hover:bg-white/30"
          : "bg-primary/10 hover:bg-primary/20"
      }`}
      >
        {isPlaying ? (
          <Pause
            className={`w-5 h-5 ${
              isVoiceMessage ? "text-white" : "text-primary"
            }`}
          />
        ) : (
          <Play
            className={`w-5 h-5 ${
              isVoiceMessage ? "text-white" : "text-primary"
            }`}
          />
        )}
      </button>

      <div className="flex-1 flex flex-col">
        {isAudioFile && (
          <span className={`text-[12px] text-muted-foreground mb-0.5`}>
            {file.name}
          </span>
        )}
        <div
          className={`h-1 rounded-full overflow-hidden ${
            isVoiceMessage ? "bg-white/20" : "bg-muted"
          }`}
        >
          <div
            className={`h-full transition-all ${
              isVoiceMessage ? "bg-white" : "bg-primary"
            }`}
            style={{ width: `${playProgress}%` }}
          />
        </div>
        <div className="flex justify-between items-center  mt-1">
          <p
            className={`text-xs flex items-center gap-1 ${
              isVoiceMessage
                ? "text-white/90"
                : "text-muted-foreground text-[11px]"
            }`}
          >
            {isVoiceMessage ? (
              <>
                <Mic className="w-4 h-4 text-white/80" />
                Voice message
              </>
            ) : (
              <>
                <Volume2 className="w-3 h-3 text-muted-foreground" />
                Audio File
              </>
            )}
          </p>
          <span
            className={`text-[11px] ${isVoiceMessage ? "text-white/90" : "text-muted-foreground"}`}
          >
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {isVoiceMessage && (
        <button
          onClick={() => {
            const nextRate =
              playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;

            setPlaybackRate(nextRate);
          }}
          className="text-[11px] px-2 py-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
        >
          {playbackRate}x
        </button>
      )}

      {isAudioFile && (
        <Button
          onClick={() =>
            downloadAttachment(message.conversationId, message._id, file)
          }
          variant={"ghost"}
          size={"icon"}
        >
          <Download className="w-4 h-4" />
        </Button>
      )}

      <audio
        ref={audioRef}
        src={url}
        onLoadedMetadata={() => {
          if (!audioRef.current) return;

          if (!file?.duration) {
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (!audioRef.current) return;

          const progress =
            (audioRef.current.currentTime / audioRef.current.duration) * 100;

          setPlayProgress(progress);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setPlayProgress(0);
        }}
      />
    </div>
  );
}

function MessageFile({ file, url, single }) {
  return (
    <div
      className={`flex items-center gap-1 w-full col-span-2 ${single ? "min-w-[260px] max-w-[260px]" : "min-w-[160px] max-w-full"} bg-muted/90 p-3 px-2 rounded-md`}
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <FileText className="w-5 h-5 text-primary" />
      </div>

      <div className="flex-1 min-w-0 pl-1">
        <p className="text-sm font-medium truncate text-foreground">
          {file.name || "Document"}
        </p>
        {file.size && (
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        )}
      </div>

      <a
        href={url}
        rel="noopener noreferrer"
        download
        onClick={() => toast.info("Downloading Document")}
        className="p-2 hover:bg-muted rounded-xl"
      >
        <Download className="w-4 h-4 text-primary" />
      </a>
    </div>
  );
}
