import { useState } from "react";
import { PageHeader } from "../../../../shared/components/PageHeader";
import CalendarGrid from "../../components/projectCalendar/CalendarGrid";
import UpcomingEvents from "../../components/projectCalendar/UpcomingEvents";
import CalendarToolbar from "../../components/projectCalendar/CalendarToolbar";

function ProjectCalendar() {
  const events = [];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("all");
  const [view, setView] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatDate = (date) => date.toISOString().split("T")[0];

  const getWeekDates = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const getMonthDates = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const getEventsForDate = (date) => events.filter((e) => e.date === date);

  const getEventsForTime = (date, hour) =>
    getEventsForDate(date).filter(
      (e) => parseInt(e.startTime.split(":")[0]) === hour
    );

  const handleTimeSlotClick = (date, hour) => {
    console.log("Create event at:", date, hour);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon="Calendar"
        title="Calendar"
        primaryAction={{
          label: "New Event",
          icon: "Plus",
          size: "lg",
          clickAction: () => console.log("Create Event"),
        }}
      />
      <CalendarToolbar
        currentDate={currentDate}
        events={events}
        search={search}
        setSearch={setSearch}
        period={period}
        setPeriod={setPeriod}
        view={view}
        setView={setView}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div>
          <CalendarGrid
            view={view}
            isDarkMode={false}
            currentDate={currentDate}
            hours={hours}
            daysOfWeek={daysOfWeek}
            monthNames={monthNames}
            getWeekDates={getWeekDates}
            getMonthDates={getMonthDates}
            formatDate={formatDate}
            getEventsForDate={getEventsForDate}
            getEventsForTime={getEventsForTime}
            handleTimeSlotClick={handleTimeSlotClick}
            setCurrentDate={setCurrentDate}
            setView={setView}
            setSelectedEvent={setSelectedEvent}
            setShowEventModal={setShowEventModal}
          />
        </div>

        <UpcomingEvents
          isDarkMode={false}
          events={events}
          setSelectedEvent={setSelectedEvent}
          setShowEventModal={setShowEventModal}
        />
      </div>
    </div>
  );
}

export default ProjectCalendar;
