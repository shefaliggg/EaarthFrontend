import { format } from "date-fns";

export default function UpcomingEvents({
  events,
  setSelectedEvent,
  setShowEventModal,
}) {
  return (
    <div
      className="
        p-4 rounded-xl border shadow-sm
        bg-white dark:bg-[#0f0e13]
        border-border dark:border-[#2a1b3d]
        space-y-4
      "
    >
      <h3 className="font-bold text-lg text-foreground">
        Upcoming Events
      </h3>

      {events.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No upcoming events
        </p>
      )}

      {events.slice(0, 5).map((event) => (
        <div
          key={event.id}
          onClick={() => {
            setSelectedEvent?.(event);
            setShowEventModal?.(true);
          }}
          className="
            p-3 rounded-lg border cursor-pointer
            bg-purple-50/60 dark:bg-purple-900/10
            border-border dark:border-[#2a1b3d]
            hover:bg-purple-100/60 dark:hover:bg-purple-900/20
            transition
          "
        >
          {/* Title */}
          <p className="font-semibold text-sm truncate text-foreground">
            {event.title}
          </p>

          {/* Date */}
          {event.startDate && (
            <p className="text-xs text-muted-foreground">
              {format(new Date(event.startDate), "EEE, dd MMM")}
            </p>
          )}

          {/* Time */}
          {!event.isAllDay && event.startTime && (
            <p className="text-xs text-muted-foreground">
              {event.startTime} – {event.endTime}
            </p>
          )}

          {/* Location */}
          {event.location && (
            <p className="text-xs text-muted-foreground truncate">
              {event.location}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
