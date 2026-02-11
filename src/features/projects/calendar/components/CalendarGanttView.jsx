import {
  format,
  addDays,
  startOfWeek,
  startOfYear,
  differenceInDays,
  endOfYear,
} from "date-fns";
import { cn } from "@/shared/config/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import { Clock, MapPin, CalendarDays, TrendingUp } from "lucide-react";
import { useRef, useEffect, useMemo } from "react";

// ─── Helpers ───────────────────────────────────────────────────
function calculateProgress(startDateTime, endDateTime) {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  today.setHours(12, 0, 0, 0);
  if (today <= start) return 0;
  if (today >= end) return 100;
  const totalMs = end - start;
  const elapsedMs = today - start;
  return Math.round((elapsedMs / totalMs) * 100);
}

function getYearWeeks(year) {
  const janFirst = startOfYear(new Date(year, 0, 1));
  const weekStart = startOfWeek(janFirst, { weekStartsOn: 1 }); // Monday start
  const yearEnd = endOfYear(new Date(year, 0, 1));
  const weeks = [];
  let current = weekStart;
  while (current <= yearEnd || weeks.length < 52) {
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(current, i));
    weeks.push(weekDays);
    current = addDays(current, 7);
    if (weeks.length >= 53) break; // safety
  }
  return weeks;
}

function getAllDays(weeks) {
  return weeks.flat();
}

// ─── Constants ─────────────────────────────────────────────────
const DAY_COL_WIDTH = 28; // px per day cell
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const PHASE_ROW_HEIGHT = 52;
const EVENT_ROW_HEIGHT = 44;
const EVENT_ROW_HEIGHT_RIGHT_BAR = 44;
const EMPTY_ROW_HEIGHT = 350;
const HEADER_HEIGHT = 62; // week label row + day label row

const PHASES = [
  {
    name: "Prep Phase",
    key: "prep",
    headerBg: "bg-sky-50 dark:bg-sky-950/40",
    headerText: "text-sky-700 dark:text-sky-300",
    barFilled: "bg-sky-300 dark:bg-sky-800/80",
    barUnfilled: "bg-sky-200 dark:bg-sky-800/60",
    progressBar: "bg-sky-500",
    badge: "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300",
    accent: "border-l-sky-500",
  },
  {
    name: "Shoot Phase",
    key: "shoot",
    headerBg: "bg-peach-50 dark:bg-peach-900/40",
    headerText: "text-peach-700 dark:text-peach-300",
    barFilled: "bg-peach-300 dark:bg-peach-800/80",
    barUnfilled: "bg-lavender-200 dark:bg-lavender-800/60",
    progressBar: "bg-lavender-500",
    badge:
      "bg-peach-100 dark:bg-peach-900/50 text-peach-700 dark:text-peach-300",
    accent: "border-l-peach-500",
  },
  {
    name: "Wrap Phase",
    key: "wrap",
    headerBg: "bg-mint-50 dark:bg-mint-900/40",
    headerText: "text-mint-700 dark:text-mint-300",
    barFilled: "bg-mint-300 dark:bg-mint-800/80",
    barUnfilled: "bg-mint-200 dark:bg-mint-800/60",
    progressBar: "bg-mint-500",
    badge: "bg-mint-100 dark:bg-mint-900/50 text-mint-700 dark:text-mint-300",
    accent: "border-l-mint-500",
  },
];

// ─── Component ─────────────────────────────────────────────────
function CalendarGanttView({ currentDate, events }) {
  const timelineRef = useRef(null);
  const year = currentDate.getFullYear();
  const weeks = useMemo(() => getYearWeeks(year), [year]);
  const allDays = useMemo(() => getAllDays(weeks), [weeks]);
  const totalDays = allDays.length;
  const TIMELINE_WIDTH = totalDays * DAY_COL_WIDTH;

  const todayStr = format(new Date(), "yyyy-MM-dd");

  // ── Auto-scroll to current week on mount ──
  useEffect(() => {
    if (timelineRef.current) {
      const today = new Date();
      const dayIndex = allDays.findIndex(
        (d) => format(d, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
      );
      if (dayIndex > -1) {
        const scrollPos = Math.max(0, dayIndex * DAY_COL_WIDTH - 200);
        timelineRef.current.scrollLeft = scrollPos;
      }
    }
  }, [allDays]);

  // ── Build gantt data ──
  const ganttRows = useMemo(() => {
    return PHASES.map((phase) => {
      const phaseEvents = events
        .filter(
          (e) => e.eventType === phase.key && e.startDateTime && e.endDateTime,
        )
        .map((e) => ({
          ...e,
          startDate: format(new Date(e.startDateTime), "yyyy-MM-dd"),
          endDate: format(new Date(e.endDateTime), "yyyy-MM-dd"),
          progress: calculateProgress(e.startDateTime, e.endDateTime),
        }))
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

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
  }, [events]);

  // ── Bar position calculator ──
  const getBarStyle = (event) => {
    const rangeStart = new Date(allDays[0]);
    rangeStart.setHours(0, 0, 0, 0);
    const rangeEnd = new Date(allDays[allDays.length - 1]);
    rangeEnd.setHours(23, 59, 59, 999);

    let eventStart = new Date(event.startDate);
    let eventEnd = new Date(event.endDate);
    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);

    // Clamp
    const clampedStart = eventStart < rangeStart ? rangeStart : eventStart;
    const clampedEnd = eventEnd > rangeEnd ? rangeEnd : eventEnd;

    const startOffset = Math.max(
      0,
      Math.round((clampedStart - rangeStart) / (1000 * 60 * 60 * 24)),
    );
    const duration = Math.max(
      1,
      Math.round((clampedEnd - clampedStart) / (1000 * 60 * 60 * 24)) + 1,
    );

    return {
      left: startOffset * DAY_COL_WIDTH,
      width: duration * DAY_COL_WIDTH,
    };
  };

  // ── Get month labels for the timeline header ──
  const monthMarkers = useMemo(() => {
    const markers = [];
    let lastMonth = -1;
    allDays.forEach((d, i) => {
      const m = d.getMonth();
      if (m !== lastMonth) {
        markers.push({ index: i, label: format(d, "MMM yyyy") });
        lastMonth = m;
      }
    });
    return markers;
  }, [allDays]);

  // ── Today line position ──
  const todayIndex = allDays.findIndex(
    (d) => format(d, "yyyy-MM-dd") === todayStr,
  );
  const todayOffset =
    todayIndex > -1 ? todayIndex * DAY_COL_WIDTH + DAY_COL_WIDTH / 2 : -1;

  return (
    <>
      <div className="min-h-[calc(100vh-500px)] rounded-xl overflow-hidden border border-primary/20  bg-card shadow-lg">
        {/* SUMMARY BAR  */}
        <div className="border-b border-primary/20 bg-purple-50/80 dark:bg-purple-900/20 px-6 py-4 flex justify-end">
          <div className="flex items-center gap-6">
            {ganttRows.map((row) => (
              <div key={row.key} className="flex items-center gap-1 text-xs">
                <span className={cn("w-3 h-3 rounded-sm", row.barFilled)} />
                <span className="font-semibold text-muted-foreground">
                  {row.name.replace(" Phase", "")}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    row.badge,
                  )}
                >
                  {row.events.length}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* MAIN LAYOUT  */}
        <div className="flex">
          {/* FIXED LEFT PANEL  */}
          <div className="w-115  border-r border-primary/20">
            {/* Left Header */}
            <div
              className="grid grid-cols-[1.6fr_0.8fr_0.8fr_1fr] border-b border-primary/20 bg-purple-50/80 dark:bg-purple-900/20"
              style={{ height: HEADER_HEIGHT }}
            >
              <div className="pl-4 flex items-center text-[10px] font-black uppercase text-purple-800 dark:text-purple-300 border-r border-primary/20">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                Tasks
              </div>
              <div className="flex items-center justify-center text-[10px] font-black uppercase text-purple-800 dark:text-purple-300 border-r border-primary/20">
                Start
              </div>
              <div className="flex items-center justify-center text-[10px] font-black uppercase text-purple-800 dark:text-purple-300 border-r border-primary/20">
                End
              </div>
              <div className="flex items-center justify-center text-[10px] font-black uppercase text-purple-800 dark:text-purple-300">
                Progress
              </div>
            </div>
            {/* Left Body Rows */}
              {ganttRows.map((row) => (
                <div
                  key={row.name}
                  className="border-b border-primary/20 last:border-b-0"
                >
                  {/* Phase Header Row */}
                  <div
                    className={cn(
                      "grid grid-cols-[1.6fr_0.8fr_0.8fr_1fr] ",
                      row.accent,
                    )}
                    style={{
                      height: PHASE_ROW_HEIGHT,
                    }}
                  >
                    <div
                      className={cn(
                        "pl-4 flex items-center font-black text-sm border-r border-primary/20",
                        row.headerBg,
                        row.headerText,
                      )}
                    >
                      {row.name}
                      {row.hasEvents && (
                        <span
                          className={cn(
                            "ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                            row.badge,
                          )}
                        >
                          {row.events.length}
                        </span>
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex items-center justify-center text-xs font-semibold border-r border-primary/20",
                        row.headerBg,
                        row.headerText,
                      )}
                    >
                      {row.hasEvents
                        ? format(
                            new Date(row.events[0].startDateTime),
                            "dd/MM/yy",
                          )
                        : "—"}
                    </div>
                    <div
                      className={cn(
                        "flex items-center justify-center text-xs font-semibold border-r border-primary/20",
                        row.headerBg,
                        row.headerText,
                      )}
                    >
                      {row.hasEvents
                        ? format(
                            new Date(
                              row.events[row.events.length - 1].endDateTime,
                            ),
                            "dd/MM/yy",
                          )
                        : "—"}
                    </div>
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 px-3",
                        row.headerBg,
                      )}
                    >
                      {row.hasEvents ? (
                        <>
                          <span
                            className={cn("text-sm font-black", row.headerText)}
                          >
                            {row.overallProgress}%
                          </span>
                          <div className="w-full h-2 bg-white/40 dark:bg-black/30 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                row.progressBar,
                              )}
                              style={{ width: `${row.overallProgress}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <span
                          className={cn(
                            "text-xs font-semibold",
                            row.headerText,
                          )}
                        >
                          —
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Event Rows or Empty */}
                  {!row.hasEvents ? (
                    <div
                      className="text-xs flex items-center justify-center text-muted-foreground/40 italic border-l-4 border-l-transparent"
                      style={{ height: EMPTY_ROW_HEIGHT }}
                    >
                      No events scheduled
                    </div>
                  ) : (
                    row.events.map((event) => (
                      <div
                        key={event.id || event._id}
                        className="grid grid-cols-[1.6fr_0.8fr_0.8fr_1fr] hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-colors duration-150 border-t border-primary/20"
                        style={{ height: EVENT_ROW_HEIGHT }}
                      >
                        {/* TASK */}
                        <div className="grid items-center pl-4 border-primary/20 border-r">
                          <span className="text-xs font-semibold truncate">
                            {event.title}
                          </span>
                        </div>
                        {/* START DATE */}
                        <div className="grid text-[11px] place-items-center border-r border-primary/20 text-muted-foreground">
                          {format(new Date(event.startDateTime), "dd/MM/yy")}
                        </div>
                        {/* END DATE */}
                        <div className="grid text-[11px] place-items-center border-r border-primary/20 text-muted-foreground">
                          {format(new Date(event.endDateTime), "dd/MM/yy")}
                        </div>
                        <div className="flex flex-col items-center justify-center gap-0.5 px-3">
                          <span className="text-[11px] font-bold text-foreground">
                            {event.progress}%
                          </span>
                          <div className="w-full h-1.5 bg-muted/50 dark:bg-muted/30 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                row.progressBar,
                              )}
                              style={{ width: `${event.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ))}
          
          </div>
             {/* ─── SCROLLABLE TIMELINE PANEL ─── */}
        <div className="flex-1 overflow-x-auto" ref={timelineRef}>
          <div
            className="relative"
            style={{ width: TIMELINE_WIDTH, minWidth: TIMELINE_WIDTH }}
          >
            {/* Timeline Header */}
            <div
              className="sticky top-0 z-10 border-b border-primary/20 bg-purple-50/80 dark:bg-purple-900/20"
              style={{ height: HEADER_HEIGHT }}
            >
              {/* Month labels */}
              <div className="absolute top-0 left-0 right-0 flex h-[20px]">
                {monthMarkers.map((marker, idx) => {
                  const nextIdx =
                    idx < monthMarkers.length - 1
                      ? monthMarkers[idx + 1].index
                      : totalDays;
                  const span = nextIdx - marker.index;
                  return (
                    <div
                      key={marker.label}
                      className="flex items-center justify-center text-[9px] font-black uppercase text-purple-600 dark:text-purple-400 border-r border-primary/20 bg-purple-100/60 dark:bg-purple-800/20"
                      style={{ width: span * DAY_COL_WIDTH }}
                    >
                      {marker.label}
                    </div>
                  );
                })}
              </div>

              {/* Week labels */}
              <div
                className="absolute left-0 right-0 flex"
                style={{ top: 20, height: 18 }}
              >
                {weeks.map((_, wIdx) => (
                  <div
                    key={wIdx}
                    className="text-center text-[8px] font-bold uppercase text-purple-700/70 dark:text-purple-400/70 border-r border-primary/15 flex items-center justify-center"
                    style={{ width: 7 * DAY_COL_WIDTH }}
                  >
                    W{String(wIdx + 1).padStart(2, "0")}
                  </div>
                ))}
              </div>

              {/* Day labels */}
              <div
                className="absolute left-0 right-0 flex"
                style={{ top: 38, height: HEADER_HEIGHT - 38 }}
              >
                {allDays.map((d, i) => {
                  const isToday = format(d, "yyyy-MM-dd") === todayStr;
                  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex flex-col items-center justify-center border-r border-primary/10 last:border-r-0",
                        isToday &&
                          "bg-purple-300/50 dark:bg-purple-700/50 rounded-sm",
                        isWeekend &&
                          !isToday &&
                          "bg-purple-50/50 dark:bg-purple-900/10"
                      )}
                      style={{
                        width: DAY_COL_WIDTH,
                        minWidth: DAY_COL_WIDTH,
                      }}
                    >
                      <span
                        className={cn(
                          "text-[8px] font-bold",
                          isToday
                            ? "text-purple-800 dark:text-purple-200"
                            : "text-muted-foreground/60"
                        )}
                      >
                        {DAY_LABELS[i % 7]}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-bold",
                          isToday
                            ? "text-purple-900 dark:text-purple-100"
                            : "text-muted-foreground"
                        )}
                      >
                        {format(d, "d")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── TODAY INDICATOR LINE ── */}
            {todayOffset > 0 && (
              <div
                className="absolute z-30 pointer-events-none"
                style={{
                  left: todayOffset,
                  top: 0,
                  bottom: 0,
                  width: 2,
                }}
              >
                <div className="w-full h-full bg-red-500/70 dark:bg-red-400/70" />
                <div className="absolute -top-0 -left-[5px] w-3 h-3 rounded-full bg-red-500 dark:bg-red-400 border-2 border-white dark:border-gray-900" />
              </div>
            )}

            {/* Timeline Body Rows */}
            {ganttRows.map((row) => (
              <div
                key={row.name}
                className="border-b border-primary/20 last:border-b-0"
              >
                {/* Phase header timeline band */}
                <div
                  className={cn("relative", row.headerBg)}
                  style={{ height: PHASE_ROW_HEIGHT }}
                >
                  {/* Weekend shading + grid lines */}
                  <div className="absolute inset-0 flex">
                    {allDays.map((d, i) => (
                      <div
                        key={i}
                        className={cn(
                          "border-r border-primary/5 last:border-r-0",
                          (d.getDay() === 0 || d.getDay() === 6) &&
                            "bg-black/[0.03] dark:bg-white/[0.02]"
                        )}
                        style={{
                          width: DAY_COL_WIDTH,
                          minWidth: DAY_COL_WIDTH,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Event bar rows */}
                {!row.hasEvents ? (
                  <div style={{ height: EMPTY_ROW_HEIGHT }} />
                ) : (
                  row.events.map((event) => {
                    const barPos = getBarStyle(event);

                    return (
                      <div
                        key={event.id || event._id}
                        className="relative border-t border-primary/10"
                        style={{ height: EVENT_ROW_HEIGHT }}
                      >
                        {/* Grid + weekend shading */}
                        <div className="absolute inset-0 flex">
                          {allDays.map((d, i) => (
                            <div
                              key={i}
                              className={cn(
                                "border-r border-primary/5 last:border-r-0",
                                (d.getDay() === 0 || d.getDay() === 6) &&
                                  "bg-black/[0.02] dark:bg-white/[0.01]"
                              )}
                              style={{
                                width: DAY_COL_WIDTH,
                                minWidth: DAY_COL_WIDTH,
                              }}
                            />
                          ))}
                        </div>

                        {/* ── THE BAR ── */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="absolute top-[8px] z-10 group cursor-pointer"
                              style={{
                                left: barPos.left,
                                width: barPos.width,
                                height: EVENT_ROW_HEIGHT - 16,
                              }}
                            >
                              {/* Bar background (full) */}
                              <div
                                className={cn(
                                  "absolute inset-0 rounded-md shadow-sm group-hover:shadow-md transition-shadow duration-200",
                                  row.barUnfilled
                                )}
                              />
                              {/* Bar filled portion */}
                              <div
                                className={cn(
                                  "absolute inset-y-0 left-0 rounded-md transition-all duration-500",
                                  row.barFilled
                                )}
                                style={{ width: `${event.progress}%` }}
                              />
                              {/* Bar label (if wide enough) */}
                              {barPos.width > 80 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-[9px] font-bold text-white drop-shadow-sm truncate px-2">
                                    {event.title}
                                  </span>
                                </div>
                              )}
                              {/* Hover glow */}
                              <div className="absolute inset-0 rounded-md ring-0 group-hover:ring-2 group-hover:ring-purple-400/30 dark:group-hover:ring-purple-500/30 transition-all duration-200" />
                            </div>
                          </TooltipTrigger>

                          <TooltipContent
                            side="top"
                            className="bg-card text-card-foreground border border-primary/20 shadow-xl rounded-lg max-w-xs"
                          >
                            <div className="flex flex-col gap-2.5 p-2">
                              <div className="flex items-start justify-between gap-3">
                                <p className="font-bold text-sm text-purple-800 dark:text-purple-300 leading-tight">
                                  {event.title}
                                </p>
                                <span
                                  className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap",
                                    row.badge
                                  )}
                                >
                                  {row.name.replace(" Phase", "")}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="font-medium">
                                  {format(
                                    new Date(event.startDateTime),
                                    "MMM dd, yyyy"
                                  )}{" "}
                                  →{" "}
                                  {format(
                                    new Date(event.endDateTime),
                                    "MMM dd, yyyy"
                                  )}
                                </span>
                              </div>

                              {event.location && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="font-medium">
                                    {event.location}
                                  </span>
                                </div>
                              )}

                              <div className="pt-2 border-t border-primary/15">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-muted-foreground font-medium">
                                    Progress
                                  </span>
                                  <span className="font-black text-purple-800 dark:text-purple-300">
                                    {event.progress}%
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      "h-full rounded-full transition-all duration-300",
                                      row.progressBar
                                    )}
                                    style={{
                                      width: `${event.progress}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    );
                  })
                )}
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default CalendarGanttView;
