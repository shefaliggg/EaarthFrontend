import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleCheck,
  Shield,
  Sparkles,
  Lock,
  Unlock,
  ArrowRight,
  Check,
  Sun,
  Moon,
  Monitor,
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
   CHIP  (reusable option selector)
───────────────────────────────────────────────────────── */
function Chip({ label, active, color, icon, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all",
        active ? "shadow-sm" : "bg-transparent border-gray-100 dark:border-gray-800 hover:border-gray-200",
      )}
      style={
        active
          ? { fontSize: "0.62rem", backgroundColor: `${color}10`, borderColor: `${color}30` }
          : { fontSize: "0.62rem" }
      }
    >
      {icon}
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
   STATIC DATA
───────────────────────────────────────────────────────── */
const COLOR_PRESETS = [
  { label: "Purple",  value: "#7c3aed" },
  { label: "Blue",    value: "#2563eb" },
  { label: "Teal",    value: "#0d9488" },
  { label: "Amber",   value: "#d97706" },
  { label: "Rose",    value: "#e11d48" },
  { label: "Emerald", value: "#059669" },
  { label: "Indigo",  value: "#4f46e5" },
  { label: "Pink",    value: "#db2777" },
  { label: "Cyan",    value: "#0891b2" },
  { label: "Orange",  value: "#ea580c" },
  { label: "Slate",   value: "#475569" },
  { label: "Violet",  value: "#8b5cf6" },
];

const DEFAULT_STYLE = {
  accentColor: "",
  cardStyle: "elevated",
  borderRadius: "lg",
  iconStyle: "filled",
  appNameCase: "upper",
  themeMode: "system",
  saturation: "normal",
  headerStyle: "standard",
};

/* ─────────────────────────────────────────────────────────
   STYLE TAB
───────────────────────────────────────────────────────── */
function StyleTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  const [style, setStyle] = useState(() =>
    loadSettings(projectId, "proj-style", { ...DEFAULT_STYLE, accentColor: color }),
  );

  const updateStyle = (patch) => {
    const next = { ...style, ...patch };
    setStyle(next);
    saveSettings(projectId, "proj-style", next);
  };

  // Preview color — falls back to the project's accent if nothing saved yet
  const previewColor = style.accentColor || color;

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
        label="Design & Style"
        progressPercentage={progressPercentage}
        color={previewColor}
        locked={locked}
      />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: Accent Colour ── */}
        <SectionCard
          title="Accent Colour"
          description="Primary brand colour used throughout the project UI."
          color={previewColor}
          delay={0.05}
        >
          <div className="flex flex-wrap gap-2.5 items-center">
            {COLOR_PRESETS.map((c) => (
              <motion.button
                key={c.value}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => !d && updateStyle({ accentColor: c.value })}
                disabled={d}
                className={cn(
                  "relative w-8 h-8 rounded-xl transition-all",
                  style.accentColor === c.value ? "ring-2 ring-offset-2 shadow-lg" : "hover:shadow-md",
                  d && "cursor-not-allowed opacity-50",
                )}
                style={{ backgroundColor: c.value }}
                title={c.label}
              >
                {style.accentColor === c.value && (
                  <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                )}
              </motion.button>
            ))}
            {/* Custom colour picker */}
            <input
              type="color"
              value={style.accentColor || color}
              onChange={(e) => !d && updateStyle({ accentColor: e.target.value })}
              disabled={d}
              className={cn(
                "w-8 h-8 rounded-xl cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-700",
                d && "cursor-not-allowed opacity-50",
              )}
              title="Custom colour"
            />
          </div>
          <p className="text-gray-400 dark:text-gray-500 mt-2 px-1" style={{ fontSize: "0.48rem" }}>
            This colour will override the default project colour in the UI. Use the colour picker for a fully custom value.
          </p>
        </SectionCard>

        {/* ── Section 2: Appearance ── */}
        <SectionCard
          title="Appearance"
          description="Card style, corner radius, and icon treatment."
          color={previewColor}
          delay={0.1}
        >
          <div className="space-y-5">

            {/* Card Style */}
            <div>
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>
                Card Style
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "elevated", l: "Elevated" },
                  { v: "flat",     l: "Flat" },
                  { v: "outlined", l: "Outlined" },
                  { v: "glass",    l: "Glass" },
                ].map(({ v, l }) => (
                  <Chip
                    key={v}
                    label={l}
                    active={style.cardStyle === v}
                    color={previewColor}
                    onClick={() => !d && updateStyle({ cardStyle: v })}
                  />
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>
                Border Radius
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "none", l: "Sharp" },
                  { v: "sm",   l: "Subtle" },
                  { v: "md",   l: "Medium" },
                  { v: "lg",   l: "Rounded" },
                  { v: "xl",   l: "Pill" },
                ].map(({ v, l }) => (
                  <Chip
                    key={v}
                    label={l}
                    active={style.borderRadius === v}
                    color={previewColor}
                    onClick={() => !d && updateStyle({ borderRadius: v })}
                  />
                ))}
              </div>
            </div>

            {/* Icon Style */}
            <div>
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>
                Icon Style
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "filled",   l: "Filled" },
                  { v: "outlined", l: "Outlined" },
                  { v: "duo-tone", l: "Duo-tone" },
                ].map(({ v, l }) => (
                  <Chip
                    key={v}
                    label={l}
                    active={style.iconStyle === v}
                    color={previewColor}
                    onClick={() => !d && updateStyle({ iconStyle: v })}
                  />
                ))}
              </div>
            </div>

            {/* App Name Case */}
            <div>
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>
                App Name Display
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "upper", l: "UPPER" },
                  { v: "title", l: "Title" },
                  { v: "lower", l: "lower" },
                ].map(({ v, l }) => (
                  <Chip
                    key={v}
                    label={l}
                    active={style.appNameCase === v}
                    color={previewColor}
                    onClick={() => !d && updateStyle({ appNameCase: v })}
                  />
                ))}
              </div>
            </div>

          </div>
        </SectionCard>

        {/* ── Section 3: Theme ── */}
        <SectionCard
          title="Theme"
          description="Mode, colour intensity, and header layout."
          color={previewColor}
          delay={0.15}
        >
          <div className="space-y-5">

            {/* Theme Mode */}
            <div>
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>
                Theme Mode
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "system", l: "System", icon: <Monitor className="w-3 h-3" /> },
                  { v: "light",  l: "Light",  icon: <Sun className="w-3 h-3" /> },
                  { v: "dark",   l: "Dark",   icon: <Moon className="w-3 h-3" /> },
                ].map(({ v, l, icon }) => (
                  <Chip
                    key={v}
                    label={l}
                    active={style.themeMode === v}
                    color={previewColor}
                    icon={icon}
                    onClick={() => !d && updateStyle({ themeMode: v })}
                  />
                ))}
              </div>
            </div>

            {/* Saturation */}
            <div>
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>
                Colour Intensity
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "muted",  l: "Muted" },
                  { v: "normal", l: "Normal" },
                  { v: "vivid",  l: "Vivid" },
                ].map(({ v, l }) => (
                  <Chip
                    key={v}
                    label={l}
                    active={style.saturation === v}
                    color={previewColor}
                    onClick={() => !d && updateStyle({ saturation: v })}
                  />
                ))}
              </div>
            </div>

            {/* Header Style */}
            <div>
              <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2" style={{ fontSize: "0.5rem" }}>
                Header Style
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "standard", l: "Standard" },
                  { v: "compact",  l: "Compact" },
                  { v: "hero",     l: "Hero" },
                ].map(({ v, l }) => (
                  <Chip
                    key={v}
                    label={l}
                    active={style.headerStyle === v}
                    color={previewColor}
                    onClick={() => !d && updateStyle({ headerStyle: v })}
                  />
                ))}
              </div>
            </div>

          </div>
        </SectionCard>

      </div>

      {/* ── Action Footer ── */}
      <ActionFooter
        locked={locked}
        onLock={handleLock}
        color={previewColor}
        progressPercentage={progressPercentage}
      />
    </motion.div>
  );
}

export default StyleTab;