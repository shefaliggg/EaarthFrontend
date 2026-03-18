import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleCheck, Shield, Sparkles, Lock, Unlock, ArrowRight,
  Plus, Trash2, Search, Mail, Clock, Edit3, ShieldCheck, ChevronRight,
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
   PERMISSION BADGE — coloured pill shown for active perms
───────────────────────────────────────────────────────── */
function PermissionBadge({ label, active, color }) {
  if (!active) return null;
  return (
    <span className="px-1.5 py-0.5 rounded text-white uppercase" style={{ background: color, fontSize: "0.42rem" }}>
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   DEFAULT DATA — matches TypeScript source exactly
───────────────────────────────────────────────────────── */
const DEFAULT_SIGNERS = [
  {
    id: "s1", name: "SHEERIN KHOSROWSHAHI", role: "UPM - UNIT PRODUCTION MANAGER",
    email: "sheerin@project.com", department: "PRODUCTION", order: 1, hasSignature: true, requiresApproval: false,
    limit: 5000,
    permissions: { timesheets: true, expenses: true, callSheets: false, scheduleChanges: false, invoices: false, purchaseOrders: false, contracts: false },
  },
  {
    id: "s2", name: "JOHN ALFRED", role: "FOCUS EXECUTIVE",
    email: "john.alfred@focusfeatures.com", department: "ACCOUNTS", order: 2, hasSignature: true, requiresApproval: false,
    limit: 50000,
    permissions: { timesheets: false, expenses: true, callSheets: false, scheduleChanges: false, invoices: true, purchaseOrders: true, contracts: true },
  },
  {
    id: "s3", name: "JASON LEIB", role: "FOCUS EXECUTIVE",
    email: "jason.leib@focusfeatures.com", department: "POST PRODUCTION", order: 3, hasSignature: false, requiresApproval: true,
    limit: 10000,
    permissions: { timesheets: true, expenses: true, callSheets: false, scheduleChanges: true, invoices: false, purchaseOrders: false, contracts: false },
  },
  {
    id: "s4", name: "DAN PALMER", role: "FIRST AD",
    email: "dan.palmer@project.com", department: "PRODUCTION", order: 1, hasSignature: true, requiresApproval: false,
    permissions: { timesheets: true, expenses: false, callSheets: true, scheduleChanges: true, invoices: false, purchaseOrders: false, contracts: false },
  },
  {
    id: "s5", name: "PAYROLL REVIEW", role: "PAYROLL REVIEW",
    email: "payroll@project.com", department: "ACCOUNTS", order: 2, hasSignature: true, requiresApproval: false,
    permissions: { timesheets: true, expenses: true, callSheets: false, scheduleChanges: false, invoices: false, purchaseOrders: false, contracts: false },
  },
];

const DEFAULT_WORKFLOWS = [
  {
    id: "wf1", name: "TIMESHEET APPROVAL - PRODUCTION", department: "PRODUCTION", requiresAll: true,
    steps: [
      { signer: "DAN PALMER", role: "FIRST AD", required: true },
      { signer: "SHEERIN KHOSROWSHAHI", role: "UPM - UNIT PRODUCTION MANAGER", required: true },
      { signer: "PAYROLL REVIEW", role: "PAYROLL REVIEW", required: true },
    ],
  },
  {
    id: "wf2", name: "EXPENSE APPROVAL - ACCOUNTS", department: "ACCOUNTS", requiresAll: false,
    steps: [
      { signer: "SHEERIN KHOSROWSHAHI", role: "UPM - UNIT PRODUCTION MANAGER", required: true, limit: 5000 },
      { signer: "JOHN ALFRED", role: "FOCUS EXECUTIVE", required: true, limit: 50000 },
    ],
  },
  {
    id: "wf3", name: "INVOICE APPROVAL - ACCOUNTS", department: "ACCOUNTS", requiresAll: true,
    steps: [
      { signer: "JOHN ALFRED", role: "FOCUS EXECUTIVE", required: true },
    ],
  },
];

const DEPARTMENTS = ["ALL DEPARTMENTS", "PRODUCTION", "ACCOUNTS", "POST PRODUCTION", "CONSTRUCTION"];

/* ─────────────────────────────────────────────────────────
   DOC SIGNERS TAB
───────────────────────────────────────────────────────── */
function DocSignersTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  /* ── Signers ── */
  const [signers, setSigners] = useState(() =>
    loadSettings(projectId, "doc-signers", DEFAULT_SIGNERS),
  );
  const saveSigners = (s) => { setSigners(s); saveSettings(projectId, "doc-signers", s); };
  const deleteSigner = (id) => saveSigners(signers.filter((s) => s.id !== id));

  /* ── Workflows ── */
  const [workflows, setWorkflows] = useState(() =>
    loadSettings(projectId, "doc-workflows", DEFAULT_WORKFLOWS),
  );
  const saveWorkflows = (w) => { setWorkflows(w); saveSettings(projectId, "doc-workflows", w); };
  const deleteWorkflow = (id) => saveWorkflows(workflows.filter((w) => w.id !== id));

  /* ── Search / filter ── */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL DEPARTMENTS");

  const filteredSigners = signers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "ALL DEPARTMENTS" || s.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  /* ── Lock handler ── */
  const handleLock = () =>
    setTabLockStatusById((prev) => ({ ...prev, [tabId]: !prev[tabId] }));

  /* ── Progress ──
     100% if ≥2 signers AND ≥1 workflow
     50%  if either condition met
     0%   if both empty                          */
  const progressPercentage =
    signers.length >= 2 && workflows.length >= 1 ? 100
    : signers.length >= 1 || workflows.length >= 1 ? 50
    : 0;

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
      <TabHeader label="Signatures & Workflow" progressPercentage={progressPercentage} color={color} locked={locked} />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Authorised Signers ── */}
        <SectionCard
          title="Authorised Signers"
          description="Manage who can approve timesheets, expenses, and other documents."
          color={color}
          delay={0.05}
        >
          <div className="space-y-3">

            {/* Search + filter bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH SIGNERS..."
                  disabled={d}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 placeholder:text-gray-400 outline-none disabled:opacity-40 uppercase"
                  style={{ fontSize: "0.56rem" }}
                />
              </div>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                disabled={d}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 outline-none disabled:opacity-40 uppercase appearance-none"
                style={{ fontSize: "0.56rem" }}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Signers list */}
            <div className="space-y-2">
              <AnimatePresence>
                {filteredSigners.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white uppercase shrink-0"
                          style={{ background: color, fontSize: "0.6rem" }}>
                          {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Name + dept badge + signature status */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="text-gray-800 dark:text-gray-200 font-semibold uppercase" style={{ fontSize: "0.62rem" }}>
                              {s.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-white uppercase" style={{ background: color, fontSize: "0.4rem" }}>
                              {s.department}
                            </span>
                            {s.hasSignature ? (
                              <span className="px-1.5 py-0.5 rounded bg-green-500 text-white uppercase" style={{ fontSize: "0.4rem" }}>
                                ✓ Has Signature
                              </span>
                            ) : s.requiresApproval ? (
                              <span className="px-1.5 py-0.5 rounded bg-orange-500 text-white uppercase" style={{ fontSize: "0.4rem" }}>
                                Requires 2nd Approval
                              </span>
                            ) : null}
                          </div>

                          {/* Role */}
                          <div className="text-gray-600 dark:text-gray-400 uppercase mb-1.5" style={{ fontSize: "0.52rem" }}>
                            {s.role}
                          </div>

                          {/* Email */}
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500 mb-2" style={{ fontSize: "0.5rem" }}>
                            <Mail className="w-3 h-3" />
                            {s.email}
                          </div>

                          {/* Permission badges */}
                          <div className="flex flex-wrap gap-1.5">
                            <PermissionBadge label="Timesheets"       active={s.permissions.timesheets}     color={color} />
                            <PermissionBadge label="Expenses"         active={s.permissions.expenses}       color={color} />
                            <PermissionBadge label="Call Sheets"      active={s.permissions.callSheets}     color={color} />
                            <PermissionBadge label="Schedule Changes" active={s.permissions.scheduleChanges} color={color} />
                            <PermissionBadge label="Invoices"         active={s.permissions.invoices}       color={color} />
                            <PermissionBadge label="Purchase Orders"  active={s.permissions.purchaseOrders} color={color} />
                            <PermissionBadge label="Contracts"        active={s.permissions.contracts}      color={color} />
                          </div>
                        </div>
                      </div>

                      {/* Edit + delete buttons */}
                      {!d && (
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSigner(s.id)}
                            className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Approval limit + order footer */}
                    {s.limit && (
                      <div className="flex items-center justify-between text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <span className="uppercase" style={{ fontSize: "0.48rem" }}>
                          Limit: £{s.limit.toLocaleString()}
                        </span>
                        <span className="uppercase" style={{ fontSize: "0.48rem" }}>
                          Order: {s.order}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredSigners.length === 0 && (
                <p className="text-center text-gray-400 dark:text-gray-500 py-4" style={{ fontSize: "0.58rem" }}>
                  No signers match your search.
                </p>
              )}
            </div>

            {/* Add signer button (placeholder — no form yet, matching TS source) */}
            {!d && (
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                style={{ fontSize: "0.56rem" }}
              >
                <Plus className="w-3 h-3" />
                <span className="uppercase">Add Signer</span>
              </motion.button>
            )}
          </div>
        </SectionCard>

        {/* ── Section 2: Approval Workflows ── */}
        <SectionCard
          title="Approval Workflows"
          description="Configure approval chains for timesheets, expenses, and more."
          color={color}
          delay={0.1}
        >
          <div className="space-y-3">

            {/* Workflow cards */}
            <div className="space-y-2">
              <AnimatePresence>
                {workflows.map((wf, i) => (
                  <motion.div
                    key={wf.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 p-4"
                  >
                    {/* Workflow header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-purple-500 shrink-0" />
                          <span className="text-gray-800 dark:text-gray-200 font-semibold uppercase" style={{ fontSize: "0.62rem" }}>
                            {wf.name}
                          </span>
                        </div>
                        <div className="text-gray-500 dark:text-gray-500 uppercase" style={{ fontSize: "0.5rem" }}>
                          Department: {wf.department}
                        </div>
                      </div>
                      {!d && (
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteWorkflow(wf.id)}
                            className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Step chain */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      {wf.steps.map((step, si) => (
                        <div key={si} className="flex items-center gap-2">
                          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="px-1.5 py-0.5 rounded text-white uppercase"
                                style={{ background: step.required ? "#dc2626" : color, fontSize: "0.38rem" }}>
                                Step {si + 1}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase"
                                style={{ fontSize: "0.38rem" }}>
                                {step.required ? "Required" : "Optional"}
                              </span>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 font-semibold uppercase mb-0.5" style={{ fontSize: "0.54rem" }}>
                              {step.signer}
                            </div>
                            <div className="text-gray-500 dark:text-gray-500 uppercase" style={{ fontSize: "0.46rem" }}>
                              {step.role}
                            </div>
                            {step.limit && (
                              <div className="text-orange-500 uppercase mt-1" style={{ fontSize: "0.46rem" }}>
                                Up to £{step.limit.toLocaleString()}
                              </div>
                            )}
                          </div>
                          {si < wf.steps.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Footer: requires all / any */}
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800" style={{ fontSize: "0.48rem" }}>
                      <ShieldCheck className="w-3 h-3" />
                      <span className="uppercase">
                        {wf.requiresAll ? "All approvals required" : "Any approval accepted"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Add workflow button */}
            {!d && (
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                style={{ fontSize: "0.56rem" }}
              >
                <Plus className="w-3 h-3" />
                <span className="uppercase">New Workflow</span>
              </motion.button>
            )}
          </div>
        </SectionCard>

      </div>

      <ActionFooter locked={locked} onLock={handleLock} color={color} progressPercentage={progressPercentage} />
    </motion.div>
  );
}

export default DocSignersTab;