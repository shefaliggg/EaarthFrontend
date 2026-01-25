import { startOfWeek, addDays, format, parseISO } from "date-fns";
import { Clock, MapPin } from "lucide-react";
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

// EVENT NORMALIZATION
function normalizeEvents(events) {
  const output = [];

  for (const e of events) {
    const start = timeToMinutes(e.startTime);
    const end = timeToMinutes(e.endTime);

    const startDate = parseISO(e.startDate);
    const endDate = e.endDate ? parseISO(e.endDate) : startDate;

    let current = startDate;

    while (current <= endDate) {
      const isFirst = format(current, "yyyy-MM-dd") === e.startDate;
      const isLast = format(current, "yyyy-MM-dd") === e.endDate;

      let _start = 0;
      let _end = DAY_MINUTES;

      if (!e.isAllDay) {
        if (isFirst) _start = start ?? 0;
        if (isLast) _end = end ?? DAY_MINUTES;
      }

      output.push({
        ...e,
        startDate: format(current, "yyyy-MM-dd"),
        _start,
        _end,
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
  return events.filter((e) => e.startDate === key && !e.isAllDay);
}

function getAllDayEvents(events, date) {
  const key = dateKey(date);
  return events.filter((e) => e.startDate === key && e.isAllDay);
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

// UI HELPERS
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

function CalendarWeekView({ currentDate, events, onDayClick, setCurrentDate }) {
  const week = getWeek(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const normalized = normalizeEvents(events);
  return (
    <>
      <div className="rounded-xl overflow-hidden border border-border dark:border-[#2a1b3d] bg-background">
        {/* --------------------------------------- */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] ">
          {/* Time column (kept empty) */}
          <div className="bg-white dark:bg-[#0f0e13]"></div>

          {/* Shoot Week bar covers ALL 7 day columns */}
          <div
            className="col-start-2 col-span-7 text-center py-2 text-xs font-bold uppercase
                  bg-purple-50/80 dark:bg-purple-900/20
                  text-purple-800 dark:text-purple-300  border-border border-b dark:border-[#2a1b3d]"
          >
            {getProductionWeekLabel(format(week[0], "yyyy-MM-dd"))}
          </div>
        </div>
        {/* ---------------------------------- */}

        {/* HEADER */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] text-[11px] font-black uppercase border-b border-border dark:border-[#2a1b3d] bg-purple-50/80 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300">
          <div className="bg-white dark:bg-[#0f0e13] pr-4 text-muted-foreground flex  justify-end">
            Time
          </div>
          {week.map((d) => (
            <div
              key={d}
              className="pt-1 flex flex-col items-center justify-center"
            >
              <p className="text-[11px] font-black uppercase text-purple-800 dark:text-purple-300">
                {format(d, "EEE")}
              </p>
              <p className="text-[15px] font-bold text-purple-800 dark:text-purple-300">
                {d.getDate()}
              </p>
            </div>
          ))}
        </div>

        {/* All Day Body */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          <div className="text-right bg-muted/30 border-r border-b  border-border dark:border-[#2a1b3d] pt-1 pr-2 text-xs text-muted-foreground min-h-12">
            All Day
          </div>

          {/* ALL DAY */}
          {week.map((date) => (
            <div
              key={date}
              className="flex cursor-pointer gap-1 p-1 flex-col items-center border-r border-b border-border dark:border-[#2a1b3d]  text-purple-800 dark:text-purple-300 overflow-hidden"
              onClick={() => {
                setCurrentDate(date);
                onDayClick();
              }}
            >
              {getAllDayEvents(normalized, date).map((e) => (
                <Tooltip key={e.id}>
                  <TooltipTrigger asChild>
                    <div
                      key={e.id}
                      className="text-black text-center dark:text-white bg-purple-200 dark:bg-[#34014f] w-full text-[11px] pl-2 py-0.5 rounded-lg overflow-hidden"
                    >
                      {e.title}
                    </div>
                  </TooltipTrigger>

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
          ))}
        </div>

        {/* TIME GRID */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {/* Time labels */}
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

          {/* Day columns */}
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
                className="border-r border-b border-border dark:border-[#2a1b3d] overflow-visible relative"
              >
                {/* Hour background grid */}
                {hours.map((h) => (
                  <div
                    key={h}
                    className="h-12 border-b dark:border-[#2a1b3d]"
                  />
                ))}

                {/* Events layer (single render) */}

                {columns.map((col, colIndex) =>
                  col.map((e) => (
                    <Tooltip key={e.id}>
                      <TooltipTrigger asChild>
                        <div
                          key={e.id}
                          onClick={() => {
                            setCurrentDate(date);
                            onDayClick();
                          }}
                          style={getEventStyle(e, colIndex, columns.length)}
                          className="
  cursor-pointer absolute
   outline-1 outline-white/70 dark:outline-black/70
  text-black text-center dark:text-white
  bg-purple-200 dark:bg-[#34014f]
  w-full text-[12px] pl-2 pb-2 rounded-lg overflow-hidden
"
                        >
                          {e.title}
                        </div>
                      </TooltipTrigger>
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
                  )),
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default CalendarWeekView;
