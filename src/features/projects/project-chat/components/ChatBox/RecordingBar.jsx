// src/features/chat/components/ChatBox/RecordingBar.jsx
// ✅ EXACT UI: Recording bar matching original design

import React from "react";
import { X } from "lucide-react";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function RecordingBar({ recordingTime, onCancel, onSend }) {
  return (
    <div className="flex items-center gap-3 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
      <div className="flex items-center gap-2 flex-1">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-red-600">
          Recording: {formatTime(recordingTime)}
        </span>
      </div>
      <button
        onClick={onCancel}
        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
        aria-label="Cancel recording"
      >
        <X className="w-4 h-4 text-red-500" />
      </button>
      <button
        onClick={onSend}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
        aria-label="Send recording"
      >
        Send
      </button>
    </div>
  );
}