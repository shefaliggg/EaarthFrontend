import React from "react";
import { ParticipantTile } from "./ParticipantTile";
import { cn } from "@/shared/config/utils";
import { getGridClass } from "../../../utils/CallHelpers";

function GridLayout({ tiles, callType, pinnedId, onPin, compact }) {
  const isAudio = callType === "AUDIO";
  const single = tiles.length === 1;

  return (
    <div className="h-full overflow-y-auto">
      <div
        className={cn(
          "grid gap-2 flex-1 min-h-0 p-2",
          single ? "h-full" : "place-items-center",
          getGridClass(tiles.length),
        )}
      >
        {tiles.map((tile) => (
          <ParticipantTile
            key={tile.id}
            tileId={tile.tileId}
            displayName={tile.displayName}
            isLocal={tile.isLocal}
            isAudioCall={isAudio}
            isVideoOff={isAudio ? true : tile.isVideoOff}
            isMuted={tile.isMuted}
            isSpeaking={tile.isSpeaking}
            isActiveSpeaker={tile.isActiveSpeaker}
            isSingle={single}
            isPinned={pinnedId === tile.id}
            onPin={() => onPin?.(tile.id)}
            className={cn(
              "w-full cursor-pointer aspect-video",
              single && "h-full",
              //   pinnedId === tile.id && "ring-2 ring-primary",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default GridLayout;
