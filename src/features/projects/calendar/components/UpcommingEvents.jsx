import { format } from "date-fns";
import { Calendar } from "lucide-react";

export default function UpcomingEvents({
  upcomingEvents,
  setSelectedEvent,
  setShowEventModal,
  view, // Add this prop
}) {
  const getEventTypeColor = (type) => {
    switch (type) {
      case "shoot":
        return "bg-lavender-100 text-lavender-700 dark:bg-lavender-900/30 dark:text-lavender-300";
      case "prep":
        return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300";
      case "wrap":
        return "bg-mint-100 text-mint-700 dark:bg-mint-900/30 dark:text-mint-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Dynamic event limit based on view
  const getEventLimit = () => {
    switch (view) {
      case "day":
        return 10;
      case "week":
        return 8;
      case "month":
        return 5;
      case "year":
        return 5;
      case "gantt":
        return 4;
      case "timeline":
        return 7;
      default:
        return 6;
    }
  };

  const eventLimit = getEventLimit();

  return (
    <>
      <div className="h-full flex flex-col rounded-xl border shadow-sm bg-white dark:bg-[#0f0e13] border-border dark:border-[#2a1b3d]">
        {/* HEADER */}
        <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4 border-b border-border">
          <h3 className="font-bold text-lg text-foreground">Upcoming Events</h3>
          <div className="ml-auto">
            <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-primary/10 dark:bg-primary/20 text-xs font-semibold text-primary">
              {upcomingEvents?.length || 0}
            </span>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {(!upcomingEvents || upcomingEvents.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Calendar className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                No upcoming events
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Your schedule is clear
              </p>
            </div>
          )}

          {upcomingEvents?.slice(0, eventLimit).map((event) => {
            const start = event.startDateTime
              ? new Date(event.startDateTime)
              : null;
            const end = event.endDateTime ? new Date(event.endDateTime) : null;

            const isMultiDay = event.isMultiDay;
            const isOngoing = event.isOngoing;

            return (
              <div
                key={event._id}
                onClick={() => {
                  setSelectedEvent?.(event);
                  setShowEventModal?.(true);
                }}
                className="
                group cursor-pointer
                rounded-lg border border-border
                bg-background/60 hover:bg-muted/60 hover:border-primary/20
                transition-all duration-200
                p-3.5
              "
              >
                <div className="flex items-start gap-3">
                  {/* DATE BADGE */}
                  {start && (
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex flex-col items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                          {format(start, "MMM")}
                        </span>
                        <span className="text-base font-bold text-primary leading-none">
                          {format(start, "dd")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {event.title}
                      </h4>

                      {event.eventType && (
                        <span
                          className={`shrink-0 px-2.5 py-1 text-[10px] rounded-full font-semibold uppercase tracking-wide ${getEventTypeColor(
                            event.eventType
                          )}`}
                        >
                          {event.eventType}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {/* Multi-day: Date range + Duration on same line */}
                      {isMultiDay ? (
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50">
                          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                            {format(start, "MMM dd")} → {format(end, "MMM dd")} •{" "}
                            {event.dayCount} Day Event
                            {isOngoing && " • In Progress"}
                          </span>
                        </div>
                      ) : (
                        <>
                          {/* Single day: Time */}
                          {!event.allDay && start && end && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {format(start, "h:mm a")} – {format(end, "h:mm a")}
                              </span>
                            </div>
                          )}

                          {/* All day */}
                          {event.allDay && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium">All Day</span>
                            </div>
                          )}
                        </>
                      )}

                      {/* Location */}
                      {event.location && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}