import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Rnd } from "react-rnd";
import useCallStore from "../../store/call.store";
import CallControls from "./CallControls";
import { getCurrentUserId } from "../../../../../shared/config/utils";
import {
  END_CONFIG,
  getDefaultPosition,
  MODE_SIZE,
} from "../../utils/CallHelpers";
import EndingOverlay from "./EndingOverlay";
import { useSelector } from "react-redux";
import { useCallSounds } from "../../hooks/call/useCallSounds";
import CallBody from "./Call-body/CallBody";
import TopBar from "./TopBar";
import MinimizedCallPill from "./MinimizedCallPill";

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

  useEffect(() => {
    if (pinnedId && !allTiles.some((t) => t.id === pinnedId)) {
      setPinnedId(null);
    }
  }, [allTiles, pinnedId]);

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
            onPin={(id) => {
              setPinnedId((prev) => (prev === id ? null : id));
              setLayout("speaker");
            }}
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

          {isEnding && <EndingOverlay reason={endReason} />}

          {!isEnding && isCompact && (
            <>
              <CallBody
                layout={layout}
                callType={callType}
                allTiles={allTiles}
                speakerTile={speakerTile}
                stripTiles={stripTiles}
                pinnedId={pinnedId}
                onPin={(id) => {
                  setPinnedId((prev) => (prev === id ? null : id));
                  setLayout("speaker");
                }}
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
            <MinimizedCallPill
              count={allTiles.length}
              onRestore={() => switchMode("compact")}
            />
          )}
        </div>
      </Rnd>
    </div>
  );
}
