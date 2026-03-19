import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CircleCheck,
  Shield,
  Sparkles,
  Lock,
  Unlock,
  ArrowRight,
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
   DEFAULT CALENDAR SETTINGS
───────────────────────────────────────────────────────── */
const DEFAULT_CALENDAR = {
  weekStartDay: "Monday",
  defaultView: "Month",
  showWeekNumbers: false,
  enableDragDrop: true,
  enableRecurringEvents: true,
  enableColourCoding: true,
  showPublicHolidays: true,
  holidayRegion: "United Kingdom",
  showShootDays: true,
  showTravelDays: true,
  showRestDays: true,
  showOfficialRestDays: true,
  showPreProduction: true,
  showPostProduction: true,
  enableNotifications: true,
  notifyDayBefore: true,
  notifyMorningOf: true,
  notifyTime: "07:00",
  syncToGoogleCalendar: false,
  syncToOutlook: false,
  syncToAppleCalendar: false,
  enableICalFeed: false,
  autoPopulateFromDates: true,
  lockPastDates: false,
  requireApprovalForChanges: false,
  showCrewAvailability: true,
  showDepartmentSchedules: true,
  maxLookAheadWeeks: "52",
};

/* ─────────────────────────────────────────────────────────
   CALENDAR TAB
───────────────────────────────────────────────────────── */
function CalendarTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  const [cfg, setCfg] = useState(() =>
    loadSettings(projectId, "calendar-settings", DEFAULT_CALENDAR)
  );

  const up = (patch) => {
    const next = { ...cfg, ...patch };
    setCfg(next);
    saveSettings(projectId, "calendar-settings", next);
  };

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
        label="Calendar"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: General ── */}
        <SectionCard
          title="General"
          description="Calendar display and behaviour settings."
          color={color}
          delay={0.05}
        >
          <div className="grid grid-cols-3 gap-3 mb-4">
            <SelectField
              label="Week starts on"
              value={cfg.weekStartDay}
              onChange={(v) => up({ weekStartDay: v })}
              options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
              color={color}
              disabled={d}
            />
            <SelectField
              label="Default view"
              value={cfg.defaultView}
              onChange={(v) => up({ defaultView: v })}
              options={["Day", "Week", "Month", "Quarter", "Year"]}
              color={color}
              disabled={d}
            />
            <InputField
              label="Max look-ahead (weeks)"
              value={cfg.maxLookAheadWeeks}
              onChange={(v) => up({ maxLookAheadWeeks: v })}
              type="number"
              color={color}
              disabled={d}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-6">
            <PillToggle label="Show week numbers" value={cfg.showWeekNumbers} onChange={(v) => up({ showWeekNumbers: v })} color={color} disabled={d} />
            <PillToggle label="Enable drag & drop" value={cfg.enableDragDrop} onChange={(v) => up({ enableDragDrop: v })} color={color} disabled={d} />
            <PillToggle label="Enable recurring events" value={cfg.enableRecurringEvents} onChange={(v) => up({ enableRecurringEvents: v })} color={color} disabled={d} />
            <PillToggle label="Enable colour coding" value={cfg.enableColourCoding} onChange={(v) => up({ enableColourCoding: v })} color={color} disabled={d} />
          </div>
        </SectionCard>

        {/* ── Section 2: Day Types ── */}
        <SectionCard
          title="Day Types"
          description="Which day types to display on the calendar."
          color={color}
          delay={0.1}
        >
          <div className="grid grid-cols-2 gap-x-6">
            <PillToggle label="Show shoot days" value={cfg.showShootDays} onChange={(v) => up({ showShootDays: v })} color={color} disabled={d} />
            <PillToggle label="Show travel days" value={cfg.showTravelDays} onChange={(v) => up({ showTravelDays: v })} color={color} disabled={d} />
            <PillToggle label="Show rest days" value={cfg.showRestDays} onChange={(v) => up({ showRestDays: v })} color={color} disabled={d} />
            <PillToggle label="Show official rest days" value={cfg.showOfficialRestDays} onChange={(v) => up({ showOfficialRestDays: v })} color={color} disabled={d} />
            <PillToggle label="Show pre-production" value={cfg.showPreProduction} onChange={(v) => up({ showPreProduction: v })} color={color} disabled={d} />
            <PillToggle label="Show post-production" value={cfg.showPostProduction} onChange={(v) => up({ showPostProduction: v })} color={color} disabled={d} />
          </div>
        </SectionCard>

        {/* ── Section 3: Public Holidays ── */}
        <SectionCard
          title="Public Holidays"
          description="Holiday region for the project calendar."
          color={color}
          delay={0.15}
        >
          <PillToggle
            label="Show public holidays"
            value={cfg.showPublicHolidays}
            onChange={(v) => up({ showPublicHolidays: v })}
            color={color}
            disabled={d}
          />
          {cfg.showPublicHolidays && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden mt-3"
            >
              <SelectField
                label="Holiday region"
                value={cfg.holidayRegion}
                onChange={(v) => up({ holidayRegion: v })}
                options={["United Kingdom", "Ireland", "Iceland", "Malta", "United States", "Canada", "Australia"]}
                color={color}
                disabled={d}
              />
            </motion.div>
          )}
        </SectionCard>

        {/* ── Section 4: Notifications ── */}
        <SectionCard
          title="Notifications"
          description="Calendar event reminder and notification settings."
          color={color}
          delay={0.2}
        >
          <div className="grid grid-cols-2 gap-x-6">
            <PillToggle label="Enable notifications" value={cfg.enableNotifications} onChange={(v) => up({ enableNotifications: v })} color={color} disabled={d} />
            <PillToggle label="Notify day before" value={cfg.notifyDayBefore} onChange={(v) => up({ notifyDayBefore: v })} color={color} disabled={d} />
            <PillToggle label="Notify morning of" value={cfg.notifyMorningOf} onChange={(v) => up({ notifyMorningOf: v })} color={color} disabled={d} />
          </div>
          {cfg.enableNotifications && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden mt-3 max-w-xs"
            >
              <InputField
                label="Notification time"
                value={cfg.notifyTime}
                onChange={(v) => up({ notifyTime: v })}
                type="time"
                color={color}
                disabled={d}
              />
            </motion.div>
          )}
        </SectionCard>

        {/* ── Section 5: Sync & Integration ── */}
        <SectionCard
          title="Sync & Integration"
          description="Sync your project calendar with external calendar providers."
          color={color}
          delay={0.25}
        >
          <div className="grid grid-cols-2 gap-x-6">
            <PillToggle label="Sync to Google Calendar" value={cfg.syncToGoogleCalendar} onChange={(v) => up({ syncToGoogleCalendar: v })} color={color} disabled={d} />
            <PillToggle label="Sync to Outlook" value={cfg.syncToOutlook} onChange={(v) => up({ syncToOutlook: v })} color={color} disabled={d} />
            <PillToggle label="Sync to Apple Calendar" value={cfg.syncToAppleCalendar} onChange={(v) => up({ syncToAppleCalendar: v })} color={color} disabled={d} />
            <PillToggle label="Enable iCal feed" value={cfg.enableICalFeed} onChange={(v) => up({ enableICalFeed: v })} color={color} disabled={d} />
          </div>
          <p className="text-gray-400 dark:text-gray-500 mt-2 px-1" style={{ fontSize: "0.46rem" }}>
            Syncing allows crew to see the project schedule in their personal calendar apps.
          </p>
        </SectionCard>

        {/* ── Section 6: Permissions ── */}
        <SectionCard
          title="Permissions"
          description="Control who can edit the calendar and what they can see."
          color={color}
          delay={0.3}
        >
          <div className="grid grid-cols-2 gap-x-6">
            <PillToggle label="Auto-populate from project dates" value={cfg.autoPopulateFromDates} onChange={(v) => up({ autoPopulateFromDates: v })} color={color} disabled={d} />
            <PillToggle label="Lock past dates" value={cfg.lockPastDates} onChange={(v) => up({ lockPastDates: v })} color={color} disabled={d} />
            <PillToggle label="Require approval for changes" value={cfg.requireApprovalForChanges} onChange={(v) => up({ requireApprovalForChanges: v })} color={color} disabled={d} />
            <PillToggle label="Show crew availability" value={cfg.showCrewAvailability} onChange={(v) => up({ showCrewAvailability: v })} color={color} disabled={d} />
            <PillToggle label="Show department schedules" value={cfg.showDepartmentSchedules} onChange={(v) => up({ showDepartmentSchedules: v })} color={color} disabled={d} />
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

export default CalendarTab;