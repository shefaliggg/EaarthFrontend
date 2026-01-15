import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { formatWeekRange, getWeekRange } from "../../config/dateHelperUtils";
import { cn } from "../../config/utils";

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
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onPreviousWeek}
                    aria-label="Previous week"
                    title={"Previous week"}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {/* Center content */}
                <div className="flex flex-col gap-1 items-center justify-center text-center">
                    <span className="text-sm font-semibold">
                        {formatWeekRange(monday, sunday)}
                    </span>
                    {!isCurrentWeek && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onGoToCurrentWeek}
                            title={"Go to Current week"}
                            className={"text-xs h-auto py-1 text-muted-foreground"}
                        >
                            <Calendar />
                            Go to Current
                        </Button>
                    )}
                </div>

                {/* Next */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onNextWeek}
                    aria-label="Next week"
                    title={"Next week"}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
