import React, { useRef, useState, useEffect } from "react";
import { X, Pause, Play, Square, Send, SendHorizonal } from "lucide-react";
import useChatStore from "../../store/chat.store";
import { toast } from "sonner";
import { Button } from "../../../../../shared/components/ui/button";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function RecordingBar({ selectedChat, onClose }) {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [recordingState, setRecordingState] = useState("recording");
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { sendMessage } = useChatStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setMeta = () => setDuration(audio.duration);
    const onEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setMeta);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [previewUrl]);

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

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
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
    <div className="flex items-center gap-3 bg-red-500/10 p-3 py-1.5 rounded-3xl border border-red-500/20">
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
          <div className="flex-1 flex items-center gap-3 rounded-3xl px-4 py-1">
            <audio ref={audioRef} src={previewUrl} />

            <button
              onClick={togglePlay}
              className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <div className="flex-1 mt-3">
              <div className="h-1 bg-gray-300 rounded-full relative">
                <div
                  className="h-1 bg-red-500 rounded-full"
                  style={{
                    width: `${(currentTime / duration) * 100 || 0}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTime(Math.floor(currentTime))} /{" "}
                {formatTime(Math.floor(duration))}
              </div>
            </div>
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

          <Button
            onClick={handleSendVoice}
            variant={"destructive"}
            className="rounded-full"
          >
            <SendHorizonal/>
            Send
          </Button>
        </>
      )}
    </div>
  );
}
