import React, { useState, useMemo, useEffect } from "react";
import { X, Users, Maximize2, Minimize2, Video, Phone } from "lucide-react";
import { Rnd } from "react-rnd";
import { cn } from "@/shared/config/utils";
import useCallStore from "../../store/call.store";
import { LocalVideoTile, VideoTile } from "./VideoTile";
import CallControls from "./CallControls";
import { Button } from "../../../../../shared/components/ui/button";
import { getAvatarFallback } from "../../../../../shared/config/utils";

// Grid logic unchanged
function getGridClass(count) {
  if (count <= 1) return "grid-cols-1";
  if (count <= 2) return "grid-cols-2";
  if (count <= 4) return "grid-cols-2";
  if (count <= 9) return "grid-cols-3";
  if (count <= 16) return "grid-cols-4";
  return "grid-cols-5";
}

export default function CallModal() {
  const [showParticipants, setShowParticipants] = useState(false);
  const [viewMode, setViewMode] = useState("full"); // full | compact | minimized
  const [position, setPosition] = useState({ x: 200, y: 100 });

  const {
    callState,
    callType,
    localTileId,
    remoteTiles,
    isAudioMuted,
    isVideoOff,
    activeSpeakerId,
    participants,
  } = useCallStore();

  console.log("participants", participants);

  const screenShareTile = remoteTiles.find((t) => t.isContent);
  const cameraTiles = remoteTiles.filter((t) => !t.isContent);

  const gridTiles = screenShareTile
    ? [screenShareTile, ...cameraTiles]
    : cameraTiles;

  const gridClass = getGridClass(gridTiles.length + 1);

  const isFull = viewMode === "full";
  const isCompact = viewMode === "compact";
  const isMinimized = viewMode === "minimized";

  useEffect(() => {
    if (isMinimized) {
      setPosition({
        x: window.innerWidth - 240,
        y: window.innerHeight - 150,
      });
    }
  }, [isMinimized]);

  useEffect(() => {
    if (isCompact) {
      const width = 700; // your compact width
      const height = 520; // your compact height

      setPosition({
        x: (window.innerWidth - width) / 2,
        y: (window.innerHeight - height) / 2,
      });
    }
  }, [isCompact]);

  if (callState === "idle" || callState === "incoming") return null;

  // ---------------- FULL SCREEN ----------------
  if (isFull) {
    return (
      <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col">
        <Header
          callType={callType}
          callState={callState}
          participants={participants}
          onParticipants={() => setShowParticipants((v) => !v)}
          onMinimize={() => setViewMode("minimized")}
          onCompact={() => setViewMode("compact")}
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
        <audio id="chime-audio-sink" style={{ display: "none" }} />
      </div>
    );
  }

  // ---------------- DRAGGABLE MODES ----------------
  return (
    <Rnd
      size={
        isCompact ? { width: 700, height: 520 } : { width: 220, height: 140 }
      }
      position={position}
      bounds="window"
      enableResizing={isCompact}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      className="z-[200]"
      style={{ position: "fixed" }}
      dragHandleClassName="call-drag-handle"
    >
      <div
        className={cn(
          "bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full transition-all duration-300 ease-in-out",
          isCompact && "call-drag-handle cursor-move",
        )}
      >
        <Header
          callType={callType}
          callState={callState}
          participants={participants}
          onParticipants={() => setShowParticipants((v) => !v)}
          onFull={() => setViewMode("full")}
          onMinimize={() => setViewMode("minimized")}
          onCompact={() => setViewMode("compact")}
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
            onRestore={() => setViewMode("compact")}
          />
        )}

        <audio id="chime-audio-sink" style={{ display: "none" }} />
      </div>
    </Rnd>
  );
}

/* ================= COMPONENTS ================= */

function Header({
  callType,
  callState,
  participants,
  onParticipants,
  onFull,
  onMinimize,
  onCompact,
  isCompact,
  isMinimized,
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/10",
        isMinimized && "call-drag-handle cursor-move",
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-white text-sm font-medium">
          {callType === "VIDEO" ? (
            <Video className="size-4 text-white" />
          ) : (
            <Phone className="size-4 text-white" />
          )}
        </span>
        {callState === "connecting" && (
          <span className="text-zinc-400 text-xs animate-pulse">
            Connecting…
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onParticipants}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-white"
        >
          <Users size={14} />
          {participants.length + 1}
        </button>

        {!isMinimized && (
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={onMinimize}
            className="bg-primary/20 text-white"
          >
            <Minimize2 size={16} />
          </Button>
        )}

        {/* {isMinimized && (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="bg-primary/20 text-white"
            onClick={onCompact}
          >
            <Maximize2 size={16} />
          </Button>
        )} */}
        {isCompact && (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="bg-primary/20 text-white"
            onClick={onFull}
          >
            <Maximize2 size={16} />
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
    const localUser = {
      id: "local",
      name: "You",
      avatar: "Y",
    };

    const allParticipants = [localUser, ...participants];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 flex-1 overflow-auto">
        {allParticipants.map((p) => (
          <AudioTile
            key={p.id}
            name={p.displayName}
            avatar={p.avatar}
            isMuted={false} // connect to real mute state later
            isLocal={p.id === "local"}
            isActiveSpeaker={activeSpeakerId === p.id}
          />
        ))}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-col flex-1 p-2 gap-2">
        <div className="flex-1 rounded-xl overflow-hidden bg-zinc-900">
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

        <div className="flex gap-2 overflow-x-auto">
          {cameraTiles.slice(0, 6).map((tile) => (
            <div
              key={tile.tileId}
              className="w-24 aspect-video rounded-lg overflow-hidden"
            >
              <VideoTile
                tileId={tile.tileId}
                isActiveSpeaker={activeSpeakerId === tile.boundExternalUserId}
              />
            </div>
          ))}

          {cameraTiles.length > 6 && (
            <div className="w-24 aspect-video rounded-lg bg-zinc-800 flex items-center justify-center text-white text-sm">
              +{cameraTiles.length - 6}
            </div>
          )}
        </div>
      </div>
    );
  }

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
      className="flex flex-col items-center justify-center h-full text-white cursor-pointer gap-2"
    >
      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xl">
        {count}
      </div>
      <span className="text-xs">Live</span>
    </div>
  );
}

function AudioTile({ name, avatar, isMuted, isActiveSpeaker, isLocal }) {
  return (
    <div
      className={cn(
        "aspect-square rounded-2xl bg-zinc-900 flex flex-col items-center justify-center relative transition-all duration-300",
        isActiveSpeaker && "ring-2 ring-green-400 shadow-lg pulseRing",
      )}
    >
      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-xl font-semibold text-white">
        {avatar || getAvatarFallback(name)}
      </div>

      <span className="mt-3 text-sm text-white">{isLocal ? "You" : name}</span>

      {isMuted && (
        <span className="absolute bottom-3 text-xs text-red-400">Muted</span>
      )}
    </div>
  );
}
