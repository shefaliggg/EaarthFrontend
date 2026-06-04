/**
 * UpgradeRoles.jsx
 *
 * Path: customSettings/components/UpgradeRoles.jsx
 *
 * Section B — Upgrade Roles
 * DataTable of active upgrade roles + inline "Add Role" form.
 * Wired to Redux via useCustomSettings hook.
 */

import React, { useState } from "react";

import CardWrapper           from "../../../../../../shared/components/wrappers/CardWrapper";
import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";
import DataTable             from "../../../../../../shared/components/tables/DataTable/DataTable";
import TableActions          from "../../../../../../shared/components/tables/DataTable/TableAction";

import { useCustomSettings } from "../useCustomSettings";
import {
  InlineAddForm,
  AddRowButton,
  LoadingSkeleton,
  ErrorBanner,
} from "../shared";

// ─── Column definitions ───────────────────────────────────────────────────────

const buildColumns = (onDelete) => [
  {
    key:    "role",
    label:  "Role",
    render: (row) => (
      <span className="text-[11px] font-semibold text-foreground uppercase">
        {row.role}
      </span>
    ),
  },
  {
    key:    "dayRateIncHoliday",
    label:  "Day Rate Inc. Holiday (£)",
    align:  "right",
    render: (row) => (
      <span className="text-[11px] font-bold text-primary">
        £ {row.dayRateIncHoliday}
      </span>
    ),
  },
  {
    key:    "standardHours",
    label:  "Standard Hours",
    align:  "right",
    render: (row) => (
      <span className="text-[11px] text-muted-foreground">
        {row.standardHours}h
      </span>
    ),
  },
  {
    key:    "actions",
    label:  "",
    align:  "right",
    render: (row) => (
      <TableActions
        showView={false}
        showEdit={false}
        showDelete
        onDelete={() => onDelete(row._id)}
      />
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function UpgradeRoles({ projectId }) {
  const {
    customSettings,
    isFetching,
    isSubmitting,
    error,
    addUpgradeRole,
    deleteUpgradeRole,
  } = useCustomSettings();

  // Only show rows the backend hasn't soft-deleted
  const roles = (customSettings?.upgradeRoles ?? []).filter(
    (r) => r.isActive !== false
  );

  // ── Form state ────────────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [newRole,  setNewRole]  = useState("");
  const [newRate,  setNewRate]  = useState("0");
  const [newHours, setNewHours] = useState("10");

  const resetForm = () => {
    setNewRole("");
    setNewRate("0");
    setNewHours("10");
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newRole.trim()) return;
    const result = await addUpgradeRole({
      projectId,
      data: {
        role:              newRole.toUpperCase().trim(),
        dayRateIncHoliday: Number(newRate),
        standardHours:     Number(newHours),
      },
    });
    if (!result.error) {
      resetForm();
      setShowForm(false);
    }
  };

  const handleDelete = (roleId) => {
    deleteUpgradeRole({ projectId, roleId });
  };

  const columns = buildColumns(handleDelete);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <CardWrapper
      title="Upgrade Roles"
      description="Roles with day rates and standard working hours for upgrades."
      showLabel
      className="mb-5"
    >
      {isFetching && !customSettings ? (
        <LoadingSkeleton />
      ) : (
        <>
          {error && <ErrorBanner message={error.message} />}

          <DataTable
            data={roles}
            columns={columns}
            hidePagination
            hideExport
            currentPage={1}
            ItemsPerPage={roles.length || 10}
            totalItemsSize={roles.length}
            emptyStateConfig={{
              title:       "No upgrade roles",
              description: "Add a role to get started.",
              icon:        "Users",
            }}
          />

          {showForm && (
            <InlineAddForm
              onCancel={() => { resetForm(); setShowForm(false); }}
              onSubmit={handleAdd}
              submitLabel="Add Role"
              isSubmitting={isSubmitting}
            >
              <div className="grid grid-cols-3 gap-4">
                <EditableTextDataField
                  label="Role"
                  value={newRole}
                  isEditing
                  onChange={setNewRole}
                  placeholder="e.g. DIRECTOR"
                  isRequired
                />
                <EditableTextDataField
                  label="Day Rate Inc. Holiday (£)"
                  value={newRate}
                  isEditing
                  onChange={setNewRate}
                  type="number"
                  isRequired={false}
                />
                <EditableTextDataField
                  label="Standard Working Hours"
                  value={newHours}
                  isEditing
                  onChange={setNewHours}
                  type="number"
                  isRequired={false}
                />
              </div>
            </InlineAddForm>
          )}

          {!showForm && (
            <AddRowButton
              label="Add Upgrade Role"
              onClick={() => setShowForm(true)}
            />
          )}
        </>
      )}
    </CardWrapper>
  );
}