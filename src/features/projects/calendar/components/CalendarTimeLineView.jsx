import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  startOfDay,
} from "date-fns";
import { Clock, MapPin, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/config/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";

/* ================= HELPERS ================= */

function getAttendeesInitials(event) {
  if (!event.audience || event.audience.type === "ALL") return "";
  if (!event.attendees || event.attendees.length === 0) return "";

  const initials = event.attendees.map(att => {
    const userObj = att.userId || att;
    const name = userObj.displayName || userObj.name || "";
    if (!name) return "";
    
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }).filter(Boolean);

  return [...new Set(initials)].join(", ");
}

function groupEventsByDate(events) {
  const map = {};

  events.forEach((e) => {
    if (!e.startDateTime) return;

    const start = new Date(e.startDateTime);
    const end = e.endDateTime ? new Date(e.endDateTime) : new Date(start);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const days = eachDayOfInterval({ start, end });

    days.forEach((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      if (!map[dateKey]) map[dateKey] = [];

      const id = e.id || e._id;
      const alreadyAdded = map[dateKey].some(
        (evt) => (evt.id || evt._id) === id,
      );
      if (!alreadyAdded) {
        map[dateKey].push(e);
      }
    });
  });

  return Object.entries(map).sort(([a], [b]) => new Date(a) - new Date(b));
}

/* ================= COMPONENT ================= */

export default function CalendarTimelineView({ events, currentDate }) {
  const [isPastCollapsed, setIsPastCollapsed] = useState(true);

  // Single month boundaries
  const rangeStart = startOfMonth(currentDate);
  const rangeEnd = endOfMonth(currentDate);

  // Include event if ANY part of it overlaps this month
  const relevantEvents = events.filter((e) => {
    if (!e.startDateTime) return false;
    const eStart = new Date(e.startDateTime);
    const eEnd = e.endDateTime ? new Date(e.endDateTime) : new Date(eStart);
    return eStart <= rangeEnd && eEnd >= rangeStart;
  });

  // Expand multi-day events, then clip to only days inside this month
  const allGrouped = groupEventsByDate(relevantEvents);
  const grouped = allGrouped.filter(([dateStr]) => {
    const d = new Date(dateStr + "T12:00:00");
    return d >= rangeStart && d <= rangeEnd;
  });

  // Separate past and current/future events
  const today = startOfDay(new Date());
  const pastEvents = grouped.filter(([dateStr]) => {
    const eventDate = new Date(dateStr + "T12:00:00");
    return isBefore(eventDate, today);
  });

  const currentAndFutureEvents = grouped.filter(([dateStr]) => {
    const eventDate = new Date(dateStr + "T12:00:00");
    return !isBefore(eventDate, today);
  });

  const uniqueEventIds = new Set(relevantEvents.map((e) => e.id || e._id));

  const prepCount = relevantEvents.filter((e) => e.productionPhase === "prep").length;
  const shootCount = relevantEvents.filter((e) => e.productionPhase === "shoot").length;
  const wrapCount = relevantEvents.filter((e) => e.productionPhase === "wrap").length;

  const summaryItems = [
    {
      key: "total",
      label: "Total",
      dotClass: "bg-purple-400/70 dark:bg-purple-500/60",
      badgeClass: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
      count: uniqueEventIds.size,
    },
    {
      key: "prep",
      label: "Prep",
      dotClass: "bg-sky-300 dark:bg-sky-800/80",
      badgeClass: "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300",
      count: prepCount,
    },
    {
      key: "shoot",
      label: "Shoot",
      dotClass: "bg-peach-300 dark:bg-peach-800/80",
      badgeClass: "bg-peach-100 dark:bg-peach-900/50 text-peach-700 dark:text-peach-300",
      count: shootCount,
    },
    {
      key: "wrap",
      label: "Wrap",
      dotClass: "bg-mint-300 dark:bg-mint-800/80",
      badgeClass: "bg-mint-100 dark:bg-mint-900/50 text-mint-700 dark:text-mint-300",
      count: wrapCount,
    },
  ];

  const getEventColors = (productionPhase) => {
    switch (productionPhase) {
      case "shoot":
        return {
          bg: "bg-peach-100 dark:bg-peach-900/30",
          text: "text-peach-800 dark:text-peach-200",
          border: "border-peach-400 dark:border-peach-700",
          accent: "bg-peach-500",
        };
      case "prep":
        return {
          bg: "bg-sky-100 dark:bg-sky-900/30",
          text: "text-sky-800 dark:text-sky-200",
          border: "border-sky-400 dark:border-sky-700",
          accent: "bg-sky-500",
        };
      case "wrap":
        return {
          bg: "bg-mint-100 dark:bg-mint-900/30",
          text: "text-mint-800 dark:text-mint-200",
          border: "border-mint-400 dark:border-mint-700",
          accent: "bg-mint-500",
        };
      default:
        return {
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-800 dark:text-purple-200",
          border: "border-purple-400 dark:border-purple-700",
          accent: "bg-purple-500",
        };
    }
  };

  const isToday = (dateStr) =>
    isSameDay(new Date(dateStr + "T12:00:00"), new Date());

  const renderEventGroup = ([date, dayEvents]) => {
    const todayFlag = isToday(date);

    return (
      <div key={date} className="relative flex items-start gap-4">
        {/* Date Circle */}
        <div className="relative flex-shrink-0 z-10">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex flex-col items-center justify-center font-black border-4 border-card shadow-lg transition-all duration-200",
              todayFlag
                ? "bg-purple-500 text-white scale-110 ring-4 ring-purple-200 dark:ring-purple-800/40"
                : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300",
            )}
          >
            <span className="text-[9px] leading-none uppercase">
              {format(new Date(date + "T12:00:00"), "MMM")}
            </span>
            <span className="text-[15px] leading-none font-black">
              {format(new Date(date + "T12:00:00"), "dd")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pt-1">
          {/* Day Label Row */}
          <div className="flex items-center gap-2 mb-2">
            <p className="font-bold text-sm text-foreground">
              {format(new Date(date + "T12:00:00"), "EEEE, MMMM d, yyyy")}
            </p>
            {todayFlag && (
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-500 text-white uppercase tracking-wide">
                Today
              </span>
            )}
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
            </span>
          </div>

          {/* Event Cards */}
          <div className="flex flex-col gap-2">
            {dayEvents.map((event) => {

              const colors = getEventColors(event.productionPhase);
              const isAllDay = event.isAllDay || event.allDay;

              const eStart = new Date(event.startDateTime);
              const eEnd = event.endDateTime
                ? new Date(event.endDateTime)
                : new Date(eStart);
              const isMultiDay = eStart.toDateString() !== eEnd.toDateString();

              const attendeesInitials = getAttendeesInitials(event);

              return (
                <Tooltip key={event.id || event._id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "relative cursor-pointer rounded-lg border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
                        colors.bg,
                        colors.border,
                      )}
                    >
                      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
                        
                        <div className="flex flex-col gap-0.5 min-w-0">
                          
                          <div className="flex items-baseline gap-1 truncate">
                             <h4 className={cn("font-bold text-sm truncate", colors.text)}>
                               {event.title}
                             </h4>
                             {attendeesInitials && (
                               <span className={cn("text-xs font-medium opacity-80 truncate", colors.text)}>
                                  - {attendeesInitials}
                               </span>
                             )}
                          </div>

                          <div className="flex items-center gap-3 flex-wrap mt-0.5">
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="font-medium">
                                {isAllDay
                                  ? "All Day Event"
                                  : isMultiDay
                                    ? `${format(eStart, "MMM d")} – ${format(eEnd,"MMM d")}`
                                    : `${format(eStart, "h:mm a")} – ${format(eEnd,"h:mm a")}`}
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

                        {/* Right: type badge */}

                        {event.productionPhase && (
                          <span
                            className={cn(
                              "text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0 text-white",
                              colors.accent,
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
                          {event.title} {attendeesInitials && `- ${attendeesInitials}`}
                        </p>
                      </div>

                      <div className="uppercase text-[9px] font-bold tracking-widest text-muted-foreground/80 mt-1">
                        {event.productionPhase} • {event.eventCategory}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-medium">
                          {isAllDay
                            ? "All Day Event"
                            : `${format(eStart, "MMM dd, h:mm a")} – ${format(
                                eEnd,
                                "MMM dd, h:mm a",
                              )}`}
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
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card">
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

      <div className="bg-purple-50/80 dark:bg-purple-900/20 border-b border-primary/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-purple-800 dark:text-purple-300">
              Production Timeline
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-bold text-purple-800 dark:text-purple-300">
              {grouped.length} days with events
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 overflow-y-auto h-[1150px]">
        {grouped.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Calendar className="w-12 h-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground italic">
              No events scheduled for {format(currentDate, "MMMM yyyy")}
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-[3px] bg-gradient-to-b from-purple-300 via-purple-400 to-purple-300 dark:from-purple-800/50 dark:via-purple-700/50 dark:to-purple-800/50 rounded-full" />

            <div className="space-y-5">
              {pastEvents.length > 0 && (
                <>
                  <div className="relative flex items-center gap-4">
                    <button
                      onClick={() => setIsPastCollapsed(!isPastCollapsed)}
                      className="relative flex-shrink-0 z-10 w-12 h-12 rounded-full flex items-center justify-center font-black border-4 border-card shadow-lg bg-muted cursor-pointer text-muted-foreground hover:text-foreground transition-all duration-200"
                    >
                      {isPastCollapsed ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronUp className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1 pt-1">
                      <p className="font-bold text-sm text-muted-foreground">
                        Past Events ({pastEvents.length} days)
                      </p>
                    </div>
                  </div>

                  {!isPastCollapsed && (
                    <div className="space-y-5 opacity-60">
                      {pastEvents.map(renderEventGroup)}
                    </div>
                  )}
                </>
              )}

              {currentAndFutureEvents.map(renderEventGroup)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}