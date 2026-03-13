import React, { useEffect, useRef } from "react";
import { Monitor, MicOff, VideoOff, Pin, PinOff } from "lucide-react";
import { cn } from "@/shared/config/utils";
import useCallStore from "../../../store/call.store";
import { getAvatarFallback } from "../../../../../../shared/config/utils";
import { InfoTooltip } from "../../../../../../shared/components/InfoTooltip";

export function ParticipantTile({
  tileId,
  displayName,
  isLocal = false,
  isAudioCall = false,
  isVideoOff = false,
  isMuted = false,
  isSpeaking = false,
  isActiveSpeaker = false,
  isSingle = false,
  isContent = false,
  isMainView = false,
  isPinned = false,
  onPin,
  hidePin = false,
  className,
}) {
  const videoRef = useRef(null);
  const { bindVideoTile, unbindVideoTile } = useCallStore();

  useEffect(() => {
    if (!tileId || !videoRef.current) return;
    bindVideoTile(tileId, videoRef.current);
    return () => unbindVideoTile(tileId);
  }, [tileId, bindVideoTile, unbindVideoTile]);

  const initials = getAvatarFallback(displayName) || (isLocal ? "Y" : "U");
  const label = isLocal ? "You" : displayName || "Participant";
  const showAvatar = isVideoOff || (!tileId && !isContent);

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center select-none",
        isActiveSpeaker && !isContent && "border-2 border-primary",
        className,
      )}
    >
      {/* ── Video element — ALWAYS in DOM ── */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal || !isContent}
        className={cn(
          "w-full h-full object-contain bg-black transition-opacity duration-200",
          isLocal && "scale-x-[-1]",
          showAvatar && "opacity-0 absolute inset-0",
        )}
      />

      {/* ── Avatar overlay (camera off / audio-only) ── */}
      {showAvatar && !isContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-900">
          <div
            className={cn(
              "rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-white shadow-lg",
              isMainView || isSingle
                ? "w-26 h-26 text-3xl"
                : "w-10 h-10 text-lg",
              isActiveSpeaker
                ? "from-primary to-primary/80"
                : "from-primary/80 to-primary/40",
            )}
          >
            {initials}
          </div>
          {isMainView && (
            <span className="text-zinc-300 text-sm font-medium">{label}</span>
          )}
        </div>
      )}

      {/* ── Screen share icon ── */}
      {isContent && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-lg p-3">
            <Monitor className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      )}

      {/* ── Active speaker pulse ── */}
      {isSpeaking && !isContent && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}

      {/* ── Pin button (hover) ── */}
      {!isContent && !hidePin && (
        <InfoTooltip
          content={isPinned ? "Un Pin Participant" : "Pin Participant"}
          side={"bottom"}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin?.();
            }}
            className={cn(
              "absolute top-2 right-2 z-20 rounded-full p-1.5 transition",
              "bg-zinc-900/70 backdrop-blur hover:bg-zinc-800",
              "opacity-0 group-hover:opacity-100",
            )}
          >
            {isPinned ? (
              <PinOff className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <Pin className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </InfoTooltip>
      )}

      {/* ── Pinned indicator ── */}
      {isPinned && (
        <div className="absolute top-2 left-2 z-20 bg-primary rounded-full p-1">
          <Pin className="w-4 h-4" />
        </div>
      )}

      {/* ── Bottom label bar ── */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1.5 bg-gradient-to-t from-black/40 to-transparent">
        <span className="text-white text-xs font-medium truncate max-w-[80%]">
          {isContent ? "Screen Share" : label}
        </span>
        <div className="flex items-center gap-2">
          {isMuted && (
            <MicOff className="w-7 h-7 p-2 text-red-500 flex-shrink-0 bg-zinc-800 rounded-full" />
          )}
          {!isAudioCall && isVideoOff && (
            <VideoOff className="w-7 h-7 p-2 text-red-500 flex-shrink-0 bg-zinc-800 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}
