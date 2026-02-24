import { format, startOfDay } from "date-fns";
import { Calendar } from "lucide-react";
import { cn } from "@/shared/config/utils";

export default function UpcomingEvents({
  upcomingEvents,
  setSelectedEvent,
  setShowEventModal,
}) {
  const getEventTypeColor = (type) => {
    switch (type) {
      case "shoot":
        return "bg-peach-100 text-peach-800 dark:bg-peach-800/30 dark:text-peach-300";
      case "prep":
        return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300";
      case "wrap":
        return "bg-mint-100 text-mint-700 dark:bg-mint-900/30 dark:text-mint-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const today = startOfDay(new Date());
  
  const futureEvents = (upcomingEvents || [])
    .filter((event) => {
      if (!event.startDateTime) return false;
      
      const endDate = new Date(event.endDateTime || event.startDateTime);
      endDate.setHours(0, 0, 0, 0); 
      
      return endDate >= today;
    })
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

  return (
    <>
      <div className="rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card">
        {/* HEADER */}
        <div className="flex justify-between px-4 py-5 border-b border-primary/20">
          <h3 className="font-bold text-lg text-foreground">Upcoming Events</h3>
          <span className="flex items-center px-2 justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-xs font-semibold text-primary">
            {futureEvents.length}
          </span>
        </div>
        
        {/* BODY */}
        <div className="p-4 space-y-3 overflow-y-auto h-[1230px]">
          {futureEvents.length === 0 && (
            <div className="flex flex-col items-center py-12 gap-1">
              <Calendar className="w-8 h-8 text-muted-foreground/40 mb-1" />
              <p className="text-sm text-muted-foreground">
                No upcoming events
              </p>
              <p className="text-xs text-muted-foreground/70">
                Your schedule is clear
              </p>
            </div>
          )}
          
          {futureEvents.map((event) => {
            const start = event.startDateTime
              ? new Date(event.startDateTime)
              : null;
            const end = event.endDateTime ? new Date(event.endDateTime) : null;

            const isMultiDay = event.isMultiDay;
            const isOngoing = event.isOngoing;

            return (
              <div
                key={event._id || event.id}
                onClick={() => {
                  setSelectedEvent?.(event);
                  setShowEventModal?.(true);
                }}
                className="cursor-pointer rounded-lg border border-primary/20 transition-all duration-200 hover:bg-muted/60 hover:border-primary/20"
              >
                <div className="flex gap-4 p-3.5">
                  {/* DATE BADGE */}
                  {start && (
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/20 dark:bg-primary/20">
                      <span className="text-[10px] font-semibold text-primary uppercase">
                        {format(start, "MMM")}
                      </span>
                      <span className="text-base font-bold text-primary">
                        {format(start, "dd")}
                      </span>
                    </div>
                  )}
                  {/* CONTENT */}
                  <div className="flex-1 gap-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold truncate text-foreground hover:text-primary transition-colors">
                        {event.title}
                      </h4>
                      {event.eventType && (
                        <span
                          className={cn(
                            "text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full",
                            getEventTypeColor(event.eventType)
                          )}
                        >
                          {event.eventType}
                        </span>
                      )}
                    </div>
                    {/* ----------------------------------------------------- */}
                    <div className="space-y-1.5">
                      {/* Multi-day: Date range + Duration */}
                      {isMultiDay ? (
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50">
                          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                            {format(start, "MMM dd")} → {format(end, "MMM dd")}{" "}
                            • {event.dayCount} Day Event
                            {isOngoing && " • In Progress"}
                          </span>
                        </div>
                      ) : (
                        <>
                          {/* Single day: Time */}
                          {!event.allDay && start && end && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {format(start, "h:mm a")} –{" "}
                                {format(end, "h:mm a")}
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