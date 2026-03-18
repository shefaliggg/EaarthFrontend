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
          style={{
            background:
              "linear-gradient(90deg, transparent, #22c55e66, transparent)",
          }}
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div
          style={{ width: 40, height: 40 }}
          className="relative inline-flex items-center justify-center"
        >
          <svg width="40" height="40" className="-rotate-90">
            <circle
              cx="20"
              cy="20"
              r={radius}
              strokeWidth={strokeWidth}
              className="fill-none stroke-muted"
            />
            <motion.circle
              cx="20"
              cy="20"
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              stroke={locked ? "#22c55e" : color} // ← direct prop, not style={}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset:
                  circumference - (progressPercentage / 100) * circumference,
              }}
              transition={{ duration: 0.8 }}
            />
          </svg>
          <div className="absolute flex items-center justify-center">
            {locked ? (
              <CircleCheck className="w-5 h-5 text-emerald-500" />
            ) : (
              <span className="text-xs font-medium tabular-nums">
                {progressPercentage}%
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-foreground font-medium text-[0.95rem]">
            {label}
          </h2>
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
        style={{
          borderColor: `${color}30`,
          backgroundColor: `${color}05`,
          fontSize: "0.56rem",
          color,
        }}
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
        {/* LEFT — status + progress bar */}
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: locked ? "#22c55e" : "#a3e635" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span
            className="text-gray-400 dark:text-gray-500"
            style={{ fontSize: "0.6rem" }}
          >
            {locked ? "This tab is locked" : "All changes auto-saved"}
          </span>

          {/* Mini progress bar — only when unlocked and incomplete */}
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
              <span
                className="text-gray-300 dark:text-gray-600"
                style={{ fontSize: "0.52rem" }}
              >
                {progressPercentage}%
              </span>
            </div>
          )}
        </div>

        {/* RIGHT — Lock / Unlock button */}
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
              ? {
                  background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                  fontSize: "0.7rem",
                }
              : { fontSize: "0.7rem" }
          }
        >
          {locked ? (
            <>
              <Unlock className="w-3.5 h-3.5" /> Unlock Tab
            </>
          ) : canLock ? (
            <>
              <Lock className="w-3.5 h-3.5" /> Lock &amp; Continue{" "}
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" /> Complete to Lock
            </>
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
        style={{
          background: `linear-gradient(135deg, ${color}15, transparent 60%)`,
        }}
      />
      <div className="rounded-2xl bg-card border border-gray-100/80 dark:border-gray-800/50 shadow-sm transition-shadow duration-300">
        <div className="flex items-center p-4 gap-3 border-b border-gray-50/80 dark:border-gray-800/40">
          <div
            className="w-1.5 h-5 rounded-full origin-center transition-transform duration-300 ease-out group-hover:scale-y-125"
            style={{
              background: `linear-gradient(180deg, ${color}, ${color}60)`,
            }}
          />
          <div className="flex flex-col">
            <h3 className="text-gray-900 dark:text-gray-100 text-sm">
              {title}
            </h3>
            {description && (
              <p className="text-gray-400 dark:text-gray-500 text-[0.6rem] mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────
   INPUT FIELD
───────────────────────────────────────────────────────── */
function InputField({
  label,
  value,
  onChange,
  placeholder,
  type,
  color,
  required,
  disabled,
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = String(value ?? "").length > 0;
  const shouldUppercase = !type || type === "text";

  return (
    <div className="relative">
      <Input
        value={value}
        type={type || "text"}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={
          focused ? placeholder || label.replace(/\s*\*\s*$/, "") : ""
        }
        onChange={(e) => {
          const v = shouldUppercase
            ? e.target.value.toUpperCase()
            : e.target.value;
          onChange(v);
        }}
        style={{
          ...(shouldUppercase ? { textTransform: "uppercase" } : {}),
          ...(focused ? { borderColor: `${color}40` } : {}),
        }}
        className="pt-5 pb-2 px-3.5 rounded-xl focus:border-transparent text-[0.72rem]"
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
        {required && <span style={{ color }}> *</span>}
      </motion.label>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SELECT FIELD
───────────────────────────────────────────────────────── */
function SelectField({
  label,
  value,
  onChange,
  options,
  color,
  disabled,
  required,
}) {
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
          <option key={o} value={o}>
            {o}
          </option>
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
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
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
      <span className="text-gray-500 dark:text-gray-400 text-[0.65rem]">
        {label}
      </span>
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
   TOOLTIP ICON
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
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-2.5"
            style={{ fontSize: "0.5rem" }}
          >
            <span className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   RATES CREW TAB
───────────────────────────────────────────────────────── */
function RatesCrewTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  const MULTIPLIERS = ["1.0", "1.5", "2.0"];

  /* ── 6th/7th Day ── */
  const [sixSeven, setSixSeven] = useState(() =>
    loadSettings(projectId, "crew-6th7th", {
      sixthDayMultiplier: "1.5",
      seventhDayMultiplier: "2.0",
      showMinHoursInOffers: false,
    }),
  );

  /* ── Overtime ── */
  const [ot, setOt] = useState(() =>
    loadSettings(projectId, "crew-overtime", {
      customOtRate1: "",
      customOtRate2: "",
      customOtRate3: "",
    }),
  );

  /* ── Other (Camera) ── */
  const [other, setOther] = useState(() =>
    loadSettings(projectId, "crew-other", {
      cameraStandardDay: "",
      cameraContinuousDay: "",
      cameraSemiContinuousDay: "",
    }),
  );

  const updateAndPersist = (storageKey, newValue, setState) => {
    setState(newValue);
    saveSettings(projectId, storageKey, newValue);
  };

  /* ── Lock handler ── */
  const handleLock = () => {
    setTabLockStatusById((prev) => ({
      ...prev,
      [tabId]: !prev[tabId],
    }));
  };

  /* ── Progress ── */
  const requiredFields = [
    sixSeven.sixthDayMultiplier,
    sixSeven.seventhDayMultiplier,
  ];

  const progressPercentage = Math.round(
    (requiredFields.filter(Boolean).length / requiredFields.length) * 100,
  );

  useEffect(() => {
    setTabProgressById((prev) => ({ ...prev, [tabId]: progressPercentage }));
  }, [progressPercentage, tabId, setTabProgressById]);

  const pactTooltip =
    "For projects using the Film PACT/BECTU MMPA, this multiplier will only apply to crew who are on deals outside of the agreement (e.g. Unit Drivers, or individuals on over £3,000/wk for whom OT is negotiable).";

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
        label="Standard Crew"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div
        className={cn(locked && "opacity-50 pointer-events-none select-none")}
      >
        {/* ── Section 1: 6th/7th Days ── */}
        <SectionCard
          title="6th/7th Days"
          description="Fee multipliers for 6th and 7th day work."
          color={color}
          delay={0.05}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* 6th Day */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="text-gray-500 dark:text-gray-400 uppercase"
                    style={{ fontSize: "0.52rem" }}
                  >
                    6th Day Fee Multiplier
                  </span>
                  <TooltipIcon text={pactTooltip} color={color} />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-gray-500 dark:text-gray-400"
                    style={{ fontSize: "0.7rem" }}
                  >
                    x
                  </span>
                  <div className="flex-1">
                    <SelectField
                      label=""
                      value={sixSeven.sixthDayMultiplier}
                      onChange={(v) =>
                        updateAndPersist(
                          "crew-6th7th",
                          { ...sixSeven, sixthDayMultiplier: v },
                          setSixSeven,
                        )
                      }
                      options={MULTIPLIERS}
                      color={color}
                      disabled={d}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 7th Day */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="text-gray-500 dark:text-gray-400 uppercase"
                    style={{ fontSize: "0.52rem" }}
                  >
                    7th Day Fee Multiplier
                  </span>
                  <TooltipIcon text={pactTooltip} color={color} />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-gray-500 dark:text-gray-400"
                    style={{ fontSize: "0.7rem" }}
                  >
                    x
                  </span>
                  <div className="flex-1">
                    <SelectField
                      label=""
                      value={sixSeven.seventhDayMultiplier}
                      onChange={(v) =>
                        updateAndPersist(
                          "crew-6th7th",
                          { ...sixSeven, seventhDayMultiplier: v },
                          setSixSeven,
                        )
                      }
                      options={MULTIPLIERS}
                      color={color}
                      disabled={d}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <PillToggle
              label="Show minimum hours on 6th and 7th days in offers?"
              value={sixSeven.showMinHoursInOffers}
              onChange={(v) =>
                updateAndPersist(
                  "crew-6th7th",
                  { ...sixSeven, showMinHoursInOffers: v },
                  setSixSeven,
                )
              }
              color={color}
              disabled={d}
            />
          </div>
        </SectionCard>

        {/* ── Section 2: Overtime ── */}
        <SectionCard
          title="Overtime"
          description="Custom overtime rates which an offer will default to if you choose not to pay overtime as 'Calculated per agreement'."
          color={color}
          delay={0.1}
        >
          <div className="space-y-4">
            <InputField
              label="Other"
              value={ot.customOtRate1}
              onChange={(v) =>
                updateAndPersist(
                  "crew-overtime",
                  { ...ot, customOtRate1: v },
                  setOt,
                )
              }
              color={color}
              disabled={d}
            />
            <InputField
              label="Camera - standard day"
              value={other.cameraStandardDay}
              onChange={(v) =>
                updateAndPersist(
                  "crew-other",
                  { ...other, cameraStandardDay: v },
                  setOther,
                )
              }
              color={color}
              disabled={d}
            />
            <InputField
              label="Camera - continuous day"
              value={other.cameraContinuousDay}
              onChange={(v) =>
                updateAndPersist(
                  "crew-other",
                  { ...other, cameraContinuousDay: v },
                  setOther,
                )
              }
              color={color}
              disabled={d}
            />
            <InputField
              label="Camera - semi-continuous day"
              value={other.cameraSemiContinuousDay}
              onChange={(v) =>
                updateAndPersist(
                  "crew-other",
                  { ...other, cameraSemiContinuousDay: v },
                  setOther,
                )
              }
              color={color}
              disabled={d}
            />
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

export default RatesCrewTab;
