import { useState } from "react";
import { PageHeader } from "../../../../shared/components/PageHeader";
import CalendarToolbar from "../components/CalendarToolbar";
import CalendarGrid from "../components/CalendarGrid";
import CreateEventModal from "../components/CreateEventModal";
import UpcomingEvents from "../components/UpcommingEvents";


function ProjectCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  return (
    <div className="space-y-6">

      <CalendarToolbar
        currentDate={currentDate}
        view={view}
        setView={setView}
        setCurrentDate={setCurrentDate}
        events={events}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div>
          <CalendarGrid
            view={view}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onDayClick={() => setIsCreateEventModalOpen(true)}
            events={events}
          />
        </div>
        <div>
          <UpcomingEvents
            isDarkMode={false}
            events={events}
            // setSelectedEvent={setSelectedEvent}
            // setShowEventModal={setShowEventModal}
          />
        </div>
      </div>

      <CreateEventModal
        open={isCreateEventModalOpen}
        selectedDate={currentDate}
        onClose={() => setIsCreateEventModalOpen(false)}
        onSave={(event) => setEvents((prev) => [...prev, event])}
      />
    </div>
  );
}

export default ProjectCalendar;
