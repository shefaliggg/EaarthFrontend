import React from "react";
import { ParticipantTile } from "./ParticipantTile";
import { cn } from "@/shared/config/utils";

function SpeakerLayout({
  allTiles,
  speakerTile,
  stripTiles,
  pinnedId,
  onPin,
  compact,
}) {
  const single = allTiles.length <= 1;

  const localTile = allTiles.find((t) => t.isLocal);

  return (
    <div className="flex flex-1 min-h-0 p-2 gap-2">
      {/* MAIN SPEAKER */}
      <div className="flex-1 min-h-0 relative rounded-xl overflow-hidden">
        {speakerTile && (
          <ParticipantTile
            tileId={speakerTile.tileId}
            displayName={speakerTile.displayName}
            isLocal={speakerTile.isLocal}
            isVideoOff={speakerTile.isVideoOff}
            isMuted={speakerTile.isMuted}
            isSpeaking={speakerTile.isSpeaking}
            isActiveSpeaker={speakerTile.isActiveSpeaker}
            isContent={speakerTile.isContent}
            isMainView
            className="w-full h-full aspect-video"
          />
        )}

        {/* LOCAL PiP */}
        {!single && speakerTile?.id !== localTile?.id && localTile && (
          <div
            className={cn(
              "absolute bottom-3 right-3 cursor-pointer transition-transform hover:scale-105",
              compact ? "w-28 h-20" : "w-36 h-24",
            )}
            onClick={() => onPin(localTile.id)}
          >
            <ParticipantTile
              tileId={localTile.tileId}
              displayName="You"
              isLocal
              isVideoOff={localTile.isVideoOff}
              isMuted={localTile.isMuted}
              isSpeaking={localTile.isSpeaking}
              className="w-full h-full rounded-lg shadow-xl border border-zinc-700"
            />
          </div>
        )}
      </div>

      {/* STRIP */}
      {stripTiles.length > 0 && !single && (
        <div className="flex flex-col gap-2 overflow-y-auto flex-shrink-0 pb-0.5">
          {stripTiles
            .filter((t) => !(speakerTile?.id !== localTile?.id && t.isLocal))
            .map((tile) => (
              <button
                key={tile.id}
                onClick={() => onPin(tile.id)}
                className={cn(
                  "flex-shrink-0 rounded-lg overflow-hidden border transition-all aspect-video",
                  compact ? "w-28" : "w-56",
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
                  isSpeaking={tile.isSpeaking}
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

export default SpeakerLayout;
