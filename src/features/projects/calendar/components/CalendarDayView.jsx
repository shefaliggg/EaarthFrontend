import { format } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/shared/config/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import { getProductionWeekLabel, getPhaseForDate } from "./productionPhases";

import {
  normalizeDayEvents,
  getAllDayEvents,
  layoutEvents,
  getEventStyle,
  formatHour,
  getEventColors,
  getAllDayEventColors,
  HOUR_HEIGHT,
} from "../utils/calendar.utils";

export default function CalendarDayView({
  currentDate,
  events,
  onDayClick,
  onEventClick, 
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = normalizeDayEvents(events, currentDate);
  const allDayEvents = getAllDayEvents(events, currentDate);

  const columns = layoutEvents(dayEvents);
  const isToday = (date) => date.toDateString() === new Date().toDateString();

  const currentDateStr = format(currentDate, "yyyy-MM-dd");
  const phase = getPhaseForDate(currentDateStr);
  const phaseBadgeColor = phase
    ? phase.name === "Prep"
      ? "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300"
      : phase.name === "Shoot"
        ? "bg-peach-100 text-peach-800 dark:bg-peach-900/40 dark:text-peach-300"
        : "bg-mint-100 text-mint-800 dark:bg-mint-900/40 dark:text-mint-300"
    : "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300";

  // SUMMARY COUNTS
  const summaryCounts = (() => {
    const counts = { prep: 0, shoot: 0, wrap: 0 };
    for (const e of events || []) {

      if (e?.productionPhase && counts[e.productionPhase] !== undefined) {
        counts[e.productionPhase] += 1;
      }
    }
    const total = Object.values(counts).reduce((s, n) => s + n, 0);
    return { ...counts, total };
  })();

  const summaryItems = [
    {
      key: "total",
      label: "Total",
      dotClass: "bg-purple-400/70 dark:bg-purple-500/60",
      badgeClass:
        "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
      count: summaryCounts.total,
    },
    {
      key: "prep",
      label: "Prep",
      dotClass: "bg-sky-300 dark:bg-sky-800/80",
      badgeClass:
        "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300",
      count: summaryCounts.prep,
    },
    {
      key: "shoot",
      label: "Shoot",
      dotClass: "bg-peach-300 dark:bg-peach-800/80",
      badgeClass:
        "bg-peach-100 dark:bg-peach-900/50 text-peach-700 dark:text-peach-300",
      count: summaryCounts.shoot,
    },
    {
      key: "wrap",
      label: "Wrap",
      dotClass: "bg-mint-300 dark:bg-mint-800/80",
      badgeClass:
        "bg-mint-100 dark:bg-mint-900/50 text-mint-700 dark:text-mint-300",
      count: summaryCounts.wrap,
    },
  ];

  return (
    <div className="rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card">
      {/* HEADER */}
      <div className="grid grid-cols-[80px_1fr] border-b border-primary/20 bg-purple-50/80 dark:bg-purple-900/20">
        <div className="bg-card border-r border-primary/20 pr-3 text-muted-foreground flex items-center justify-end py-2">
          <span className="text-[10px] font-black uppercase tracking-wide">
            TIME
          </span>
        </div>

        <div className="py-2 px-3">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full whitespace-nowrap",
                phaseBadgeColor,
              )}
            >
              {getProductionWeekLabel(currentDateStr)}
            </div>

            {/* Center: day name + date */}
            <div className="flex items-center justify-center gap-2 flex-1 text-center">
              <p className="text-[11px] font-black uppercase text-purple-800 dark:text-purple-300">
                {format(currentDate, "EEEE")}
              </p>
              <p
                className={cn(
                  "text-[14px] font-bold w-7 h-7 rounded-full flex items-center justify-center text-purple-800 dark:text-purple-300",
                  isToday(currentDate) && "bg-purple-200 dark:bg-purple-800/40",
                )}
              >
                {currentDate.getDate()}
              </p>
            </div>

            {/* Right corner: summary */}
            <div className="flex items-center gap-6 whitespace-nowrap">
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
        </div>
      </div>

      {/* ALL DAY ROW */}
      <div className="grid grid-cols-[80px_1fr]">
        <div className="text-right bg-muted/40 border-r border-b border-primary/20 pt-2 pr-3 text-xs font-bold text-purple-800 dark:text-purple-300 min-h-12">
          ALL DAY
        </div>

        <div
          onClick={(e) => {

            if (e.target === e.currentTarget && onDayClick) {
              onDayClick(currentDate);
            }
          }}
          className="flex cursor-pointer gap-1 p-2 flex-col items-start border-b border-primary/20 hover:bg-purple-50/60 dark:hover:bg-purple-900/20 transition-all duration-200 overflow-hidden min-h-12"
        >
          {allDayEvents.map((e) => (
            <Tooltip key={e.id || e._id}>
              <TooltipTrigger asChild>
                <div
                  onClick={(ev) => {
                    ev.stopPropagation();
                    if (onEventClick) onEventClick(e); 
                  }}
                  className={cn(
                    "w-full text-[11px] font-semibold text-center px-2 py-1 rounded-lg overflow-hidden shadow-sm whitespace-nowrap transition-all duration-200 hover:shadow-md border-l-3 cursor-pointer",
                    getAllDayEventColors(e.productionPhase),
                  )}
                >
                  {e.title}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-card text-card-foreground border-primary/20 shadow-lg z-50">
                <div className="flex flex-col gap-2 p-1">
                  <p className="font-bold text-sm text-purple-800 dark:text-purple-300 pb-1 border-b border-primary/20">
                    {e.title}
                  </p>
                  <div className="uppercase text-[9px] font-bold tracking-widest text-muted-foreground/80 pt-1">
                    {e.productionPhase} • {e.eventCategory}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">All Day Event</span>
                  </div>
                  {e.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-medium">{e.location}</span>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-[80px_1fr]">
        {/* TIME COLUMN */}
        <div>
          {hours.map((h) => (
            <div
              key={h}
              className="flex h-12 items-center justify-center text-xs font-semibold text-purple-800 dark:text-purple-300 bg-muted/40 border-b border-r last:border-b border-primary/20"
            >
              {formatHour(h)}
            </div>
          ))}
        </div>

        {/* DAY COLUMN */}
        <div className="relative bg-card">
          {/* Hour Grid */}
          {hours.map((h) => {
            const handleHourClick = () => {
              const slotDate = new Date(currentDate);
              slotDate.setHours(h, 0, 0, 0);
              if (onDayClick) onDayClick(slotDate);
            };

            return (
              <div
                key={h}
                onClick={handleHourClick}
                className="h-12 border-primary/20 border-b last:border-b-0 hover:bg-purple-50/40 dark:hover:bg-purple-900/10 cursor-pointer transition-all duration-200"
              />
            );
          })}

          {/* EVENTS */}
          <div className="absolute left-1 inset-0 pointer-events-none">
            {columns.map((col, colIndex) =>
              col.map((event) => {
                const startTime = new Date(event.startDateTime);
                const endTime = new Date(event.endDateTime);

                return (
                  <Tooltip key={event.id || event._id}>
                    <TooltipTrigger asChild>
                      <div
                        onClick={(ev) => {
                          ev.stopPropagation();
                          if (onEventClick) onEventClick(event); 
                        }}
                        style={getEventStyle(event, colIndex, columns.length)}
                        className={cn(
                          "cursor-pointer absolute pointer-events-auto flex items-center justify-center py-0.5 px-1 text-[10px] font-semibold text-center rounded-md overflow-hidden border-l-3 shadow-sm transition-all duration-200 hover:shadow-md",
                          getEventColors(event.productionPhase),
                        )}
                      >
                        <div className="w-full overflow-hidden">
                          <div className="font-bold truncate">{event.title}</div>
                          {((event._end - event._start) / 60) * HOUR_HEIGHT >
                            30 && (
                            <div className="text-[9px] opacity-90 mt-0.5">
                              {format(startTime, "h:mm a")}
                            </div>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent className="bg-card text-card-foreground border-primary/20 shadow-lg z-50">
                      <div className="flex flex-col gap-2 p-1">
                        <p className="font-bold text-sm text-purple-800 dark:text-purple-300 pb-1 border-b border-primary/20">
                          {event.title}
                        </p>
                        <div className="uppercase text-[9px] font-bold tracking-widest text-muted-foreground/80 pt-1">
                          {event.productionPhase} • {event.eventCategory}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-medium">
                            {format(startTime, "h:mm a")} -{" "}
                            {format(endTime, "h:mm a")}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="font-medium">
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              }),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}