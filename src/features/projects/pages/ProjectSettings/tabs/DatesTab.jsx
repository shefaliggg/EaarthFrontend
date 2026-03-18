import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleCheck,
  Shield,
  Sparkles,
  Plus,
  Trash2,
  Lock,
  Unlock,
  ArrowRight,
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
              style={{ stroke: locked ? "#22c55e" : color }}
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
   DATES TAB
───────────────────────────────────────────────────────── */
function DatesTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  /* ── Overall Dates ── */
  const [dates, setDates] = useState(() =>
    loadSettings(projectId, "dates-overall", {
      prepStart: "",
      prepEnd: "",
      shootStart: "",
      shootEnd: "",
      shootDurationDays: "",
    }),
  );

  /* ── Hiatuses ── */
  const [hiatuses, setHiatuses] = useState(() =>
    loadSettings(projectId, "dates-hiatus", []),
  );

  /* ── Post Production ── */
  const [post, setPost] = useState(() =>
    loadSettings(projectId, "dates-post", {
      postStart: "",
      postEnd: "",
    }),
  );

  const updateAndPersist = (storageKey, newValue, setState) => {
    setState(newValue);
    saveSettings(projectId, storageKey, newValue);
  };

  /* ── Hiatus helpers ── */
  const addHiatus = () => {
    const next = [
      ...hiatuses,
      {
        id: Date.now().toString(),
        start: "",
        end: "",
        label: `Hiatus ${hiatuses.length + 1}`,
      },
    ];
    setHiatuses(next);
    saveSettings(projectId, "dates-hiatus", next);
  };

  const updateHiatus = (id, field, val) => {
    const next = hiatuses.map((h) =>
      h.id === id ? { ...h, [field]: val } : h,
    );
    setHiatuses(next);
    saveSettings(projectId, "dates-hiatus", next);
  };

  const removeHiatus = (id) => {
    const next = hiatuses.filter((h) => h.id !== id);
    setHiatuses(next);
    saveSettings(projectId, "dates-hiatus", next);
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
    dates.prepStart,
    dates.prepEnd,
    dates.shootStart,
    dates.shootEnd,
    dates.shootDurationDays,
    post.postStart,
    post.postEnd,
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
        label="Dates"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Overall Dates ── */}
        <SectionCard
          title="Overall Dates"
          description="Key production milestone dates for planning and crew information."
          color={color}
          delay={0.05}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Prep Start"
                value={dates.prepStart}
                onChange={(v) =>
                  updateAndPersist("dates-overall", { ...dates, prepStart: v }, setDates)
                }
                type="date"
                color={color}
                disabled={d}
                required
              />
              <InputField
                label="Prep End"
                value={dates.prepEnd}
                onChange={(v) =>
                  updateAndPersist("dates-overall", { ...dates, prepEnd: v }, setDates)
                }
                type="date"
                color={color}
                disabled={d}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Shoot Start"
                value={dates.shootStart}
                onChange={(v) =>
                  updateAndPersist("dates-overall", { ...dates, shootStart: v }, setDates)
                }
                type="date"
                color={color}
                disabled={d}
                required
              />
              <InputField
                label="Shoot End"
                value={dates.shootEnd}
                onChange={(v) =>
                  updateAndPersist("dates-overall", { ...dates, shootEnd: v }, setDates)
                }
                type="date"
                color={color}
                disabled={d}
                required
              />
            </div>

            <div>
              <InputField
                label="Shoot Duration Days"
                value={dates.shootDurationDays}
                onChange={(v) =>
                  updateAndPersist(
                    "dates-overall",
                    { ...dates, shootDurationDays: v },
                    setDates,
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
                This is just guide information for crew and can be updated for
                everyone at any time.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 2: Hiatus ── */}
        <SectionCard
          title="Hiatus"
          description="Add any planned production breaks or hiatus periods."
          color={color}
          delay={0.1}
        >
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {hiatuses.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-gray-500 dark:text-gray-400 uppercase"
                      style={{ fontSize: "0.56rem" }}
                    >
                      Hiatus {i + 1}
                    </span>
                    {!d && (
                      <button
                        onClick={() => removeHiatus(h.id)}
                        className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <InputField
                      label="Label"
                      value={h.label}
                      onChange={(v) => updateHiatus(h.id, "label", v)}
                      color={color}
                      disabled={d}
                    />
                    <InputField
                      label="Start Date"
                      value={h.start}
                      onChange={(v) => updateHiatus(h.id, "start", v)}
                      type="date"
                      color={color}
                      disabled={d}
                    />
                    <InputField
                      label="End Date"
                      value={h.end}
                      onChange={(v) => updateHiatus(h.id, "end", v)}
                      type="date"
                      color={color}
                      disabled={d}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {hiatuses.length === 0 && (
              <div className="text-center py-4">
                <span
                  className="text-gray-400 dark:text-gray-500"
                  style={{ fontSize: "0.58rem" }}
                >
                  No hiatus periods added yet.
                </span>
              </div>
            )}

            {!d && (
              <motion.button
                onClick={addHiatus}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                style={{ fontSize: "0.62rem" }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="uppercase">Add Hiatus</span>
              </motion.button>
            )}
          </div>
        </SectionCard>

        {/* ── Section 3: Post Production ── */}
        <SectionCard
          title="Post Production"
          description="Post-production phase start and end dates."
          color={color}
          delay={0.15}
        >
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Post Production Start"
              value={post.postStart}
              onChange={(v) =>
                updateAndPersist("dates-post", { ...post, postStart: v }, setPost)
              }
              type="date"
              color={color}
              disabled={d}
              required
            />
            <InputField
              label="Post Production End"
              value={post.postEnd}
              onChange={(v) =>
                updateAndPersist("dates-post", { ...post, postEnd: v }, setPost)
              }
              type="date"
              color={color}
              disabled={d}
              required
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

export default DatesTab;