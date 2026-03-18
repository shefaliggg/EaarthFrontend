import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleCheck,
  HelpCircle,
  Shield,
  Sparkles,
  Lock,
  Unlock,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/config/utils";
import { Textarea } from "@/shared/components/ui/textarea";
import { InfoTooltip } from "@/shared/components/InfoTooltip";

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
   Matches the TypeScript ActionFooter in settings-shared.tsx
   Props: locked, onLock, color, progressPercentage
───────────────────────────────────────────────────────── */
export function ActionFooter({ locked, onLock, color, progressPercentage }) {
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

          {/* Mini progress bar — only shown when unlocked and incomplete */}
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
  const shouldUppercase =
    !type || type === "text" || type === "tel" || type === "email";

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
          const v =
            shouldUppercase && !["email", "tel"].includes(type)
              ? e.target.value.toUpperCase()
              : e.target.value;
          onChange(v);
        }}
        style={{
          ...(shouldUppercase && !["email", "tel"].includes(type)
            ? { textTransform: "uppercase" }
            : {}),
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
      {/* Chevron */}
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
   SEGMENTED CONTROL
───────────────────────────────────────────────────────── */
function SegmentedControl({
  label,
  value,
  onChange,
  options,
  color,
  disabled,
  tooltip,
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span
          className="text-gray-400 dark:text-gray-500 uppercase"
          style={{ fontSize: "0.54rem", letterSpacing: "0.04em" }}
        >
          {label}
        </span>
        {tooltip && (
          <InfoTooltip content={tooltip}>
            <span className="flex items-center justify-center w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </InfoTooltip>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const isActive = value === o;
          return (
            <button
              key={o}
              disabled={disabled}
              onClick={() => onChange(o)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[0.62rem] uppercase transition-all duration-200 border",
                "flex items-center justify-center",
                disabled && "opacity-40 cursor-not-allowed",
                !disabled && "cursor-pointer",
              )}
              style={
                isActive
                  ? {
                      backgroundColor: `${color}15`,
                      borderColor: `${color}30`,
                      color,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }
                  : {
                      backgroundColor: "transparent",
                      borderColor: "#e5e7eb",
                      color: "#6b7280",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive && !disabled)
                  e.currentTarget.style.borderColor = "#d1d5db";
              }}
              onMouseLeave={(e) => {
                if (!isActive && !disabled)
                  e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DETAILS TAB
───────────────────────────────────────────────────────── */
function DetailsTab({
  color,
  project,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  /* ── Project Details ── */
  const [details, setDetails] = useState(() =>
    loadSettings(project.id, "proj-details", {
      title: project.name,
      codename: project.name,
      description: "",
      locations: "",
      additionalNotes: "",
    }),
  );

  /* ── Project Settings ── */
  const [settings, setSettings] = useState(() =>
    loadSettings(project.id, "proj-settings", {
      projectType: "Feature Film",
      showProjectTypeInOffers: true,
      legalTerritory: "United Kingdom",
      unionAgreement: "None",
      constructionUnionAgreement: "None",
      budget: "",
      showBudgetToCrew: false,
      holidayPayPct: "0%",
      differentHolidayForDailies: false,
      withholdHolidayOn6th7th: false,
      overtime: false,
      showWeeklyRateOfferView: false,
      showWeeklyRateDocuments: false,
      defaultWorkingHours: "",
      offerEndDate: "Optional",
      payrollCompany: "",
      crewDataCsvLayout: "",
      payrollCsvLayout: "",
    }),
  );

  /* ── Offer Handling ── */
  const [offer, setOffer] = useState(() =>
    loadSettings(project.id, "offer-handling", {
      shareStatusDetermination: false,
      taxStatusHandling: "",
      taxStatusQueryEmail: "",
      offerApproval: "",
    }),
  );

  const updateAndPersist = (storageKey, newValue, setState) => {
    setState(newValue);
    saveSettings(project.id, storageKey, newValue);
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
    details.title,
    details.codename,
    settings.projectType,
    settings.legalTerritory,
    settings.defaultWorkingHours,
    settings.payrollCompany,
    offer.taxStatusHandling,
    offer.offerApproval,
  ];

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
        label="Details"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div
        className={cn(locked && "opacity-50 pointer-events-none select-none")}
      >
        {/* ── Section 1: Project Details ── */}
        <SectionCard
          title="Project Details"
          description="Helpful information which is shown to crew and can be updated any time."
          color={color}
          delay={0.05}
        >
          <div className="grid grid-cols-2 gap-3 mb-3">
            <InputField
              label="Title"
              value={details.title}
              onChange={(v) =>
                updateAndPersist(
                  "proj-details",
                  { ...details, title: v },
                  setDetails,
                )
              }
              color={color}
              disabled={d}
              required
            />
            <div className="flex flex-col gap-1">
              <InputField
                label="Codename"
                value={details.codename}
                onChange={(v) =>
                  updateAndPersist(
                    "proj-details",
                    { ...details, codename: v },
                    setDetails,
                  )
                }
                color={color}
                disabled={d}
                required
              />
              <p className="text-gray-400 dark:text-gray-500 text-[0.52rem] px-1">
                If your project has an alternative name for secrecy, enter that.
                Otherwise enter the Project title. The Codename will be used in
                all emails and pages.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <TextareaField
              label="Description (Optional)"
              value={details.description}
              onChange={(v) =>
                updateAndPersist(
                  "proj-details",
                  { ...details, description: v },
                  setDetails,
                )
              }
              maxLength={300}
              color={color}
              disabled={d}
              helpText="A brief synopsis of the project which is helpful for crew joining the production."
            />
            <TextareaField
              label="Locations (Optional)"
              value={details.locations}
              onChange={(v) =>
                updateAndPersist(
                  "proj-details",
                  { ...details, locations: v },
                  setDetails,
                )
              }
              maxLength={300}
              color={color}
              disabled={d}
              helpText="Useful information, if known, which might help crew decide if they can accept the job."
            />
            <TextareaField
              label="Additional Notes (Optional)"
              value={details.additionalNotes}
              onChange={(v) =>
                updateAndPersist(
                  "proj-details",
                  { ...details, additionalNotes: v },
                  setDetails,
                )
              }
              maxLength={300}
              color={color}
              disabled={d}
              helpText="Use this to convey general project-wide information to crew."
            />
          </div>
        </SectionCard>

        {/* ── Section 2: Project Settings ── */}
        <SectionCard
          title="Project Settings"
          description="Essential settings which will govern how rates are calculated."
          color={color}
          delay={0.1}
        >
          <div className="space-y-4">
            <SegmentedControl
              label="Project Type"
              value={settings.projectType}
              onChange={(v) =>
                updateAndPersist(
                  "proj-settings",
                  { ...settings, projectType: v },
                  setSettings,
                )
              }
              options={["Feature Film", "Television"]}
              color={color}
              disabled={d}
              tooltip="Select Television for SVOD 'streaming' projects."
            />

            <PillToggle
              label="Show project type in offers?"
              value={settings.showProjectTypeInOffers}
              onChange={(v) =>
                updateAndPersist(
                  "proj-settings",
                  { ...settings, showProjectTypeInOffers: v },
                  setSettings,
                )
              }
              color={color}
              disabled={d}
            />

            <SegmentedControl
              label="Legal Territory"
              value={settings.legalTerritory}
              onChange={(v) =>
                updateAndPersist(
                  "proj-settings",
                  { ...settings, legalTerritory: v },
                  setSettings,
                )
              }
              options={["United Kingdom", "Iceland", "Ireland", "Malta"]}
              color={color}
              disabled={d}
            />

            <SegmentedControl
              label="Union Agreement"
              value={settings.unionAgreement}
              onChange={(v) =>
                updateAndPersist(
                  "proj-settings",
                  { ...settings, unionAgreement: v },
                  setSettings,
                )
              }
              options={["None", "PACT/BECTU Agreement (2021)"]}
              color={color}
              disabled={d}
              tooltip="Select 'None' if you will use terms which vary from the current Union Agreement. Select 'PACT/BECTU Agreement' even if you are only aligned to the agreement."
            />

            <SegmentedControl
              label="Construction Union Agreement"
              value={settings.constructionUnionAgreement}
              onChange={(v) =>
                updateAndPersist(
                  "proj-settings",
                  { ...settings, constructionUnionAgreement: v },
                  setSettings,
                )
              }
              options={["None", "PACT/BECTU Agreement", "Custom Agreement"]}
              color={color}
              disabled={d}
            />

            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Budget"
                value={settings.budget}
                onChange={(v) =>
                  updateAndPersist(
                    "proj-settings",
                    { ...settings, budget: v },
                    setSettings,
                  )
                }
                options={[
                  "Low (under £10 million)",
                  "Mid (between £10 - £30 million)",
                  "Major (over £30 million)",
                ]}
                color={color}
                disabled={d}
              />
              <div className="flex items-end pb-1">
                <PillToggle
                  label="Show budget level to crew members?"
                  value={settings.showBudgetToCrew}
                  onChange={(v) =>
                    updateAndPersist(
                      "proj-settings",
                      { ...settings, showBudgetToCrew: v },
                      setSettings,
                    )
                  }
                  color={color}
                  disabled={d}
                />
              </div>
            </div>

            <SegmentedControl
              label="Holiday Pay Percentage"
              value={settings.holidayPayPct}
              onChange={(v) =>
                updateAndPersist(
                  "proj-settings",
                  { ...settings, holidayPayPct: v },
                  setSettings,
                )
              }
              options={["0%", "10.77%", "12.07%"]}
              color={color}
              disabled={d}
            />

            <PillToggle
              label="Different holiday pay percentage for Dailies"
              value={settings.differentHolidayForDailies}
              onChange={(v) =>
                updateAndPersist(
                  "proj-settings",
                  { ...settings, differentHolidayForDailies: v },
                  setSettings,
                )
              }
              color={color}
              disabled={d}
            />

            <PillToggle
              label="Withhold holiday pay on 6th and 7th days"
              value={settings.withholdHolidayOn6th7th}
              onChange={(v) =>
                updateAndPersist(
                  "proj-settings",
                  { ...settings, withholdHolidayOn6th7th: v },
                  setSettings,
                )
              }
              color={color}
              disabled={d}
            />

            <PillToggle
              label="Overtime"
              value={settings.overtime}
              onChange={(v) =>
                updateAndPersist(
                  "proj-settings",
                  { ...settings, overtime: v },
                  setSettings,
                )
              }
              color={color}
              disabled={d}
            />

            <div className="pt-1">
              <span
                className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2"
                style={{ fontSize: "0.5rem" }}
              >
                Show Weekly rate for Daily crew in
              </span>
              <div className="space-y-1">
                <PillToggle
                  label="Offer view"
                  value={settings.showWeeklyRateOfferView}
                  onChange={(v) =>
                    updateAndPersist(
                      "proj-settings",
                      { ...settings, showWeeklyRateOfferView: v },
                      setSettings,
                    )
                  }
                  color={color}
                  disabled={d}
                />
                <PillToggle
                  label="Documents"
                  value={settings.showWeeklyRateDocuments}
                  onChange={(v) =>
                    updateAndPersist(
                      "proj-settings",
                      { ...settings, showWeeklyRateDocuments: v },
                      setSettings,
                    )
                  }
                  color={color}
                  disabled={d}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <SelectField
                  label="Default Standard Working Hours"
                  value={settings.defaultWorkingHours}
                  onChange={(v) =>
                    updateAndPersist(
                      "proj-settings",
                      { ...settings, defaultWorkingHours: v },
                      setSettings,
                    )
                  }
                  options={[
                    "12 hours (continuous)",
                    "12 hours",
                    "11 hours",
                    "10.5 hours",
                    "10 hours",
                    "9 hours",
                    "8 hours",
                    "7.5 hours",
                    "7 hours",
                    "6 hours",
                    "5 hours",
                    "4 hours",
                    "3 hours",
                    "2 hours",
                    "1 hour",
                  ]}
                  color={color}
                  disabled={d}
                  required
                />
                <p
                  className="text-gray-400 dark:text-gray-500 mt-1 px-1"
                  style={{ fontSize: "0.48rem" }}
                >
                  Excluding lunch. This is for standard crew contracts. You can
                  still specify different hours in each offer.
                </p>
              </div>
              <SegmentedControl
                label="Offer End Date"
                value={settings.offerEndDate}
                onChange={(v) =>
                  updateAndPersist(
                    "proj-settings",
                    { ...settings, offerEndDate: v },
                    setSettings,
                  )
                }
                options={["Optional", "Mandatory"]}
                color={color}
                disabled={d}
                tooltip="Dictated by whether the Company wants end dates in crew contracts."
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SelectField
                label="Payroll Company"
                value={settings.payrollCompany}
                onChange={(v) =>
                  updateAndPersist(
                    "proj-settings",
                    { ...settings, payrollCompany: v },
                    setSettings,
                  )
                }
                options={[
                  "Dataplan",
                  "Entertainment Payroll Services",
                  "Hargenant",
                  "In-house",
                  "Moneypenny",
                  "Sargent Disc",
                  "TPH",
                ]}
                color={color}
                disabled={d}
                required
              />
              <div>
                <SelectField
                  label="Crew Data CSV Export Layout"
                  value={settings.crewDataCsvLayout}
                  onChange={(v) =>
                    updateAndPersist(
                      "proj-settings",
                      { ...settings, crewDataCsvLayout: v },
                      setSettings,
                    )
                  }
                  options={["EAARTH", "Moneypenny"]}
                  color={color}
                  disabled={d}
                />
                <p
                  className="text-gray-400 dark:text-gray-500 mt-1 px-1"
                  style={{ fontSize: "0.48rem" }}
                >
                  Start form data in CSV format for sharing with the payroll
                  company.
                </p>
              </div>
              <div>
                <SelectField
                  label="Payroll CSV Export Layout"
                  value={settings.payrollCsvLayout}
                  onChange={(v) =>
                    updateAndPersist(
                      "proj-settings",
                      { ...settings, payrollCsvLayout: v },
                      setSettings,
                    )
                  }
                  options={[
                    "Dataplan",
                    "Entertainment Payroll Services",
                    "Hargenant",
                    "In-house",
                    "Moneypenny",
                    "Sargent Disc",
                    "TPH",
                  ]}
                  color={color}
                  disabled={d}
                />
                <p
                  className="text-gray-400 dark:text-gray-500 mt-1 px-1"
                  style={{ fontSize: "0.48rem" }}
                >
                  Money calculation data in a layout similar to your payroll
                  company's spreadsheet.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 3: Offer Handling ── */}
        <SectionCard
          title="Offer Handling"
          description="How you'd like offers to be reviewed prior to sending to crew."
          color={color}
          delay={0.15}
        >
          <div className="space-y-4">
            <PillToggle
              label="Share status determination with crew members?"
              value={offer.shareStatusDetermination}
              onChange={(v) =>
                updateAndPersist(
                  "offer-handling",
                  { ...offer, shareStatusDetermination: v },
                  setOffer,
                )
              }
              color={color}
              disabled={d}
            />
            <p
              className="text-gray-400 dark:text-gray-500 px-1 -mt-2"
              style={{ fontSize: "0.48rem" }}
            >
              Inform the crew member of your IR35 status determination within
              their offer. This MUST be set to yes if you require it to appear
              in documents.
            </p>

            <div>
              <SelectField
                label="Tax Status Handling"
                value={offer.taxStatusHandling}
                onChange={(v) =>
                  updateAndPersist(
                    "offer-handling",
                    { ...offer, taxStatusHandling: v },
                    setOffer,
                  )
                }
                options={[
                  "Do not allow loan outs",
                  "Accounts approval required for self-employed or loan out",
                  "Accounts approval required for loan out",
                  "Allow loan out if grade is self-employed",
                  "Allow all loan outs (not recommended after 5 Apr, 2021)",
                ]}
                color={color}
                disabled={d}
                required
              />
              <p
                className="text-gray-400 dark:text-gray-500 mt-1 px-1"
                style={{ fontSize: "0.48rem" }}
              >
                Available options are based on your 'Share status determination
                with crew members?' selection.
              </p>
            </div>

            <div>
              <InputField
                label="Tax Status Query Email"
                value={offer.taxStatusQueryEmail}
                onChange={(v) =>
                  updateAndPersist(
                    "offer-handling",
                    { ...offer, taxStatusQueryEmail: v },
                    setOffer,
                  )
                }
                type="email"
                color={color}
                disabled={d}
              />
              <p
                className="text-gray-400 dark:text-gray-500 mt-1 px-1"
                style={{ fontSize: "0.48rem" }}
              >
                The person to whom all tax status questions will be directed.
              </p>
            </div>

            <div>
              <SelectField
                label="Offer Approval"
                value={offer.offerApproval}
                onChange={(v) =>
                  updateAndPersist(
                    "offer-handling",
                    { ...offer, offerApproval: v },
                    setOffer,
                  )
                }
                options={[
                  "Accounts",
                  "Accounts > Production",
                  "Production",
                  "Production > Accounts",
                ]}
                color={color}
                disabled={d}
                required
              />
              <p
                className="text-gray-400 dark:text-gray-500 mt-1 px-1"
                style={{ fontSize: "0.48rem" }}
              >
                Order of people who will approve offers before being sent to
                crew. Available options are based on your 'Tax status handling'
                selection.
              </p>
            </div>
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

export default DetailsTab;
