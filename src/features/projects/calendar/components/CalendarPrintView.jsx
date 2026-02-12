import { useSearchParams } from "react-router-dom";
import useCalendar from "../hooks/useCalendar";
import CalendarMonthView from "./CalendarMonthView";
import { useEffect } from "react";
// import other views too

function CalendarPrintView() {
  const [params] = useSearchParams();
  const viewParam = params.get("view");
  const dateParam = params.get("date");

  const {
    events,
    setView,
    setCurrentDate,
  } = useCalendar();

  useEffect(() => {
    if (viewParam) setView(viewParam);
    if (dateParam) setCurrentDate(new Date(dateParam));
  }, []);

  return (
    <div className="bg-white p-6">
      {viewParam === "month" && (
        <CalendarMonthView
          currentDate={new Date(dateParam)}
          events={events}
          setCurrentDate={() => {}}
          onDayClick={() => {}}
        />
      )}

      {/* Add other views here */}
    </div>
  );
}

export default CalendarPrintView;
