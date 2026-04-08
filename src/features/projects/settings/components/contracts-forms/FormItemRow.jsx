import { Eye, Lock, Shield, Unlock } from "lucide-react";

const accentColor = "#7c3aed";

/**
 * FormItemRow
 * A single form/override row with lock icon, name, and action buttons.
 *
 * Props:
 *  - name: string
 *  - isLocked?: boolean
 *  - isDefault?: boolean
 *  - showDefaultToggle?: boolean   — show the Default/Unset button (form groups only)
 *  - showUnlock?: boolean          — show the unlock icon button (categories only)
 *  - onReviewEdit?: () => void
 *  - onToggleDefault?: () => void
 *  - onToggleLock?: () => void
 */
export function FormItemRow({
  name,
  isLocked,
  isDefault,
  showDefaultToggle = false,
  showUnlock = false,
  onReviewEdit,
  onToggleDefault,
  onToggleLock,
}) {
  return (
    <div className="flex items-center justify-between px-2 py-1">
      {/* Left: lock icon + name + optional Default badge */}
      <div className="flex items-center gap-2 min-w-0">
        <Lock className="h-3 w-3 text-amber-500 shrink-0" />
        <span
          className="truncate text-gray-600 dark:text-gray-400"
          style={{ fontSize: "0.65rem" }}
        >
          {name}
        </span>
        {isDefault && (
          <span
            className="px-1 py-px rounded uppercase tracking-wider text-white shrink-0"
            style={{ fontSize: "0.36rem", background: accentColor }}
          >
            Default
          </span>
        )}
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-1">
        {/* Review/Edit */}
        <span
          onClick={onReviewEdit}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 cursor-pointer dark:hover:bg-amber-800/30 hover:bg-amber-100 transition-colors"
          style={{ fontSize: "0.55rem" }}
        >
          <Eye className="h-3 w-3" />
          Review/Edit
        </span>

        {/* Default toggle — form groups only */}
        {showDefaultToggle && (
          <button
            onClick={onToggleDefault}
            className="flex items-center gap-0.5 px-2 py-0.5 rounded transition-colors"
            style={
              isDefault
                ? { backgroundColor: `${accentColor}25`, color: accentColor, fontSize: "0.4rem" }
                : { backgroundColor: "#f3f4f6", color: "#9ca3af", fontSize: "0.4rem" }
            }
          >
            <Shield className="h-3 w-3" />
            {isDefault ? "Unset" : "Default"}
          </button>
        )}

        {/* Lock toggle — form groups */}
        {showDefaultToggle && (
          <button
            onClick={onToggleLock}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors"
            style={
              isLocked
                ? { backgroundColor: "#fef3c7", color: "#b45309", fontSize: "0.4rem" }
                : { backgroundColor: "#f3f4f6", color: "#9ca3af", fontSize: "0.4rem" }
            }
          >
            {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
          </button>
        )}

        {/* Unlock button — categories only */}
        {showUnlock && (
          <button
            onClick={onToggleLock}
            className="flex items-center justify-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
          >
            <Unlock className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}