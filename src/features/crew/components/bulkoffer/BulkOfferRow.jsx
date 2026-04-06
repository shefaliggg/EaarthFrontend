/**
 * BulkOfferRow.jsx
 *
 * Renders a single data row across both frozen and scrollable column areas.
 *
 * UPDATED:
 *   - BulkOfferFrozenRow: Added rates button (TrendingUp) and schedule button (CalendarDays)
 *   - BulkOfferScrollRow: Passes onOpenRates, onOpenSchedule, onOpenStipulations to BulkOfferCell
 */

import { Copy, Plus, Trash2, Package, Info, CheckCircle, AlertCircle, TrendingUp, CalendarDays } from "lucide-react";
import { Checkbox } from "../../../../shared/components/ui/checkbox";
import { Badge }    from "../../../../shared/components/ui/badge";
import { BulkOfferCell } from "../../components/bulkoffer/BulkOfferCell";

const ROW_H = 34;

// ── Frozen (left) row ─────────────────────────────────────────────────────────
export function BulkOfferFrozenRow({
  row,
  rowIdx,
  isLast,
  frozenCols,
  onToggleSelect,
  onAddRowBelow,
  onDuplicate,
  onOpenAllowances,
  onOpenRates,
  onOpenSchedule,
  onOpenStipulations,
  onRemove,
  valid,
  errors,
}) {
  const enabledAllowances = Object.values(row.allowances || {}).filter(a => a?.enabled).length;
  const hasSchedule = (row.schedule?.blocks || []).some(b => b.start && b.end) || row.schedule?.totalDays > 0;
  const hasFee = row.feePerDay && parseFloat(row.feePerDay) > 0;
  const stipCount = row.specialStipulations?.length || 0;

  return (
    <div
      className={[
        "flex border-b border-border/60 transition-colors",
        row._selected
          ? "bg-primary/5"
          : rowIdx % 2 === 0 ? "bg-card" : "bg-muted/20",
      ].join(" ")}
      style={{ height: ROW_H }}
    >
      {/* Select */}
      <div
        className="flex items-center justify-center border-r border-border/60"
        style={{ width: frozenCols[0]?.width ?? 40, minWidth: frozenCols[0]?.width ?? 40 }}
      >
        <Checkbox
          checked={!!row._selected}
          onCheckedChange={() => onToggleSelect(row.id)}
        />
      </div>

      {/* Actions */}
      <div
        className="flex items-center justify-center gap-0.5 border-r border-border/60"
        style={{ width: frozenCols[1]?.width ?? 116, minWidth: frozenCols[1]?.width ?? 116 }}
      >
        <button
          title="Add row below"
          onClick={() => onAddRowBelow(row.id)}
          className="p-1 rounded hover:bg-primary/10 text-primary"
        >
          <Plus className="w-3 h-3" />
        </button>
        <button
          title="Duplicate (Ctrl+D)"
          onClick={() => onDuplicate(row.id)}
          className="p-1 rounded hover:bg-primary/10 text-primary"
        >
          <Copy className="w-3 h-3" />
        </button>

        {/* Rates button */}
        <button
          title="Salary & Overtime Rates"
          onClick={() => onOpenRates?.(row.id)}
          className={[
            "p-1 rounded relative transition-colors",
            hasFee
              ? "text-purple-600 hover:bg-purple-50"
              : "text-muted-foreground hover:bg-muted",
          ].join(" ")}
        >
          <TrendingUp className="w-3 h-3" />
          {hasFee && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-purple-500" />
          )}
        </button>

        {/* Schedule button */}
        <button
          title="Schedule"
          onClick={() => onOpenSchedule?.(row.id)}
          className={[
            "p-1 rounded relative transition-colors",
            hasSchedule
              ? "text-sky-600 hover:bg-sky-50"
              : "text-muted-foreground hover:bg-muted",
          ].join(" ")}
        >
          <CalendarDays className="w-3 h-3" />
          {hasSchedule && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-sky-500" />
          )}
        </button>

        {/* Allowances button */}
        <button
          title="Allowances"
          onClick={() => onOpenAllowances(row.id)}
          className={[
            "p-1 rounded relative transition-colors",
            enabledAllowances > 0
              ? "text-rose-600 hover:bg-rose-50"
              : "text-muted-foreground hover:bg-muted",
          ].join(" ")}
        >
          <Package className="w-3 h-3" />
          {enabledAllowances > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] flex items-center justify-center font-bold">
              {enabledAllowances}
            </span>
          )}
        </button>

        {/* Stipulations button */}
        <button
          title="Special Stipulations"
          onClick={() => onOpenStipulations(row.id)}
          className="p-1 rounded hover:bg-amber-100 text-amber-600 relative"
        >
          <Info className="w-3 h-3" />
          {stipCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        {/* Remove */}
        <button
          title="Remove"
          onClick={() => onRemove(row.id)}
          disabled={isLast}
          className="p-1 rounded hover:bg-destructive/10 text-destructive disabled:opacity-30"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Status */}
      <div
        className="flex items-center justify-center border-r border-border/60 px-1"
        style={{ width: frozenCols[2]?.width ?? 110, minWidth: frozenCols[2]?.width ?? 110 }}
      >
        {valid ? (
          <Badge
            variant="outline"
            className="gap-1 text-[9px] text-green-700 border-green-300 bg-green-50 h-5 px-1.5"
          >
            <CheckCircle className="w-2.5 h-2.5" /> Ready
          </Badge>
        ) : (
          <span
            title={errors.join("\n")}
            className="flex items-center gap-0.5 text-[9px] text-orange-700 bg-orange-50 border border-orange-300 rounded-full px-1.5 h-5 truncate max-w-full"
          >
            <AlertCircle className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">{errors[0]}</span>
          </span>
        )}
      </div>
    </div>
  );
}

// ── Scrollable (right) row ────────────────────────────────────────────────────
export function BulkOfferScrollRow({
  row,
  rowIdx,
  scrollableCols,
  onCellChange,
  onKeyDown,
  cellRefsObj,
  valid,
  onDragStart,
  onDragOver,
  onDrop,
  onOpenAllowances,
  onOpenRates,
  onOpenSchedule,
  onOpenStipulations,
}) {
  return (
    <div
      className={[
        "flex border-b border-border/60 transition-colors",
        row._selected
          ? "bg-primary/5"
          : rowIdx % 2 === 0 ? "bg-card" : "bg-muted/20",
      ].join(" ")}
      style={{ height: ROW_H }}
    >
      {scrollableCols.map((col, colIdx) => {
        const value   = col.key.split(".").reduce((acc, k) => acc?.[k], row);
        const invalid = !valid && col.required && !value;

        return (
          <div
            key={col.key}
            className={["border-r border-border/60 relative", invalid ? "bg-red-50/40" : ""].join(" ")}
            style={{ width: col.width, minWidth: col.width, height: ROW_H }}
          >
            <BulkOfferCell
              col={col}
              value={value}
              row={row}
              onChange={(path, val) => onCellChange(row.id, path, val)}
              onKeyDown={e => onKeyDown(e, rowIdx, colIdx)}
              cellRef={el => { if (el) cellRefsObj.current[`${rowIdx}-${colIdx}`] = el; }}
              invalid={invalid}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              rowIdx={rowIdx}
              colIdx={colIdx}
              onOpenAllowances={onOpenAllowances}
              onOpenRates={onOpenRates}
              onOpenSchedule={onOpenSchedule}
              onOpenStipulations={onOpenStipulations}
            />
          </div>
        );
      })}
    </div>
  );
}