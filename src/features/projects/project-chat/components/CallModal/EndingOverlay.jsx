import React from "react";
import { END_CONFIG } from "../../utils/CallHelpers";
import { useCallEndSound } from "../../hooks/call/useCallEndSound";
import useCallStore from "../../store/call.store";
import { cn } from "../../../../../shared/config/utils";

function EndingOverlay() {
  const { callState, endReason } = useCallStore();

  const cfg = END_CONFIG[endReason] ?? END_CONFIG.ended;
  const Icon = cfg.icon;
  useCallEndSound(callState);

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
        <span
          className={cn("absolute rounded-full w-20 h-20", cfg.bg)}
          style={{ animation: "ripple 1.4s ease-out infinite" }}
        />
        <span
          className={cn("absolute rounded-full w-20 h-20", cfg.bg)}
          style={{ animation: "ripple 1.4s ease-out 0.5s infinite" }}
        />
        <div
          className={cn(
            "relative w-16 h-16 rounded-full flex items-center justify-center",
            cfg.bg,
          )}
        >
          <Icon className={cn("w-7 h-7", cfg.iconColor)} />
        </div>
      </div>

      <div className="text-center">
        <p className="text-white font-semibold text-base">{cfg.title}</p>
        <p className="text-zinc-400 text-sm mt-1">{cfg.sub}</p>
      </div>

      <div className="w-32 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-zinc-500 rounded-full"
          style={{ animation: "shrink 5s linear both" }}
        />
      </div>
    </div>
  );
}

export default EndingOverlay;
