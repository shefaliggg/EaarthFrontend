import { useState } from "react";
import { PageHeader } from "../../../../shared/components/PageHeader";
import CalendarToolbar from "../components/CalendarToolbar";
import CalendarGrid from "../components/CalendarGrid";
import CreateEventModal from "../components/CreateEventModal";
import UpcomingEvents from "../components/UpcommingEvents";

function ProjectCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "DIRECTOR SCOUT WALES",
      startDate: "2026-01-21",
      endDate: "2026-01-21",
      startTime: "9:00 AM",
      endTime: "1:00 PM",
      isAllDay: false,
      location: "Wales",
      color: "#7C3AED",
    },
    {
      id: 2,
      title: "TECH RECCE GROUP",
      startDate: "2026-01-21",
      endDate: "2026-01-21",
      startTime: "9:00 AM",
      endTime: "4:00 PM",
      isAllDay: false,
      location: "Forest Area",
      color: "#F59E0B",
    },
    {
      id: 3,
      title: "CROWD COSTUME / MUP / FITTINGS",
      startDate: "2026-01-19",
      endDate: "2026-01-19",
      startTime: "11:00 AM",
      endTime: "5:00 PM",
      isAllDay: false,
      location: "Studio",
      color: "#22C55E",
    },
    {
      id: 4,
      title: "CAST REHEARSALS",
      startDate: "2026-01-23",
      endDate: "2026-01-23",
      isAllDay: true,
      location: "Main Hall",
      color: "#EF4444",
    },
    {
      id: 5,
      title: "TRAVEL: CAST #2 TORONTO → LONDON",
      startDate: "2026-01-24",
      endDate: "2026-01-24",
      isAllDay: true,
      location: "Airport",
      color: "#3B82F6",
    },

    {
      id: 6,
      title: "SET DESIGN REVIEW",
      startDate: "2026-01-21",
      endDate: "2026-01-21",
      startTime: "2:00 PM",
      endTime: "3:00 PM",
      isAllDay: false,
      location: "Art Dept",
    },
    {
      id: 7,
      title: "VFX PLANNING",
      startDate: "2026-01-21",
      endDate: "2026-01-21",
      startTime: "3:30 PM",
      endTime: "5:00 PM",
      isAllDay: false,
      location: "Post Studio",
    },
    {
      id: 8,
      title: "PRODUCTION MEETING",
      startDate: "2026-01-21",
      endDate: "2026-01-21",
      startTime: "6:00 PM",
      endTime: "7:00 PM",
      isAllDay: false,
      location: "Conference Room",
    },
    {
      id: 9,
      title: "STUNT COORDINATION",
      startDate: "2026-01-21",
      endDate: "2026-01-21",
      startTime: "7:30 PM",
      endTime: "9:00 PM",
      isAllDay: false,
      location: "Gym",
    },

    {
      id: 10,
      title: "LOCATION SCOUT",
      startDate: "2026-01-19",
      endDate: "2026-01-19",
      startTime: "9:00 AM",
      endTime: "11:00 AM",
      isAllDay: false,
      location: "Mountains",
    },
    {
      id: 11,
      title: "COSTUME TEST SHOOT",
      startDate: "2026-01-19",
      endDate: "2026-01-19",
      startTime: "12:00 PM",
      endTime: "2:00 PM",
      isAllDay: false,
      location: "Studio B",
    },
    {
      id: 12,
      title: "LIGHTING SETUP",
      startDate: "2026-01-19",
      endDate: "2026-01-19",
      startTime: "3:00 PM",
      endTime: "5:00 PM",
      isAllDay: false,
      location: "Stage 1",
    },

    {
      id: 13,
      title: "SCRIPT READ",
      startDate: "2026-01-23",
      endDate: "2026-01-23",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      isAllDay: false,
      location: "Main Hall",
    },
    {
      id: 14,
      title: "CAMERA TESTS",
      startDate: "2026-01-23",
      endDate: "2026-01-23",
      startTime: "1:00 PM",
      endTime: "3:00 PM",
      isAllDay: false,
      location: "Studio A",
    },
    {
      id: 15,
      title: "WARDROBE FITTINGS",
      startDate: "2026-01-23",
      endDate: "2026-01-23",
      startTime: "4:00 PM",
      endTime: "6:00 PM",
      isAllDay: false,
      location: "Wardrobe",
    },
  ]);

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
