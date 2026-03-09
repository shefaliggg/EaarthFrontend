import { MicOff } from "lucide-react";
import React from "react";
import { cn, getAvatarFallback } from "../../../../../shared/config/utils";

function ParticipantsPanel({ open, participants, currentUserId }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "absolute right-0 top-0 h-full w-64 border-l shadow-2xl border-zinc-900 bg-zinc-950",
        "transform transition-transform duration-300 z-30",
        open ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="p-3 border-b border-zinc-900 text-sm font-medium text-zinc-300">
        Participants ({participants.length})
      </div>

      <div className="overflow-y-auto flex flex-col gap-2 p-3">
        {participants.map((p) => (
          <div
            key={p.userId}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-xs">
                {getAvatarFallback(p.displayName)}
              </div>

              <span className="text-sm text-zinc-200">
                {p.displayName}
                {p.userId === currentUserId && (
                  <span className="text-zinc-500 ml-1">(You)</span>
                )}
              </span>
            </div>

            {p.isMuted && <MicOff className="w-4 h-4 text-zinc-500" />}
          </div>
        ))}
      </div>
    </div>
  );
}
export default ParticipantsPanel;
