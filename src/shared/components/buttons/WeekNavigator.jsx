import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { formatWeekRange, getWeekRange } from "../../config/dateHelperUtils";
import { cn } from "../../config/utils";
import { InfoTooltip } from "../InfoTooltip";

export function WeekNavigator({
    currentDate,
    onPreviousWeek,
    onNextWeek,
    onGoToCurrentWeek,
    className
}) {
    const { monday, sunday } = getWeekRange(currentDate);

    const today = new Date();
    const { monday: currentWeekStart, sunday: currentWeekEnd } =
        getWeekRange(today);

    const isCurrentWeek =
        currentDate >= currentWeekStart && currentDate <= currentWeekEnd;

    return (
        <div className={cn("flex items-center gap-2 px-3", className)}>
            <div className="flex items-center gap-6">
                {/* Previous */}
                <InfoTooltip
                    content={"Navigate to Previous week"}
                >
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onPreviousWeek}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </InfoTooltip>
                {/* Center content */}
                <div className="flex flex-col gap-0.5 items-center justify-center text-center">
                    <span className="font-semibold">
                        {formatWeekRange(monday, sunday)}
                    </span>
                    {!isCurrentWeek && (
                        <InfoTooltip
                            content={"Navigate to Current week"}
                            side="bottom"
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onGoToCurrentWeek}
                                className={"text-xs h-auto py-1 text-muted-foreground"}
                            >
                                <Calendar />
                                Go to Current
                            </Button>
                        </InfoTooltip>
                    )}
                </div>

                {/* Next */}
                <InfoTooltip
                    content={"Navigate to Next week"}
                >
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onNextWeek}
                        aria-label="Next week"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </InfoTooltip>
            </div>
        </div>
    );
}
