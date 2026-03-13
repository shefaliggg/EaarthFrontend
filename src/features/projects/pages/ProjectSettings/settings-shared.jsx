import { useState, useEffect } from "react";
import {
  Lock, Unlock, Shield, Sparkles, ArrowRight, CircleCheck, HelpCircle, ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── localStorage ── */
export function loadS(pid, key, fb, sid) {
  try {
    const k = sid ? `eaarth-settings-${sid}-${key}-${pid}` : `eaarth-settings-${key}-${pid}`;
    return JSON.parse(localStorage.getItem(k)) ?? fb;
  } catch { return fb; }
}

export function saveS(pid, key, v, sid) {
  try {
    const k = sid ? `eaarth-settings-${sid}-${key}-${pid}` : `eaarth-settings-${key}-${pid}`;
    localStorage.setItem(k, JSON.stringify(v));
  } catch { /* */ }
}

/* ══════════════════════════════════════════════
   MODERN UI PRIMITIVES
   ══════════════════════════════════════════════ */

export function GlassSection({ title, desc, children, color, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mb-4 rounded-2xl overflow-hidden group/sec"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/sec:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${color}15, transparent 60%)` }} />
      <div className="relative bg-white/80 dark:bg-[#1a1a1e]/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-gray-800/60 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="px-5 py-3.5 border-b border-gray-50/80 dark:border-gray-800/40 flex items-center gap-3">
          <motion.div className="w-1.5 h-5 rounded-full"
            style={{ background: `linear-gradient(180deg, ${color}, ${color}60)` }}
            whileHover={{ scaleY: 1.2 }} />
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 dark:text-gray-100" style={{ fontSize: "0.8rem" }}>{title}</h3>
            {desc && <p className="text-gray-400 dark:text-gray-500 mt-0.5" style={{ fontSize: "0.56rem" }}>{desc}</p>}
          </div>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </motion.section>
  );
}

export function ModInput({ label, value, onChange, placeholder, type, color, disabled, required }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isText = !type || type === "text" || type === "tel" || type === "email";
  return (
    <div className="relative group/inp">
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 -z-10"
        style={{ background: `linear-gradient(135deg, ${color}08, ${color}03)` }}
        animate={{ opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <div className="relative">
        <input
          type={type || "text"} value={value}
          onChange={e => onChange(isText ? e.target.value.toUpperCase() : e.target.value)}
          placeholder={focused ? (placeholder || label.replace(/\s*\*\s*$/, "")) : " "}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full px-3.5 pt-5 pb-2 rounded-xl border bg-gray-50/50 dark:bg-gray-800/30 text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 outline-none transition-all duration-200 ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"} ${focused ? "border-transparent shadow-sm" : "border-gray-100 dark:border-gray-800"}`}
          style={{
            fontSize: "0.72rem",
            ...(isText ? { textTransform: "uppercase" } : {}),
            ...(focused ? { boxShadow: `0 0 0 2px ${color}25, 0 2px 8px ${color}08` } : {}),
          }}
        />
        <motion.label
          className="absolute left-3.5 pointer-events-none origin-left flex items-center gap-1"
          animate={{
            top: focused || hasValue ? 6 : 14,
            scale: focused || hasValue ? 0.78 : 1,
            color: focused ? color : "#9ca3af",
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ fontSize: "0.62rem" }}
        >
          {label}{required && <span style={{ color }}> *</span>}
        </motion.label>
      </div>
    </div>
  );
}

export function ModSelect({ label, value, onChange, options, color, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative group/inp">
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 -z-10"
        style={{ background: `linear-gradient(135deg, ${color}08, ${color}03)` }}
        animate={{ opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className={`w-full px-3.5 pt-5 pb-2 rounded-xl border bg-gray-50/50 dark:bg-gray-800/30 text-gray-800 dark:text-gray-200 outline-none transition-all duration-200 uppercase appearance-none cursor-pointer ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"} ${focused ? "border-transparent shadow-sm" : "border-gray-100 dark:border-gray-800"}`}
          style={{ fontSize: "0.7rem", ...(focused ? { boxShadow: `0 0 0 2px ${color}25, 0 2px 8px ${color}08` } : {}) }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <label
          className="absolute left-3.5 pointer-events-none origin-left flex items-center gap-1"
          style={{ top: 6, fontSize: "0.48rem", color: focused ? color : "#9ca3af", transition: "color 0.15s ease-out" }}
        >
          {label}
        </label>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

export function ModToggle({ on, onToggle, color, disabled, label }) {
  return (
    <div className="flex items-center justify-between py-1.5 group/tog">
      {label && (
        <span className={`mr-3 uppercase transition-colors ${on ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}`}
          style={{ fontSize: "0.64rem" }}>
          {label}
        </span>
      )}
      <button onClick={onToggle} disabled={disabled}
        className={`relative w-10 h-[22px] rounded-full transition-all duration-300 shrink-0 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
        style={{ backgroundColor: on ? color : "#e5e7eb" }}
      >
        <motion.div
          className="absolute top-[3px] w-[16px] h-[16px] rounded-full bg-white shadow-md"
          animate={{ left: on ? 21 : 3 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        {on && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {on && (
          <motion.div
            className="absolute top-[3px] w-[16px] h-[16px] rounded-full bg-white shadow-md"
            animate={{ left: 21 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </button>
    </div>
  );
}

export function PillToggle({ label, value, onChange, color, disabled }) {
  return (
    <div className="flex items-center justify-between py-2 group/pill">
      <span className={`mr-3 uppercase transition-colors ${value ? "text-gray-800 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"}`}
        style={{ fontSize: "0.64rem" }}>{label}</span>
      <div className="flex rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shrink-0">
        <button disabled={disabled} onClick={() => onChange(true)}
          className={`px-3 py-1 transition-all duration-200 ${disabled ? "opacity-40" : ""}`}
          style={value ? { backgroundColor: `${color}12`, color, fontSize: "0.56rem" } : { fontSize: "0.56rem", color: "#9ca3af" }}>
          YES
        </button>
        <button disabled={disabled} onClick={() => onChange(false)}
          className={`px-3 py-1 transition-all duration-200 ${disabled ? "opacity-40" : ""}`}
          style={!value ? { backgroundColor: "#f3f4f6", color: "#374151", fontSize: "0.56rem" } : { fontSize: "0.56rem", color: "#d1d5db" }}>
          NO
        </button>
      </div>
    </div>
  );
}

export function TooltipIcon({ text, color }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex">
      <button type="button" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        onClick={() => setShow(p => !p)} className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors">
        <HelpCircle className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }}
            className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-2.5"
            style={{ fontSize: "0.5rem" }}>
            <span className="text-gray-600 dark:text-gray-300 leading-relaxed">{text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

export function ModTextarea({ label, value, onChange, maxLength, color, disabled, required, helpText }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  return (
    <div className="relative group/inp">
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 -z-10"
        style={{ background: `linear-gradient(135deg, ${color}08, ${color}03)` }}
        animate={{ opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <div className="relative">
        <textarea
          value={value}
          onChange={e => { const v = e.target.value; if (maxLength && v.length > maxLength) return; onChange(v); }}
          placeholder={focused ? label : " "}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          className={`w-full px-3.5 pt-5 pb-2 rounded-xl border bg-gray-50/50 dark:bg-gray-800/30 text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 outline-none transition-all duration-200 resize-none ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"} ${focused ? "border-transparent shadow-sm" : "border-gray-100 dark:border-gray-800"}`}
          style={{
            fontSize: "0.72rem",
            ...(focused ? { boxShadow: `0 0 0 2px ${color}25, 0 2px 8px ${color}08` } : {}),
          }}
        />
        <motion.label
          className="absolute left-3.5 pointer-events-none origin-left flex items-center gap-1"
          animate={{
            top: focused || hasValue ? 6 : 14,
            scale: focused || hasValue ? 0.78 : 1,
            color: focused ? color : "#9ca3af",
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ fontSize: "0.62rem" }}
        >
          {label}{required && <span style={{ color }}> *</span>}
        </motion.label>
        <div className="flex items-center justify-between mt-1 px-1">
          {helpText && <span className="text-gray-400 dark:text-gray-500" style={{ fontSize: "0.48rem" }}>{helpText}</span>}
          {maxLength != null && <span className="text-gray-400 dark:text-gray-500 ml-auto" style={{ fontSize: "0.48rem" }}>{value.length} / {maxLength}</span>}
        </div>
      </div>
    </div>
  );
}

export function ModRadio({ label, value, onChange, options, color, disabled, tooltip }) {
  return (
    <div className="py-1.5">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider"
          style={{ fontSize: "0.54rem", letterSpacing: "0.04em" }}>{label}</span>
        {tooltip && (
          <span className="relative group/tip cursor-help">
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-400"
              style={{ fontSize: "0.42rem" }}>?</span>
            <span className="absolute left-0 bottom-full mb-1.5 w-56 p-2.5 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl"
              style={{ fontSize: "0.52rem" }}>{tooltip}</span>
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o} disabled={disabled} onClick={() => onChange(o)}
            className={`px-3.5 py-2 rounded-xl border transition-all duration-200 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${value === o ? "shadow-sm" : "hover:border-gray-200 dark:hover:border-gray-700"}`}
            style={value === o
              ? { backgroundColor: `${color}10`, borderColor: `${color}30`, color, fontSize: "0.62rem" }
              : { borderColor: "#e5e7eb", color: "#6b7280", fontSize: "0.62rem" }}>
            <span className="uppercase">{o}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TabHeader({ label, pct, color, locked }) {
  const radius = 18;
  const circ = 2 * Math.PI * radius;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-5 rounded-2xl overflow-hidden"
      style={{ background: locked ? "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)" : `linear-gradient(135deg, ${color}06 0%, ${color}02 100%)` }}
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
            <motion.circle cx="22" cy="22" r={radius} fill="none" strokeWidth="2.5" strokeLinecap="round"
              style={{ stroke: locked ? "#22c55e" : color }}
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: circ - (circ * pct / 100) }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {locked ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <CircleCheck className="w-5 h-5 text-emerald-500" />
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
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30"
                style={{ fontSize: "0.56rem" }}
              >
                <Shield className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600">Locked & verified</span>
              </motion.span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-gray-400" style={{ fontSize: "0.56rem" }}>
                <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                Auto-saving changes
              </span>
            )}
          </div>
        </div>
        {!locked && pct < 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed"
            style={{ borderColor: `${color}30`, backgroundColor: `${color}05`, fontSize: "0.56rem", color }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Fill required fields to continue
          </motion.div>
        )}
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
          {!locked && pct < 100 && (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-16 h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                  animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
              </div>
              <span className="text-gray-300" style={{ fontSize: "0.52rem" }}>{pct}%</span>
            </div>
          )}
        </div>
        <motion.button
          onClick={onLock}
          disabled={!canLock && !locked}
          whileHover={canLock || locked ? { scale: 1.02 } : undefined}
          whileTap={canLock || locked ? { scale: 0.98 } : undefined}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 ${locked
            ? "text-emerald-600 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            : canLock
            ? "text-white shadow-lg hover:shadow-xl"
            : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"}`}
          style={!locked && canLock ? {
            background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
            fontSize: "0.7rem",
          } : { fontSize: "0.7rem" }}
        >
          {locked ? (
            <><Unlock className="w-3.5 h-3.5" /> Unlock Tab</>
          ) : canLock ? (
            <><Lock className="w-3.5 h-3.5" /> Lock & Continue <ArrowRight className="w-3.5 h-3.5 ml-1" /></>
          ) : (
            <><Lock className="w-3.5 h-3.5" /> Complete to Lock</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}