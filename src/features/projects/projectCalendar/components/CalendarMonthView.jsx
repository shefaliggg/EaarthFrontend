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
      if (!event.startDate) return false;

      const start = new Date(event.startDate);
      const end = event.endDate ? new Date(event.endDate) : start;
      const current = new Date(dateString);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      current.setHours(12, 0, 0, 0);

      return current >= start && current <= end;
    });
  };

  // Example production phases (you can later make this dynamic)

  return (
    <>
      <div className="rounded-xl overflow-hidden border bg-background">
        {/* Month View Header (WEEK + DAYS) */}
        <div className="grid grid-cols-8 text-center text-[11px] font-black uppercase bg-purple-50/80 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-b border-border dark:border-[#2a1b3d]">
          <div className="py-3 border-r border-border">WEEK</div>
          {WEEK_DAYS.map((day) => (
            <div key={day} className="py-3 border-r last:border-r-0">
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
                <div className="flex min-h-36 justify-center text-center items-center text-[11px] font-bold bg-muted/30 border-r border-b border-border dark:border-[#2a1b3d]  text-purple-800 dark:text-purple-300">
                  {weekLabel || ""}
                </div>

                {/* DAY CELLS */}
                {weekDays.map((date, index) => {
                  const isToday =
                    date.toDateString() === new Date().toDateString();

                  const isCurrentMonth =
                    date.getMonth() === currentDate.getMonth();

                  const dateString = format(date, "yyyy-MM-dd");

                  const dayEvents = getEventsForDate(events, dateString);

                  const MAX_EVENTS_PER_DAY = 4;
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
                        "flex gap-0.5 p-1 max-h-36 flex-col items-end cursor-pointer transition-[background-color,color] border-r border-b border-border dark:border-[#2a1b3d] hover:bg-violet-200 dark:hover:bg-purple-900/20",
                        !isCurrentMonth && "opacity-60",
                        isToday && "ring-2 ring-purple-400/40",
                      )}
                    >
                      {/* Date NUMBER  */}
                      <div
                        className={cn(
                          "text-[13px] w-6 h-6 flex items-center justify-center font-black text-purple-800 dark:text-purple-300 rounded-full mb-1",
                          isToday && "bg-purple-200 dark:bg-purple-800/40",
                        )}
                      >
                        {date.getDate()}
                      </div>

                      {/* EVENT CARD  */}
                      {visibleEvents.map((event) => (
                        <Tooltip key={event.id || event._id}>
                          <TooltipTrigger asChild>
                            <div className="bg-primary whitespace-nowrap w-full text-[11px]  pl-2 py-0.5 rounded-lg overflow-hidden text-white">
                              {event.title}
                            </div>
                          </TooltipTrigger>

                          {/* EVENT TOOLTIP  */}
                          <TooltipContent className="bg-card text-card-foreground">
                            <div className="flex flex-col gap-1.5">
                              {/* Event Title */}
                              <p className="font-semibold text-sm">
                                {event.title}
                              </p>

                              {/* Time */}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span>
                                  {event.startTime} - {event.endTime}
                                </span>
                              </div>

                              {/* Location */}
                              {event.location && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{event.location}</span>
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
                              className="text-[12px] font-semibold rounded-lg w-full py-0.5 mt-0.5 hover:scale-[1.03] pl-2 text-purple-800 dark:text-purple-300"
                            >
                              {hiddenEvents.length} more
                            </div>
                          </PopoverTrigger>

                          <PopoverContent>
                            <div className=" text-[15px] font-black text-center text-purple-800 dark:text-purple-300 mb-2">
                              {format(new Date(dateString), "dd")}
                            </div>

                            {dayEvents.map((event) => (
                              <Tooltip key={event.id}>
                                <TooltipTrigger asChild>
                                  <div className="bg-primary whitespace-nowrap mb-1 w-full text-[11px]  pl-2 py-0.5 rounded-lg overflow-hidden text-white">
                                    {event.title}
                                  </div>
                                </TooltipTrigger>
                                {/* EVENT TOOLTIP  */}
                                <TooltipContent className="bg-card text-card-foreground">
                                  <div className="flex flex-col gap-1.5">
                                    {/* Event Title */}
                                    <p className="font-semibold text-sm">
                                      {event.title}
                                    </p>

                                    {/* Time */}
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>
                                        {event.startTime} - {event.endTime}
                                      </span>
                                    </div>

                                    {/* Location */}
                                    {event.location && (
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{event.location}</span>
                                      </div>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            ))}
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
