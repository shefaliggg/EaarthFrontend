import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import { getProductionWeekLabel } from "./productionPhases";

import { startOfMonth, startOfWeek, addDays, format } from "date-fns";
import { cn } from "../../../../shared/config/utils";
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

  return (
    <div className="rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card">
      {/* Month View Header (WEEK + DAYS) */}
      <div className="grid grid-cols-8 text-center text-[11px] font-black uppercase bg-purple-50/80 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-b border-primary/20">
        <div className="py-4 border-r border-primary/20 bg-card">
          <span className="text-muted-foreground">WEEK</span>
        </div>
        {WEEK_DAYS.map((day) => (
          <div key={day} className="py-4 border-r border-primary/20 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Month View BODY  */}
      <div className="grid grid-rows-5">
        {/* WEEK ROW  */}
        {calendarWeeks.map((weekDays, weekIndex) => {
          const weekStartDate = format(weekDays[0], "yyyy-MM-dd");
          const weekLabel = getProductionWeekLabel(weekStartDate);
          return (
            <div key={weekIndex} className="grid grid-cols-8">
              {/* WEEK LABEL  */}
              <div className="flex h-36 justify-center text-center items-center text-xs font-bold bg-muted/40 border-r border-b border-primary/20 text-purple-800 dark:text-purple-300">
                {weekLabel || ""}
              </div>

              {/* DAY CELLS */}
              {weekDays.map((date) => {
                const isToday =
                  date.toDateString() === new Date().toDateString();

                const isCurrentMonth =
                  date.getMonth() === currentDate.getMonth();

                const dateString = format(date, "yyyy-MM-dd");

                const dayEvents = getEventsForDate(events, dateString);

                const MAX_EVENTS_PER_DAY = 3;
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
                      "flex gap-1 p-2 h-36 flex-col items-end cursor-pointer transition-all duration-200 border-r border-b border-primary/20 hover:bg-purple-50/60 dark:hover:bg-purple-900/20 overflow-hidden",
                      !isCurrentMonth && "opacity-50",
                      isToday && "ring-2 ring-inset ring-purple-400 dark:ring-purple-500 bg-purple-50/40 dark:bg-purple-900/10",
                    )}
                  >
                    {/* Date NUMBER  */}
                    <div
                      className={cn(
                        "text-sm w-7 h-7 flex items-center justify-center font-bold text-purple-800 dark:text-purple-300 rounded-full mb-0.5 transition-colors flex-shrink-0",
                        isToday && "bg-purple-200 dark:bg-purple-800/60 ring-2 ring-purple-400/30",
                      )}
                    >
                      {date.getDate()}
                    </div>

                    {/* EVENT CARD  */}
                    {visibleEvents.map((event) => (
                      <Tooltip key={event.id || event._id}>
                        <TooltipTrigger asChild>
                          <div className="bg-primary hover:bg-primary/90 whitespace-nowrap w-full text-[11px] font-semibold px-2 py-0.5 rounded-lg overflow-hidden text-white shadow-sm transition-all duration-200 hover:shadow-md flex-shrink-0">
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
                                <span className="font-medium">{event.location}</span>
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
                            className="text-[11px] font-bold rounded-lg w-full py-0.5 px-2 hover:scale-[1.02] transition-transform text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 flex-shrink-0"
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
                                  <div className="bg-primary hover:bg-primary/90 whitespace-nowrap w-full text-[11px] font-semibold px-2 py-1.5 rounded-lg overflow-hidden text-white shadow-sm transition-all duration-200 hover:shadow-md">
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
                                        {format(new Date(event.startDateTime), "h:mm a")} - {format(new Date(event.endDateTime), "h:mm a")}
                                      </span>
                                    </div>

                                    {/* Location */}
                                    {event.location && (
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="font-medium">{event.location}</span>
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
  );
}

export default CalendarMonthView;