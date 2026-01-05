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
  iconColor = "text-primary",
  indicatorText,
  inidicatorBg = "text-primary",
  indicatorIcon
}) {
  return (
    <Card className="p-6">
      <CardContent className="p-0 space-y-6">
        <div className="flex items-start justify-between h-full">

          <div className="space-y-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {title}
            </p>

            <p className={cn("text-3xl font-bold leading-none", valueColor)}>
              {value}
            </p>

            {subtext && (
              <p className={cn("text-xs mt-1", subtextColor ? subtextColor : "text-muted-foreground")}>
                {subtext}
              </p>
            )}
          </div>

          <div className="flex flex-col h-full justify-between items-end">
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
            {indicatorText && (
              
              <div
                className={cn(
                  "flex items-center justify-center shrink-0",
                  inidicatorBg
                )}
              >
                <SmartIcon
                  icon={indicatorIcon}
                  className={cn("w-5 h-5", inidicatorBg)}
                />
                {indicatorText}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
