/**
 * DepartmentSettings.jsx
 * Path: src/features/projects/settings/components/departments/DepartmentSettings.jsx
 */

import { useState, useEffect }  from "react";
import { useOutletContext }      from "react-router-dom";
import { Plus, Loader2 }        from "lucide-react";

import CardWrapper       from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import DataTable         from "@/shared/components/tables/DataTable/DataTable";
import { DepartmentColumns } from "./DepartmentColumns";
import { useDepartmentSettings } from "./useDepartmentSettings";

const emptyDepartment = () => ({
  // no _id — Mongo assigns one on save
  department:    "",
  site:          "On Set",
  cameraOT:      false,
  otherOT:       false,
  minutesAcross: null,
  minutesBefore: null,
  minutesAfter:  null,
});

function DepartmentSettings() {
  const { projectId } = useOutletContext();

  const {
    departments,
    isFetching,
    isUpdating,
    error,
    saveDepartments,
  } = useDepartmentSettings(projectId);

  const [isEditing, setIsEditing] = useState(false);
  const [draft,     setDraft]     = useState(null);
  const [saveError, setSaveError] = useState(null);

  // ── Edit / Save / Cancel ──────────────────────────────────────────────────

  const handleEdit = () => {
    setDraft((departments ?? []).map((r) => ({ ...r })));
    setSaveError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraft(null);
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      await saveDepartments(draft).unwrap();
      setIsEditing(false);
      setDraft(null);
    } catch (err) {
      setSaveError(err?.message ?? "Save failed. Please try again.");
    }
  };

  // ── Delete row (draft only — not committed until Save) ────────────────────

  const handleDelete = (id) =>
    setDraft((prev) => prev.filter((r) => (r._id ?? r.id) !== id));

  // ── Display rows: draft while editing, Redux data otherwise ──────────────

  const displayRows = isEditing ? (draft ?? []) : (departments ?? []);

  // ── Loading state ─────────────────────────────────────────────────────────

  if (isFetching && !departments) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
        <Loader2 size={16} className="animate-spin" />
        Loading department settings…
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {(error || saveError) && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
          {saveError ?? error?.message ?? "Something went wrong. Please try again."}
        </div>
      )}

      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">
                Department Overtime &amp; Wrap Time
              </h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Configure camera/other overtime and reasonable prep &amp; wrap
                minutes per department and site
              </p>
            </div>
          </div>

          <EditToggleButtons
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isUpdating}
          />
        </div>

        <DataTable
          data={displayRows}
          columns={DepartmentColumns({
            departments: displayRows,
            setDepartments: setDraft,
            isEditing,
            onDelete: handleDelete,
          })}
          currentPage={1}
          ItemsPerPage={50}
          totalItemsSize={displayRows.length}
          onPageChange={() => {}}
          setItemsPerPage={() => {}}
          hidePagination
          hideExport
        />

        {isEditing && (
          <button
            onClick={() => setDraft((prev) => [...(prev ?? []), emptyDepartment()])}
            className="w-full border-2 border-dashed border-border text-primary mt-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-muted/20"
          >
            <Plus size={16} />
            Add Department Row
          </button>
        )}
      </CardWrapper>
    </div>
  );
}

export default DepartmentSettings;