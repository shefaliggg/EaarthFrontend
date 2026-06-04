/**
 * DailyAllowancesOverrides.jsx
 *
 * Path: customSettings/components/DailyAllowancesOverrides.jsx
 *
 * Section D — Daily Allowances / Overrides
 *
 * Displays a paginated DataTable of existing overrides, plus an inline modal
 * panel to create a new override that can be applied to one or many crew members
 * at once.
 *
 * Crew member list is sourced from customSettings.pennyContractCrew (same
 * populated array the backend returns) so no second network call is needed.
 *
 * Override payload sent to the backend:
 *   { field, value, date | null, notes, crewMembers: [ObjectId] }
 */

import React, { useState } from "react";

import CardWrapper           from "../../../../../../shared/components/wrappers/CardWrapper";
import EditableSelectField   from "../../../../../../shared/components/wrappers/EditableSelectField";
import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";
import DataTable             from "../../../../../../shared/components/tables/DataTable/DataTable";
import TableActions          from "../../../../../../shared/components/tables/DataTable/TableAction";
import SearchBar             from "../../../../../../shared/components/SearchBar";

import { useCustomSettings } from "../useCustomSettings";
import { FIELD_OPTIONS, ErrorBanner } from "../shared";

// ─── Constants ────────────────────────────────────────────────────────────────

const OV_PER_PAGE = 5;

// ─── Column definitions ───────────────────────────────────────────────────────

const buildOverrideColumns = (onDelete) => [
  {
    key:    "field",
    label:  "Field",
    render: (row) => (
      <span className="text-[11px] font-semibold text-foreground">{row.field}</span>
    ),
  },
  {
    key:    "value",
    label:  "Value",
    render: (row) => (
      <span className="text-[11px] text-muted-foreground">{row.value}</span>
    ),
  },
  {
    key:    "date",
    label:  "Date",
    render: (row) => (
      <span className="text-[11px] text-muted-foreground">
        {row.date ? new Date(row.date).toLocaleDateString() : "—"}
      </span>
    ),
  },
  {
    key:    "crewMembers",
    label:  "Members",
    align:  "center",
    render: (row) => {
      const count = row.crewMembers?.length ?? 0;
      return (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {count} member{count !== 1 ? "s" : ""}
        </span>
      );
    },
  },
  {
    key:    "notes",
    label:  "Notes",
    render: (row) => (
      <span className="text-[11px] text-muted-foreground">{row.notes || "—"}</span>
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Flattens pennyContractCrew (populated) into simple { _id, name, dept } rows
 * for the crew-picker in the "New Override" panel.
 */
function deriveCrewList(pennyContractCrew = []) {
  return pennyContractCrew.map((entry) => {
    const member = entry.crewMemberId ?? entry;
    return {
      _id:  (member?._id ?? member)?.toString(),
      name: member?.firstName
        ? `${member.firstName} ${member.lastName}`
        : "Unknown",
      dept: member?.department ?? "—",
    };
  });
}

// ─── Sub-component: crew picker ───────────────────────────────────────────────

function CrewPicker({ allCrew, selected, onToggle, onSelectAll, onDeselectAll }) {
  const [activeDept,  setActiveDept]  = useState("All");
  const [crewSearch,  setCrewSearch]  = useState("");

  const depts = ["All", ...new Set(allCrew.map((c) => c.dept))];

  const visibleCrew = allCrew.filter((c) => {
    const matchDept   = activeDept === "All" || c.dept === activeDept;
    const matchSearch = c.name.toLowerCase().includes(crewSearch.toLowerCase());
    return matchDept && matchSearch;
  });

  const selectedNames = allCrew.filter((c) => selected.has(c._id));

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Select Crew Members
          </span>
          {selected.size > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
              {selected.size} Selected
            </span>
          )}
        </div>
        <button
          onClick={selected.size === allCrew.length ? onDeselectAll : onSelectAll}
          className="text-[10px] font-semibold text-primary hover:underline"
        >
          {selected.size === allCrew.length ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* Department filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {depts.map((d) => {
          const total   = d === "All"
            ? allCrew.length
            : allCrew.filter((c) => c.dept === d).length;
          const deptSel = d === "All"
            ? selected.size
            : allCrew.filter((c) => c.dept === d && selected.has(c._id)).length;
          const active  = activeDept === d;

          return (
            <button
              key={d}
              onClick={() => setActiveDept(d)}
              className={`rounded-full border px-3 py-1 text-[10px] font-medium transition-colors ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50"
              }`}
            >
              {d === "All" ? "All" : `${d} (${total})`}
              {deptSel > 0 && d !== "All" && (
                <span className="ml-1 font-bold text-primary">
                  {deptSel}/{total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search bar */}
      <SearchBar
        placeholder="Search crew by name or department..."
        value={crewSearch}
        onValueChange={setCrewSearch}
      />

      {/* Crew grid */}
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
        {visibleCrew.length === 0 ? (
          <div className="col-span-4 py-6 text-center text-xs text-muted-foreground">
            No crew members found
          </div>
        ) : (
          visibleCrew.map((c) => {
            const checked = selected.has(c._id);
            return (
              <div
                key={c._id}
                onClick={() => onToggle(c._id)}
                className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 transition-colors ${
                  checked
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                    checked
                      ? "border-primary bg-primary"
                      : "border-border bg-background"
                  }`}
                >
                  {checked && (
                    <svg width="8" height="8" viewBox="0 0 8 8">
                      <polyline
                        points="1,4 3,6 7,2"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-foreground uppercase leading-tight">
                    {c.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{c.dept}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected member chips */}
      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedNames.map((m) => (
            <span
              key={m._id}
              className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
            >
              {m.name}
              <button
                onClick={() => onToggle(m._id)}
                className="hover:text-red-500"
              >
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <path
                    d="M1 1l6 6M7 1L1 7"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DailyAllowancesOverrides({ projectId }) {
  const {
    customSettings,
    isSubmitting,
    error,
    addAllowanceOverride,
    deleteAllowanceOverride,
  } = useCustomSettings();

  const overrides = customSettings?.allowanceOverrides ?? [];
  const allCrew   = deriveCrewList(customSettings?.pennyContractCrew ?? []);

  // ── Override table pagination ─────────────────────────────────────────────
  const [overridePage, setOverridePage] = useState(1);

  // ── New-override modal state ──────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [selected,  setSelected]  = useState(new Set());
  const [field,     setField]     = useState("MILEAGE");
  const [value,     setValue]     = useState("");
  const [date,      setDate]      = useState("");
  const [notes,     setNotes]     = useState("");

  // ── Crew selection helpers ────────────────────────────────────────────────
  const toggleCrew  = (id) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const selectAll   = () => setSelected(new Set(allCrew.map((c) => c._id)));
  const deselectAll = () => setSelected(new Set());

  const closeModal = () => {
    setShowModal(false);
    setSelected(new Set());
    setField("MILEAGE");
    setValue("");
    setDate("");
    setNotes("");
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleApply = async () => {
    if (!selected.size || !value.trim()) return;
    const result = await addAllowanceOverride({
      projectId,
      data: {
        field,
        value:       value.trim(),
        date:        date || null,
        notes:       notes.trim(),
        crewMembers: Array.from(selected),
      },
    });
    if (!result.error) closeModal();
  };

  const handleDelete = (overrideId) => {
    deleteAllowanceOverride({ projectId, overrideId });
  };

  const overrideColumns = buildOverrideColumns(handleDelete);
  const pagedOverrides  = overrides.slice(
    (overridePage - 1) * OV_PER_PAGE,
    overridePage * OV_PER_PAGE
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <CardWrapper
      title="Daily Allowances / Overrides"
      description="Apply override values to one or multiple crew members at once."
      showLabel
      className="mb-5"
      actions={
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <span className="text-sm leading-none">+</span> Add Override
        </button>
      }
    >
      {error && <ErrorBanner message={error.message} />}

      {/* ── Overrides table ── */}
      <DataTable
        data={pagedOverrides}
        columns={overrideColumns}
        hidePagination={overrides.length <= OV_PER_PAGE}
        hideExport
        currentPage={overridePage}
        ItemsPerPage={OV_PER_PAGE}
        totalItemsSize={overrides.length}
        onPageChange={setOverridePage}
        emptyStateConfig={{
          title:       "No overrides yet",
          description: 'Click "Add Override" to create one.',
          icon:        "SlidersHorizontal",
        }}
      />

      {/* ── New override panel ── */}
      {showModal && (
        <div className="mt-4 rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              New Override
            </span>
            <button
              onClick={closeModal}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 2l10 10M12 2L2 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Panel body */}
          <div className="p-5 space-y-4">
            {/* Crew picker */}
            <CrewPicker
              allCrew={allCrew}
              selected={selected}
              onToggle={toggleCrew}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
            />

            <div className="border-t border-border" />

            {/* Override fields */}
            <div className="grid grid-cols-2 gap-4">
              <EditableSelectField
                label="Field"
                value={field}
                items={FIELD_OPTIONS}
                isEditing
                onChange={setField}
                isRequired={false}
              />
              <EditableTextDataField
                label="Value"
                value={value}
                isEditing
                onChange={setValue}
                isRequired
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <EditableTextDataField
                label="Date"
                value={date}
                isEditing
                onChange={setDate}
                placeholder="dd-mm-yyyy"
                type="date"
                isRequired={false}
              />
              <EditableTextDataField
                label="Notes"
                value={notes}
                isEditing
                onChange={setNotes}
                isRequired={false}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-[11px] text-muted-foreground">
                {selected.size === 0
                  ? "Select at least one crew member"
                  : `Will create ${selected.size} override${selected.size !== 1 ? "s" : ""} · ${field} — ${value || "…"}`}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={closeModal}
                  className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={!selected.size || !value.trim() || isSubmitting}
                  className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
                >
                  {isSubmitting
                    ? "Saving…"
                    : `Apply to ${selected.size} Member${selected.size !== 1 ? "s" : ""}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CardWrapper>
  );
}