import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CalendarToolbar from "../components/CalendarToolbar";
import CalendarGrid from "../components/CalendarGrid";
import CreateEventModal from "../components/CreateEventModal";
 // Import
import UpcomingEvents from "../components/UpcommingEvents";
import useCalendar from "../hooks/useCalendar";

import { toast } from "sonner";
import EditEventModal from "../components/EditEventModal";
import { deleteCalendarEvent, updateCalendarEvent } from "../../store/calendar.thunks";
import EventDetailsModal from "../components/EventDetailsModal";

function ProjectCalendar() {
  const dispatch = useDispatch();
  const calendar = useSelector((state) => state.calendar); // Direct access for loading states
  const { 
    view, 
    currentDate, 
    events, 
    conflicts, 
    analyticsData, 
    upcomingEvents, 
    eventsCount,
    search, 
    period,
    setView,
    setSearch,
    setPeriod,
    prev, 
    next, 
    today, 
    createEvent,
    clearStatus,
  } = useCalendar();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { currentUser: user } = useSelector((state) => state.user);

  // Permission Logic
  const canModify = user && (
    user.userType === "studio_admin" || 
    (user.userType === "crew" && user.accessPolicy === "no_contract")
  );

  // --- Handlers ---

  const handleDayClick = () => {
    if (canModify) {
      setIsCreateModalOpen(true);
    } else {
      toast.info("View only access.");
    }
  };

  // Called when clicking an event in the CalendarGrid
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const handleCreate = async (eventData) => {
    try {
      const result = await createEvent(eventData);
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success("Event scheduled!");
        setIsCreateModalOpen(false);
        clearStatus();
      } else {
        toast.error("Failed to create event.");
      }
    } catch (e) { toast.error("Error creating event"); }
  };

  const handleEditRequest = (event) => {
    setIsDetailsModalOpen(false); // Close details
    setIsEditModalOpen(true); // Open Edit form
  };

  const handleUpdate = async (eventCode, eventData) => {
    try {
      const result = await dispatch(updateCalendarEvent({ eventCode, eventData }));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success("Event updated successfully!");
        setIsEditModalOpen(false);
        setSelectedEvent(null);
      } else {
        toast.error("Failed to update event.");
      }
    } catch (e) { toast.error("Error updating event"); }
  };

  const handleDelete = async (eventCode) => {
    try {
      const result = await dispatch(deleteCalendarEvent(eventCode));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success("Event deleted.");
        setIsDetailsModalOpen(false);
        setSelectedEvent(null);
      } else {
        toast.error("Failed to delete event.");
      }
    } catch (e) { toast.error("Error deleting event"); }
  };

  return (
    <div className="space-y-6">
      <CalendarToolbar
        currentDate={currentDate}
        view={view}
        eventsCount={eventsCount}
        search={search}
        period={period}
        setView={setView}
        setSearch={setSearch}
        setPeriod={setPeriod}
        onPrev={prev}
        onNext={next}
        onToday={today}
        showCreateButton={canModify}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      <div className="grid lg:grid-cols-[1fr_580px] grid-cols-1 gap-6">
        <CalendarGrid
          view={view}
          currentDate={currentDate}
          events={events}
          conflicts={conflicts}
          analyticsData={analyticsData}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick} // Pass this down!
        />

        <UpcomingEvents
          upcomingEvents={upcomingEvents}
          view={view}
        />
      </div>

      {/* CREATE MODAL */}
      {canModify && (
        <CreateEventModal
          open={isCreateModalOpen}
          selectedDate={currentDate}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreate}
          isSubmitting={calendar.isCreating}
        />
      )}

      {/* EDIT MODAL */}
      {canModify && (
        <EditEventModal
          open={isEditModalOpen}
          eventToEdit={selectedEvent}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdate}
          isSubmitting={calendar.isUpdating}
        />
      )}

      {/* DETAILS / DELETE MODAL */}
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        event={selectedEvent}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={handleEditRequest}
        onDelete={handleDelete}
        isDeleting={calendar.isDeleting}
        canModify={canModify}
      />
    </div>
  );
}

export default ProjectCalendar;