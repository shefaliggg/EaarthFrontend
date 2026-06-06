/**
 * PlacesSettings.jsx
 *
 * Path: src/features/projects/settings/places/PlacesSettings.jsx
 *
 * FIX: Default units (default-1/2/3) now persist date changes to the backend.
 *
 * Root cause: handleUnitDateChange was returning early for "default-*" ids,
 * storing the date only in local React state. Backend never received the update.
 *
 * Solution: When a date is changed on a default unit, we:
 *   1. Optimistically update local state immediately (so UI feels instant)
 *   2. Check if this default unit already exists in the backend
 *      — if NOT: call addUnit (which triggers withAutoInit if needed),
 *                then the real _id comes back from the backend and all
 *                subsequent edits go through updateUnit normally.
 *      — if YES: call updateUnit with the real _id directly.
 *
 * The "already promoted" tracking is done via a ref map:
 *   promotedDefaults: { "default-1" → "<real mongo _id>" }
 * so we never double-add a unit.
 */

import { useState, useRef, useCallback } from "react";
import { useOutletContext }               from "react-router-dom";
import { Trash2, Plus, X, Layers }        from "lucide-react";

import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableDateField     from "@/shared/components/wrappers/EditableDateField";
import CardWrapper           from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons     from "../../../../../shared/components/buttons/EditToggleButtons";
import { usePlacesSettings } from "./usePlacesSettings";

// ─── UnitCard ──────────────────────────────────────────────────────────────────
/**
 * Reusable card for a single unit row.
 * Owns its own editing state so rows don't interfere with each other.
 */
function UnitCard({
  unit,
  projectId,
  onDateChange,
  onNameSave,
  onDelete,
  isSubmitting,
  isUpdating,
}) {
  const [isEditing,  setIsEditing]  = useState(false);
  const [draftName,  setDraftName]  = useState(unit.name);
  const [isSaving,   setIsSaving]   = useState(false);

  const isPrimary = unit.isPrimary;
  const isDefault = String(unit._id ?? "").startsWith("default-");
  const busy      = isSubmitting || isUpdating || isSaving;

  const handleSaveName = async () => {
    if (!draftName.trim() || draftName.trim() === unit.name) {
      setIsEditing(false);
      setDraftName(unit.name);
      return;
    }
    setIsSaving(true);
    await onNameSave(unit._id, draftName.trim());
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancelName = () => {
    setDraftName(unit.name);
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center border border-border rounded-xl px-4 py-3 bg-background">

      {/* ── Unit Name ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <EditableTextDataField
            label="Unit Name"
            badge={isPrimary ? "Primary" : null}
            value={isEditing ? draftName : unit.name}
            isEditing={isEditing && !isDefault}
            isRequired={false}
            placeholder="Unit name"
            onChange={(val) => setDraftName(val)}
          />
        </div>

        {/* Edit / Save / Cancel toggle — only for real (non-default) units */}
        {!isDefault && !isPrimary && (
          <EditToggleButtons
            isEditing={isEditing}
            isLoading={isSaving}
            disabled={busy}
            onEdit={() => { setIsEditing(true); setDraftName(unit.name); }}
            onSave={handleSaveName}
            onCancel={handleCancelName}
          />
        )}
      </div>

      {/* ── Start Date ─────────────────────────────────────────────────── */}
      <EditableDateField
        label="Start Date"
        value={unit.startDate}
        isEditing={true}
        isRequired={false}
        onChange={(val) => onDateChange(unit._id, "startDate", val ?? null)}
      />

      {/* ── End Date ───────────────────────────────────────────────────── */}
      <EditableDateField
        label="End Date"
        value={unit.endDate}
        isEditing={true}
        isRequired={false}
        onChange={(val) => onDateChange(unit._id, "endDate", val ?? null)}
      />

      {/* ── Delete ─────────────────────────────────────────────────────── */}
      <div className="w-8 flex items-center justify-center">
        {!isPrimary && !isDefault && (
          <button
            onClick={() => onDelete(unit._id)}
            disabled={busy}
            className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── PlacesSettings ────────────────────────────────────────────────────────────

function PlacesSettings() {
  const { projectId } = useOutletContext();

  const {
    units,
    workplaces,
    sites,
    isFetching,
    isSubmitting,
    isUpdating,
    error,
    addUnit,
    updateUnit,
    deleteUnit,
    addWorkplace,
    deleteWorkplace,
  } = usePlacesSettings(projectId);

  // ── Add unit form state ──────────────────────────────────────────────────
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [newUnit,     setNewUnit]     = useState({ name: "", startDate: null, endDate: null });

  // ── Add workplace form state ─────────────────────────────────────────────
  const [showAddWorkplace, setShowAddWorkplace] = useState(false);
  const [newWorkplaceName, setNewWorkplaceName] = useState("");

  /**
   * promotedDefaults — tracks default-* units that have been saved to the DB.
   * Maps  "default-1" → "<real mongo _id>"
   * so that a second date change on the same default unit calls updateUnit
   * instead of addUnit again.
   */
  const promotedDefaults = useRef({});

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleAddUnit = async () => {
    if (!newUnit.name.trim()) return;
    await addUnit({
      name:      newUnit.name.trim(),
      startDate: newUnit.startDate || null,
      endDate:   newUnit.endDate   || null,
      isPrimary: false,
    });
    setNewUnit({ name: "", startDate: null, endDate: null });
    setShowAddUnit(false);
  };

  const handleAddWorkplace = async () => {
    if (!newWorkplaceName.trim()) return;
    await addWorkplace({ name: newWorkplaceName.trim() });
    setNewWorkplaceName("");
    setShowAddWorkplace(false);
  };

  /**
   * handleUnitDateChange
   *
   * THE FIX IS HERE.
   *
   * For real units (non-default-*):  call updateUnit immediately.
   * For default-* units:
   *   - If already promoted → call updateUnit with the real _id.
   *   - If NOT yet promoted → call addUnit to create the unit in the DB
   *     (withAutoInit handles initialising settings if needed), then store
   *     the returned real _id in promotedDefaults so future edits use it.
   */
  const handleUnitDateChange = useCallback(async (unitId, field, value) => {
    const isDefault = String(unitId).startsWith("default-");

    if (!isDefault) {
      // Normal real unit — just update
      await updateUnit(unitId, { [field]: value });
      return;
    }

    // ── Default unit ──────────────────────────────────────────────────────

    const alreadyPromotedId = promotedDefaults.current[unitId];

    if (alreadyPromotedId) {
      // Already saved to DB in a previous date change — update with real id
      await updateUnit(alreadyPromotedId, { [field]: value });
      return;
    }

    // First date edit on this default unit — find it in the current units list
    // to get its current name (and the other date field) so we can addUnit
    // with all the right data at once.
    const existing = units.find((u) => u._id === unitId);
    if (!existing) return;

    const payload = {
      name:       existing.name,
      isPrimary:  existing.isPrimary ?? false,
      startDate:  field === "startDate" ? value : (existing.startDate ?? null),
      endDate:    field === "endDate"   ? value : (existing.endDate   ?? null),
    };

    const result = await addUnit(payload);

    // addUnit dispatches to Redux which returns the new unit.
    // The thunk resolves with the backend payload — grab the real _id.
    if (result?.payload?._id) {
      promotedDefaults.current[unitId] = result.payload._id;
    }
  }, [units, addUnit, updateUnit]);

  /**
   * handleUnitNameSave — called from UnitCard for non-default, non-primary units.
   */
  const handleUnitNameSave = useCallback(async (unitId, name) => {
    await updateUnit(unitId, { name });
  }, [updateUnit]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
          {error.message ?? "Something went wrong. Please try again."}
        </div>
      )}

      {/* ── Units ───────────────────────────────────────────────────────── */}
      <CardWrapper
        title="Units"
        icon={Layers}
        iconColor="text-primary"
        description="Configure shooting units with their schedule dates"
      >
        <div className="flex flex-col gap-2">
          {units.map((unit) => (
            <UnitCard
              key={unit._id ?? unit.id}
              unit={unit}
              projectId={projectId}
              onDateChange={handleUnitDateChange}
              onNameSave={handleUnitNameSave}
              onDelete={deleteUnit}
              isSubmitting={isSubmitting}
              isUpdating={isUpdating}
            />
          ))}

          {showAddUnit && (
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end border border-dashed border-primary/40 rounded-xl px-4 py-3 bg-background">
              <EditableTextDataField
                label="Unit Name"
                value={newUnit.name}
                isEditing={true}
                isRequired={true}
                placeholder="Enter unit name"
                onChange={(val) => setNewUnit((p) => ({ ...p, name: val }))}
              />
              <EditableDateField
                label="Start Date"
                value={newUnit.startDate}
                isEditing={true}
                isRequired={false}
                onChange={(val) => setNewUnit((p) => ({ ...p, startDate: val }))}
              />
              <EditableDateField
                label="End Date"
                value={newUnit.endDate}
                isEditing={true}
                isRequired={false}
                onChange={(val) => setNewUnit((p) => ({ ...p, endDate: val }))}
              />
              <div className="flex items-center gap-2 pb-1">
                <button
                  onClick={handleAddUnit}
                  disabled={!newUnit.name.trim() || isSubmitting}
                  className="text-[0.7rem] font-medium text-primary disabled:opacity-40"
                >
                  Save
                </button>
                <button
                  onClick={() => { setShowAddUnit(false); setNewUnit({ name: "", startDate: null, endDate: null }); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {!showAddUnit && (
          <button
            onClick={() => setShowAddUnit(true)}
            className="mt-3 w-full border-2 border-dashed border-border text-primary py-3 rounded-lg flex items-center justify-center gap-2 text-xs hover:bg-muted/20 transition-colors"
          >
            <Plus size={14} />
            Add Unit
          </button>
        )}
      </CardWrapper>

      {/* ── Workplaces ──────────────────────────────────────────────────── */}
      <CardWrapper
        title="Workplaces"
        icon={Layers}
        iconColor="text-primary"
        description="Locations where production takes place"
      >
        <div className="flex flex-wrap gap-2">
          {workplaces.map((wp) => (
            <div
              key={wp._id ?? wp.id}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-medium bg-white border border-border text-foreground shadow-sm"
            >
              <span className="uppercase tracking-wide">{wp.name}</span>
              <button
                onClick={() => deleteWorkplace(wp._id)}
                disabled={isSubmitting || isUpdating}
                className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40"
              >
                <X size={11} />
              </button>
            </div>
          ))}

          {showAddWorkplace && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-primary/50 bg-white shadow-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter")  handleAddWorkplace();
                if (e.key === "Escape") { setShowAddWorkplace(false); setNewWorkplaceName(""); }
              }}
            >
              <EditableTextDataField
                label=""
                value={newWorkplaceName}
                isEditing={true}
                isRequired={false}
                placeholder="Workplace name"
                textCase="normal"
                onChange={(val) => setNewWorkplaceName(val)}
                inputClassName="h-6 text-[0.7rem] w-32 px-1 bg-transparent"
              />
              <button
                onClick={handleAddWorkplace}
                disabled={!newWorkplaceName.trim() || isSubmitting}
                className="text-[0.65rem] font-medium text-primary disabled:opacity-40 whitespace-nowrap"
              >
                Save
              </button>
              <button
                onClick={() => { setShowAddWorkplace(false); setNewWorkplaceName(""); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={11} />
              </button>
            </div>
          )}

          {!showAddWorkplace && (
            <button
              onClick={() => setShowAddWorkplace(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-medium border-2 border-dashed border-border text-primary hover:bg-muted/20 transition-colors"
            >
              <Plus size={11} />
              Add Workplace
            </button>
          )}
        </div>
      </CardWrapper>

      {/* ── Sites ───────────────────────────────────────────────────────── */}
      <CardWrapper
        title="Sites"
        icon={Layers}
        iconColor="text-primary"
        description="Work site classifications for department settings"
      >
        <div className="flex items-center gap-2 flex-wrap">
          {sites.map((site) => (
            <span
              key={site}
              className="px-3 py-1 rounded-xl text-[0.7rem] font-medium bg-white border border-border text-foreground shadow-sm"
            >
              {site}
            </span>
          ))}
        </div>
      </CardWrapper>

    </div>
  );
}

export default PlacesSettings;