import { useEffect, useRef } from "react";
import { soundManager } from "../../../../../shared/config/soundManager";

export function useCallSounds({
  callState,
  incomingCall,
  participantCount,
  isInitiator,
  hadParticipants,
}) {
  const currentSoundRef = useRef(null);

  // console.log("call sound parameters",{
  //   callState,
  //   participantCount,
  //   isInitiator,
  //   hadParticipants,
  // });

  const isIncoming = callState === "incoming" && incomingCall;

  useEffect(() => {
    if (callState === "ending") {
      soundManager.play("ending", {
        volume: 0.8,
        duration: 150,
        channel: "call",
      });
    }
  }, [callState]);

  useEffect(() => {
    if (isIncoming) {
      soundManager.play("incoming", {
        volume: 0.9,
        duration: 250,
        channel: "call",
      });
    } else {
      soundManager.stop("incoming");
    }
  }, [isIncoming]);

  useEffect(() => {
    if (callState === "ending") return;

    const run = async () => {
      if (participantCount > 1) {
        await soundManager.stopChannel("call");
        currentSoundRef.current = null;
        return;
      }

      const isConnecting = callState === "connecting";

      const isRinging =
        isInitiator &&
        callState === "connected" &&
        participantCount === 1 &&
        !hadParticipants;

      if (isConnecting) {
        if (currentSoundRef.current !== "connecting") {
          await soundManager.play("connecting", {
            volume: 0.1,
            duration: 300,
            channel: "call",
          });
          currentSoundRef.current = "connecting";
        }
      } else if (isRinging) {
        if (currentSoundRef.current !== "ringing") {
          await soundManager.play("ringing", {
            volume: 0.6,
            duration: 300,
            channel: "call",
          });
          currentSoundRef.current = "ringing";
        }
      } else {
        await soundManager.stopChannel("call");
        currentSoundRef.current = null;
      }
    };

    run();
  }, [callState, participantCount, isInitiator, hadParticipants]);
}
