import { cn } from "../../../../shared/config/utils";


export default function UpcomingEvents({
  isDarkMode,
  events,
  setSelectedEvent,
  setShowEventModal
}) {
  return (
    <div className="p-4 rounded-xl border bg-background space-y-4">
      <h3 className="font-bold text-lg">Upcoming Events</h3>

      {events.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No upcoming events
        </p>
      )}

      {events.slice(0, 5).map(event => (
        <div
          key={event.id}
          onClick={() => {
            setSelectedEvent(event);
            setShowEventModal(true);
          }}
          className={cn(
            "p-3 rounded-lg border cursor-pointer transition",
            isDarkMode
              ? "bg-gray-800/30 border-gray-700 hover:bg-gray-800"
              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
          )}
        >
          <p className="font-bold text-sm truncate">{event.title}</p>
          <p className="text-xs text-muted-foreground">{event.date}</p>
          <p className="text-xs text-muted-foreground">
            {event.startTime} – {event.endTime}
          </p>
        </div>
      ))}
    </div>
  );
}

