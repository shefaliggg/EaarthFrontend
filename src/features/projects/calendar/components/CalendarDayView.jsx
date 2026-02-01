import { format } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import { cn } from "../../../../shared/config/utils";
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

// EVENT NORMALIZATION
function normalizeDayEvents(events, date) {
  const key = dateKey(date);
  return events
    .filter((e) => {
      if (!e.startDateTime) return false;
      const start = new Date(e.startDateTime);
      const startDateStr = format(start, "yyyy-MM-dd");
      return startDateStr === key && !e.isAllDay;
    })
    .map((e) => {
      const start = new Date(e.startDateTime);
      const end = new Date(e.endDateTime);
      const startTime = format(start, "h:mm a");
      const endTime = format(end, "h:mm a");
      
      return {
        ...e,
        _start: timeToMinutes(startTime) ?? 0,
        _end: timeToMinutes(endTime) ?? DAY_MINUTES,
      };
    });
}

function getAllDayEvents(events, date) {
  const key = dateKey(date);
  return events.filter((e) => {
    if (!e.startDateTime) return false;
    const start = new Date(e.startDateTime);
    const startDateStr = format(start, "yyyy-MM-dd");
    return startDateStr === key && e.isAllDay;
  });
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

export default function CalendarDayView({ currentDate, events, onDayClick }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = normalizeDayEvents(events, currentDate);
  const allDayEvents = getAllDayEvents(events, currentDate);
  const columns = layoutEvents(dayEvents);
  const isToday = (date) => date.toDateString() === new Date().toDateString();

  return (
    <div className="rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card">
      {/* HEADER */}
      <div className="grid grid-cols-[80px_1fr] text-[11px] font-black uppercase border-b border-primary/20 bg-purple-50/80 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300">
        <div className="bg-card border-r border-primary/20 pr-3 text-muted-foreground flex items-center justify-end py-2">
          <span className="text-[10px]">TIME</span>
        </div>
        <div className="relative text-center py-1">
          {/* PHASE BADGE (Top Right) */}
          <span className="absolute top-4 right-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
            {getProductionWeekLabel(format(currentDate, "yyyy-MM-dd"))}
          </span>

          <p className="text-[11px] font-black uppercase text-purple-800 dark:text-purple-300">
            {format(currentDate, "EEEE")}
          </p>

          <p
            className={cn(
              "text-[14px] font-bold w-7 h-7 rounded-full flex items-center justify-center mx-auto text-purple-800 dark:text-purple-300",
              isToday(currentDate) && "bg-purple-200 dark:bg-purple-800/40"
            )}
          >
            {currentDate.getDate()}
          </p>
        </div>
      </div>

      {/* ALL DAY ROW */}
      <div className="grid grid-cols-[80px_1fr]">
        <div className="text-right bg-muted/40 border-r border-b border-primary/20 pt-2 pr-3 text-xs font-bold text-purple-800 dark:text-purple-300 min-h-12">
          ALL DAY
        </div>

        <div
          onClick={onDayClick}
          className="flex cursor-pointer gap-1 p-2 flex-col items-start border-b border-primary/20 hover:bg-purple-50/60 dark:hover:bg-purple-900/20 transition-all duration-200 overflow-hidden min-h-12"
        >
          {allDayEvents.map((e) => (
            <Tooltip key={e.id || e._id}>
              <TooltipTrigger asChild>
                <div className="bg-primary hover:bg-primary/90 w-full text-[11px] font-semibold px-2 py-1 rounded-lg overflow-hidden text-white shadow-sm transition-all duration-200 hover:shadow-md">
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
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-[80px_1fr]">
        {/* TIME COLUMN */}
        <div>
          {hours.map((h) => (
            <div
              key={h}
              className="text-right bg-muted/40 border-primary/20 border-b border-r pr-3 pt-1 text-xs font-semibold text-purple-800 dark:text-purple-300 h-12"
            >
              {formatHour(h)}
            </div>
          ))}
        </div>

        {/* DAY COLUMN */}
        <div className="relative bg-card">
          {/* Hour Grid */}
          {hours.map((h) => (
            <div
              key={h}
              onClick={onDayClick}
              className="h-12 border-primary/20 border-b hover:bg-purple-50/40 dark:hover:bg-purple-900/10 cursor-pointer transition-all duration-200"
            />
          ))}

          {/* EVENTS */}
          {columns.map((col, colIndex) =>
            col.map((event) => {
              const startTime = new Date(event.startDateTime);
              const endTime = new Date(event.endDateTime);
              
              return (
                <Tooltip key={event.id || event._id}>
                  <TooltipTrigger asChild>
                    <div
                      style={getEventStyle(event, colIndex, columns.length)}
                      className="cursor-pointer absolute bg-primary hover:bg-primary/90 text-[11px] font-semibold px-2 py-1 rounded-lg overflow-hidden text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.01]"
                    >
                      <div className="font-bold">{event.title}</div>
                      <div className="text-[10px] opacity-90 mt-0.5">
                        {format(startTime, "h:mm a")}
                      </div>
                    </div>
                  </TooltipTrigger>

                  <TooltipContent className="bg-card text-card-foreground border-primary/20 shadow-lg">
                    <div className="flex flex-col gap-2 p-1">
                      <p className="font-bold text-sm text-purple-800 dark:text-purple-300">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-medium">
                          {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="font-medium">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}