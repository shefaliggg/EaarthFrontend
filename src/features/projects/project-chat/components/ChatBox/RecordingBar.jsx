import React from "react";
import { X, Pause, Play, Square } from "lucide-react";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function RecordingBar({
  recordingTime,
  recordingState,
  previewUrl,
  onCancel,
  onPause,
  onResume,
  onStop,
  onSend,
}) {
  const isRecording = recordingState === "recording";
  const isPaused = recordingState === "paused";
  const isPreview = recordingState === "preview";

  return (
    <div className="flex items-center gap-3 bg-red-500/10 p-3 rounded-xl border border-red-500/20">

      {!isPreview && (
        <>
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-yellow-500"}`} />
            <span className="text-sm font-medium text-red-600">
              {isPaused ? "Paused" : "Recording"}: {formatTime(recordingTime)}
            </span>
          </div>

          {isRecording && (
            <button
              onClick={onPause}
              className="p-2 hover:bg-red-500/20 rounded-lg"
            >
              <Pause className="w-4 h-4 text-red-500" />
            </button>
          )}

          {isPaused && (
            <button
              onClick={onResume}
              className="p-2 hover:bg-red-500/20 rounded-lg"
            >
              <Play className="w-4 h-4 text-red-500" />
            </button>
          )}

          <button
            onClick={onStop}
            className="p-2 hover:bg-red-500/20 rounded-lg"
          >
            <Square className="w-4 h-4 text-red-500" />
          </button>
        </>
      )}

      {isPreview && (
        <>
          <div className="flex-1">
            <audio controls src={previewUrl} className="w-full" />
          </div>

          <button
            onClick={onCancel}
            className="p-2 hover:bg-red-500/20 rounded-lg"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>

          <button
            onClick={onSend}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
          >
            Send
          </button>
        </>
      )}
    </div>
  );
}
