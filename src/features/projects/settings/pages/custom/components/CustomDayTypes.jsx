// CustomDayTypes.jsx — updated to match Image 1 exactly

import React, { useState } from "react";

import CardWrapper           from "../../../../../../shared/components/wrappers/CardWrapper";
import EditableSelectField   from "../../../../../../shared/components/wrappers/EditableSelectField";
import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";
import EditableSwitchField   from "../../../../../../shared/components/wrappers/EditableSwitchField";
import DataTable             from "../../../../../../shared/components/tables/DataTable/DataTable";
import TableActions          from "../../../../../../shared/components/tables/DataTable/TableAction";

import { useCustomSettings } from "../useCustomSettings";
import {
  PAID_AS_OPTIONS,
  InlineAddForm,
  AddRowButton,
  LoadingSkeleton,
  ErrorBanner,
} from "../shared";

// ─── Column definitions ───────────────────────────────────────────────────────

const buildColumns = (onDelete) => [
  {
    key:   "name",
    label: "Day Type",
    render: (row) => (
      <span className="text-[11px] font-semibold text-foreground uppercase">
        {row.name}
      </span>
    ),
  },
{
  key:   "paidAs",
  label: "Paid As",
  align: "center",
  render: (row) => (
    <span className="text-[11px] text-muted-foreground">
      {row.paidAs === "PERCENTAGE" ? "Percentage" : row.paidAs === "FIXED" ? "Fixed" : "Hourly"}
    </span>
  ),
},
  {
    key:    "rate",
    label:  "Rate %",
    align:  "center",
    render: (row) => (
      <span className="text-[11px] font-bold text-primary">{row.rate}%</span>
    ),
  },
  {
    key:    "holiday",
    label:  "Holiday",
    align:  "center",
    render: (row) => (
      <span className="text-[11px] text-muted-foreground">{row.holiday}</span>
    ),
  },
  {
    key:    "othTm",
    label:  "OTH/TM",
    align:  "center",
    render: (row) => (
      <span className="text-[11px] text-muted-foreground">{row.othTm}</span>
    ),
  },
  {
    key:    "payAllowances",
    label:  "Allow",
    align:  "center",
    render: (row) => (
      <span className={`text-[10px] font-bold ${row.payAllowances ? "text-primary" : "text-muted-foreground"}`}>
        {row.payAllowances ? "YES" : "NO"}
      </span>
    ),
  },
  {
    key:    "showToCrew",
    label:  "Crew",
    align:  "center",
    render: (row) => (
      <span className={`text-[10px] font-bold ${row.showToCrew ? "text-primary" : "text-muted-foreground"}`}>
        {row.showToCrew ? "YES" : "NO"}
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

export default function CustomDayTypes({ projectId }) {
  const { customSettings, isFetching, isSubmitting, error, addDayType, deleteDayType } =
    useCustomSettings();

  const rows = (customSettings?.customDayTypes ?? []).filter((d) => d.isActive !== false);

  // ── Form state ────────────────────────────────────────────────────────────
  const [showForm,  setShowForm]  = useState(false);
  const [newName,   setNewName]   = useState("");
  const [newPaidAs, setNewPaidAs] = useState("PERCENTAGE");
  const [newRate,   setNewRate]   = useState("100");
  const [newAllow,  setNewAllow]  = useState(true);
  const [newCrew,   setNewCrew]   = useState(true);

  const resetForm = () => {
    setNewName("");
    setNewPaidAs("PERCENTAGE");
    setNewRate("100");
    setNewAllow(true);
    setNewCrew(true);
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newName.trim()) return;
    const result = await addDayType({
      projectId,
      data: {
        name:          newName.toUpperCase().trim(),
        paidAs:        newPaidAs,
        rate:          Number(newRate),
        payAllowances: newAllow,
        showToCrew:    newCrew,
      },
    });
    if (!result.error) {
      resetForm();
      setShowForm(false);
    }
  };

  const handleDelete = (dayTypeId) => deleteDayType({ projectId, dayTypeId });

  const columns = buildColumns(handleDelete);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <CardWrapper
      title="Custom Day Types"
      description="Define non-standard day types with their rate calculations."
      showLabel
      className="mb-5"
    >
      {isFetching && !customSettings ? (
        <LoadingSkeleton />
      ) : (
        <>
          {error && <ErrorBanner message={error.message} />}

          <DataTable
            data={rows}
            columns={columns}
            hidePagination
            hideExport
            currentPage={1}
            ItemsPerPage={rows.length || 10}
            totalItemsSize={rows.length}
            emptyStateConfig={{
              title:       "No day types",
              description: "Add a custom day type to get started.",
              icon:        "Calendar",
            }}
          />

          {showForm && (
            <InlineAddForm
              onCancel={() => { resetForm(); setShowForm(false); }}
              onSubmit={handleAdd}
              submitLabel="Add Day Type"
              isSubmitting={isSubmitting}
            >
              {/* Row 1 — Day Type · Paid As · Rate % */}
              <div className="grid grid-cols-3 gap-4">
                <EditableTextDataField
                  label="Day Type"
                  value={newName}
                  isEditing
                  onChange={setNewName}
                  placeholder="e.g. BANK HOLIDAY"
                  isRequired
                />
                <EditableSelectField
                  label="Paid As"
                  value={newPaidAs}
                  items={PAID_AS_OPTIONS}
                  isEditing
                  onChange={setNewPaidAs}
                />
                <EditableTextDataField
                  label="Rate %"
                  value={newRate}
                  isEditing
                  onChange={setNewRate}
                  type="number"
                />
              </div>

              {/* Row 2 — Pay Allowances · Show to Crew */}
              <div className="grid grid-cols-2 gap-4">
                <EditableSwitchField
                  label="Pay Allowances"
                  checked={newAllow}
                  onChange={setNewAllow}
                  isEditing
                />
                <EditableSwitchField
                  label="Show to Crew"
                  checked={newCrew}
                  onChange={setNewCrew}
                  isEditing
                />
              </div>
            </InlineAddForm>
          )}

          {!showForm && (
            <AddRowButton
              label="Add Custom Day Type"
              onClick={() => setShowForm(true)}
            />
          )}
        </>
      )}
    </CardWrapper>
  );
}