import { startOfMonth, startOfWeek, addDays, format } from "date-fns";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";

import { cn } from "../../../../shared/config/utils";

export default function CalendarMonthView({
  currentDate,
  setCurrentDate,
  onDayClick,
  events,
}) {
  const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Example production phases (you can later make this dynamic)
  const PHASES = [
    { name: "Prep", start: "2026-01-01", end: "2026-01-14" },
    { name: "Shoot", start: "2026-01-15", end: "2026-01-31" },
  ];

  function getPhaseForDate(dateStr) {
    return PHASES.find((p) => dateStr >= p.start && dateStr <= p.end);
  }

  function getWeekOfPhase(dateStr, phaseStart) {
    const start = new Date(phaseStart);
    const current = new Date(dateStr);
    const diff = Math.floor((current - start) / (7 * 24 * 60 * 60 * 1000));
    return diff + 1;
  }

  function getProductionWeekLabel(dateStr) {
    const phase = getPhaseForDate(dateStr);
    if (!phase) return "";
    const week = getWeekOfPhase(dateStr, phase.start);
    return `${phase.name.toUpperCase()} WEEK ${week}`;
  }

  const calendarStartDate = startOfWeek(startOfMonth(currentDate));
  const calendarDays = Array.from({ length: 35 }, (_, i) =>
    addDays(calendarStartDate, i)
  );

  // Split into weeks (7 days each)
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div
      className="rounded-xl overflow-hidden border 
      bg-white dark:bg-[#0f0e13] 
      border-border dark:border-[#2a1b3d] 
      shadow-sm"
    >
      {/* HEADER */}
      <div
        className="grid grid-cols-8 text-center text-[11px] font-black uppercase  
        bg-purple-50/80 dark:bg-purple-900/20
        text-purple-800 dark:text-purple-300
        border-b border-border dark:border-[#2a1b3d]"
      >
        <div className="py-3 font-bold border-r border-border">WEEK</div>

        {WEEK_DAYS.map((day) => (
          <div key={day} className="py-3 border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* BODY */}
      <div className="grid grid-rows-5">
        {weeks.map((week, weekIndex) => {
          const weekLabel = getProductionWeekLabel(
            format(week[0], "yyyy-MM-dd")
          );

          return (
            <div key={weekIndex} className="grid grid-cols-8">
              {/* WEEK LABEL COLUMN */}
              <div
                className="
                  flex items-center justify-center
                  text-[11px] font-bold
                  bg-muted/30 
                  border-r border-b border-border dark:border-[#2a1b3d]
                  text-purple-800 dark:text-purple-300
                "
              >
                {weekLabel || "NO PHASE"}
              </div>

              {/* DAYS */}
              {week.map((date, index) => {
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const isCurrentMonth =
                  date.getMonth() === currentDate.getMonth();
                const dayKey = format(date, "yyyy-MM-dd");

                const dayEvents = events.filter((e) => {
                  if (!e.startDate) return false;

                  const start = new Date(e.startDate);
                  const end = e.endDate ? new Date(e.endDate) : start;
                  const current = new Date(dayKey);

                  start.setHours(0, 0, 0, 0);
                  end.setHours(23, 59, 59, 999);
                  current.setHours(12, 0, 0, 0);

                  return current >= start && current <= end;
                });

                const MAX_VISIBLE = 2;
                const visibleEvents = dayEvents.slice(0, MAX_VISIBLE);
                const hiddenEvents = dayEvents.slice(MAX_VISIBLE);

                return (
                  <div
                    key={dayKey}
                    onClick={() => {
                      setCurrentDate(date);
                      onDayClick();
                    }}
                    className={cn(
                      "relative aspect-square min-h-32 p-3 cursor-pointer transition",
                      "bg-white dark:bg-[#0f0e13]",
                      "hover:bg-purple-50/40 dark:hover:bg-purple-900/20",
                      "border-r border-b border-border dark:border-[#2a1b3d]",
                      index === 6 && "border-r-0",
                      !isCurrentMonth && "opacity-65",
                      isToday && "ring-2 ring-purple-400/40 z-1"
                    )}
                  >
                    {/* DATE CIRCLE */}
                    <div
                      className={cn(
                        "absolute top-2 left-1/2 -translate-x-1/2",
                        "w-6 h-6 flex items-center justify-center",
                        "text-[11px] font-black rounded-full",
                        "text-purple-800 dark:text-purple-300",
                        isToday && "bg-purple-200 dark:bg-purple-800/40"
                      )}
                    >
                      {date.getDate()}
                    </div>

                    {/* EVENTS */}
                    <div className="mt-8 space-y-1">
                      {visibleEvents.map((event) => (
                        <Tooltip key={event.id}>
                          <TooltipTrigger asChild>
                            <div
                              className="
                                text-[11px]
                                px-2 py-1
                                rounded-lg
                                shadow-sm
                                cursor-pointer
                                flex flex-col items-center justify-center
                                text-center
                                text-white dark:text-white
                                backdrop-blur-sm
                                leading-tight
                                transition hover:opacity-90
                              "
                              style={{
                                backgroundColor: event.color || "#9333ea",
                              }}
                            >
                              <span className="font-semibold truncate w-full">
                                {event.title}
                              </span>

                              {!event.isAllDay && event.startTime && (
                                <span className="text-[10px] opacity-90 truncate w-full">
                                  {event.startTime}
                                </span>
                              )}

                              {event.location && (
                                <span className="text-[10px] opacity-75 truncate w-full">
                                  {event.location}
                                </span>
                              )}
                            </div>
                          </TooltipTrigger>

                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-semibold">{event.title}</p>

                              {!event.isAllDay && event.startTime && (
                                <p className="text-xs opacity-80">
                                  {event.startTime} – {event.endTime}
                                </p>
                              )}

                              {event.location && (
                                <p className="text-xs opacity-70">
                                  {event.location}
                                </p>
                              )}

                              {event.notes && (
                                <p className="text-xs opacity-60">
                                  {event.notes}
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}

                      {hiddenEvents.length > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="
                                text-[11px]
                                px-2 py-1
                                rounded-lg
                                shadow-sm
                                cursor-pointer
                                flex items-center justify-center
                                text-center
                                text-white
                                backdrop-blur-sm
                                transition hover:opacity-90
                              "
                              style={{ backgroundColor: "#9333ea" }}
                            >
                              +{hiddenEvents.length} more
                            </div>
                          </TooltipTrigger>

                          <TooltipContent>
                            <div className="space-y-2">
                              {hiddenEvents.map((event) => (
                                <div key={event.id}>
                                  <p className="font-semibold">{event.title}</p>

                                  {!event.isAllDay && event.startTime && (
                                    <p className="text-xs opacity-80">
                                      {event.startTime} – {event.endTime}
                                    </p>
                                  )}

                                  {event.location && (
                                    <p className="text-xs opacity-70">
                                      {event.location}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
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
