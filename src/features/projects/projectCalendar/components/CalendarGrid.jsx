import CalendarDayView from "./CalendarDayView";
import CalendarGanttView from "./CalendarGanttView";
import CalendarMonthView from "./CalendarMonthView";
import CalendarWeekView from "./CalendarWeekView";

export default function CalendarGrid({
  view,
  currentDate,
  setCurrentDate,
  onDayClick,
  events,
}) {
  if (view === "month") {
    return (
      <CalendarMonthView
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onDayClick={onDayClick}
        events={events}
      />
    );
  }
  if (view === "day") {
    return (
      <CalendarDayView
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onDayClick={onDayClick}
        events={events}
      />
    );
  }
  if (view === "week") {
    return (
      <CalendarWeekView
        currentDate={currentDate}
        events={events}
        onDayClick={onDayClick}
      />
    );
  }

  if (view === "gantt") {
    return (
      <CalendarGanttView
        currentDate={currentDate}
        events={events}
        onEventClick={onDayClick}
      />
    );
  }

  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      {view.toUpperCase()} VIEW (UI Placeholder)
    </div>
  );
}
