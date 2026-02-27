import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import CalendarToolbar from "../components/CalendarToolbar";
import CalendarGrid from "../components/CalendarGrid";
import UpcomingEvents from "../components/UpcommingEvents";
import useCalendar from "../hooks/useCalendar";
import { toast } from "sonner";
import EditEventModal from "../components/EditEventModal";
import {
  deleteCalendarEvent,
  updateCalendarEvent,
} from "../../store/calendar.thunks";
import EventDetailsModal from "../components/EventDetailsModal";

function ProjectCalendar() {
  const dispatch = useDispatch();
  const calendar = useSelector((state) => state.calendar);
  const { openCreateModal } = useOutletContext() || {};

  const {
    view,
    currentDate,
    events,
    conflicts,
    analyticsData,
    upcomingEvents,
    eventsCount,
    filters,
    updateFilter,
    resetFilters,
    departments,
    crewMembers,
    setView,
    prev,
    next,
    today,
    setCurrentDate, 
  } = useCalendar();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { currentUser: user } = useSelector((state) => state.user);

  const canModify =
    user &&
    (user.userType === "studio_admin" ||
      (user.userType === "crew" && user.accessPolicy === "no_contract"));

  const handleDayClick = (date) => {
    if (canModify) {
      setCurrentDate(date);
      if (openCreateModal) openCreateModal(date); 
    } else {
      toast.info("View only access.");
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const handleEditRequest = (event) => {
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (eventCode, eventData) => {
    try {
      const result = await dispatch(updateCalendarEvent({ eventCode, eventData }));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Event updated successfully!");
        setIsEditModalOpen(false);
        setSelectedEvent(null);
      } else {
        toast.error("Failed to update event.");
      }
    } catch (e) {
      toast.error("Error updating event");
    }
  };

  const handleDelete = async (eventCode) => {
    try {
      const result = await dispatch(deleteCalendarEvent(eventCode));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Event deleted.");
        setIsDetailsModalOpen(false);
        setSelectedEvent(null);
      } else {
        toast.error("Failed to delete event.");
      }
    } catch (e) {
      toast.error("Error deleting event");
    }
  };

  return (
    <div className="space-y-6">
      <CalendarToolbar
        currentDate={currentDate}
        view={view}
        eventsCount={eventsCount}
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        departments={departments}
        crewMembers={crewMembers}
        setView={setView}
        onPrev={prev}
        onNext={next}
        onToday={today}
        showCreateButton={canModify}
        onCreateClick={() => openCreateModal && openCreateModal()}
      />

      <div className="grid lg:grid-cols-[1fr_580px] grid-cols-1 gap-6">
        <CalendarGrid
          view={view}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          events={events}
          conflicts={conflicts}
          analyticsData={analyticsData}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
        />
        <UpcomingEvents upcomingEvents={upcomingEvents} view={view} />
      </div>

      {canModify && (
        <EditEventModal
          open={isEditModalOpen}
          eventToEdit={selectedEvent}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdate}
          isSubmitting={calendar.isUpdating}
        />
      )}

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