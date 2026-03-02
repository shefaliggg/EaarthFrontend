// ─── OffersList ──────────────────────────────────────────────────────────────
// Uses reusable SearchBar for search input.
// Filter and Export use shared ActionButton / IconButton patterns.

import { useState, useMemo } from "react";
import { Filter, Download, FileText, X } from "lucide-react";

import SearchBar          from "../../../../shared/components/SearchBar";
import { Button }         from "../../../../shared/components/ui/button";
import { OffersListRow }  from "./OffersListRow";
import { getStatusLabel } from "./OfferStatusBadge";
import { Skeleton }       from "../../../../shared/components/ui/skeleton";

// ─── Filter helpers ───────────────────────────────────────────────────────────

function matchesSummaryFilter(status, filterKey) {
  if (!filterKey || filterKey === "ALL") return true;
  const label = getStatusLabel(status);
  if (filterKey === "PENDING")  return ["DRAFT","OFFER SENT","REQUIRES ATTENTION","PRODUCTION CHECK","ACCOUNTS CHECK","CREW SIGN","UPM SIGN","FC SIGN","STUDIO SIGN"].includes(label);
  if (filterKey === "ACCEPTED") return ["CREW ACCEPTED","CONTRACTED"].includes(label);
  if (filterKey === "REJECTED") return label === "REJECTED";
  if (filterKey === "ENDED")    return label === "ENDED";
  return false;
}

const STAGE_STATUS_MAP = {
  DRAFT:                    ["DRAFT"],
  SENT_TO_CREW:             ["SENT_TO_CREW"],
  NEEDS_REVISION:           ["NEEDS_REVISION"],
  CREW_ACCEPTED:            ["CREW_ACCEPTED"],
  PRODUCTION_CHECK:         ["PRODUCTION_CHECK"],
  ACCOUNTS_CHECK:           ["ACCOUNTS_CHECK"],
  PENDING_CREW_SIGNATURE:   ["PENDING_CREW_SIGNATURE"],
  PENDING_UPM_SIGNATURE:    ["PENDING_UPM_SIGNATURE"],
  PENDING_FC_SIGNATURE:     ["PENDING_FC_SIGNATURE"],
  PENDING_STUDIO_SIGNATURE: ["PENDING_STUDIO_SIGNATURE"],
  COMPLETED:                ["COMPLETED"],
};

// ─── Export helper ────────────────────────────────────────────────────────────

function exportToCSV(offers) {
  const rows = offers.map(o => ({
    Name:       o.recipient?.fullName || o.fullName || "",
    Role:       o.jobTitle || "",
    Department: o.department || "",
    Status:     o.status || "",
    "Fee/Day":  o.feePerDay || "",
    Currency:   o.currency || "",
    Start:      o.startDate ? new Date(o.startDate).toLocaleDateString("en-GB") : "",
    End:        o.endDate   ? new Date(o.endDate).toLocaleDateString("en-GB")   : "",
  }));

  const header = Object.keys(rows[0] || {}).join(",");
  const body   = rows.map(r => Object.values(r).map(v => `"${v}"`).join(",")).join("\n");
  const blob   = new Blob([`${header}\n${body}`], { type: "text/csv" });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement("a");
  a.href = url; a.download = "offers.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OffersList({
  offers      = [],
  isLoading   = false,
  stageFilter = null,
  statFilter  = null,
  onNavigate,
  onClearFilter,
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = offers;

    if (stageFilter) {
      const allowed = STAGE_STATUS_MAP[stageFilter] || [stageFilter];
      list = list.filter(o => allowed.includes(o.status));
    }
    if (statFilter && statFilter !== "ALL") {
      list = list.filter(o => matchesSummaryFilter(o.status, statFilter));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o => {
        const name  = (o.recipient?.fullName || o.fullName || "").toLowerCase();
        const title = (o.jobTitle || "").toLowerCase();
        const dept  = (o.department || "").toLowerCase();
        return name.includes(q) || title.includes(q) || dept.includes(q);
      });
    }

    return list;
  }, [offers, stageFilter, statFilter, search]);

  const heading = stageFilter
    ? `${getStatusLabel(stageFilter)} (${filtered.length})`
    : statFilter && statFilter !== "ALL"
    ? `${statFilter} (${filtered.length})`
    : `All Offers (${filtered.length})`;

  const hasFilter = stageFilter || (statFilter && statFilter !== "ALL");

  return (
    <div className="space-y-3">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2">

        {/* Reusable SearchBar */}
        <SearchBar
          placeholder="Search by name, role or department…"
          value={search}
          onValueChange={e => setSearch(e.target.value)}
        />

        {/* Filter button */}
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-2 px-4 text-[13px] rounded-full border-2 shrink-0"
        >
          <Filter className="w-4 h-4" />
          Filter
        </Button>

        {/* Export button */}
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-2 px-4 text-[13px] rounded-full border-2 shrink-0"
          onClick={() => exportToCSV(filtered)}
          disabled={filtered.length === 0}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* ── List card ── */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">

        {/* Card header */}
        <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-semibold text-neutral-800">{heading}</h2>
            {hasFilter && (
              <button
                onClick={onClearFilter}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition-colors"
              >
                <X className="w-2.5 h-2.5" /> Clear
              </button>
            )}
          </div>
          <span className="text-[11px] text-neutral-400">
            {offers.length} total · {filtered.length} shown
          </span>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <FileText className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-[14px] text-neutral-500 font-medium">No offers found</p>
            <p className="text-[12px] text-neutral-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div>
            {filtered.map((offer, idx) => (
              <OffersListRow
                key={offer._id || offer.id || idx}
                offer={offer}
                onNavigate={onNavigate}
                isLast={idx === filtered.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}