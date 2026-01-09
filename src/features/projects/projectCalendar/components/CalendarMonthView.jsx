import { startOfMonth, startOfWeek, addDays } from "date-fns";
import { cn } from "../../../../shared/config/utils";


export default function CalendarMonthView({
  currentDate,
  setCurrentDate,
  onDayClick,
}) {
  const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarStartDate = startOfWeek(startOfMonth(currentDate));
  const calendarDays = Array.from({ length: 35 }, (_, i) =>
    addDays(calendarStartDate, i)
  );

  return (
    <div
      className="rounded-xl overflow-hidden border 
  bg-white dark:bg-[#0f0e13] 
  border-border dark:border-[#2a1b3d] 
  shadow-sm"
    >
      <div
        className="grid grid-cols-7 text-center text-[11px] font-black uppercase  
    bg-purple-50/80 dark:bg-purple-900/20
    text-purple-800 dark:text-purple-300
    border-b border-border dark:border-[#2a1b3d]"
      >
        {WEEK_DAYS.map((day) => (
          <div key={day} className="py-3 border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((date, index) => {
          const isToday = date.toDateString() === new Date().toDateString();
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();

          return (
            <div
              key={index}
              onClick={() => {
                setCurrentDate(date);
                onDayClick();
              }}
              className={cn(
                "relative h-28 p-3 cursor-pointer transition",
                "bg-white dark:bg-[#0f0e13]",
                "hover:bg-purple-50/40 dark:hover:bg-purple-900/20",
                "border-r border-b border-border dark:border-[#2a1b3d]",
                (index + 1) % 7 === 0 && "border-r-0",
                !isCurrentMonth && "opacity-65",
                isToday && "ring-2 ring-purple-400/40 z-1"
              )}
            >
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
