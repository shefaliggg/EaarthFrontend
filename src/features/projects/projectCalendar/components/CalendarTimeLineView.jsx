import { format, parseISO } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import { cn } from "../../../../shared/config/utils";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";

/* ================= HELPERS ================= */

function groupEventsByDate(events) {
  const map = {};

  events.forEach((e) => {
    if (!e.startDate) return;
    if (!map[e.startDate]) map[e.startDate] = [];
    map[e.startDate].push(e);
  });

  return Object.entries(map).sort(
    ([a], [b]) => new Date(a) - new Date(b)
  );
}

/* ================= COMPONENT ================= */

export default function CalendarTimelineView({ events, onEventClick }) {
  const grouped = groupEventsByDate(events);

  return (
    <div className="rounded-xl border border-border dark:border-[#2a1b3d] bg-background p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-lg text-purple-800 dark:text-purple-300">
          Production Timeline
        </h3>
        <span className="text-xs font-semibold text-muted-foreground">
          Chronological View
        </span>
      </div>

      {/* TIMELINE */}
      <div className="relative pl-10">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-purple-300/60 dark:bg-purple-800/50" />

        <div className="space-y-10">
          {grouped.map(([date, dayEvents]) => (
            <div key={date}>
              {/* DATE LABEL */}
              <div className="mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-800/40 flex items-center justify-center font-black text-purple-800 dark:text-purple-300">
                  {format(parseISO(date), "dd")}
                </div>

                <p className="font-bold text-sm text-purple-800 dark:text-purple-300">
                  {format(parseISO(date), "EEEE, MMM d")}
                </p>
              </div>

              {/* EVENTS */}
              <div className="space-y-4 pl-6">
                {dayEvents.map((event) => (
                  <Tooltip key={event.id || event._id}>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => onEventClick?.(event)}
                        className={cn(
                          "relative cursor-pointer p-4 rounded-xl border transition-all hover:scale-[1.02]",
                          "bg-purple-50/80 dark:bg-purple-900/20",
                          "border-purple-200 dark:border-purple-800/40"
                        )}
                      >
                        {/* DOT */}
                        <div className="absolute -left-10 top-5 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                        {/* TITLE */}
                        <h4 className="font-bold text-purple-900 dark:text-purple-200">
                          {event.title}
                        </h4>

                        {/* TIME */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {event.startTime} – {event.endTime}
                          </span>
                        </div>

                        {/* LOCATION */}
                        {event.location && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>

                    {/* TOOLTIP */}
                    <TooltipContent className="bg-card text-card-foreground">
                      <div className="flex flex-col gap-2">
                        <p className="font-semibold">{event.title}</p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {event.startTime} – {event.endTime}
                          </span>
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
