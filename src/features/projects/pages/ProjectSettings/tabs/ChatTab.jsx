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
   DEFAULT CHAT SETTINGS
───────────────────────────────────────────────────────── */
const DEFAULT_CHAT = {
  enableChat: true,
  enableDirectMessages: true,
  enableChannels: true,
  enableThreads: true,
  enableFileSharing: true,
  maxFileSize: "25",
  enableReactions: true,
  enableReadReceipts: true,
  retentionDays: "365",
  enableNotifications: true,
  notifyMentionsOnly: false,
  muteAfterHours: false,
  muteStart: "22:00",
  muteEnd: "07:00",
  defaultChannels: "General, Announcements, Production, Departments",
  enableBots: false,
  enableGiphy: true,
  moderationEnabled: false,
  profanityFilter: false,
  archiveInactive: true,
  archiveDays: "90",
};

/* ─────────────────────────────────────────────────────────
   CHAT TAB
───────────────────────────────────────────────────────── */
function ChatTab({
  color,
  projectId,
  locked,
  tabId,
  setTabLockStatusById,
  setTabProgressById,
}) {
  const d = locked;

  const [cfg, setCfg] = useState(() =>
    loadSettings(projectId, "chat-settings", DEFAULT_CHAT)
  );

  const up = (patch) => {
    const next = { ...cfg, ...patch };
    setCfg(next);
    saveSettings(projectId, "chat-settings", next);
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
        label="Chat"
        progressPercentage={progressPercentage}
        color={color}
        locked={locked}
      />

      <div className={cn(locked && "opacity-50 pointer-events-none select-none")}>

        {/* ── Section 1: General ── */}
        <SectionCard
          title="General"
          description="Core chat functionality settings."
          color={color}
          delay={0.05}
        >
          <div className="grid grid-cols-2 gap-x-6">
            <PillToggle label="Enable Chat" value={cfg.enableChat} onChange={(v) => up({ enableChat: v })} color={color} disabled={d} />
            <PillToggle label="Enable Direct Messages" value={cfg.enableDirectMessages} onChange={(v) => up({ enableDirectMessages: v })} color={color} disabled={d} />
            <PillToggle label="Enable Channels" value={cfg.enableChannels} onChange={(v) => up({ enableChannels: v })} color={color} disabled={d} />
            <PillToggle label="Enable Threads" value={cfg.enableThreads} onChange={(v) => up({ enableThreads: v })} color={color} disabled={d} />
            <PillToggle label="Enable File Sharing" value={cfg.enableFileSharing} onChange={(v) => up({ enableFileSharing: v })} color={color} disabled={d} />
            <PillToggle label="Enable Reactions" value={cfg.enableReactions} onChange={(v) => up({ enableReactions: v })} color={color} disabled={d} />
            <PillToggle label="Enable Read Receipts" value={cfg.enableReadReceipts} onChange={(v) => up({ enableReadReceipts: v })} color={color} disabled={d} />
          </div>

          {cfg.enableFileSharing && (
            <div className="mt-3 max-w-xs">
              <InputField
                label="Max file size (MB)"
                value={cfg.maxFileSize}
                onChange={(v) => up({ maxFileSize: v })}
                type="number"
                color={color}
                disabled={d}
              />
            </div>
          )}
        </SectionCard>

        {/* ── Section 2: Channels ── */}
        <SectionCard
          title="Channels"
          description="Default channel configuration for new projects."
          color={color}
          delay={0.1}
        >
          <InputField
            label="Default Channels"
            value={cfg.defaultChannels}
            onChange={(v) => up({ defaultChannels: v })}
            color={color}
            disabled={d}
          />
          <p className="text-gray-400 dark:text-gray-500 mt-1.5 px-1" style={{ fontSize: "0.46rem" }}>
            Comma-separated channel names. These are automatically created when the project starts.
          </p>
        </SectionCard>

        {/* ── Section 3: Notifications ── */}
        <SectionCard
          title="Notifications"
          description="Chat notification preferences for this project."
          color={color}
          delay={0.15}
        >
          <div className="grid grid-cols-2 gap-x-6">
            <PillToggle label="Enable Notifications" value={cfg.enableNotifications} onChange={(v) => up({ enableNotifications: v })} color={color} disabled={d} />
            <PillToggle label="Mentions only" value={cfg.notifyMentionsOnly} onChange={(v) => up({ notifyMentionsOnly: v })} color={color} disabled={d} />
            <PillToggle label="Mute after hours" value={cfg.muteAfterHours} onChange={(v) => up({ muteAfterHours: v })} color={color} disabled={d} />
          </div>

          {cfg.muteAfterHours && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3 mt-3">
                <InputField
                  label="Mute start time"
                  value={cfg.muteStart}
                  onChange={(v) => up({ muteStart: v })}
                  type="time"
                  color={color}
                  disabled={d}
                />
                <InputField
                  label="Mute end time"
                  value={cfg.muteEnd}
                  onChange={(v) => up({ muteEnd: v })}
                  type="time"
                  color={color}
                  disabled={d}
                />
              </div>
            </motion.div>
          )}
        </SectionCard>

        {/* ── Section 4: Moderation & Retention ── */}
        <SectionCard
          title="Moderation & Retention"
          description="Content moderation controls and message retention policies."
          color={color}
          delay={0.2}
        >
          <div className="grid grid-cols-2 gap-x-6">
            <PillToggle label="Enable Moderation" value={cfg.moderationEnabled} onChange={(v) => up({ moderationEnabled: v })} color={color} disabled={d} />
            <PillToggle label="Profanity Filter" value={cfg.profanityFilter} onChange={(v) => up({ profanityFilter: v })} color={color} disabled={d} />
            <PillToggle label="Enable Giphy" value={cfg.enableGiphy} onChange={(v) => up({ enableGiphy: v })} color={color} disabled={d} />
            <PillToggle label="Enable Bots" value={cfg.enableBots} onChange={(v) => up({ enableBots: v })} color={color} disabled={d} />
            <PillToggle label="Archive inactive channels" value={cfg.archiveInactive} onChange={(v) => up({ archiveInactive: v })} color={color} disabled={d} />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <InputField
              label="Message retention (days)"
              value={cfg.retentionDays}
              onChange={(v) => up({ retentionDays: v })}
              type="number"
              color={color}
              disabled={d}
            />
            {cfg.archiveInactive && (
              <InputField
                label="Archive after (days inactive)"
                value={cfg.archiveDays}
                onChange={(v) => up({ archiveDays: v })}
                type="number"
                color={color}
                disabled={d}
              />
            )}
          </div>

          <p className="text-gray-400 dark:text-gray-500 mt-2 px-1" style={{ fontSize: "0.46rem" }}>
            Message retention applies to all channels in this project. Archived channels are hidden but not deleted.
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

export default ChatTab;