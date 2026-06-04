/**
 * PennyContractSettings.jsx
 *
 * Path: customSettings/components/PennyContractSettings.jsx
 *
 * Section C — Penny Contract Settings
 *
 * Displays:
 *   1. A summary counter of how many crew members currently hold penny contracts.
 *   2. An explainer box describing what a Penny Contract is.
 *   3. The Rate Visibility Matrix table (static — no server call needed).
 *   4. A paginated, searchable, filterable DataTable of all crew members with
 *      a toggle to enable / revoke penny-contract protection per member.
 *
 * Data source:
 *   customSettings.pennyContractCrew  — array of { crewMemberId: <populated> }
 *   populated by the repository lean query with firstName/lastName/department.
 *
 * The "Penny" flag is stored as membership in pennyContractCrew; any crew
 * member already in that array has protection enabled.
 */

import React, { useState } from "react";

import CardWrapper  from "../../../../../../shared/components/wrappers/CardWrapper";
import DataTable    from "../../../../../../shared/components/tables/DataTable/DataTable";
import SearchBar    from "../../../../../../shared/components/SearchBar";

import { useCustomSettings } from "../useCustomSettings";
import {
  VISIBILITY_ROLES,
  ALL_DEPARTMENTS,
  EyeBadge,
  LoadingSkeleton,
  ErrorBanner,
} from "../shared";

// ─── Constants ────────────────────────────────────────────────────────────────

const CREW_PER_PAGE = 5;

// ─── Column definitions ───────────────────────────────────────────────────────

const visibilityColumns = [
  {
    key:    "role",
    label:  "Role",
    render: (row) => (
      <span className="text-[11px] font-medium text-foreground">{row.role}</span>
    ),
  },
  {
    key:    "standard",
    label:  "Standard Contract",
    align:  "center",
    render: (row) => <EyeBadge visible={row.standard} />,
  },
  {
    key:    "penny",
    label:  "Penny Contract",
    align:  "center",
    render: (row) => <EyeBadge visible={row.penny} />,
  },
];

const buildCrewColumns = (onToggle) => [
  {
    key:    "name",
    label:  "Crew Member",
    render: (row) => (
      <span className="text-[11px] font-semibold text-foreground">{row.name}</span>
    ),
  },
  {
    key:    "dept",
    label:  "Department",
    render: (row) => (
      <span className="text-[11px] text-muted-foreground">{row.dept}</span>
    ),
  },
  {
    key:    "status",
    label:  "Status",
    render: (row) =>
      row.isPenny ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          Penny Contract
        </span>
      ) : (
        <span className="text-[11px] text-muted-foreground">Standard</span>
      ),
  },
  {
    key:    "action",
    label:  "",
    align:  "right",
    render: (row) =>
      row.isPenny ? (
        <button
          onClick={() => onToggle(row._id, true)}
          className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-100 transition-colors"
        >
          Remove Protection
        </button>
      ) : (
        <button
          onClick={() => onToggle(row._id, false)}
          className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          Enable Protection
        </button>
      ),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derives a flat list of { _id, name, dept, isPenny } rows from
 * pennyContractCrew (which is already populated by the backend lean query).
 *
 * pennyContractCrew shape (after populate):
 *   [{ crewMemberId: { _id, firstName, lastName, department }, enabledBy, enabledAt }]
 *
 * All entries in this array ARE penny-contract crew by definition —
 * the backend only stores crew members that have been flagged.
 * However, the UI also needs to show crew that are NOT protected so
 * production staff can enable protection for them.  Because this data
 * set is driven entirely by the pennyContractCrew list (populated from
 * the DB), we show all entries there and allow toggling.
 */
function deriveCrewRows(pennyContractCrew = []) {
  // Build a Set of IDs that currently hold penny protection
  const pennyIds = new Set(
    pennyContractCrew.map((e) => {
      const member = e.crewMemberId ?? e;
      return (member?._id ?? member)?.toString();
    })
  );

  return pennyContractCrew.map((entry) => {
    const member = entry.crewMemberId ?? entry;
    const id     = (member?._id ?? member)?.toString();
    return {
      _id:     id,
      name:    member?.firstName
        ? `${member.firstName} ${member.lastName}`
        : "Unknown",
      dept:    member?.department ?? "—",
      isPenny: pennyIds.has(id),
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PennyContractSettings({ projectId }) {
  const { customSettings, isFetching, error, setPennyContract } =
    useCustomSettings();

  // Derive rows + count from Redux state
  const pennyContractCrew = customSettings?.pennyContractCrew ?? [];
  const allCrewRows       = deriveCrewRows(pennyContractCrew);
  const pennyCount        = allCrewRows.filter((r) => r.isPenny).length;

  // ── Local filter / pagination state ──────────────────────────────────────
  const [search,     setSearch]     = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [crewPage,   setCrewPage]   = useState(1);

  // ── Toggle handler ────────────────────────────────────────────────────────
  const handleToggle = (crewMemberId, currentlyPenny) => {
    setPennyContract({
      projectId,
      crewMemberId,
      enabled: !currentlyPenny,
    });
  };

  // ── Filtered + paginated data ─────────────────────────────────────────────
  const filtered = allCrewRows.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchDept   =
      deptFilter === "All Departments" || m.dept === deptFilter;
    return matchSearch && matchDept;
  });

  const paginatedCrew = filtered.slice(
    (crewPage - 1) * CREW_PER_PAGE,
    crewPage * CREW_PER_PAGE
  );

  const crewColumns = buildCrewColumns(handleToggle);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <CardWrapper
      title="Penny Contract Settings"
      description="Manage confidential rate visibility for sensitive crew contracts."
      showLabel
      className="mb-5"
    >
      {/* ── Summary counter ── */}
      <div className="flex justify-end mb-4">
        <div className="flex flex-col items-center rounded-xl border border-border bg-muted px-5 py-2 min-w-[80px]">
          <span className="text-xl font-bold text-primary">{pennyCount}</span>
          <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
            Penny Contracts
          </span>
        </div>
      </div>

      {/* ── Explainer ── */}
      <div className="mb-5 flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="mt-0.5 flex-shrink-0 text-primary"
        >
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
          <path
            d="M8 7v4M8 5.5v.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <div>
          <p className="text-xs font-semibold text-primary mb-1">
            What is a Penny Contract?
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Penny Contracts protect sensitive rate information from department
            visibility. When enabled, HOD and department members cannot see the
            crew member's rates, but Production, Finance, and Payroll maintain
            full access.
          </p>
        </div>
      </div>

      {error && <ErrorBanner message={error.message} />}

      {/* ── Visibility matrix ── */}
      <div className="mb-5 rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
          <p className="text-xs font-semibold text-foreground">
            Rate Visibility Matrix
          </p>
        </div>
        <DataTable
          data={VISIBILITY_ROLES}
          columns={visibilityColumns}
          hidePagination
          hideExport
          currentPage={1}
          ItemsPerPage={VISIBILITY_ROLES.length}
          totalItemsSize={VISIBILITY_ROLES.length}
        />
      </div>

      {/* ── Search + department filter ── */}
      <div className="mb-3 flex items-center gap-3">
        <SearchBar
          placeholder="Search crew by name..."
          value={search}
          onValueChange={(v) => { setSearch(v); setCrewPage(1); }}
        />
        <select
          value={deptFilter}
          onChange={(e) => { setDeptFilter(e.target.value); setCrewPage(1); }}
          className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground outline-none cursor-pointer h-10"
        >
          {ALL_DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* ── Crew table ── */}
      {isFetching ? (
        <LoadingSkeleton />
      ) : (
        <DataTable
          data={paginatedCrew}
          columns={crewColumns}
          hidePagination={filtered.length <= CREW_PER_PAGE}
          hideExport
          currentPage={crewPage}
          ItemsPerPage={CREW_PER_PAGE}
          totalItemsSize={filtered.length}
          onPageChange={setCrewPage}
          emptyStateConfig={{
            title:       "No crew found",
            description: "Try adjusting your search or filter.",
            icon:        "Users",
          }}
        />
      )}
    </CardWrapper>
  );
}