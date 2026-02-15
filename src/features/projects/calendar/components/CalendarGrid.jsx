import CalendarConflictsView from "./CalendarConflictsView";
import CalendarDayView from "./CalendarDayView";
import CalendarGanttView from "./CalendarGanttView";
import CalendarMonthView from "./CalendarMonthView";
import CalendarTimelineView from "./CalendarTimeLineView";
import CalendarWeekView from "./CalendarWeekView";
import CalendarYearView from "./CalendarYearView";
import CalendarAnalyticsView from "./CalendarAnalyticsView";

export default function CalendarGrid({
  view,
  currentDate,
  setCurrentDate,
  onDayClick,
  events,
  conflicts,
  analyticsData, 
  onEditEvent,
}) {
  switch (view) {
    case "month":
      return (
        <CalendarMonthView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          onDayClick={onDayClick}
          events={events}
        />
      );
    case "day":
      return (
        <CalendarDayView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          onDayClick={onDayClick}
          events={events}
        />
      );
    case "week":
      return (
        <CalendarWeekView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate} // <--- ADDED THIS
          events={events}
          onDayClick={onDayClick}
        />
      );
    case "gantt":
      return (
        <CalendarGanttView
          currentDate={currentDate}
          events={events}
          onEventClick={onDayClick}
        />
      );
    case "timeline":
      return (
        <CalendarTimelineView
          currentDate={currentDate}
          events={events}
          onEventClick={onDayClick}
        />
      );
    case "year":
      return (
        <CalendarYearView
          currentDate={currentDate}
          events={events}
          onEventClick={onDayClick}
        />
      );
    case "analytics":
      return (
        <CalendarAnalyticsView
          analyticsData={analyticsData}
          currentDate={currentDate}
        />
      ); 
    case "conflicts":
      return (
        <CalendarConflictsView
          conflicts={conflicts}
          currentDate={currentDate}
        />
      );
    default:
      return (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          {view.toUpperCase()} VIEW (UI Placeholder)
        </div>
      );
  }
}