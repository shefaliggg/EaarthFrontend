import { Card, CardContent } from "@/shared/components/ui/card";
import { Plus } from "lucide-react";
import { cn } from "@/shared/config/utils";

export function StageCard({ stage, count, isSelected, isAction, onClick }) {
  const IconComponent = stage.icon;
  
  return (
    <Card 
      className={cn(
        "border cursor-pointer transition-all hover:shadow-md py-4 px-0",
        isAction && "border-primary border-dashed bg-gradient-to-br from-primary/5 to-primary/10",
        isSelected && !isAction && "ring-2 ring-primary"
      )}
      onClick={onClick}
      data-testid={`card-stage-${stage.label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-3 flex flex-col items-center justify-center text-center gap-2 min-h-[90px]">
        {/* Icon at top */}
        <IconComponent className={cn("w-5 h-5 shrink-0", stage.color)} />
        
        {/* Label */}
        <p className="text-xs text-muted-foreground font-medium leading-tight line-clamp-2">
          {stage.label}
        </p>
        
        {/* Count or New */}
        {count !== null ? (
          <p className="text-xl font-bold leading-none">{count}</p>
        ) : (
          <div className="flex items-center gap-1">
            <Plus className="w-3 h-3 text-primary" />
            <span className="text-xs font-semibold text-primary">New</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
