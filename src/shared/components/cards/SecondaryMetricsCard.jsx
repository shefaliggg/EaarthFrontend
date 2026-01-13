import { Card, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/config/utils";
import { SmartIcon } from "../SmartIcon";

export function SecondaryMetricsCard({
    title,
    value,
    valueColor = "text-foreground",
    icon: Icon,
    iconColor = "text-primary",
    subText,
    subTextColor,
    showProgress = false,
    progressValue,
}) {
    return (
        <Card className="p-5 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl border border-gray-100 dark:border-gray-800">
            <CardContent className="p-0 space-y-3">
                
                {/* Header */}
                <div className="flex items-center gap-3">
                    <SmartIcon icon={Icon} className={cn("w-5 h-5", iconColor)} />
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {title}
                    </div>
                </div>

                {/* Value */}
                <div className={cn("text-2xl font-bold leading-tight", valueColor)}>
                    {value}
                </div>

                {/* Subtext */}
                {subText && (
                    <div className={cn("text-sm text-muted-foreground font-medium", subTextColor)}>
                        {subText}
                    </div>
                )}

                {/* Progress */}
                {showProgress && (
                    <Progress
                        value={progressValue}
                        className="h-2 rounded-full bg-gray-200 dark:bg-gray-700"
                        style={{ transition: "width 0.3s ease" }}
                    />
                )}
            </CardContent>
        </Card>
    );
}
