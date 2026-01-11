import { cn } from "../../../../shared/config/utils";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
export default function CalendarDayView({
  currentDate,
  events,
  onDayClick,
  //   setCurrentDate,
}) {
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
      <div className="grid grid-cols-[80px_1fr]">
        {/* TIME COLUMN */}
        <div className="border-r border-border dark:border-[#2a1b3d]">
          <div className="h-12 flex items-center justify-end pr-3 text-[11px] font-semibold text-muted-foreground">
            TIME
          </div>

          {hours.map((h) => (
            <div
              key={h}
              className="
                h-16 flex items-start justify-end pr-3
                text-[11px] text-muted-foreground
                border-t border-border dark:border-[#2a1b3d]
              "
            >
              {convertHour(h)}
            </div>
          ))}
        </div>

        {/* DAY COLUMN */}
        <div>
          <div
            className="
              h-12 flex justify-center items-center
              bg-purple-50/80 dark:bg-purple-900/20
              border-b border-border dark:border-[#2a1b3d]
            "
          >
            <div className="text-center">
              <p className="text-sm font-bold text-purple-800 dark:text-purple-300">
                {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
              </p>

              <p
                className={cn(
                  "text-md font-bold w-6 h-6 rounded-full flex items-center justify-center mx-auto",
                  "text-purple-800 dark:text-purple-300",
                  isToday(currentDate) && "bg-purple-200 dark:bg-purple-800/40"
                )}
              >
                {currentDate.getDate()}
              </p>
            </div>
          </div>

          {hours.map((h) => {
            const dateStr = formatDate(currentDate);
            const slotEvents = getEventsForTime(dateStr, h);

            return (
              <div
                key={h}
                onClick={() => onDayClick()}
                className="
                  h-16 border-t relative overflow-visible border-border dark:border-[#2a1b3d]
                  cursor-pointer 
                  hover:bg-purple-50/40 dark:hover:bg-purple-900/20
                  transition
                "
              >
                {slotEvents.map((event, idx) => {
                  const start = parseTimeToMinutes(event.startTime);
                  const end = parseTimeToMinutes(event.endTime);

                  const width = 100 / slotEvents.length;
                  const top = (start % 60) * (64 / 60);

                  const rawHeight = ((end - start) / 60) * 64;
                  const height = Math.max(rawHeight, 18);

                  const fontSize =
                    height >= 90
                      ? "text-[14px]"
                      : height >= 70
                      ? "text-[13px]"
                      : height >= 50
                      ? "text-[12px]"
                      : height >= 30
                      ? "text-[11px]"
                      : "text-[10px]";

                  const showTime = height >= 32;

                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          key={event.id}
                          style={{
                            width: `${width}%`,
                            left: `${idx * width}%`,
                            top: `${top}px`,
                            height: `${height}px`,
                            backgroundColor: event.color || "#9333ea",
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
  text-white
  dark:text-white
  backdrop-blur-sm
  ${fontSize}
`}
                        >
                          <span className="font-semibold truncate block">
                            {event.title}
                          </span>

                          {showTime && (
                            <span className="text-[11px] opacity-90 block">
                              {event.startTime} — {event.endTime}
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>

                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-semibold">{event.title}</p>
                          <p className="text-xs">
                            {event.startTime} – {event.endTime}
                          </p>
                          {event.location && (
                            <p className="text-xs opacity-80">
                              {event.location}
                            </p>
                          )}
                          {event.notes && (
                            <p className="text-xs opacity-70">{event.notes}</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
