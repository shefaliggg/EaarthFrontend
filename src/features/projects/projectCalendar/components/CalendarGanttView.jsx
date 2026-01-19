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

export default function CalendarGanttView({ currentDate }) {
  const days = getWeekDays(currentDate);
  const events = [
    {
      id: 8,
      title: "PREP PHASE",
      startDate: "2026-01-10",
      endDate: "2026-01-18",
      eventType: "prep",
      location: "Studio / Office",
    },
    {
      id: 9,
      title: "SHOOT PHASE",
      startDate: "2026-01-19",
      endDate: "2026-01-25",
      eventType: "shoot",
      location: "Wales & Forest Locations",
    },
    {
      id: 10,
      title: "WRAP PHASE",
      startDate: "2026-01-26",
      endDate: "2026-01-30",
      eventType: "wrap",
      location: "Post-Production Studio",
    },
  ];
  const phases = [
    { name: "Prep", key: "prep", color: "bg-purple-500" },
    { name: "Shoot", key: "shoot", color: "bg-pink-500" },
    { name: "Wrap", key: "wrap", color: "bg-emerald-500" },
  ];

  // Convert your events into Gantt bars
  const ganttRows = phases.map((phase) => {
    const phaseEvents = events.filter(
      (e) => e.eventType === phase.key && e.startDate && e.endDate,
    );

    return {
      ...phase,
      events: phaseEvents,
    };
  });

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-background">
      {/* HEADER */}
      <div className="grid grid-cols-[160px_repeat(14,1fr)] text-[11px] font-black uppercase border-b bg-purple-50/80 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300">
        <div className="pl-4 py-3 border-r">Phase</div>
        {days.map((d) => (
          <div key={d} className="py-3 text-center border-r">
            {format(d, "dd MMM")}
          </div>
        ))}
      </div>

      {/* ROWS */}
      {ganttRows.map((row) => (
        <div
          key={row.name}
          className="grid grid-cols-[160px_repeat(14,1fr)] border-b min-h-[56px]"
        >
          {/* LEFT LABEL */}
          <div className="flex items-center pl-4 font-bold text-sm text-purple-700 dark:text-purple-300 border-r">
            {row.name}
          </div>

          {/* TIMELINE */}
          <div className="relative col-span-14">
            {row.events.map((event) => {
              const startIndex = days.findIndex(
                (d) => format(d, "yyyy-MM-dd") === event.startDate,
              );

              if (startIndex === -1) return null;

              const width = daysBetween(event.startDate, event.endDate);

              return (
                <Tooltip key={event.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "absolute top-2 h-10 rounded-lg text-white text-xs font-bold px-3 flex items-center shadow-md",
                        row.color,
                      )}
                      style={{
                        left: `${(startIndex / 14) * 100}%`,
                        width: `${(width / 14) * 100}%`,
                      }}
                    >
                      {event.title}
                    </div>
                  </TooltipTrigger>

                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.startDate} → {event.endDate}
                      </p>
                      {event.location && (
                        <p className="text-xs">📍 {event.location}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
