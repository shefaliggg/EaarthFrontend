import { cn } from "@/shared/config/utils";
import { CheckCircle } from "lucide-react";
import { Progress } from "../ui/progress";

export function Stepper({ steps, activeStep }) {
  return (
    <div className="w-full flex justify-center">
      <div className="flex items-start justify-center max-w-4xl w-full">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;

          return (
            <div key={step.id} className="flex items-start">
              {/* STEP */}
              <div className="flex flex-col items-center min-w-[140px]">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition",
                    (isCompleted || isActive) &&
                      "bg-primary text-background",
                    !isCompleted &&
                      !isActive &&
                      "bg-primary/10 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                <span
                  className={cn(
                    "mt-2 text-xs text-center leading-tight max-w-[120px]",
                    isActive && "text-primary font-semibold",
                    !isActive && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* CONNECTOR */}
              {index !== steps.length - 1 && (
                <Progress
                  value={isCompleted ? 100 : 0}
                  className="w-34 h-1 mt-3 -mx-10"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
