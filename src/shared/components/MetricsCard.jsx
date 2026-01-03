import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/config/utils";
import { SmartIcon } from "./SmartIcon";

export function MetricsCard({
  title,
  subtext,
  subtextColor,
  value,
  valueColor = "text-foreground",
  icon,
  iconBg,
  iconColor = "text-blue-500",
}) {
  return (
    <Card className="p-6">
      <CardContent className="p-0 space-y-6">
        <div className="flex items-start justify-between">

          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {title}
            </p>

            <p className={cn("text-2xl font-bold leading-none", valueColor)}>
              {value}
            </p>

            {subtext && (
              <p className={cn("text-sm mt-1", subtextColor ? subtextColor : "text-muted-foreground")}>
                {subtext}
              </p>
            )}
          </div>

          {icon && (
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                iconBg
              )}
            >
              <SmartIcon
                icon={icon}
                className={cn("w-5 h-5", iconColor)}
              />
            </div>
          )}

        </div>
      </CardContent>
    </Card>
  );
}
