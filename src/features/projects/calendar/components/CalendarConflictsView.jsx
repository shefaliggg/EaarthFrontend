import { format, startOfMonth, endOfMonth } from "date-fns";
import { AlertTriangle, Clock, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/shared/config/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";

function getEventColors(productionPhase) {
  switch (productionPhase) {
    case "prep":
      return {
        bg: "bg-sky-100 dark:bg-sky-900/30",
        text: "text-sky-800 dark:text-sky-200",
        border: "border-sky-400 dark:border-sky-700",
        badge: "bg-sky-500",
      };
    case "shoot":
      return {
        bg: "bg-peach-100 dark:bg-peach-900/30",
        text: "text-peach-800 dark:text-peach-200",
        border: "border-peach-400 dark:border-peach-700",
        badge: "bg-peach-500",
      };
    case "wrap":
      return {
        bg: "bg-mint-100 dark:bg-mint-900/30",
        text: "text-mint-800 dark:text-mint-200",
        border: "border-mint-400 dark:border-mint-700",
        badge: "bg-mint-500",
      };
    default:
      return {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-800 dark:text-purple-200",
        border: "border-purple-400 dark:border-purple-700",
        badge: "bg-purple-500",
      };
  }
}

function ConflictEventCard({ event }) {

  const colors = getEventColors(event.productionPhase);
  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime);
  const isMultiDay = start.toDateString() !== end.toDateString();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "rounded-lg border-l-4 transition-all duration-200 hover:shadow-md cursor-default",
            colors.bg,
            colors.border,
          )}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex flex-col gap-1 min-w-0">
              <h4 className={cn("font-bold text-sm truncate", colors.text)}>
                {event.title}
              </h4>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="font-medium">
                    {isMultiDay
                      ? `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`
                      : `${format(start, "MMM d")} • ${format(start, "h:mm a")} – ${format(end, "h:mm a")}`}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="font-medium truncate">
                      {event.location}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {event.productionPhase && (
              <span
                className={cn(
                  "text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0 text-white",
                  colors.badge,
                )}
              >
                {event.productionPhase}
              </span>
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-card text-card-foreground border-primary/20 shadow-lg z-50">
        <div className="flex flex-col gap-2 p-1 max-w-xs">
          <div className="flex items-start justify-between gap-3 border-b border-primary/20 pb-2">
            <p className="font-bold text-sm text-purple-800 dark:text-purple-300">
              {event.title}
            </p>
          </div>
          
          <div className="uppercase text-[9px] font-bold tracking-widest text-muted-foreground/80 mt-1">
            {event.productionPhase} • {event.eventCategory}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">
              {format(start, "MMM dd, h:mm a")} –{" "}
              {format(end, "MMM dd, h:mm a")}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-medium">{event.location}</span>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function CalendarConflictsView({ conflicts, currentDate }) {
  // Filter conflicts to only those whose overlap falls in the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const visibleConflicts = conflicts.filter((c) => {
    // The overlap window is: max(start1, start2) to min(end1, end2)
    const overlapStart = new Date(
      Math.max(
        new Date(c.event1.startDateTime),
        new Date(c.event2.startDateTime),
      ),
    );
    const overlapEnd = new Date(
      Math.min(new Date(c.event1.endDateTime), new Date(c.event2.endDateTime)),
    );
    // Show conflict if overlap window touches the current month at all
    return overlapStart <= monthEnd && overlapEnd >= monthStart;
  });

  // Total conflicts across ALL time (for the badge)
  const totalAllTime = conflicts.length;

  const prepConflicts = visibleConflicts.filter(
    (c) => c.event1.productionPhase === "prep" || c.event2.productionPhase === "prep",
  ).length;
  const shootConflicts = visibleConflicts.filter(
    (c) => c.event1.productionPhase === "shoot" || c.event2.productionPhase === "shoot",
  ).length;
  const wrapConflicts = visibleConflicts.filter(
    (c) => c.event1.productionPhase === "wrap" || c.event2.productionPhase === "wrap",
  ).length;

  const summaryItems = [
    {
      key: "total",
      label: "Total",
      dotClass: "bg-purple-400/70 dark:bg-purple-500/60",
      badgeClass:
        "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
      count: visibleConflicts.length,
    },
    {
      key: "prep",
      label: "Prep",
      dotClass: "bg-sky-300 dark:bg-sky-800/80",
      badgeClass:
        "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300",
      count: prepConflicts,
    },
    {
      key: "shoot",
      label: "Shoot",
      dotClass: "bg-peach-300 dark:bg-peach-800/80",
      badgeClass:
        "bg-peach-100 dark:bg-peach-900/50 text-peach-700 dark:text-peach-300",
      count: shootConflicts,
    },
    {
      key: "wrap",
      label: "Wrap",
      dotClass: "bg-mint-300 dark:bg-mint-800/80",
      badgeClass:
        "bg-mint-100 dark:bg-mint-900/50 text-mint-700 dark:text-mint-300",
      count: wrapConflicts,
    },
  ];

  if (visibleConflicts.length === 0) {
    return (
      <div className="min-h-[calc(100vh-500px)] rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card flex flex-col">
        {/* Summary bar */}
        <div className="border-b border-primary/20 bg-purple-50/80 dark:bg-purple-900/20 px-6 py-4 flex justify-end">
          <div className="flex items-center gap-6">
            {summaryItems.map((item) => (
              <div key={item.key} className="flex items-center gap-1 text-xs">
                <span className={cn("w-3 h-3 rounded-sm", item.dotClass)} />
                <span className="font-semibold text-muted-foreground">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    item.badgeClass,
                  )}
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="bg-purple-50/80 dark:bg-purple-900/20 border-b border-primary/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg text-purple-800 dark:text-purple-300">
                Schedule Conflicts
              </h3>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                {format(currentDate, "MMMM yyyy")} • Overlapping event detection
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-bold text-green-700 dark:text-green-300">
                No Conflicts This Month
              </span>
            </div>
          </div>
        </div>

        {/* Empty body */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">All clear!</p>
            <p className="text-xs text-muted-foreground mt-1">
              No scheduling conflicts in {format(currentDate, "MMMM yyyy")}
            </p>
            {totalAllTime > 0 && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-2">
                {totalAllTime} conflict{totalAllTime !== 1 ? "s" : ""} exist in
                other months — use chevrons to navigate
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card">
      {/* SUMMARY BAR */}
      <div className="border-b border-primary/20 bg-purple-50/80 dark:bg-purple-900/20 px-6 py-4 flex justify-end">
        <div className="flex items-center gap-6">
          {summaryItems.map((item) => (
            <div key={item.key} className="flex items-center gap-1 text-xs">
              <span className={cn("w-3 h-3 rounded-sm", item.dotClass)} />
              <span className="font-semibold text-muted-foreground">
                {item.label}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  item.badgeClass,
                )}
              >
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Header */}
      <div className="bg-purple-50/80 dark:bg-purple-900/20 border-b border-primary/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-purple-800 dark:text-purple-300">
              Conflict Details
            </h3>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">
              {format(currentDate, "MMMM yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-bold text-red-700 dark:text-red-300">
              {visibleConflicts.length}{" "}
              {visibleConflicts.length === 1 ? "Conflict" : "Conflicts"}
            </span>
          </div>
        </div>
      </div>

      {/* Conflicts List - Scrollable */}
      <div className="overflow-auto h-[1140px] p-6">
        <div className="flex flex-col gap-5">
          {visibleConflicts.map((conflict, idx) => {
            const overlapStart = new Date(
              Math.max(
                new Date(conflict.event1.startDateTime),
                new Date(conflict.event2.startDateTime),
              ),
            );
            const overlapEnd = new Date(
              Math.min(
                new Date(conflict.event1.endDateTime),
                new Date(conflict.event2.endDateTime),
              ),
            );
            const isMultiDayOverlap =
              overlapStart.toDateString() !== overlapEnd.toDateString();

            return (
              <div
                key={idx}
                className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20 overflow-hidden"
              >
                {/* Conflict label strip */}
                <div className="flex items-center justify-between px-4 py-2 bg-red-100/60 dark:bg-red-900/20 border-b border-red-200 dark:border-red-900/40">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-[11px] font-black text-red-600 dark:text-red-400 uppercase tracking-wide">
                      Conflict #{idx + 1}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-red-500 dark:text-red-400 bg-red-200/60 dark:bg-red-900/40 px-2 py-0.5 rounded-full">
                    Overlap:{" "}
                    {isMultiDayOverlap
                      ? `${format(overlapStart, "MMM d")} – ${format(
                          overlapEnd,
                          "MMM d",
                        )}`
                      : `${format(overlapStart, "h:mm a")} – ${format(
                          overlapEnd,
                          "h:mm a",
                        )}`}
                  </span>
                </div>

                {/* Two event cards + divider */}
                <div className="p-4 flex flex-col gap-2">
                  <ConflictEventCard event={conflict.event1} />

                  <div className="flex items-center justify-center gap-2 py-0.5">
                    <div className="flex-1 h-px bg-red-200 dark:bg-red-900/40" />
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-200/60 dark:bg-red-900/30 border border-red-300 dark:border-red-800">
                      <ArrowRight className="w-3 h-3 text-red-500 rotate-90" />
                      <span className="text-[9px] font-black text-red-600 dark:text-red-400 uppercase">
                        Overlaps
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-red-200 dark:bg-red-900/40" />
                  </div>

                  <ConflictEventCard event={conflict.event2} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CalendarConflictsView;