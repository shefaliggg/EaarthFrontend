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
  ChevronDown,
  Check,
  Activity,
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
   INPUT FIELD
───────────────────────────────────────────────────────── */
function InputField({ label, value, onChange, type, color, disabled }) {
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
        {label}
      </motion.label>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SELECT FIELD
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
   TOOLTIP ICON  (inline hover tooltip)
───────────────────────────────────────────────────────── */
function TooltipIcon({ text, color }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow((p) => !p)}
        className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
      >
        <HelpCircle className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-2.5"
            style={{ fontSize: "0.5rem" }}
          >
            <span className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   TC CHECKBOX GROUP  (working hours checkboxes)
───────────────────────────────────────────────────────── */
function TCCheckGroup({ items, values, onChange, color, disabled }) {
  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <label
          key={item.key}
          className={cn(
            "flex items-center gap-2.5 cursor-pointer group/chk",
            disabled && "opacity-50 pointer-events-none",
          )}
        >
          <button
            type="button"
            onClick={() => onChange(item.key, !values[item.key])}
            disabled={disabled}
            className={cn(
              "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
              values[item.key]
                ? "text-white"
                : "border-gray-300 dark:border-gray-600 group-hover/chk:border-gray-400",
            )}
            style={values[item.key] ? { background: `linear-gradient(135deg, ${color}, ${color}cc)`, borderColor: color } : {}}
          >
            {values[item.key] && <Check className="w-2.5 h-2.5" />}
          </button>
          <span className="text-gray-700 dark:text-gray-300" style={{ fontSize: "0.56rem" }}>{item.label}</span>
        </label>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TC RULE SELECT  (floating label select with optional tooltip)
───────────────────────────────────────────────────────── */
function TCRuleSelect({ label, tooltip, value, options, onChange, color, disabled }) {
  return (
    <div className="mb-4">
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3.5 pt-5 pb-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 outline-none appearance-none cursor-pointer transition-all hover:border-gray-200 dark:hover:border-gray-700 disabled:opacity-40"
          style={{ fontSize: "0.56rem" }}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div
          className="absolute left-3.5 pointer-events-none flex items-center gap-1.5"
          style={{ top: 5, fontSize: "0.44rem", color: "#9ca3af" }}
        >
          <span>{label}</span>
          {tooltip && <TooltipIcon text={tooltip} color={color} />}
        </div>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STATIC DATA — all constants from TypeScript source
───────────────────────────────────────────────────────── */
const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

const STANDARD_WORKING_DAYS = [
  { key: "swd_10_1",   label: "Standard working day: 10 + 1" },
  { key: "swd_10_5_1", label: "Standard working day: 10.5 + 1" },
  { key: "swd_11_1",   label: "Standard working day: 11 + 1" },
];
const SEMI_CONTINUOUS_DAYS = [
  { key: "scwd_9_0_5",    label: "Semi-continuous working day: 9 + 0.5" },
  { key: "scwd_9_5_0_5",  label: "Semi-continuous working day: 9.5 + 0.5" },
  { key: "scwd_10_0_5",   label: "Semi-continuous working day: 10 + 0.5" },
  { key: "scwd_10_5_0_5", label: "Semi-continuous working day: 10.5 + 0.5" },
];
const CONTINUOUS_DAYS = [
  { key: "cwd_9",   label: "Continuous working day: 9" },
  { key: "cwd_9_5", label: "Continuous working day: 9.5" },
  { key: "cwd_10",  label: "Continuous working day: 10" },
];

const EXTENDED_DAY_FILM = [
  "When contracted hours (including Additional hour) have been completed",
  "When contracted hours have been completed (Additional hour applied outside of Extended day)",
  "Regardless of contracted hours (Additional hour applied outside of Extended day)",
];
const EXTENDED_DAY_TV = [
  "Only when contracted hours have been completed",
  "Regardless of contracted hours",
];

const TURNAROUND_1_REST = ["11 hours", "24 hours", "24 + 11 hours"];
const TURNAROUND_2_REST = ["11 hours", "48 hours", "48 + 11 hours"];
const SIXTH_SEVENTH_OPTIONS = ["Any consecutive block", "Reset on first day of week"];
const TRAVEL_DAY_OPTIONS = ["Resets day count", "Don't reset, don't count", "Don't reset, count"];
const POST_WRAP_GRACE_OPTIONS = ["Expected wrap", "Unit wrap", "After 15 mins Grace"];
const POST_WRAP_CAM_OT_OPTIONS = ["Uses inclusive minutes", "Ignores inclusive minutes after", "Ignores inclusive minutes"];

const EARLY_CALL_OPTIONS = [
  "Apply early call until 6am then pre-call",
  "Apply early call and pre-call from In time (i.e. pay both for hours prior to 6am)",
];
const DAWN_CALL_OPTIONS = [
  "Apply dawn call until 5am then pre-call",
  "Apply dawn call and pre-call from In time (i.e. pay both for hours prior to 5am)",
];
const ADDITIONAL_HOUR_FILM_OPTS = [
  "On any shoot day, regardless of being On or Off Set",
  "On any shoot day when crew member is On Set",
];
const INCLUSIVE_MINS_OPTIONS = [
  "Uses inclusive minutes",
  "Uses inclusive minutes for pre-call only",
  "Does not use inclusive minutes prior to start of day",
];
const BROKEN_TURNAROUND_DAILIES = [
  "Only between consecutive work days (rest day always resets)",
  "As per weekly crew",
];
const TRAVEL_TIME_OPTIONS = [
  "Travel time happens outside of all worked hours",
  "Working hours are always reduced by the Travel time",
];
const AUTO_SUBMIT_PDF = ["Auto", "pp Department Approver"];
const ALLOWANCE_TYPES = ["Box", "Computer", "Equipment", "Mobile", "Software", "Vehicle"];

const CAM_OT_ROUNDING = [
  "Every 15 mins",
  "Every 15 mins until 2hrs, then hourly (per Film PACT/BECTU)",
  "Every 30 mins",
  "First 30 mins then hourly (per TV PACT/BECTU)",
  "Hourly",
];
const OTHER_OT_ROUNDING = [
  "Every 15 mins",
  "Every 30 mins",
  "Hourly",
  "Per Film PACT/BECTU (2018)",
  "To Cam O/T, add each O/T element until >1 hour, then round further O/T elements in hours (Per TV PACT/BECTU (2017))",
  "To Cam O/T, add Pre then Post until >1 hour, then round Pre + Post in hours (Per TV PACT/BECTU guidance (2019))",
  "Round to 30 mins, then sum Pre+Cam+Post, and round in hours (if >30 mins)",
  "Don't round, sum all, then round to 0.5 (Per TV PACT/BECTU (2020))",
];

const TC_TOOLTIPS = {
  brokenTurnaroundDailies: "This will determine when broken turnaround applies to dailies.",
  officialRestDays: "If selected, broken turnaround will only be calculated across rest days if the day is an Official rest day in the calendar.",
  restDay1: "This is regarding 'turnaround' (rest between work periods) over a 1-day rest period.\n\nExample if 11 hours: Out time on Fri = 20:00. In time on Sun = 06:00. Turnaround not broken. Turnaround is achieved by 07:00 on Sat.\n\nExample if 24 hours: Out time on Fri = 20:00. In time on Sun = 06:00. Turnaround not broken. Turnaround is achieved by 20:00 on Sat.\n\nExample if 24 + 11 hours (35 hours): Out time on Fri = 20:00. In time on Sun = 06:00. Turnaround broken by 1hr. Turnaround would be achieved by 07:00 on Sun.",
  restDay2: "This is regarding 'turnaround' (rest between work periods) over a 2-day rest period.\n\nExample if 11 hours: Out time on Fri = 20:00. In time on Mon = 06:00. Turnaround not broken. Turnaround is achieved by 07:00 on Sat.\n\nExample if 48 hours: Out time on Fri = 20:00. In time on Mon = 06:00. Turnaround not broken. Turnaround is achieved by 20:00 on Sun.\n\nExample if 48 + 11 hours (59 hours): Out time on Fri = 20:00. In time on Mon = 06:00. Turnaround broken by 1hr. Turnaround would be achieved by 07:00 on Mon.",
  sixthSeventh: "The 6th or 7th day penalty is for working that many days 'consecutively', regardless of the end of the payroll week. This option allows you to choose to reset the count on the first day of the week.",
  travelDay: "How do you want dedicated Travel days in your schedule (not Travel + shoot, or Shoot + travel) to count towards the working day count?\n\nExamples:\nReset day count = Mon (workday 1), Tue (travel day 0), Wed (workday 1)\nDon't reset, don't count = Mon (workday 1), Tue (travel day 0), Wed (workday 2)\nDon't reset, count = Mon (workday 1), Tue (travel day 2), Wed (workday 3)",
  postWrapGrace: "If you use Grace, when should overtime then be applicable for people who do further work (factoring in any 'departmental reasonable wrap time' or 'additional hour')?\n\nScenario: Expected wrap was 18:00, 15 mins Grace was asked for, actual wrap was 18:08.\n\nExpected wrap = Overtime would apply from 18:00\nUnit wrap = Overtime would apply from 18:09\nAfter 15 mins Grace = Overtime would apply from 18:16",
  postWrapCamOT: "If the unit does Camera overtime, do you still expect any relevant 'reasonable prep and/or wrap time' to be worked before further overtime applies, or not?",
  travelTimeInDay: "For example: CWD of 9 hours with 30 mins Travel from (inc), so that working day is scheduled to be 8.5 hours. Unit call at 08:00. Unit wrap at 16:30. Crew member In time 08:00, Out time 17:30.\n\nIf 'Travel time happens outside of all worked hours': 08:00-17:00 normal, 17:00-17:30 Post O/T, 17:30-18:00 paid Travel.\n\nIf 'Working hours are always reduced': 08:00-16:30 normal, 16:30-17:30 Post O/T, 17:30-18:00 Travel included in normal day.\n\nPlease be aware of financial implications depending on your Union agreement.",
};

/* ─────────────────────────────────────────────────────────
   DEFAULT TIMECARD STATE  (matches TypeScript exactly)
───────────────────────────────────────────────────────── */
function defaultTimecardState(isFilm) {
  return {
    activeFrom: "",
    weekEndingDay: "Sunday",
    crewReminder: true,
    crewReminderDay: "Monday",
    crewReminderTime: "09:00",
    crewSubmissionDeadline: true,
    crewSubmissionDay: "Wednesday",
    crewSubmissionTime: "17:00",
    deptReminder: true,
    deptReminderDay: "Thursday",
    deptReminderTime: "09:00",
    deptApprovalDeadline: true,
    deptApprovalDeadlineDay: "Friday",
    deptApprovalDeadlineTime: "17:00",
    workingHours: {
      swd_10_1: true, swd_10_5_1: false, swd_11_1: false,
      scwd_9_0_5: false, scwd_9_5_0_5: false, scwd_10_0_5: false, scwd_10_5_0_5: false,
      cwd_9: false, cwd_9_5: false, cwd_10: false,
    },
    // NOTE: In the TS source, isFilm uses EXTENDED_DAY_TV[0] and !isFilm uses EXTENDED_DAY_FILM[0]
    // This is intentional — matches the original exactly
    extendedDayOption: isFilm ? EXTENDED_DAY_TV[0] : EXTENDED_DAY_FILM[0],
    additionalHourFilm: ADDITIONAL_HOUR_FILM_OPTS[0],
    brokenTurnaroundDailies: BROKEN_TURNAROUND_DAILIES[0],
    useOfficialRestDays: false,
    restDay1Turnaround: "24 + 11 hours",
    restDay2Turnaround: "48 hours",
    sixthSeventhDayCount: "Any consecutive block",
    travelDay: "Resets day count",
    postWrapGrace: "Unit wrap",
    postWrapCamOT: "Uses inclusive minutes",
    earlyCallPreCall: EARLY_CALL_OPTIONS[0],
    earlyCallInclusive: INCLUSIVE_MINS_OPTIONS[0],
    dawnCallPreCall: DAWN_CALL_OPTIONS[0],
    dawnCallInclusive: INCLUSIVE_MINS_OPTIONS[1],
    nightPenaltyOffSet: false,
    nightPenaltyNonShooting: false,
    autoSubmitPdfShow: "Auto",
    requireMealTimes: false,
    transportDeptOnly: false,
    travelTimeInDay: TRAVEL_TIME_OPTIONS[0],
    camOTRounding: CAM_OT_ROUNDING[0],
    otherOTRounding: OTHER_OT_ROUNDING[0],
    allowances: Object.fromEntries(ALLOWANCE_TYPES.map((a) => [a, false])),
  };
}

/* ─────────────────────────────────────────────────────────
   TIMECARD TAB
───────────────────────────────────────────────────────── */
function TimecardTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  // Read project type from proj-settings to show Film vs TV specific fields
  const projectSettings = loadSettings(projectId, "proj-settings", { projectType: "Feature Film" });
  const isFilm = projectSettings.projectType === "Feature Film";
  const projectTypeLabel = isFilm ? "Film" : "TV";
  const storageKey = isFilm ? "timecard-film" : "timecard-tv";

  const [tc, setTc] = useState(() =>
    loadSettings(projectId, storageKey, defaultTimecardState(isFilm)),
  );

  // Re-load when project type changes
  useEffect(() => {
    setTc(loadSettings(projectId, storageKey, defaultTimecardState(isFilm)));
  }, [isFilm, projectId, storageKey]);

  // Patch update + persist
  const up = (patch) => {
    const next = { ...tc, ...patch };
    setTc(next);
    saveSettings(projectId, storageKey, next);
  };

  const updateWH = (key, val) => up({ workingHours: { ...tc.workingHours, [key]: val } });
  const updateAllow = (key, val) => up({ allowances: { ...tc.allowances, [key]: val } });

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
        label="Timecard"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      {/* Project type badge */}
      <div className="flex items-center gap-2">
        <div
          className="px-3 py-1.5 rounded-lg text-white flex items-center gap-2"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, fontSize: "0.52rem" }}
        >
          <Activity className="w-3 h-3" />
          {projectTypeLabel} Timecard Settings
        </div>
        <span className="text-gray-400 dark:text-gray-500 italic" style={{ fontSize: "0.46rem" }}>
          Based on Project Type: {projectSettings.projectType}
        </span>
      </div>

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Timecards ── */}
        <SectionCard
          title="Timecards"
          description="Configure when timecards are active and the payroll week cycle."
          color={color}
          delay={0.05}
        >
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Timecards active from"
              value={tc.activeFrom}
              onChange={(v) => up({ activeFrom: v })}
              type="date"
              color={color}
              disabled={d}
            />
            <SelectField
              label="Week ending day"
              value={tc.weekEndingDay}
              onChange={(v) => up({ weekEndingDay: v })}
              options={DAYS_OF_WEEK}
              color={color}
              disabled={d}
            />
          </div>
        </SectionCard>

        {/* ── Section 2: Scheduled Tasks ── */}
        <SectionCard
          title="Scheduled tasks"
          description="Reminder and deadline notifications sent to crew."
          color={color}
          delay={0.1}
        >
          <div className="space-y-5">
            {/* Crew reminder */}
            <div>
              <PillToggle label="Crew reminder" value={tc.crewReminder} onChange={(v) => up({ crewReminder: v })} color={color} disabled={d} />
              <AnimatePresence>
                {tc.crewReminder && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 mt-2 pl-4">
                      <SelectField label="Crew reminder day" value={tc.crewReminderDay} onChange={(v) => up({ crewReminderDay: v })} options={DAYS_OF_WEEK} color={color} disabled={d} />
                      <InputField label="Crew reminder time" value={tc.crewReminderTime} onChange={(v) => up({ crewReminderTime: v })} type="time" color={color} disabled={d} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Crew submission deadline */}
            <div>
              <PillToggle label="Crew submission deadline" value={tc.crewSubmissionDeadline} onChange={(v) => up({ crewSubmissionDeadline: v })} color={color} disabled={d} />
              <AnimatePresence>
                {tc.crewSubmissionDeadline && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 mt-2 pl-4">
                      <SelectField label="Crew submission day" value={tc.crewSubmissionDay} onChange={(v) => up({ crewSubmissionDay: v })} options={DAYS_OF_WEEK} color={color} disabled={d} />
                      <InputField label="Crew submission time" value={tc.crewSubmissionTime} onChange={(v) => up({ crewSubmissionTime: v })} type="time" color={color} disabled={d} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Department reminder */}
            <div>
              <PillToggle label="Department reminder" value={tc.deptReminder} onChange={(v) => up({ deptReminder: v })} color={color} disabled={d} />
              <AnimatePresence>
                {tc.deptReminder && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 mt-2 pl-4">
                      <SelectField label="Department reminder day" value={tc.deptReminderDay} onChange={(v) => up({ deptReminderDay: v })} options={DAYS_OF_WEEK} color={color} disabled={d} />
                      <InputField label="Department reminder time" value={tc.deptReminderTime} onChange={(v) => up({ deptReminderTime: v })} type="time" color={color} disabled={d} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Department approval deadline */}
            <div>
              <PillToggle label="Department approval deadline" value={tc.deptApprovalDeadline} onChange={(v) => up({ deptApprovalDeadline: v })} color={color} disabled={d} />
              <AnimatePresence>
                {tc.deptApprovalDeadline && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-3 mt-2 pl-4">
                      <SelectField label="Department approval deadline day" value={tc.deptApprovalDeadlineDay} onChange={(v) => up({ deptApprovalDeadlineDay: v })} options={DAYS_OF_WEEK} color={color} disabled={d} />
                      <InputField label="Department approval deadline time" value={tc.deptApprovalDeadlineTime} onChange={(v) => up({ deptApprovalDeadlineTime: v })} type="time" color={color} disabled={d} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 3: Working Hours ── */}
        <SectionCard
          title="Working hours"
          description="The variations of your standard working hours. Selections will be made available in the Calendar."
          color={color}
          delay={0.15}
        >
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h4 className="text-gray-600 dark:text-gray-400 mb-2" style={{ fontSize: "0.58rem" }}>Standard working day</h4>
              <TCCheckGroup items={STANDARD_WORKING_DAYS} values={tc.workingHours} onChange={updateWH} color={color} disabled={d} />
            </div>
            <div>
              <h4 className="text-gray-600 dark:text-gray-400 mb-2" style={{ fontSize: "0.58rem" }}>Semi-continuous working day</h4>
              <TCCheckGroup items={SEMI_CONTINUOUS_DAYS} values={tc.workingHours} onChange={updateWH} color={color} disabled={d} />
            </div>
            <div>
              <h4 className="text-gray-600 dark:text-gray-400 mb-2" style={{ fontSize: "0.58rem" }}>Continuous working day</h4>
              <TCCheckGroup items={CONTINUOUS_DAYS} values={tc.workingHours} onChange={updateWH} color={color} disabled={d} />
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
            <TCRuleSelect
              label="On an Extended working day, pay the Scheduled camera overtime:"
              value={tc.extendedDayOption}
              options={isFilm ? EXTENDED_DAY_TV : EXTENDED_DAY_FILM}
              onChange={(v) => up({ extendedDayOption: v })}
              color={color}
              disabled={d}
            />
          </div>
        </SectionCard>

        {/* ── Section 4: Rules ── */}
        <SectionCard
          title="Rules"
          description="Overtime, turnaround, and penalty calculation rules."
          color={color}
          delay={0.2}
        >
          {/* TV only: Additional hour */}
          {!isFilm && (
            <TCRuleSelect
              label="Additional hour for crew contracted on 10+1+1 applies when"
              value={tc.additionalHourFilm}
              options={ADDITIONAL_HOUR_FILM_OPTS}
              onChange={(v) => up({ additionalHourFilm: v })}
              color={color}
              disabled={d}
            />
          )}

          <TCRuleSelect
            label="Calculate broken turnaround for dailies"
            tooltip={TC_TOOLTIPS.brokenTurnaroundDailies}
            value={tc.brokenTurnaroundDailies}
            options={BROKEN_TURNAROUND_DAILIES}
            onChange={(v) => up({ brokenTurnaroundDailies: v })}
            color={color}
            disabled={d}
          />

          <div className="mb-4">
            <PillToggle
              label="Use 'Official rest days' in calendar"
              value={tc.useOfficialRestDays}
              onChange={(v) => up({ useOfficialRestDays: v })}
              color={color}
              disabled={d}
            />
            <div className="flex items-center gap-1.5 mt-1 pl-1">
              <TooltipIcon text={TC_TOOLTIPS.officialRestDays} color={color} />
            </div>
          </div>

          <TCRuleSelect label="1 rest day turnaround period" tooltip={TC_TOOLTIPS.restDay1} value={tc.restDay1Turnaround} options={TURNAROUND_1_REST} onChange={(v) => up({ restDay1Turnaround: v })} color={color} disabled={d} />
          <TCRuleSelect label="2 rest day turnaround period" tooltip={TC_TOOLTIPS.restDay2} value={tc.restDay2Turnaround} options={TURNAROUND_2_REST} onChange={(v) => up({ restDay2Turnaround: v })} color={color} disabled={d} />
          <TCRuleSelect label="6th & 7th day count" tooltip={TC_TOOLTIPS.sixthSeventh} value={tc.sixthSeventhDayCount} options={SIXTH_SEVENTH_OPTIONS} onChange={(v) => up({ sixthSeventhDayCount: v })} color={color} disabled={d} />
          <TCRuleSelect label="Travel day" tooltip={TC_TOOLTIPS.travelDay} value={tc.travelDay} options={TRAVEL_DAY_OPTIONS} onChange={(v) => up({ travelDay: v })} color={color} disabled={d} />
          <TCRuleSelect label="Post wrap overtime after Grace period applicable from" tooltip={TC_TOOLTIPS.postWrapGrace} value={tc.postWrapGrace} options={POST_WRAP_GRACE_OPTIONS} onChange={(v) => up({ postWrapGrace: v })} color={color} disabled={d} />
          <TCRuleSelect label="Post wrap overtime after Camera overtime" tooltip={TC_TOOLTIPS.postWrapCamOT} value={tc.postWrapCamOT} options={POST_WRAP_CAM_OT_OPTIONS} onChange={(v) => up({ postWrapCamOT: v })} color={color} disabled={d} />

          {/* Film: Dawn call / TV: Early call */}
          {isFilm ? (
            <>
              <TCRuleSelect label="Dawn call and Pre-call" value={tc.dawnCallPreCall} options={DAWN_CALL_OPTIONS} onChange={(v) => up({ dawnCallPreCall: v })} color={color} disabled={d} />
              <TCRuleSelect label="Dawn call and Inclusive minutes" value={tc.dawnCallInclusive} options={INCLUSIVE_MINS_OPTIONS} onChange={(v) => up({ dawnCallInclusive: v })} color={color} disabled={d} />
            </>
          ) : (
            <>
              <TCRuleSelect label="Early call and Pre-call" value={tc.earlyCallPreCall} options={EARLY_CALL_OPTIONS} onChange={(v) => up({ earlyCallPreCall: v })} color={color} disabled={d} />
              <TCRuleSelect label="Early call and Inclusive minutes" value={tc.earlyCallInclusive} options={INCLUSIVE_MINS_OPTIONS} onChange={(v) => up({ earlyCallInclusive: v })} color={color} disabled={d} />
            </>
          )}

          {/* TV only: Night penalty toggles */}
          {!isFilm && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-2 gap-x-6">
                <PillToggle label="Night penalty payable to Off Set crew?" value={tc.nightPenaltyOffSet} onChange={(v) => up({ nightPenaltyOffSet: v })} color={color} disabled={d} />
                <PillToggle label="Night penalty payable for non-shooting hours?" value={tc.nightPenaltyNonShooting} onChange={(v) => up({ nightPenaltyNonShooting: v })} color={color} disabled={d} />
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── Section 5: Preferences ── */}
        <SectionCard
          title="Preferences"
          description="Timecard display and behaviour preferences."
          color={color}
          delay={0.25}
        >
          <div className="space-y-4">
            {/* Auto submit PDF option */}
            <div>
              <span className="text-gray-700 dark:text-gray-300 block mb-2" style={{ fontSize: "0.56rem" }}>
                If a timecard is automatically submitted, in the 'crew approval' on the PDF, show
              </span>
              <div className="flex gap-3">
                {AUTO_SUBMIT_PDF.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => up({ autoSubmitPdfShow: opt })}
                    disabled={d}
                    className={cn(
                      "px-4 py-2 rounded-xl border-2 transition-all",
                      tc.autoSubmitPdfShow === opt ? "text-white" : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300",
                    )}
                    style={tc.autoSubmitPdfShow === opt
                      ? { background: `linear-gradient(135deg, ${color}, ${color}cc)`, borderColor: color }
                      : {}}
                  >
                    <span style={{ fontSize: "0.54rem" }}>{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            <PillToggle
              label="Require meal start and end times to be entered on timecards?"
              value={tc.requireMealTimes}
              onChange={(v) => up({ requireMealTimes: v })}
              color={color}
              disabled={d}
            />

            <div>
              <PillToggle
                label="Only apply pre and post overtime for Transport department specific offers"
                value={tc.transportDeptOnly}
                onChange={(v) => up({ transportDeptOnly: v })}
                color={color}
                disabled={d}
              />
              <span className="text-gray-400 dark:text-gray-500 block mt-1 pl-1" style={{ fontSize: "0.44rem" }}>
                When inactive all overtime and penalties will apply.
              </span>
            </div>

            <TCRuleSelect
              label="When including Travel time in your scheduled shooting day"
              tooltip={TC_TOOLTIPS.travelTimeInDay}
              value={tc.travelTimeInDay}
              options={TRAVEL_TIME_OPTIONS}
              onChange={(v) => up({ travelTimeInDay: v })}
              color={color}
              disabled={d}
            />
          </div>
        </SectionCard>

        {/* ── Section 6: Roundings ── */}
        <SectionCard
          title="Roundings"
          description="How overtime periods are rounded for calculation."
          color={color}
          delay={0.3}
        >
          <TCRuleSelect label="Camera overtime rounding" value={tc.camOTRounding} options={CAM_OT_ROUNDING} onChange={(v) => up({ camOTRounding: v })} color={color} disabled={d} />
          <TCRuleSelect label="Other overtime rounding" value={tc.otherOTRounding} options={OTHER_OT_ROUNDING} onChange={(v) => up({ otherOTRounding: v })} color={color} disabled={d} />
        </SectionCard>

        {/* ── Section 7: Allowances ── */}
        <SectionCard
          title="Allowances"
          description="Allowances to be paid when Public Holiday is not worked."
          color={color}
          delay={0.35}
        >
          <div className="grid grid-cols-3 gap-x-6">
            {ALLOWANCE_TYPES.map((a) => (
              <PillToggle
                key={a}
                label={a}
                value={!!tc.allowances[a]}
                onChange={(v) => updateAllow(a, v)}
                color={color}
                disabled={d}
              />
            ))}
          </div>
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

export default TimecardTab;