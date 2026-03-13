import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Users,
  Maximize2,
  Minimize2,
  Video,
  Phone,
  PhoneOff,
  PhoneMissed,
  LayoutGrid,
  MonitorPlay,
} from "lucide-react";
import { Rnd } from "react-rnd";
import { cn } from "@/shared/config/utils";
import useCallStore from "../../store/call.store";
import { ParticipantTile } from "./Callbody/ParticipantTile";
import CallControls from "./CallControls";
import { Button } from "../../../../../shared/components/ui/button";
import { getCurrentUserId } from "../../../../../shared/config/utils";
import {
  END_CONFIG,
  getDefaultPosition,
  getGridClass,
  MODE_SIZE,
} from "../../utils/CallHelpers";
import EndingOverlay from "./EndingOverlay";
import { useSelector } from "react-redux";
import ParticipantsPanel from "./Callbody/ParticipantsPanel";
import { useCallSounds } from "../../hooks/call/useCallSounds";
import CallBody from "./Callbody/CallBody";

export default function CallModal() {
  const {
    viewMode,
    setViewMode,
    callState,
    endReason,
    callType,
    incomingCall,
    hadParticipants,
    localTileId,
    remoteTiles,
    isVideoOff,
    isAudioMuted,
    activeSpeakerId,
    participants,
    isInitiator,
  } = useCallStore();
  const { currentUser } = useSelector((state) => state.user);

  const currentUserId = getCurrentUserId();
  const [layout, setLayout] = useState("grid");
  const [pinnedId, setPinnedId] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);

  const positionRef = useRef({
    compact: getDefaultPosition("compact"),
    minimized: getDefaultPosition("minimized"),
  });
  const [, forceRender] = useState(0);

  const isFull = viewMode === "full";
  const isCompact = viewMode === "compact";
  const isMinimized = viewMode === "minimized";
  const isEnding = callState === "ending";

  const remoteTileList = useMemo(
    () => Object.values(remoteTiles),
    [remoteTiles],
  );

  const screenShareTile = remoteTileList.find((t) => t.isContent);
  const cameraTiles = remoteTileList.filter((t) => !t.isContent);

  // Map tileId → participant info for display names
  const participantByUserId = useMemo(() => {
    const map = {};
    participants.forEach((p) => {
      map[p.userId] = p;
    });
    return map;
  }, [participants]);

  const allTiles = useMemo(() => {
    const list = [];

    // Local tile
    list.push({
      id: currentUserId,
      tileId: localTileId,
      displayName: currentUser?.displayName,
      isLocal: true,
      isVideoOff: isVideoOff || callType !== "VIDEO",
      isMuted: isAudioMuted,
      isSpeaking:
        participants.find((p) => p.userId === currentUserId)?.isSpeaking ||
        false,
      isActiveSpeaker: activeSpeakerId === currentUserId && !isAudioMuted,
    });

    list.push({
      id: "p.userId",
      tileId: "null",
      displayName: "p.displayName",
      isLocal: false,
      isVideoOff: true,
      isMuted: false,
      isSpeaking: false,
      isActiveSpeaker: activeSpeakerId === "p.userId",
    });
    list.push({
      id: "p.userId2",
      tileId: "null2",
      displayName: "2p.displayName",
      isLocal: false,
      isVideoOff: true,
      isMuted: false,
      isSpeaking: false,
      isActiveSpeaker: activeSpeakerId === "p.userId2",
    });
    // list.push({
    //   id: "p.userId3",
    //   tileId: "null3",
    //   displayName: "3p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId3",
    // });
    // list.push({
    //   id: "p.userId",
    //   tileId: "null",
    //   displayName: "p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId",
    // });
    // list.push({
    //   id: "p.userId2",
    //   tileId: "null2",
    //   displayName: "2p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId2",
    // });
    // list.push({
    //   id: "p.userId3",
    //   tileId: "null3",
    //   displayName: "3p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId3",
    // });
    // list.push({
    //   id: "p.userId",
    //   tileId: "null",
    //   displayName: "p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId",
    // });
    // list.push({
    //   id: "p.userId2",
    //   tileId: "null2",
    //   displayName: "2p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId2",
    // });
    // list.push({
    //   id: "p.userId3",
    //   tileId: "null3",
    //   displayName: "3p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId3",
    // });
    // list.push({
    //   id: "p.userId",
    //   tileId: "null",
    //   displayName: "p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId",
    // });
    // list.push({
    //   id: "p.userId2",
    //   tileId: "null2",
    //   displayName: "2p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId2",
    // });
    // list.push({
    //   id: "p.userId3",
    //   tileId: "null3",
    //   displayName: "3p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId3",
    // });
    // list.push({
    //   id: "p.userId",
    //   tileId: "null",
    //   displayName: "p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId",
    // });
    // list.push({
    //   id: "p.userId2",
    //   tileId: "null2",
    //   displayName: "2p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId2",
    // });
    // list.push({
    //   id: "p.userId3",
    //   tileId: "null3",
    //   displayName: "3p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId3",
    // });
    // list.push({
    //   id: "p.userId",
    //   tileId: "null",
    //   displayName: "p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId",
    // });
    // list.push({
    //   id: "p.userId2",
    //   tileId: "null2",
    //   displayName: "2p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId2",
    // });
    // list.push({
    //   id: "p.userId3",
    //   tileId: "null3",
    //   displayName: "3p.displayName",
    //   isLocal: false,
    //   isVideoOff: true,
    //   isMuted: false,
    //   isSpeaking: false,
    //   isActiveSpeaker: activeSpeakerId === "p.userId3",
    // });

    // Remote camera tiles
    cameraTiles.forEach((tile) => {
      const userId = tile.boundExternalUserId;
      if (!userId) return;

      const p = participantByUserId[userId];
      list.push({
        id: p.userId ? p.userId : tile.tileId,
        tileId: tile.tileId,
        displayName: p?.displayName || "Participant",
        isLocal: false,
        isVideoOff: callType !== "VIDEO",
        isMuted: p?.isMuted || false,
        isSpeaking: p?.isSpeaking || false,
        isActiveSpeaker: activeSpeakerId === userId,
      });
    });

    // Audio-only participants (in call but no video tile yet)
    participants.forEach((p) => {
      if (p.userId === currentUserId) return;

      const hasTile = cameraTiles.some(
        (t) => t.boundExternalUserId === p.userId,
      );
      if (!hasTile) {
        list.push({
          id: p.userId,
          tileId: null,
          displayName: p.displayName,
          isLocal: false,
          isVideoOff: true,
          isMuted: p.isMuted || false,
          isSpeaking: p?.isSpeaking || false,
          isActiveSpeaker: activeSpeakerId === p.userId,
        });
      }
    });

    return list;
  }, [
    localTileId,
    cameraTiles,
    participants,
    participantByUserId,
    isVideoOff,
    isAudioMuted,
    callType,
    activeSpeakerId,
    currentUserId,
  ]);

  useCallSounds({
    callState,
    incomingCall,
    participantCount: allTiles.length,
    isInitiator,
    hadParticipants,
  });

  // Determine the active "speaker" tile for speaker view
  const speakerTile = useMemo(() => {
    if (pinnedId) return allTiles.find((t) => t.id === pinnedId) ?? allTiles[0];
    // Prefer screen share
    if (screenShareTile)
      return {
        id: screenShareTile.tileId,
        tileId: screenShareTile.tileId,
        displayName: "Screen Share",
        isContent: true,
      };
    // Prefer active speaker (not local)
    const speaker = allTiles.find((t) => !t.isLocal && t.isActiveSpeaker);

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
      positionRef.current.compact = getDefaultPosition("compact");
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
      if (mode === "minimized")
        positionRef.current.minimized = getDefaultPosition("minimized");
      setViewMode(mode);
    },
    [setViewMode],
  );

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowParticipants(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (callState === "idle" || callState === "incoming") return null;

  const audioSink = <audio id="chime-audio-sink" style={{ display: "none" }} />;

  if (isFull) {
    return (
      <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col">
        {audioSink}
        <TopBar
          callType={callType}
          callState={callState}
          participantCount={allTiles.length}
          hadParticipants={hadParticipants}
          layout={layout}
          onLayoutToggle={() =>
            setLayout((l) => (l === "speaker" ? "grid" : "speaker"))
          }
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
            pinnedId={pinnedId}
            onPin={(id) => setPinnedId((prev) => (prev === id ? null : id))}
            compact={isCompact}
            showParticipants={showParticipants}
            setShowParticipants={setShowParticipants}
            participants={participants}
            currentUserId={currentUserId}
          />
        )}
        {!isEnding && (
          <CallControls
            onShowParticipants={() => setShowParticipants((p) => !p)}
          />
        )}
      </div>
    );
  }

  // ── DRAGGABLE (compact / minimized) ─────────────────────────────────────
  const currentMode = isMinimized ? "minimized" : "compact";
  const currentSize = MODE_SIZE[currentMode];
  const currentPos = positionRef.current[currentMode];

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
            callType={callType}
            callState={callState}
            participantCount={allTiles.length}
            layout={layout}
            onLayoutToggle={() =>
              setLayout((l) => (l === "speaker" ? "grid" : "speaker"))
            }
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
              <span className="text-xs text-zinc-400">
                {END_CONFIG[endReason]?.title ?? "Call ended"}
              </span>
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
                pinnedId={pinnedId}
                onPin={(id) => setPinnedId((prev) => (prev === id ? null : id))}
                compact={isCompact}
                showParticipants={showParticipants}
                setShowParticipants={setShowParticipants}
                participants={participants}
                currentUserId={currentUserId}
              />

              <CallControls
                onShowParticipants={() => setShowParticipants((p) => !p)}
              />
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
   TopBar
═══════════════════════════════════════════════════════════════════════════ */
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
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onLayoutToggle();
            }}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-7 w-7"
            title={layout === "speaker" ? "Grid view" : "Speaker view"}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </Button>
        )}

        {isFull && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCompact}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 h-7 w-7"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </Button>
        )}

        {isCompact && !isEnding && (
          <>
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
          </>
        )}

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
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MinimizedPill
═══════════════════════════════════════════════════════════════════════════ */
function MinimizedPill({ count, onRestore }) {
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
