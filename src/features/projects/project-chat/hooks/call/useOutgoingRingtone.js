import { useEffect, useRef } from "react";
import { fadeIn, fadeOut } from "../../../../../shared/config/audioUtils";

export function useOutgoingRingtone({
  callState,
  participantCount,
  isInitiator,
  hadParticipants
}) {
  const connectingRef = useRef(null);
  const ringingRef = useRef(null);
  const currentSoundRef = useRef(null);

  useEffect(() => {
    const connecting = new Audio("/sounds/call-connecting-tone.mp3");
    connecting.loop = true;
    connecting.volume = 0.1;
    connecting.preload = "auto";

    const ringing = new Audio("/sounds/outgoing-call-ringtone.mp3");
    ringing.loop = true;
    ringing.volume = 0.6;
    ringing.preload = "auto";

    connectingRef.current = connecting;
    ringingRef.current = ringing;

    return () => {
      connecting.pause();
      ringing.pause();
    };
  }, []);

  useEffect(() => {
    const run = async () => {
      const connecting = connectingRef.current;
      const ringing = ringingRef.current;
      if (!connecting || !ringing) return;

      // Stop everything first
      const stopAll = async () => {
        await Promise.all([fadeOut(connecting, 250), fadeOut(ringing, 250)]);
      };

      if (participantCount > 1) {
        await stopAll();
        currentSoundRef.current = null;
        return;
      }

      const isConnecting = callState === "connecting";

      const isRinging =
        isInitiator && callState === "connected" && participantCount === 1 && !hadParticipants;

      if (isConnecting) {
        if (currentSoundRef.current !== "connecting") {
          await stopAll();
          await fadeIn(connecting, 0.1, 300);
          currentSoundRef.current = "connecting";
        }
      } else if (isRinging) {
        if (currentSoundRef.current !== "ringing") {
          await stopAll();
          await fadeIn(ringing, 0.6, 300);
          currentSoundRef.current = "ringing";
        }
      } else {
        await stopAll();
        currentSoundRef.current = null;
      }
    };

    run();
  }, [callState, participantCount, isInitiator]);
}
