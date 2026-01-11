import { format, addDays, differenceInDays } from "date-fns";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";

export default function CalendarGanttView({
  currentDate,
  events,
  onEventClick,
}) {
  const start = currentDate;
  const DAYS = 30;

  const timeline = Array.from({ length: DAYS }, (_, i) => addDays(start, i));

  const grouped = events.reduce((acc, e) => {
    const key = e.eventType || e.type || "other";
    acc[key] = acc[key] || [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <div className="rounded-xl overflow-hidden border bg-white dark:bg-[#0f0e13] border-border shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-[180px_repeat(30,1fr)] bg-purple-50/80 dark:bg-purple-900/20 border-b">
        <div className="p-3 text-xs font-bold text-muted-foreground">PHASE</div>
        {timeline.map((d) => (
          <div
            key={d}
            className="p-2 text-center text-[10px] font-bold text-purple-800 dark:text-purple-300"
          >
            {format(d, "dd")}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y">
        {Object.entries(grouped).map(([type, list]) => (
          <div
            key={type}
            className="grid grid-cols-[180px_repeat(30,1fr)] min-h-[80px]"
          >
            {/* Left label */}
            <div className="p-3 text-sm font-semibold capitalize bg-muted/20">
              {type}
            </div>

            {/* Timeline cells */}
            {timeline.map((day, i) => {
              const dayStr = format(day, "yyyy-MM-dd");

              return (
                <div key={i} className="relative border-l">
                  {list.map((e) => {
                    if (!e.startDate || !e.endDate) return null;

                    const startOffset = differenceInDays(
                      new Date(e.startDate),
                      start
                    );

                    const duration =
                      differenceInDays(
                        new Date(e.endDate),
                        new Date(e.startDate)
                      ) + 1;

                    if (startOffset !== i) return null;

                    return (
                      <Tooltip key={e.id}>
                        <TooltipTrigger asChild>
                     <div
  onClick={() => onEventClick(e)}
  style={{
    width: `${duration * 100}%`,
    backgroundColor: e.color || "#9333ea",
  }}
  className="
    absolute top-3 h-8 rounded-xl 
    text-white text-xs font-semibold 
    flex items-center justify-center
    shadow-md cursor-pointer
    hover:opacity-90
    left-0
    z-10
    isolate
  "
>
  {e.title}
</div>

                        </TooltipTrigger>

                        <TooltipContent>
                          <p className="font-semibold">{e.title}</p>
                          <p className="text-xs">
                            {e.startDate} → {e.endDate}
                          </p>
                          {e.location && (
                            <p className="text-xs opacity-80">{e.location}</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
