import { useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import ScheduleList from "../../components/dates/ScheduleList";

function DatesSettings() {
  const [isEditing, setIsEditing] = useState(false);

  const [schedule, setSchedule] = useState([
    {
      id: 1,
      description: "Prep",
      start: "2026-03-01",
      end: "2026-03-10",
    },
    {
      id: 2,
      description: "Shoot",
      start: "2026-03-21",
      end: "2026-04-20",
    },
    {
      id: 3,
      description: "Wrap",
      start: "2026-04-21",
      end: "2026-04-29",
    },
    {
      id: 4,
      description: "Hiatus 1",
      start: "2026-03-11",
      end: "2026-03-20",
    },
  ]);

  return (
    <div className="space-y-4">
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">Schedule</h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Manage full production timeline (prep, shoot, hiatus, wrap,
                etc.)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 ">
            <EditToggleButtons
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
        <ScheduleList
          items={schedule}
          isEditing={isEditing}
          onChange={setSchedule}
        />
      </CardWrapper>
    </div>
  );
}

export default DatesSettings;
