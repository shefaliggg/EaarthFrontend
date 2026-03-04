import { useEffect, useRef } from "react";
import { fadeIn, fadeOut } from "../../../../../shared/config/audioUtils";

export function useIncomingRingtone(isActive) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/sounds/incoming-call-ringtone.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.9;

    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const run = async () => {
      if (isActive) {
        audio.currentTime = 0;
        await fadeIn(audio, 0.9, 250);
      } else {
        await fadeOut(audio, 300);
      }
    };

    run();
  }, [isActive]);
}
