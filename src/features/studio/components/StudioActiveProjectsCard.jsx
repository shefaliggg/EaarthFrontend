import { Card } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import StudioStageBadge from "./StudioStageBadge";
import { Users, User2, DollarSign, CalendarDays, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudioActiveProjectsCard({ projects }) {
  const navigate = useNavigate()
  return (
<Card className="p-5 rounded-xl bg-card border border-border shadow-md space-y-4">
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <Film className="w-4 h-4 text-primary" />
      <h3 className="font-semibold text-sm">ACTIVE PROJECTS</h3>
    </div>

    <button onClick={() => navigate("/projects")} className="text-primary text-sm font-medium">View All</button>
  </div>

  {projects.map((p) => (
    <div key={p.id} className="p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition shadow-sm">
      
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="font-bold">{p.title}</h4>
          <StudioStageBadge stage={p.stage} />
        </div>
        <p className="text-xs text-muted-foreground">{p.progress}%</p>
      </div>

      <div className="flex items-center gap-5 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1.5">
          <Users className="w-3 h-3" />
          {p.crew} Crew
        </div>

        <div className="flex items-center gap-1.5">
          <User2 className="w-3 h-3" />
          {p.cast} Cast
        </div>

        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3 h-3" />
          ${p.budget}M
        </div>

        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-3 h-3" />
          Starts {p.startDate}
        </div>
      </div>

      <Progress value={p.progress} className="h-2" />
    </div>
  ))}
</Card>

  );
}
