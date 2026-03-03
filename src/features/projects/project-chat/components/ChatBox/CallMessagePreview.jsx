import { Phone, Video } from "lucide-react";
import { cn } from "@/shared/config/utils";

function formatDuration(seconds = 0) {
  if (!seconds) return null;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function CallMessagePreview({
  callInfo,
  currentUserId,
  conversationCall,
  onJoin,
  isOwn,
}) {
  if (!callInfo) return null;

  const isVideo = callInfo?.type === "VIDEO";
  const isInitiator = callInfo?.initiatorId?.toString?.() === currentUserId;

  const activeParticipants =
    callInfo?.participants?.filter((p) => p.leftAt === null) || [];

  const isRinging = callInfo?.status === "RINGING";
  const isOngoing = callInfo?.status === "ONGOING";
  const isEnded = callInfo?.status === "ENDED";
  const isMissed = callInfo?.status === "MISSED";

  const isActuallyActive =
    conversationCall?.isActive ?? (isRinging || isOngoing);

  const canJoin =
    isActuallyActive && (isRinging || isOngoing) && (!isEnded || !isMissed);

  const durationText = formatDuration(callInfo?.duration);

  let statusText = "Missed call";

  if (isRinging) statusText = "Ringing...";
  else if (isOngoing)
    statusText = `Ongoing • ${activeParticipants.length} joined`;
  else if (isEnded && durationText) statusText = durationText;
  else if (isMissed)
    statusText = isInitiator ? "Missed (No one joined)" : "Missed call";

  return (
    <div
      onClick={() => {
        if (canJoin && onJoin) onJoin();
      }}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm min-w-[220px] transition",
        isOwn
          ? "bg-primary-foreground/20 text-primary-foreground"
          : "bg-muted text-muted-foreground",
        canJoin && "cursor-pointer hover:opacity-90",
      )}
    >
      {/* Icon Circle */}
      <div
        className={cn(
          "flex items-center justify-center w-7 h-7 rounded-full",
          isOwn
            ? "bg-purple-50/20"
            : "bg-purple-400 dark:bg-purple-950",
          canJoin && "animate-pulse",
        )}
      >
        {isVideo ? (
          <Video className="w-4 h-4" />
        ) : (
          <Phone className={cn("w-4 h-4",!isOwn && "text-muted dark:text-muted-foreground" )} />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-medium">
          {isVideo ? "Video call" : "Audio call"}
        </span>

        <span
          className={cn(
            "text-[11px] opacity-70",
            isMissed && `${isOwn ? "text-red-800" : "text-red-600"}`,
          )}
        >
          {statusText}
        </span>
      </div>

      {/* Optional Live Join Tag */}
      {canJoin && (
        <span className="ml-auto text-xs font-semibold px-2 py-[2px] rounded-full bg-green-500 text-white">
          Join
        </span>
      )}
    </div>
  );
}
