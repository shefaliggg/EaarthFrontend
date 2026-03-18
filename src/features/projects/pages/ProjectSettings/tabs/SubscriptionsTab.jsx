import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleCheck,
  Shield,
  Sparkles,
  Lock,
  Unlock,
  ArrowRight,
  HelpCircle,
  Check,
  X,
  Mail,
  DollarSign,
  Send,
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
   ACTION FOOTER
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
   SECTION CARD
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
   STATIC DATA
───────────────────────────────────────────────────────── */
const INIT_SUB_MODULES = [
  { id: "project-setup",       name: "Project set-up",                    unitPrice: "£ 710",   csvPrice: "-",        dateFrom: "", dateTo: "", selected: false, noDateTo: true },
  { id: "tc-basic",            name: "Timecard - Basic",                   unitPrice: "£ 1,090", csvPrice: "£ 155",    dateFrom: "", dateTo: "", selected: false, tooltip: "Record working times of crew, and calculate penalties & OT per your deal." },
  { id: "tc-standard",         name: "Timecard - Standard",                unitPrice: "£ 1,310", csvPrice: "£ 105",    dateFrom: "", dateTo: "", selected: false, tooltip: "As per the 'Basic' plan, plus calculate payments due." },
  { id: "tc-premium",          name: "Timecard - Premium",                 unitPrice: "£ 1,525", csvPrice: "Included", dateFrom: "", dateTo: "", selected: false, tooltip: "As per the 'Standard' plan, plus export Payroll CSV in the format of your chosen payroll vendor." },
  { id: "tc-share-pdf",        name: "Timecard - Share PDF",               unitPrice: "£ 310",   csvPrice: "-",        dateFrom: "", dateTo: "", selected: false, tooltip: "Accounts can share approved Timecard PDFs with crew to help them raise their invoice." },
  { id: "crew-csv",            name: "Crew data CSV",                      unitPrice: "-",       csvPrice: "£ 210",    dateFrom: "", dateTo: "", selected: false, tooltip: "Accounts can export all crew or new starters in a CSV in the format of your chosen payroll vendor." },
  { id: "reports",             name: "Reports",                            unitPrice: "£ 465",   csvPrice: "-",        dateFrom: "", dateTo: "", selected: false, tooltip: "Pre-defined CSV exports of various data including 'Unit List', 'Vehicle List', 'Emergency contacts', 'Number of Days Worked' etc." },
  { id: "reports-discount",    name: "During a Timecard month",            unitPrice: "- 20%",   csvPrice: "-",        dateFrom: "", dateTo: "", selected: false, isDiscount: true },
  { id: "send",                name: "Send",                               unitPrice: "£ 780",   csvPrice: "-",        dateFrom: "", dateTo: "", selected: false, tooltip: "Securely send messages and watermarked documents to managed groups; monitor progress, re-send, revoke." },
  { id: "send-discount",       name: "During a Timecard month",            unitPrice: "- 20%",   csvPrice: "-",        dateFrom: "", dateTo: "", selected: false, isDiscount: true },
  { id: "custom-forms",        name: "Custom forms",                       unitPrice: "£ 500",   csvPrice: "-",        dateFrom: "", dateTo: "", selected: false, tooltip: "A standalone system to handle your bespoke forms, e.g. Conflict of Interest." },
  { id: "dedicated-support",   name: "Dedicated support",                  unitPrice: "£ 780",   csvPrice: "-",        dateFrom: "", dateTo: "", selected: false },
  { id: "diversity",           name: "Diversity & Inclusion surveys",      unitPrice: "",        csvPrice: "",         dateFrom: "", dateTo: "", selected: false, isContact: true },
];

const SUB_MODULE_GROUPS = [
  { label: "Onboarding",  subLabel: "One-off",    ids: ["project-setup"] },
  { label: "Timecard",    subLabel: "Per month",  ids: ["tc-basic", "tc-standard", "tc-premium", "tc-share-pdf"] },
  { label: "Crew data CSV", subLabel: "Per month", ids: ["crew-csv"] },
  { label: "Reports",     subLabel: "Per month",  ids: ["reports", "reports-discount"] },
  { label: "Send",        subLabel: "Per month",  ids: ["send", "send-discount"] },
  { label: "Other",       subLabel: "Per month",  ids: ["custom-forms", "dedicated-support", "diversity"] },
];

const SUB_ADDITIONAL_TERMS = [
  { text: "Set-up: includes 2 training sessions (£ 150 per session thereafter)." },
  { text: "Revised document templates: £ 70 per template. Amendments required by the project to templates already in use." },
  { text: "Additional document templates - £ 70 per template. Additional templates sent to EAARTH 10 or more working days after Standard Crew contract templates go live, incur this charge and may not be prioritised." },
  { text: "Docusign envelopes: 'Set-up' includes the first 100 envelopes. Additional envelopes:", subs: [
    "£ 275 for 101 > 300 envelopes",
    "Then £ 450 for each subsequent bundle of 300 envelopes",
    "Envelope bundles are not pro-rated",
  ]},
  { text: "Docusign envelope manual amendment/redirect: £ 10 per envelope." },
  { text: "Post Production discount: 50% off Timecard plans, when there are less than 25 crew timecards per week." },
  { text: "Per month charges: renew on the same date each month from the start date if not cancelled in advance." },
  { text: "Cancellation: £ 780 if a project is cancelled prior to using Engine once preparation work has started (credited should the project restart)." },
  { text: "Pricing renewal: pricing is reviewed & published annually every Oct." },
  { text: "VAT: all prices are exclusive of VAT." },
];

/* ─────────────────────────────────────────────────────────
   SUBSCRIPTIONS TAB
───────────────────────────────────────────────────────── */
function SubscriptionsTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  const [modules, setModules] = useState(() =>
    loadSettings(projectId, "sub-modules", INIT_SUB_MODULES),
  );
  const [tooltipOpen, setTooltipOpen] = useState(null);

  const saveModules = (m) => {
    setModules(m);
    saveSettings(projectId, "sub-modules", m);
  };

  const toggleModule = (id) =>
    saveModules(modules.map((m) => m.id === id ? { ...m, selected: !m.selected } : m));

  const updateDate = (id, field, val) =>
    saveModules(modules.map((m) => m.id === id ? { ...m, [field]: val } : m));

  /* ── Billing forecast calculation ── */
  const hasTimecardSelected = modules.some(
    (m) => m.selected && m.id.startsWith("tc-") && !m.id.includes("share"),
  );

  const forecastItems = modules
    .filter((m) => m.selected && !m.isDiscount && !m.isContact)
    .map((m) => {
      let price = m.unitPrice.replace(/[£,\s]/g, "");
      if (price === "-" || price === "") price = m.csvPrice.replace(/[£,\s]/g, "");
      if (price === "-" || price === "Included" || price === "") {
        return { label: m.name, amount: "TBD", date: m.dateFrom || "TBD" };
      }
      const num = parseFloat(price);
      const discountable = ["reports", "send"];
      const hasDiscount = hasTimecardSelected && discountable.includes(m.id);
      const finalPrice = hasDiscount ? num * 0.8 : num;
      return {
        label: m.name + (hasDiscount ? " (20% Timecard discount)" : ""),
        amount: `£ ${finalPrice.toLocaleString("en-GB", { minimumFractionDigits: 0 })}`,
        date: m.dateFrom || "TBD",
      };
    });

  /* ── Lock handler ── */
  const handleLock = () => {
    setTabLockStatusById((prev) => ({ ...prev, [tabId]: !prev[tabId] }));
  };

  /* ── Progress — always 100% ── */
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
        label="Subscriptions"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Modules ── */}
        <SectionCard
          title="Modules"
          description="Select your desired modules and periods."
          color={color}
          delay={0.05}
        >
          {/* Pricing badge */}
          <div className="flex items-center gap-2 mb-4 px-1">
            <div
              className="px-3 py-1.5 rounded-lg text-white"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, fontSize: "0.5rem" }}
            >
              List pricing 2025/26 (Major budget)
            </div>
          </div>

          {/* Modules table */}
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">

            {/* Table header */}
            <div className="grid grid-cols-[1fr_80px_80px_115px_115px] gap-0 items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30 px-3 py-2.5">
              <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontSize: "0.44rem" }}>Module</span>
              <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right" style={{ fontSize: "0.44rem" }}>Unit price</span>
              <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right" style={{ fontSize: "0.44rem" }}>CSV price</span>
              <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center" style={{ fontSize: "0.44rem" }}>Date from</span>
              <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center" style={{ fontSize: "0.44rem" }}>Date to</span>
            </div>

            {/* Group rows */}
            {SUB_MODULE_GROUPS.map((grp, gi) => (
              <div key={`${grp.label}-${gi}`}>

                {/* Group header */}
                <div
                  className="grid grid-cols-[1fr_80px_80px_115px_115px] gap-0 items-center border-b border-gray-100 dark:border-gray-800/60 px-3 py-2"
                  style={{ background: `${color}06` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-300" style={{ fontSize: "0.58rem" }}>{grp.label}</span>
                    {grp.subLabel && (
                      <span className="text-gray-400 dark:text-gray-500 italic" style={{ fontSize: "0.44rem" }}>{grp.subLabel}</span>
                    )}
                  </div>
                  <span /><span /><span /><span />
                </div>

                {/* Module rows */}
                {grp.ids.map((mid) => {
                  const mod = modules.find((m) => m.id === mid);
                  if (!mod) return null;

                  /* Contact row */
                  if (mod.isContact) {
                    return (
                      <div key={mod.id} className="grid grid-cols-[1fr_auto] gap-0 items-center border-b border-gray-50 dark:border-gray-800/40 px-3 py-3">
                        <div className="flex items-center gap-2 pl-6">
                          <span className="text-gray-700 dark:text-gray-300" style={{ fontSize: "0.54rem" }}>{mod.name}</span>
                        </div>
                        <span className="text-amber-600 dark:text-amber-400 italic pr-1" style={{ fontSize: "0.48rem" }}>
                          Contact EAARTH for pricing options
                        </span>
                      </div>
                    );
                  }

                  /* Discount row */
                  if (mod.isDiscount) {
                    return (
                      <div
                        key={mod.id}
                        className="grid grid-cols-[1fr_80px_80px_115px_115px] gap-0 items-center border-b border-gray-50 dark:border-gray-800/40 px-3 py-2 bg-emerald-50/30 dark:bg-emerald-900/5"
                      >
                        <div className="flex items-center gap-2 pl-6">
                          <span className="text-emerald-600 dark:text-emerald-400 italic" style={{ fontSize: "0.5rem" }}>{mod.name}</span>
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400 text-right" style={{ fontSize: "0.5rem", fontFamily: "monospace" }}>{mod.unitPrice}</span>
                        <span className="text-gray-400 dark:text-gray-500 text-right" style={{ fontSize: "0.5rem", fontFamily: "monospace" }}>{mod.csvPrice}</span>
                        <span /><span />
                      </div>
                    );
                  }

                  /* Normal module row */
                  return (
                    <div
                      key={mod.id}
                      className={cn(
                        "grid grid-cols-[1fr_80px_80px_115px_115px] gap-0 items-center border-b border-gray-50 dark:border-gray-800/40 px-3 py-2.5 transition-colors",
                        mod.selected && "bg-purple-50/30 dark:bg-purple-900/8",
                      )}
                    >
                      {/* Checkbox + name + tooltip */}
                      <div className="flex items-center gap-2 pl-2">
                        <button
                          onClick={() => toggleModule(mod.id)}
                          disabled={d}
                          className={cn(
                            "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                            mod.selected ? "text-white" : "border-gray-300 dark:border-gray-600",
                          )}
                          style={mod.selected
                            ? { background: `linear-gradient(135deg, ${color}, ${color}cc)`, borderColor: color }
                            : {}}
                        >
                          {mod.selected && <Check className="w-2.5 h-2.5" />}
                        </button>
                        <span className="text-gray-700 dark:text-gray-300" style={{ fontSize: "0.54rem" }}>{mod.name}</span>

                        {/* Tooltip */}
                        {mod.tooltip && (
                          <div className="relative">
                            <HelpCircle
                              className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              onClick={() => setTooltipOpen(tooltipOpen === mod.id ? null : mod.id)}
                            />
                            <AnimatePresence>
                              {tooltipOpen === mod.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                                  className="absolute left-0 top-5 z-30 w-[260px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3"
                                >
                                  <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: "0.48rem" }}>{mod.tooltip}</p>
                                  <button
                                    onClick={() => setTooltipOpen(null)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {/* Unit price */}
                      <span className="text-gray-700 dark:text-gray-300 text-right" style={{ fontSize: "0.52rem", fontFamily: "monospace" }}>
                        {mod.unitPrice}
                      </span>

                      {/* CSV price */}
                      <span className="text-gray-500 dark:text-gray-400 text-right" style={{ fontSize: "0.52rem", fontFamily: "monospace" }}>
                        {mod.csvPrice}
                      </span>

                      {/* Date from */}
                      <div className="flex justify-center">
                        <input
                          type="date"
                          value={mod.dateFrom}
                          onChange={(e) => updateDate(mod.id, "dateFrom", e.target.value)}
                          disabled={d || !mod.selected}
                          className="px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 outline-none w-[105px] disabled:opacity-40"
                          style={{ fontSize: "0.44rem" }}
                        />
                      </div>

                      {/* Date to */}
                      <div className="flex justify-center">
                        {mod.noDateTo ? (
                          <span className="text-gray-300 dark:text-gray-600 italic" style={{ fontSize: "0.48rem" }}>n/a</span>
                        ) : (
                          <input
                            type="date"
                            value={mod.dateTo}
                            onChange={(e) => updateDate(mod.id, "dateTo", e.target.value)}
                            disabled={d || !mod.selected}
                            className="px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 outline-none w-[105px] disabled:opacity-40"
                            style={{ fontSize: "0.44rem" }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Contact button */}
          <div className="mt-4 px-1">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50/40 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 hover:bg-amber-50/80 dark:hover:bg-amber-900/20 transition-colors"
              style={{ fontSize: "0.52rem" }}
            >
              <Mail className="w-3.5 h-3.5" />
              Contact EAARTH regarding subscriptions
            </button>
          </div>
        </SectionCard>

        {/* ── Section 2: Additional Terms ── */}
        <SectionCard
          title="Additional terms"
          description=""
          color="#6b7280"
          delay={0.15}
        >
          <ul className="space-y-2.5 pl-1">
            {SUB_ADDITIONAL_TERMS.map((term, i) => (
              <li key={i}>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 dark:text-gray-600 mt-0.5 shrink-0" style={{ fontSize: "0.5rem" }}>•</span>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400" style={{ fontSize: "0.5rem" }}>{term.text}</span>
                    {term.subs && (
                      <ul className="mt-1.5 ml-3 space-y-1">
                        {term.subs.map((sub, si) => (
                          <li key={si} className="flex items-start gap-2">
                            <span className="text-gray-300 dark:text-gray-600 mt-0.5 shrink-0" style={{ fontSize: "0.44rem" }}>◦</span>
                            <span className="text-gray-500 dark:text-gray-500" style={{ fontSize: "0.46rem" }}>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-5 px-1">
            <button
              disabled={d}
              className="px-5 py-2 rounded-xl text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, fontSize: "0.56rem" }}
            >
              Save
            </button>
          </div>
        </SectionCard>

        {/* ── Section 3: Billing Forecast ── */}
        <SectionCard
          title="Billing Forecast"
          description="Estimated outline of invoice dates and amounts. Actual values may vary."
          color="#3b82f6"
          delay={0.25}
        >
          <div className="flex justify-end mb-3">
            <button
              disabled={d}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", fontSize: "0.56rem" }}
            >
              <Send className="w-3 h-3" /> Request quote
            </button>
          </div>

          {forecastItems.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              <DollarSign className="w-8 h-8 mx-auto text-gray-200 dark:text-gray-700 mb-2" />
              <span className="text-gray-400 dark:text-gray-500 block" style={{ fontSize: "0.56rem" }}>
                Select modules and dates to preview payments
              </span>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {/* Forecast header */}
              <div className="grid grid-cols-[1fr_100px_100px] gap-0 items-center border-b border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30 px-4 py-2.5">
                <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontSize: "0.44rem" }}>Module</span>
                <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right" style={{ fontSize: "0.44rem" }}>Amount</span>
                <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right" style={{ fontSize: "0.44rem" }}>Start Date</span>
              </div>

              {/* Forecast rows */}
              {forecastItems.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "grid grid-cols-[1fr_100px_100px] gap-0 items-center border-b border-gray-50 dark:border-gray-800/40 px-4 py-2.5",
                    i % 2 !== 0 && "bg-gray-50/20 dark:bg-gray-800/10",
                  )}
                >
                  <span className="text-gray-700 dark:text-gray-300" style={{ fontSize: "0.52rem" }}>{item.label}</span>
                  <span className="text-gray-800 dark:text-gray-200 text-right" style={{ fontSize: "0.52rem", fontFamily: "monospace" }}>{item.amount}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-right" style={{ fontSize: "0.46rem" }}>{item.date}</span>
                </div>
              ))}

              {/* Total row */}
              <div
                className="grid grid-cols-[1fr_100px_100px] gap-0 items-center px-4 py-3"
                style={{ background: `${color}08` }}
              >
                <span className="text-gray-800 dark:text-gray-200" style={{ fontSize: "0.56rem" }}>
                  Estimated Total (first period)
                </span>
                <span
                  className="text-right"
                  style={{ fontSize: "0.58rem", fontFamily: "monospace", color }}
                >
                  {(() => {
                    const total = forecastItems.reduce((acc, item) => {
                      const num = parseFloat(item.amount.replace(/[£,\s]/g, ""));
                      return acc + (isNaN(num) ? 0 : num);
                    }, 0);
                    return `£ ${total.toLocaleString("en-GB", { minimumFractionDigits: 0 })}`;
                  })()}
                </span>
                <span />
              </div>
            </div>
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

export default SubscriptionsTab;