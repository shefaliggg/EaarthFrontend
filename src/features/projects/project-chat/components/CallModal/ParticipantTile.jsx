import React, { useEffect, useRef } from "react";
import { Monitor, MicOff } from "lucide-react";
import { cn } from "@/shared/config/utils";
import useCallStore from "../../store/call.store";
import { getAvatarFallback } from "../../../../../shared/config/utils";

export function ParticipantTile({
  tileId,
  displayName,
  isLocal = false,
  isVideoOff = false,
  isMuted = false,
  isSpeaking = false,
  isActiveSpeaker = false,
  isSingle = false,
  isContent = false,
  isMainView = false,
  className,
}) {
  const videoRef = useRef(null);
  const { bindVideoTile, unbindVideoTile } = useCallStore();

  // Bind whenever tileId or the video element changes.
  // We do NOT unmount the <video> — only hide it — so this effect runs
  // exactly once per tileId, not on every camera toggle.
  useEffect(() => {
    if (!tileId || !videoRef.current) return;
    bindVideoTile(tileId, videoRef.current);
    return () => unbindVideoTile(tileId);
  }, [tileId]);

  const initials = getAvatarFallback(displayName) || (isLocal ? "Y" : "U");
  const label = isLocal ? "You" : displayName || "Participant";
  const showAvatar = isVideoOff || (!tileId && !isContent);

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center select-none",
        isActiveSpeaker && !isContent && "border border-green-600",
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
          "w-full h-full object-cover transition-opacity duration-200",
          isLocal && "scale-x-[-1]",
          // Hide when avatar should show, but keep mounted so Chime stays bound
          showAvatar && "opacity-0 absolute inset-0",
        )}
      />

      {/* ── Avatar overlay (camera off / audio-only) ── */}
      {showAvatar && !isContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-900">
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXMiPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIxIi8+PC9zdmc+')] pointer-events-none" />

          <div
            className={cn(
              "rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-white shadow-lg",
              isMainView || isSingle
                ? "w-26 h-26 text-3xl"
                : "w-12 h-12 text-lg",
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
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      )}

      {/* ── Bottom label bar ── */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1.5 bg-gradient-to-t from-black/70 to-transparent">
        <span className="text-white text-xs font-medium truncate max-w-[80%]">
          {isContent ? "Screen Share" : label}
        </span>
        <div className="flex items-center gap-1">
          {isMuted && <MicOff className="w-3 h-3 text-red-400 flex-shrink-0" />}
        </div>
      </div>
    </div>
  );
}
