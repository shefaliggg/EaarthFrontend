import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Users, Maximize2, Minimize2, Video, Phone,
  PhoneOff, PhoneMissed, LayoutGrid, MonitorPlay,
} from "lucide-react";
import { Rnd } from "react-rnd";
import { cn } from "@/shared/config/utils";
import useCallStore from "../../store/call.store";
import { ParticipantTile } from "./VideoTile";
import CallControls from "./CallControls";
import { Button } from "../../../../../shared/components/ui/button";
import { getAvatarFallback } from "../../../../../shared/config/utils";
import { getCurrentUserId } from "../../../../../shared/config/utils";

/* ─── Grid helpers ─────────────────────────────────────────────────────────── */
function getGridClass(count) {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count <= 4) return "grid-cols-2";
  if (count <= 9) return "grid-cols-3";
  return "grid-cols-4";
}

/* ─── Draggable size / position helpers ────────────────────────────────────── */
const MODE_SIZE = {
  compact:   { width: 860, height: 560 },
  minimized: { width: 220, height: 100 },
};

function getDefaultPosition(mode) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (mode === "minimized") return { x: vw - 240, y: vh - 120 };
  const { width, height } = MODE_SIZE.compact;
  return { x: Math.max(0, (vw - width) / 2), y: Math.max(0, (vh - height) / 2) };
}

/* ─── End-state config ──────────────────────────────────────────────────────── */
const END_CONFIG = {
  declined: { icon: PhoneOff,   iconColor: "text-red-400",    bg: "bg-red-500/20",    title: "Call Declined",  sub: "The other person declined your call." },
  missed:   { icon: PhoneMissed,iconColor: "text-yellow-400", bg: "bg-yellow-500/20", title: "No Answer",      sub: "No one joined the call." },
  ended:    { icon: PhoneOff,   iconColor: "text-zinc-400",   bg: "bg-zinc-700/40",   title: "Call Ended",     sub: "The call has ended." },
  error:    { icon: PhoneOff,   iconColor: "text-red-400",    bg: "bg-red-500/20",    title: "Call Failed",    sub: "Something went wrong. Please try again." },
};

/* ═══════════════════════════════════════════════════════════════════════════
   CallModal
═══════════════════════════════════════════════════════════════════════════ */
export default function CallModal() {
  const {
    viewMode, setViewMode,
    callState, endReason,
    callType,
    localTileId, remoteTiles,
    isVideoOff, isAudioMuted,
    activeSpeakerId,
    participants,
  } = useCallStore();

  const currentUserId = getCurrentUserId();

  // ── Layout mode: "speaker" (default) or "grid" ──
  const [layout, setLayout] = useState("speaker");
  // ── Pinned tile: tileId or "local" ──
  const [pinnedId, setPinnedId] = useState(null);

  const positionRef = useRef({
    compact:   getDefaultPosition("compact"),
    minimized: getDefaultPosition("minimized"),
  });
  const [, forceRender] = useState(0);

  const isFull      = viewMode === "full";
  const isCompact   = viewMode === "compact";
  const isMinimized = viewMode === "minimized";
  const isEnding    = callState === "ending";

  const screenShareTile = remoteTiles.find((t) => t.isContent);
  const cameraTiles     = remoteTiles.filter((t) => !t.isContent);

  // Map tileId → participant info for display names
  const participantByUserId = useMemo(() => {
    const map = {};
    participants.forEach((p) => { map[p.userId] = p; });
    return map;
  }, [participants]);

  // Build unified participant list for grid / strip
  // Each entry: { id, tileId, displayName, isLocal, isVideoOff, isMuted, isActiveSpeaker }
  const allTiles = useMemo(() => {
    const list = [];

    // Local tile
    list.push({
      id: "local",
      tileId: localTileId,
      displayName: "You",
      isLocal: true,
      isVideoOff: isVideoOff || callType !== "VIDEO",
      isMuted: isAudioMuted,
      isActiveSpeaker: false,
    });

    // Remote camera tiles
    cameraTiles.forEach((tile) => {
      const p = participantByUserId[tile.boundExternalUserId];
      list.push({
        id: tile.tileId,
        tileId: tile.tileId,
        displayName: p?.displayName || "Participant",
        isLocal: false,
        isVideoOff: callType !== "VIDEO",
        isMuted: p?.isMuted || false,
        isActiveSpeaker: activeSpeakerId === tile.boundExternalUserId,
      });
    });

    // Audio-only participants (in call but no video tile yet)
    participants.forEach((p) => {
      const hasTile = cameraTiles.some((t) => t.boundExternalUserId === p.userId);
      if (!hasTile) {
        list.push({
          id: p.userId,
          tileId: null,
          displayName: p.displayName,
          isLocal: false,
          isVideoOff: true,
          isMuted: p.isMuted || false,
          isActiveSpeaker: activeSpeakerId === p.userId,
        });
      }
    });

    return list;
  }, [localTileId, cameraTiles, participants, participantByUserId, isVideoOff, isAudioMuted, callType, activeSpeakerId]);

  // Determine the active "speaker" tile for speaker view
  const speakerTile = useMemo(() => {
    if (pinnedId) return allTiles.find((t) => t.id === pinnedId) ?? allTiles[0];
    // Prefer screen share
    if (screenShareTile) return {
      id: screenShareTile.tileId,
      tileId: screenShareTile.tileId,
      displayName: "Screen Share",
      isContent: true,
    };
    // Prefer active speaker (not local)
    const speaker = allTiles.find(
      (t) => !t.isLocal && activeSpeakerId &&
      (t.isActiveSpeaker || cameraTiles.some((c) => c.boundExternalUserId === activeSpeakerId && c.tileId === t.tileId)),
    );
    if (speaker) return speaker;
    // First remote, else local
    return allTiles.find((t) => !t.isLocal) ?? allTiles[0];
  }, [allTiles, pinnedId, screenShareTile, activeSpeakerId, cameraTiles]);

  const stripTiles = useMemo(
    () => allTiles.filter((t) => t.id !== speakerTile?.id),
    [allTiles, speakerTile],
  );

  // Re-centre when call connects
  const prevCallState = useRef(null);
  useEffect(() => {
    if (prevCallState.current !== "connected" && callState === "connected") {
      positionRef.current.compact   = getDefaultPosition("compact");
      positionRef.current.minimized = getDefaultPosition("minimized");
      forceRender((n) => n + 1);
    }
    prevCallState.current = callState;
  }, [callState]);

  useEffect(() => {
    const onResize = () => {
      positionRef.current.minimized = getDefaultPosition("minimized");
      if (isMinimized) forceRender((n) => n + 1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMinimized]);

  const handleDragStop    = useCallback((e, d) => {
    const key = isMinimized ? "minimized" : "compact";
    positionRef.current[key] = { x: d.x, y: d.y };
    forceRender((n) => n + 1);
  }, [isMinimized]);

  const handleResizeStop  = useCallback((e, dir, ref, delta, pos) => {
    positionRef.current.compact = pos;
    forceRender((n) => n + 1);
  }, []);

  const switchMode = useCallback((mode) => {
    if (mode === "minimized") positionRef.current.minimized = getDefaultPosition("minimized");
    setViewMode(mode);
  }, [setViewMode]);

  if (callState === "idle" || callState === "incoming") return null;

  const audioSink = <audio id="chime-audio-sink" style={{ display: "none" }} />;

  // ── FULL SCREEN ──────────────────────────────────────────────────────────
  if (isFull) {
    return (
      <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col">
        {audioSink}
        <TopBar
          callType={callType} callState={callState}
          participantCount={allTiles.length}
          layout={layout} onLayoutToggle={() => setLayout((l) => l === "speaker" ? "grid" : "speaker")}
          onMinimize={() => switchMode("minimized")}
          onCompact={() => switchMode("compact")}
          isFull
        />
        {isEnding ? (
          <EndingOverlay reason={endReason} />
        ) : (
          <CallBody
            layout={layout}
            callType={callType}
            allTiles={allTiles}
            speakerTile={speakerTile}
            stripTiles={stripTiles}
            screenShareTile={screenShareTile}
            pinnedId={pinnedId}
            onPin={(id) => setPinnedId((prev) => prev === id ? null : id)}
          />
        )}
        {!isEnding && <CallControls />}
      </div>
    );
  }

  // ── DRAGGABLE (compact / minimized) ─────────────────────────────────────
  const currentMode = isMinimized ? "minimized" : "compact";
  const currentSize = MODE_SIZE[currentMode];
  const currentPos  = positionRef.current[currentMode];

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {audioSink}
      <Rnd
        key={currentMode}
        size={currentSize}
        position={currentPos}
        bounds="parent"
        minWidth={isMinimized ? 200 : 400}
        minHeight={isMinimized ? 80 : 320}
        enableResizing={isCompact && !isEnding}
        dragHandleClassName="call-drag-handle"
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        style={{ position: "absolute" }}
        className="pointer-events-auto"
      >
        <div className="bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800/60 overflow-hidden flex flex-col h-full">
          <TopBar
            callType={callType} callState={callState}
            participantCount={allTiles.length}
            layout={layout} onLayoutToggle={() => setLayout((l) => l === "speaker" ? "grid" : "speaker")}
            onFull={() => setViewMode("full")}
            onMinimize={() => switchMode("minimized")}
            onCompact={() => switchMode("compact")}
            isCompact={isCompact}
            isMinimized={isMinimized}
          />

          {isEnding && !isMinimized && <EndingOverlay reason={endReason} />}

          {isEnding && isMinimized && (
            <div className="flex items-center justify-center gap-2 flex-1 px-3">
              <PhoneOff className="w-4 h-4 text-red-400" />
              <span className="text-xs text-zinc-400">{END_CONFIG[endReason]?.title ?? "Call ended"}</span>
            </div>
          )}

          {!isEnding && isCompact && (
            <>
              <CallBody
                layout={layout}
                callType={callType}
                allTiles={allTiles}
                speakerTile={speakerTile}
                stripTiles={stripTiles}
                screenShareTile={screenShareTile}
                pinnedId={pinnedId}
                onPin={(id) => setPinnedId((prev) => prev === id ? null : id)}
                compact
              />
              <CallControls />
            </>
          )}

          {!isEnding && isMinimized && (
            <MinimizedPill
              count={allTiles.length}
              onRestore={() => switchMode("compact")}
            />
          )}
        </div>
      </Rnd>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CallBody — speaker view OR grid view
═══════════════════════════════════════════════════════════════════════════ */
function CallBody({ layout, callType, allTiles, speakerTile, stripTiles, screenShareTile, pinnedId, onPin, compact }) {

  // Audio call: always grid
  if (callType === "AUDIO") {
    return (
      <div className={cn(
        "grid gap-3 p-3 flex-1 overflow-auto content-start",
        getGridClass(allTiles.length),
      )}>
        {allTiles.map((tile) => (
          <ParticipantTile
            key={tile.id}
            tileId={tile.tileId}
            displayName={tile.displayName}
            isLocal={tile.isLocal}
            isVideoOff
            isMuted={tile.isMuted}
            isActiveSpeaker={tile.isActiveSpeaker}
            className="aspect-square"
          />
        ))}
      </div>
    );
  }

  // Grid layout
  if (layout === "grid") {
    return (
      <div className={cn(
        "grid gap-2 p-2 flex-1 overflow-auto content-start",
        getGridClass(allTiles.length),
      )}>
        {allTiles.map((tile) => (
          <ParticipantTile
            key={tile.id}
            tileId={tile.tileId}
            displayName={tile.displayName}
            isLocal={tile.isLocal}
            isVideoOff={tile.isVideoOff}
            isMuted={tile.isMuted}
            isActiveSpeaker={tile.isActiveSpeaker}
            className={cn("aspect-video cursor-pointer", pinnedId === tile.id && "ring-2 ring-primary")}
            onClick={() => onPin(tile.id)}
          />
        ))}
      </div>
    );
  }

  // ── Speaker layout ────────────────────────────────────────────────────
  const singleParticipant = allTiles.length <= 1;

  return (
    <div className="flex flex-col flex-1 min-h-0 p-2 gap-2">
      {/* Main speaker area */}
      <div className="flex-1 min-h-0 relative rounded-xl overflow-hidden">
        {speakerTile && (
          <ParticipantTile
            tileId={speakerTile.tileId}
            displayName={speakerTile.displayName}
            isLocal={speakerTile.isLocal}
            isVideoOff={speakerTile.isVideoOff}
            isMuted={speakerTile.isMuted}
            isActiveSpeaker={speakerTile.isActiveSpeaker}
            isContent={speakerTile.isContent}
            isMainView
            className="w-full h-full"
          />
        )}

        {/* Local PiP — bottom right corner — only in speaker mode and when local isn't the main view */}
        {!singleParticipant && speakerTile?.id !== "local" && (
          <div
            className={cn(
              "absolute bottom-3 right-3 cursor-pointer transition-transform hover:scale-105",
              compact ? "w-28 h-20" : "w-36 h-24",
            )}
            onClick={() => onPin("local")}
          >
            <ParticipantTile
              tileId={allTiles.find((t) => t.isLocal)?.tileId}
              displayName="You"
              isLocal
              isVideoOff={allTiles.find((t) => t.isLocal)?.isVideoOff}
              isMuted={allTiles.find((t) => t.isLocal)?.isMuted}
              className="w-full h-full rounded-lg shadow-xl border border-zinc-700"
            />
          </div>
        )}
      </div>

      {/* Strip — other participants */}
      {stripTiles.length > 0 && !singleParticipant && (
        <div className={cn(
          "flex gap-2 overflow-x-auto flex-shrink-0 pb-0.5",
          // hide the local pip tile from the strip when already shown as pip
          speakerTile?.id !== "local" ? "pl-0" : "",
        )}>
          {stripTiles
            .filter((t) => !(speakerTile?.id !== "local" && t.isLocal)) // hide local from strip when shown as PiP
            .map((tile) => (
              <button
                key={tile.id}
                onClick={() => onPin(tile.id)}
                className={cn(
                  "flex-shrink-0 rounded-lg overflow-hidden border transition-all",
                  compact ? "w-28 h-20" : "w-36 h-24",
                  pinnedId === tile.id
                    ? "border-primary shadow-primary/30 shadow-md"
                    : "border-zinc-700 hover:border-zinc-500",
                )}
              >
                <ParticipantTile
                  tileId={tile.tileId}
                  displayName={tile.displayName}
                  isLocal={tile.isLocal}
                  isVideoOff={tile.isVideoOff}
                  isMuted={tile.isMuted}
                  isActiveSpeaker={tile.isActiveSpeaker}
                  className="w-full h-full"
                />
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TopBar
═══════════════════════════════════════════════════════════════════════════ */
function TopBar({
  callType, callState, participantCount,
  layout, onLayoutToggle,
  onFull, onMinimize, onCompact,
  isFull, isCompact, isMinimized,
}) {
  const isEnding    = callState === "ending";
  const isConnected = callState === "connected";
  const isLive      = isConnected && participantCount > 1;

  return (
    <div className="call-drag-handle flex items-center justify-between px-3 py-2 bg-zinc-950 border-b border-zinc-800/80 cursor-move select-none flex-shrink-0">
      {/* Left: indicator + type + status */}
      <div className="flex items-center gap-2.5">
        <span className={cn(
          "w-2 h-2 rounded-full flex-shrink-0",
          isEnding    ? "bg-red-400" :
          isLive      ? "bg-green-400 animate-pulse" :
          isConnected ? "bg-yellow-400 animate-pulse" :
                        "bg-zinc-500 animate-pulse",
        )} />

        {callType === "VIDEO"
          ? <Video className="w-3.5 h-3.5 text-zinc-300" />
          : <Phone className="w-3.5 h-3.5 text-zinc-300" />}

        <span className={cn(
          "text-xs font-medium",
          isEnding    ? "text-red-400" :
          isLive      ? "text-green-400" :
          isConnected ? "text-yellow-400" :
                        "text-zinc-400 animate-pulse",
        )}>
          {isEnding    ? "Ending…"     :
           isLive      ? "Live"        :
           isConnected ? "Ringing…"   :
                         "Connecting…"}
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
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onLayoutToggle(); }}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-7 w-7"
            title={layout === "speaker" ? "Grid view" : "Speaker view"}>
            <LayoutGrid className="w-3.5 h-3.5" />
          </Button>
        )}

        {isFull && (
          <Button variant="ghost" size="icon" onClick={onCompact}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-7 w-7">
            <Minimize2 className="w-3.5 h-3.5" />
          </Button>
        )}

        {isCompact && !isEnding && (
          <>
            <Button variant="ghost" size="icon"
              onClick={(e) => { e.stopPropagation(); onFull(); }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-7 w-7">
              <Maximize2 className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon"
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-7 w-7">
              <Minimize2 className="w-3.5 h-3.5" />
            </Button>
          </>
        )}

        {isMinimized && (
          <Button variant="ghost" size="icon"
            onClick={(e) => { e.stopPropagation(); onCompact(); }}
            className="bg-primary/20 text-white h-7 w-7">
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EndingOverlay
═══════════════════════════════════════════════════════════════════════════ */
function EndingOverlay({ reason }) {
  const cfg  = END_CONFIG[reason] ?? END_CONFIG.ended;
  const Icon = cfg.icon;

  return (
    <div
      className="flex flex-col items-center justify-center flex-1 gap-5 bg-zinc-950"
      style={{ animation: "fadeInUp 0.35s ease both" }}
    >
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes ripple   { 0% { transform:scale(1); opacity:.6 } 100% { transform:scale(2.4); opacity:0 } }
        @keyframes shrink   { from { width:100% } to { width:0% } }
      `}</style>

      <div className="relative flex items-center justify-center">
        <span className={cn("absolute rounded-full w-20 h-20", cfg.bg)} style={{ animation: "ripple 1.4s ease-out infinite" }} />
        <span className={cn("absolute rounded-full w-20 h-20", cfg.bg)} style={{ animation: "ripple 1.4s ease-out 0.5s infinite" }} />
        <div className={cn("relative w-16 h-16 rounded-full flex items-center justify-center", cfg.bg)}>
          <Icon className={cn("w-7 h-7", cfg.iconColor)} />
        </div>
      </div>

      <div className="text-center">
        <p className="text-white font-semibold text-base">{cfg.title}</p>
        <p className="text-zinc-400 text-sm mt-1">{cfg.sub}</p>
      </div>

      <div className="w-32 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-zinc-500 rounded-full" style={{ animation: "shrink 3.5s linear both" }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MinimizedPill
═══════════════════════════════════════════════════════════════════════════ */
function MinimizedPill({ count, onRestore }) {
  return (
    <div onClick={onRestore}
      className="flex items-center justify-center gap-3 flex-1 text-white cursor-pointer px-3">
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-sm font-semibold text-green-400">
        {count}
      </div>
      <span className="text-xs text-zinc-400">Tap to expand</span>
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse ml-auto" />
    </div>
  );
}