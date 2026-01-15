import { Card, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/config/utils";
import { SmartIcon } from "../SmartIcon";
import { convertToPrettyText } from "../../config/utils";

export function SecondaryMetricsCard({
    title,
    value,
    valueColor = "text-foreground",
    icon: Icon,
    iconColor = "text-primary",
    subtext,
    subtextColor,
    showProgress = false,
    progressValue,
}) {
    return (
        <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl border border-gray-100 dark:border-gray-800">
            <CardContent className="p-0 h-full flex flex-col justify-between gap-3">

                {/* Header */}
                <div className="flex items-center gap-1">
                    <SmartIcon icon={Icon} className={cn(iconColor)} size="sm" />
                    <div className="text-xs font-medium text-muted-foreground tracking-wide">
                        {convertToPrettyText(title)}
                    </div>
                </div>

                {/* Value */}
                <div className={cn("text-xl font-bold leading-tight", valueColor)}>
                    {value}
                    {subtext && (
                        <span className={cn("text-xs ml-2 text-muted-foreground font-medium", subtextColor)}>
                            ({subtext})
                        </span>
                    )}
                </div>

                {/* subtext */}


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
