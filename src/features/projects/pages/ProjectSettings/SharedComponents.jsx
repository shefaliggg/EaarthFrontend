import { useState } from "react";
import { Check, Shield, Lock, Unlock, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ALL_TAB_IDS, ALL_FLAT_ITEMS } from "@/features/projects/pages/ProjectSettings/data.js";

export function GlassSection({ title, desc, children, color, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mb-4 rounded-2xl overflow-hidden group/sec"
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover/sec:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${color}15, transparent 60%)` }}
      />
      <div className="relative bg-white/80 dark:bg-[#1a1a1e]/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-800/60 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="px-5 py-3.5 border-b border-gray-50/80 dark:border-gray-800/40 flex items-center gap-3">
          <motion.div
            className="w-1.5 h-5 rounded-full"
            style={{ background: `linear-gradient(180deg, ${color}, ${color}60)` }}
            whileHover={{ scaleY: 1.2 }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 dark:text-gray-100" style={{ fontSize: "0.8rem" }}>{title}</h3>
            {desc && (
              <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "0.56rem" }}>{desc}</p>
            )}
          </div>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </motion.section>
  );
}

export function Chip({ label, active, color, icon, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all ${
        active
          ? "shadow-sm"
          : "bg-transparent border-gray-100 dark:border-gray-800 hover:border-gray-200"
      }`}
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

export function Tog({ on, onToggle, color, disabled }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-10 h-[22px] rounded-full transition-all duration-300 shrink-0 ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
      style={{ backgroundColor: on ? color : "#e5e7eb" }}
    >
      <motion.div
        className="absolute top-[3px] w-[16px] h-[16px] rounded-full bg-white shadow-md"
        animate={{ left: on ? 21 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export function TabHeader2({ label, pct, color, locked }) {
  const radius = 18;
  const circ = 2 * Math.PI * radius;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-5 rounded-2xl overflow-hidden"
      style={{
        background: locked
          ? "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)"
          : `linear-gradient(135deg, ${color}06 0%, ${color}02 100%)`,
      }}
    >
      <div className="relative px-5 py-4 flex items-center gap-4">
        {locked && (
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ background: "linear-gradient(90deg, transparent, #22c55e20, transparent)" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        )}
        <div className="relative w-12 h-12 shrink-0">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r={radius} fill="none" strokeWidth="2.5" className="stroke-gray-100 dark:stroke-gray-800" />
            <motion.circle
              cx="22" cy="22" r={radius}
              fill="none" strokeWidth="2.5" strokeLinecap="round"
              style={{ stroke: locked ? "#22c55e" : color }}
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: circ - (circ * pct / 100) }}
              transition={{ duration: 0.8 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {locked ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Check className="w-5 h-5 text-emerald-500" />
              </motion.div>
            ) : (
              <span className="text-gray-600 dark:text-gray-300" style={{ fontSize: "0.6rem" }}>{pct}%</span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-gray-900 dark:text-gray-100" style={{ fontSize: "0.95rem" }}>{label}</h2>
          <div className="flex items-center gap-2 mt-1">
            {locked ? (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"
                style={{ fontSize: "0.56rem" }}
              >
                <Shield className="w-3 h-3 text-emerald-500" /> Locked & verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-gray-400" style={{ fontSize: "0.56rem" }}>
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
      </div>
    </motion.div>
  );
}

export function ActionFooter({ locked, onLock, color, pct }) {
  const canLock = pct >= 100;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="mt-5 mb-2 rounded-2xl overflow-hidden"
    >
      <div className="relative bg-white/80 dark:bg-[#1a1a1e]/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-800/60 px-5 py-3.5 flex items-center justify-between">
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
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 ${
            locked
              ? "text-emerald-600 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50"
              : canLock
              ? "text-white shadow-lg hover:shadow-xl"
              : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
          }`}
          style={
            !locked && canLock
              ? { background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`, fontSize: "0.7rem" }
              : { fontSize: "0.7rem" }
          }
        >
          {locked ? (
            <><Unlock className="w-3.5 h-3.5" /> Unlock Tab</>
          ) : canLock ? (
            <><Lock className="w-3.5 h-3.5" /> Lock & Continue</>
          ) : (
            <><Lock className="w-3.5 h-3.5" /> Complete to Lock</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export function ScrollableProgressRail({ activeTab, onTabChange, locks, tabProgress, color }) {
  const [hoveredTab, setHoveredTab] = useState(null);

  const total  = ALL_TAB_IDS.length;
  const curIdx = ALL_TAB_IDS.indexOf(activeTab);

  const activeItem      = ALL_FLAT_ITEMS.find(f => f.id === activeTab);
  const hoveredItem     = hoveredTab ? ALL_FLAT_ITEMS.find(f => f.id === hoveredTab) : null;
  const displayLabel    = hoveredItem?.label || activeItem?.label || "";
  const displayIdx      = hoveredTab ? ALL_TAB_IDS.indexOf(hoveredTab) : curIdx;
  const displayIsLocked = hoveredTab ? !!locks[hoveredTab] : !!locks[activeTab];
  const displayPct      = hoveredTab ? (tabProgress[hoveredTab] ?? 0) : (tabProgress[activeTab] ?? 0);

  const prevTab = curIdx > 0 ? ALL_TAB_IDS[curIdx - 1] : null;
  const nextTab = curIdx < total - 1 ? ALL_TAB_IDS[curIdx + 1] : null;

  return (
    <div className="mb-5 rounded-2xl bg-white/80 dark:bg-[#13111d]/80 backdrop-blur-xl border border-gray-100/80 dark:border-gray-800/50 shadow-sm overflow-hidden">
      <div className="px-4 pt-3 pb-1 flex items-center justify-center gap-2">
        {prevTab ? (
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(prevTab)}
            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-3 h-3 text-gray-400" />
          </motion.button>
        ) : <div className="w-5" />}

        <AnimatePresence mode="wait">
          <motion.div
            key={displayLabel}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <span
              className="flex items-center justify-center w-5 h-5 rounded-full"
              style={{
                backgroundColor: displayIsLocked ? "#22c55e" : `${color}15`,
                fontSize: "0.44rem",
                fontFamily: "var(--font-mono)",
                color: displayIsLocked ? "#fff" : color,
              }}
            >
              {displayIsLocked ? <Check style={{ width: 10, height: 10 }} /> : displayIdx + 1}
            </span>
            <span style={{ fontSize: "0.72rem", color: displayIsLocked ? "#22c55e" : color }}>
              {displayLabel}
            </span>
            {!displayIsLocked && displayPct > 0 && (
              <span
                className="px-1.5 py-0.5 rounded-md"
                style={{ fontSize: "0.44rem", fontFamily: "var(--font-mono)", backgroundColor: `${color}08`, color: `${color}90` }}
              >
                {displayPct}%
              </span>
            )}
            {displayIsLocked && (
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600" style={{ fontSize: "0.44rem" }}>
                Locked
              </span>
            )}
            <span className="text-gray-300 dark:text-gray-600" style={{ fontSize: "0.44rem", fontFamily: "var(--font-mono)" }}>
              {curIdx + 1}/{total}
            </span>
          </motion.div>
        </AnimatePresence>

        {nextTab ? (
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(nextTab)}
            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </motion.button>
        ) : <div className="w-5" />}
      </div>

      <div className="px-5 pb-3.5 pt-1">
        <div className="flex items-center w-full gap-0">
          {ALL_TAB_IDS.map((tid, i) => {
            const isActive   = tid === activeTab;
            const isHovered  = tid === hoveredTab;
            const isLocked   = !!locks[tid];
            const pct        = tabProgress[tid] ?? 0;
            const isPast     = i < curIdx;
            const prevLocked = i > 0 && !!locks[ALL_TAB_IDS[i - 1]];

            return (
              <div key={tid} className="contents">
                {i > 0 && (
                  <div
                    className="h-[2px] rounded-full"
                    style={{
                      flex: 1, minWidth: 2,
                      backgroundColor: isLocked && prevLocked ? "#22c55e" : isPast ? `${color}30` : "#e5e7eb",
                      transition: "background-color 0.3s",
                    }}
                  />
                )}
                <motion.button
                  onClick={() => onTabChange(tid)}
                  onMouseEnter={() => setHoveredTab(tid)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className="relative flex items-center justify-center rounded-full cursor-pointer"
                  style={{
                    width:  isActive ? 18 : 10,
                    height: isActive ? 18 : 10,
                    flexShrink: 0,
                    backgroundColor: isLocked ? "#22c55e" : isActive ? color : pct > 0 ? `${color}30` : "#e5e7eb",
                    boxShadow: isActive ? `0 0 0 3px ${isLocked ? "#22c55e25" : color + "20"}` : "none",
                    transition: "all 0.2s ease",
                    zIndex: isActive ? 10 : isHovered ? 5 : 1,
                  }}
                  whileHover={{ scale: 1.4 }}
                  whileTap={{ scale: 0.85 }}
                >
                  {isActive && (
                    isLocked
                      ? <Check className="text-white" style={{ width: 9, height: 9 }} />
                      : <span className="text-white" style={{ fontSize: "0.38rem", fontFamily: "var(--font-mono)" }}>{i + 1}</span>
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ConfettiCelebration({ color }) {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    size: 4 + Math.random() * 6,
    color: [color, "#22c55e", "#f59e0b", "#ec4899", "#3b82f6", "#8b5cf6"][Math.floor(Math.random() * 6)],
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, top: -10, width: p.size, height: p.size, backgroundColor: p.color, rotate: p.rotation }}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: window.innerHeight + 50, opacity: 0, rotate: p.rotation + 720, x: (Math.random() - 0.5) * 200 }}
          transition={{ duration: 2 + Math.random(), delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}