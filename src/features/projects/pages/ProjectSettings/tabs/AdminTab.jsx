import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleCheck, Shield, Sparkles, Lock, Unlock, ArrowRight,
  Search, Trash2, Check, X, RotateCcw, Send, UserPlus, ChevronDown,
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
   FLOATING LABEL INPUT (for add user form)
───────────────────────────────────────────────────────── */
function InputField({ label, value, onChange, type, color, disabled, required }) {
  const [focused, setFocused] = useState(false);
  const hasValue = String(value ?? "").length > 0;
  const isText = !type || type === "text";
  return (
    <div className="relative">
      <input value={value} type={type || "text"} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={focused ? label : ""}
        onChange={(e) => onChange(isText ? e.target.value.toUpperCase() : e.target.value)}
        style={{
          ...(isText ? { textTransform: "uppercase" } : {}),
          ...(focused ? { borderColor: `${color}40` } : {}),
        }}
        className="w-full pt-5 pb-2 px-3.5 rounded-xl border border-border bg-input text-[0.72rem] text-foreground focus:outline-none focus:ring-0 transition-colors" />
      <motion.label className="absolute left-3.5 pointer-events-none origin-left flex items-center gap-1 text-[0.7rem]"
        animate={{ top: focused || hasValue ? 6 : 14, scale: focused || hasValue ? 0.78 : 1, color: focused ? color : "#9ca3af" }}
        transition={{ duration: 0.15, ease: "easeOut" }}>
        {label}{required && <span style={{ color }}> *</span>}
      </motion.label>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SELECT FIELD (for add user form)
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
        {options.map((o) => <option key={typeof o === "string" ? o : o.id} value={typeof o === "string" ? o : o.id}>{typeof o === "string" ? o : `${o.icon} ${o.name}`}</option>)}
      </select>
      <motion.label className="absolute left-3.5 pointer-events-none origin-left text-[0.7rem]"
        animate={{ top: focused || hasValue ? 6 : 14, scale: focused || hasValue ? 0.78 : 1, color: focused ? color : "#9ca3af" }}
        transition={{ duration: 0.15, ease: "easeOut" }}>
        {label}
      </motion.label>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PERM CELL — multi-select dropdown inside permission table
───────────────────────────────────────────────────────── */
function PermCell({ vals, options, onChange, color, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const display = vals.length === 0 ? "–" : vals.join(", ");

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => !disabled && setOpen(!open)} disabled={disabled}
        className={cn("w-full text-left px-1.5 py-0.5 rounded border transition-all truncate", disabled && "opacity-40", vals.length > 0 ? "border-gray-200 dark:border-gray-700" : "border-transparent")}
        style={{ fontSize: "0.46rem", color: vals.length > 0 ? color : "#9ca3af" }}
      >
        {display}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="absolute z-30 top-full mt-1 left-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1.5 min-w-[140px]">
            {options.map((opt) => {
              const sel = vals.includes(opt);
              return (
                <button key={opt} onClick={() => { const n = sel ? vals.filter((v) => v !== opt) : [...vals, opt]; onChange(n); }}
                  className={cn("w-full text-left px-2 py-1 rounded-lg flex items-center gap-2 transition-colors", !sel && "hover:bg-gray-50 dark:hover:bg-gray-800")}
                  style={sel ? { backgroundColor: `${color}10` } : {}}>
                  <div className={cn("w-3 h-3 rounded border flex items-center justify-center", !sel && "border-gray-300 dark:border-gray-600")}
                    style={sel ? { background: color, borderColor: color } : {}}>
                    {sel && <Check className="w-2 h-2 text-white" />}
                  </div>
                  <span style={{ fontSize: "0.54rem", color: sel ? color : "#6b7280" }}>{opt}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STATIC DATA — matches TypeScript source exactly
───────────────────────────────────────────────────────── */
const ADMIN_ROLES = [
  { id: "studio-supervisor",     name: "Studio Supervisor",                        desc: "Production company",                                   icon: "👑" },
  { id: "production-supervisor", name: "Production Supervisor",                    desc: "Production Manager, Line Producer",                    icon: "🎬" },
  { id: "production-admin",      name: "Production Administrator",                 desc: "Assistant Production Coordinator, Production Secretary", icon: "📋" },
  { id: "accounts-supervisor",   name: "Accounts Supervisor",                      desc: "Financial Controller, Production Accountant",           icon: "💰" },
  { id: "accounts-admin",        name: "Accounts Administrator",                   desc: "Payroll staff",                                        icon: "📊" },
  { id: "dept-supervisor",       name: "Department Supervisor *",                  desc: "Gaffer, Art Director",                                 icon: "🔧" },
  { id: "dept-supervisor-tc",    name: "Department Supervisor (Timecard) *",       desc: "Production Coordinator, Costume Supervisor",           icon: "⏱" },
  { id: "dept-admin",            name: "Department Administrator *",               desc: "Best Boy, Art Department Coordinator",                 icon: "🎨" },
  { id: "dept-admin-tc",         name: "Department Administrator (Timecard) *",    desc: "Production Assistant, Camera Assistant",               icon: "📷" },
  { id: "crew-member",           name: "Crew Member",                              desc: "General crew",                                        icon: "👤" },
];

const PERM_COLS = [
  { key: "settings",    label: "Settings",     group: "Project" },
  { key: "calendar",    label: "Calendar",     group: "Project" },
  { key: "offers",      label: "Offers",       group: "On-boarding" },
  { key: "manageCrew",  label: "Manage Crew",  group: "On-boarding" },
  { key: "generate",    label: "Generate",     group: "Timecard" },
  { key: "approve",     label: "Approve",      group: "Timecard" },
];

const PERM_OPTIONS = {
  settings:   ["None", "View", "Edit"],
  calendar:   ["None", "View", "Edit"],
  offers:     ["None", "View own", "View", "Edit", "Send"],
  manageCrew: ["None", "View overtime", "Edit overtime", "Send notice"],
  generate:   ["None", "Edit own", "Edit"],
  approve:    ["None", "View", "Approve", "Export"],
};

const DEFAULT_PERMS = {
  "studio-supervisor":     { settings: ["Edit"],  calendar: ["Edit"],  offers: ["Edit", "Send"],      manageCrew: ["Edit overtime", "Send notice"], generate: [],                   approve: ["View"] },
  "production-supervisor": { settings: ["Edit"],  calendar: ["Edit"],  offers: ["Edit", "Send"],      manageCrew: ["Edit overtime", "Send notice"], generate: [],                   approve: ["Approve", "Export"] },
  "production-admin":      { settings: ["Edit"],  calendar: ["Edit"],  offers: ["Edit"],              manageCrew: ["Send notice"],                  generate: [],                   approve: ["View", "Export"] },
  "accounts-supervisor":   { settings: ["View"],  calendar: ["View"],  offers: ["Edit"],              manageCrew: ["View overtime"],                generate: [],                   approve: ["Approve", "Export"] },
  "accounts-admin":        { settings: ["View"],  calendar: ["View"],  offers: ["View"],              manageCrew: ["View overtime"],                generate: [],                   approve: ["View", "Export"] },
  "dept-supervisor":       { settings: ["None"],  calendar: ["View"],  offers: ["View own"],          manageCrew: ["None"],                         generate: [],                   approve: [] },
  "dept-supervisor-tc":    { settings: ["None"],  calendar: ["View"],  offers: ["View own"],          manageCrew: ["None"],                         generate: ["Edit own"],         approve: ["Approve"] },
  "dept-admin":            { settings: ["None"],  calendar: ["View"],  offers: ["View own"],          manageCrew: ["None"],                         generate: [],                   approve: [] },
  "dept-admin-tc":         { settings: ["None"],  calendar: ["View"],  offers: ["View own"],          manageCrew: ["None"],                         generate: ["Edit own"],         approve: ["View"] },
  "crew-member":           { settings: ["None"],  calendar: ["None"],  offers: ["None"],              manageCrew: ["None"],                         generate: [],                   approve: [] },
};

const ROLE_PRESETS = ["default", "tv", "commercial"];

const DEFAULT_ASSIGNMENTS = [
  { id: "ra1", name: "SARAH JOHNSON",    email: "sarah.johnson@studio.com",    roleId: "studio-supervisor",     department: "Production", status: "active" },
  { id: "ra2", name: "MICHAEL CHEN",     email: "michael.chen@studio.com",     roleId: "production-supervisor", department: "Production", status: "active" },
  { id: "ra3", name: "EMILY RODRIGUEZ",  email: "emily.rodriguez@studio.com",  roleId: "production-admin",      department: "Production", status: "active" },
  { id: "ra4", name: "DAVID WILLIAMS",   email: "david.williams@studio.com",   roleId: "accounts-supervisor",   department: "Accounts",   status: "active" },
  { id: "ra5", name: "JESSICA TAYLOR",   email: "jessica.taylor@studio.com",   roleId: "dept-supervisor",       department: "Camera",     status: "invited" },
  { id: "ra6", name: "JAMES BROWN",      email: "james.brown@studio.com",      roleId: "dept-admin-tc",         department: "Art",        status: "pending" },
];

const DEPARTMENTS = ["Production", "Accounts", "Camera", "Art", "Grip", "Electric", "Sound", "Costume", "Locations", "Transport", "Construction", "VFX"];

/* ─────────────────────────────────────────────────────────
   ADMIN TAB
───────────────────────────────────────────────────────── */
function AdminTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  /* ── Permissions state ── */
  const [perms, setPerms] = useState(() => loadSettings(projectId, "admin-perms", DEFAULT_PERMS));
  const [permPreset, setPermPreset] = useState("default");
  const [permSearch, setPermSearch] = useState("");

  const updatePerm = (roleId, colKey, vals) => {
    const n = { ...perms, [roleId]: { ...perms[roleId], [colKey]: vals } };
    setPerms(n);
    saveSettings(projectId, "admin-perms", n);
  };
  const restoreDefaults = () => { setPerms(DEFAULT_PERMS); saveSettings(projectId, "admin-perms", DEFAULT_PERMS); };

  const filteredRoles = ADMIN_ROLES.filter((r) =>
    !permSearch || r.name.toLowerCase().includes(permSearch.toLowerCase()) || r.desc.toLowerCase().includes(permSearch.toLowerCase())
  );

  /* ── Role Assignments state ── */
  const [assignments, setAssignments] = useState(() => loadSettings(projectId, "admin-assignments", DEFAULT_ASSIGNMENTS));
  const [showAddUser, setShowAddUser] = useState(false);
  const [assignSearch, setAssignSearch] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", roleId: "crew-member", department: "Production" });

  const saveAssignments = (a) => { setAssignments(a); saveSettings(projectId, "admin-assignments", a); };
  const addUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    saveAssignments([...assignments, { ...newUser, name: newUser.name.toUpperCase(), id: `ra${Date.now()}`, status: "invited" }]);
    setNewUser({ name: "", email: "", roleId: "crew-member", department: "Production" });
    setShowAddUser(false);
  };
  const removeUser = (id) => saveAssignments(assignments.filter((a) => a.id !== id));
  const updateAssignment = (id, roleId) => saveAssignments(assignments.map((a) => a.id === id ? { ...a, roleId } : a));
  const updateDepartment = (id, department) => saveAssignments(assignments.map((a) => a.id === id ? { ...a, department } : a));

  const filteredAssignments = assignments.filter((a) =>
    !assignSearch || a.name.toLowerCase().includes(assignSearch.toLowerCase()) ||
    a.email.toLowerCase().includes(assignSearch.toLowerCase()) ||
    a.department.toLowerCase().includes(assignSearch.toLowerCase())
  );

  /* ── Lock handler ── */
  const handleLock = () => setTabLockStatusById((prev) => ({ ...prev, [tabId]: !prev[tabId] }));

  /* ── Progress — all defaults pre-filled, always 100% ── */
  const progressPercentage = 100;

  useEffect(() => {
    setTabProgressById((prev) => ({ ...prev, [tabId]: progressPercentage }));
  }, [progressPercentage, tabId, setTabProgressById]);

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-5"
    >
      <TabHeader label="Admin" progressPercentage={progressPercentage} color={color} locked={locked} />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Role Permissions ── */}
        <SectionCard
          title="Role Permissions"
          description="Configure what each role can access and do."
          color={color}
          delay={0.05}
        >
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={permSearch} onChange={(e) => setPermSearch(e.target.value)} placeholder="Search roles..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 outline-none"
                style={{ fontSize: "0.6rem" }} />
            </div>
            <div className="relative w-40">
              <select value={permPreset} onChange={(e) => setPermPreset(e.target.value)} disabled={d}
                className="w-full pt-4 pb-1.5 px-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 appearance-none outline-none"
                style={{ fontSize: "0.6rem" }}>
                {ROLE_PRESETS.map((p) => <option key={p} value={p}>{p === "default" ? "Film Production (Default)" : p === "tv" ? "TV Series" : "Commercial / Short"}</option>)}
              </select>
              <label className="absolute left-3 pointer-events-none text-gray-400" style={{ top: 4, fontSize: "0.44rem" }}>Preset</label>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>
            <button onClick={restoreDefaults} disabled={d}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 transition-colors"
              style={{ fontSize: "0.54rem" }}>
              <RotateCcw className="w-3 h-3" /> Restore Defaults
            </button>
          </div>

          {/* Permissions table */}
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-x-auto">
            <table className="w-full" style={{ fontSize: "0.5rem" }}>
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30">
                  <th className="text-left px-3 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontSize: "0.42rem" }}>Role</th>
                  {PERM_COLS.map((c) => (
                    <th key={c.key} className="text-center px-2 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontSize: "0.42rem", minWidth: "80px" }}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="border-b border-gray-50 dark:border-gray-800/40 hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span>{role.icon}</span>
                        <div>
                          <span className="text-gray-700 dark:text-gray-300 block" style={{ fontSize: "0.54rem" }}>{role.name}</span>
                          <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.44rem" }}>{role.desc}</span>
                        </div>
                      </div>
                    </td>
                    {PERM_COLS.map((c) => (
                      <td key={c.key} className="px-2 py-2">
                        <PermCell
                          vals={perms[role.id]?.[c.key] ?? []}
                          options={PERM_OPTIONS[c.key]}
                          onChange={(v) => updatePerm(role.id, c.key, v)}
                          color={color}
                          disabled={d}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-400 dark:text-gray-500 mt-2 px-1" style={{ fontSize: "0.46rem" }}>
            * Department-level roles. Permissions apply within their own department only.
          </p>
        </SectionCard>

        {/* ── Section 2: Role Assignments ── */}
        <SectionCard
          title="Role Assignments"
          description="Assign team members to roles and departments. Users will receive invitations to join the project."
          color={color}
          delay={0.1}
        >
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={assignSearch} onChange={(e) => setAssignSearch(e.target.value)} placeholder="Search members..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 outline-none"
                style={{ fontSize: "0.6rem" }} />
            </div>
            <motion.button
              onClick={() => setShowAddUser(true)} disabled={d}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white shadow-sm transition-all"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, fontSize: "0.58rem" }}>
              <UserPlus className="w-3.5 h-3.5" /> Add Member
            </motion.button>
          </div>

          {/* Add User Form */}
          <AnimatePresence>
            {showAddUser && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="rounded-xl border-2 border-dashed p-4 space-y-3" style={{ borderColor: `${color}40`, backgroundColor: `${color}05` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300 uppercase tracking-wider" style={{ fontSize: "0.58rem" }}>New Member</span>
                    <button onClick={() => setShowAddUser(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Full Name *" value={newUser.name} onChange={(v) => setNewUser({ ...newUser, name: v })} color={color} required />
                    <InputField label="Email Address *" value={newUser.email} onChange={(v) => setNewUser({ ...newUser, email: v })} type="email" color={color} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <SelectField label="Role" value={newUser.roleId} onChange={(v) => setNewUser({ ...newUser, roleId: v })} options={ADMIN_ROLES} color={color} />
                    <SelectField label="Department" value={newUser.department} onChange={(v) => setNewUser({ ...newUser, department: v })} options={DEPARTMENTS} color={color} />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button onClick={() => setShowAddUser(false)}
                      className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 transition-colors"
                      style={{ fontSize: "0.58rem" }}>
                      Cancel
                    </button>
                    <motion.button onClick={addUser} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 rounded-xl text-white shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, fontSize: "0.58rem" }}>
                      <span className="flex items-center gap-1.5">
                        <Send className="w-3 h-3" /> Send Invitation
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Assignments table */}
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <table className="w-full" style={{ fontSize: "0.5rem" }}>
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30">
                  {["Member", "Role", "Department", "Status", ""].map((h, i) => (
                    <th key={i} className={`${i < 3 ? "text-left" : "text-center"} px-3 py-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider`} style={{ fontSize: "0.42rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.length === 0 && (
                  <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400" style={{ fontSize: "0.56rem" }}>No members found.</td></tr>
                )}
                {filteredAssignments.map((a) => {
                  const role = ADMIN_ROLES.find((r) => r.id === a.roleId);
                  return (
                    <motion.tr key={a.id} layout className="border-b border-gray-50 dark:border-gray-800/40 hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors">
                      {/* Member */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
                            style={{ background: `linear-gradient(135deg, ${color}, ${color}88)`, fontSize: "0.48rem" }}>
                            {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <span className="text-gray-700 dark:text-gray-300 block" style={{ fontSize: "0.56rem" }}>{a.name}</span>
                            <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.44rem" }}>{a.email}</span>
                          </div>
                        </div>
                      </td>
                      {/* Role dropdown */}
                      <td className="px-3 py-2.5">
                        <select value={a.roleId} onChange={(e) => updateAssignment(a.id, e.target.value)} disabled={d}
                          className="px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 outline-none appearance-none cursor-pointer"
                          style={{ fontSize: "0.5rem" }}>
                          {ADMIN_ROLES.map((r) => <option key={r.id} value={r.id}>{r.icon} {r.name}</option>)}
                        </select>
                      </td>
                      {/* Department dropdown */}
                      <td className="px-3 py-2.5">
                        <select value={a.department} onChange={(e) => updateDepartment(a.id, e.target.value)} disabled={d}
                          className="px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 outline-none appearance-none cursor-pointer"
                          style={{ fontSize: "0.5rem" }}>
                          {DEPARTMENTS.map((dp) => <option key={dp} value={dp}>{dp}</option>)}
                        </select>
                      </td>
                      {/* Status badge */}
                      <td className="px-3 py-2.5 text-center">
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
                          a.status === "active"  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600" :
                          a.status === "invited" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" :
                          "bg-amber-50 dark:bg-amber-900/30 text-amber-600"
                        )} style={{ fontSize: "0.46rem" }}>
                          <span className={cn("w-1.5 h-1.5 rounded-full",
                            a.status === "active"  ? "bg-emerald-400" :
                            a.status === "invited" ? "bg-blue-400" :
                            "bg-amber-400"
                          )} />
                          {a.status.toUpperCase()}
                        </span>
                      </td>
                      {/* Delete */}
                      <td className="px-2 py-2.5 text-center">
                        <button onClick={() => removeUser(a.id)} disabled={d}
                          className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-2.5 px-1">
            <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.46rem" }}>
              {assignments.length} member{assignments.length !== 1 ? "s" : ""} assigned · {assignments.filter((a) => a.status === "active").length} active
            </span>
            <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.46rem" }}>
              Invited members will receive an email to join this project
            </span>
          </div>
        </SectionCard>

      </div>

      <ActionFooter locked={locked} onLock={handleLock} color={color} progressPercentage={progressPercentage} />
    </motion.div>
  );
}

export default AdminTab;