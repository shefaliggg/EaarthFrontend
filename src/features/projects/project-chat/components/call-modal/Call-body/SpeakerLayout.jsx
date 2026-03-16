import React, { useMemo } from "react";
import { ParticipantTile } from "./ParticipantTile";
import { cn } from "@/shared/config/utils";

function SpeakerLayout({ allTiles, speakerTile, pinnedId, onPin, compact }) {
  const single = allTiles.length <= 1;
  const onlyTwoMembers = allTiles.length === 2;

  const localTile = allTiles.find((t) => t.isLocal);

  const activeSpeakerTile = allTiles.find(
    (t) => !t.isLocal && t.isActiveSpeaker,
  );

  const pipTile = useMemo(() => {
    if (onlyTwoMembers) {
      if (!localTile) return null;

      const remoteTile = allTiles.find((t) => !t.isLocal);

      if (pinnedId === localTile.id) {
        return remoteTile;
      }

      if (pinnedId === remoteTile?.id) {
        return localTile;
      }

      return localTile; // default
    }

    if (pinnedId === localTile?.id) {
      return null;
    }

    if (speakerTile?.id !== localTile?.id) {
      return localTile;
    }

    return null;
  }, [pinnedId, speakerTile, localTile, activeSpeakerTile]);

  const stripTiles = useMemo(() => {
    if (onlyTwoMembers) return [];

    return allTiles.filter(
      (t) => t.id !== speakerTile?.id && t.id !== pipTile?.id,
    );
  }, [allTiles, speakerTile, pipTile, onlyTwoMembers]);

  return (
    <div className="flex flex-1 min-h-0 p-2 gap-2 h-full">
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
            isPinned={pinnedId === speakerTile.id}
            onPin={() => onPin?.(speakerTile.id)}
            className="w-full h-full"
          />
        )}

        {/* LOCAL PiP */}
        {pipTile && !single && (
          <div
            className={cn(
              "absolute right-3 aspect-video transition-all duration-300 ease-out hover:scale-105",
              compact ? "w-28" : "w-36",
              speakerTile.isVideoOff || speakerTile.isMuted
                ? "bottom-12"
                : "bottom-3",
            )}
            onClick={() => onPin?.(localTile.id)}
          >
            <ParticipantTile
              tileId={pipTile.tileId}
              displayName={pipTile.isLocal ? "You" : pipTile.displayName}
              isLocal={pipTile.isLocal}
              isVideoOff={pipTile.isVideoOff}
              isMuted={pipTile.isMuted}
              isSpeaking={pipTile.isSpeaking}
              isPinned={pinnedId === pipTile.id}
              hidePin
              className="w-full h-full rounded-sm shadow-xl"
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
              <div
                key={tile.id}
                className={cn(
                  "flex-shrink-0 rounded-lg overflow-hidden border transition-all aspect-video",
                  compact ? "w-30" : "w-60",
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
                  isPinned={pinnedId === tile.id}
                  onPin={() => onPin?.(tile.id)}
                  className="w-full h-full"
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default SpeakerLayout;
