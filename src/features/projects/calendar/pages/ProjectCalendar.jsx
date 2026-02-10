import { useState } from "react";
import CalendarToolbar from "../components/CalendarToolbar";
import CalendarGrid from "../components/CalendarGrid";
import CreateEventModal from "../components/CreateEventModal";
import UpcomingEvents from "../components/UpcommingEvents";
import useCalendar from "../hooks/useCalendar";

function ProjectCalendar() {
  const calendar = useCalendar();
  console.log(calendar);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <CalendarToolbar
        currentDate={calendar.currentDate}
        view={calendar.view}
        eventsCount={calendar.eventsCount}
        search={calendar.search}
        period={calendar.period}
        setView={calendar.setView}
        setSearch={calendar.setSearch}
        setPeriod={calendar.setPeriod}
        onPrev={calendar.prev}
        onNext={calendar.next}
        onToday={calendar.today}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_580px] gap-6">
        <CalendarGrid
          view={calendar.view}
          currentDate={calendar.currentDate}
          events={calendar.events}
          conflicts={calendar.conflicts}
          onDayClick={() => setIsCreateEventModalOpen(true)}
        />

        <UpcomingEvents
          upcomingEvents={calendar.upcomingEvents}
          view={calendar.view}
        />
      </div>

      <CreateEventModal
        open={isCreateEventModalOpen}
        selectedDate={calendar.currentDate}
        onClose={() => setIsCreateEventModalOpen(false)}
        onSave={calendar.addEvent}
      />
    </div>
  );
}

export default ProjectCalendar;
