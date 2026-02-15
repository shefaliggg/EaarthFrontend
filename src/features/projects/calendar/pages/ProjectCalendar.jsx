import { useState } from "react"; 
import { useSelector } from "react-redux"; // Removed useDispatch if not used directly, but usually needed for thunks
import CalendarToolbar from "../components/CalendarToolbar";
import CalendarGrid from "../components/CalendarGrid";
import CreateEventModal from "../components/CreateEventModal";
import UpcomingEvents from "../components/UpcommingEvents";
import useCalendar from "../hooks/useCalendar";
import { toast } from "sonner";

function ProjectCalendar() {
  const calendar = useCalendar();
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  // --- 1. FIXED SELECTOR ---
  // We grab 'currentUser' from the state, but rename it to 'user' for our code to work
  const { currentUser: user } = useSelector((state) => state.user);

  // --- 2. PERMISSION LOGIC ---
  const canCreateEvent = user && (
    user.userType === "studio_admin" || 
    (user.userType === "crew" && user.accessPolicy === "no_contract")
  );

  const handleDayClick = () => {
    if (canCreateEvent) {
      setIsCreateEventModalOpen(true);
    } else {
      // Professional UX Message
      toast.info("Your account has view-only access to the calendar.");
    }
  };

  // --- 3. CREATE HANDLER ---
  const handleCreateEvent = async (eventData) => {
    try {
      const resultAction = await calendar.createEvent(eventData);
      
      if (resultAction.meta.requestStatus === 'fulfilled') {
        toast.success("Event scheduled successfully.");
        setIsCreateEventModalOpen(false); 
        calendar.clearStatus(); 
      } 
      else if (resultAction.meta.requestStatus === 'rejected') {
        toast.error(resultAction.payload || "Unable to schedule event.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

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
        showCreateButton={canCreateEvent} 
      />

      <div className="grid lg:grid-cols-[1fr_580px] grid-cols-1 gap-6">
        <CalendarGrid
          view={calendar.view}
          currentDate={calendar.currentDate}
          events={calendar.events}
          conflicts={calendar.conflicts}
          analyticsData={calendar.analyticsData}
          onDayClick={handleDayClick} 
        />

        <UpcomingEvents
          upcomingEvents={calendar.upcomingEvents}
          view={calendar.view}
        />
      </div>

      {canCreateEvent && (
        <CreateEventModal
          open={isCreateEventModalOpen}
          selectedDate={calendar.currentDate}
          onClose={() => setIsCreateEventModalOpen(false)}
          onSave={handleCreateEvent} 
          isSubmitting={calendar.isCreating}
        />
      )}
    </div>
  );
}

export default ProjectCalendar;