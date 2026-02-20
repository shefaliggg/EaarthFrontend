import React, { useRef, useState, useEffect } from "react";
import { X, Pause, Play, Square } from "lucide-react";
import useChatStore from "../../store/chat.store";
import { toast } from "sonner";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function RecordingBar({ selectedChat, onClose }) {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);

  const [recordingState, setRecordingState] = useState("recording");
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { sendMessage } = useChatStore();

  useEffect(() => {
     if (mediaRecorderRef.current) return;
    startRecording();
    return cleanupRecording;
  }, []);

  const startRecording = async () => {
    console.log("🎙️ startRecording called");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        setAudioBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        setRecordingState("preview");
      };

      mediaRecorder.start();
      setRecordingState("recording");
      setRecordingTime(0);
    } catch (err) {
      console.error("Mic permission denied", err);
      onClose(); // close bar if permission denied
    }
  };

  const stopMicrophone = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      audioStreamRef.current = null;
    }
  };

  const pauseRecording = () => {
    mediaRecorderRef.current?.pause();
    setRecordingState("paused");
  };

  const resumeRecording = () => {
    mediaRecorderRef.current?.resume();
    setRecordingState("recording");
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // Stop mic immediately
    stopMicrophone();
  };

  const cleanupRecording = () => {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {}

    stopMicrophone();

    mediaRecorderRef.current = null;
    audioChunksRef.current = [];

    setRecordingState("idle");
    setRecordingTime(0);
    setAudioBlob(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSendVoice = async () => {
    if (!audioBlob) return;

    const file = new File([audioBlob], `voice-${Date.now()}.webm`, {
      type: "audio/webm",
    });

    const formData = new FormData();
    formData.append("attachments", file);
    formData.append("projectId", selectedChat.projectId);
    formData.append("type", "AUDIO");

    cleanupRecording();
    onClose();

    sendMessage(selectedChat.id, selectedChat.projectId, {
      formData,
    }).catch((err) => {
      toast.error("Failed to send Voice message", err);
    });
  };

  // ⏱ Timer
  useEffect(() => {
    if (recordingState !== "recording") return;

    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [recordingState]);

  const isRecording = recordingState === "recording";
  const isPaused = recordingState === "paused";
  const isPreview = recordingState === "preview";

  return (
    <div className="flex items-center gap-3 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
      {!isPreview && (
        <>
          <div className="flex items-center gap-2 flex-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-yellow-500"
              }`}
            />
            <span className="text-sm font-medium text-red-600">
              {isPaused ? "Paused" : "Recording"}: {formatTime(recordingTime)}
            </span>
          </div>

          {isRecording && (
            <button
              onClick={pauseRecording}
              className="p-2 hover:bg-red-500/20 rounded-lg"
            >
              <Pause className="w-4 h-4 text-red-500" />
            </button>
          )}

          {isPaused && (
            <button
              onClick={resumeRecording}
              className="p-2 hover:bg-red-500/20 rounded-lg"
            >
              <Play className="w-4 h-4 text-red-500" />
            </button>
          )}

          <button
            onClick={stopRecording}
            className="p-2 hover:bg-red-500/20 rounded-lg"
          >
            <Square className="w-4 h-4 text-red-500" />
          </button>

          <button
            onClick={() => {
              cleanupRecording();
              onClose();
            }}
            className="p-2 hover:bg-red-500/20 rounded-lg"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </>
      )}

      {isPreview && (
        <>
          <div className="flex-1">
            <audio controls src={previewUrl} className="w-full" />
          </div>

          <button
            onClick={() => {
              cleanupRecording();
              onClose();
            }}
            className="p-2 hover:bg-red-500/20 rounded-lg"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>

          <button
            onClick={handleSendVoice}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
          >
            Send
          </button>
        </>
      )}
    </div>
  );
}
