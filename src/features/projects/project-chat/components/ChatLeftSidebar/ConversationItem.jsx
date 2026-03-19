import {
  Pin,
  Star,
  VolumeX,
  Briefcase,
  Minus,
  Dot,
  Clapperboard,
  Megaphone,
  Phone,
  Paperclip,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Badge } from "@/shared/components/ui/badge";
import {
  convertToPrettyText,
  getCurrentUserId,
} from "../../../../../shared/config/utils";
import useChatStore from "../../store/chat.store";

const formatTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getLastMessagePreview = (item, isGroup) => {
  const msg = item.lastMessage;

  if (!msg) return "";

  const currentUserId = getCurrentUserId();
  const isOwn = msg.senderId?.toString() === currentUserId?.toString();

  const senderPrefix = isGroup
    ? isOwn
      ? "You: "
      : `${msg.senderName || "Unknown"}: `
    : "";

  // 🧠 TYPE HANDLING
  switch (msg.type) {
    case "CALL":
      return {
        icon: <Phone className="w-3 h-3 text-primary" />,
        text: `${msg.text || "Call"}`,
      };

    case "MEDIA":
    case "AUDIO":
      return {
        icon: <Paperclip className="w-3 h-3 text-primary" />,
        text: `${senderPrefix}${msg.text || "Attachment"}`,
      };

    case "TEXT":
    default:
      return {
        icon: null,
        text: `${senderPrefix}${msg.text || ""}`,
      };
  }
};

export default function ConversationItem({
  item,
  type,
  isSelected,
  onClick,
  onContextMenu,
}) {
  const { onlineUsers, typingUsers } = useChatStore();
  const isGroup = type === "group" || type === "all";
  const isOnline = item?.userId && onlineUsers.has(item.userId);
  const currentTypingUsers = typingUsers[item.id] || [];
  const isTyping = currentTypingUsers.length > 0;
  const previewData = getLastMessagePreview(item, isGroup);

  console.log("conversation:", item);

  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={cn(
        "w-full px-2 pl-1.5 py-1.5 text-left transition-all hover:bg-muted/50 relative rounded-md border border-transparent hover:border-border/50",
        isSelected && "bg-muted ring-2 ring-primary/20",
      )}
    >
      <div className="flex items-center gap-2.5">
        {/* Icon/Avatar */}
        {isGroup ? (
          <div
            className={cn(
              "p-2.5 rounded-full text-primary-foreground flex-shrink-0",
              type === "all"
                ? "bg-gradient-to-br from-primary/10 to-primary/20 border"
                : "bg-gradient-to-br from-primary to-primary/70",
            )}
          >
            {type === "all" ? (
              <Megaphone className="w-4 h-4 text-primary" />
            ) : (
              <Clapperboard className="w-4 h-4" />
            )}
          </div>
        ) : (
          <div className="relative flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-xs font-bold">
              {item.avatar}
            </div>
            {isOnline && (
              <span
                className={cn(
                  "absolute top-0 right-0 w-3 h-3 rounded-full border-1 border-card",
                  "bg-green-500",
                )}
              />
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold truncate">
                  {convertToPrettyText(item.name)}
                </p>

                {/* {!isGroup && (
                  <>
                    <p className="text-[9px] text-muted-foreground truncate">
                      {convertToPrettyText(item.role)}
                    </p>
                  </>
                )} */}
              </div>
              {item.isFavorite && (
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 flex-shrink-0" />
              )}
            </div>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">
              {formatTime(item.timestamp)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {item.isMuted && (
                <VolumeX className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              )}
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                {isTyping ? (
                  <span className="text-primary italic">
                    {isGroup
                      ? `${currentTypingUsers[0]?.name || "Someone"} typing...`
                      : "Typing..."}
                  </span>
                ) : (
                  <>
                    {previewData?.icon}

                    <span
                      className={cn(
                        !isGroup &&
                          item.unread > 0 &&
                          "text-primary font-medium",
                      )}
                    >
                      {previewData?.text}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {item.isPinned && <Pin className="w-3 h-3 text-primary" />}
              {item.mentions > 0 && (
                <Badge className="bg-purple-500 text-white text-[10px] h-4 min-w-4 px-1 flex items-center justify-center rounded-full">
                  <span className="text-xs mb-0.5">@</span>
                  {item.mentions}
                </Badge>
              )}
              {item.unread > 0 && !item.isMuted && item.mentions === 0 && (
                <Badge className="bg-purple-500 text-white text-[10px] h-4 min-w-4 px-1 flex items-center justify-center rounded-full">
                  {item.unread}
                </Badge>
              )}
              {item.unread > 0 && item.isMuted && (
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
