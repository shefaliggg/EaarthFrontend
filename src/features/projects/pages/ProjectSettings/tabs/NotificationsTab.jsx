import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
   DAYS OF WEEK
───────────────────────────────────────────────────────── */
const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

/* ─────────────────────────────────────────────────────────
   NOTIFICATIONS TAB
───────────────────────────────────────────────────────── */
function NotificationsTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  /* ── Offers notifications ── */
  const [offers, setOffers] = useState(() =>
    loadSettings(projectId, "notif-offers", {
      notifyOnOfferSent: true,
      notifyOnOfferAccepted: true,
      notifyOnOfferDeclined: true,
      notifyOnOfferExpired: true,
      notifyOnCounterOffer: true,
      sendReminders: true,
      reminderDays: "3",
      ccAccountsOnOffer: false,
      ccProductionOnOffer: false,
    }),
  );

  /* ── Timecards notifications ── */
  const [timecards, setTimecards] = useState(() =>
    loadSettings(projectId, "notif-timecards", {
      notifyOnSubmission: true,
      notifyOnApproval: true,
      notifyOnRejection: true,
      notifyOnExport: true,
      weeklyDigest: true,
      digestDay: "Monday",
    }),
  );

  /* ── General notifications ── */
  const [general, setGeneral] = useState(() =>
    loadSettings(projectId, "notif-general", {
      notifyOnCrewJoin: true,
      notifyOnCrewLeave: true,
      notifyOnDocUpload: true,
      notifyOnCalendarChange: true,
      notifyOnSettingsChange: false,
      systemMaintenance: true,
    }),
  );

  /* ── Summary emails ── */
  const [summary, setSummary] = useState(() =>
    loadSettings(projectId, "notif-summary", {
      dailySummary: false,
      weeklySummary: true,
      summaryDay: "Friday",
      summaryTime: "17:00",
      includeFinancials: false,
      includeCrewChanges: true,
      includeTimecardStatus: true,
      recipients: "Production Supervisor, Accounts Supervisor",
    }),
  );

  /* ── Generic update + persist helper ── */
  const up = (key, val, setter) => {
    setter(val);
    saveSettings(projectId, key, val);
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
        label="Notifications"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Offers ── */}
        <SectionCard
          title="Offers"
          description="Notification preferences for offer-related events."
          color={color}
          delay={0.05}
        >
          <div className="grid grid-cols-2 gap-x-6">
            <PillToggle
              label="Notify when offer sent"
              value={offers.notifyOnOfferSent}
              onChange={(v) => up("notif-offers", { ...offers, notifyOnOfferSent: v }, setOffers)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Notify when offer accepted"
              value={offers.notifyOnOfferAccepted}
              onChange={(v) => up("notif-offers", { ...offers, notifyOnOfferAccepted: v }, setOffers)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Notify when offer declined"
              value={offers.notifyOnOfferDeclined}
              onChange={(v) => up("notif-offers", { ...offers, notifyOnOfferDeclined: v }, setOffers)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Notify when offer expired"
              value={offers.notifyOnOfferExpired}
              onChange={(v) => up("notif-offers", { ...offers, notifyOnOfferExpired: v }, setOffers)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Notify on counter offer"
              value={offers.notifyOnCounterOffer}
              onChange={(v) => up("notif-offers", { ...offers, notifyOnCounterOffer: v }, setOffers)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Send reminders for pending offers"
              value={offers.sendReminders}
              onChange={(v) => up("notif-offers", { ...offers, sendReminders: v }, setOffers)}
              color={color} disabled={d}
            />
          </div>

          {/* Reminder days — only shown when sendReminders is on */}
          <AnimatePresence>
            {offers.sendReminders && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-2"
              >
                <div className="max-w-xs">
                  <InputField
                    label="Reminder after (days)"
                    value={offers.reminderDays}
                    onChange={(v) => up("notif-offers", { ...offers, reminderDays: v }, setOffers)}
                    type="number"
                    color={color}
                    disabled={d}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-x-6 mt-2">
            <PillToggle
              label="CC Accounts on offer emails"
              value={offers.ccAccountsOnOffer}
              onChange={(v) => up("notif-offers", { ...offers, ccAccountsOnOffer: v }, setOffers)}
              color={color} disabled={d}
            />
            <PillToggle
              label="CC Production on offer emails"
              value={offers.ccProductionOnOffer}
              onChange={(v) => up("notif-offers", { ...offers, ccProductionOnOffer: v }, setOffers)}
              color={color} disabled={d}
            />
          </div>
        </SectionCard>

        {/* ── Section 2: Timecards ── */}
        <SectionCard
          title="Timecards"
          description="Notifications for timecard submission and approval."
          color={color}
          delay={0.1}
        >
          <div className="grid grid-cols-2 gap-x-6">
            <PillToggle
              label="Notify on submission"
              value={timecards.notifyOnSubmission}
              onChange={(v) => up("notif-timecards", { ...timecards, notifyOnSubmission: v }, setTimecards)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Notify on approval"
              value={timecards.notifyOnApproval}
              onChange={(v) => up("notif-timecards", { ...timecards, notifyOnApproval: v }, setTimecards)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Notify on rejection"
              value={timecards.notifyOnRejection}
              onChange={(v) => up("notif-timecards", { ...timecards, notifyOnRejection: v }, setTimecards)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Notify on export"
              value={timecards.notifyOnExport}
              onChange={(v) => up("notif-timecards", { ...timecards, notifyOnExport: v }, setTimecards)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Weekly digest"
              value={timecards.weeklyDigest}
              onChange={(v) => up("notif-timecards", { ...timecards, weeklyDigest: v }, setTimecards)}
              color={color} disabled={d}
            />
          </div>

          {/* Digest day — only shown when weeklyDigest is on */}
          <AnimatePresence>
            {timecards.weeklyDigest && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-2"
              >
                <div className="max-w-xs">
                  <SelectField
                    label="Digest Day"
                    value={timecards.digestDay}
                    onChange={(v) => up("notif-timecards", { ...timecards, digestDay: v }, setTimecards)}
                    options={DAYS_OF_WEEK}
                    color={color}
                    disabled={d}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionCard>

        {/* ── Section 3: General ── */}
        <SectionCard
          title="General"
          description="General project notifications."
          color={color}
          delay={0.15}
        >
          <div className="grid grid-cols-2 gap-x-6">
            <PillToggle
              label="Crew member joins"
              value={general.notifyOnCrewJoin}
              onChange={(v) => up("notif-general", { ...general, notifyOnCrewJoin: v }, setGeneral)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Crew member leaves"
              value={general.notifyOnCrewLeave}
              onChange={(v) => up("notif-general", { ...general, notifyOnCrewLeave: v }, setGeneral)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Document uploaded"
              value={general.notifyOnDocUpload}
              onChange={(v) => up("notif-general", { ...general, notifyOnDocUpload: v }, setGeneral)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Calendar changes"
              value={general.notifyOnCalendarChange}
              onChange={(v) => up("notif-general", { ...general, notifyOnCalendarChange: v }, setGeneral)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Settings changes"
              value={general.notifyOnSettingsChange}
              onChange={(v) => up("notif-general", { ...general, notifyOnSettingsChange: v }, setGeneral)}
              color={color} disabled={d}
            />
            <PillToggle
              label="System maintenance"
              value={general.systemMaintenance}
              onChange={(v) => up("notif-general", { ...general, systemMaintenance: v }, setGeneral)}
              color={color} disabled={d}
            />
          </div>
        </SectionCard>

        {/* ── Section 4: Summary Emails ── */}
        <SectionCard
          title="Summary Emails"
          description="Automated summary email delivery."
          color={color}
          delay={0.2}
        >
          <div className="grid grid-cols-2 gap-x-6">
            <PillToggle
              label="Daily summary"
              value={summary.dailySummary}
              onChange={(v) => up("notif-summary", { ...summary, dailySummary: v }, setSummary)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Weekly summary"
              value={summary.weeklySummary}
              onChange={(v) => up("notif-summary", { ...summary, weeklySummary: v }, setSummary)}
              color={color} disabled={d}
            />
          </div>

          {/* Summary day + time — only shown when weeklySummary is on */}
          <AnimatePresence>
            {summary.weeklySummary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-2"
              >
                <div className="grid grid-cols-2 gap-3">
                  <SelectField
                    label="Summary Day"
                    value={summary.summaryDay}
                    onChange={(v) => up("notif-summary", { ...summary, summaryDay: v }, setSummary)}
                    options={DAYS_OF_WEEK}
                    color={color}
                    disabled={d}
                  />
                  <InputField
                    label="Summary Time"
                    value={summary.summaryTime}
                    onChange={(v) => up("notif-summary", { ...summary, summaryTime: v }, setSummary)}
                    type="time"
                    color={color}
                    disabled={d}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-x-6 mt-2">
            <PillToggle
              label="Include financials"
              value={summary.includeFinancials}
              onChange={(v) => up("notif-summary", { ...summary, includeFinancials: v }, setSummary)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Include crew changes"
              value={summary.includeCrewChanges}
              onChange={(v) => up("notif-summary", { ...summary, includeCrewChanges: v }, setSummary)}
              color={color} disabled={d}
            />
            <PillToggle
              label="Include timecard status"
              value={summary.includeTimecardStatus}
              onChange={(v) => up("notif-summary", { ...summary, includeTimecardStatus: v }, setSummary)}
              color={color} disabled={d}
            />
          </div>

          <div className="mt-2">
            <InputField
              label="Summary Recipients"
              value={summary.recipients}
              onChange={(v) => up("notif-summary", { ...summary, recipients: v }, setSummary)}
              color={color}
              disabled={d}
            />
            <p className="text-gray-400 dark:text-gray-500 mt-1 px-1" style={{ fontSize: "0.46rem" }}>
              Comma-separated role names who will receive summary emails.
            </p>
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

export default NotificationsTab;