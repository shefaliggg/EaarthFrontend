/**
 * BulkOfferTable.jsx
 *
 * UPDATED: Passes onOpenRates, onOpenSchedule, onOpenStipulations down to rows.
 */

import { Checkbox } from "../../../../shared/components/ui/checkbox";
import { validateRow } from "../../utils/bulkOfferUtils";
import { BulkOfferFrozenRow, BulkOfferScrollRow } from "../../components/bulkoffer/BulkOfferRow";

const HEADER_H = 24;
const COL_H    = 34;

const GROUP_COLORS = {
  recipient:    "bg-sky-500/10 text-sky-800 border-sky-200",
  altcontract:  "bg-violet-500/10 text-violet-800 border-violet-200",
  dept:         "bg-emerald-500/10 text-emerald-800 border-emerald-200",
  role:         "bg-teal-500/10 text-teal-800 border-teal-200",
  tax:          "bg-amber-500/10 text-amber-800 border-amber-200",
  place:        "bg-orange-500/10 text-orange-800 border-orange-200",
  engagement:   "bg-indigo-500/10 text-indigo-800 border-indigo-200",
  rates:        "bg-pink-500/10 text-pink-800 border-pink-200",
  rates_table:  "bg-purple-500/10 text-purple-800 border-purple-200",
  schedule:     "bg-sky-600/10 text-sky-900 border-sky-300",
  allowances:   "bg-rose-500/10 text-rose-800 border-rose-200",
  stipulations: "bg-amber-600/10 text-amber-900 border-amber-300",
  notes:        "bg-slate-500/10 text-slate-800 border-slate-200",
};

function buildGroupBands(cols) {
  const bands = [];
  let cur = null;
  for (const col of cols) {
    const grp = col.group || "_";
    if (!cur || cur.group !== grp) {
      cur = { group: grp, section: col.section || grp, width: col.width };
      bands.push(cur);
    } else {
      cur.width += col.width;
    }
  }
  return bands;
}

export function BulkOfferTable({
  rows,
  frozenCols,
  scrollableCols,
  frozenWidth,
  cellRefsObj,
  onToggleSelectAll,
  onToggleSelect,
  onAddRowBelow,
  onDuplicate,
  onRemove,
  onOpenAllowances,
  onOpenRates,
  onOpenSchedule,
  onOpenStipulations,
  onCellChange,
  onKeyDown,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const bands = buildGroupBands(scrollableCols);
  const allSelected = rows.length > 0 && rows.every(r => r._selected);

  return (
    <div className="flex-1 overflow-hidden flex">

      {/* ── Frozen columns ── */}
      <div
        className="shrink-0 border-r-2 border-primary/20 bg-card z-10 flex flex-col"
        style={{ width: frozenWidth }}
      >
        <div className="shrink-0 bg-muted/60 border-b border-border" style={{ height: HEADER_H }} />

        <div className="shrink-0 flex items-center bg-muted border-b-2 border-border" style={{ height: COL_H }}>
          {frozenCols.map(col => (
            <div
              key={col.key}
              className="flex items-center justify-center border-r border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wide px-1"
              style={{ width: col.width, minWidth: col.width, height: COL_H }}
            >
              {col.key === "_select" && (
                <Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} />
              )}
              {col.key !== "_select" && col.label}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {rows.map((row, rowIdx) => {
            const { valid, errors } = validateRow(row);
            return (
              <BulkOfferFrozenRow
                key={row.id}
                row={row}
                rowIdx={rowIdx}
                isLast={rows.length <= 1}
                frozenCols={frozenCols}
                valid={valid}
                errors={errors}
                onToggleSelect={onToggleSelect}
                onAddRowBelow={onAddRowBelow}
                onDuplicate={onDuplicate}
                onOpenAllowances={onOpenAllowances}
                onOpenRates={onOpenRates}
                onOpenSchedule={onOpenSchedule}
                onOpenStipulations={onOpenStipulations}
                onRemove={onRemove}
              />
            );
          })}
        </div>
      </div>

      {/* ── Scrollable columns ── */}
      <div className="flex-1 overflow-auto">
        <div style={{ minWidth: scrollableCols.reduce((s, c) => s + c.width, 0) }}>

          {/* Group bands */}
          <div className="flex sticky top-0 z-10 border-b border-border" style={{ height: HEADER_H }}>
            {bands.map((b, i) => (
              <div
                key={i}
                className={[
                  "flex items-center justify-center text-[9px] font-bold uppercase tracking-widest border-r",
                  GROUP_COLORS[b.group] || "bg-slate-100 text-slate-600 border-slate-200",
                ].join(" ")}
                style={{ width: b.width, minWidth: b.width, height: HEADER_H }}
              >
                {b.section}
              </div>
            ))}
          </div>

          {/* Column label row */}
          <div className="flex sticky bg-muted border-b-2 border-border" style={{ top: HEADER_H, zIndex: 10, height: COL_H }}>
            {scrollableCols.map(col => (
              <div
                key={col.key}
                className={[
                  "flex items-center justify-center border-r border-border text-[9px] font-bold uppercase tracking-wide px-1",
                  col.required ? "text-primary" : "text-muted-foreground",
                ].join(" ")}
                style={{ width: col.width, minWidth: col.width, height: COL_H }}
              >
                {col.label}
                {col.required && <span className="text-destructive ml-0.5">*</span>}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {rows.map((row, rowIdx) => {
            const { valid } = validateRow(row);
            return (
              <BulkOfferScrollRow
                key={row.id}
                row={row}
                rowIdx={rowIdx}
                scrollableCols={scrollableCols}
                onCellChange={onCellChange}
                onKeyDown={onKeyDown}
                cellRefsObj={cellRefsObj}
                valid={valid}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onOpenAllowances={onOpenAllowances}
                onOpenRates={onOpenRates}
                onOpenSchedule={onOpenSchedule}
                onOpenStipulations={onOpenStipulations}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}