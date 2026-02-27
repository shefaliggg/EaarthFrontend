import React from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Users,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import useCallStore from "../../store/call.store";

function ControlButton({ onClick, active, danger, disabled, children, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "flex flex-col items-center gap-1 group",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all",
          active
            ? "bg-primary/50 hover:bg-primary"
            : danger
              ? "bg-red-500 hover:bg-red-600"
              : "bg-zinc-800 hover:bg-zinc-700"
        )}
      >
        {children}
      </div>
      <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 transition-colors">
        {label}
      </span>
    </button>
  );
}

export default function CallControls({ onShowParticipants }) {
  const {
    isAudioMuted,
    isVideoOff,
    isSharingScreen,
    callType,
    toggleMute,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    leaveCall,
    endCallForEveryone,
  } = useCallStore();

  const handleScreenShare = () => {
    if (isSharingScreen) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 px-6 py-3 bg-primary/10 border-t border-primary/10 rounded-b-2xl">
      {/* Mute */}
      <ControlButton
        onClick={toggleMute}
        active={!isAudioMuted}
        label={isAudioMuted ? "Unmute" : "Mute"}
      >
        {isAudioMuted ? (
          <MicOff className="w-5 h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </ControlButton>

      {/* Video (only for video calls) */}
      {callType === "VIDEO" && (
        <ControlButton
          onClick={toggleVideo}
          active={!isVideoOff}
          label={isVideoOff ? "Start Video" : "Stop Video"}
        >
          {isVideoOff ? (
            <VideoOff className="w-5 h-5 text-white" />
          ) : (
            <Video className="w-5 h-5 text-white" />
          )}
        </ControlButton>
      )}

      {/* Screen Share */}
      <ControlButton
        onClick={handleScreenShare}
        active={!isSharingScreen}
        label={isSharingScreen ? "Stop Share" : "Share Screen"}
      >
        {isSharingScreen ? (
          <MonitorOff className="w-5 h-5 text-blue-400" />
        ) : (
          <Monitor className="w-5 h-5 text-white" />
        )}
      </ControlButton>

      {/* Participants */}
      <ControlButton onClick={onShowParticipants} active label="Participants">
        <Users className="w-5 h-5 text-white" />
      </ControlButton>

      {/* Leave */}
      <ControlButton onClick={leaveCall} danger label="Leave">
        <PhoneOff className="w-5 h-5 text-white" />
      </ControlButton>

      {/* End for everyone (could be role-gated in prod) */}
      <ControlButton onClick={endCallForEveryone} danger label="End All">
        <div className="flex flex-col items-center">
          <PhoneOff className="w-4 h-4 text-white" />
          <span className="text-[8px] text-white leading-none">All</span>
        </div>
      </ControlButton>
    </div>
  );
}
