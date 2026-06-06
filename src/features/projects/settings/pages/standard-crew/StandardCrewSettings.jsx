import { useState, useCallback } from "react";
import { useOutletContext }       from "react-router-dom";
import { Loader2 }               from "lucide-react";

import CardWrapper           from "@/shared/components/wrappers/CardWrapper";
import EditableSelectField   from "@/shared/components/wrappers/EditableSelectField";
import EditableSwitchField   from "@/shared/components/wrappers/EditableSwitchField";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditToggleButtons     from "../../../../../shared/components/buttons/EditToggleButtons";   // ← import
import { useStandardCrewSettings } from "./useStandardCrewSettings";

// ─── SectionCard ──────────────────────────────────────────────────────────────

function SectionCard({ title, description, isSaving, children }) {
  return (
    <CardWrapper showLabel={false}>
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
          <div>
            <h3 className="text-foreground text-sm font-medium">{title}</h3>
            <p className="text-muted-foreground text-[0.7rem] mt-0.5">{description}</p>
          </div>
        </div>
        {isSaving && (
          <div className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
            <Loader2 size={11} className="animate-spin" />
            Saving…
          </div>
        )}
      </div>
      {children}
    </CardWrapper>
  );
}

// ─── StandardCrewSettings ─────────────────────────────────────────────────────

function StandardCrewSettings() {
  const { projectId } = useOutletContext();

  const {
    settings,
    isFetching,
    error,
    updateSixthSeventhDay,
    updateOvertime,
  } = useStandardCrewSettings(projectId);

  const [savingSection, setSavingSection] = useState(null);
  const [saveError,     setSaveError]     = useState(null);

  const [isEditingOvertime, setIsEditingOvertime] = useState(false);
  const [overtimeDraft,     setOvertimeDraft]     = useState(null);

  // ── Save helper ───────────────────────────────────────────────────────────

  const save = useCallback(
    async (section, updated) => {
      setSavingSection(section);
      setSaveError(null);
      try {
        if (section === "sixthSeventhDay") {
          await updateSixthSeventhDay(updated).unwrap();
        } else {
          await updateOvertime(updated).unwrap();
        }
      } catch (err) {
        setSaveError(err?.message ?? "Save failed. Please try again.");
      } finally {
        setSavingSection(null);
      }
    },
    [updateSixthSeventhDay, updateOvertime]
  );

  // ── 6th/7th — instant save ────────────────────────────────────────────────

  const handleSelect = useCallback(
    (section, field, value) => {
      const updated = { ...settings[section], [field]: value };
      save(section, updated);
    },
    [settings, save]
  );

  // ── Overtime — Edit/Save/Cancel ───────────────────────────────────────────

  const startEditingOvertime = () => {
    setOvertimeDraft({ ...settings.overtime });
    setIsEditingOvertime(true);
    setSaveError(null);
  };

  const cancelEditingOvertime = () => {
    setIsEditingOvertime(false);
    setOvertimeDraft(null);
    setSaveError(null);
  };

  const saveOvertime = async () => {
    await save("overtime", overtimeDraft);
    setIsEditingOvertime(false);
    setOvertimeDraft(null);
  };

  const overtimeData = isEditingOvertime ? overtimeDraft : settings.overtime;

  // ── Loading ───────────────────────────────────────────────────────────────

  if (isFetching && !settings) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
        <Loader2 size={16} className="animate-spin" />
        Loading standard crew settings…
      </div>
    );
  }

  const d = settings;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
          {error?.message ?? "Something went wrong. Please try again."}
        </div>
      )}
      {saveError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
          {saveError}
        </div>
      )}

      {/* ── 6th / 7th Days — auto-save ── */}
      <SectionCard
        title="6th/7th Days"
        description="Fee multipliers for 6th and 7th day work"
        isSaving={savingSection === "sixthSeventhDay"}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditableSelectField
            label="6th Day Fee Multiplier"
            value={d.sixthSeventhDay.sixthDayMultiplier}
            isEditing={true}
            items={[
              { label: "1.0x", value: "1.0" },
              { label: "1.5x", value: "1.5" },
              { label: "2.0x", value: "2.0" },
            ]}
            onChange={(val) => handleSelect("sixthSeventhDay", "sixthDayMultiplier", val)}
            infoPillDescription="For projects using the Film PACT/BECTU MMPA, this multiplier will only apply to crew who are on deals outside of the agreement."
          />
          <EditableSelectField
            label="7th Day Fee Multiplier"
            value={d.sixthSeventhDay.seventhDayMultiplier}
            isEditing={true}
            items={[
              { label: "1.0x", value: "1.0" },
              { label: "1.5x", value: "1.5" },
              { label: "2.0x", value: "2.0" },
            ]}
            onChange={(val) => handleSelect("sixthSeventhDay", "seventhDayMultiplier", val)}
            infoPillDescription="For projects using the Film PACT/BECTU MMPA, this multiplier will only apply to crew who are on deals outside of the agreement."
          />
        </div>
        <div className="mt-4">
          <EditableSwitchField
            label="Show minimum hours on 6th and 7th days in offers?"
            checked={d.sixthSeventhDay.showMinHours}
            isEditing={true}
            onChange={(val) => handleSelect("sixthSeventhDay", "showMinHours", val)}
          />
        </div>
      </SectionCard>

      {/* ── Overtime — Edit/Save/Cancel ── */}
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">Overtime</h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Custom overtime rates which an offer will default to if you choose not to pay
                overtime as 'Calculated per agreement'
              </p>
            </div>
          </div>

          {/* ← replaced inline buttons with EditToggleButtons */}
          <EditToggleButtons
            isEditing={isEditingOvertime}
            onEdit={startEditingOvertime}
            onSave={saveOvertime}
            onCancel={cancelEditingOvertime}
            isLoading={savingSection === "overtime"}
          />
        </div>

        <EditableTextDataField
          label="Other"
          value={overtimeData?.other}
          isEditing={isEditingOvertime}
          isRequired={false}
          onChange={(val) => setOvertimeDraft((p) => ({ ...p, other: val }))}
        />
        <div className="mt-4">
          <EditableTextDataField
            label="Camera - standard day"
            value={overtimeData?.cameraStandard}
            isEditing={isEditingOvertime}
            isRequired={false}
            onChange={(val) => setOvertimeDraft((p) => ({ ...p, cameraStandard: val }))}
          />
        </div>
        <div className="mt-4">
          <EditableTextDataField
            label="Camera - continuous day"
            value={overtimeData?.cameraContinuous}
            isEditing={isEditingOvertime}
            isRequired={false}
            onChange={(val) => setOvertimeDraft((p) => ({ ...p, cameraContinuous: val }))}
          />
        </div>
        <div className="mt-4">
          <EditableTextDataField
            label="Camera - semi-continuous day"
            value={overtimeData?.cameraSemiContinuous}
            isEditing={isEditingOvertime}
            isRequired={false}
            onChange={(val) => setOvertimeDraft((p) => ({ ...p, cameraSemiContinuous: val }))}
          />
        </div>
      </CardWrapper>

    </div>
  );
}

export default StandardCrewSettings;