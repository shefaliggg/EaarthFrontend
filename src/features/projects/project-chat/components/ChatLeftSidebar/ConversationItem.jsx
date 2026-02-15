import { Pin, Star, VolumeX, Briefcase } from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Badge } from "@/shared/components/ui/badge";
import { convertToPrettyText } from "../../../../../shared/config/utils";

// Icon mapping for departments
const DEPARTMENT_ICONS = {
  Production: Briefcase,
  Camera: Briefcase,
  Stunts: Briefcase,
  Sound: Briefcase,
  Security: Briefcase,
  Catering: Briefcase,
  VFX: Briefcase,
  Editing: Briefcase,
};

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

export default function ConversationItem({
  item,
  type,
  isSelected,
  onClick,
  onContextMenu,
}) {
  const Icon = item.icon || DEPARTMENT_ICONS[item.departmentName] || Briefcase;
  const isGroup = type === "group" || type === "all";
  
  console.log("NAME TYPE:", item.name, typeof item.name);

  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={cn(
        "w-full px-3 py-2.5 text-left transition-all hover:bg-muted/50 relative rounded-md border border-transparent hover:border-border/50",
        isSelected && "bg-muted ring-2 ring-primary/20",
      )}
    >
      <div className="flex items-center gap-2.5">
        {/* Icon/Avatar */}
        {isGroup ? (
          <div className="p-2 rounded-full bg-primary/10 flex-shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        ) : (
          <div className="relative flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-xs font-bold">
              {item.avatar}
            </div>
            <span
              className={cn(
                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card",
                item.status === "online" && "bg-green-500",
                item.status === "away" && "bg-yellow-500",
                item.status === "offline" && "bg-gray-400",
              )}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {convertToPrettyText(item.name)}
              </p>
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
              <p className="text-xs text-muted-foreground truncate">
                {!isGroup && item.unread > 0 && (
                  <span className="text-foreground font-medium">
                    {item.lastMessage.substring(0, 20)}
                    {item.lastMessage.length > 20 && "..."}
                  </span>
                )}
                {!isGroup && item.unread === 0 && item.lastMessage}
                {isGroup && item.lastMessage}
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {item.isPinned && (
                <Pin className="w-3 h-3 text-muted-foreground" />
              )}
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
