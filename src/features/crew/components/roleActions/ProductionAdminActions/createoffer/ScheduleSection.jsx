// sections/ScheduleSection.jsx
import { useMemo } from "react";
import { parseISO, isValid, eachDayOfInterval, isWithinInterval } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import EditableDateField from "../../../../../../shared/components/wrappers/EditableDateField";
import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";

function calcTotalDays(sched) {
  const { blocks = [], hiatus = [] } = sched;
  const hiatusIntervals = hiatus
    .filter((h) => h.start && h.end)
    .map((h) => ({ start: parseISO(h.start), end: parseISO(h.end) }))
    .filter((iv) => isValid(iv.start) && isValid(iv.end));
  let total = 0;
  for (const block of blocks) {
    if (!block.start || !block.end) continue;
    const s = parseISO(block.start);
    const e = parseISO(block.end);
    if (!isValid(s) || !isValid(e) || e < s) continue;
    for (const day of eachDayOfInterval({ start: s, end: e })) {
      if (!hiatusIntervals.some((iv) => isWithinInterval(day, iv))) total += 1;
    }
  }
  return total;
}

// Converts ISO string from EditableDateField back to yyyy-MM-dd
const toDateStr = (iso) => (iso ? iso.slice(0, 10) : "");

function DateRangeRow({ startValue, endValue, onStartChange, onEndChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <EditableDateField label="Start" value={startValue} isEditing onChange={(v) => onStartChange(toDateStr(v))} placeholder="Start date" />
      <EditableDateField label="End"   value={endValue}   isEditing onChange={(v) => onEndChange(toDateStr(v))}   placeholder="End date"   />
    </div>
  );
}

export function ScheduleSection({ schedule, setSchedule }) {
  const sched = schedule;

  const updateSched = (patch) => {
    const next = { ...sched, ...patch };
    next.totalDays = calcTotalDays(next);
    setSchedule(next);
  };

  const setPrePrep  = (field, val) => updateSched({ prePrep: { ...sched.prePrep, [field]: val } });
  const setWrap     = (field, val) => updateSched({ wrap:    { ...sched.wrap,    [field]: val } });

  const addHiatus    = () => updateSched({ hiatus: [...(sched.hiatus || []), { start: "", end: "", reason: "" }] });
  const removeHiatus = (i) => { const n = [...(sched.hiatus || [])]; n.splice(i, 1); updateSched({ hiatus: n }); };
  const setHiatus    = (i, field, val) => {
    const n = [...(sched.hiatus || [])];
    n[i] = { ...n[i], [field]: typeof val === "string" ? val.toUpperCase() : val };
    updateSched({ hiatus: n });
  };

  const addBlock = () => {
    const idx = (sched.blocks || []).length + 1;
    updateSched({ blocks: [...(sched.blocks || []), { name: `BLOCK ${idx}`, prep: { start: "", end: "", notes: "" }, start: "", end: "", notes: "" }] });
  };
  const removeBlock  = (i) => { const n = [...(sched.blocks || [])]; n.splice(i, 1); updateSched({ blocks: n }); };
  const setBlock     = (i, field, val) => {
    const n = [...(sched.blocks || [])];
    n[i] = { ...n[i], [field]: typeof val === "string" ? val.toUpperCase() : val };
    updateSched({ blocks: n });
  };
  const setBlockPrep = (i, field, val) => {
    const n = [...(sched.blocks || [])];
    n[i] = { ...n[i], prep: { ...n[i].prep, [field]: val } };
    updateSched({ blocks: n });
  };

  const schedTotalDays = useMemo(() => calcTotalDays(sched), [sched]);

  const prePrepDays = useMemo(() => {
    const s = sched.prePrep?.start ? parseISO(sched.prePrep.start) : null;
    const e = sched.prePrep?.end   ? parseISO(sched.prePrep.end)   : null;
    return s && e && isValid(s) && isValid(e) && e >= s
      ? eachDayOfInterval({ start: s, end: e }).length : null;
  }, [sched.prePrep?.start, sched.prePrep?.end]);

  return (
    <div className="space-y-4">

      {/* ── Hiatus ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground/80">Hiatus periods</span>
          <Button type="button" variant="outline" size="sm" onClick={addHiatus}
            className="h-7 text-[10px] gap-1 border-primary/30 text-primary hover:bg-primary/10">
            <Plus className="h-3 w-3" /> Add hiatus
          </Button>
        </div>
        {(sched.hiatus || []).map((h, i) => (
          <div key={i} className="border border-border rounded-lg p-3 space-y-3 bg-accent/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">Hiatus {i + 1}</span>
              <button type="button" onClick={() => removeHiatus(i)} className="text-destructive/60 hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <DateRangeRow
              startValue={h.start} onStartChange={(v) => setHiatus(i, "start", v)}
              endValue={h.end}     onEndChange={(v) => setHiatus(i, "end", v)}
            />
            <EditableTextDataField
              label="Reason (optional)"
              value={h.reason ?? ""}
              isEditing
              onChange={(v) => setHiatus(i, "reason", v)}
              placeholder="e.g. CHRISTMAS BREAK"
            />
          </div>
        ))}
      </div>

      {/* ── Pre-Prep ── */}
      <div className="border border-border rounded-lg p-3 space-y-3 bg-accent/5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">Pre Prep</span>
          {prePrepDays !== null && (
            <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-foreground/70">
              {prePrepDays} days
            </span>
          )}
        </div>
        <DateRangeRow
          startValue={sched.prePrep?.start ?? ""} onStartChange={(v) => setPrePrep("start", v)}
          endValue={sched.prePrep?.end ?? ""}     onEndChange={(v) => setPrePrep("end", v)}
        />
        <EditableTextDataField
          label="Notes"
          value={sched.prePrep?.notes ?? ""}
          isEditing
          onChange={(v) => setPrePrep("notes", v)}
          placeholder="PRE PREP NOTES..."
          multiline
        />
      </div>

      {/* ── Blocks ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground/80">Shoot / work blocks</span>
          <Button type="button" variant="outline" size="sm" onClick={addBlock}
            className="h-7 text-[10px] gap-1 border-primary/30 text-primary hover:bg-primary/10">
            <Plus className="h-3 w-3" /> Add block
          </Button>
        </div>
        {(sched.blocks || []).map((block, i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-primary/5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <EditableTextDataField
                  value={block.name ?? `BLOCK ${i + 1}`}
                  isEditing
                  onChange={(v) => setBlock(i, "name", v)}
                  inputClassName="h-6 bg-transparent border-transparent text-[11px] font-semibold text-primary p-0 w-28"
                />
              </div>
              <button type="button" onClick={() => removeBlock(i)} className="text-destructive/60 hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="p-3 space-y-3">
              {/* Prep sub-block */}
              <div className="space-y-2 pl-2 border-l-2 border-primary/20">
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Prep {i + 1}</span>
                <DateRangeRow
                  startValue={block.prep?.start ?? ""} onStartChange={(v) => setBlockPrep(i, "start", v)}
                  endValue={block.prep?.end ?? ""}     onEndChange={(v) => setBlockPrep(i, "end", v)}
                />
                <EditableTextDataField
                  label="Notes"
                  value={block.prep?.notes ?? ""}
                  isEditing
                  onChange={(v) => setBlockPrep(i, "notes", v)}
                  placeholder={`PREP ${i + 1} NOTES...`}
                />
              </div>
              {/* Shoot block */}
              <div className="space-y-2 pl-2 border-l-2 border-primary/40">
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Block {i + 1}</span>
                <DateRangeRow
                  startValue={block.start ?? ""} onStartChange={(v) => setBlock(i, "start", v)}
                  endValue={block.end ?? ""}     onEndChange={(v) => setBlock(i, "end", v)}
                />
                <EditableTextDataField
                  label="Notes"
                  value={block.notes ?? ""}
                  isEditing
                  onChange={(v) => setBlock(i, "notes", v)}
                  placeholder={`BLOCK ${i + 1} NOTES...`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Wrap ── */}
      <div className="border border-border rounded-lg p-3 space-y-3 bg-accent/5">
        <span className="text-[10px] font-semibold text-primary uppercase tracking-wide block">Wrap</span>
        <DateRangeRow
          startValue={sched.wrap?.start ?? ""} onStartChange={(v) => setWrap("start", v)}
          endValue={sched.wrap?.end ?? ""}     onEndChange={(v) => setWrap("end", v)}
        />
        <EditableTextDataField
          label="Notes"
          value={sched.wrap?.notes ?? ""}
          isEditing
          onChange={(v) => setWrap("notes", v)}
          placeholder="WRAP NOTES..."
          multiline
        />
      </div>

      {/* ── Total Days ── */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
        <span className="text-xs font-medium text-foreground/80">
          Total working days
          <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">(excl. hiatus)</span>
        </span>
        <span className="text-sm font-bold text-primary tabular-nums">
          {schedTotalDays > 0 ? schedTotalDays : "—"}
        </span>
      </div>
    </div>
  );
}