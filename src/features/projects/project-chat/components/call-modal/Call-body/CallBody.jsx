import React from "react";
import GridLayout from "./GridLayout";
import SpeakerLayout from "./SpeakerLayout";
import ParticipantsPanel from "./ParticipantsPanel";

function CallBody({
  layout,
  callType,
  allTiles,
  speakerTile,
  screenShareTile,
  pinnedId,
  onPin,
  compact,
  showParticipants,
  setShowParticipants,
  participants,
  currentUserId,
}) {
  const isGrid = callType === "AUDIO" || layout === "grid";

  return (
    <div className="relative overflow-hidden h-full">
      {isGrid ? (
        <GridLayout
          tiles={allTiles}
          callType={callType}
          pinnedId={pinnedId}
          onPin={onPin}
          compact={compact}
        />
      ) : (
        <SpeakerLayout
          allTiles={allTiles}
          speakerTile={speakerTile}
          pinnedId={pinnedId}
          screenShareTile={screenShareTile}
          onPin={onPin}
          compact={compact}
        />
      )}

      {showParticipants && (
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20"
          onClick={() => setShowParticipants(false)}
        />
      )}

      <ParticipantsPanel
        open={showParticipants}
        participants={participants}
        currentUserId={currentUserId}
      />
    </div>
  );
}

export default CallBody;
