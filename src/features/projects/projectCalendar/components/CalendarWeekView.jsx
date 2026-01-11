import React from "react";
import { cn } from "../../../../shared/config/utils";
import { startOfWeek, addDays, format } from "date-fns";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
export default function CalendarWeekView({ currentDate, events, onDayClick }) {
  const getWeekDates = (currentDate) => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDates = getWeekDates(currentDate);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const convertHour = (h) => {
    const hour12 = h % 12 || 12;
    const ampm = h < 12 ? "AM" : "PM";
    return `${hour12} ${ampm}`;
  };

  const isToday = (date) => date.toDateString() === new Date().toDateString();

  const formatDate = (date) => format(date, "yyyy-MM-dd");

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;

    const [time, modifier] = timeStr.split(" ");
    let [h, m] = time.split(":").map(Number);

    if (modifier === "PM" && h !== 12) h += 12;
    if (modifier === "AM" && h === 12) h = 0;

    return h * 60 + m;
  };

  const getEventsForTime = (dateStr, hour) => {
    const slotStart = hour * 60;
    const slotEnd = slotStart + 60;

    return events.filter((e) => {
      if (!e.startDate || !e.startTime || !e.endTime) return false;
      if (e.startDate !== dateStr) return false;

      const start = parseTimeToMinutes(e.startTime);
      const end = parseTimeToMinutes(e.endTime);

      return start < slotEnd && end > slotStart;
    });
  };

  return (
    <div
      className="
        rounded-xl overflow-hidden border
        bg-white dark:bg-[#0f0e13]
        border-border dark:border-[#2a1b3d]
        shadow-sm
      "
    >
      <div className="grid grid-cols-[80px_repeat(7,1fr)]">
        <div className="h-12 flex items-center justify-end pr-3 text-[11px] font-semibold text-muted-foreground">
          TIME
        </div>

        {weekDates.map((d, i) => (
          <div
            key={i}
            className="
              h-12 flex flex-col items-center justify-center
              bg-purple-50/80 dark:bg-purple-900/20
              border-b border-border dark:border-[#2a1b3d]
            "
          >
            <p className="text-xs font-bold text-purple-800 dark:text-purple-300">
              {d.toLocaleDateString("en-US", { weekday: "short" })}
            </p>
            <p
              className={cn(
                "text-lg font-bold",
                "text-purple-800 dark:text-purple-300",
                isToday(d) && "text-purple-600 dark:text-purple-400"
              )}
            >
              {d.getDate()}
            </p>
          </div>
        ))}

        {hours.map((h) => (
          <React.Fragment key={h}>
            <div
              className="
                h-12 flex items-start justify-end pr-3
                text-[11px] text-muted-foreground
                bg-muted/30
                border-t border-r border-border dark:border-[#2a1b3d]
              "
            >
              {convertHour(h)}
            </div>

            {weekDates.map((d, i) => {
              const slotEvents = getEventsForTime(formatDate(d), h);

              return (
                <div
                  key={i}
                  onClick={onDayClick}
                  className="
                    h-12 border-t border-r overflow-visible border-border dark:border-[#2a1b3d]
                    relative cursor-pointer
                    hover:bg-purple-50/40 dark:hover:bg-purple-900/20
                    transition
                  "
                >
                  {slotEvents.map((evt, idx) => {
                    const start = parseTimeToMinutes(evt.startTime);
                    const end = parseTimeToMinutes(evt.endTime);

                    const width = 100 / slotEvents.length;
                    const top = (start % 60) * (48 / 60); 

                    const rawHeight = ((end - start) / 60) * 48;
                    const height = Math.max(rawHeight, 24);

                    const fontSize =
                      height >= 60
                        ? "text-[12px]"
                        : height >= 40
                        ? "text-[11px]"
                        : height >= 28
                        ? "text-[10px]"
                        : "text-[9px]";

                    const showTime = height >= 28;

                    return (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            key={evt.id}
                            style={{
                              width: `${width}%`,
                              left: `${idx * width}%`,
                              top: `${top}px`,
                              height: `${height}px`,
                              backgroundColor: evt.color || "#9333ea",
                            }}
className={`
  absolute rounded-xl
  px-1 py-0.5
  shadow-md
  leading-tight
  cursor-pointer z-10
  overflow-hidden
  flex flex-col items-center justify-center
  text-center
  text-white dark:text-white
  ${fontSize}
`}

                          >
                            <span className="font-semibold block truncate">
                              {evt.title}
                            </span>

                            {showTime && (
                              <span className="opacity-90 block truncate text-[11px]">
                                {evt.startTime} — {evt.endTime}
                              </span>
                            )}
                          </div>
                        </TooltipTrigger>

                        <TooltipContent
                          className="
    text-center 
    bg-popover 
    text-popover-foreground 
    border border-border 
    shadow-md
  "
                        >
                          <div className="space-y-1">
                            <p className="font-semibold">{evt.title}</p>
                            <p className="text-xs">
                              {evt.startTime} – {evt.endTime}
                            </p>

                            {evt.location && (
                              <p className="text-xs opacity-80">
                                {evt.location}
                              </p>
                            )}

                            {evt.notes && (
                              <p className="text-xs opacity-70">{evt.notes}</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
