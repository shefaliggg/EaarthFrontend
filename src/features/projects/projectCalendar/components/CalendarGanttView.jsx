import { format, addDays, startOfWeek } from "date-fns";
import { cn } from "@/shared/config/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";

function getWeekDays(date) {
  return Array.from({ length: 14 }, (_, i) => addDays(startOfWeek(date), i));
}

function daysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
}

export default function CalendarGanttView({ currentDate, events }) {
  const days = getWeekDays(currentDate);

  const phases = [
    { name: "Prep", key: "prep", color: "bg-purple-500 dark:bg-purple-400" },
    { name: "Shoot", key: "shoot", color: "bg-pink-500 dark:bg-pink-400" },
    { name: "Wrap", key: "wrap", color: "bg-emerald-500 dark:bg-emerald-400" },
  ];
  const ganttRows = phases.map((phase) => ({
    ...phase,
    events: events
      .filter((e) => e.eventType === phase.key)
      .map((e) => ({
        ...e,
        progress: e.progress ?? 0, // default
      })),
  }));

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-background">
      {/* HEADER */}
      <div
        className="grid grid-cols-[200px_120px_120px_140px_repeat(14,1fr)] text-[11px] font-black uppercase border-b bg-purple-50/80 dark:bg-purple-900/20
text-purple-800 dark:text-purple-300
border-border dark:border-[#2a1b3d]
"
      >
        <div className="pl-4 py-3 border-r">Task</div>
        <div className="py-3 text-center border-r">Start</div>
        <div className="py-3 text-center border-r">End</div>
        <div className="py-3 text-center border-r">Progress</div>

        {days.map((d) => (
          <div key={d} className="py-3 text-center border-r">
            {format(d, "dd MMM")}
          </div>
        ))}
      </div>

      {/* BODY */}
      {ganttRows.map((row) => (
        <div key={row.name} className="border-b">
          {/* PHASE ROW */}
          <div className="grid grid-cols-[200px_120px_120px_140px_repeat(14,1fr)] bg-muted/30 dark:bg-muted/20">
            <div className="pl-4 py-2 font-bold text-purple-700 border-r">
              {row.name}
            </div>
            <div className="col-span-17" />
          </div>

          {/* EVENT ROWS */}
          {row.events.map((event) => {
            if (!event.startDate || !event.endDate) return null;

            const startIndex = days.findIndex(
              (d) => format(d, "yyyy-MM-dd") === event.startDate,
            );

            if (startIndex === -1) return null;

            const width = daysBetween(event.startDate, event.endDate);

            return (
              <div
                key={event.id}
                className="grid grid-cols-[200px_120px_120px_140px_repeat(14,1fr)] min-h-[48px]"
              >
                {/* TASK NAME */}
                <div className="pl-8 text-sm flex items-center border-r">
                  {event.title}
                </div>

                {/* START */}
                <div className="text-xs flex items-center justify-center border-r">
                  {format(new Date(event.startDate), "dd/MM/yy")}
                </div>

                {/* END */}
                <div className="text-xs flex items-center justify-center border-r">
                  {format(new Date(event.endDate), "dd/MM/yy")}
                </div>

                {/* PROGRESS */}
                <div className="flex items-center px-2 border-r">
                  <div className="w-full h-2 bg-muted rounded">
                    <div
                      className="h-2 bg-emerald-500 dark:bg-emerald-400 rounded"
                      style={{ width: `${event.progress}%` }}
                    />
                  </div>
                  <span className="ml-2 text-xs">{event.progress}%</span>
                </div>

                {/* TIMELINE BAR */}
                <div className="relative col-span-14">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "absolute top-2 h-8 rounded-lg shadow-md",
                          row.color,
                        )}
                        style={{
                          left: `${(startIndex / 14) * 100}%`,
                          width: `${(width / 14) * 100}%`,
                        }}
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.startDate} → {event.endDate}
                      </p>
                      <p className="text-xs">Progress: {event.progress}%</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
