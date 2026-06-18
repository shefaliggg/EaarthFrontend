import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { cn } from "../../config/utils";
import { CircularProgress } from "../ui/circular-progress";

export function AlertBanner({
  icon,
  title,
  description,
  progress,
  progressVariant = "bar",
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-background px-3 py-3 shadow",
        "flex flex-col gap-3",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 ">
        <div className="flex items-start gap-3 min-w-0">
          {icon && <div className={cn("shrink-0 text-red-500", description && "mt-0.5")}>{icon}</div>}

          <div className="min-w-0">
            <h3 className="font-medium text-sm">{title}</h3>

            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {progressVariant === "circle" && progress !== undefined && (
            <CircularProgress
              size={40}
              strokeWidth={4}
              // showLabel={false}
              value={progress}
            />
          )}
          {action && (
            <Button onClick={action.onClick} disabled={action.disabled} size="sm" className={"cursor-pointer"}>
              {action.label}
            </Button>
          )}
        </div>
      </div>

      {(progressVariant === "bar" && progress !== undefined) ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {progressVariant === "bar" && progress !== undefined && (
            <div className="flex-1">
              <Progress value={progress} className="h-2" />

              {/* <span className="mt-1 block text-xs text-muted-foreground">
                {progress}% completed
              </span> */}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
