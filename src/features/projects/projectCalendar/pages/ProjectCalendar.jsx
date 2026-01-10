import { useState } from "react";
import { PageHeader } from "../../../../shared/components/PageHeader";
import CalendarToolbar from "../components/CalendarToolbar";
import CalendarGrid from "../components/CalendarGrid";
import CreateEventModal from "../components/CreateEventModal";

function ProjectCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        icon="Calendar"
        title="Calendar"
        primaryAction={{
          label: "Create Event",
          icon: "Plus",
          size: "lg",
          clickAction: () => setIsCreateEventModalOpen(true),
        }}
        secondaryActions={[
          {
            label: "Shooting Calendar",
            icon: "Video",
            variant: "outline",
            size: "lg",
            clickAction: () => {
              console.log("Open Shooting Calendar");
            },
          },
        ]}
      />

      <CalendarToolbar
        currentDate={currentDate}
        view={view}
        setView={setView}
        setCurrentDate={setCurrentDate}
      />

      <CalendarGrid
        view={view}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onDayClick={() => setIsCreateEventModalOpen(true)}
      />

      <CreateEventModal
        open={isCreateEventModalOpen}
        date={currentDate}
        onClose={() => setIsCreateEventModalOpen(false)}
        onSave={() => setIsCreateEventModalOpen(false)}
      />
    </div>
  );
}

export default ProjectCalendar;
