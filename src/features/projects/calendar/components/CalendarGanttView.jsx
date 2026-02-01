import { format, addDays, startOfWeek } from "date-fns";
import { cn } from "@/shared/config/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import { Clock, MapPin } from "lucide-react";

function getWeekDays(date) {
  return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(date), i));
}

function daysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
}

function calculateProgress(startDateTime, endDateTime) {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  today.setHours(12, 0, 0, 0);

  if (today <= start) return 0;
  if (today >= end) return 100;

  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));

  return Math.round((elapsedDays / totalDays) * 100);
}

export default function CalendarGanttView({ currentDate, events }) {
  const days = getWeekDays(currentDate);
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const GRID = "grid-cols-[20%_10%_10%_20%_repeat(7,1fr)]";

  const phases = [
    {
      name: "Prep Phase",
      key: "prep",
      headerColor: "bg-sky-50 dark:bg-sky-900/30",
      headerText: "text-sky-800 dark:text-sky-200",
      barColor: "bg-sky-500",
      lightBar: "bg-sky-200 dark:bg-sky-700/50",
      progressColor: "bg-sky-500",
    },
    {
      name: "Shoot Phase",
      key: "shoot",
      headerColor: "bg-lavender-50 dark:bg-lavender-900/30",
      headerText: "text-lavender-800 dark:text-lavender-200",
      barColor: "bg-lavender-500",
      lightBar: "bg-lavender-200 dark:bg-lavender-700/50",
      progressColor: "bg-lavender-500",
    },
    {
      name: "Wrap Phase",
      key: "wrap",
      headerColor: "bg-mint-50 dark:bg-mint-900/30",
      headerText: "text-mint-800 dark:text-mint-200",
      barColor: "bg-mint-500",
      lightBar: "bg-mint-200 dark:bg-mint-700/50",
      progressColor: "bg-mint-500",
    },
  ];

  const ganttRows = phases.map((phase) => {
    const phaseEvents = events
      .filter(
        (e) => e.eventType === phase.key && e.startDateTime && e.endDateTime,
      )
      .map((e) => {
        const startDate = format(new Date(e.startDateTime), "yyyy-MM-dd");
        const endDate = format(new Date(e.endDateTime), "yyyy-MM-dd");

        return {
          ...e,
          startDate,
          endDate,
          progress: calculateProgress(e.startDateTime, e.endDateTime),
        };
      })
      .filter((e) => {
        // Only include events that overlap with the current week view
        const eventStart = new Date(e.startDate);
        const eventEnd = new Date(e.endDate);
        const weekStart = days[0];
        const weekEnd = days[days.length - 1];
        
        // Set hours for proper comparison
        eventStart.setHours(0, 0, 0, 0);
        eventEnd.setHours(23, 59, 59, 999);
        weekStart.setHours(0, 0, 0, 0);
        weekEnd.setHours(23, 59, 59, 999);
        
        return (
          (eventStart >= weekStart && eventStart <= weekEnd) ||
          (eventEnd >= weekStart && eventEnd <= weekEnd) ||
          (eventStart <= weekStart && eventEnd >= weekEnd)
        );
      });

    const avgProgress =
      phaseEvents.length > 0
        ? Math.round(
            phaseEvents.reduce((sum, e) => sum + e.progress, 0) /
              phaseEvents.length,
          )
        : 0;

    return {
      ...phase,
      events: phaseEvents,
      overallProgress: avgProgress,
      hasEvents: phaseEvents.length > 0,
    };
  });

  return (
    <div className="rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card">
      {/* HEADER */}
      <div className={`grid ${GRID} text-[10px] font-black uppercase border-b border-primary/20 bg-purple-50/80 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300`}>
        <div className="pl-4 py-3 border-r border-primary/20 flex items-center">
          Events
        </div>
        <div className="py-3 text-center border-r border-primary/20 flex items-center justify-center">
          Start Date
        </div>
        <div className="py-3 text-center border-r border-primary/20 flex items-center justify-center">
          End Date
        </div>
        <div className="py-3 text-center border-r border-primary/20 flex items-center justify-center">
          Progress
        </div>

        {/* Week headers */}
        <div className="col-span-7 grid grid-cols-7 border-r border-primary/20">
          {days.map((d, idx) => (
            <div
              key={d}
              className="border-r border-primary/20 last:border-r-0 py-1 flex flex-col items-center justify-center"
            >
              <span className="text-[9px] text-muted-foreground">
                {weekDays[idx]}
              </span>
              <span className="text-[11px] font-bold">{format(d, "dd")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BODY */}
      {ganttRows.map((row) => (
        <div key={row.name} className="border-b border-primary/20 last:border-b-0">
          {/* PHASE HEADER ROW */}
          <div className={`grid ${GRID} min-h-[52px]`}>
            {/* Phase Name */}
            <div
              className={cn(
                "pl-4 py-3 font-black border-r border-primary/20 flex items-center text-sm",
                row.headerColor,
                row.headerText
              )}
            >
              {row.name}
            </div>

            {/* Phase Start Date */}
            <div
              className={cn(
                "text-xs flex items-center justify-center border-r border-primary/20 font-semibold",
                row.headerColor,
                row.headerText
              )}
            >
              {row.hasEvents ? format(new Date(row.events[0].startDateTime), "dd/MM/yy") : "-"}
            </div>

            {/* Phase End Date */}
            <div
              className={cn(
                "text-xs flex items-center justify-center border-r border-primary/20 font-semibold",
                row.headerColor,
                row.headerText
              )}
            >
              {row.hasEvents ? format(new Date(row.events[row.events.length - 1].endDateTime), "dd/MM/yy") : "-"}
            </div>

            {/* Phase Progress */}
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 border-r border-primary/20",
                row.headerColor
              )}
            >
              {row.hasEvents ? (
                <>
                  <span className={cn("text-sm font-black", row.headerText)}>
                    {row.overallProgress}%
                  </span>
                  <div className="w-full h-2.5 bg-white/30 dark:bg-black/30 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        row.progressColor
                      )}
                      style={{ width: `${row.overallProgress}%` }}
                    />
                  </div>
                </>
              ) : (
                <span className={cn("text-xs font-semibold", row.headerText)}>-</span>
              )}
            </div>

            {/* Phase Timeline */}
            <div
              className={cn(
                "col-span-7",
                row.headerColor
              )}
            />
          </div>

          {/* EVENT ROWS OR EMPTY STATE */}
          {!row.hasEvents ? (
            <div className={`grid ${GRID} min-h-[44px] bg-card`}>
              <div className="col-span-11 pl-12 text-xs flex items-center text-muted-foreground italic">
                No events scheduled for this phase in the current week
              </div>
            </div>
          ) : (
            row.events.map((event) => {
              const startIndex = days.findIndex(
                (d) => format(d, "yyyy-MM-dd") === event.startDate
              );

              if (startIndex === -1) return null;

              const width = daysBetween(event.startDate, event.endDate);

              return (
                <div
                  key={event.id || event._id}
                  className={`grid ${GRID} min-h-[44px] bg-card hover:bg-purple-50/40 dark:hover:bg-purple-900/10 transition-colors duration-200 border-t border-primary/10`}
                >
                  {/* Task Name */}
                  <div className="pl-12 text-xs flex items-center border-r border-primary/20 text-foreground font-medium">
                    {event.title}
                  </div>

                  {/* Start Date */}
                  <div className="text-xs flex items-center justify-center border-r border-primary/20 text-muted-foreground">
                    {format(new Date(event.startDateTime), "dd/MM/yy")}
                  </div>

                  {/* End Date */}
                  <div className="text-xs flex items-center justify-center border-r border-primary/20 text-muted-foreground">
                    {format(new Date(event.endDateTime), "dd/MM/yy")}
                  </div>

                  {/* Progress */}
                  <div className="flex flex-col items-center justify-center gap-0.5 px-3 border-r border-primary/20">
                    <span className="text-[11px] font-semibold text-foreground">
                      {event.progress}%
                    </span>
                    <div className="w-full h-1 bg-muted/60 dark:bg-muted/40 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          row.progressColor
                        )}
                        style={{ width: `${event.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative col-span-7">
                    {/* Day grid cells */}
                    <div className="absolute inset-0 grid grid-cols-7">
                      {days.map((d, i) => (
                        <div
                          key={i}
                          className="border-r border-primary/10 last:border-r-0"
                        />
                      ))}
                    </div>

                    {/* Event Bar */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "absolute top-2 bottom-2 rounded cursor-pointer transition-all duration-200 hover:opacity-90 z-10",
                            row.barColor
                          )}
                          style={{
                            left: `${(startIndex / 7) * 100}%`,
                            width: `${(width / 7) * 100}%`,
                          }}
                        >
                          {/* Progress overlay */}
                          <div
                            className={cn(
                              "h-full rounded transition-all duration-300",
                              row.lightBar
                            )}
                            style={{
                              width: `${100 - event.progress}%`,
                              marginLeft: `${event.progress}%`,
                            }}
                          />
                        </div>
                      </TooltipTrigger>

                      <TooltipContent className="bg-card text-card-foreground border-primary/20 shadow-lg">
                        <div className="flex flex-col gap-2 p-1">
                          <p className="font-bold text-sm text-purple-800 dark:text-purple-300">
                            {event.title}
                          </p>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-medium">
                              {format(
                                new Date(event.startDateTime),
                                "MMM dd, h:mm a"
                              )}{" "}
                              -{" "}
                              {format(
                                new Date(event.endDateTime),
                                "MMM dd, h:mm a"
                              )}
                            </span>
                          </div>

                          {event.location && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="font-medium">{event.location}</span>
                            </div>
                          )}

                          <div className="pt-1 border-t border-primary/20 mt-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                Progress:
                              </span>
                              <span className="font-bold text-purple-800 dark:text-purple-300">
                                {event.progress}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ))}
    </div>
  );
}