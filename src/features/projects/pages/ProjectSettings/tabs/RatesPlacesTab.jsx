import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleCheck, Shield, Sparkles, Lock, Unlock, ArrowRight, Plus, Trash2, X,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/config/utils";

function loadSettings(projectId, key, fallbackValue) {
  const stored = localStorage.getItem(`${key}-${projectId}`);
  return stored ? JSON.parse(stored) : fallbackValue;
}
function saveSettings(projectId, key, value) {
  localStorage.setItem(`${key}-${projectId}`, JSON.stringify(value));
}

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
                <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                  animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.5 }} />
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

function InlineInput({ label, value, onChange, type, color }) {
  const [focused, setFocused] = useState(false);
  const hasValue = String(value ?? "").length > 0;
  return (
    <div className="relative">
      <Input value={value} type={type || "text"}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        style={focused ? { borderColor: `${color}40` } : undefined}
        className="pt-5 pb-2 px-3.5 rounded-xl focus:border-transparent text-[0.72rem]" />
      <motion.label className="absolute left-3.5 pointer-events-none origin-left text-[0.7rem]"
        animate={{ top: focused || hasValue ? 6 : 14, scale: focused || hasValue ? 0.78 : 1, color: focused ? color : "#9ca3af" }}
        transition={{ duration: 0.15, ease: "easeOut" }}>
        {label}
      </motion.label>
    </div>
  );
}

const DEFAULT_UNITS = [
  { id: "u1", name: "Main", shootStart: "2025-09-29", shootEnd: "2025-12-11", isPrimary: true },
  { id: "u2", name: "Splinter Camera", shootStart: "2025-10-09", shootEnd: "2025-12-15" },
  { id: "u3", name: "VFX Elements", shootStart: "2025-12-17", shootEnd: "2025-12-17" },
];
const DEFAULT_WORKPLACES = [
  { id: "w1", name: "Bourne Wood" }, { id: "w2", name: "Brecon Beacons" },
  { id: "w3", name: "Crychan Forest" }, { id: "w4", name: "Dartmoor" },
  { id: "w5", name: "Forest of Dean" }, { id: "w6", name: "Redlands Wood" },
  { id: "w7", name: "Shepperton" }, { id: "w8", name: "Sky Studios Elstree" },
  { id: "w9", name: "Stockers Farm" },
];
const DEFAULT_SITES = ["Off set", "On set"];

function RatesPlacesTab({ color, projectId, locked, tabId, setTabLockStatusById, setTabProgressById }) {
  const d = locked;

  const [units, setUnits] = useState(() => loadSettings(projectId, "places-units", DEFAULT_UNITS));
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitStart, setNewUnitStart] = useState("");
  const [newUnitEnd, setNewUnitEnd] = useState("");

  const saveUnits = (u) => { setUnits(u); saveSettings(projectId, "places-units", u); };
  const addUnit = () => {
    if (!newUnitName.trim()) return;
    saveUnits([...units, { id: `u${Date.now()}`, name: newUnitName.trim(), shootStart: newUnitStart, shootEnd: newUnitEnd }]);
    setNewUnitName(""); setNewUnitStart(""); setNewUnitEnd(""); setShowAddUnit(false);
  };
  const deleteUnit = (id) => saveUnits(units.filter((u) => u.id !== id));
  const updateUnit = (id, field, val) => saveUnits(units.map((u) => u.id === id ? { ...u, [field]: val } : u));

  const [workplaces, setWorkplaces] = useState(() => loadSettings(projectId, "places-workplaces", DEFAULT_WORKPLACES));
  const [showAddWp, setShowAddWp] = useState(false);
  const [newWpName, setNewWpName] = useState("");

  const saveWps = (w) => { setWorkplaces(w); saveSettings(projectId, "places-workplaces", w); };
  const addWp = () => {
    if (!newWpName.trim()) return;
    saveWps([...workplaces, { id: `w${Date.now()}`, name: newWpName.trim() }]);
    setNewWpName(""); setShowAddWp(false);
  };
  const deleteWp = (id) => saveWps(workplaces.filter((w) => w.id !== id));

  const handleLock = () => setTabLockStatusById((prev) => ({ ...prev, [tabId]: !prev[tabId] }));

  const progressPercentage =
    units.length > 0 && workplaces.length > 0 ? 100
    : units.length > 0 || workplaces.length > 0 ? 50
    : 0;

  useEffect(() => {
    setTabProgressById((prev) => ({ ...prev, [tabId]: progressPercentage }));
  }, [progressPercentage, tabId, setTabProgressById]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }} className="flex flex-col gap-5">
      <TabHeader label="Places" progressPercentage={progressPercentage} color={color} locked={locked} />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Units ── */}
        <SectionCard title="Units" description="Configure shooting units with their schedule dates." color={color} delay={0.05}>
          <div className="space-y-2">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_110px_110px_32px] gap-2 px-3 pb-1">
              {["Unit Name", "Shoot Start", "Shoot End", ""].map((h, i) => (
                <span key={i} className="text-gray-400 dark:text-gray-500 uppercase" style={{ fontSize: "0.42rem" }}>{h}</span>
              ))}
            </div>

            {/* Unit rows */}
            <AnimatePresence>
              {units.map((u) => (
                <motion.div key={u.id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-[1fr_110px_110px_32px] gap-2 items-center rounded-lg border border-gray-100 dark:border-gray-800 px-3 py-2">
                  <div className="flex items-center gap-2">
                    {u.isPrimary && (
                      <span className="px-1.5 py-0.5 rounded text-white uppercase" style={{ background: color, fontSize: "0.4rem" }}>PRIMARY</span>
                    )}
                    <span className="text-gray-700 dark:text-gray-300 uppercase" style={{ fontSize: "0.6rem" }}>{u.name}</span>
                  </div>
                  <input type="date" value={u.shootStart} onChange={(e) => updateUnit(u.id, "shootStart", e.target.value)} disabled={d}
                    className="px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 outline-none disabled:opacity-40 w-full"
                    style={{ fontSize: "0.46rem" }} />
                  <input type="date" value={u.shootEnd} onChange={(e) => updateUnit(u.id, "shootEnd", e.target.value)} disabled={d}
                    className="px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 outline-none disabled:opacity-40 w-full"
                    style={{ fontSize: "0.46rem" }} />
                  <div className="flex justify-center">
                    {!d && !u.isPrimary && (
                      <button onClick={() => deleteUnit(u.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add unit */}
            {!d && (showAddUnit ? (
              <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-3 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <InlineInput label="Unit Name" value={newUnitName} onChange={setNewUnitName} color={color} />
                  <InlineInput label="Start Date" value={newUnitStart} onChange={setNewUnitStart} type="date" color={color} />
                  <InlineInput label="End Date" value={newUnitEnd} onChange={setNewUnitEnd} type="date" color={color} />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowAddUnit(false)} className="px-3 py-1 rounded-lg text-gray-400 hover:text-gray-600" style={{ fontSize: "0.54rem" }}>Cancel</button>
                  <button onClick={addUnit} className="px-3 py-1 rounded-lg text-white" style={{ background: color, fontSize: "0.54rem" }}>Add</button>
                </div>
              </div>
            ) : (
              <motion.button onClick={() => setShowAddUnit(true)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                style={{ fontSize: "0.56rem" }}>
                <Plus className="w-3 h-3" /> Add Unit
              </motion.button>
            ))}
          </div>
        </SectionCard>

        {/* ── Workplaces ── */}
        <SectionCard title="Workplaces" description="Locations where production takes place." color={color} delay={0.1}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {workplaces.map((w) => (
                  <motion.div key={w.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                    <span className="text-gray-700 dark:text-gray-300 uppercase" style={{ fontSize: "0.56rem" }}>{w.name}</span>
                    {!d && (
                      <button onClick={() => deleteWp(w.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {!d && (showAddWp ? (
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <InlineInput label="Workplace Name" value={newWpName} onChange={setNewWpName} color={color} />
                </div>
                <button onClick={addWp} className="px-3 py-2.5 rounded-lg text-white shrink-0" style={{ background: color, fontSize: "0.54rem" }}>Add</button>
                <button onClick={() => { setShowAddWp(false); setNewWpName(""); }} className="px-3 py-2.5 rounded-lg text-gray-400" style={{ fontSize: "0.54rem" }}>Cancel</button>
              </div>
            ) : (
              <motion.button onClick={() => setShowAddWp(true)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                style={{ fontSize: "0.56rem" }}>
                <Plus className="w-3 h-3" /> Add Workplace
              </motion.button>
            ))}
          </div>
        </SectionCard>

        {/* ── Sites (read-only) ── */}
        <SectionCard title="Sites" description="Work site classifications for department settings." color={color} delay={0.15}>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_SITES.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 uppercase"
                style={{ fontSize: "0.56rem" }}>{s}</span>
            ))}
          </div>
        </SectionCard>

      </div>

      <ActionFooter locked={locked} onLock={handleLock} color={color} progressPercentage={progressPercentage} />
    </motion.div>
  );
}

export default RatesPlacesTab;