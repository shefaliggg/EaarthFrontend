import {
  Search,
  Settings2,
  Reply,
  Edit3,
  Forward,
  Star,
  Trash,
  CheckCheck,
  Mic,
  Play,
  Sparkles,
  Smile,
  Send,
  Bot,
} from "lucide-react";
import { cn } from "@/shared/config/utils";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";

export default function TeamChatProduction() {
  const messages = [
    {
      id: 1,
      sender: "Team Lead",
      avatar: "TL",
      time: "10:30 AM",
      content:
        "Hey team, just reviewed the latest updates. Looks great but we need to coordinate on timing.",
      readBy: 12,
    },
    {
      id: 2,
      sender: "Zoe Saldana",
      avatar: "ZS",
      time: "10:35 AM",
      type: "voice",
    },
    {
      id: 3,
      sender: "You",
      avatar: "YO",
      time: "10:40 AM",
      content: "This is my test message that can be edited or deleted.",
    },
  ];

  return (
    <div className="rounded-xl border bg-card shadow-sm h-[750px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              TC
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-bold text-lg">Team Chat - Production</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>125 members • 45 online</span>
              <span className="w-1 h-1 bg-muted-foreground rounded-full" />
              <span className="flex items-center gap-1 text-green-500 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="h-9 px-3 rounded-lg text-xs flex items-center gap-2 border bg-muted hover:bg-muted-foreground/10">
            <Sparkles className="w-4 h-4" />
            Summarize
          </button>

          <button className="h-9 px-3 rounded-lg text-xs flex items-center gap-2 border bg-muted hover:bg-muted-foreground/10">
            Translate
          </button>

          <div className="w-px h-9 bg-border mx-1" />

          <button className="p-2 rounded-lg hover:bg-muted">
            <Search className="w-5 h-5" />
          </button>

          <button className="p-2 rounded-lg hover:bg-muted">
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3 group">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{msg.avatar}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{msg.sender}</span>
                <span className="text-xs text-muted-foreground">
                  {msg.time}
                </span>
                {msg.readBy && (
                  <Badge variant="outline" className="text-[10px]">
                    Read by {msg.readBy}
                  </Badge>
                )}
              </div>

              {/* Text Message */}
              {msg.content && (
                <div className="bg-muted p-3 rounded-lg max-w-lg">
                  <p className="text-sm">{msg.content}</p>
                  {msg.readBy && (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                      <span className="text-[10px] text-muted-foreground">
                        Seen
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Voice Message */}
              {msg.type === "voice" && (
                <div className="bg-muted p-3 rounded-lg max-w-md flex items-center gap-3">
                  <button className="p-2 rounded-full bg-primary text-primary-foreground">
                    <Play className="w-4 h-4" />
                  </button>

                  <div className="flex-1 flex items-center gap-1 h-8">
                    {[...Array(18)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary/50 rounded-full"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>

                  <span className="text-xs text-muted-foreground">0:23</span>
                  <Mic className="w-4 h-4 text-muted-foreground" />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition">
                <ActionBtn icon={Reply} label="Reply" />
                <ActionBtn
                  icon={Edit3}
                  label="Edit"
                  className="text-blue-500"
                />
                <ActionBtn icon={Forward} label="Forward" />
                <ActionBtn icon={Star} label="Star" />
                <ActionBtn
                  icon={Trash}
                  label="Delete"
                  className="text-red-500"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>MJ</AvatarFallback>
          </Avatar>

          <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <span
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span className="text-xs text-muted-foreground">typing...</span>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t p-4 space-y-3">
        {/* Smart Replies */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />

          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {[
              { label: "Sounds good", variant: "default" },
              { label: "I'll review it", variant: "muted" },
              { label: "Schedule meeting", variant: "outline" },
              { label: "Approved", variant: "success" },
            ].map((item, i) => (
              <button
                key={i}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  "hover:shadow-sm hover:border-primary",
                  item.variant === "default" &&
                    "bg-primary/10 text-primary border-primary/30",
                  item.variant === "muted" &&
                    "bg-muted text-muted-foreground border-border",
                  item.variant === "outline" &&
                    "bg-card text-foreground border-border",
                  item.variant === "success" &&
                    "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Box */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-muted">
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>

          <Input placeholder="Type a message..." className="flex-1" />

          <button className="p-2 rounded-lg hover:bg-muted">
            <Mic className="w-5 h-5 text-primary" />
          </button>

          <button className="h-9 px-4 rounded-lg text-xs flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90">
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, className }) {
  return (
    <button
      className={cn(
        "text-xs px-2 py-1 rounded flex items-center gap-1 bg-muted hover:bg-muted-foreground/10",
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}
