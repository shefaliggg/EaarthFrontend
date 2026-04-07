/**
 * BulkOfferCell.jsx
 *
 * Renders a single editable cell in the BulkOfferCreate spreadsheet.
 * Supports: text, email, number, select, date, checkbox,
 *           allowances_preview, rates_preview, schedule_preview, stipulations_preview.
 *
 * UPDATED: Added rates_preview, schedule_preview, stipulations_preview cell types.
 */

import { Checkbox } from "../../../../shared/components/ui/checkbox";
import { ALLOW_SHORT } from "./AllowancePanel";
import { parseISO, isValid, format } from "date-fns";

// ─── Schedule summary helper ──────────────────────────────────────────────────
function schedSummary(schedule) {
  if (!schedule) return null;
  const blocks = schedule.blocks || [];
  const filled = blocks.filter(b => b.start && b.end);
  const totalDays = schedule.totalDays || 0;
  if (!filled.length && !totalDays) return null;
  const parts = [];
  if (filled.length) parts.push(`${filled.length} block${filled.length !== 1 ? "s" : ""}`);
  if (totalDays > 0) parts.push(`${totalDays}d`);
  return parts.join(" · ");
}

export function BulkOfferCell({
  col,
  value,
  row,
  onChange,
  onKeyDown,
  cellRef,
  invalid,
  onDragStart,
  onDragOver,
  onDrop,
  rowIdx,
  colIdx,
  onOpenAllowances,
  onOpenRates,
  onOpenSchedule,
  onOpenStipulations,
}) {
  const base = [
    "w-full h-full bg-transparent border-0 focus:outline-none",
    "focus:ring-inset focus:ring-1 focus:ring-primary/60 px-1.5 text-[11px]",
    invalid ? "bg-red-50/60" : "",
  ].join(" ");

  // ── Rates preview ─────────────────────────────────────────────────────────
  if (col.type === "rates_preview") {
    const hasFee = row.feePerDay && parseFloat(row.feePerDay) > 0;
    const salaryCount   = row.calculatedRates?.salary?.length   || 0;
    const overtimeCount = row.calculatedRates?.overtime?.length || 0;
    return (
      <button
        onClick={() => onOpenRates?.(row.id)}
        className="w-full h-full flex items-center gap-1 px-1.5 hover:bg-purple-50/60 transition-colors group"
        title="View salary & overtime rates"
      >
        {hasFee ? (
          <div className="flex flex-wrap gap-0.5">
            <span className="text-[9px] px-1.5 py-0 rounded bg-purple-100 text-purple-700 border border-purple-200 font-medium leading-4">
              {salaryCount} salary
            </span>
            <span className="text-[9px] px-1.5 py-0 rounded bg-indigo-100 text-indigo-700 border border-indigo-200 font-medium leading-4">
              {overtimeCount} OT
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-muted-foreground group-hover:text-purple-600 transition-colors">
            No fee — click to view
          </span>
        )}
      </button>
    );
  }

  // ── Schedule preview ──────────────────────────────────────────────────────
  if (col.type === "schedule_preview") {
    const summary = schedSummary(row.schedule);
    const hasSchedule = summary !== null;
    return (
      <button
        onClick={() => onOpenSchedule?.(row.id)}
        className="w-full h-full flex items-center gap-1 px-1.5 hover:bg-sky-50/60 transition-colors group"
        title="Edit schedule"
      >
        {hasSchedule ? (
          <div className="flex flex-wrap gap-0.5">
            <span className="text-[9px] px-1.5 py-0 rounded bg-sky-100 text-sky-700 border border-sky-200 font-medium leading-4">
              {summary}
            </span>
            {row.schedule?.hiatus?.some(h => h.start && h.end) && (
              <span className="text-[9px] px-1 py-0 rounded bg-amber-100 text-amber-700 border border-amber-200 font-medium leading-4">
                hiatus
              </span>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-muted-foreground group-hover:text-sky-600 transition-colors">
            None — click to add
          </span>
        )}
      </button>
    );
  }

  // ── Allowances preview ────────────────────────────────────────────────────
  if (col.type === "allowances_preview") {
    const enabled = Object.entries(row.allowances || {}).filter(([, a]) => a?.enabled);
    return (
      <button
        onClick={() => onOpenAllowances?.(row.id)}
        className="w-full h-full flex items-center gap-1 px-1.5 hover:bg-rose-50/60 transition-colors group"
        title="Edit allowances"
      >
        {enabled.length === 0 ? (
          <span className="text-[10px] text-muted-foreground group-hover:text-rose-600 transition-colors">
            None — click to add
          </span>
        ) : (
          <div className="flex flex-wrap gap-0.5">
            {enabled.map(([k]) => (
              <span
                key={k}
                className="text-[9px] px-1 py-0 rounded bg-rose-100 text-rose-700 border border-rose-200 font-medium leading-4"
              >
                {ALLOW_SHORT[k] || k}
              </span>
            ))}
          </div>
        )}
      </button>
    );
  }

  // ── Stipulations preview ──────────────────────────────────────────────────
  if (col.type === "stipulations_preview") {
    const count = row.specialStipulations?.length || 0;
    return (
      <button
        onClick={() => onOpenStipulations?.(row.id)}
        className="w-full h-full flex items-center gap-1 px-1.5 hover:bg-amber-50/60 transition-colors group"
        title="Edit special stipulations"
      >
        {count === 0 ? (
          <span className="text-[10px] text-muted-foreground group-hover:text-amber-600 transition-colors">
            None — click to add
          </span>
        ) : (
          <span className="text-[9px] px-1.5 py-0 rounded bg-amber-100 text-amber-700 border border-amber-200 font-medium leading-4">
            {count} stipulation{count !== 1 ? "s" : ""}
          </span>
        )}
      </button>
    );
  }

  // ── Checkbox ──────────────────────────────────────────────────────────────
  if (col.type === "checkbox") {
    return (
      <div className="flex items-center justify-center h-full">
        <Checkbox
          checked={!!value}
          onCheckedChange={v => onChange(col.key, v)}
        />
      </div>
    );
  }

  // ── Select ────────────────────────────────────────────────────────────────
  if (col.type === "select") {
    return (
      <select
        ref={cellRef}
        value={value ?? ""}
        onChange={e => onChange(col.key, e.target.value)}
        onKeyDown={onKeyDown}
        className={`${base} cursor-pointer`}
      >
        {col.options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  }

  // ── Date ──────────────────────────────────────────────────────────────────
  if (col.type === "date") {
    return (
      <input
        ref={cellRef}
        type="date"
        value={value ?? ""}
        onChange={e => onChange(col.key, e.target.value)}
        onKeyDown={onKeyDown}
        className={`${base} cursor-pointer`}
      />
    );
  }

  // ── Number — supports drag-to-fill ───────────────────────────────────────
  if (col.type === "number") {
    return (
      <input
        ref={cellRef}
        type="number"
        step="0.01"
        value={value ?? ""}
        placeholder="0"
        onChange={e => onChange(col.key, e.target.value)}
        onKeyDown={onKeyDown}
        draggable
        onDragStart={e => onDragStart?.(e, rowIdx, col.key, value)}
        onDragOver={e => onDragOver?.(e)}
        onDrop={e => onDrop?.(e, rowIdx, col.key)}
        className={`${base} text-right cursor-grab active:cursor-grabbing`}
      />
    );
  }

  // ── Text / Email ──────────────────────────────────────────────────────────
  return (
    <input
      ref={cellRef}
      type={col.type === "email" ? "email" : "text"}
      value={value ?? ""}
      onChange={e => {
        const v = col.type === "email"
          ? e.target.value.toLowerCase()
          : e.target.value.toUpperCase();
        onChange(col.key, v);
      }}
      onKeyDown={onKeyDown}
      className={`${base} uppercase`}
    />
  );
}