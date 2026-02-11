import { startOfWeek, addDays, format } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/shared/config/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import { getProductionWeekLabel } from "./productionPhases";

// CONFIG
const HOUR_HEIGHT = 48;
const DAY_MINUTES = 1440;
const MIN_EVENT_HEIGHT = 16;

// TIME UTILS
function timeToMinutes(time) {
  if (!time) return null;
  const [clock, period] = time.split(" ");
  let [h, m] = clock.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

const dateKey = (date) => format(date, "yyyy-MM-dd");
const formatHour = (h) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;

// EVENT NORMALIZATION FOR WEEK VIEW
function normalizeWeekEvents(events) {
  const output = [];

  for (const e of events) {
    if (!e.startDateTime) continue;

    const start = new Date(e.startDateTime);
    const end = new Date(e.endDateTime);

    const startDateStr = format(start, "yyyy-MM-dd");
    const endDateStr = format(end, "yyyy-MM-dd");

    let current = new Date(start);
    current.setHours(0, 0, 0, 0);

    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);

    while (current <= endDate) {
      const currentDateStr = format(current, "yyyy-MM-dd");
      const isFirst = currentDateStr === startDateStr;
      const isLast = currentDateStr === endDateStr;

      const startTime = format(start, "h:mm a");
      const endTime = format(end, "h:mm a");

      let _start = 0;
      let _end = DAY_MINUTES;

      if (!e.allDay) {
        if (isFirst) _start = timeToMinutes(startTime) ?? 0;
        if (isLast) _end = timeToMinutes(endTime) ?? DAY_MINUTES;
      }

      output.push({
        ...e,
        _currentDate: currentDateStr,
        _start,
        _end,
        _startTime: startTime,
        _endTime: endTime,
      });

      current = addDays(current, 1);
    }
  }

  return output;
}

// WEEK HELPERS
function getWeek(date) {
  return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(date), i));
}

function getEventsForDay(events, date) {
  const key = dateKey(date);
  return events.filter((e) => e._currentDate === key && !e.allDay);
}

function getAllDayEvents(events, date) {
  const key = dateKey(date);
  return events.filter((e) => e._currentDate === key && e.allDay);
}

// OVERLAP LAYOUT
function layoutEvents(events) {
  const columns = [];
  for (const event of events) {
    let placed = false;
    for (const col of columns) {
      const last = col[col.length - 1];
      if (event._start >= last._end) {
        col.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) columns.push([event]);
  }
  return columns;
}

function getEventStyle(event, colIndex, colCount) {
  const rawHeight = ((event._end - event._start) / 60) * HOUR_HEIGHT;
  return {
    top: (event._start / 60) * HOUR_HEIGHT,
    height: Math.max(rawHeight, MIN_EVENT_HEIGHT),
    width: `${100 / colCount}%`,
    left: `${(100 / colCount) * colIndex}%`,
  };
}

function CalendarWeekView({ currentDate, events, onDayClick, setCurrentDate }) {
  const week = getWeek(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const normalized = normalizeWeekEvents(events);
  const isToday = (date) => date.toDateString() === new Date().toDateString();

  // Soft colors with proper backgrounds
  const getEventColors = (eventType) => {
    switch (eventType) {
      case "shoot":
        return "bg-peach-100 dark:bg-peach-800 text-peach-800 dark:text-peach-100 border-peach-400 dark:border-peach-600";
      case "prep":
        return "bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-700";
      case "wrap":
        return "bg-mint-100 dark:bg-mint-900 text-mint-800 dark:text-mint-200 border-mint-300 dark:border-mint-700";
      default:
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700";
    }
  };

  const getAllDayEventColors = (eventType) => {
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

  return (
    <>
      <div className="min-h-[calc(100vh-500px)] rounded-xl border border-primary/20 shadow-lg bg-card overflow-hidden">
        {/* WEEK PHASE BANNER */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          <div className="bg-card border-r border-primary/20"></div>
          <div className="col-start-2 col-span-7 py-3 text-center text-xs font-bold uppercase bg-purple-50/80 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-b border-primary/20">
            {getProductionWeekLabel(format(week[0], "yyyy-MM-dd"))}
          </div>
        </div>
        {/* WEEK HEADER ROW (Time column + day labels) */}
        <div className="grid grid-cols-[80px_1fr] text-[11px] font-black uppercase bg-purple-50/80 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300">
          <div className="flex justify-end py-2 pr-3 text-[10px] text-muted-foreground bg-card border-r border-b border-primary/20">
            TIME
          </div>
          <div className="grid grid-cols-7 border-primary/20 border-b">
            {week.map((date) => (
              <div
                className={cn(
                  "flex flex-col items-center py-1 border-primary/20 border-r last:border-r-0",
                  isToday(date) && "bg-purple-100/50 dark:bg-purple-900/30",
                )}
              >
                <p className="text-[11px] font-black uppercase text-purple-800 dark:text-purple-300">
                  {format(date, "EEE")}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[14px] font-bold text-purple-800 dark:text-purple-300",
                    isToday(date) &&
                      "flex items-center justify-center w-7 h-7 rounded-full bg-purple-200 dark:bg-purple-800/40",
                  )}
                >
                  {date.getDate()}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* ALL DAY EVENTS ROW */}
        <div className="grid grid-cols-[80px_1fr]">
          <div className="flex items-center justify-center min-h-12 text-xs font-bold text-purple-800 dark:text-purple-300 bg-muted/40 border-r border-b border-primary/20">
            ALL DAY
          </div>
          {/* ALL-DAY EVENTS DAY COLUMNS */}
          <div className="grid grid-cols-7 border-b border-primary/20">
            {week.map((date) => (
              <div
                key={date}
                className="flex flex-col items-start gap-1 p-1 border-r border-primary/20 last:border-r-0 cursor-pointer hover:bg-purple-50/60 dark:hover:bg-purple-900/20 transition-all duration-200 overflow-hidden"
                onClick={() => {
                  setCurrentDate(date);
                  onDayClick();
                }}
              >
                {getAllDayEvents(normalized, date).map((e) => (
                  <Tooltip key={e.id || e._id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "w-full px-1.5 py-0.5 text-[10px] font-semibold text-center whitespace-nowrap rounded-md overflow-hidden border-l-3 transition-all duration-200 hover:shadow-md",
                          getAllDayEventColors(e.eventType),
                        )}
                      >
                        {e.title}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card text-card-foreground border-primary/20 shadow-lg">
                      <div className="flex flex-col gap-2 p-1">
                        <p className="font-bold text-sm text-purple-800 dark:text-purple-300 border-b border-primary/20 pb-1">
                          {e.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-medium">All Day Event</span>
                        </div>
                        {e.location && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="font-medium">{e.location}</span>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* WEEK TIME GRID (hour labels + day columns) */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          <div>
            {hours.map((h) => (
              //  TIME AXIS — hourly labels aligned with the grid rows
              <div
                key={h}
                className="flex h-12 items-center justify-center bg-muted/40 border-b border-r  border-primary/20"
              >
                <span className="text-xs font-semibold text-purple-800 dark:text-purple-300">
                  {formatHour(h)}
                </span>
              </div>
            ))}
          </div>
          {/* DAY COLUMNS */}
          {week.map((date) => {
            const dayEvents = getEventsForDay(normalized, date);
            const columns = layoutEvents(dayEvents);
            return (
              <div
                key={date}
                onClick={() => {
                  setCurrentDate(date);
                  onDayClick();
                }}
                className="relative border-r border-primary/20 last:border-r-0"
              >
                {/* Events time slots grid */}
                {hours.map((h) => (
                  <div
                    key={h}
                    className="h-12 border-b border-primary/20 hover:bg-purple-50/60 dark:hover:bg-purple-900/20 cursor-pointer transition-all duration-200 last:border-b-0"
                  />
                ))}
                {/* Events Overlay  */}
                <div className="absolute left-1 inset-0 pointer-events-none">
                  {columns.map((col, colIndex) =>
                    col.map((e) => {
                      const startTime = new Date(e.startDateTime);
                      const endTime = new Date(e.endDateTime);

                      return (
                        <Tooltip key={e.id || e._id}>
                          <TooltipTrigger asChild>
                            <div
                              style={getEventStyle(e, colIndex, columns.length)}
                              className={cn(
                                "cursor-pointer absolute pointer-events-auto flex items-center justify-center py-0.5 text-[10px] font-semibold text-center rounded-md overflow-hidden border-l-3 shadow-sm transition-all duration-200 hover:shadow-md",
                                getEventColors(e.eventType),
                              )}
                            >
                         {e.title}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-card text-card-foreground border-primary/20 shadow-lg">
                            <div className="flex flex-col gap-2 p-1">
                              <p className="font-bold text-sm text-purple-800 dark:text-purple-300">
                                {e.title}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="font-medium">
                                  {format(startTime, "h:mm a")} -{" "}
                                  {format(endTime, "h:mm a")}
                                </span>
                              </div>
                              {e.location && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span className="font-medium">
                                    {e.location}
                                  </span>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default CalendarWeekView;
