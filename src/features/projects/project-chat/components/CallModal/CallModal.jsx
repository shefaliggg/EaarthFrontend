import React, { useState, useEffect, useRef, useCallback } from "react";
import { Users, Maximize2, Minimize2, Video, Phone } from "lucide-react";
import { Rnd } from "react-rnd";
import { cn } from "@/shared/config/utils";
import useCallStore from "../../store/call.store";
import { LocalVideoTile, VideoTile } from "./VideoTile";
import CallControls from "./CallControls";
import { Button } from "../../../../../shared/components/ui/button";
import { getAvatarFallback } from "../../../../../shared/config/utils";

function getGridClass(count) {
  if (count <= 1) return "grid-cols-1";
  if (count <= 2) return "grid-cols-2";
  if (count <= 4) return "grid-cols-2";
  if (count <= 9) return "grid-cols-3";
  if (count <= 16) return "grid-cols-4";
  return "grid-cols-5";
}

// Sizes for each draggable mode
const MODE_SIZE = {
  compact: { width: 620, height: 520 },
  minimized: { width: 220, height: 100 },
};

// Calculate a safe centered/cornered default position for a given mode
function getDefaultPosition(mode) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (mode === "minimized") {
    return { x: vw - 240, y: vh - 120 };
  }
  // compact — center
  const { width, height } = MODE_SIZE.compact;
  return {
    x: Math.max(0, (vw - width) / 2),
    y: Math.max(0, (vh - height) / 2),
  };
}

export default function CallModal() {
  const {
    viewMode,
    setViewMode,
    callState,
    callType,
    localTileId,
    remoteTiles,
    isVideoOff,
    activeSpeakerId,
    participants,
  } = useCallStore();

  // Per-mode position — keeps compact position while you minimise and come back
  const positionRef = useRef({
    compact: getDefaultPosition("compact"),
    minimized: getDefaultPosition("minimized"),
  });
  const [, forceRender] = useState(0);

  const isFull = viewMode === "full";
  const isCompact = viewMode === "compact";
  const isMinimized = viewMode === "minimized";

  const screenShareTile = remoteTiles.find((t) => t.isContent);
  const cameraTiles = remoteTiles.filter((t) => !t.isContent);
  const gridClass = getGridClass(cameraTiles.length + 1);

  // When the call first becomes connected, re-center the compact modal
  const prevCallState = useRef(null);
  useEffect(() => {
    if (prevCallState.current !== "connected" && callState === "connected") {
      positionRef.current.compact = getDefaultPosition("compact");
      positionRef.current.minimized = getDefaultPosition("minimized");
      forceRender((n) => n + 1);
    }
    prevCallState.current = callState;
  }, [callState]);

  // Recalculate corner position for minimized on window resize
  useEffect(() => {
    const onResize = () => {
      positionRef.current.minimized = getDefaultPosition("minimized");
      if (isMinimized) forceRender((n) => n + 1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMinimized]);

  const handleDragStop = useCallback(
    (e, d) => {
      const key = isMinimized ? "minimized" : "compact";
      positionRef.current[key] = { x: d.x, y: d.y };
      forceRender((n) => n + 1);
    },
    [isMinimized],
  );

  const handleResizeStop = useCallback((e, dir, ref, delta, pos) => {
    positionRef.current.compact = pos;
    forceRender((n) => n + 1);
  }, []);

  const switchMode = useCallback(
    (mode) => {
      // When switching TO minimized, snap to corner
      if (mode === "minimized") {
        positionRef.current.minimized = getDefaultPosition("minimized");
      }
      setViewMode(mode);
    },
    [setViewMode],
  );

  if (callState === "idle" || callState === "incoming") return null;

  // ── Audio sink — rendered ONCE here, outside both branches ──
  const audioSink = <audio id="chime-audio-sink" style={{ display: "none" }} />;

  // ── FULL SCREEN ──
  if (isFull) {
    return (
      <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col">
        {audioSink}
        <Header
          callType={callType}
          callState={callState}
          participants={participants}
          onMinimize={() => switchMode("minimized")}
          onCompact={() => switchMode("compact")}
          isFull
        />
        <MainContent
          callType={callType}
          screenShareTile={screenShareTile}
          cameraTiles={cameraTiles}
          gridClass={gridClass}
          localTileId={localTileId}
          isVideoOff={isVideoOff}
          participants={participants}
          activeSpeakerId={activeSpeakerId}
        />
        <CallControls />
      </div>
    );
  }

  // ── DRAGGABLE MODES (compact | minimized) ──
  //
  // KEY FIX: wrap in a fixed full-viewport div with pointer-events-none.
  // Rnd uses bounds="parent" so it's constrained to the real viewport — no
  // virtual boundary bugs.  The inner modal div restores pointer-events.
  const currentMode = isMinimized ? "minimized" : "compact";
  const currentSize = MODE_SIZE[currentMode];
  const currentPos = positionRef.current[currentMode];

  return (
    <div
      className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
      aria-label="call-bounds"
    >
      {audioSink}
      <Rnd
        key={currentMode} // remount when mode changes — kills stale internal state
        size={currentSize}
        position={currentPos}
        bounds="parent" // ← constrained to the fixed inset-0 div above
        minWidth={isMinimized ? 200 : 300}
        minHeight={isMinimized ? 80 : 300}
        enableResizing={isCompact}
        dragHandleClassName="call-drag-handle"
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        // Rnd must be absolute inside our fixed parent — NOT itself fixed
        style={{ position: "absolute" }}
        className="pointer-events-auto"
      >
        <div className="bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
          <Header
            callType={callType}
            callState={callState}
            participants={participants}
            onFull={() => setViewMode("full")}
            onMinimize={() => switchMode("minimized")}
            onCompact={() => switchMode("compact")}
            isCompact={isCompact}
            isMinimized={isMinimized}
          />

          {isCompact && (
            <>
              <MainContent
                callType={callType}
                screenShareTile={screenShareTile}
                cameraTiles={cameraTiles}
                gridClass={gridClass}
                localTileId={localTileId}
                isVideoOff={isVideoOff}
                participants={participants}
                activeSpeakerId={activeSpeakerId}
                compact
              />
              <CallControls />
            </>
          )}

          {isMinimized && (
            <MinimizedView
              count={participants.length + 1}
              onRestore={() => switchMode("compact")}
            />
          )}
        </div>
      </Rnd>
    </div>
  );
}

/* ─────────────────────────────── COMPONENTS ─────────────────────────────── */

function Header({
  callType,
  callState,
  participants,
  onFull,
  onMinimize,
  onCompact,
  isCompact,
  isMinimized,
  isFull,
}) {
  return (
    // call-drag-handle is always on the header — dragging works from the header bar
    <div className="call-drag-handle flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/10 cursor-move select-none flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        {callType === "VIDEO" ? (
          <Video className="size-4 text-white" />
        ) : (
          <Phone className="size-4 text-white" />
        )}
        {callState === "connecting" && (
          <span className="text-zinc-400 text-xs animate-pulse">
            Connecting…
          </span>
        )}
        {callState === "connected" && !isMinimized && (
          <span className="text-green-400 text-xs font-medium">Live</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isMinimized && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800 text-xs text-white">
            <Users size={12} />
            {participants.length + 1}
          </div>
        )}

        {/* Full → go compact */}
        {isFull && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCompact}
            className="bg-primary/20 text-white h-7 w-7"
          >
            <Minimize2 size={14} />
          </Button>
        )}

        {/* Compact → minimize */}
        {isCompact && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="bg-zinc-800 text-white h-7 w-7"
          >
            <Minimize2 size={14} />
          </Button>
        )}
        {/* Minimized → expand to compact */}
        {isMinimized && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onCompact();
            }}
            className="bg-primary/20 text-white h-7 w-7"
          >
            <Maximize2 size={14} />
          </Button>
        )}

        {/* Compact → go full */}
        {isCompact && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onFull();
            }}
            className="bg-primary/20 text-white h-7 w-7"
          >
            <Maximize2 size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}

function MainContent({
  callType,
  screenShareTile,
  cameraTiles,
  gridClass,
  localTileId,
  isVideoOff,
  participants,
  activeSpeakerId,
  compact,
}) {
  if (callType === "AUDIO") {
    const allParticipants = [
      { userId: "local", displayName: "You", isLocal: true },
      ...participants,
    ];

    return (
      <div
        className={cn(
          "grid gap-4 p-4 flex-1 overflow-auto",
          getGridClass(allParticipants.length),
        )}
      >
        {allParticipants.map((p) => (
          <AudioTile
            key={p.userId}
            name={p.displayName}
            isMuted={p.isMuted}
            isLocal={p.isLocal}
            isActiveSpeaker={activeSpeakerId === p.userId}
          />
        ))}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-col flex-1 p-2 gap-2 min-h-0">
        <div className="flex-1 rounded-xl overflow-hidden bg-zinc-900 min-h-0">
          {screenShareTile ? (
            <VideoTile
              tileId={screenShareTile.tileId}
              isContent
              className="w-full h-full"
            />
          ) : (
            <LocalVideoTile
              tileId={localTileId}
              isVideoOff={isVideoOff}
              className="w-full h-full"
            />
          )}
        </div>

        {cameraTiles.length > 0 && (
          <div className="flex gap-2 overflow-x-auto flex-shrink-0 pb-1">
            {cameraTiles.slice(0, 6).map((tile) => (
              <div
                key={tile.tileId}
                className="w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0"
              >
                <VideoTile
                  tileId={tile.tileId}
                  isActiveSpeaker={activeSpeakerId === tile.boundExternalUserId}
                  className="w-full h-full"
                />
              </div>
            ))}
            {cameraTiles.length > 6 && (
              <div className="w-24 aspect-video rounded-lg bg-zinc-800 flex items-center justify-center text-white text-sm flex-shrink-0">
                +{cameraTiles.length - 6}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full grid
  return (
    <div className={cn("grid gap-2 p-4 flex-1 overflow-auto", gridClass)}>
      <LocalVideoTile
        tileId={localTileId}
        isVideoOff={isVideoOff}
        className="aspect-video"
      />
      {cameraTiles.map((tile) => (
        <VideoTile
          key={tile.tileId}
          tileId={tile.tileId}
          isActiveSpeaker={activeSpeakerId === tile.boundExternalUserId}
          className="aspect-video"
        />
      ))}
    </div>
  );
}

function MinimizedView({ count, onRestore }) {
  return (
    <div
      onClick={onRestore}
      className="flex items-center justify-center gap-3 flex-1 text-white cursor-pointer px-3"
    >
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-sm font-semibold text-green-400">
        {count}
      </div>
      <span className="text-xs text-zinc-400">Tap to expand</span>
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse ml-auto" />
    </div>
  );
}

function AudioTile({ name, isMuted, isActiveSpeaker, isLocal }) {
  return (
    <div
      className={cn(
        "aspect-square rounded-2xl bg-zinc-900 flex flex-col items-center justify-center relative transition-all duration-300",
        isActiveSpeaker && "ring-2 ring-green-400 shadow-lg",
      )}
    >
      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-xl font-semibold text-white">
        {getAvatarFallback(name)}
      </div>
      <span className="mt-3 text-sm text-white">{isLocal ? "You" : name}</span>
      {isMuted && (
        <span className="absolute bottom-3 text-xs text-red-400">Muted</span>
      )}
    </div>
  );
}
