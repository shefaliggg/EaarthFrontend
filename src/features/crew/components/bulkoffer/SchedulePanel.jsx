/**
 * SchedulePanel.jsx
 *
 * Slide-in panel for editing per-row schedule in BulkOfferCreate.
 * All fields identical to ContractForm schedule section.
 * Includes: hiatus periods, pre-prep, shoot/work blocks, wrap, total days.
 */

import { useState } from "react";
import { format, eachDayOfInterval, isWithinInterval, parseISO, isValid } from "date-fns";
import { Plus, Trash2, X, CalendarIcon, CalendarDays } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { cn } from "../../../../shared/config/utils";

// ─── Date helpers ─────────────────────────────────────────────────────────────

function calcTotalDays(sched) {
  const { blocks = [], hiatus = [] } = sched;
  const hiatusIntervals = hiatus
    .filter(h => h.start && h.end)
    .map(h => ({ start: parseISO(h.start), end: parseISO(h.end) }))
    .filter(iv => isValid(iv.start) && isValid(iv.end));

  let total = 0;
  for (const block of blocks) {
    if (!block.start || !block.end) continue;
    const s = parseISO(block.start);
    const e = parseISO(block.end);
    if (!isValid(s) || !isValid(e) || e < s) continue;
    for (const day of eachDayOfInterval({ start: s, end: e })) {
      if (!hiatusIntervals.some(iv => isWithinInterval(day, iv))) total += 1;
    }
  }
  return total;
}

// ─── Simple inline date input (no Popover dependency needed in panel) ─────────

function DateInput({ value, onChange, label }) {
  const parsed = value ? parseISO(value) : undefined;
  const validDate = parsed && isValid(parsed) ? parsed : undefined;

  return (
    <div className="space-y-0.5">
      {label && (
        <label className="text-[10px] text-muted-foreground uppercase tracking-wide block">
          {label}
        </label>
      )}
      <div className="relative">
        <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
        <input
          type="date"
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          className="w-full border border-border rounded px-2 pl-6 py-1 text-[11px] bg-input focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
      </div>
      {validDate && (
        <span className="text-[9px] text-muted-foreground">
          {format(validDate, "dd MMM yyyy")}
        </span>
      )}
    </div>
  );
}

function DateRangeRow({ startValue, endValue, onStartChange, onEndChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <DateInput value={startValue} onChange={onStartChange} label="Start" />
      <DateInput value={endValue}   onChange={onEndChange}   label="End" />
    </div>
  );
}

function TextInput({ value, onChange, placeholder = "", className = "" }) {
  return (
    <input
      value={value ?? ""}
      onChange={e => onChange(e.target.value.toUpperCase())}
      placeholder={placeholder}
      className={cn(
        "w-full border border-border rounded px-2 py-1 text-[11px] bg-input uppercase focus:outline-none focus:ring-1 focus:ring-primary/40",
        className
      )}
    />
  );
}

// ─── Main SchedulePanel ───────────────────────────────────────────────────────

export function SchedulePanel({ row, onClose, onUpdate }) {
  const sched = row.schedule || {
    hiatus: [{ start: "", end: "", reason: "" }],
    prePrep: { start: "", end: "", notes: "" },
    blocks: [{ name: "BLOCK 1", prep: { start: "", end: "", notes: "" }, start: "", end: "", notes: "" }],
    wrap: { start: "", end: "", notes: "" },
    totalDays: 0,
  };

  const updateSched = (patch) => {
    const next = { ...sched, ...patch };
    next.totalDays = calcTotalDays(next);
    onUpdate(row.id, "schedule", next);
  };

  // Hiatus
  const addHiatus = () =>
    updateSched({ hiatus: [...(sched.hiatus || []), { start: "", end: "", reason: "" }] });

  const removeHiatus = i => {
    const n = [...(sched.hiatus || [])]; n.splice(i, 1); updateSched({ hiatus: n });
  };

  const setHiatus = (i, field, val) => {
    const n = [...(sched.hiatus || [])];
    n[i] = { ...n[i], [field]: val };
    updateSched({ hiatus: n });
  };

  // Pre-Prep
  const setPrePrep = (field, val) =>
    updateSched({ prePrep: { ...sched.prePrep, [field]: val } });

  // Blocks
  const addBlock = () => {
    const idx = (sched.blocks || []).length + 1;
    updateSched({
      blocks: [...(sched.blocks || []), {
        name: `BLOCK ${idx}`,
        prep: { start: "", end: "", notes: "" },
        start: "", end: "", notes: "",
      }],
    });
  };

  const removeBlock = i => {
    const n = [...(sched.blocks || [])]; n.splice(i, 1); updateSched({ blocks: n });
  };

  const setBlock = (i, field, val) => {
    const n = [...(sched.blocks || [])];
    n[i] = { ...n[i], [field]: val };
    updateSched({ blocks: n });
  };

  const setBlockPrep = (i, field, val) => {
    const n = [...(sched.blocks || [])];
    n[i] = { ...n[i], prep: { ...n[i].prep, [field]: val } };
    updateSched({ blocks: n });
  };

  // Wrap
  const setWrap = (field, val) =>
    updateSched({ wrap: { ...sched.wrap, [field]: val } });

  const totalDays = calcTotalDays(sched);

  // Pre-prep day count
  const prePrepDays = (() => {
    const s = sched.prePrep?.start ? parseISO(sched.prePrep.start) : null;
    const e = sched.prePrep?.end   ? parseISO(sched.prePrep.end)   : null;
    return s && e && isValid(s) && isValid(e) && e >= s
      ? eachDayOfInterval({ start: s, end: e }).length : null;
  })();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50">
      <div className="h-full w-full max-w-[540px] bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Schedule
            </h2>
            <p className="text-[10px] text-muted-foreground truncate max-w-[380px]">
              {row.recipient?.fullName || "New row"}
              {totalDays > 0 && ` · ${totalDays} working day${totalDays !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">

          {/* ── Hiatus ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground/80">Hiatus periods</label>
              <button
                onClick={addHiatus}
                className="flex items-center gap-1 text-[10px] text-primary border border-primary/30 rounded px-2 py-1 hover:bg-primary/10 transition-colors"
              >
                <Plus className="h-3 w-3" /> Add hiatus
              </button>
            </div>
            {(sched.hiatus || []).map((h, i) => (
              <div key={i} className="border border-border rounded-lg p-2 space-y-2 bg-accent/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
                    Hiatus {i + 1}
                  </span>
                  <button
                    onClick={() => removeHiatus(i)}
                    className="text-destructive/60 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <DateRangeRow
                  startValue={h.start} onStartChange={v => setHiatus(i, "start", v)}
                  endValue={h.end}     onEndChange={v => setHiatus(i, "end", v)}
                />
                <div className="space-y-0.5">
                  <label className="text-[10px] text-muted-foreground">Reason (optional)</label>
                  <TextInput
                    value={h.reason}
                    onChange={v => setHiatus(i, "reason", v)}
                    placeholder="e.g. CHRISTMAS BREAK"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── Pre-Prep ── */}
          <div className="border border-border rounded-lg p-2 space-y-2 bg-accent/5">
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wide block">
              Pre Prep
            </span>
            <DateRangeRow
              startValue={sched.prePrep?.start ?? ""} onStartChange={v => setPrePrep("start", v)}
              endValue={sched.prePrep?.end ?? ""}     onEndChange={v => setPrePrep("end", v)}
            />
            {prePrepDays !== null && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">Total days</span>
                <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-foreground/70">
                  {prePrepDays}
                </span>
              </div>
            )}
            <TextInput
              value={sched.prePrep?.notes}
              onChange={v => setPrePrep("notes", v)}
              placeholder="PRE PREP NOTES..."
            />
          </div>

          {/* ── Blocks ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground/80">Shoot / work blocks</label>
              <button
                onClick={addBlock}
                className="flex items-center gap-1 text-[10px] text-primary border border-primary/30 rounded px-2 py-1 hover:bg-primary/10 transition-colors"
              >
                <Plus className="h-3 w-3" /> Add block
              </button>
            </div>
            {(sched.blocks || []).map((block, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-primary/5 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <input
                      value={block.name ?? `BLOCK ${i + 1}`}
                      onChange={e => setBlock(i, "name", e.target.value.toUpperCase())}
                      className="h-6 bg-transparent border-transparent text-[11px] font-semibold text-primary focus:outline-none w-28 uppercase"
                    />
                  </div>
                  <button
                    onClick={() => removeBlock(i)}
                    className="text-destructive/60 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="p-2 space-y-2">
                  {/* Prep */}
                  <div className="space-y-1.5 pl-2 border-l-2 border-primary/20">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                      Prep {i + 1}
                    </span>
                    <DateRangeRow
                      startValue={block.prep?.start ?? ""} onStartChange={v => setBlockPrep(i, "start", v)}
                      endValue={block.prep?.end ?? ""}     onEndChange={v => setBlockPrep(i, "end", v)}
                    />
                    <TextInput
                      value={block.prep?.notes}
                      onChange={v => setBlockPrep(i, "notes", v)}
                      placeholder={`PREP ${i + 1} NOTES...`}
                    />
                  </div>
                  {/* Block */}
                  <div className="space-y-1.5 pl-2 border-l-2 border-primary/40">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                      Block {i + 1}
                    </span>
                    <DateRangeRow
                      startValue={block.start ?? ""} onStartChange={v => setBlock(i, "start", v)}
                      endValue={block.end ?? ""}     onEndChange={v => setBlock(i, "end", v)}
                    />
                    <TextInput
                      value={block.notes}
                      onChange={v => setBlock(i, "notes", v)}
                      placeholder={`BLOCK ${i + 1} NOTES...`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Wrap ── */}
          <div className="border border-border rounded-lg p-2 space-y-2 bg-accent/5">
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wide block">Wrap</span>
            <DateRangeRow
              startValue={sched.wrap?.start ?? ""} onStartChange={v => setWrap("start", v)}
              endValue={sched.wrap?.end ?? ""}     onEndChange={v => setWrap("end", v)}
            />
            <TextInput
              value={sched.wrap?.notes}
              onChange={v => setWrap("notes", v)}
              placeholder="WRAP NOTES..."
            />
          </div>

          {/* ── Total Days ── */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
            <span className="text-xs font-medium text-foreground/80">
              Total working days
              <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">(excl. hiatus)</span>
            </span>
            <span className="text-sm font-bold text-primary tabular-nums">
              {totalDays > 0 ? totalDays : "—"}
            </span>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 px-4 py-3 border-t border-border bg-card">
          <Button onClick={onClose} className="w-full h-8 text-[12px]">Done</Button>
        </div>
      </div>
    </div>
  );
}