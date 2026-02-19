import { useState } from "react";
import { PageHeader } from "@/shared/components/PageHeader";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import useCalendar from "../hooks/useCalendar"; 
import CreateEventModal from "../components/CreateEventModal";

function CalendarLayout() {
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { 
    createEvent, 
    currentDate, 
    clearStatus, 
    isCreating 
  } = useCalendar();

  const { currentUser: user } = useSelector((state) => state.user);

  const canModify = user && (
    user.userType === "studio_admin" || 
    (user.userType === "crew" && user.accessPolicy === "no_contract")
  );

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

  // 1. Add check for "preview"
  const section = (() => {
    if (location.pathname.includes("/shooting")) return "shooting";
    if (location.pathname.includes("/settings")) return "settings";
    if (location.pathname.includes("/tmo")) return "tmo"; 
    if (location.pathname.includes("/preview")) return "preview"; // Added this check
    return "calendar";
  })();

  const headerConfig = (() => {
    if (section === "calendar")
      return { icon: "Calendar", title: "Calendar" };
    if (section === "shooting")
      return { icon: "Calendar", title: "Shooting Calendar" };
    if (section === "tmo")
      return { icon: "Plane", title: "Tmo" };
    // 2. Add header config for preview (Optional, but good for consistency)
    if (section === "preview")
        return { icon: "Calendar", title: "Calendar" };

    return {
      icon: "Settings",
      title: "Calendar Settings",
      subtitle: "Manage calendar preferences",
    };
  })();

  // 3. Ensure preview returns null for the action button
  const primaryAction = (() => {
    if (section === "tmo" || section === "preview") return null; // Added preview here
    
    if (section === "calendar" && canModify) {
      return {
        label: "Create Event",
        icon: "Plus",
        size: "lg",
        clickAction: () => setIsCreateModalOpen(true),
      };
    }
    return null;
  })();

  return (
    <div className="space-y-6">
      <PageHeader
        {...headerConfig}
        primaryAction={primaryAction} 
      />
      
      <Outlet context={{ openCreateModal: () => setIsCreateModalOpen(true) }} />

      {canModify && (
        <CreateEventModal
          open={isCreateModalOpen}
          selectedDate={currentDate}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreate}
          isSubmitting={isCreating}
        />
      )}
    </div>
  );
}

export default CalendarLayout;