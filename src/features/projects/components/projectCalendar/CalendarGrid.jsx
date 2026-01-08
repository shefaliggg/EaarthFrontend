import React from "react";
import { cn } from "../../../../shared/config/utils";

export default function CalendarGrid({
  view,
  currentDate,
  hours,
  daysOfWeek,
  monthNames,
  getWeekDates,
  getMonthDates,
  formatDate,
  getEventsForDate,
  getEventsForTime,
  handleTimeSlotClick,
  setCurrentDate,
  setView,
  setSelectedEvent,
  setShowEventModal,
}) {
  const isToday = (date) => formatDate(date) === formatDate(new Date());

  const convertHour = (hour) =>
    hour === 0
      ? "12 AM"
      : hour < 12
      ? `${hour} AM`
      : hour === 12
      ? "12 PM"
      : `${hour - 12} PM`;

  return (
    <div className="h-full">
      {/* day  */}
      {view === "day" && (
        <div className="grid grid-cols-[80px_1fr]">
          <div className="border-r">
            <div className="h-12 flex items-center justify-end pr-3 text-[11px] font-semibold">
              TIME
            </div>
            {hours.map((h) => (
              <div
                key={h}
                className="h-16 flex items-start justify-end pr-3 text-[11px] text-muted-foreground"
              >
                {convertHour(h)}
              </div>
            ))}
          </div>
          {/* ------------------------ */}
          <div>
            <div className="h-12 flex justify-center bg-secondary/20">
              <div className="">
                <p className="text-sm font-bold">
                  {daysOfWeek[currentDate.getDay()]}
                </p>

                <p
                  className={cn(
                    "text-md font-bold w-6 h-6 rounded-full flex items-center justify-center mx-auto",
                    isToday(currentDate) && "bg-primary text-white"
                  )}
                >
                  {currentDate.getDate()}
                </p>
              </div>
            </div>

            {hours.map((h) => {
              const dateStr = formatDate(currentDate);
              const events = getEventsForTime(dateStr, h);

              return (
                <div
                  key={h}
                  onClick={() => handleTimeSlotClick(dateStr, h)}
                  className="
                    h-16 border-t cursor-pointer relative
                    hover:bg-primary/5 transition
                  "
                >
                  {events.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                        setShowEventModal(true);
                      }}
                      className="
                        absolute left-2 right-2 top-1
                        px-3 py-2 rounded-xl
                        bg-primary text-white shadow-md
                        hover:shadow-lg transition
                      "
                    >
                      <p className="font-semibold text-sm truncate">
                        {event.title}
                      </p>
                      <p className="text-[11px] opacity-90">
                        {event.startTime} — {event.endTime}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "week" && (
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          <div
            className={cn(
              "h-12 text-muted-foreground flex items-center justify-end pr-3 text-[11px] font-semibold"
            )}
          >
            TIME
          </div>

          {getWeekDates(currentDate).map((d, i) => (
            <div
              key={i}
              className={cn(
                "h-16 flex flex-col items-center justify-center border-b border-border",
                "bg-secondary/20"
              )}
            >
              <p className="text-xs font-bold">
                {daysOfWeek[d.getDay()].slice(0, 3)}
              </p>
              <p
                className={cn(
                  "text-lg font-bold",
                  isToday(d) && "text-primary"
                )}
              >
                {d.getDate()}
              </p>
            </div>
          ))}

          {hours.map((h) => (
            <React.Fragment key={h}>
              <div
                className={cn(
                  "h-12 flex items-start justify-end pr-3 text-[11px] font-medium",
                  "bg-muted/30 border-t border-r border-border"
                )}
              >
                {convertHour(h)}
              </div>

              {getWeekDates(currentDate).map((d, i) => {
                const events = getEventsForTime(formatDate(d), h);

                return (
                  <div
                    key={i}
                    className="
                      h-12 border-t border-r relative cursor-pointer
                      hover:bg-primary/5 transition
                    "
                  >
                    {events.map((evt) => (
                      <div
                        key={evt.id}
                        className="
                          absolute inset-1 rounded
                          bg-primary text-white text-[10px]
                          px-2 py-1 truncate
                        "
                      >
                        {evt.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}

      {view === "month" && (
        <div className="rounded-2xl overflow-hidden border-2 border-border">
          <div
            className={cn(
              "grid grid-cols-7 text-center font-semibold py-2 border-b border-border",
              "bg-secondary/20 dark:bg-secondary/20",

              "text-foreground dark:text-foreground"
            )}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="tracking-wide">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 divide-x-2 divide-y-2 divide-border">
            {getMonthDates(currentDate).map((date, i) => {
              const events = getEventsForDate(formatDate(date));

              return (
                <div
                  key={i}
                  onClick={() => {
                    setCurrentDate(date);
                    setView("day");
                  }}
                  className={cn(
                    "h-28 p-3 relative cursor-pointer transition",

                    date.getMonth() !== currentDate.getMonth() && "opacity-40",
                    isToday(date) && "ring-2 ring-primary/40 z-[1]",
                    "hover:bg-primary/5"
                  )}
                >
                  <div className="absolute top-2 right-3 text-xs font-semibold">
                    {date.getDate()}
                  </div>

                  <div className="mt-6 space-y-1">
                    {events.slice(0, 3).map((e) => (
                      <div
                        key={e.id}
                        className="text-[11px] px-2 py-1 rounded-md truncate bg-primary/70 text-white"
                      >
                        {e.title}
                      </div>
                    ))}

                    {events.length > 3 && (
                      <p className="text-[11px] text-muted-foreground">
                        +{events.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
