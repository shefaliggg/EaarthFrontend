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
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
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

  // Only uppercase plain text — not dates, numbers, emails, tel
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
   TEXTAREA FIELD
───────────────────────────────────────────────────────── */
function TextareaField({
  label,
  value,
  onChange,
  maxLength,
  color,
  required,
  helpText,
  disabled,
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = String(value ?? "").length > 0;

  return (
    <div className="relative">
      <Textarea
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const v = e.target.value;
          if (maxLength && v.length > maxLength) return;
          onChange(v);
        }}
        style={focused ? { borderColor: `${color}40` } : undefined}
        placeholder={focused ? label : " "}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={5}
        className="pt-5 pb-2 text-[0.72rem] min-h-20"
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
      {(helpText || maxLength != null) && (
        <div className="flex justify-between mt-1 px-1 text-gray-400 dark:text-gray-500 text-[0.52rem]">
          {helpText && <p>{helpText}</p>}
          {maxLength != null && (
            <span className="ml-auto">
              {String(value ?? "").length} / {maxLength}
            </span>
          )}
        </div>
      )}
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
   RATES PROJECT TAB
───────────────────────────────────────────────────────── */
function RatesProjectTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  const CURRENCIES = ["AUD", "CAD", "DKK", "EUR", "GBP", "ISK", "NZD", "USD"];

  /* ── Basic ── */
  const [basic, setBasic] = useState(() =>
    loadSettings(projectId, "proj-defaults-basic", {
      workingWeek: "",
      showPrepWrapMins: false,
    }),
  );

  /* ── Allowances ── */
  const [allow, setAllow] = useState(() =>
    loadSettings(projectId, "proj-defaults-allow", {
      box: false,
      computer: false,
      software: false,
      equipment: false,
      mobile: false,
      requireMobileBill: false,
      mobileBillTerms: "Reimbursement of mobile phone bill",
      vehicleAllowance: false,
      requireBusinessInsurance: false,
      requireDrivingLicence: false,
      vehicleHire: false,
      perDiem: false,
      perDiemCurrency: "",
      perDiemShootRate: "25.00",
      perDiemNonShootRate: "40.00",
      living: false,
    }),
  );

  /* ── Meal Penalties ── */
  const [meals, setMeals] = useState(() =>
    loadSettings(projectId, "proj-defaults-meals", {
      breakfastPenalty: "5.00",
      lunchPenalty: "5.00",
      dinnerPenalty: "10.00",
    }),
  );

  /* ── Notice ── */
  const [notice, setNotice] = useState(() =>
    loadSettings(projectId, "proj-defaults-notice", {
      noticePeriod: "",
      noticeWording:
        "Dear [Loan Out Company Name] / [Crew member name],\n(Original notice):\nOn behalf of Mirage Pictures Limited, I hereby confirm that your last day of engagement on Werwulf will be [finish date].\n(Revised notice):\nFurther to your notice dated [date of previous notice], I hereby confirm that your revised last day of engagement on Werwulf will be [revised finish date].\nMany thanks for your hard work on the production.",
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
  const requiredFields = [basic.workingWeek, notice.noticePeriod];

  const progressPercentage = Math.round(
    (requiredFields.filter(Boolean).length / requiredFields.length) * 100,
  );

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
        label="Project"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Basic ── */}
        <SectionCard
          title="Basic"
          description="Core project working week configuration. Currency is managed per company in the Contacts tab."
          color={color}
          delay={0.05}
        >
          <div className="space-y-3">
            <SelectField
              label="Working Week"
              value={basic.workingWeek}
              onChange={(v) =>
                updateAndPersist(
                  "proj-defaults-basic",
                  { ...basic, workingWeek: v },
                  setBasic,
                )
              }
              options={["5 days", "5.5 days", "5/6 days", "6 days"]}
              color={color}
              disabled={d}
              required
            />
            <PillToggle
              label="Show prep/wrap mins in Offer view?"
              value={basic.showPrepWrapMins}
              onChange={(v) =>
                updateAndPersist(
                  "proj-defaults-basic",
                  { ...basic, showPrepWrapMins: v },
                  setBasic,
                )
              }
              color={color}
              disabled={d}
            />
          </div>
        </SectionCard>

        {/* ── Section 2: Allowances ── */}
        <SectionCard
          title="Allowances"
          description="Which of these allowances might you pay?"
          color={color}
          delay={0.1}
        >
          <div className="space-y-3">

            {/* Simple 2-col grid toggles */}
            <div className="grid grid-cols-2 gap-x-6">
              <PillToggle
                label="Box"
                value={allow.box}
                onChange={(v) =>
                  updateAndPersist("proj-defaults-allow", { ...allow, box: v }, setAllow)
                }
                color={color}
                disabled={d}
              />
              <PillToggle
                label="Computer"
                value={allow.computer}
                onChange={(v) =>
                  updateAndPersist("proj-defaults-allow", { ...allow, computer: v }, setAllow)
                }
                color={color}
                disabled={d}
              />
              <PillToggle
                label="Software"
                value={allow.software}
                onChange={(v) =>
                  updateAndPersist("proj-defaults-allow", { ...allow, software: v }, setAllow)
                }
                color={color}
                disabled={d}
              />
              <PillToggle
                label="Equipment"
                value={allow.equipment}
                onChange={(v) =>
                  updateAndPersist("proj-defaults-allow", { ...allow, equipment: v }, setAllow)
                }
                color={color}
                disabled={d}
              />
            </div>

            {/* Mobile — nested reveal */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-800/10 p-3 space-y-2">
              <PillToggle
                label="Mobile"
                value={allow.mobile}
                onChange={(v) =>
                  updateAndPersist("proj-defaults-allow", { ...allow, mobile: v }, setAllow)
                }
                color={color}
                disabled={d}
              />
              <AnimatePresence>
                {allow.mobile && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 ml-1 overflow-hidden"
                  >
                    <PillToggle
                      label="Require mobile phone allowance bill?"
                      value={allow.requireMobileBill}
                      onChange={(v) =>
                        updateAndPersist(
                          "proj-defaults-allow",
                          { ...allow, requireMobileBill: v },
                          setAllow,
                        )
                      }
                      color={color}
                      disabled={d}
                    />
                    <p
                      className="text-gray-400 dark:text-gray-500 block px-1 -mt-1"
                      style={{ fontSize: "0.48rem" }}
                    >
                      When selected, crew will be required to upload their
                      latest phone bill to accept an offer that includes mobile
                      allowance.
                    </p>
                    <InputField
                      label="Mobile phone bill reimbursement default terms"
                      value={allow.mobileBillTerms}
                      onChange={(v) =>
                        updateAndPersist(
                          "proj-defaults-allow",
                          { ...allow, mobileBillTerms: v },
                          setAllow,
                        )
                      }
                      color={color}
                      disabled={d}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Vehicle Allowance — nested reveal */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-800/10 p-3 space-y-2">
              <PillToggle
                label="Vehicle Allowance"
                value={allow.vehicleAllowance}
                onChange={(v) =>
                  updateAndPersist(
                    "proj-defaults-allow",
                    { ...allow, vehicleAllowance: v },
                    setAllow,
                  )
                }
                color={color}
                disabled={d}
              />
              <AnimatePresence>
                {allow.vehicleAllowance && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 ml-1 overflow-hidden"
                  >
                    <PillToggle
                      label="Require copy of Business Insurance?"
                      value={allow.requireBusinessInsurance}
                      onChange={(v) =>
                        updateAndPersist(
                          "proj-defaults-allow",
                          { ...allow, requireBusinessInsurance: v },
                          setAllow,
                        )
                      }
                      color={color}
                      disabled={d}
                    />
                    <PillToggle
                      label="Require copy of Driving Licence?"
                      value={allow.requireDrivingLicence}
                      onChange={(v) =>
                        updateAndPersist(
                          "proj-defaults-allow",
                          { ...allow, requireDrivingLicence: v },
                          setAllow,
                        )
                      }
                      color={color}
                      disabled={d}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Vehicle Hire */}
            <PillToggle
              label="Vehicle Hire"
              value={allow.vehicleHire}
              onChange={(v) =>
                updateAndPersist(
                  "proj-defaults-allow",
                  { ...allow, vehicleHire: v },
                  setAllow,
                )
              }
              color={color}
              disabled={d}
            />

            {/* Per Diem — nested reveal */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-800/10 p-3 space-y-2">
              <PillToggle
                label="Per Diem"
                value={allow.perDiem}
                onChange={(v) =>
                  updateAndPersist(
                    "proj-defaults-allow",
                    { ...allow, perDiem: v },
                    setAllow,
                  )
                }
                color={color}
                disabled={d}
              />
              <AnimatePresence>
                {allow.perDiem && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 ml-1 overflow-hidden"
                  >
                    <SelectField
                      label="Per Diem Currency"
                      value={allow.perDiemCurrency}
                      onChange={(v) =>
                        updateAndPersist(
                          "proj-defaults-allow",
                          { ...allow, perDiemCurrency: v },
                          setAllow,
                        )
                      }
                      options={CURRENCIES}
                      color={color}
                      disabled={d}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <InputField
                        label="Per Diem Shoot Rate"
                        value={allow.perDiemShootRate}
                        onChange={(v) =>
                          updateAndPersist(
                            "proj-defaults-allow",
                            { ...allow, perDiemShootRate: v },
                            setAllow,
                          )
                        }
                        type="number"
                        color={color}
                        disabled={d}
                      />
                      <InputField
                        label="Per Diem Non-Shoot Rate"
                        value={allow.perDiemNonShootRate}
                        onChange={(v) =>
                          updateAndPersist(
                            "proj-defaults-allow",
                            { ...allow, perDiemNonShootRate: v },
                            setAllow,
                          )
                        }
                        type="number"
                        color={color}
                        disabled={d}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Living */}
            <PillToggle
              label="Living"
              value={allow.living}
              onChange={(v) =>
                updateAndPersist(
                  "proj-defaults-allow",
                  { ...allow, living: v },
                  setAllow,
                )
              }
              color={color}
              disabled={d}
            />

          </div>
        </SectionCard>

        {/* ── Section 3: Meal Penalties ── */}
        <SectionCard
          title="Meal Penalties"
          description="Default penalty amounts when meals are not provided on time."
          color={color}
          delay={0.15}
        >
          <div className="grid grid-cols-3 gap-3">
            <InputField
              label="Breakfast Penalty"
              value={meals.breakfastPenalty}
              onChange={(v) =>
                updateAndPersist(
                  "proj-defaults-meals",
                  { ...meals, breakfastPenalty: v },
                  setMeals,
                )
              }
              type="number"
              color={color}
              disabled={d}
            />
            <InputField
              label="Lunch Penalty"
              value={meals.lunchPenalty}
              onChange={(v) =>
                updateAndPersist(
                  "proj-defaults-meals",
                  { ...meals, lunchPenalty: v },
                  setMeals,
                )
              }
              type="number"
              color={color}
              disabled={d}
            />
            <InputField
              label="Dinner Penalty"
              value={meals.dinnerPenalty}
              onChange={(v) =>
                updateAndPersist(
                  "proj-defaults-meals",
                  { ...meals, dinnerPenalty: v },
                  setMeals,
                )
              }
              type="number"
              color={color}
              disabled={d}
            />
          </div>
        </SectionCard>

        {/* ── Section 4: Notice ── */}
        <SectionCard
          title="Notice"
          description="Settings for 'Notice of termination of contract' emails."
          color={color}
          delay={0.2}
        >
          <div className="space-y-3">
            <div>
              <InputField
                label="Notice Period"
                value={notice.noticePeriod}
                onChange={(v) =>
                  updateAndPersist(
                    "proj-defaults-notice",
                    { ...notice, noticePeriod: v },
                    setNotice,
                  )
                }
                type="number"
                color={color}
                disabled={d}
                required
              />
              <p
                className="text-gray-400 dark:text-gray-500 mt-1 px-1"
                style={{ fontSize: "0.48rem" }}
              >
                In days.
              </p>
            </div>
            <TextareaField
              label="Notice Email Wording"
              value={notice.noticeWording}
              onChange={(v) =>
                updateAndPersist(
                  "proj-defaults-notice",
                  { ...notice, noticeWording: v },
                  setNotice,
                )
              }
              maxLength={2000}
              color={color}
              disabled={d}
              helpText="Template used in notice of termination emails. Use placeholders like [Crew member name], [finish date], etc."
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

export default RatesProjectTab;