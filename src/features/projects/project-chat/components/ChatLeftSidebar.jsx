import { Hash, Mail, Users, Briefcase, Video, Zap, Mic, Shield, Utensils } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/config/utils";

export default function ChatLeftSidebar({ active = "team" }) {
  const departments = [
    { id: "production", name: "Production", icon: Briefcase, members: 15, unread: 3 },
    { id: "camera", name: "Camera Department", icon: Video, members: 8, unread: 0 },
    { id: "stunts", name: "Stunt Team", icon: Zap, members: 12, unread: 5 },
    { id: "sound", name: "Sound Department", icon: Mic, members: 6, unread: 1 },
    { id: "security", name: "Security", icon: Shield, members: 10, unread: 0 },
    { id: "catering", name: "Catering", icon: Utensils, members: 7, unread: 2 },
  ];

  return (
    <div className="space-y-6">

      {/* Conversations */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="font-bold mb-4">Conversations</h3>

        <div className="space-y-2">
          {/* Team Chat */}
          <button
            className={cn(
              "w-full p-3 rounded-lg text-left flex items-center gap-3 transition-all",
              active === "team"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <Hash className="w-5 h-5" />
            <div className="flex-1">
              <p className="text-sm font-bold">Team Chat</p>
              <p className="text-xs opacity-80">All project members</p>
            </div>
          </button>

          {/* Email */}
          <button
            className={cn(
              "w-full p-3 rounded-lg text-left flex items-center gap-3 transition-all",
              active === "email"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <Mail className="w-5 h-5" />
            <div className="flex-1">
              <p className="text-sm font-bold">Email</p>
              <p className="text-xs opacity-80">External contacts</p>
            </div>
            <span className="px-2 py-1 rounded text-xs bg-muted hover:bg-muted-foreground/10">
              Compose
            </span>
          </button>
        </div>
      </div>

      {/* Departments */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Departments</h3>
          <Badge variant="outline" className="text-[10px]">6 groups</Badge>
        </div>

        <div className="space-y-2">
          {departments.map((dept) => (
            <button
              key={dept.id}
              className="w-full p-2 rounded-lg text-left flex items-center gap-2 transition-all hover:bg-muted"
            >
              <dept.icon className="w-4 h-4 text-primary" />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{dept.name}</p>
                <p className="text-xs text-muted-foreground">
                  {dept.members} members
                </p>
              </div>

              {dept.unread > 0 && (
                <Badge className="bg-primary text-primary-foreground text-[10px] h-5 min-w-5 flex items-center justify-center">
                  {dept.unread}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Direct Messages</h3>
          <button className="text-xs text-primary hover:underline">
            New
          </button>
        </div>

        <div className="space-y-2">
          {["Marcus Johnson", "Sarah Lee", "Daniel Cruz"].map((name, i) => (
            <button
              key={i}
              className="w-full p-2 rounded-lg text-left flex items-center gap-2 transition-all hover:bg-muted"
            >
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {name.split(" ").map(n => n[0]).join("")}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  Available
                </p>
              </div>
            </button>
          ))}
        </div>

        <button className="w-full mt-4 text-xs py-2 rounded-lg bg-muted hover:bg-muted-foreground/10 flex items-center justify-center gap-2">
          <Users className="w-4 h-4" />
          View All Members
        </button>
      </div>

    </div>
  );
}
