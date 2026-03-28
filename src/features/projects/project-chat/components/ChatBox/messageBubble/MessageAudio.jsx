import { Download, Mic, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDuration } from "../../../utils/messageHelpers";

function MessageAudio({ message, file, url, single = true, isOwn }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [duration, setDuration] = useState(file?.duration || 0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef(null);

  const isAudioFile = message.type.toLowerCase() === "media";
  const isVoiceMessage = message.type.toLowerCase() === "audio";

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        if (!audioRef.current) return;

        const progress =
          (audioRef.current.currentTime / audioRef.current.duration) * 100;

        setPlayProgress(progress);

        if (progress >= 100) {
          setIsPlaying(false);
          clearInterval(interval);
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    audioRef.current.playbackRate = playbackRate;

    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();

    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className={`
        flex items-center gap-3 col-span-2
        ${single ? "min-w-[260px] max-w-[260px]" : "min-w-[260px] max-w-[260px]"}
        ${isVoiceMessage ? "rounded-full px-3 py-2" : `${isOwn ? "bg-muted/90" : "bg-primary/10"} rounded-md px-3 py-2`}
        ${isAudioFile && !single && isOwn ? "ml-auto" : ""}
      `}
    >
      {/* Play Button */}
      <button
        onClick={togglePlay}
        className={`
          w-9 h-9 flex shrink-0 items-center justify-center rounded-full transition
          ${
            isVoiceMessage
              ? "bg-white/20 hover:bg-white/30"
              : "bg-primary/10 hover:bg-primary/20"
          }
        `}
      >
        {isPlaying ? (
          <Pause
            className={`w-4 h-4 ${
              isVoiceMessage ? "text-white" : "text-primary"
            }`}
          />
        ) : (
          <Play
            className={`w-4 h-4 ${
              isVoiceMessage ? "text-white" : "text-primary"
            }`}
          />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-1">
        {/* File name for audio file */}
        {isAudioFile && (
          <span className="text-[11px] text-muted-foreground truncate">
            {file.name}
          </span>
        )}

        {/* Waveform for voice */}
        {isVoiceMessage && (
          <div className="flex items-end gap-[2px] h-4 pl-1">
            {Array.from({ length: 36 }).map((_, i) => (
              <div
                key={i}
                className="w-[2px] rounded-full bg-white/70"
                style={{
                  height: `${4 + Math.random() * 14}px`,
                  opacity: i / 22 < playProgress / 100 ? 1 : 0.35,
                }}
              />
            ))}
          </div>
        )}

        {/* Progress bar for audio file */}
        {isAudioFile && (
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${playProgress}%` }}
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center">
          <span
            className={`text-[11px] flex items-center gap-1 ${
              isVoiceMessage ? "text-white/90" : "text-muted-foreground"
            }`}
          >
            {isVoiceMessage ? (
              <>
                <Mic className="w-3 h-3" />
                Voice
              </>
            ) : (
              <>
                <Volume2 className="w-3 h-3" />
                Audio
              </>
            )}
          </span>

          <span
            className={`text-[11px] ${
              isVoiceMessage ? "text-white/90" : "text-muted-foreground"
            }`}
          >
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Playback speed (voice only) */}
      {isVoiceMessage && (
        <button
          onClick={() => {
            const nextRate =
              playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
            setPlaybackRate(nextRate);
          }}
          className="text-[11px] px-2 py-1 rounded-full bg-white/20 hover:bg-white/30 transition"
        >
          {playbackRate}x
        </button>
      )}

      {/* Download button for audio file */}
      {isAudioFile && (
        // <Button
        //   variant="ghost"
        //   size="icon"
        //   onClick={() =>
        //     downloadAttachment(message.conversationId, message._id, file)
        //   }
        // >
        //   <Download className="w-4 h-4" />
        // </Button>
        <a
          href={url}
          rel="noopener noreferrer"
          download
          onClick={() => toast.info("Downloading Audio File")}
          className="p-2 hover:bg-muted rounded-lg"
        >
          <Download className="w-4 h-4 text-muted-foreground" />
        </a>
      )}

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={url}
        onLoadedMetadata={() => {
          if (!audioRef.current) return;
          if (!file?.duration) setDuration(audioRef.current.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setPlayProgress(0);
        }}
      />
    </div>
  );
}

export default MessageAudio;
