/**
 * RatesPanel.jsx
 *
 * Slide-in panel for viewing/editing salary & overtime calculated rates per row.
 * Mirrors ContractForm's Salary and Overtime sections exactly:
 *   - Auto-calculated from feePerDay using the rate engine
 *   - Editable Budget Code and Tag per row
 *   - Shows Rate / Hol / Gross columns
 *   - Overtime mode badge (CALCULATED vs CUSTOM)
 */

import { useMemo } from "react";
import { X, TrendingUp } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { calculateRates, defaultEngineSettings, formatCurrency, formatRateHol } from "../../utils/rateCalculations";
import { cn } from "../../../../shared/config/utils";

const CS_MAP = { GBP: "£", USD: "$", EUR: "€", AUD: "A$", CAD: "C$", NZD: "NZ$", DKK: "kr", ISK: "kr" };

function updateArr(arr, i, value) {
  const u = [...(arr || [])];
  u[i] = value.toUpperCase();
  return u;
}

// ─── Salary Table ─────────────────────────────────────────────────────────────

function SalaryTable({ rows, budgetCodes, tags, onBudgetCodeChange, onTagChange, cs }) {
  if (!rows?.length) return (
    <p className="text-[11px] text-muted-foreground px-1 py-3 text-center">
      Enter a Fee/Day to see calculated salary rates.
    </p>
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-border bg-purple-50/60">
            <th className="text-left px-2 py-1.5 text-purple-600 font-medium text-[10px] uppercase tracking-wider">Item</th>
            <th className="text-left px-2 py-1.5 text-purple-600 font-medium text-[10px] uppercase tracking-wider">Budget Code</th>
            <th className="text-left px-2 py-1.5 text-purple-600 font-medium text-[10px] uppercase tracking-wider">Tag</th>
            <th className="text-right px-2 py-1.5 text-purple-600 font-medium text-[10px] uppercase tracking-wider">Rate / Hol</th>
            <th className="text-right px-2 py-1.5 text-purple-600 font-medium text-[10px] uppercase tracking-wider">Gross</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={cn(
              "border-b border-border/40 hover:bg-accent/10",
              i % 2 === 0 ? "bg-white" : "bg-purple-50/20"
            )}>
              <td className="px-2 py-1 text-foreground/80 whitespace-nowrap">{row.item}</td>
              <td className="px-1 py-0.5">
                <input
                  type="text"
                  value={budgetCodes[i] || ""}
                  onChange={e => onBudgetCodeChange(updateArr(budgetCodes, i, e.target.value))}
                  placeholder="CODE"
                  className="w-full bg-transparent border border-transparent hover:border-primary/40 focus:border-primary focus:outline-none rounded px-1 py-0.5 text-[10px] font-mono text-muted-foreground uppercase transition-colors"
                />
              </td>
              <td className="px-1 py-0.5">
                <input
                  type="text"
                  value={tags[i] || ""}
                  onChange={e => onTagChange(updateArr(tags, i, e.target.value))}
                  placeholder="TAG"
                  className="w-full bg-transparent border border-transparent hover:border-primary/40 focus:border-primary focus:outline-none rounded px-1 py-0.5 text-[10px] text-muted-foreground uppercase transition-colors"
                />
              </td>
              <td className="px-2 py-1 text-right text-foreground/80 whitespace-nowrap tabular-nums">
                {formatRateHol(row.rate, row.hol, cs)}
              </td>
              <td className="px-2 py-1 text-right text-emerald-600 font-semibold whitespace-nowrap tabular-nums">
                {formatCurrency(row.gross, cs)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Overtime Table ───────────────────────────────────────────────────────────

function OvertimeTable({ rows, budgetCodes, tags, onBudgetCodeChange, onTagChange, cs, overtimeMode }) {
  if (!rows?.length) return (
    <p className="text-[11px] text-muted-foreground px-1 py-3 text-center">
      Enter a Fee/Day to see calculated overtime rates.
    </p>
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-border bg-purple-50/60">
            <th className="text-left px-2 py-1.5 text-purple-600 font-medium text-[10px] uppercase tracking-wider">Item</th>
            <th className="text-left px-2 py-1.5 text-purple-600 font-medium text-[10px] uppercase tracking-wider">Budget Code</th>
            <th className="text-left px-2 py-1.5 text-purple-600 font-medium text-[10px] uppercase tracking-wider">Tag</th>
            <th className="text-right px-2 py-1.5 text-purple-600 font-medium text-[10px] uppercase tracking-wider">Rate / Hol</th>
            <th className="text-right px-2 py-1.5 text-purple-600 font-medium text-[10px] uppercase tracking-wider">Gross</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={cn(
              "border-b border-border/40 hover:bg-accent/20",
              i % 2 === 0 ? "bg-white" : "bg-purple-50/20"
            )}>
              <td className="px-2 py-1 text-foreground/80 whitespace-nowrap">{row.item}</td>
              <td className="px-1 py-0.5">
                <input
                  type="text"
                  value={budgetCodes[i] || ""}
                  onChange={e => onBudgetCodeChange(updateArr(budgetCodes, i, e.target.value))}
                  placeholder="CODE"
                  className="w-full bg-transparent border border-transparent hover:border-primary/40 focus:border-primary focus:outline-none rounded px-1 py-0.5 text-[10px] font-mono text-muted-foreground uppercase transition-colors"
                />
              </td>
              <td className="px-1 py-0.5">
                <input
                  type="text"
                  value={tags[i] || ""}
                  onChange={e => onTagChange(updateArr(tags, i, e.target.value))}
                  placeholder="TAG"
                  className="w-full bg-transparent border border-transparent hover:border-primary/40 focus:border-primary focus:outline-none rounded px-1 py-0.5 text-[10px] text-muted-foreground uppercase transition-colors"
                />
              </td>
              <td className="px-2 py-1 text-right text-foreground/80 whitespace-nowrap tabular-nums">
                {formatRateHol(row.rate, row.hol, cs)}
              </td>
              <td className="px-2 py-1 text-right text-emerald-600 font-semibold whitespace-nowrap tabular-nums">
                {formatCurrency(row.gross, cs)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main RatesPanel ──────────────────────────────────────────────────────────

export function RatesPanel({ row, onClose, onUpdate }) {
  const cs = CS_MAP[row.currency] || "£";

  const calculatedRates = useMemo(() => {
    const fee = parseFloat(row.feePerDay) || 0;
    const settings = {
      ...defaultEngineSettings,
      standardHoursPerDay: row.workingHours ?? 11,
    };
    return calculateRates(fee, settings);
  }, [row.feePerDay, row.workingHours]);

  const salaryBudgetCodes   = row.salaryBudgetCodes   || [];
  const salaryTags          = row.salaryTags          || [];
  const overtimeBudgetCodes = row.overtimeBudgetCodes || [];
  const overtimeTags        = row.overtimeTags        || [];

  const feeDisplay = row.feePerDay
    ? `${cs}${parseFloat(row.feePerDay).toFixed(2)}/day`
    : "No fee entered";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50">
      <div className="h-full w-full max-w-[600px] bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Salary & Overtime Rates
            </h2>
            <p className="text-[10px] text-muted-foreground truncate max-w-[400px]">
              {row.recipient?.fullName || "New row"} · {feeDisplay}
              {row.workingHours && ` · ${row.workingHours}hrs/day threshold`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Fee notice ── */}
        {!row.feePerDay && (
          <div className="mx-3 mt-3 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            <p className="text-[11px] text-amber-700">
              ⚠ Enter a Fee/Day in the spreadsheet to see calculated rates. Rates update automatically.
            </p>
          </div>
        )}

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">

          {/* ── Salary Section ── */}
          <div className="bg-white rounded-xl border border-purple-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="bg-purple-700 px-3 py-1.5 flex items-center justify-between">
              <p className="text-white text-[10px] font-semibold tracking-wide">Salary</p>
              <span className="text-purple-200 text-[9px]">{calculatedRates.salary.length} items</span>
            </div>
            <SalaryTable
              rows={calculatedRates.salary}
              budgetCodes={salaryBudgetCodes}
              tags={salaryTags}
              onBudgetCodeChange={v => onUpdate(row.id, "salaryBudgetCodes", v)}
              onTagChange={v => onUpdate(row.id, "salaryTags", v)}
              cs={cs}
            />
          </div>

          {/* ── Overtime Section ── */}
          <div className="bg-white rounded-xl border border-purple-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="bg-purple-700 px-3 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <p className="text-white text-[10px] font-semibold tracking-wide">Overtime</p>
                <span className={`text-[7px] px-1.5 py-px rounded font-semibold tracking-wider ${
                  row.overtime === "custom"
                    ? "bg-amber-400/90 text-amber-900"
                    : "bg-purple-500/60 text-purple-100"
                }`}>
                  {row.overtime === "custom" ? "CUSTOM" : "CALCULATED"}
                </span>
              </div>
              <span className="text-purple-200 text-[9px]">{calculatedRates.overtime.length} items</span>
            </div>
            <OvertimeTable
              rows={calculatedRates.overtime}
              budgetCodes={overtimeBudgetCodes}
              tags={overtimeTags}
              onBudgetCodeChange={v => onUpdate(row.id, "overtimeBudgetCodes", v)}
              onTagChange={v => onUpdate(row.id, "overtimeTags", v)}
              cs={cs}
              overtimeMode={row.overtime}
            />
          </div>

          <p className="text-[10px] text-muted-foreground px-1">
            Budget Codes and Tags are editable above and will be included in the offer payload.
            Rates recalculate automatically when Fee/Day or Standard Hours changes in the spreadsheet.
          </p>
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 px-4 py-3 border-t border-border bg-card">
          <Button onClick={onClose} className="w-full h-8 text-[12px]">Done</Button>
        </div>
      </div>
    </div>
  );
}