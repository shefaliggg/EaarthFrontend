import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleCheck,
  Shield,
  Sparkles,
  Lock,
  Unlock,
  ArrowRight,
  Eye,
  EyeOff,
  Users,
  ShieldCheck,
  Settings2,
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
   DEFAULT APPS LIST
   Matches the app IDs used across EAARTH project settings
───────────────────────────────────────────────────────── */
const DEFAULT_APPS = [
  { id: "offers",        name: "Offers" },
  { id: "timecards",     name: "Timecards" },
  { id: "crew",          name: "Crew" },
  { id: "contracts",     name: "Contracts" },
  { id: "call-sheets",   name: "Call Sheets" },
  { id: "schedule",      name: "Schedule" },
  { id: "budget",        name: "Budget" },
  { id: "reports",       name: "Reports" },
  { id: "documents",     name: "Documents" },
  { id: "send",          name: "Send" },
  { id: "calendar",      name: "Calendar" },
  { id: "chat",          name: "Chat" },
  { id: "petty-cash",    name: "Petty Cash" },
  { id: "purchase-orders", name: "Purchase Orders" },
  { id: "locations",     name: "Locations" },
  { id: "vfx",          name: "VFX" },
];

const DEFAULT_APP_SETTINGS = (appId) => ({
  enabled: true,
  notifications: true,
  visibility: "everyone",
});

/* ─────────────────────────────────────────────────────────
   VISIBILITY BADGE
───────────────────────────────────────────────────────── */
function VisibilitySelect({ value, onChange, color, disabled }) {
  const [open, setOpen] = useState(false);

  const opts = [
    { value: "everyone",  label: "All",    icon: Users },
    { value: "admins",    label: "Admin",  icon: ShieldCheck },
    { value: "custom",    label: "Custom", icon: Settings2 },
  ];

  const current = opts.find((o) => o.value === value) || opts[0];
  const Icon = current.icon;

  return (
    <div className="relative">
      <button
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all",
          disabled && "opacity-40 cursor-not-allowed",
        )}
        style={{
          fontSize: "0.56rem",
          borderColor: `${color}30`,
          backgroundColor: `${color}08`,
          color,
        }}
      >
        <Icon className="w-3 h-3" />
        {current.label}
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute z-30 top-full mt-1 left-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden"
            style={{ minWidth: 110 }}
          >
            {opts.map((opt) => {
              const OIcon = opt.icon;
              const isSel = opt.value === value;
              return (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  style={{
                    fontSize: "0.54rem",
                    color: isSel ? color : "#6b7280",
                    backgroundColor: isSel ? `${color}08` : undefined,
                  }}
                >
                  <OIcon className="w-3 h-3" />
                  {opt.label}
                  {isSel && (
                    <svg className="w-2.5 h-2.5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   APP SETTINGS TAB
───────────────────────────────────────────────────────── */
function AppSettingsTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  /* ── App settings state — one object keyed by appId ── */
  const [appSettings, setAppSettings] = useState(() =>
    loadSettings(projectId, "app-settings", Object.fromEntries(
      DEFAULT_APPS.map((app) => [app.id, DEFAULT_APP_SETTINGS(app.id)])
    ))
  );

  const updateApp = (appId, patch) => {
    const next = {
      ...appSettings,
      [appId]: { ...appSettings[appId], ...patch },
    };
    setAppSettings(next);
    saveSettings(projectId, "app-settings", next);
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

  /* ── Derived stats ── */
  const enabledCount = DEFAULT_APPS.filter(
    (a) => appSettings[a.id]?.enabled !== false
  ).length;

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
        label="App Settings"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: App Visibility & Notifications ── */}
        <SectionCard
          title="App Visibility & Notifications"
          description="Control which apps are enabled, who can see them, and whether they send notifications."
          color={color}
          delay={0.05}
        >
          {/* Summary badge */}
          <div className="flex justify-end -mt-1 mb-4">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              <div className="flex flex-col items-center">
                <span style={{ fontSize: "0.9rem", color, fontFamily: "monospace" }}>{enabledCount}</span>
                <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.44rem" }}>Enabled</span>
              </div>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
              <div className="flex flex-col items-center">
                <span style={{ fontSize: "0.9rem", color: "#9ca3af", fontFamily: "monospace" }}>{DEFAULT_APPS.length - enabledCount}</span>
                <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.44rem" }}>Disabled</span>
              </div>
            </div>
          </div>

          {/* Column header */}
          <div className="grid grid-cols-[1fr_80px_80px_120px] gap-0 items-center border-b border-gray-100 dark:border-gray-800/60 pb-2.5 mb-1">
            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider" style={{ fontSize: "0.44rem" }}>App</span>
            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-center" style={{ fontSize: "0.44rem" }}>Enabled</span>
            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-center" style={{ fontSize: "0.44rem" }}>Notifications</span>
            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider text-center" style={{ fontSize: "0.44rem" }}>Access</span>
          </div>

          {/* App rows */}
          <div className="space-y-0">
            {DEFAULT_APPS.map((app, i) => {
              const s = appSettings[app.id] || DEFAULT_APP_SETTINGS(app.id);
              const isDisabled = s.enabled === false;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.025 }}
                  className={cn(
                    "grid grid-cols-[1fr_80px_80px_120px] gap-0 items-center py-2.5 border-b border-gray-50 dark:border-gray-800/40 last:border-b-0",
                    "-mx-1 px-1 rounded-lg transition-colors",
                    !d && "hover:bg-gray-50/50 dark:hover:bg-gray-800/20",
                    isDisabled && "opacity-50",
                  )}
                >
                  {/* App name */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: isDisabled ? "#e5e7eb" : `${color}12`,
                      }}
                    >
                      {isDisabled
                        ? <EyeOff className="w-2.5 h-2.5 text-gray-400" />
                        : <Eye className="w-2.5 h-2.5" style={{ color }} />
                      }
                    </div>
                    <span
                      className={cn(
                        "text-gray-800 dark:text-gray-200 uppercase tracking-wide",
                        isDisabled && "line-through text-gray-400 dark:text-gray-600",
                      )}
                      style={{ fontSize: "0.56rem" }}
                    >
                      {app.name}
                    </span>
                  </div>

                  {/* Enabled toggle */}
                  <div className="flex justify-center">
                    <button
                      disabled={d}
                      onClick={() => updateApp(app.id, { enabled: !s.enabled })}
                      className={cn(
                        "relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
                        d && "opacity-40 cursor-not-allowed",
                      )}
                      style={{ backgroundColor: s.enabled ? color : "#d1d5db" }}
                    >
                      <motion.span
                        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                        animate={{ x: s.enabled ? 16 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  {/* Notifications toggle */}
                  <div className="flex justify-center">
                    <button
                      disabled={d || !s.enabled}
                      onClick={() => updateApp(app.id, { notifications: !s.notifications })}
                      className={cn(
                        "relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
                        (d || !s.enabled) && "opacity-40 cursor-not-allowed",
                      )}
                      style={{ backgroundColor: s.notifications && s.enabled ? color : "#d1d5db" }}
                    >
                      <motion.span
                        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                        animate={{ x: s.notifications && s.enabled ? 16 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  {/* Visibility select */}
                  <div className="flex justify-center">
                    <VisibilitySelect
                      value={s.visibility}
                      onChange={(v) => updateApp(app.id, { visibility: v })}
                      color={color}
                      disabled={d || !s.enabled}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-gray-400 dark:text-gray-500 mt-3 px-1" style={{ fontSize: "0.48rem" }}>
            Disabled apps are hidden from all crew and production users. Notification settings only apply when the app is enabled. Access controls whether all users, admins only, or a custom group can see the app.
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

export default AppSettingsTab;