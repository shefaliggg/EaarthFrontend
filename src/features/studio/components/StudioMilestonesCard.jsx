import { Card } from "@/shared/components/ui/card";
import { Clock } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

export default function StudioMilestonesCard({ milestones }) {
  return (
    <Card className="p-5 rounded-xl border border-border shadow-md space-y-4 bg-card">
      
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">MILESTONES</h3>
      </div>

      {milestones.map((m, i) => (
        <div
          key={i}
          className="p-3 rounded-lg border border-border/40 bg-muted/30 space-y-1"
        >
          <div className="flex justify-between items-start">
            
            <div className="space-y-1">
              <Badge 
                variant="outline"
                className="text-[10px] font-semibold px-2 py-1 rounded-md uppercase tracking-wide border-border/40"
              >
                {m.project}
              </Badge>

              <p className="font-bold text-sm">{m.task}</p>
              <p className="text-xs text-muted-foreground">{m.date}</p>
            </div>

            <span className="px-2 py-1 text-[10px] rounded bg-red-500/20 text-red-400">
              {m.dueIn}d
            </span>
          </div>
        </div>
      ))}
    </Card>
  );
}
