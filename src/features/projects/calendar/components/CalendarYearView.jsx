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
import { Clock } from "lucide-react";

function getMonthGrid(monthDate) {
  const start = startOfWeek(startOfMonth(monthDate));
  return Array.from({ length: 35 }, (_, i) => addDays(start, i));
}

function getWeeksForMonth(days, size = 7) {
  const weeks = [];
  for (let i = 0; i < days.length; i += size) {
    weeks.push(days.slice(i, i + size));
  }
  return weeks;
}

function CalendarYearView({ currentDate,events }) {
  const yearStart = startOfYear(currentDate);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

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

  const isToday = (date) => date.toDateString() === new Date().toDateString();

  const getEventDotColor = (eventType) => {
    switch (eventType) {
      case "shoot":
        return "bg-peach-600 dark:bg-peach-400";
      case "prep":
        return "bg-sky-600 dark:bg-sky-400";
      case "wrap":
        return "bg-mint-600 dark:bg-mint-400";
      default:
        return "bg-purple-600 dark:bg-purple-400";
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-500px)] rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card">
        {/* YEAR HEADER */}
        <div className="border-primary/20 border-b bg-purple-50/80 dark:bg-purple-900/20 px-6 py-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-purple-800 dark:text-purple-300">
                {events.length}
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Total Events
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-sky-600 dark:text-sky-400">
                {events.filter((e) => e.eventType === "prep").length}
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Prep Events
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-peach-600 dark:text-peach-400">
                {events.filter((e) => e.eventType === "shoot").length}
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Shoot Events
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-mint-600 dark:text-mint-400">
                {events.filter((e) => e.eventType === "wrap").length}
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Wrap Events
              </p>
            </div>
          </div>
        </div>
        {/* MONTH GRID */}
        <div className="grid grid-cols-3 gap-4 p-6">
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
                key={format(monthDate, "yyyy-MM")}
                className="border border-primary/20 rounded-lg bg-card hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* MONTH HEADER */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-primary/20 bg-muted/30">
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
                <div className="p-4">
                  <div className="grid grid-cols-7 mb-2 text-[10px] font-black text-center text-muted-foreground">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div key={i} className="uppercase">
                        {d}
                      </div>
                    ))}
                  </div>
                  {/* DAYS GRID */}
                  {getWeeksForMonth(monthGrid).map((week, weekIndex) => (
                    <div
                      key={weekIndex}
                      className="grid grid-cols-7 my-4 text-[10px] font-semibold text-center text-muted-foreground"
                    >
                      {week.map((date) => {
                        const isCurrentMonth =
                          date.getMonth() === monthDate.getMonth();
                        const dayEvents = getEventsForDate(date);
                        const hasDayEvents = dayEvents.length > 0;

                        return (
                          <Tooltip key={format(date, "yyyy-MM-dd")}>
                            <TooltipTrigger>
                              <div
                                className={cn(
                                  "rounded-md font-bold text-muted-foreground dark:text-muted-foreground cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:scale-110 transition-all duration-200",
                                  !isCurrentMonth && "opacity-30",
                                  isToday(date) &&
                                    "bg-purple-200 dark:bg-purple-800/60 ring-2 ring-purple-400/30",
                                  hasDayEvents &&
                                    !isToday(date) &&
                                    "font-semibold",
                                )}
                              >
                                {/* Date Number */}
                                <span
                                  className={cn(
                                    "text-[11px]",
                                    isToday(date) &&
                                      "text-purple-800 dark:text-purple-300",
                                  )}
                                >
                                  {date.getDate()}
                                </span>
                                {/* Event Indicators */}
                                {hasDayEvents && (
                                  <div className="flex justify-center gap-0.5 mt-0.5">
                                    {dayEvents.slice(0, 3).map((event, idx) => (
                                      <span
                                        key={idx}
                                        className={cn(
                                          "block w-1 h-1 rounded-full",
                                          getEventDotColor(event.eventType),
                                        )}
                                      />
                                    ))}
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
                  ))}
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