/**
 * DatesSettings.jsx
 * Path: src/features/projects/settings/pages/DatesSettings.jsx
 */

import { useState }        from "react";
import { useOutletContext } from "react-router-dom";
import { toast }           from "sonner";
import { Plus }            from "lucide-react";

import CardWrapper               from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons         from "@/shared/components/buttons/EditToggleButtons";
import ScheduleList              from "../../components/dates/ScheduleList";
import SettingsCardLoadingSkelton from "../../components/skeltons/SettingsCardLoadingSkelton";
import SettingsCardErrorSkelton  from "../../components/skeltons/SettingsCardErrorSkelton";
import { useDatesSettings }      from "./useDatesSettings";

// ── Hiatus auto-naming ─────────────────────────────────────────────────────
const getNextHiatusName = (items) => {
  const existing = items
    .map((i) => i.description)
    .filter((d) => /^Hiatus\s+\d+$/i.test(d))
    .map((d) => parseInt(d.replace(/\D/g, ""), 10));
  const next = existing.length ? Math.max(...existing) + 1 : 1;
  return `Hiatus ${next}`;
};

function DatesSettings() {
  const { projectId } = useOutletContext();

  const { schedule, isFetching, isUpdating, error, updateSchedule } =
    useDatesSettings(projectId);

  const [isEditing, setIsEditing] = useState(false);
  const [draft,     setDraft]     = useState(null);

  // ── Edit / Cancel ─────────────────────────────────────────────────────────
  const startEditing = () => {
    setDraft(schedule.map((item) => ({ ...item })));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDraft(null);
  };

  // ── Add Hiatus ────────────────────────────────────────────────────────────
  const addHiatus = () => {
    const name = getNextHiatusName(draft);
    setDraft((prev) => [
      ...prev,
      { description: name, start: null, end: null, isDefault: false },
    ]);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      await updateSchedule(draft).unwrap();
      toast.success("Schedule updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update schedule");
    }
  };

  // ── States ────────────────────────────────────────────────────────────────
  if (isFetching && !schedule.length) {
    return <SettingsCardLoadingSkelton fields={3} columns={1} />;
  }

  if (error) {
    return (
      <SettingsCardErrorSkelton
        message={typeof error === "string" ? error : error?.message || "Something went wrong"}
        onRetry={() => dispatch(fetchDatesSettingsThunk(projectId))}
      />
    );
  }

  const displayItems = isEditing ? draft : schedule;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <CardWrapper showLabel={false}>

        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">Schedule</h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Manage full production timeline (prep, shoot, hiatus, wrap, etc.)
              </p>
            </div>
          </div>
          <EditToggleButtons
            isEditing={isEditing}
            isLoading={isUpdating}
            onEdit={startEditing}
            onSave={handleSave}
            onCancel={cancelEditing}
          />
        </div>

        <ScheduleList
          items={displayItems}
          isEditing={isEditing}
          onChange={setDraft}
        />

        {/* Add Hiatus button — only visible while editing */}
        {isEditing && (
          <button
  type="button"
  onClick={addHiatus}
  className="mt-4 flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
>
  <Plus size={14} />
  Add Schedule
</button>
        )}

      </CardWrapper>
    </div>
  );
}

export default DatesSettings;