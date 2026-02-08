import {
  format,
  startOfMonth,
  startOfYear,
  addMonths,
  addDays,
  startOfWeek,
} from "date-fns";
import { cn } from "@/shared/config/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import { Clock, MapPin } from "lucide-react";

function getMonthGrid(monthDate) {
  const start = startOfWeek(startOfMonth(monthDate));
  return Array.from({ length: 35 }, (_, i) => addDays(start, i));
}

function CalendarYearView({ currentDate, setCurrentDate, onDayClick, events }) {
  const yearStart = startOfYear(currentDate);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  // Get events for a specific date - works with API data structure
  const getEventsForDate = (date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return events.filter((event) => {
      if (!event.startDateTime) return false;

      const start = new Date(event.startDateTime);
      const end = event.endDateTime ? new Date(event.endDateTime) : start;

      const current = new Date(dateString);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      current.setHours(12, 0, 0, 0);

      return current >= start && current <= end;
    });
  };

  const hasEvents = (date) => getEventsForDate(date).length > 0;

  const isToday = (date) => date.toDateString() === new Date().toDateString();

  // Get event type color for dots
  const getEventDotColor = (eventType) => {
    switch (eventType) {
      case "prep":
        return "bg-sky-500";
      case "shoot":
        return "bg-peach-500";
      case "wrap":
        return "bg-mint-500";
      default:
        return "bg-purple-500";
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-500px)] rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card">
        {/* MONTH GRID */}
        <div className="grid grid-cols-4 gap-4  p-6">
          {months.map((monthDate) => {
            const monthGrid = getMonthGrid(monthDate);
            const monthEvents = events.filter((event) => {
              if (!event.startDateTime) return false;
              const eventMonth = new Date(event.startDateTime).getMonth();
              const eventYear = new Date(event.startDateTime).getFullYear();
              return (
                eventMonth === monthDate.getMonth() &&
                eventYear === monthDate.getFullYear()
              );
            });

            return (
              <div
                key={monthDate}
                className="border border-primary/20 rounded-lg bg-card hover:shadow-md transition-all duration-200 overflow-hidden "
              >
                {/* MONTH HEADER */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-primary/20 bg-purple-50/80 dark:bg-purple-900/20">
                  <h3 className="text-sm font-black uppercase text-purple-800 dark:text-purple-300">
                    {format(monthDate, "MMMM")}
                  </h3>
                  {monthEvents.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-800/40 text-purple-800 dark:text-purple-300">
                      {monthEvents.length} events
                    </span>
                  )}
                </div>
                {/* MONTH BODY */}
                <div className="p-3">
                  <div className="grid grid-cols-7 mb-2 text-[10px] font-black text-center text-muted-foreground">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div key={i} className="uppercase">
                        {d}
                      </div>
                    ))}
                  </div>
                  {/* DAYS GRID */}
                  <div className="grid grid-cols-7 gap-1">
                    {monthGrid.map((date, i) => {
                      const inMonth = date.getMonth() === monthDate.getMonth();
                      const dayEvents = getEventsForDate(date);
                      const hasMultipleEvents = dayEvents.length > 1;

                      return (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <div
                              onClick={() => {
                                setCurrentDate(date);
                                onDayClick();
                              }}
                              className={cn(
                                "aspect-square flex flex-col items-center justify-center rounded-md cursor-pointer transition-all duration-200 relative group",
                                "hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:scale-110",
                                !inMonth && "opacity-30",
                                isToday(date) &&
                                  "bg-purple-200 dark:bg-purple-800/40 ring-2 ring-purple-400/30 font-bold scale-105",
                                hasEvents(date) &&
                                  !isToday(date) &&
                                  "font-semibold",
                              )}
                            >
                              {/* Date Number */}
                              <span
                                className={cn(
                                  "text-[11px] transition-colors",
                                  isToday(date)
                                    ? "text-purple-900 dark:text-purple-100"
                                    : "text-foreground group-hover:text-purple-800 dark:group-hover:text-purple-300",
                                )}
                              >
                                {date.getDate()}
                              </span>

                              {/* Event Indicators */}
                              {hasEvents(date) && (
                                <div className="absolute bottom-0.5 flex gap-0.5">
                                  {hasMultipleEvents ? (
                                    <span className="w-1 h-1 rounded-full bg-primary" />
                                  ) : (
                                    <span
                                      className={cn(
                                        "w-1 h-1 rounded-full",
                                        getEventDotColor(
                                          dayEvents[0].eventType,
                                        ),
                                      )}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>

                          {/* Tooltip for days with events */}
                          {dayEvents.length > 0 && (
                            <TooltipContent className="bg-card text-card-foreground border-primary/20 shadow-lg max-w-xs">
                              <div className="flex flex-col gap-2 p-1">
                                <p className="font-bold text-sm text-purple-800 dark:text-purple-300 border-b border-primary/20 pb-1">
                                  {format(date, "MMMM dd, yyyy")}
                                </p>

                                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                  {dayEvents.slice(0, 3).map((event) => (
                                    <div
                                      key={event.id || event._id}
                                      className="text-xs"
                                    >
                                      <p className="font-semibold text-foreground truncate">
                                        {event.title}
                                      </p>
                                      <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                                        <Clock className="w-3 h-3" />
                                        <span className="text-[10px]">
                                          {format(
                                            new Date(event.startDateTime),
                                            "h:mm a",
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                  {dayEvents.length > 3 && (
                                    <p className="text-[10px] text-muted-foreground italic">
                                      +{dayEvents.length - 3} more events
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default CalendarYearView;
