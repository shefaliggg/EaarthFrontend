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
  HOUR_HEIGHT
} from "../utils/calendar.utils";

export default function CalendarDayView({ 
  currentDate, 
  events, 
  onDayClick, 
  onEventClick // <--- Added this prop
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

  return (
    <div className="rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card">
      {/* HEADER */}
      <div className="grid grid-cols-[80px_1fr] text-[11px] font-black uppercase border-b border-primary/20 bg-purple-50/80 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300">
        <div className="bg-card border-r border-primary/20 pr-3 text-muted-foreground flex items-center justify-end py-2">
          <span className="text-[10px]">TIME</span>
        </div>
        <div className="relative text-center py-1">
          <span className={cn(
            "absolute top-4 right-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full",
            phaseBadgeColor
          )}>
            {getProductionWeekLabel(currentDateStr)}
          </span>

          <p className="text-[11px] font-black uppercase text-purple-800 dark:text-purple-300">
            {format(currentDate, "EEEE")}
          </p>

          <p
            className={cn(
              "text-[14px] font-bold w-7 h-7 rounded-full flex items-center justify-center mx-auto text-purple-800 dark:text-purple-300",
              isToday(currentDate) && "bg-purple-200 dark:bg-purple-800/40"
            )}
          >
            {currentDate.getDate()}
          </p>
        </div>
      </div>

      {/* ALL DAY ROW */}
      <div className="grid grid-cols-[80px_1fr]">
        <div className="text-right bg-muted/40 border-r border-b border-primary/20 pt-2 pr-3 text-xs font-bold text-purple-800 dark:text-purple-300 min-h-12">
          ALL DAY
        </div>

        <div
          onClick={(e) => {
             // Only trigger create modal if clicking background
             if(e.target === e.currentTarget && onDayClick) onDayClick();
          }}
          className="flex cursor-pointer gap-1 p-2 flex-col items-start border-b border-primary/20 hover:bg-purple-50/60 dark:hover:bg-purple-900/20 transition-all duration-200 overflow-hidden min-h-12"
        >
          {allDayEvents.map((e) => (
            <Tooltip key={e.id || e._id}>
              <TooltipTrigger asChild>
                <div 
                  onClick={(ev) => {
                    ev.stopPropagation(); 
                    if (onEventClick) onEventClick(e); // <--- FIXED: Call prop here
                  }}
                  className={cn(
                    "w-full text-[11px] font-semibold text-center px-2 py-1 rounded-lg overflow-hidden shadow-sm whitespace-nowrap transition-all duration-200 hover:shadow-md border-l-3 cursor-pointer",
                    getAllDayEventColors(e.eventType)
                  )}
                >
                  {e.title}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-card text-card-foreground border-primary/20 shadow-lg">
                <div className="flex flex-col gap-2 p-1">
                  <p className="font-bold text-sm text-purple-800 dark:text-purple-300">
                    {e.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
          {hours.map((h) => (
            <div
              key={h}
              onClick={onDayClick}
              className="h-12 border-primary/20 border-b last:border-b-0 hover:bg-purple-50/40 dark:hover:bg-purple-900/10 cursor-pointer transition-all duration-200"
            />
          ))}

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
                          if (onEventClick) onEventClick(event); // <--- FIXED: Call prop here
                        }}
                        style={getEventStyle(event, colIndex, columns.length)}
                        className={cn(
                          "cursor-pointer absolute pointer-events-auto flex items-center justify-center py-0.5 px-1 text-[10px] font-semibold text-center rounded-md overflow-hidden border-l-3 shadow-sm transition-all duration-200 hover:shadow-md",
                          getEventColors(event.eventType)
                        )}
                      >
                        <div className="w-full overflow-hidden">
                          <div className="font-bold truncate">{event.title}</div>
                          {((event._end - event._start) / 60) * HOUR_HEIGHT > 30 && (
                            <div className="text-[9px] opacity-90 mt-0.5">
                              {format(startTime, "h:mm a")}
                            </div>
                          )}
                        </div>
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
                            {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
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
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}