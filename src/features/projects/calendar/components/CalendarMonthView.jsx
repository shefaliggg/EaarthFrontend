import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/config/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import { getProductionWeekLabel } from "./productionPhases";

import { startOfMonth, startOfWeek, addDays, format } from "date-fns";
import { Clock, MapPin } from "lucide-react";

function CalendarMonthView({
  currentDate,
  setCurrentDate,
  onDayClick,
  events,
}) {
  const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarStartDate = startOfWeek(startOfMonth(currentDate));
  const calendarDays = Array.from({ length: 35 }, (_, i) =>
    addDays(calendarStartDate, i),
  );

  const calendarWeeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    calendarWeeks.push(calendarDays.slice(i, i + 7));
  }

  const getEventsForDate = (events, dateString) => {
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

  const getMonthEventColors = (eventType) => {
    switch (eventType) {
      case "shoot":
        return "bg-peach-100 dark:bg-peach-800 text-peach-800 dark:text-peach-100 border-peach-400 dark:border-peach-600";
      case "prep":
        return "bg-sky-100 dark:bg-sky-800/80 text-sky-800 dark:text-sky-100 border-sky-400 dark:border-sky-600";
      case "wrap":
        return "bg-mint-200 dark:bg-mint-800 text-mint-900 dark:text-mint-100 border-mint-400 dark:border-mint-600";
      default:
        return "bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 border-purple-400 dark:border-purple-600";
    }
  };

  const getMoreIndicatorColors = (eventType) => {
    switch (eventType) {
      case "shoot":
        return "text-peach-700 dark:text-peach-300 hover:bg-peach-100 dark:hover:bg-peach-900/30";
      case "prep":
        return "text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/30";
      case "wrap":
        return "text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:hover:bg-mint-900/30";
      default:
        return "text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30";
    }
  };

  const getDominantEventType = (events) => {
    if (!events.length) return undefined;

    const counts = events.reduce((acc, e) => {
      acc[e.eventType] = (acc[e.eventType] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  return (
    <>
      <div className="min-h-[calc(100vh-500px)] rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card">
        {/* Month View Header (WEEK + DAYS) */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] text-center text-[11px] font-black uppercase bg-purple-50/80 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-b border-primary/20">
          <div className="py-4 border-r border-primary/20 bg-card">
            <span className="text-muted-foreground">WEEK</span>
          </div>
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="py-4 border-r border-primary/20 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Month View BODY  */}
        <div className="grid grid-rows-5">
          {calendarWeeks.map((weekDays, weekIndex) => {
            const weekStartDate = format(weekDays[0], "yyyy-MM-dd");
            const weekLabel = getProductionWeekLabel(weekStartDate);
            return (
              <div
                key={weekIndex}
                className="grid grid-cols-[80px_repeat(7,1fr)]"
              >
                {/* WEEK LABEL  */}
                <div className="flex h-67 justify-center items-center bg-muted/40 border-r border-b border-primary/20">
                  <span className="text-xs font-bold text-purple-800 dark:text-purple-300 rotate-270 whitespace-nowrap">
                    {weekLabel || ""}
                  </span>
                </div>
                {/* DAY CELLS */}
                {weekDays.map((date) => {
                  const isToday =
                    date.toDateString() === new Date().toDateString();

                  const isCurrentMonth =
                    date.getMonth() === currentDate.getMonth();

                  const dateString = format(date, "yyyy-MM-dd");

                  const dayEvents = getEventsForDate(events, dateString);

                  const MAX_EVENTS_PER_DAY = 8;
                  const visibleEvents = dayEvents.slice(0, MAX_EVENTS_PER_DAY);
                  const hiddenEvents = dayEvents.slice(MAX_EVENTS_PER_DAY);

                  return (
                    <div
                      key={dateString}
                      onClick={() => {
                        setCurrentDate(date);
                        onDayClick();
                      }}
                      className={cn(
                        "flex gap-1 p-2 h-67 flex-col items-end cursor-pointer transition-all duration-200 border-r border-b border-primary/20 hover:bg-purple-50/60 dark:hover:bg-purple-900/20 overflow-hidden",
                        !isCurrentMonth && "opacity-50",
                        isToday &&
                          "ring-2 ring-inset ring-purple-400 dark:ring-purple-500 bg-purple-50/40 dark:bg-purple-900/10",
                      )}
                    >
                      {/* Date NUMBER  */}
                      <div
                        className={cn(
                          "text-sm w-7 h-7 flex items-center justify-center font-bold text-purple-800 dark:text-purple-300 rounded-full mb-0.5 transition-colors flex-shrink-0",
                          isToday &&
                            "bg-purple-200 dark:bg-purple-800/60 ring-2 ring-purple-400/30",
                        )}
                      >
                        {date.getDate()}
                      </div>

                      {/* EVENT CARD  */}
                      {visibleEvents.map((event) => (
                        <Tooltip key={event.id || event._id}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "w-full px-1.5 py-0.5 text-[11px] font-semibold text-white text-center rounded-md whitespace-nowrap overflow-hidden border-l-3 transition-all duration-200 hover:shadow-md",
                                getMonthEventColors(event.eventType),
                              )}
                            >
                              {event.title}
                            </div>
                          </TooltipTrigger>

                          {/* EVENT TOOLTIP  */}
                          <TooltipContent className="bg-card text-card-foreground border-primary/20 shadow-lg">
                            <div className="flex flex-col gap-2 p-1">
                              {/* Event Title */}
                              <p className="font-bold text-sm text-purple-800 dark:text-purple-300">
                                {event.title}
                              </p>

                              {/* Time */}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="font-medium">
                                  {format(
                                    new Date(event.startDateTime),
                                    "h:mm a",
                                  )}{" "}
                                  -{" "}
                                  {format(
                                    new Date(event.endDateTime),
                                    "h:mm a",
                                  )}
                                </span>
                              </div>

                              {/* Location */}
                              {event.location && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span className="font-medium">
                                    {event.location}
                                  </span>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}

                      {/* + MORE */}
                      {hiddenEvents.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className={cn(
                                "text-[11px] font-bold rounded-lg w-full py-0.5 px-2 hover:scale-[1.02] transition-transform text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 flex-shrink-0",
                                getMoreIndicatorColors(
                                  getDominantEventType(hiddenEvents),
                                ),
                              )}
                            >
                              +{hiddenEvents.length} more
                            </div>
                          </PopoverTrigger>

                          <PopoverContent className="border-primary/20 shadow-xl">
                            <div className="text-base font-black text-center text-purple-800 dark:text-purple-300 mb-3 pb-2 border-b border-primary/20">
                              {format(new Date(dateString), "MMMM dd")}
                            </div>

                            <div className="space-y-2 max-h-80 overflow-y-auto">
                              {dayEvents.map((event) => (
                                <Tooltip key={event.id || event._id}>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        "w-full px-1.5 py-0.5 text-[11px] font-semibold text-white text-center rounded-md whitespace-nowrap overflow-hidden border-l-3 transition-all duration-200 hover:shadow-md",
                                        getMonthEventColors(event.eventType),
                                      )}
                                    >
                                      {event.title}
                                    </div>
                                  </TooltipTrigger>

                                  {/* EVENT TOOLTIP  */}
                                  <TooltipContent className="bg-card text-card-foreground border-primary/20 shadow-lg">
                                    <div className="flex flex-col gap-2 p-1">
                                      {/* Event Title */}
                                      <p className="font-bold text-sm text-purple-800 dark:text-purple-300">
                                        {event.title}
                                      </p>

                                      {/* Time */}
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="font-medium">
                                          {format(
                                            new Date(event.startDateTime),
                                            "h:mm a",
                                          )}{" "}
                                          -{" "}
                                          {format(
                                            new Date(event.endDateTime),
                                            "h:mm a",
                                          )}
                                        </span>
                                      </div>

                                      {/* Location */}
                                      {event.location && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <MapPin className="w-3.5 h-3.5" />
                                          <span className="font-medium">
                                            {event.location}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default CalendarMonthView;
