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
      <CardContent className="p flex flex-col items-center text-center gap-2.5">
        <IconComponent className={cn("w-7 h-7 flex-shrink-0", stage.color)} />
        <div className="w-full">
          <p className="text-xs text-muted-foreground font-semibold truncate leading-tight mb-1">
            {stage.label}
          </p>
          {count !== null ? (
            <p className="text-2xl font-bold leading-none">{count}</p>
          ) : (
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <Plus className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">New</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}