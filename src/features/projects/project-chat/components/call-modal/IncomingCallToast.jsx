import { Phone, PhoneOff, Video } from "lucide-react";
import useCallStore from "../../store/call.store";

export default function IncomingCallToast() {
  const { callState, incomingCall, joinCallSafely, declineCall } =
    useCallStore();

  const isVisible = callState === "incoming" && incomingCall;

  if (!isVisible) return null;

  const { callType, initiatorName, conversationId } = incomingCall;

  return (
    <div className="fixed bottom-6 right-6 z-[200] w-80 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          {callType === "VIDEO" ? (
            <Video className="w-5 h-5 text-primary" />
          ) : (
            <Phone className="w-5 h-5 text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {initiatorName || "Someone"}
          </p>
          <p className="text-zinc-400 text-xs mt-0.5 animate-pulse">
            Incoming {callType === "VIDEO" ? "video" : "audio"} call…
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={declineCall}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors"
        >
          <PhoneOff className="w-4 h-4" />
          Decline
        </button>
        <button
          onClick={() =>
            joinCallSafely({
              conversationId,
              callType,
            })
          }
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors"
        >
          {callType === "VIDEO" ? (
            <Video className="w-4 h-4" />
          ) : (
            <Phone className="w-4 h-4" />
          )}
          Answer
        </button>
      </div>
    </div>
  );
}
