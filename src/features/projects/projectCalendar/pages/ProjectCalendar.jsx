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
    // ===== PREP PHASE =====
    {
      id: 1,
      title: "DIRECTOR SCOUT WALES",
      startDate: "2026-01-21",
      endDate: "2026-01-24",
      startTime: "9:00 AM",
      endTime: "1:00 PM",
      location: "Wales",
      eventType: "prep",
    },
    {
      id: 2,
      title: "TECH RECCE GROUP",
      startDate: "2026-01-21",
      endDate: "2026-01-21",
      startTime: "9:00 AM",
      endTime: "4:00 PM",
      location: "Forest Area",
      eventType: "prep",
    },
    {
      id: 3,
      title: "CROWD COSTUME / MUP / FITTINGS",
      startDate: "2026-01-19",
      endDate: "2026-01-19",
      startTime: "11:00 AM",
      endTime: "5:00 PM",
      location: "Studio",
      eventType: "prep",
    },
    {
      id: 4,
      title: "CAST REHEARSALS",
      startDate: "2026-01-23",
      endDate: "2026-01-24",
      isAllDay: true,
      location: "Main Hall",
      eventType: "prep",
    },
    {
      id: 5,
      title: "TRAVEL: CAST #2 TORONTO → LONDON",
      startDate: "2026-01-24",
      endDate: "2026-01-24",
      isAllDay: true,
      location: "Airport",
      eventType: "prep",
    },
    {
      id: 6,
      title: "SET DESIGN REVIEW",
      startDate: "2026-01-21",
      endDate: "2026-01-21",
      startTime: "2:00 PM",
      endTime: "3:00 PM",
      location: "Art Dept",
      eventType: "prep",
    },
    {
      id: 7,
      title: "VFX PLANNING",
      startDate: "2026-01-21",
      endDate: "2026-01-21",
      startTime: "3:30 PM",
      endTime: "5:00 PM",
      location: "Post Studio",
      eventType: "prep",
    },
    {
      id: 8,
      title: "PRODUCTION MEETING",
      startDate: "2026-01-21",
      endDate: "2026-01-21",
      startTime: "6:00 PM",
      endTime: "7:00 PM",
      location: "Conference Room",
      eventType: "prep",
    },
    {
      id: 9,
      title: "STUNT COORDINATION",
      startDate: "2026-01-21",
      endDate: "2026-01-21",
      startTime: "7:30 PM",
      endTime: "9:00 PM",
      location: "Gym",
      eventType: "prep",
    },
    {
      id: 10,
      title: "LOCATION SCOUT",
      startDate: "2026-01-19",
      endDate: "2026-01-19",
      startTime: "9:00 AM",
      endTime: "11:00 AM",
      location: "Mountains",
      eventType: "prep",
    },

    // ===== SHOOT PHASE =====
    {
      id: 11,
      title: "PRINCIPAL PHOTOGRAPHY – DAY 1",
      startDate: "2026-01-25",
      endDate: "2026-01-25",
      isAllDay: true,
      location: "Studio A",
      eventType: "shoot",
    },
    {
      id: 12,
      title: "SHOOT: EXT STONE FARM BATTLE",
      startDate: "2026-01-26",
      endDate: "2026-01-28",
      isAllDay: true,
      location: "Stone Farm",
      eventType: "shoot",
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
        const t1End = new Date(`${e1.endDate} ${e1.endTime}`);

        const t2Start = new Date(`${e2.startDate} ${e2.startTime}`);
        const t2End = new Date(`${e2.endDate} ${e2.endTime}`);

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
