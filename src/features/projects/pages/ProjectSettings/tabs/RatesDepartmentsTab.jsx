import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleCheck, Shield, Sparkles, Lock, Unlock, ArrowRight, Plus, Trash2,
} from "lucide-react";
import { cn } from "@/shared/config/utils";

/* ─────────────────────────────────────────────────────────
   STORAGE HELPERS
───────────────────────────────────────────────────────── */
function loadSettings(projectId, key, fallbackValue) {
  const stored = localStorage.getItem(`${key}-${projectId}`);
  return stored ? JSON.parse(stored) : fallbackValue;
}
function saveSettings(projectId, key, value) {
  localStorage.setItem(`${key}-${projectId}`, JSON.stringify(value));
}

/* ─────────────────────────────────────────────────────────
   TAB HEADER
───────────────────────────────────────────────────────── */
function TabHeader({ label, progressPercentage, color, locked }) {
  const strokeWidth = 3;
  const radius = (40 - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className={cn("relative flex items-center justify-between p-4 rounded-2xl overflow-hidden", locked && "bg-mint-100 dark:bg-mint-900/30")}
      style={!locked ? { backgroundColor: `${color}15` } : undefined}
    >
      {locked && (
        <motion.div className="absolute h-full w-1/3 opacity-20"
          style={{ background: "linear-gradient(90deg, transparent, #22c55e66, transparent)" }}
          animate={{ x: ["-100%", "300%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
      )}
      <div className="flex items-center gap-4">
        <div style={{ width: 40, height: 40 }} className="relative inline-flex items-center justify-center">
          <svg width="40" height="40" className="-rotate-90">
            <circle cx="20" cy="20" r={radius} strokeWidth={strokeWidth} className="fill-none stroke-muted" />
            <motion.circle cx="20" cy="20" r={radius} fill="none" strokeWidth={strokeWidth} strokeLinecap="round"
              stroke={locked ? "#22c55e" : color} strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - (progressPercentage / 100) * circumference }}
              transition={{ duration: 0.8 }} />
          </svg>
          <div className="absolute flex items-center justify-center">
            {locked ? <CircleCheck className="w-5 h-5 text-emerald-500" /> : <span className="text-xs font-medium tabular-nums">{progressPercentage}%</span>}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-foreground font-medium text-[0.95rem]">{label}</h2>
          {locked ? (
            <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[0.56rem] rounded-full bg-emerald-50 dark:bg-emerald-900/30">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600">Locked &amp; verified</span>
            </motion.span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[0.56rem] text-muted-foreground">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              Auto-saving changes
            </span>
          )}
        </div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed"
        style={{ borderColor: `${color}30`, backgroundColor: `${color}05`, fontSize: "0.56rem", color }}>
        <Sparkles className="w-3.5 h-3.5" />
        Fill required fields to continue
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   ACTION FOOTER
───────────────────────────────────────────────────────── */
function ActionFooter({ locked, onLock, color, progressPercentage }) {
  const canLock = progressPercentage >= 100;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }} className="mb-2 rounded-2xl overflow-hidden">
      <div className="relative bg-card rounded-2xl border border-gray-100/80 dark:border-gray-800/60 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div className="w-2 h-2 rounded-full" style={{ backgroundColor: locked ? "#22c55e" : "#a3e635" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />
          <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.6rem" }}>
            {locked ? "This tab is locked" : "All changes auto-saved"}
          </span>
          {!locked && progressPercentage < 100 && (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-16 h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.5 }} />
              </div>
              <span className="text-gray-300 dark:text-gray-600" style={{ fontSize: "0.52rem" }}>{progressPercentage}%</span>
            </div>
          )}
        </div>
        <motion.button onClick={onLock} disabled={!canLock && !locked}
          whileHover={canLock || locked ? { scale: 1.02 } : undefined}
          whileTap={canLock || locked ? { scale: 0.98 } : undefined}
          className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300",
            locked ? "text-emerald-600 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              : canLock ? "text-white shadow-lg hover:shadow-xl"
              : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed")}
          style={!locked && canLock ? { background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`, fontSize: "0.7rem" } : { fontSize: "0.7rem" }}>
          {locked ? <><Unlock className="w-3.5 h-3.5" /> Unlock Tab</>
            : canLock ? <><Lock className="w-3.5 h-3.5" /> Lock &amp; Continue <ArrowRight className="w-3.5 h-3.5 ml-1" /></>
            : <><Lock className="w-3.5 h-3.5" /> Complete to Lock</>}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────────────────────── */
function SectionCard({ title, description, children, color, delay = 0.05 }) {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mb-4 rounded-2xl overflow-hidden group">
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${color}15, transparent 60%)` }} />
      <div className="rounded-2xl bg-card border border-gray-100/80 dark:border-gray-800/50 shadow-sm transition-shadow duration-300">
        <div className="flex items-center p-4 gap-3 border-b border-gray-50/80 dark:border-gray-800/40">
          <div className="w-1.5 h-5 rounded-full origin-center transition-transform duration-300 ease-out group-hover:scale-y-125"
            style={{ background: `linear-gradient(180deg, ${color}, ${color}60)` }} />
          <div className="flex flex-col">
            <h3 className="text-gray-900 dark:text-gray-100 text-sm">{title}</h3>
            {description && <p className="text-gray-400 dark:text-gray-500 text-[0.6rem] mt-0.5">{description}</p>}
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────
   SELECT FIELD (for add-row form)
───────────────────────────────────────────────────────── */
function SelectField({ label, value, onChange, options, color, disabled }) {
  const [focused, setFocused] = useState(false);
  const hasValue = !!value;
  return (
    <div className="relative">
      <select value={value} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        style={focused ? { borderColor: `${color}40` } : undefined}
        className="w-full pt-5 pb-2 px-3.5 rounded-xl border border-border bg-input text-[0.72rem] text-foreground appearance-none focus:outline-none focus:ring-0 transition-colors">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <motion.label className="absolute left-3.5 pointer-events-none origin-left flex items-center gap-1 text-[0.7rem]"
        animate={{ top: focused || hasValue ? 6 : 14, scale: focused || hasValue ? 0.78 : 1, color: focused ? color : "#9ca3af" }}
        transition={{ duration: 0.15, ease: "easeOut" }}>
        {label}
      </motion.label>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   INPUT FIELD (for add-row form)
───────────────────────────────────────────────────────── */
function InputField({ label, value, onChange, color }) {
  const [focused, setFocused] = useState(false);
  const hasValue = String(value ?? "").length > 0;
  return (
    <div className="relative">
      <input value={value} type="text"
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={focused ? label : ""}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        style={{
          textTransform: "uppercase",
          ...(focused ? { borderColor: `${color}40` } : {}),
        }}
        className="w-full pt-5 pb-2 px-3.5 rounded-xl border border-border bg-input text-[0.72rem] text-foreground focus:outline-none focus:ring-0 transition-colors" />
      <motion.label className="absolute left-3.5 pointer-events-none origin-left text-[0.7rem]"
        animate={{ top: focused || hasValue ? 6 : 14, scale: focused || hasValue ? 0.78 : 1, color: focused ? color : "#9ca3af" }}
        transition={{ duration: 0.15, ease: "easeOut" }}>
        {label}
      </motion.label>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   YES/NO PILL — toggles a boolean in a table cell
───────────────────────────────────────────────────────── */
function YesNoPill({ value, onChange, color, disabled }) {
  return (
    <button
      disabled={disabled}
      onClick={() => onChange(!value)}
      className={cn("px-2 py-0.5 rounded text-center transition-all", disabled && "opacity-40")}
      style={value
        ? { backgroundColor: `${color}15`, color, fontSize: "0.48rem" }
        : { backgroundColor: "#f3f4f6", color: "#9ca3af", fontSize: "0.48rem" }}>
      {value ? "YES" : "NO"}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   MINUTE CELL — small number input for prep/wrap mins
───────────────────────────────────────────────────────── */
function MinuteCell({ value, onChange, disabled }) {
  return (
    <input
      type="number" value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="–"
      className="w-full px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-800 bg-transparent text-center text-gray-700 dark:text-gray-300 outline-none disabled:opacity-40"
      style={{ fontSize: "0.48rem" }} />
  );
}

/* ─────────────────────────────────────────────────────────
   DEFAULT DATA — matches TypeScript source exactly
───────────────────────────────────────────────────────── */
const DEFAULT_DEPT_ROWS = [
  { id: "d1",  department: "All Depts",            site: "Off set", cameraOT: false, otherOT: true,  minutesAcross: "0", minutesBefore: "",   minutesAfter: "",   isGlobal: true },
  { id: "d2",  department: "All Depts",            site: "On set",  cameraOT: true,  otherOT: true,  minutesAcross: "0", minutesBefore: "",   minutesAfter: "",   isGlobal: true },
  { id: "d3",  department: "Assistant Directors",  site: "On set",  cameraOT: true,  otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
  { id: "d4",  department: "Assistant Directors",  site: "Off set", cameraOT: false, otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
  { id: "d5",  department: "Continuity",           site: "Off set", cameraOT: false, otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
  { id: "d6",  department: "Continuity",           site: "On set",  cameraOT: true,  otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
  { id: "d7",  department: "Costume",              site: "On set",  cameraOT: true,  otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
  { id: "d8",  department: "Costume",              site: "Off set", cameraOT: false, otherOT: true,  minutesAcross: "",  minutesBefore: "0",  minutesAfter: "0"  },
  { id: "d9",  department: "Grip",                 site: "On set",  cameraOT: true,  otherOT: true,  minutesAcross: "0", minutesBefore: "",   minutesAfter: ""   },
  { id: "d10", department: "Hair and Makeup",      site: "Off set", cameraOT: false, otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
  { id: "d11", department: "Hair and Makeup",      site: "On set",  cameraOT: true,  otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
  { id: "d12", department: "Locations",            site: "On set",  cameraOT: true,  otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
  { id: "d13", department: "Locations",            site: "Off set", cameraOT: false, otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
  { id: "d14", department: "Script",               site: "Off set", cameraOT: false, otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
  { id: "d15", department: "Script",               site: "On set",  cameraOT: true,  otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
  { id: "d16", department: "VFX",                  site: "On set",  cameraOT: true,  otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
  { id: "d17", department: "VFX",                  site: "Off set", cameraOT: false, otherOT: true,  minutesAcross: "",  minutesBefore: "30", minutesAfter: "30" },
];

/* ─────────────────────────────────────────────────────────
   RATES DEPARTMENTS TAB
───────────────────────────────────────────────────────── */
function RatesDepartmentsTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  const [rows, setRows] = useState(() =>
    loadSettings(projectId, "dept-defaults", DEFAULT_DEPT_ROWS),
  );
  const [showAddRow, setShowAddRow] = useState(false);
  const [newDept, setNewDept] = useState("");
  const [newSite, setNewSite] = useState("On set");

  const saveRows = (r) => { setRows(r); saveSettings(projectId, "dept-defaults", r); };

  const updateRow = (id, field, val) =>
    saveRows(rows.map((r) => (r.id === id ? { ...r, [field]: val } : r)));

  const deleteRow = (id) =>
    saveRows(rows.filter((r) => r.id !== id));

  const addRow = () => {
    if (!newDept.trim()) return;
    saveRows([
      ...rows,
      {
        id: `d${Date.now()}`,
        department: newDept.trim(),
        site: newSite,
        cameraOT: newSite === "On set",
        otherOT: true,
        minutesAcross: "",
        minutesBefore: "30",
        minutesAfter: "30",
      },
    ]);
    setNewDept("");
    setShowAddRow(false);
  };

  /* ── Lock handler ── */
  const handleLock = () =>
    setTabLockStatusById((prev) => ({ ...prev, [tabId]: !prev[tabId] }));

  /* ── Progress — all fields have defaults, always 100% ── */
  const progressPercentage = 100;

  useEffect(() => {
    setTabProgressById((prev) => ({ ...prev, [tabId]: progressPercentage }));
  }, [progressPercentage, tabId, setTabProgressById]);

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-5"
    >
      <TabHeader label="Departments" progressPercentage={progressPercentage} color={color} locked={locked} />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        <SectionCard
          title="Department Overtime & Wrap Time"
          description="Configure camera/other overtime and reasonable prep & wrap minutes per department and site."
          color={color}
          delay={0.05}
        >
          {/* Table */}
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">

            {/* Header row */}
            <div className="grid grid-cols-[1fr_80px_60px_60px_60px_60px_60px_32px] gap-0 items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30 px-3 py-2">
              {["Department", "Site", "Camera OT", "Other OT", "Across", "Before", "After", ""].map((h, i) => (
                <span key={i} className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center first:text-left" style={{ fontSize: "0.42rem" }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Data rows */}
            {rows.map((r) => (
              <div
                key={r.id}
                className={cn(
                  "grid grid-cols-[1fr_80px_60px_60px_60px_60px_60px_32px] gap-0 items-center border-b border-gray-50 dark:border-gray-800/40 px-3 py-1.5",
                  r.isGlobal && "bg-gray-50/30 dark:bg-gray-800/15",
                )}
              >
                {/* Department name */}
                <span
                  className={cn("uppercase", r.isGlobal ? "text-gray-800 dark:text-gray-200 font-medium" : "text-gray-600 dark:text-gray-400")}
                  style={{ fontSize: "0.52rem" }}
                >
                  {r.department}
                </span>

                {/* Site */}
                <span className="text-center text-gray-500 dark:text-gray-400 uppercase" style={{ fontSize: "0.48rem" }}>
                  {r.site}
                </span>

                {/* Camera OT */}
                <div className="flex justify-center">
                  <YesNoPill value={r.cameraOT} onChange={(v) => updateRow(r.id, "cameraOT", v)} color={color} disabled={d} />
                </div>

                {/* Other OT */}
                <div className="flex justify-center">
                  <YesNoPill value={r.otherOT} onChange={(v) => updateRow(r.id, "otherOT", v)} color={color} disabled={d} />
                </div>

                {/* Across mins */}
                <MinuteCell value={r.minutesAcross} onChange={(v) => updateRow(r.id, "minutesAcross", v)} disabled={d} />

                {/* Before mins */}
                <MinuteCell value={r.minutesBefore} onChange={(v) => updateRow(r.id, "minutesBefore", v)} disabled={d} />

                {/* After mins */}
                <MinuteCell value={r.minutesAfter} onChange={(v) => updateRow(r.id, "minutesAfter", v)} disabled={d} />

                {/* Delete */}
                <div className="flex justify-center">
                  {!d && !r.isGlobal && (
                    <button
                      onClick={() => deleteRow(r.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add row form */}
          {!d && (
            showAddRow ? (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1">
                  <InputField label="Department" value={newDept} onChange={setNewDept} color={color} />
                </div>
                <div className="w-32">
                  <SelectField
                    label="Site"
                    value={newSite}
                    onChange={setNewSite}
                    options={["On set", "Off set"]}
                    color={color}
                  />
                </div>
                <button
                  onClick={addRow}
                  className="px-3 py-2.5 rounded-lg text-white shrink-0"
                  style={{ background: color, fontSize: "0.54rem" }}
                >
                  Add
                </button>
                <button
                  onClick={() => { setShowAddRow(false); setNewDept(""); }}
                  className="px-3 py-2.5 text-gray-400 shrink-0"
                  style={{ fontSize: "0.54rem" }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <motion.button
                onClick={() => setShowAddRow(true)}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                style={{ fontSize: "0.56rem" }}
              >
                <Plus className="w-3 h-3" />
                <span className="uppercase">Add Department Row</span>
              </motion.button>
            )
          )}
        </SectionCard>

      </div>

      <ActionFooter
        locked={locked}
        onLock={handleLock}
        color={color}
        progressPercentage={progressPercentage}
      />
    </motion.div>
  );
}

export default RatesDepartmentsTab;