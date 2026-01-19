import { format } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import { cn } from "../../../../shared/config/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import { getProductionWeekLabel } from "./productionPhases";


/* ================= CONFIG ================= */

const HOUR_HEIGHT = 48;
const DAY_MINUTES = 1440;
const MIN_EVENT_HEIGHT = 16;

/* ================= TIME UTILS ================= */

function timeToMinutes(time) {
  if (!time) return null;

  const [clock, period] = time.split(" ");
  let [h, m] = clock.split(":").map(Number);

  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  return h * 60 + m;
}

const dateKey = (date) => format(date, "yyyy-MM-dd");

/* ================= NORMALIZATION ================= */

function normalizeDayEvents(events, date) {
  const key = dateKey(date);

  return events
    .filter((e) => e.startDate === key && !e.isAllDay)
    .map((e) => ({
      ...e,
      _start: timeToMinutes(e.startTime) ?? 0,
      _end: timeToMinutes(e.endTime) ?? DAY_MINUTES,
    }));
}

function getAllDayEvents(events, date) {
  const key = dateKey(date);
  return events.filter((e) => e.startDate === key && e.isAllDay);
}

/* ================= OVERLAP LAYOUT ================= */

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

/* ================= UI HELPERS ================= */

const formatHour = (h) => `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`;

function getEventStyle(event, colIndex, colCount) {
  const rawHeight = ((event._end - event._start) / 60) * HOUR_HEIGHT;

  return {
    top: (event._start / 60) * HOUR_HEIGHT,
    height: Math.max(rawHeight, MIN_EVENT_HEIGHT),
    width: `${100 / colCount}%`,
    left: `${(100 / colCount) * colIndex}%`,
  };
}

/* ================= COMPONENT ================= */

export default function CalendarDayView({ currentDate, events, onDayClick }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayEvents = normalizeDayEvents(events, currentDate);
  const allDayEvents = getAllDayEvents(events, currentDate);
  const columns = layoutEvents(dayEvents);

  const isToday = (date) => date.toDateString() === new Date().toDateString();

  return (
    <div className="rounded-xl overflow-hidden border border-border dark:border-[#2a1b3d] bg-background">
      {/* HEADER */}
      <div className="grid grid-cols-[80px_1fr] text-[11px] font-black uppercase border-b border-border dark:border-[#2a1b3d] bg-purple-50/80 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300">
        <div className="bg-white dark:bg-[#0f0e13] pr-4 text-muted-foreground flex items-center justify-end">
          Time
        </div>
       <div className="relative text-center py-1">
          {/* PHASE BADGE (Top Right) */}
          <span
            className="absolute top-4 right-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide
                   rounded-full
                   bg-purple-100 text-purple-800
                   dark:bg-purple-900/40 dark:text-purple-300"
          >
            {getProductionWeekLabel(format(currentDate, "yyyy-MM-dd"))}
          </span>

          <p className="text-[11px] font-black uppercase text-purple-800 dark:text-purple-300">
            {format(currentDate, "EEEE")}
          </p>

          <p
            className={cn(
              "text-[14px] font-bold w-6 h-6 rounded-full flex items-center justify-center mx-auto text-purple-800 dark:text-purple-300",
              isToday(currentDate) && "bg-purple-200 dark:bg-purple-800/40",
            )}
          >
            {currentDate.getDate()}
          </p>
        </div>
      </div>

      {/* ALL DAY ROW */}
      <div className="grid grid-cols-[80px_1fr]">
        <div className="text-right bg-muted/30 border-r border-b border-border dark:border-[#2a1b3d] pt-1 pr-2 text-xs text-muted-foreground min-h-12">
          All Day
        </div>

        <div
          onClick={onDayClick}
          className="flex cursor-pointer gap-1 p-1 flex-col items-center border-r border-b border-border dark:border-[#2a1b3d]  text-purple-800 dark:text-purple-300 overflow-hidden"
        >
          {allDayEvents.map((e) => (
            <Tooltip key={e.id || e._id}>
              <TooltipTrigger asChild>
                <div
                  key={e.id}
                  className="bg-primary w-full text-[12px] pl-2 py-0.5 rounded-lg overflow-hidden text-white"
                >
                  {e.title}
                </div>
              </TooltipTrigger>
              {/* EVENT TOOLTIP  */}
              <TooltipContent className="bg-card text-card-foreground">
                <div className="flex flex-col gap-1.5">
                  {/* Event Title */}
                  <p className="font-semibold text-sm">{e.title}</p>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {e.startTime} - {e.endTime}
                    </span>
                  </div>

                  {/* Location */}
                  {e.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{e.location}</span>
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
              className="text-right bg-muted/30 border-border border-b border-r dark:border-[#2a1b3d] pr-2 text-xs text-muted-foreground min-h-12"
            >
              {formatHour(h)}
            </div>
          ))}
        </div>

        {/* DAY COLUMN */}
        <div className="relative">
          {/* Hour Grid */}
          {hours.map((h) => (
            <div
              key={h}
              onClick={onDayClick}
              className="h-12  border-border border-b dark:border-[#2a1b3d] hover:bg-purple-50/40 dark:hover:bg-purple-900/20 cursor-pointer"
            />
          ))}

          {/* EVENTS */}
          {columns.map((col, colIndex) =>
            col.map((event) => {
              return (
                <Tooltip key={event.id || event._id}>
                  <TooltipTrigger asChild>
                    <div
                      style={getEventStyle(event, colIndex, columns.length)}
                      className="cursor-pointer absolute bg-primary w-full text-[12px]  pl-2 pb-1 rounded-lg overflow-hidden text-white"
                    >
                      {event.title}
                    </div>
                  </TooltipTrigger>

                  {/* EVENT TOOLTIP  */}
                  <TooltipContent className="bg-card text-card-foreground">
                    <div className="flex flex-col gap-1.5">
                      {/* Event Title */}
                      <p className="font-semibold text-sm">{event.title}</p>

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
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
