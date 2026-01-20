import { useMemo, useState } from "react";
import { PageHeader } from "../../../../shared/components/PageHeader";
import CalendarToolbar from "../components/CalendarToolbar";
import CalendarGrid from "../components/CalendarGrid";
import CreateEventModal from "../components/CreateEventModal";
import UpcomingEvents from "../components/UpcommingEvents";

function ProjectCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("all");
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
      eventType: "prep",
      progress: 40,
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
      eventType: "prep",
      progress: 50,
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
      eventType: "prep",
      progress: 60,
    },
    {
      id: 4,
      title: "CAST REHEARSALS",
      startDate: "2026-01-23",
      endDate: "2026-01-23",
      isAllDay: true,
      location: "Main Hall",
      color: "#EF4444",
      eventType: "prep",
      progress: 30,
    },
    {
      id: 5,
      title: "TRAVEL: CAST #2 TORONTO → LONDON",
      startDate: "2026-01-24",
      endDate: "2026-01-24",
      isAllDay: true,
      location: "Airport",
      color: "#3B82F6",
      eventType: "prep",
      progress: 20,
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
      eventType: "prep",
      progress: 45,
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
      eventType: "prep",
      progress: 35,
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
      eventType: "prep",
      progress: 25,
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
      eventType: "prep",
      progress: 30,
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
      eventType: "prep",
      progress: 55,
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
      eventType: "shoot",
      progress: 20,
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
      eventType: "shoot",
      progress: 25,
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
      eventType: "prep",
      progress: 40,
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
      eventType: "shoot",
      progress: 35,
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
      eventType: "prep",
      progress: 45,
    },
  ]);
  const conflicts = useMemo(() => {
  const result = [];

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const e1 = events[i];
      const e2 = events[j];

      if (e1.startDate !== e2.startDate) continue;

      const t1Start = new Date(`${e1.startDate} ${e1.startTime}`);
      const t1End   = new Date(`${e1.endDate} ${e1.endTime}`);

      const t2Start = new Date(`${e2.startDate} ${e2.startTime}`);
      const t2End   = new Date(`${e2.endDate} ${e2.endTime}`);

      if (t1Start < t2End && t2Start < t1End) {
        result.push({
          event1: e1,
          event2: e2,
          attendees: ["Director", "Camera", "Producer"], // demo
        });
      }
    }
  }

  return result;
}, [events]);


  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesPeriod = period === "all" || event.eventType === period;

      return matchesSearch && matchesPeriod;
    });
  }, [events, search, period]);

  const [view, setView] = useState("month");
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <CalendarToolbar
        currentDate={currentDate}
        view={view}
        search={search}
        setSearch={setSearch}
        setView={setView}
        period={period}
        setPeriod={setPeriod}
        setCurrentDate={setCurrentDate}
        events={filteredEvents}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div>
          <CalendarGrid
            view={view}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onDayClick={() => setIsCreateEventModalOpen(true)}
            events={filteredEvents}
            conflicts={conflicts}
            onEditEvent={(event) => console.log("Edit", event)}
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
