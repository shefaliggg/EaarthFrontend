import { format, startOfMonth, startOfYear, addMonths, addDays, startOfWeek } from "date-fns";
import { cn } from "../../../../shared/config/utils";

function getMonthGrid(monthDate) {
  const start = startOfWeek(startOfMonth(monthDate));
  return Array.from({ length: 35 }, (_, i) => addDays(start, i));
}

export default function CalendarYearView({ currentDate, setCurrentDate, onDayClick, events }) {
  const yearStart = startOfYear(currentDate);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  const hasEvents = (date) => {
    const key = format(date, "yyyy-MM-dd");
    return events.some((e) => e.startDate === key);
  };

  const isToday = (date) =>
    date.toDateString() === new Date().toDateString();

  return (
    <div className="rounded-xl overflow-hidden border border-border dark:border-[#2a1b3d] bg-background p-4 space-y-6">
      
      {/* YEAR HEADER */}
      <div className="text-center">
        <h2 className="text-xl font-black text-purple-800 dark:text-purple-300">
          {format(currentDate, "yyyy")}
        </h2>
      </div>

      {/* MONTH GRID */}
      <div className="grid grid-cols-3 gap-4">
        {months.map((monthDate) => {
          const monthGrid = getMonthGrid(monthDate);

          return (
            <div
              key={monthDate}
              className="rounded-lg border border-border dark:border-[#2a1b3d] bg-muted/20 dark:bg-[#120018]/40 p-3 hover:shadow-md transition"
            >
              {/* MONTH TITLE */}
              <h3 className="text-sm font-bold mb-2 text-purple-800 dark:text-purple-300">
                {format(monthDate, "MMMM")}
              </h3>

              {/* WEEK LABELS */}
              <div className="grid grid-cols-7 text-[10px] font-bold text-center text-muted-foreground mb-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* DAYS GRID */}
              <div className="grid grid-cols-7 gap-0.5">
                {monthGrid.map((date, i) => {
                  const inMonth =
                    date.getMonth() === monthDate.getMonth();

                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setCurrentDate(date);
                        onDayClick();
                      }}
                      className={cn(
                        "text-[10px] flex flex-col items-center justify-center rounded-md cursor-pointer transition",
                        "hover:bg-purple-100 dark:hover:bg-purple-900/30",
                        !inMonth && "opacity-30",
                        isToday(date) &&
                          "bg-purple-200 dark:bg-purple-800/40 font-bold",
                      )}
                    >
                      <span>{date.getDate()}</span>

                      {/* Event Dot */}
                      {hasEvents(date) && !isToday(date) && (
                        <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
