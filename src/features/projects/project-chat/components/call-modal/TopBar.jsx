import { Grid2x2, Maximize2, Minimize2, Phone, PictureInPicture2, Users, Video } from "lucide-react";
import { InfoTooltip } from "../../../../../shared/components/InfoTooltip";
import { Button } from "../../../../../shared/components/ui/button";
import { cn } from "../../../../../shared/config/utils";

function TopBar({
  callType,
  callState,
  participantCount,
  hadParticipants,
  layout,
  onLayoutToggle,
  onFull,
  onMinimize,
  onCompact,
  isFull,
  isCompact,
  isMinimized,
}) {
  const isEnding = callState === "ending";
  const isConnected = callState === "connected";
  const isLive = isConnected && participantCount > 1;
  const isAlone = isConnected && participantCount <= 1 && hadParticipants;

  return (
    <div className="call-drag-handle flex items-center justify-between px-3 py-2 bg-zinc-950 border-b border-zinc-900 cursor-move select-none flex-shrink-0">
      {/* Left: indicator + type + status */}
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "w-2 h-2 rounded-full flex-shrink-0",
            isEnding
              ? "bg-red-400"
              : isLive
                ? "bg-green-400 animate-pulse"
                : isAlone
                  ? "bg-red-400"
                  : isConnected
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-zinc-500 animate-pulse",
          )}
        />

        {callType === "VIDEO" ? (
          <Video className="w-3.5 h-3.5 text-zinc-300" />
        ) : (
          <Phone className="w-3.5 h-3.5 text-zinc-300" />
        )}

        <span
          className={cn(
            "text-xs font-medium",
            isEnding
              ? "text-red-400"
              : isLive
                ? "text-green-400"
                : isAlone
                  ? "text-red-400"
                  : isConnected
                    ? "text-yellow-400"
                    : "text-zinc-400 animate-pulse",
          )}
        >
          {isEnding
            ? "Ending…"
            : isLive
              ? "Live"
              : isAlone
                ? "Call ended…"
                : isConnected
                  ? "Ringing…"
                  : "Connecting…"}
        </span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-1.5">
        {!isMinimized && !isEnding && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-xs text-zinc-300">
            <Users className="w-3 h-3" />
            {participantCount}
          </div>
        )}

        {/* Layout toggle — only when video and not ending */}
        {!isMinimized && !isEnding && callType === "VIDEO" && (
          <InfoTooltip
            content={
              layout === "speaker"
                ? "Switch to grid view"
                : "Switch to speaker view"
            }
            side={isCompact ? "top" : "bottom"}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onLayoutToggle();
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-7 w-7"
            >
              {layout === "speaker" ? (
                <Grid2x2 className="w-3.5 h-3.5" />
              ) : (
                <PictureInPicture2 className="w-3.5 h-3.5" />
              )}
            </Button>
          </InfoTooltip>
        )}

        {isFull && (
          <InfoTooltip content="Compact screen" side="bottom">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCompact}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-7 w-7"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </Button>
          </InfoTooltip>
        )}

        {isCompact && !isEnding && (
          <>
            <InfoTooltip content="Minimize call">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize();
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-7 w-7"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </Button>
            </InfoTooltip>
            <InfoTooltip content="Full screen">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onFull();
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-7 w-7"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
            </InfoTooltip>
          </>
        )}

        {isMinimized && (
          <InfoTooltip content="Restore call">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onCompact();
              }}
              className="bg-primary/20 text-white h-7 w-7"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </Button>
          </InfoTooltip>
        )}
      </div>
    </div>
  );
}

export default TopBar;
