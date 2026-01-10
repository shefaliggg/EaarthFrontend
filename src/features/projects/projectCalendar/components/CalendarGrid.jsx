import CalendarMonthView from "./CalendarMonthView";

export default function CalendarGrid({
  view,
  currentDate,
  setCurrentDate,
  onDayClick,
}) {
  if (view === "month") {
    return (
      <CalendarMonthView
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onDayClick={onDayClick}
      />
    );
  }

  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      {view.toUpperCase()} VIEW (UI Placeholder)
    </div>
  );
}
