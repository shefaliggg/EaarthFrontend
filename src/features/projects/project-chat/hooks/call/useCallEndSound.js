import { useEffect, useRef } from "react";
import { fadeIn } from "../../../../../shared/config/audioUtils";

export function useCallEndSound(callState) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/sounds/call-ending-tone.mp3");
    audio.preload = "auto";
    audio.volume = 0.8;

    audioRef.current = audio;

    return () => {
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (callState === "ending") {
      const audio = audioRef.current;
      if (!audio) return;

      fadeIn(audio, 0.8, 150);
    }
  }, [callState]);
}
