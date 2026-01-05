import { Card, CardContent } from "@/shared/components/ui/card";
import { Plus } from "lucide-react";
import { cn } from "@/shared/config/utils";

export function StageCard({ stage, count, isSelected, isAction, onClick }) {
  const IconComponent = stage.icon;
  
  return (
    <Card 
      className={cn(
        "border cursor-pointer transition-all hover:shadow-md",
        isAction && "border-primary border-dashed bg-gradient-to-br from-primary/5 to-primary/10",
        isSelected && !isAction && "ring-2 ring-primary"
      )}
      onClick={onClick}
      data-testid={`card-stage-${stage.label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className=" flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">{stage.label}</p>
          {count !== null ? (
            <p className="text-2xl font-bold mt-0.5">{count}</p>
          ) : (
            <div className="flex items-center gap-1 mt-1">
              <Plus className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">New</span>
            </div>
          )}
        </div>
        <IconComponent className={cn("w-6 h-6", stage.color)} />
      </CardContent>
    </Card>
  );
}