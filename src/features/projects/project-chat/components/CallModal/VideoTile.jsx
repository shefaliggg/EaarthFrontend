import React, { useEffect, useRef } from "react";
import { Mic, MicOff, Monitor } from "lucide-react";
import { cn } from "@/shared/config/utils";
import useCallStore from "../../store/call.store";

// ─────────────────────────────────────────────────────
// VideoTile: binds a Chime tileId to a <video> element
// ─────────────────────────────────────────────────────
export function VideoTile({ tileId, displayName, isActiveSpeaker, isContent, className }) {
  const videoRef = useRef(null);
  const { bindVideoTile, unbindVideoTile } = useCallStore();

  useEffect(() => {
    if (!tileId || !videoRef.current) return;
    bindVideoTile(tileId, videoRef.current);

    return () => {
      unbindVideoTile(tileId);
    };
  }, [tileId]);

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center",
        isActiveSpeaker && "ring-2 ring-green-400",
        className
      )}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={!isContent}
        className="w-full h-full object-cover"
      />

      {/* Label */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/50 rounded-md px-2 py-1">
        {isContent ? (
          <Monitor className="w-3 h-3 text-blue-400" />
        ) : null}
        <span className="text-white text-xs font-medium truncate max-w-[120px]">
          {isContent ? "Screen Share" : displayName || "Participant"}
        </span>
      </div>

      {isActiveSpeaker && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// LocalVideoTile: same but for the local camera feed
// ─────────────────────────────────────────────────────
export function LocalVideoTile({ tileId, isVideoOff, className }) {
  const videoRef = useRef(null);
  const { bindVideoTile, unbindVideoTile } = useCallStore();

  useEffect(() => {
    if (!tileId || !videoRef.current) return;
    bindVideoTile(tileId, videoRef.current);
    return () => unbindVideoTile(tileId);
  }, [tileId]);

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center",
        className
      )}
    >
      {isVideoOff ? (
        <div className="flex flex-col items-center gap-2 text-zinc-400">
          <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-lg font-semibold text-white">
            You
          </div>
          <span className="text-xs">Camera off</span>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
        />
      )}
      <div className="absolute bottom-2 left-2 bg-black/50 rounded-md px-2 py-0.5">
        <span className="text-white text-xs">You</span>
      </div>
    </div>
  );
}
