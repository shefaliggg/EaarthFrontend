import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleCheck, Shield, Sparkles, Lock, Unlock, ArrowRight,
  Plus, Trash2, Eye, ChevronUp, ChevronDown, Pencil, Check, X, FileText,
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
   INLINE EDIT — click-to-rename a card title
───────────────────────────────────────────────────────── */
function InlineEdit({ value, onSave, className = "" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) { inputRef.current?.focus(); inputRef.current?.select(); }
  }, [editing]);

  const commit = () => {
    const t = draft.trim();
    if (t && t !== value) onSave(t); else setDraft(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1 min-w-0">
        <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
          onBlur={commit}
          className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 border rounded px-1.5 py-0.5 outline-none min-w-0 w-full"
          style={{ fontSize: "0.58rem", borderColor: "currentColor" }} />
        <button onClick={commit} className="shrink-0 text-emerald-500 hover:text-emerald-700"><Check className="h-3 w-3" /></button>
        <button onClick={() => { setDraft(value); setEditing(false); }} className="shrink-0 text-gray-400 hover:text-gray-600"><X className="h-3 w-3" /></button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 min-w-0 group/name">
      <span className={`truncate ${className}`}>{value}</span>
      <button onClick={() => { setDraft(value); setEditing(true); }}
        className="shrink-0 opacity-0 group-hover/name:opacity-100 transition-opacity text-gray-400 hover:text-purple-600">
        <Pencil className="h-2.5 w-2.5" />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FORM ROW — row inside a category or group card
───────────────────────────────────────────────────────── */
function FormRow({ form, formIdx, totalForms, color, disabled, onMove, onToggleDefault, onToggleLock, showDefault = true }) {
  return (
    <div
      className={cn("flex items-center justify-between py-1 group/row", form.isDefault && showDefault && "rounded -mx-1 px-1")}
      style={form.isDefault && showDefault ? { backgroundColor: `${color}08` } : {}}
    >
      {/* Left: reorder arrows + lock icon + name + default badge */}
      <div className="flex items-center gap-1 min-w-0">
        <div className="flex flex-col shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button onClick={() => onMove(formIdx, -1)} disabled={formIdx === 0}
            className="text-gray-400 hover:text-purple-600 disabled:opacity-20"><ChevronUp className="h-2.5 w-2.5" /></button>
          <button onClick={() => onMove(formIdx, 1)} disabled={formIdx === totalForms - 1}
            className="text-gray-400 hover:text-purple-600 disabled:opacity-20"><ChevronDown className="h-2.5 w-2.5" /></button>
        </div>
        {form.isLocked && <Lock className="h-2.5 w-2.5 text-amber-500 shrink-0" />}
        <span
          className={cn("truncate", form.isDefault && showDefault ? "text-purple-700 dark:text-purple-400" : "text-gray-600 dark:text-gray-400")}
          style={{ fontSize: "0.52rem" }}
        >
          {form.name}
        </span>
        {form.isDefault && showDefault && (
          <span className="shrink-0 px-1 py-px rounded uppercase tracking-wider text-white" style={{ fontSize: "0.36rem", background: color }}>
            Default
          </span>
        )}
      </div>

      {/* Right: Review + Default toggle + Lock toggle */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 cursor-pointer hover:bg-amber-100 transition-colors" style={{ fontSize: "0.4rem" }}>
          <Eye className="h-2.5 w-2.5" /> Review
        </span>
        {showDefault && (
          <button onClick={() => onToggleDefault(formIdx)} disabled={disabled}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors"
            style={form.isDefault ? { backgroundColor: `${color}25`, color, fontSize: "0.4rem" } : { backgroundColor: "#f3f4f6", color: "#9ca3af", fontSize: "0.4rem" }}>
            <Shield className="h-2.5 w-2.5" /> {form.isDefault ? "Unset" : "Default"}
          </button>
        )}
        <button onClick={() => onToggleLock(formIdx)} disabled={disabled}
          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors"
          style={form.isLocked ? { backgroundColor: "#fef3c7", color: "#b45309", fontSize: "0.4rem" } : { backgroundColor: "#f3f4f6", color: "#9ca3af", fontSize: "0.4rem" }}>
          {form.isLocked ? <Lock className="h-2.5 w-2.5" /> : <Unlock className="h-2.5 w-2.5" />}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STATIC DATA — matches TypeScript source exactly
───────────────────────────────────────────────────────── */
const CF_PAY_TYPES = [
  { code: "W-PAYE", label: "Weekly PAYE" },
  { code: "W-SE",   label: "Weekly Self-Employed" },
  { code: "W-DH",   label: "Weekly Direct Hire" },
  { code: "W-LO",   label: "Weekly Loan Out" },
  { code: "D-PAYE", label: "Daily PAYE" },
  { code: "D-SE",   label: "Daily Self-Employed" },
  { code: "D-DH",   label: "Daily Direct Hire" },
  { code: "D-LO",   label: "Daily Loan Out" },
];

const CF_DEPARTMENTS = ["Standard Crew", "Senior / Buyout", "Construction", "Electrical", "HOD", "Rigging", "Transport"];

const CF_CAT_DATA = [
  { name: "Standard Crew",   items: ["Weekly PAYE","Weekly Self-Employed","Weekly Direct Hire","Weekly Loan Out","Daily PAYE","Daily Self-Employed","Daily Direct Hire","Daily Loan Out"] },
  { name: "Senior / Buyout", items: ["Weekly PAYE","Weekly Self-Employed","Weekly Direct Hire","Weekly Loan Out","Daily PAYE","Daily Self-Employed","Daily Direct Hire","Daily Loan Out"] },
  { name: "Construction",    items: ["Weekly PAYE","Weekly Self-Employed","Weekly Direct Hire","Weekly Loan Out","Daily PAYE","Daily Self-Employed","Daily Direct Hire"] },
  { name: "Electrical",      items: ["Weekly PAYE","Weekly Self-Employed","Weekly Direct Hire","Weekly Loan Out","Daily PAYE","Daily Self-Employed","Daily Direct Hire"] },
  { name: "HOD",             items: ["Weekly PAYE","Weekly Self-Employed","Weekly Direct Hire","Weekly Loan Out","Daily PAYE","Daily Self-Employed","Daily Direct Hire","Daily Loan Out"] },
  { name: "Rigging",         items: ["Weekly PAYE","Weekly Self-Employed","Weekly Direct Hire","Weekly Loan Out","Daily PAYE","Daily Self-Employed","Daily Direct Hire","Daily Loan Out"] },
  { name: "Transport",       items: ["Weekly PAYE","Weekly Self-Employed","Weekly Direct Hire","Weekly Loan Out","Daily PAYE","Daily Self-Employed","Daily Direct Hire","Daily Loan Out"] },
];

const CF_FORM_GROUPS_DATA = [
  {
    name: "Contractual Forms",
    forms: [
      { name: "Box Rental",            isDefault: true,  isLocked: true  },
      { name: "Computer Allowance",    isDefault: true,  isLocked: true  },
      { name: "Crew Information Form", isDefault: true,  isLocked: true  },
      { name: "Software Allowance",    isDefault: false, isLocked: false },
      { name: "Equipment Rental",      isDefault: false, isLocked: false },
      { name: "Mobile Allowance",      isDefault: true,  isLocked: false },
      { name: "Vehicle Allowance",     isDefault: false, isLocked: false },
      { name: "Living Allowance",      isDefault: false, isLocked: false },
      { name: "Deal Memo (PACT/BECTU)",isDefault: false, isLocked: false },
      { name: "Status Determination",  isDefault: false, isLocked: false },
      { name: "Start Form",            isDefault: true,  isLocked: false },
    ],
  },
  {
    name: "Standard Forms",
    forms: [
      { name: "Child Protection Declaration", isDefault: false, isLocked: false },
      { name: "Conflict of Interest",         isDefault: false, isLocked: false },
      { name: "Driver Declaration",           isDefault: false, isLocked: false },
      { name: "NDA / Confidentiality",        isDefault: true,  isLocked: true  },
      { name: "Policy Acknowledgement",       isDefault: true,  isLocked: true  },
      { name: "Self-Assessment Declaration",  isDefault: false, isLocked: false },
    ],
  },
  {
    name: "Tax & Compliance",
    forms: [
      { name: "W-4 (Federal)",       isDefault: false, isLocked: false },
      { name: "I-9",                 isDefault: false, isLocked: false },
      { name: "State Tax Exemption", isDefault: false, isLocked: false },
    ],
  },
  {
    name: "Insurance & Legal",
    forms: [
      { name: "Certificate of Insurance", isDefault: false, isLocked: false },
      { name: "Child Support Notice",     isDefault: false, isLocked: false },
      { name: "Direct Deposit",           isDefault: false, isLocked: false },
    ],
  },
  {
    name: "Welfare & State",
    forms: [
      { name: "Disability Disclosure", isDefault: false, isLocked: false },
      { name: "Emergency Contact",     isDefault: false, isLocked: false },
      { name: "Picture ID Release",    isDefault: false, isLocked: false },
    ],
  },
];

/* Template form sets per pay type */
const CF_TEMPLATE_FORMS_MAP = {
  PAYE: [
    { name: "Box Rental", isDefault: true }, { name: "Computer Allowance", isDefault: true },
    { name: "Crew Information Form", isDefault: true }, { name: "Mobile Allowance", isDefault: true },
    { name: "NDA / Confidentiality", isDefault: true }, { name: "Policy Acknowledgement", isDefault: true },
    { name: "PAYE Contract", isDefault: true }, { name: "Start Form", isDefault: true },
  ],
  "Self-Employed": [
    { name: "Box Rental", isDefault: true }, { name: "Computer Allowance", isDefault: true },
    { name: "Crew Information Form", isDefault: true }, { name: "Mobile Allowance", isDefault: true },
    { name: "NDA / Confidentiality", isDefault: true }, { name: "Policy Acknowledgement", isDefault: true },
    { name: "Self-Employed Contract", isDefault: true }, { name: "Self-Assessment Declaration", isDefault: true },
    { name: "Certificate of Insurance", isDefault: true },
  ],
  "Direct Hire": [
    { name: "Box Rental", isDefault: true }, { name: "Computer Allowance", isDefault: true },
    { name: "Crew Information Form", isDefault: true }, { name: "Mobile Allowance", isDefault: true },
    { name: "NDA / Confidentiality", isDefault: true }, { name: "Policy Acknowledgement", isDefault: true },
    { name: "Direct Hire Agreement", isDefault: true }, { name: "Start Form", isDefault: true },
  ],
  "Loan Out": [
    { name: "Box Rental", isDefault: true }, { name: "Loan Out Agreement", isDefault: true },
    { name: "Certificate of Insurance", isDefault: true }, { name: "Company Details Form", isDefault: true },
    { name: "NDA / Confidentiality", isDefault: true },
  ],
};

function cfGetForms(code) {
  if (code.includes("PAYE")) return CF_TEMPLATE_FORMS_MAP["PAYE"];
  if (code.includes("SE") || code.includes("Self-Employed")) return CF_TEMPLATE_FORMS_MAP["Self-Employed"];
  if (code.includes("DH") || code.includes("Direct Hire")) return CF_TEMPLATE_FORMS_MAP["Direct Hire"];
  if (code.includes("LO") || code.includes("Loan Out")) return CF_TEMPLATE_FORMS_MAP["Loan Out"];
  return CF_TEMPLATE_FORMS_MAP["PAYE"];
}

function generateBundles() {
  const r = [];
  let i = 0;
  for (const dept of CF_DEPARTMENTS) {
    for (const pt of CF_PAY_TYPES) {
      i++;
      r.push({ id: `tb${i}`, name: `${pt.label} ${dept}`, tag: pt.label.toUpperCase(), department: dept, payType: pt.code, defaultForms: cfGetForms(pt.code) });
    }
  }
  return r;
}
const ALL_BUNDLES = generateBundles();

function initCats() {
  return CF_CAT_DATA.map((c, i) => ({
    id: `cat${i}`, name: c.name,
    forms: c.items.map((item) => ({ name: item, isDefault: false, isLocked: false, status: "pending" })),
  }));
}

function initGroups() {
  return CF_FORM_GROUPS_DATA.map((g, i) => ({
    id: `fg${i}`, name: g.name,
    forms: g.forms.map((f) => ({ name: f.name, isDefault: f.isDefault, isLocked: f.isLocked, status: "view" })),
  }));
}

/* ─────────────────────────────────────────────────────────
   CONTRACTS & FORMS TAB
───────────────────────────────────────────────────────── */
function ContractsFormsTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  /* ── Categories state ── */
  const [cats, setCats] = useState(() => loadSettings(projectId, "cf-cats", initCats()));
  const saveCats = (c) => { setCats(c); saveSettings(projectId, "cf-cats", c); };

  const addCategory = () =>
    saveCats([...cats, { id: `cat${Date.now()}`, name: `New Category ${cats.length + 1}`, forms: CF_PAY_TYPES.map((pt) => ({ name: pt.label, isDefault: false, isLocked: false, status: "pending" })) }]);

  const renameCategory = (id, n) => saveCats(cats.map((c) => (c.id === id ? { ...c, name: n } : c)));

  const addCatForm = (catId) =>
    saveCats(cats.map((c) => c.id === catId ? { ...c, forms: [...c.forms, { name: "New Form", isDefault: false, isLocked: false, status: "pending" }] } : c));

  const moveCatForm = (catId, idx, dir) =>
    saveCats(cats.map((c) => {
      if (c.id !== catId) return c;
      const nI = idx + dir;
      if (nI < 0 || nI >= c.forms.length) return c;
      const fs = [...c.forms]; [fs[idx], fs[nI]] = [fs[nI], fs[idx]]; return { ...c, forms: fs };
    }));

  const toggleCatDefault = (catId, idx) =>
    saveCats(cats.map((c) => { if (c.id !== catId) return c; const fs = [...c.forms]; fs[idx] = { ...fs[idx], isDefault: !fs[idx].isDefault }; return { ...c, forms: fs }; }));

  const toggleCatLock = (catId, idx) =>
    saveCats(cats.map((c) => { if (c.id !== catId) return c; const fs = [...c.forms]; fs[idx] = { ...fs[idx], isLocked: !fs[idx].isLocked }; return { ...c, forms: fs }; }));

  /* ── Form Groups state ── */
  const [groups, setGroups] = useState(() => loadSettings(projectId, "cf-groups", initGroups()));
  const saveGroups = (g) => { setGroups(g); saveSettings(projectId, "cf-groups", g); };

  const addGroup = () =>
    saveGroups([...groups, { id: `fg${Date.now()}`, name: `New Form Group ${groups.length + 1}`, forms: [{ name: "New Form", isDefault: false, isLocked: false, status: "pending" }] }]);

  const renameGroup = (id, n) => saveGroups(groups.map((g) => (g.id === id ? { ...g, name: n } : g)));

  const addGroupForm = (gId) =>
    saveGroups(groups.map((g) => g.id === gId ? { ...g, forms: [...g.forms, { name: "New Form", isDefault: false, isLocked: false, status: "pending" }] } : g));

  const moveGroupForm = (gId, idx, dir) =>
    saveGroups(groups.map((g) => {
      if (g.id !== gId) return g;
      const nI = idx + dir;
      if (nI < 0 || nI >= g.forms.length) return g;
      const fs = [...g.forms]; [fs[idx], fs[nI]] = [fs[nI], fs[idx]]; return { ...g, forms: fs };
    }));

  const toggleGroupDefault = (gId, idx) =>
    saveGroups(groups.map((g) => { if (g.id !== gId) return g; const fs = [...g.forms]; fs[idx] = { ...fs[idx], isDefault: !fs[idx].isDefault }; return { ...g, forms: fs }; }));

  const toggleGroupLock = (gId, idx) =>
    saveGroups(groups.map((g) => { if (g.id !== gId) return g; const fs = [...g.forms]; fs[idx] = { ...fs[idx], isLocked: !fs[idx].isLocked }; return { ...g, forms: fs }; }));

  /* ── Bundle filter ── */
  const [bundleFilter, setBundleFilter] = useState("All");
  const filteredBundles = bundleFilter === "All" ? ALL_BUNDLES : ALL_BUNDLES.filter((b) => b.department === bundleFilter);

  /* Derived: default forms from groups + cats (shown inside every bundle card) */
  const defaultGroupForms = groups.flatMap((g) => g.forms.filter((f) => f.isDefault).map((f) => ({ name: f.name, isLocked: f.isLocked })));
  const defaultCatForms = cats.flatMap((c) => c.forms.filter((f) => f.isDefault).map((f) => ({ name: f.name, isLocked: f.isLocked })));

  /* ── Lock handler ── */
  const handleLock = () => setTabLockStatusById((prev) => ({ ...prev, [tabId]: !prev[tabId] }));

  /* ── Progress — all fields have defaults, always 100% ── */
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
      <TabHeader label="Contracts & Forms" progressPercentage={progressPercentage} color={color} locked={locked} />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Contract Form Categories ── */}
        <SectionCard
          title="Contract Form Categories"
          description="Department-based contract form categories with per-form upload and default status."
          color={color}
          delay={0.05}
        >
          <div className="flex items-center justify-end mb-3">
            <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.48rem" }}>
              {cats.length} department{cats.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {cats.map((cat) => (
              <div key={cat.id}
                className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-gray-900/20 hover:border-purple-200 dark:hover:border-purple-800 transition-colors group/card">
                <div className="flex items-center justify-between px-3 pt-3 pb-2 gap-1">
                  <InlineEdit value={cat.name} onSave={(n) => renameCategory(cat.id, n)} className="text-gray-800 dark:text-gray-200 uppercase" />
                  <button onClick={() => addCatForm(cat.id)} disabled={d}
                    className="shrink-0 text-purple-600 hover:text-purple-700 transition-colors">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="h-px mx-3" style={{ background: `linear-gradient(to right, ${color}40, ${color}15, transparent)` }} />
                <div className="px-3 py-2 space-y-0.5">
                  {cat.forms.map((f, fi) => (
                    <FormRow key={`${cat.id}-${fi}`} form={f} formIdx={fi} totalForms={cat.forms.length} color={color} disabled={d}
                      onMove={(i, dir) => moveCatForm(cat.id, i, dir)}
                      onToggleDefault={(i) => toggleCatDefault(cat.id, i)}
                      onToggleLock={(i) => toggleCatLock(cat.id, i)}
                      showDefault={false} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!d && (
            <button onClick={addCategory}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
              style={{ fontSize: "0.56rem", borderColor: `${color}40` }}>
              <Plus className="h-3.5 w-3.5" /> Add Category
            </button>
          )}
        </SectionCard>

        {/* ── Section 2: Contract Form Groups ── */}
        <SectionCard
          title="Contract Form Groups"
          description="Organised form groups with default and lock controls for cross-bundle inheritance."
          color={color}
          delay={0.1}
        >
          <div className="flex items-center justify-end mb-3">
            <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.48rem" }}>
              {groups.length} group{groups.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {groups.map((grp) => (
              <div key={grp.id}
                className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-gray-900/20 hover:border-purple-200 dark:hover:border-purple-800 transition-colors group/card">
                <div className="flex items-center justify-between px-3 pt-3 pb-2 gap-1">
                  <InlineEdit value={grp.name} onSave={(n) => renameGroup(grp.id, n)} className="text-gray-800 dark:text-gray-200 uppercase" />
                  <button onClick={() => addGroupForm(grp.id)} disabled={d}
                    className="shrink-0 text-purple-600 hover:text-purple-700 transition-colors">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <div className="h-px mx-3" style={{ background: `linear-gradient(to right, ${color}40, ${color}15, transparent)` }} />
                <div className="px-3 py-2 space-y-0.5">
                  {grp.forms.map((f, fi) => (
                    <FormRow key={`${grp.id}-${fi}`} form={f} formIdx={fi} totalForms={grp.forms.length} color={color} disabled={d}
                      onMove={(i, dir) => moveGroupForm(grp.id, i, dir)}
                      onToggleDefault={(i) => toggleGroupDefault(grp.id, i)}
                      onToggleLock={(i) => toggleGroupLock(grp.id, i)} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!d && (
            <button onClick={addGroup}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
              style={{ fontSize: "0.56rem", borderColor: `${color}40` }}>
              <Plus className="h-3.5 w-3.5" /> Add Group
            </button>
          )}
        </SectionCard>

        {/* ── Section 3: Contract Template Bundles ── */}
        <SectionCard
          title="Contract Template Bundles"
          description={`Auto-generated from categories × form types — ${filteredBundles.length} bundles`}
          color={color}
          delay={0.15}
        >
          {/* Department filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {["All", ...CF_DEPARTMENTS].map((dept) => (
              <button key={dept} onClick={() => setBundleFilter(dept)}
                className="px-2.5 py-1 rounded-full transition-all"
                style={bundleFilter === dept
                  ? { background: color, color: "white", fontSize: "0.5rem" }
                  : { background: "#f3f4f6", color: "#6b7280", fontSize: "0.5rem" }}>
                {dept}
              </button>
            ))}
          </div>

          {/* Bundle cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredBundles.map((tb) => (
              <div key={tb.id}
                className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-gray-900/20 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-sm transition-all">
                {/* Bundle header */}
                <div className="flex items-center justify-between px-3 pt-3 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-3.5 w-3.5 shrink-0" style={{ color: `${color}80` }} />
                    <span className="text-gray-800 dark:text-gray-200 truncate" style={{ fontSize: "0.52rem" }}>{tb.name}</span>
                  </div>
                  <span className="shrink-0 ml-2 px-2 py-0.5 rounded-full border uppercase tracking-wider whitespace-nowrap"
                    style={{ borderColor: `${color}50`, color, fontSize: "0.38rem" }}>
                    {tb.tag}
                  </span>
                </div>
                <div className="h-px mx-3" style={{ background: `linear-gradient(to right, ${color}60, ${color}20, transparent)` }} />

                {/* Forms list */}
                <div className="px-3 py-2.5">
                  {/* Default group forms (inherited) */}
                  {defaultGroupForms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {defaultGroupForms.map((gf, i) => (
                        <div key={`gf-${i}`} className="flex items-center gap-0.5 px-1.5 py-1 rounded-md border"
                          style={{ backgroundColor: `${color}08`, borderColor: `${color}25` }}>
                          {gf.isLocked ? <Lock className="h-2 w-2 text-amber-500" /> : <Shield className="h-2 w-2" style={{ color: `${color}60` }} />}
                          <span className="uppercase tracking-wide" style={{ fontSize: "0.38rem", color }}>{gf.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Default cat forms (inherited) */}
                  {defaultCatForms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {defaultCatForms.map((cf, i) => (
                        <div key={`cf-${i}`} className="flex items-center gap-0.5 px-1.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                          {cf.isLocked ? <Lock className="h-2 w-2 text-amber-500" /> : <Shield className="h-2 w-2 text-indigo-400" />}
                          <span className="text-indigo-700 dark:text-indigo-400 uppercase tracking-wide" style={{ fontSize: "0.38rem" }}>{cf.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Bundle's own default forms */}
                  <div className="flex flex-wrap gap-1">
                    {tb.defaultForms.filter((f) => f.isDefault).map((f, i) => (
                      <div key={i} className="flex items-center gap-1 px-1.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
                        <FileText className="h-2.5 w-2.5" style={{ color: `${color}60` }} />
                        <span className="text-gray-600 dark:text-gray-400 uppercase tracking-wide" style={{ fontSize: "0.38rem" }}>{f.name}</span>
                      </div>
                    ))}
                  </div>
                  {/* Optional forms */}
                  {tb.defaultForms.some((f) => !f.isDefault) && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tb.defaultForms.filter((f) => !f.isDefault).map((f, i) => (
                        <div key={i} className="flex items-center gap-1 px-1.5 py-1 rounded-md bg-white dark:bg-gray-900/40 border border-dashed border-gray-200 dark:border-gray-700">
                          <FileText className="h-2.5 w-2.5 text-gray-300" />
                          <span className="text-gray-400 uppercase tracking-wide" style={{ fontSize: "0.38rem" }}>{f.name}</span>
                          <span className="text-gray-300" style={{ fontSize: "0.32rem" }}>Opt</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Coloured bottom accent bar */}
                <div className="h-1 rounded-b-xl" style={{ background: `linear-gradient(to right, ${color}, ${color}40, transparent)` }} />
              </div>
            ))}
          </div>
        </SectionCard>

      </div>

      <ActionFooter locked={locked} onLock={handleLock} color={color} progressPercentage={progressPercentage} />
    </motion.div>
  );
}

export default ContractsFormsTab;