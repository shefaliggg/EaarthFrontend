import {
  Video,
  ScreenShare,
  Users2,
  Image,
  Circle,
  FileText,
  Mic,
} from "lucide-react";
import { cn } from "@/shared/config/utils";

export default function VideoVoiceCommunication({
  title = "Video & Voice Communication",
  subtitle = "Connect with your team instantly",
  onMeetingNotes,
  onTranscribe,
  onVideoCall,
}) {
  return (
    <div
      className={cn(
        "rounded-xl border shadow-sm p-5",
        "bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-purple-500/10",
        "border-primary/30"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white">
            <Video className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onMeetingNotes}
            className="h-9 px-3 rounded-lg text-xs flex items-center gap-2 border bg-muted hover:bg-muted-foreground/10 transition"
          >
            <FileText className="w-4 h-4" />
            Meeting Notes
          </button>

          <button
            onClick={onTranscribe}
            className="h-9 px-3 rounded-lg text-xs flex items-center gap-2 border bg-muted hover:bg-muted-foreground/10 transition"
          >
            <Mic className="w-4 h-4" />
            Transcribe
          </button>

          <button
            onClick={onVideoCall}
            className="h-9 px-4 rounded-lg text-xs flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <Video className="w-4 h-4" />
            Video Call
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { icon: ScreenShare, label: "Screen Share", color: "text-primary" },
          { icon: Circle, label: "Record", color: "text-red-500" },
          { icon: Users2, label: "Breakout", color: "text-primary" },
          { icon: Image, label: "Background", color: "text-primary" },
        ].map((item, i) => (
          <button
            key={i}
            className={cn(
              "p-3 rounded-lg border text-center transition-all",
              "hover:scale-105 hover:border-primary",
              "bg-card"
            )}
          >
            <item.icon className={cn("w-5 h-5 mx-auto mb-1", item.color)} />
            <p className="text-xs">{item.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
