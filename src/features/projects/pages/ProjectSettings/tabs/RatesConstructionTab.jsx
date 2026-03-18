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
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
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

      {/* LEFT */}
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
            {locked ? (
              <CircleCheck className="w-5 h-5 text-emerald-500" />
            ) : (
              <span className="text-xs font-medium tabular-nums">{progressPercentage}%</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-foreground font-medium text-[0.95rem]">{label}</h2>
          {locked ? (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
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

      {/* RIGHT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed"
        style={{ borderColor: `${color}30`, backgroundColor: `${color}05`, fontSize: "0.56rem", color }}
      >
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
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
              <span className="text-gray-300 dark:text-gray-600" style={{ fontSize: "0.52rem" }}>
                {progressPercentage}%
              </span>
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
          {locked ? (
            <><Unlock className="w-3.5 h-3.5" /> Unlock Tab</>
          ) : canLock ? (
            <><Lock className="w-3.5 h-3.5" /> Lock &amp; Continue <ArrowRight className="w-3.5 h-3.5 ml-1" /></>
          ) : (
            <><Lock className="w-3.5 h-3.5" /> Complete to Lock</>
          )}
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
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
   SELECT FIELD
───────────────────────────────────────────────────────── */
function SelectField({ label, value, onChange, options, color, disabled, required }) {
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
        <option value="" disabled hidden />
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <motion.label
        className="absolute left-3.5 pointer-events-none origin-left flex items-center gap-1 text-[0.7rem]"
        animate={{
          top: focused || hasValue ? 6 : 14,
          scale: focused || hasValue ? 0.78 : 1,
          color: focused ? color : "#9ca3af",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {label}
        {required && <span style={{ color }}> *</span>}
      </motion.label>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PILL TOGGLE
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
   RADIO GROUP — inline pill-style buttons (replaces ModRadio)
───────────────────────────────────────────────────────── */
function RadioGroup({ label, value, options, onChange, color, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-gray-500 dark:text-gray-400 uppercase" style={{ fontSize: "0.46rem", letterSpacing: "0.04em" }}>
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = value === opt;
          return (
            <button
              key={opt}
              disabled={disabled}
              onClick={() => onChange(opt)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all",
                disabled && "opacity-40 cursor-not-allowed",
              )}
              style={
                isActive
                  ? { backgroundColor: color, borderColor: color, color: "#fff", fontSize: "0.54rem" }
                  : { backgroundColor: "transparent", borderColor: "#e5e7eb", color: "#6b7280", fontSize: "0.54rem" }
              }
            >
              <span
                className="w-3 h-3 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: isActive ? "#fff" : "#d1d5db" }}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   RATES CONSTRUCTION TAB
───────────────────────────────────────────────────────── */
function RatesConstructionTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  /* ── State — one key per setting, matching TypeScript source ── */
  const [rateCard, setRateCard] = useState(() =>
    loadSettings(projectId, "con-ratecard", "Add holiday pay to net rate on Rate card"),
  );
  const [stdHours, setStdHours] = useState(() =>
    loadSettings(projectId, "con-stdhours", "10 hours"),
  );
  const [breakDur, setBreakDur] = useState(() =>
    loadSettings(projectId, "con-breaks", "1.5 hours"),
  );
  const [showBreakTip, setShowBreakTip] = useState(false);

  const [d6Calc, setD6Calc] = useState(() =>
    loadSettings(projectId, "con-d6calc", "Multiply net daily by 4/3"),
  );
  const [d6When, setD6When] = useState(() =>
    loadSettings(projectId, "con-d6when", "Consecutive working days"),
  );
  const [d6Payment, setD6Payment] = useState(() =>
    loadSettings(projectId, "con-d6pay", "Daily"),
  );
  const [d6Holiday, setD6Holiday] = useState(() =>
    loadSettings(projectId, "con-d6hol", "Pay net, don't calculate holiday pay (per PACT/BECTU)"),
  );

  const [d7Calc, setD7Calc] = useState(() =>
    loadSettings(projectId, "con-d7calc", "Multiply net daily by 1.5"),
  );
  const [d7Payment, setD7Payment] = useState(() =>
    loadSettings(projectId, "con-d7pay", "Daily"),
  );
  const [d7Unsocial, setD7Unsocial] = useState(() =>
    loadSettings(projectId, "con-d7unsocial", false),
  );
  const [d7Holiday, setD7Holiday] = useState(() =>
    loadSettings(projectId, "con-d7hol", "Pay net, don't calculate holiday pay (per PACT/BECTU)"),
  );

  const [otCalc, setOtCalc] = useState(() =>
    loadSettings(projectId, "con-otcalc", "Multiply net hourly by 1.5"),
  );
  const [otCaps, setOtCaps] = useState(() =>
    loadSettings(projectId, "con-otcaps", "Match PACT/BECTU Rate card"),
  );
  const [otHoliday, setOtHoliday] = useState(() =>
    loadSettings(projectId, "con-othol", "Pay net, don't calculate holiday pay (per PACT/BECTU)"),
  );
  const [otUnsocial, setOtUnsocial] = useState(() =>
    loadSettings(projectId, "con-otunsocial", "Per PACT/BECTU Agreement"),
  );

  const [travelPaid, setTravelPaid] = useState(() =>
    loadSettings(projectId, "con-travel", false),
  );
  const [brokenTurnaround, setBrokenTurnaround] = useState(() =>
    loadSettings(projectId, "con-turnaround", false),
  );

  /* Helper: save a single key */
  const sv = (key, value) => saveSettings(projectId, key, value);

  /* ── Lock handler ── */
  const handleLock = () => {
    setTabLockStatusById((prev) => ({ ...prev, [tabId]: !prev[tabId] }));
  };

  /* ── Progress — all fields have defaults so always 100% ── */
  const progressPercentage = 100;

  useEffect(() => {
    setTabProgressById((prev) => ({ ...prev, [tabId]: progressPercentage }));
  }, [progressPercentage, tabId, setTabProgressById]);

  /* ── Option lists ── */
  const hourOpts = [
    "12 hours (continuous)", "12 hours", "11 hours", "10.5 hours", "10 hours",
    "9 hours", "8 hours", "7.5 hours", "7 hours", "6 hours",
    "5 hours", "4 hours", "3 hours", "2 hours", "1 hour",
  ];
  const rateCardOpts = [
    "Add holiday pay to net rate on Rate card",
    "Extract holiday pay from gross rate on Rate card",
    "Don't use Rate card",
  ];
  const breakOpts = ["1.5 hours", "1 hour", "0.5 hours"];
  const d6CalcOpts = [
    "Multiply net daily by 4/3",
    "Match PACT/BECTU Rate card",
    "Use different multiplier",
    "Enter own rate in offer",
  ];
  const d6WhenOpts = [
    "Consecutive working days",
    "The 6th day worked in a timecard week",
    "Weekend days",
  ];
  const d7CalcOpts = [
    "Multiply net daily by 1.5",
    "Match PACT/BECTU Rate card",
    "Use different multiplier",
    "Enter own rate in offer",
  ];
  const otCalcOpts = [
    "Multiply net hourly by 1.5",
    "1.5x gross hourly rate then extract holiday pay",
    "Match PACT/BECTU Rate card",
    "Use different multiplier",
    "Enter own rate in offer",
  ];
  const otCapsOpts = ["Match PACT/BECTU Rate card", "Other cap", "No cap"];
  const holidayOpts = [
    "Pay net, don't calculate holiday pay (per PACT/BECTU)",
    "Pay net, calculate holiday pay",
    "Pay gross",
  ];
  const unsocialOpts = [
    "Per PACT/BECTU Agreement",
    "Custom unsocial hours",
    "Don't apply",
  ];

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
        label="Construction"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Daily Rate & Hours ── */}
        <SectionCard
          title="Daily Rate & Hours"
          description="PACT/BECTU rate card and standard working hours for construction crew."
          color={color}
          delay={0.05}
        >
          <div className="space-y-3">
            <SelectField
              label="Use PACT/BECTU Rate card for Daily rate?"
              value={rateCard}
              onChange={(v) => { setRateCard(v); sv("con-ratecard", v); }}
              options={rateCardOpts}
              color={color}
              disabled={d}
            />
            <div>
              <SelectField
                label="Default standard working hours"
                value={stdHours}
                onChange={(v) => { setStdHours(v); sv("con-stdhours", v); }}
                options={hourOpts}
                color={color}
                disabled={d}
              />
              <p className="text-gray-400 dark:text-gray-500 italic mt-0.5 px-1" style={{ fontSize: "0.48rem" }}>
                Excluding breaks.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 2: Breaks ── */}
        <SectionCard
          title="Breaks"
          description="Duration of unpaid break periods."
          color={color}
          delay={0.08}
        >
          <div className="relative">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <SelectField
                  label="Duration of unpaid breaks"
                  value={breakDur}
                  onChange={(v) => { setBreakDur(v); sv("con-breaks", v); }}
                  options={breakOpts}
                  color={color}
                  disabled={d}
                />
              </div>
              <button
                onClick={() => setShowBreakTip(!showBreakTip)}
                className="mb-1 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <AnimatePresence>
              {showBreakTip && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2 p-2.5 rounded-lg bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                  style={{ fontSize: "0.5rem" }}
                >
                  The PACT/BECTU Agreement specifies a 30 minute unpaid morning break and unpaid lunch of 1 hour. You might have agreed different break period(s) for an overall shorter day. This break period duration will only be used to determine when overtime becomes applicable.
                  <button onClick={() => setShowBreakTip(false)} className="ml-2 underline opacity-60 hover:opacity-100">
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionCard>

        {/* ── Section 3: 6th Day ── */}
        <SectionCard
          title="6th Day"
          description="Rate calculation, applicability, and payment rules for 6th consecutive day."
          color={color}
          delay={0.11}
        >
          <div className="space-y-3">
            <SelectField
              label="6th day rate calculation"
              value={d6Calc}
              onChange={(v) => { setD6Calc(v); sv("con-d6calc", v); }}
              options={d6CalcOpts}
              color={color}
              disabled={d}
            />
            <SelectField
              label="When does 6th day rate apply?"
              value={d6When}
              onChange={(v) => { setD6When(v); sv("con-d6when", v); }}
              options={d6WhenOpts}
              color={color}
              disabled={d}
            />
            <RadioGroup
              label="6th day rate payment"
              value={d6Payment}
              options={["Daily", "Hourly"]}
              onChange={(v) => { setD6Payment(v); sv("con-d6pay", v); }}
              color={color}
              disabled={d}
            />
            <SelectField
              label="Holiday pay application"
              value={d6Holiday}
              onChange={(v) => { setD6Holiday(v); sv("con-d6hol", v); }}
              options={holidayOpts}
              color={color}
              disabled={d}
            />
          </div>
        </SectionCard>

        {/* ── Section 4: 7th Day ── */}
        <SectionCard
          title="7th Day"
          description="Rate calculation, payment, and unsocial hours for 7th consecutive day."
          color={color}
          delay={0.14}
        >
          <div className="space-y-3">
            <SelectField
              label="7th day rate calculation"
              value={d7Calc}
              onChange={(v) => { setD7Calc(v); sv("con-d7calc", v); }}
              options={d7CalcOpts}
              color={color}
              disabled={d}
            />
            <RadioGroup
              label="7th day rate payment"
              value={d7Payment}
              options={["Daily", "Hourly"]}
              onChange={(v) => { setD7Payment(v); sv("con-d7pay", v); }}
              color={color}
              disabled={d}
            />
            <PillToggle
              label="Pay Unsocial Hours 2 for all hours worked on 7th day?"
              value={d7Unsocial}
              onChange={(v) => { setD7Unsocial(v); sv("con-d7unsocial", v); }}
              color={color}
              disabled={d}
            />
            <SelectField
              label="Holiday pay application"
              value={d7Holiday}
              onChange={(v) => { setD7Holiday(v); sv("con-d7hol", v); }}
              options={holidayOpts}
              color={color}
              disabled={d}
            />
          </div>
        </SectionCard>

        {/* ── Section 5: Overtime ── */}
        <SectionCard
          title="Overtime"
          description="Overtime rate calculation, caps, holiday pay, and unsocial hours."
          color={color}
          delay={0.17}
        >
          <div className="space-y-3">
            <SelectField
              label="O/T rate calculation"
              value={otCalc}
              onChange={(v) => { setOtCalc(v); sv("con-otcalc", v); }}
              options={otCalcOpts}
              color={color}
              disabled={d}
            />
            <SelectField
              label="O/T caps"
              value={otCaps}
              onChange={(v) => { setOtCaps(v); sv("con-otcaps", v); }}
              options={otCapsOpts}
              color={color}
              disabled={d}
            />
            <SelectField
              label="Holiday pay application"
              value={otHoliday}
              onChange={(v) => { setOtHoliday(v); sv("con-othol", v); }}
              options={holidayOpts}
              color={color}
              disabled={d}
            />
            <SelectField
              label="Apply unsocial hours"
              value={otUnsocial}
              onChange={(v) => { setOtUnsocial(v); sv("con-otunsocial", v); }}
              options={unsocialOpts}
              color={color}
              disabled={d}
            />
          </div>
        </SectionCard>

        {/* ── Section 6: Travel Time ── */}
        <SectionCard
          title="Travel Time"
          description="Whether travel time is paid for construction crew."
          color={color}
          delay={0.2}
        >
          <PillToggle
            label="Travel time paid?"
            value={travelPaid}
            onChange={(v) => { setTravelPaid(v); sv("con-travel", v); }}
            color={color}
            disabled={d}
          />
        </SectionCard>

        {/* ── Section 7: Broken Turnaround ── */}
        <SectionCard
          title="Broken Turnaround"
          description="Whether broken turnaround time is compensated."
          color={color}
          delay={0.23}
        >
          <PillToggle
            label="Broken turnaround paid?"
            value={brokenTurnaround}
            onChange={(v) => { setBrokenTurnaround(v); sv("con-turnaround", v); }}
            color={color}
            disabled={d}
          />
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

export default RatesConstructionTab;