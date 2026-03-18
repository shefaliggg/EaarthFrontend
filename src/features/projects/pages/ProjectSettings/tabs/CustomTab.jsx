import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Check, X, Search,
  Eye, EyeOff, Send, RotateCcw,
  Info, ShieldAlert, ChevronDown,
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
   TAB HEADER  (shared pattern from your other tabs)
───────────────────────────────────────────────────────── */
import { CircleCheck, Shield, Sparkles, Lock, Unlock, ArrowRight } from "lucide-react";

function TabHeader({ label, progressPercentage, color, locked }) {
  const strokeWidth = 3;
  const radius = (40 - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative flex items-center justify-between p-4 rounded-2xl overflow-hidden",
        locked && "bg-mint-100 dark:bg-mint-900/30",
      )}
      style={!locked ? { backgroundColor: `${color}15` } : undefined}
    >
      {locked && (
        <motion.div
          className="absolute h-full w-1/3 opacity-20"
          style={{ background: "linear-gradient(90deg, transparent, #22c55e66, transparent)" }}
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}

      <div className="flex items-center gap-4">
        <div style={{ width: 40, height: 40 }} className="relative inline-flex items-center justify-center">
          <svg width="40" height="40" className="-rotate-90">
            <circle cx="20" cy="20" r={radius} strokeWidth={strokeWidth} className="fill-none stroke-muted" />
            <motion.circle
              cx="20" cy="20" r={radius} fill="none" strokeWidth={strokeWidth} strokeLinecap="round"
              stroke={locked ? "#22c55e" : color}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - (progressPercentage / 100) * circumference }}
              transition={{ duration: 0.8 }}
            />
          </svg>
          <div className="absolute flex items-center justify-center">
            {locked
              ? <CircleCheck className="w-5 h-5 text-emerald-500" />
              : <span className="text-xs font-medium tabular-nums">{progressPercentage}%</span>
            }
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-foreground font-medium text-[0.95rem]">{label}</h2>
          {locked ? (
            <motion.span
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[0.56rem] rounded-full bg-emerald-50 dark:bg-emerald-900/30"
            >
              <Shield className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600">Locked &amp; verified</span>
            </motion.span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[0.56rem] text-muted-foreground">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Auto-saving changes
            </span>
          )}
        </div>
      </div>

      {!locked && progressPercentage < 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed"
          style={{ borderColor: `${color}30`, backgroundColor: `${color}05`, fontSize: "0.56rem", color }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Fill required fields to continue
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   ACTION FOOTER  (shared pattern from your other tabs)
───────────────────────────────────────────────────────── */
function ActionFooter({ locked, onLock, color, progressPercentage }) {
  const canLock = progressPercentage >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="mb-2 rounded-2xl overflow-hidden"
    >
      <div className="relative bg-card rounded-2xl border border-gray-100/80 dark:border-gray-800/60 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: locked ? "#22c55e" : "#a3e635" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.6rem" }}>
            {locked ? "This tab is locked" : "All changes auto-saved"}
          </span>
          {!locked && progressPercentage < 100 && (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-16 h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-gray-300 dark:text-gray-600" style={{ fontSize: "0.52rem" }}>{progressPercentage}%</span>
            </div>
          )}
        </div>

        <motion.button
          onClick={onLock}
          disabled={!canLock && !locked}
          whileHover={canLock || locked ? { scale: 1.02 } : undefined}
          whileTap={canLock || locked ? { scale: 0.98 } : undefined}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300",
            locked
              ? "text-emerald-600 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              : canLock
                ? "text-white shadow-lg hover:shadow-xl"
                : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed",
          )}
          style={
            !locked && canLock
              ? { background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`, fontSize: "0.7rem" }
              : { fontSize: "0.7rem" }
          }
        >
          {locked
            ? <><Unlock className="w-3.5 h-3.5" /> Unlock Tab</>
            : canLock
              ? <><Lock className="w-3.5 h-3.5" /> Lock &amp; Continue <ArrowRight className="w-3.5 h-3.5 ml-1" /></>
              : <><Lock className="w-3.5 h-3.5" /> Complete to Lock</>
          }
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION CARD  (shared pattern from your other tabs)
───────────────────────────────────────────────────────── */
function SectionCard({ title, description, children, color, delay = 0.05 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mb-4 rounded-2xl overflow-hidden group"
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${color}15, transparent 60%)` }}
      />
      <div className="rounded-2xl bg-card border border-gray-100/80 dark:border-gray-800/50 shadow-sm transition-shadow duration-300">
        <div className="flex items-center p-4 gap-3 border-b border-gray-50/80 dark:border-gray-800/40">
          <div
            className="w-1.5 h-5 rounded-full origin-center transition-transform duration-300 ease-out group-hover:scale-y-125"
            style={{ background: `linear-gradient(180deg, ${color}, ${color}60)` }}
          />
          <div className="flex flex-col">
            <h3 className="text-gray-900 dark:text-gray-100 text-sm">{title}</h3>
            {description && (
              <p className="text-gray-400 dark:text-gray-500 text-[0.6rem] mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────
   FLOATING LABEL INPUT  (matches your existing InputField)
───────────────────────────────────────────────────────── */
function InputField({ label, value, onChange, type, color, disabled, required }) {
  const [focused, setFocused] = useState(false);
  const hasValue = String(value ?? "").length > 0;
  const isText = !type || type === "text";

  return (
    <div className="relative">
      <input
        value={value}
        type={type || "text"}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? label : ""}
        onChange={(e) => onChange(isText ? e.target.value.toUpperCase() : e.target.value)}
        style={{
          ...(isText ? { textTransform: "uppercase" } : {}),
          ...(focused ? { borderColor: `${color}40` } : {}),
        }}
        className="w-full pt-5 pb-2 px-3.5 rounded-xl border border-border bg-input text-[0.72rem] text-foreground focus:outline-none focus:ring-0 transition-colors"
      />
      <motion.label
        className="absolute left-3.5 pointer-events-none origin-left flex items-center gap-1 text-[0.7rem]"
        animate={{
          top: focused || hasValue ? 6 : 14,
          scale: focused || hasValue ? 0.78 : 1,
          color: focused ? color : "#9ca3af",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {label}{required && <span style={{ color }}> *</span>}
      </motion.label>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SELECT FIELD  (matches your existing SelectField)
───────────────────────────────────────────────────────── */
function SelectField({ label, value, onChange, options, color, disabled }) {
  const [focused, setFocused] = useState(false);
  const hasValue = !!value;

  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        style={focused ? { borderColor: `${color}40` } : undefined}
        className="w-full pt-5 pb-2 px-3.5 rounded-xl border border-border bg-input text-[0.72rem] text-foreground appearance-none focus:outline-none focus:ring-0 transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <motion.label
        className="absolute left-3.5 pointer-events-none origin-left text-[0.7rem]"
        animate={{
          top: focused || hasValue ? 6 : 14,
          scale: focused || hasValue ? 0.78 : 1,
          color: focused ? color : "#9ca3af",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {label}
      </motion.label>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PILL TOGGLE  (matches your existing PillToggle)
───────────────────────────────────────────────────────── */
function PillToggle({ label, value, onChange, color, disabled }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-gray-500 dark:text-gray-400 text-[0.65rem]">{label}</span>
      <button
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={cn(
          "relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
          disabled && "opacity-40 cursor-not-allowed",
        )}
        style={{ backgroundColor: value ? color : "#d1d5db" }}
      >
        <motion.span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ x: value ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────── */
const DEFAULT_CUSTOM_DAYS = [
  { id: "cd1", dayType: "Driver - Cast Travel", paidAs: "Percentage", dailyRatePercent: 150, holidayPay: "Accrue", sixthSeventhDays: "resets", payAllowances: true, showToCrew: true },
  { id: "cd2", dayType: "Half Day", paidAs: "Percentage", dailyRatePercent: 50, holidayPay: "Accrue", sixthSeventhDays: "resets", payAllowances: true, showToCrew: true },
  { id: "cd3", dayType: "Sick - Paid", paidAs: "Percentage", dailyRatePercent: 100, holidayPay: "Accrue", sixthSeventhDays: "dont_reset", payAllowances: false, showToCrew: false },
  { id: "cd4", dayType: "Travel & Turnaround", paidAs: "Percentage", dailyRatePercent: 200, holidayPay: "Accrue", sixthSeventhDays: "resets", payAllowances: true, showToCrew: true },
  { id: "cd5", dayType: "Travel Somerset", paidAs: "Percentage", dailyRatePercent: 150, holidayPay: "Accrue", sixthSeventhDays: "resets", payAllowances: false, showToCrew: false },
];

const OVERRIDE_FIELDS = [
  "Mileage", "Travel", "Per Diem", "Kit Rental", "Car Allowance",
  "Mobile Allowance", "Meal Penalty", "Box Rental", "Housing", "Other",
];

const CREW_ROSTER = [
  { name: "SARAH JOHNSON", department: "Production" },
  { name: "MICHAEL CHEN", department: "Production" },
  { name: "EMILY RODRIGUEZ", department: "Production" },
  { name: "DAVID WILLIAMS", department: "Accounts" },
  { name: "JESSICA TAYLOR", department: "Camera" },
  { name: "JAMES BROWN", department: "Art" },
  { name: "ALEX MARTINEZ", department: "Grip" },
  { name: "SOPHIE CLARK", department: "Electric" },
  { name: "RYAN THOMPSON", department: "Sound" },
  { name: "NATALIE WHITE", department: "Costume" },
  { name: "CHRIS DAVIS", department: "Locations" },
  { name: "HANNAH WILSON", department: "Transport" },
  { name: "TOM BAKER", department: "Construction" },
  { name: "OLIVIA GREEN", department: "VFX" },
];

const CREW_DEPARTMENTS = [...new Set(CREW_ROSTER.map((c) => c.department))];

const VISIBILITY_ROLES = [
  { role: "Studio", standard: true, penny: true },
  { role: "Crew Member (Self)", standard: true, penny: true },
  { role: "HOD (Head of Department)", standard: true, penny: false },
  { role: "Department Members", standard: true, penny: false },
  { role: "Production", standard: true, penny: true },
  { role: "Finance", standard: true, penny: true },
  { role: "Payroll", standard: true, penny: true },
];

const DEFAULT_PENNY_CREW = [
  { id: "pc1", name: "Sarah Johnson", role: "Director of Photography", department: "Camera", contractType: "Weekly", status: "Standard", protected: false },
  { id: "pc2", name: "Michael Chen", role: "1st AC", department: "Camera", contractType: "Weekly", status: "Penny Contract", protected: true },
  { id: "pc3", name: "Emily Rodriguez", role: "Sound Mixer", department: "Sound", contractType: "Weekly", status: "Penny Contract", protected: true },
  { id: "pc4", name: "James Wilson", role: "Key Grip", department: "Grip", contractType: "Daily", status: "Standard", protected: false },
  { id: "pc5", name: "Lisa Anderson", role: "Gaffer", department: "Electric", contractType: "Weekly", status: "Standard", protected: false },
  { id: "pc6", name: "David Martinez", role: "Production Designer", department: "Art", contractType: "Weekly", status: "Penny Contract", protected: true },
  { id: "pc7", name: "Jennifer Lee", role: "Costume Designer", department: "Costume", contractType: "Weekly", status: "Standard", protected: false },
  { id: "pc8", name: "Robert Taylor", role: "2nd AC", department: "Camera", contractType: "Daily", status: "Standard", protected: false },
];

/* ─────────────────────────────────────────────────────────
   PENNY CONTRACT SECTION
───────────────────────────────────────────────────────── */
function PennyContractSection({ color, projectId, locked }) {
  const [crew, setCrew] = useState(() =>
    loadSettings(projectId, "penny-crew", DEFAULT_PENNY_CREW),
  );
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");

  const departments = ["All Departments", ...new Set(crew.map((c) => c.department))];
  const pennyCount = crew.filter((c) => c.status === "Penny Contract").length;

  const saveCrew = (c) => {
    setCrew(c);
    saveSettings(projectId, "penny-crew", c);
  };

  const toggleProtection = (id) => {
    saveCrew(
      crew.map((c) =>
        c.id === id
          ? { ...c, protected: !c.protected, status: !c.protected ? "Penny Contract" : "Standard" }
          : c,
      ),
    );
  };

  const filtered = crew.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All Departments" || c.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <SectionCard
      title="Penny Contract Settings"
      description="Manage confidential rate visibility for sensitive crew contracts"
      color={color}
      delay={0.12}
    >
      {/* Counter badge */}
      <div className="flex justify-end -mt-2 mb-3">
        <div className="flex flex-col items-center px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-900/20">
          <span style={{ fontSize: "0.9rem", color, fontFamily: "monospace" }}>{pennyCount}</span>
          <span className="text-purple-400 dark:text-purple-500" style={{ fontSize: "0.44rem" }}>Penny Contracts</span>
        </div>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/15 mb-4">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <span className="text-blue-700 dark:text-blue-300 block" style={{ fontSize: "0.6rem" }}>
            What is a Penny Contract?
          </span>
          <span className="text-blue-600/80 dark:text-blue-400/70" style={{ fontSize: "0.52rem" }}>
            Penny Contracts protect sensitive rate information from department visibility. When enabled,
            HOD and department members cannot see the crew member's rates, but Production, Finance, and
            Payroll maintain full access for processing and approval.
          </span>
        </div>
      </div>

      {/* Rate Visibility Matrix */}
      <div className="mb-4">
        <span className="text-gray-700 dark:text-gray-300 block mb-2.5" style={{ fontSize: "0.7rem" }}>
          Rate Visibility Matrix
        </span>
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_140px] gap-0 items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30 px-4 py-2.5">
            <span className="uppercase tracking-wider" style={{ fontSize: "0.44rem", color }}>Role</span>
            <span className="text-center text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontSize: "0.44rem" }}>Standard Contract</span>
            <span className="text-center text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontSize: "0.44rem" }}>Penny Contract</span>
          </div>
          {VISIBILITY_ROLES.map((vr) => (
            <div
              key={vr.role}
              className="grid grid-cols-[1fr_140px_140px] gap-0 items-center border-b border-gray-50 dark:border-gray-800/40 px-4 py-2.5 last:border-b-0"
            >
              <span className="text-gray-700 dark:text-gray-300" style={{ fontSize: "0.56rem" }}>{vr.role}</span>
              <div className="flex justify-center">
                <Eye className="w-4 h-4" style={{ color: `${color}90` }} />
              </div>
              <div className="flex justify-center">
                {vr.penny
                  ? <Eye className="w-4 h-4" style={{ color: `${color}90` }} />
                  : <EyeOff className="w-4 h-4 text-rose-400" />
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & filter */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crew by name or role..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 outline-none"
            style={{ fontSize: "0.56rem" }}
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 outline-none appearance-none cursor-pointer"
          style={{ fontSize: "0.56rem", minWidth: 140 }}
        >
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Crew table */}
      <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full" style={{ fontSize: "0.5rem" }}>
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30">
              {["Crew Member", "Role", "Department", "Contract Type", "Status", "Action"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 uppercase tracking-wider"
                  style={{ fontSize: "0.44rem", color }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-b border-gray-50 dark:border-gray-800/40 hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors"
              >
                <td className="px-4 py-2.5">
                  <span className="text-gray-800 dark:text-gray-200" style={{ fontSize: "0.56rem" }}>{c.name}</span>
                </td>
                <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400" style={{ fontSize: "0.52rem" }}>{c.role}</td>
                <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400" style={{ fontSize: "0.52rem" }}>{c.department}</td>
                <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400" style={{ fontSize: "0.52rem" }}>{c.contractType}</td>
                <td className="px-3 py-2.5">
                  {c.status === "Penny Contract" ? (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                      style={{ fontSize: "0.48rem" }}
                    >
                      <ShieldAlert className="w-2.5 h-2.5" /> Penny Contract
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      style={{ fontSize: "0.48rem" }}
                    >
                      Standard
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  {!locked && (
                    <button
                      onClick={() => toggleProtection(c.id)}
                      className="px-2.5 py-1 rounded-lg border transition-all"
                      style={
                        c.protected
                          ? { borderColor: "#f87171", color: "#ef4444", fontSize: "0.48rem", background: "#fef2f210" }
                          : { borderColor: `${color}50`, color, fontSize: "0.48rem", background: `${color}08` }
                      }
                    >
                      {c.protected ? "Remove Protection" : "Enable Protection"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-6">
          <span className="text-gray-400" style={{ fontSize: "0.56rem" }}>No crew members match your search.</span>
        </div>
      )}
    </SectionCard>
  );
}

/* ─────────────────────────────────────────────────────────
   CUSTOM TAB
───────────────────────────────────────────────────────── */
function CustomTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  /* ── Custom Days state ── */
  const [customDays, setCustomDays] = useState(() =>
    loadSettings(projectId, "custom-days", DEFAULT_CUSTOM_DAYS),
  );
  const [showAddDay, setShowAddDay] = useState(false);
  const [dayForm, setDayForm] = useState({
    dayType: "",
    paidAs: "Percentage",
    dailyRatePercent: 100,
    holidayPay: "Accrue",
    sixthSeventhDays: "resets",
    payAllowances: true,
    showToCrew: true,
  });

  const saveDays = (days) => {
    setCustomDays(days);
    saveSettings(projectId, "custom-days", days);
  };
  const addDay = () => {
    if (!dayForm.dayType.trim()) return;
    saveDays([...customDays, { ...dayForm, id: `cd${Date.now()}` }]);
    setDayForm({ dayType: "", paidAs: "Percentage", dailyRatePercent: 100, holidayPay: "Accrue", sixthSeventhDays: "resets", payAllowances: true, showToCrew: true });
    setShowAddDay(false);
  };
  const deleteDay = (id) => saveDays(customDays.filter((cd) => cd.id !== id));

  /* ── Upgrade Roles state ── */
  const [upgradeRoles, setUpgradeRoles] = useState(() =>
    loadSettings(projectId, "upgrade-roles", [
      { id: "ur1", name: "Production Supervisor", rate: 500, standardHours: 10 },
      { id: "ur2", name: "Line Producer", rate: 600, standardHours: 10 },
    ]),
  );
  const [showAddRole, setShowAddRole] = useState(false);
  const [roleForm, setRoleForm] = useState({ name: "", rate: 0, standardHours: 10 });

  const saveRoles = (roles) => {
    setUpgradeRoles(roles);
    saveSettings(projectId, "upgrade-roles", roles);
  };
  const addRole = () => {
    if (!roleForm.name.trim()) return;
    saveRoles([...upgradeRoles, { ...roleForm, id: `ur${Date.now()}` }]);
    setRoleForm({ name: "", rate: 0, standardHours: 10 });
    setShowAddRole(false);
  };
  const deleteRole = (id) => saveRoles(upgradeRoles.filter((r) => r.id !== id));

  /* ── Daily Overrides state ── */
  const [overrides, setOverrides] = useState(() =>
    loadSettings(projectId, "custom-overrides", []),
  );
  const [showAddOverride, setShowAddOverride] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState([]);
  const [crewSearch, setCrewSearch] = useState("");
  const [manualName, setManualName] = useState("");
  const [overrideForm, setOverrideForm] = useState({ field: "Mileage", value: "", date: "", notes: "" });

  const saveOverrides = (ovs) => {
    setOverrides(ovs);
    saveSettings(projectId, "custom-overrides", ovs);
  };
  const addOverride = () => {
    if (selectedCrew.length === 0 || !overrideForm.value.trim()) return;
    const bId = `batch${Date.now()}`;
    const newOvs = selectedCrew.map((name, i) => ({
      ...overrideForm,
      crewMember: name,
      id: `ov${Date.now()}_${i}`,
      batchId: bId,
    }));
    saveOverrides([...overrides, ...newOvs]);
    setOverrideForm({ field: "Mileage", value: "", date: "", notes: "" });
    setSelectedCrew([]);
    setCrewSearch("");
    setManualName("");
    setShowAddOverride(false);
  };
  const deleteOverride = (id) => saveOverrides(overrides.filter((o) => o.id !== id));
  const deleteBatch = (batchId) => saveOverrides(overrides.filter((o) => o.batchId !== batchId));

  const toggleCrew = (name) =>
    setSelectedCrew((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );

  const selectDept = (dept) => {
    const names = CREW_ROSTER.filter((c) => c.department === dept).map((c) => c.name);
    const allSelected = names.every((n) => selectedCrew.includes(n));
    setSelectedCrew((prev) =>
      allSelected ? prev.filter((n) => !names.includes(n)) : [...new Set([...prev, ...names])],
    );
  };

  const selectAll = () =>
    setSelectedCrew((prev) =>
      prev.length === CREW_ROSTER.length ? [] : CREW_ROSTER.map((c) => c.name),
    );

  const addManual = () => {
    const n = manualName.trim().toUpperCase();
    if (n && !selectedCrew.includes(n)) {
      setSelectedCrew([...selectedCrew, n]);
      setManualName("");
    }
  };

  const filteredRoster = crewSearch
    ? CREW_ROSTER.filter(
        (c) =>
          c.name.toLowerCase().includes(crewSearch.toLowerCase()) ||
          c.department.toLowerCase().includes(crewSearch.toLowerCase()),
      )
    : CREW_ROSTER;

  /* ── Lock handler ── */
  const handleLock = () => {
    setTabLockStatusById((prev) => ({ ...prev, [tabId]: !prev[tabId] }));
  };

  /* ── Progress — all defaults pre-filled, always 100% ── */
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
      <TabHeader
        label="Custom"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Custom Day Types ── */}
        <SectionCard
          title="Custom Day Types"
          description="Define non-standard day types with their rate calculations."
          color={color}
          delay={0.05}
        >
          {/* Table */}
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-3">
            <div className="grid grid-cols-[1fr_80px_60px_70px_70px_50px_50px_auto] gap-0 items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30 px-3 py-2">
              {["Day Type", "Paid As", "Rate %", "Holiday", "6th/7th", "Allow.", "Crew", ""].map((h) => (
                <span key={h} className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center" style={{ fontSize: "0.42rem" }}>{h}</span>
              ))}
            </div>
            {customDays.map((cd) => (
              <div
                key={cd.id}
                className="grid grid-cols-[1fr_80px_60px_70px_70px_50px_50px_auto] gap-0 items-center border-b border-gray-50 dark:border-gray-800/40 px-3 py-1.5"
              >
                <span className="text-gray-700 dark:text-gray-300 uppercase" style={{ fontSize: "0.52rem" }}>{cd.dayType}</span>
                <span className="text-center text-gray-500" style={{ fontSize: "0.48rem" }}>{cd.paidAs}</span>
                <span className="text-center" style={{ fontSize: "0.48rem", fontFamily: "monospace", color }}>{cd.dailyRatePercent}%</span>
                <span className="text-center text-gray-500" style={{ fontSize: "0.44rem" }}>{cd.holidayPay}</span>
                <span className="text-center text-gray-500" style={{ fontSize: "0.44rem" }}>{cd.sixthSeventhDays === "resets" ? "Resets" : "No reset"}</span>
                <span className="text-center" style={{ fontSize: "0.44rem", color: cd.payAllowances ? color : "#9ca3af" }}>{cd.payAllowances ? "YES" : "NO"}</span>
                <span className="text-center" style={{ fontSize: "0.44rem", color: cd.showToCrew ? color : "#9ca3af" }}>{cd.showToCrew ? "YES" : "NO"}</span>
                <div className="flex justify-center">
                  {!d && (
                    <button onClick={() => deleteDay(cd.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Day Form */}
          {!d && (
            showAddDay ? (
              <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-3 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <InputField
                    label="Day Type"
                    value={dayForm.dayType}
                    onChange={(v) => setDayForm({ ...dayForm, dayType: v })}
                    color={color}
                    required
                  />
                  <SelectField
                    label="Paid As"
                    value={dayForm.paidAs}
                    onChange={(v) => setDayForm({ ...dayForm, paidAs: v })}
                    options={["Percentage", "Fixed", "Hourly"]}
                    color={color}
                  />
                  <InputField
                    label="Rate %"
                    value={String(dayForm.dailyRatePercent)}
                    onChange={(v) => setDayForm({ ...dayForm, dailyRatePercent: parseInt(v) || 0 })}
                    type="number"
                    color={color}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-6">
                  <PillToggle
                    label="Pay Allowances"
                    value={dayForm.payAllowances}
                    onChange={(v) => setDayForm({ ...dayForm, payAllowances: v })}
                    color={color}
                  />
                  <PillToggle
                    label="Show to Crew"
                    value={dayForm.showToCrew}
                    onChange={(v) => setDayForm({ ...dayForm, showToCrew: v })}
                    color={color}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowAddDay(false)}
                    className="px-3 py-1 text-gray-400"
                    style={{ fontSize: "0.54rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addDay}
                    className="px-3 py-1 rounded-lg text-white"
                    style={{ background: color, fontSize: "0.54rem" }}
                  >
                    Add Day Type
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddDay(true)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 transition-colors"
                style={{ fontSize: "0.56rem" }}
              >
                <Plus className="w-3 h-3" /> Add Custom Day Type
              </button>
            )
          )}
        </SectionCard>

        {/* ── Section 2: Upgrade Roles ── */}
        <SectionCard
          title="Upgrade Roles"
          description="Roles with day rates and standard working hours for upgrades."
          color={color}
          delay={0.1}
        >
          {/* Table */}
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-3">
            <div className="grid grid-cols-[1fr_120px_100px_auto] gap-0 items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30 px-3 py-2">
              <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontSize: "0.42rem" }}>Role</span>
              <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right" style={{ fontSize: "0.42rem" }}>Day Rate Inc. Holiday (£)</span>
              <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right" style={{ fontSize: "0.42rem" }}>Standard Hours</span>
              <span className="w-6" />
            </div>
            {upgradeRoles.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-[1fr_120px_100px_auto] gap-0 items-center border-b border-gray-50 dark:border-gray-800/40 px-3 py-2"
              >
                <span className="text-gray-700 dark:text-gray-300 uppercase" style={{ fontSize: "0.54rem" }}>{r.name}</span>
                <span className="text-right" style={{ fontSize: "0.52rem", fontFamily: "monospace", color }}>
                  £ {r.rate.toLocaleString()}
                </span>
                <span className="text-right text-gray-500" style={{ fontSize: "0.52rem", fontFamily: "monospace" }}>
                  {r.standardHours}h
                </span>
                <div className="flex justify-center">
                  {!d && (
                    <button onClick={() => deleteRole(r.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Role Form */}
          {!d && (
            showAddRole ? (
              <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-3 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <InputField
                    label="Role"
                    value={roleForm.name}
                    onChange={(v) => setRoleForm({ ...roleForm, name: v })}
                    color={color}
                    required
                  />
                  <InputField
                    label="Day Rate Inc. Holiday (£)"
                    value={String(roleForm.rate)}
                    onChange={(v) => setRoleForm({ ...roleForm, rate: parseInt(v) || 0 })}
                    type="number"
                    color={color}
                  />
                  <InputField
                    label="Standard Working Hours"
                    value={String(roleForm.standardHours)}
                    onChange={(v) => setRoleForm({ ...roleForm, standardHours: parseInt(v) || 10 })}
                    type="number"
                    color={color}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowAddRole(false)}
                    className="px-3 py-1 text-gray-400"
                    style={{ fontSize: "0.54rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addRole}
                    className="px-3 py-1 rounded-lg text-white"
                    style={{ background: color, fontSize: "0.54rem" }}
                  >
                    Add Role
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddRole(true)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 transition-colors"
                style={{ fontSize: "0.56rem" }}
              >
                <Plus className="w-3 h-3" /> Add Upgrade Role
              </button>
            )
          )}
        </SectionCard>

        {/* ── Section 3: Penny Contract Settings ── */}
        <PennyContractSection color={color} projectId={projectId} locked={d} />

        {/* ── Section 4: Daily Allowances / Overrides ── */}
        <SectionCard
          title="Daily Allowances / Overrides"
          description="Apply override values to one or multiple crew members at once. Select crew individually, by department, or all at once."
          color={color}
          delay={0.15}
        >
          {!d && (
            <div className="flex justify-end mb-3">
              <motion.button
                onClick={() => {
                  setShowAddOverride(true);
                  setSelectedCrew([]);
                  setCrewSearch("");
                  setManualName("");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white shadow-sm transition-all"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, fontSize: "0.58rem" }}
              >
                <Plus className="w-3.5 h-3.5" /> Add Override
              </motion.button>
            </div>
          )}

          {/* Add Override Form */}
          <AnimatePresence>
            {showAddOverride && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-3"
              >
                <div
                  className="rounded-xl border-2 border-dashed p-4 space-y-3"
                  style={{ borderColor: `${color}40`, backgroundColor: `${color}05` }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300 uppercase tracking-wider" style={{ fontSize: "0.58rem" }}>
                      New Override
                    </span>
                    <button onClick={() => setShowAddOverride(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Step 1: Select Crew Members */}
                  <div
                    className="rounded-xl border border-gray-100 dark:border-gray-800 p-3 space-y-2.5"
                    style={{ backgroundColor: `${color}03` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 uppercase tracking-wider" style={{ fontSize: "0.5rem" }}>
                        Select Crew Members
                        {selectedCrew.length > 0 && (
                          <span
                            className="ml-2 px-1.5 py-0.5 rounded-full text-white"
                            style={{ background: color, fontSize: "0.42rem" }}
                          >
                            {selectedCrew.length} selected
                          </span>
                        )}
                      </span>
                      <button
                        onClick={selectAll}
                        className="px-2.5 py-1 rounded-lg border transition-colors"
                        style={
                          selectedCrew.length === CREW_ROSTER.length
                            ? { background: `${color}15`, borderColor: `${color}40`, color, fontSize: "0.46rem" }
                            : { borderColor: "#e5e7eb", color: "#9ca3af", fontSize: "0.46rem" }
                        }
                      >
                        {selectedCrew.length === CREW_ROSTER.length ? "Deselect All" : "Select All"}
                      </button>
                    </div>

                    {/* Department quick-filter pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {CREW_DEPARTMENTS.map((dept) => {
                        const names = CREW_ROSTER.filter((c) => c.department === dept).map((c) => c.name);
                        const count = names.filter((n) => selectedCrew.includes(n)).length;
                        const allSel = count === names.length;
                        return (
                          <button
                            key={dept}
                            onClick={() => selectDept(dept)}
                            className="px-2.5 py-1 rounded-full border transition-all"
                            style={
                              allSel
                                ? { background: `${color}20`, borderColor: `${color}50`, color, fontSize: "0.46rem" }
                                : count > 0
                                  ? { background: `${color}08`, borderColor: `${color}25`, color: `${color}cc`, fontSize: "0.46rem" }
                                  : { borderColor: "#e5e7eb", color: "#9ca3af", fontSize: "0.46rem" }
                            }
                          >
                            {dept}{count > 0 ? ` (${count}/${names.length})` : ` (${names.length})`}
                          </button>
                        );
                      })}
                    </div>

                    {/* Search crew */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <input
                        value={crewSearch}
                        onChange={(e) => setCrewSearch(e.target.value)}
                        placeholder="Search crew by name or department..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 outline-none"
                        style={{ fontSize: "0.52rem" }}
                      />
                    </div>

                    {/* Crew checkbox grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 max-h-40 overflow-y-auto pr-1">
                      {filteredRoster.map((c) => {
                        const sel = selectedCrew.includes(c.name);
                        return (
                          <button
                            key={c.name}
                            onClick={() => toggleCrew(c.name)}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all"
                            style={
                              sel
                                ? { borderColor: `${color}60`, background: `${color}10` }
                                : { borderColor: "#e5e7eb" }
                            }
                          >
                            <div
                              className="w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors"
                              style={sel ? { background: color, borderColor: color } : { borderColor: "#d1d5db" }}
                            >
                              {sel && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <div className="min-w-0">
                              <span
                                className={cn("block truncate", sel ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400")}
                                style={{ fontSize: "0.5rem" }}
                              >
                                {c.name}
                              </span>
                              <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.4rem" }}>{c.department}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Manual entry */}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-gray-400 shrink-0" style={{ fontSize: "0.46rem" }}>Or add manually:</span>
                      <input
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addManual()}
                        placeholder="Type crew name and press Enter"
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 outline-none"
                        style={{ fontSize: "0.5rem" }}
                      />
                      <button
                        onClick={addManual}
                        className="px-3 py-1.5 rounded-lg text-white shrink-0"
                        style={{ background: color, fontSize: "0.48rem" }}
                      >
                        Add
                      </button>
                    </div>

                    {/* Selected chips */}
                    {selectedCrew.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedCrew.map((name) => (
                          <span
                            key={name}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-white"
                            style={{ background: `${color}cc`, fontSize: "0.44rem" }}
                          >
                            {name}
                            <button onClick={() => toggleCrew(name)} className="hover:text-red-200 transition-colors">
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Step 2: Override details */}
                  <div className="grid grid-cols-2 gap-3">
                    <SelectField
                      label="Field"
                      value={overrideForm.field}
                      onChange={(v) => setOverrideForm({ ...overrideForm, field: v })}
                      options={OVERRIDE_FIELDS}
                      color={color}
                    />
                    <InputField
                      label="Value *"
                      value={overrideForm.value}
                      onChange={(v) => setOverrideForm({ ...overrideForm, value: v })}
                      color={color}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="Date"
                      value={overrideForm.date}
                      onChange={(v) => setOverrideForm({ ...overrideForm, date: v })}
                      type="date"
                      color={color}
                    />
                    <InputField
                      label="Notes"
                      value={overrideForm.notes}
                      onChange={(v) => setOverrideForm({ ...overrideForm, notes: v })}
                      color={color}
                    />
                  </div>

                  {/* Summary + Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.48rem" }}>
                      {selectedCrew.length === 0
                        ? "Select at least one crew member"
                        : `Will create ${selectedCrew.length} override${selectedCrew.length !== 1 ? "s" : ""} · ${overrideForm.field} → ${overrideForm.value || "..."}`
                      }
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAddOverride(false)}
                        className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 transition-colors"
                        style={{ fontSize: "0.58rem" }}
                      >
                        Cancel
                      </button>
                      <motion.button
                        onClick={addOverride}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={selectedCrew.length === 0 || !overrideForm.value.trim()}
                        className="px-4 py-2 rounded-xl text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, fontSize: "0.58rem" }}
                      >
                        Apply to {selectedCrew.length || 0} Member{selectedCrew.length !== 1 ? "s" : ""}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overrides list */}
          {overrides.length === 0 && !showAddOverride ? (
            <div className="text-center py-8">
              <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.6rem" }}>
                No overrides set. Click "Add Override" to create one.
              </span>
            </div>
          ) : overrides.length > 0 && (
            <>
              {/* Batch summary badges */}
              {(() => {
                const batches = new Map();
                overrides.forEach((o) => {
                  const k = o.batchId || o.id;
                  batches.set(k, [...(batches.get(k) || []), o]);
                });
                const batchGroups = [...batches.entries()].filter(([, items]) => items.length > 1);
                if (batchGroups.length === 0) return null;
                return (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {batchGroups.map(([bId, items]) => (
                      <div
                        key={bId}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20"
                      >
                        <span
                          className="px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: `${color}cc`, fontSize: "0.4rem" }}
                        >
                          {items[0].field}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400" style={{ fontSize: "0.48rem" }}>{items[0].value}</span>
                        <span className="text-gray-400" style={{ fontSize: "0.42rem" }}>→ {items.length} members</span>
                        {!d && (
                          <button
                            onClick={() => deleteBatch(bId)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                            title="Remove entire batch"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <table className="w-full" style={{ fontSize: "0.5rem" }}>
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30">
                      {["Crew Member", "Field", "Value", "Date", "Notes", "Batch", ""].map((h, i) => (
                        <th
                          key={i}
                          className={cn(
                            i < 2 ? "text-left" : i === 2 ? "text-right" : "text-left",
                            "px-3 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                          )}
                          style={{ fontSize: "0.42rem" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {overrides.map((o) => {
                      const batchCount = o.batchId
                        ? overrides.filter((x) => x.batchId === o.batchId).length
                        : 0;
                      return (
                        <tr
                          key={o.id}
                          className="border-b border-gray-50 dark:border-gray-800/40 hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors"
                        >
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0"
                                style={{ background: `${color}88`, fontSize: "0.36rem" }}
                              >
                                {o.crewMember.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                              <span className="text-gray-700 dark:text-gray-300 uppercase" style={{ fontSize: "0.52rem" }}>
                                {o.crewMember}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className="px-2 py-0.5 rounded-full text-white"
                              style={{ background: `${color}cc`, fontSize: "0.44rem" }}
                            >
                              {o.field}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right" style={{ fontSize: "0.52rem", fontFamily: "monospace", color }}>
                            {o.value}
                          </td>
                          <td className="px-3 py-2 text-gray-500" style={{ fontSize: "0.48rem" }}>{o.date || "—"}</td>
                          <td className="px-3 py-2 text-gray-400" style={{ fontSize: "0.48rem" }}>{o.notes || "—"}</td>
                          <td className="px-2 py-2 text-center">
                            {batchCount > 1 && (
                              <span
                                className="px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500"
                                style={{ fontSize: "0.4rem" }}
                              >
                                {batchCount}
                              </span>
                            )}
                          </td>
                          <td className="px-2 py-2 text-center">
                            {!d && (
                              <button onClick={() => deleteOverride(o.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-2.5 px-1">
                <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.46rem" }}>
                  {overrides.length} override{overrides.length !== 1 ? "s" : ""} across{" "}
                  {new Set(overrides.map((o) => o.crewMember)).size} crew member
                  {new Set(overrides.map((o) => o.crewMember)).size !== 1 ? "s" : ""}
                </span>
                <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.46rem" }}>
                  Batch overrides can be removed together using the badges above
                </span>
              </div>
            </>
          )}
        </SectionCard>
      </div>

      {/* ── Action Footer ── */}
      <ActionFooter
        locked={locked}
        onLock={handleLock}
        color={color}
        progressPercentage={progressPercentage}
      />
    </motion.div>
  );
}

export default CustomTab;