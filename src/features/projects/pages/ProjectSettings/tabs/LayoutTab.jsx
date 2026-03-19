import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CircleCheck,
  Shield,
  Sparkles,
  Lock,
  Unlock,
  ArrowRight,
  Check,
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
   CHIP  (option selector with checkmark badge)
───────────────────────────────────────────────────────── */
function Chip({ label, active, color, onClick, disabled }) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.03 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      onClick={() => !disabled && onClick()}
      className={cn(
        "relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all",
        active ? "shadow-sm" : "bg-transparent border-gray-100 dark:border-gray-800 hover:border-gray-200",
        disabled && "opacity-40 cursor-not-allowed",
      )}
      style={
        active
          ? { fontSize: "0.62rem", backgroundColor: `${color}10`, borderColor: `${color}30` }
          : { fontSize: "0.62rem" }
      }
    >
      <span className={active ? "" : "text-gray-600 dark:text-gray-400"} style={active ? { color } : undefined}>
        {label}
      </span>
      {active && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Check className="w-2 h-2 text-white" />
        </motion.div>
      )}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────
   PILL TOGGLE  (sliding switch)
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
   DEFAULT LAYOUT STATE
───────────────────────────────────────────────────────── */
const DEFAULT_LAYOUT = {
  gridCols: 4,
  cardSize: "default",
  sidebarDefault: "closed",
  showProgress: true,
  showTeamCount: true,
  showNotifBadges: true,
  widgetColumns: 2,
  appSortOrder: "default",
  showAppDescriptions: false,
};

/* ─────────────────────────────────────────────────────────
   LAYOUT TAB
───────────────────────────────────────────────────────── */
function LayoutTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  const [layout, setLayout] = useState(() =>
    loadSettings(projectId, "proj-layout", DEFAULT_LAYOUT),
  );

  const updateLayout = (patch) => {
    const next = { ...layout, ...patch };
    setLayout(next);
    saveSettings(projectId, "proj-layout", next);
  };

  /* ── Lock handler ── */
  const handleLock = () => {
    setTabLockStatusById((prev) => ({ ...prev, [tabId]: !prev[tabId] }));
  };

  /* ── Progress — always 100%, all fields have sensible defaults ── */
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
        label="Layout"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Grid ── */}
        <SectionCard
          title="Grid"
          description="Column count, card size, and sort order for the app grid."
          color={color}
          delay={0.05}
        >
          <div className="space-y-5">

            {/* Columns */}
            <div>
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>
                Columns
              </span>
              <div className="flex flex-wrap gap-2">
                {[3, 4, 5, 6].map((v) => (
                  <Chip
                    key={v}
                    label={`${v} Cols`}
                    active={layout.gridCols === v}
                    color={color}
                    disabled={d}
                    onClick={() => updateLayout({ gridCols: v })}
                  />
                ))}
              </div>
            </div>

            {/* Card Size */}
            <div>
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>
                Card Size
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "compact", l: "Compact" },
                  { v: "default", l: "Default" },
                  { v: "large",   l: "Large" },
                ].map(({ v, l }) => (
                  <Chip
                    key={v}
                    label={l}
                    active={layout.cardSize === v}
                    color={color}
                    disabled={d}
                    onClick={() => updateLayout({ cardSize: v })}
                  />
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>
                Sort Order
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "default",       l: "Default" },
                  { v: "alpha",         l: "A–Z" },
                  { v: "most-used",     l: "Most Used" },
                  { v: "notifications", l: "Notifications" },
                ].map(({ v, l }) => (
                  <Chip
                    key={v}
                    label={l}
                    active={layout.appSortOrder === v}
                    color={color}
                    disabled={d}
                    onClick={() => updateLayout({ appSortOrder: v })}
                  />
                ))}
              </div>
            </div>

          </div>
        </SectionCard>

        {/* ── Section 2: Widgets & Sidebar ── */}
        <SectionCard
          title="Widgets & Sidebar"
          description="Widget column layout and the sidebar's default open/closed state."
          color={color}
          delay={0.1}
        >
          <div className="space-y-5">

            {/* Widget Columns */}
            <div>
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>
                Widget Columns
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: 1, l: "Single Column" },
                  { v: 2, l: "Two Columns" },
                ].map(({ v, l }) => (
                  <Chip
                    key={v}
                    label={l}
                    active={layout.widgetColumns === v}
                    color={color}
                    disabled={d}
                    onClick={() => updateLayout({ widgetColumns: v })}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar Default */}
            <div>
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>
                Sidebar Default State
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "open",   l: "Open" },
                  { v: "closed", l: "Closed" },
                ].map(({ v, l }) => (
                  <Chip
                    key={v}
                    label={l}
                    active={layout.sidebarDefault === v}
                    color={color}
                    disabled={d}
                    onClick={() => updateLayout({ sidebarDefault: v })}
                  />
                ))}
              </div>
              <p className="text-gray-400 dark:text-gray-500 mt-2 px-1" style={{ fontSize: "0.48rem" }}>
                Whether the sidebar is expanded or collapsed when a user first opens the project.
              </p>
            </div>

          </div>
        </SectionCard>

        {/* ── Section 3: Display Options ── */}
        <SectionCard
          title="Display Options"
          description="Toggle visibility of UI elements on app cards and the project header."
          color={color}
          delay={0.15}
        >
          <div className="grid grid-cols-2 gap-x-8">
            <PillToggle
              label="Show progress bar"
              value={layout.showProgress}
              onChange={(v) => updateLayout({ showProgress: v })}
              color={color}
              disabled={d}
            />
            <PillToggle
              label="Show team count"
              value={layout.showTeamCount}
              onChange={(v) => updateLayout({ showTeamCount: v })}
              color={color}
              disabled={d}
            />
            <PillToggle
              label="Show notification badges"
              value={layout.showNotifBadges}
              onChange={(v) => updateLayout({ showNotifBadges: v })}
              color={color}
              disabled={d}
            />
            <PillToggle
              label="Show app descriptions"
              value={layout.showAppDescriptions}
              onChange={(v) => updateLayout({ showAppDescriptions: v })}
              color={color}
              disabled={d}
            />
          </div>
          <p className="text-gray-400 dark:text-gray-500 mt-3 px-1" style={{ fontSize: "0.48rem" }}>
            These settings apply per-project and take effect immediately on the app grid.
          </p>
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

export default LayoutTab;