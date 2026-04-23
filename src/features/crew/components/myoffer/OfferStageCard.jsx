/**
 * OfferStageCard.jsx
 *
 * Clickable stage filter card for the MyOffer page top row.
 * Replaces the old MetricsCard stat cards.
 *
 * Props:
 *   label        — card title e.g. "Offer Review"
 *   sub          — subtitle e.g. "Awaiting your decision"
 *   count        — number to display
 *   icon         — Lucide icon component
 *   isSelected   — boolean, highlights the card
 *   onClick      — () => void
 *   colorScheme  — "purple" | "amber" | "green" | "blue" | "gray"
 */

import { cn } from "../../../../shared/config/utils";

const SCHEMES = {
  purple: {
    activeBg:    "bg-[#EEEDFE]",
    activeBorder:"border-[#7F77DD]",
    activeCount: "text-[#3C3489]",
    activeLabel: "text-[#534AB7]",
    activeSub:   "text-[#7F77DD]",
    iconBg:      "bg-[#EEEDFE]",
    iconActiveBg:"bg-[#7F77DD]",
    dot:         "bg-[#7F77DD]",
  },
  amber: {
    activeBg:    "bg-[#FAEEDA]",
    activeBorder:"border-[#BA7517]",
    activeCount: "text-[#412402]",
    activeLabel: "text-[#854F0B]",
    activeSub:   "text-[#BA7517]",
    iconBg:      "bg-[#FAEEDA]",
    iconActiveBg:"bg-[#BA7517]",
    dot:         "bg-[#BA7517]",
  },
  green: {
    activeBg:    "bg-[#EAF3DE]",
    activeBorder:"border-[#3B6D11]",
    activeCount: "text-[#173404]",
    activeLabel: "text-[#3B6D11]",
    activeSub:   "text-[#639922]",
    iconBg:      "bg-[#EAF3DE]",
    iconActiveBg:"bg-[#3B6D11]",
    dot:         "bg-[#3B6D11]",
  },
  blue: {
    activeBg:    "bg-[#E6F1FB]",
    activeBorder:"border-[#185FA5]",
    activeCount: "text-[#042C53]",
    activeLabel: "text-[#185FA5]",
    activeSub:   "text-[#378ADD]",
    iconBg:      "bg-[#E6F1FB]",
    iconActiveBg:"bg-[#185FA5]",
    dot:         "bg-[#185FA5]",
  },
  gray: {
    activeBg:    "bg-[#F1EFE8]",
    activeBorder:"border-[#5F5E5A]",
    activeCount: "text-[#2C2C2A]",
    activeLabel: "text-[#5F5E5A]",
    activeSub:   "text-[#888780]",
    iconBg:      "bg-[#F1EFE8]",
    iconActiveBg:"bg-[#5F5E5A]",
    dot:         "bg-[#888780]",
  },
};

export function OfferStageCard({
  label,
  sub,
  count = 0,
  icon: Icon,
  isSelected = false,
  onClick,
  colorScheme = "purple",
}) {
  const s = SCHEMES[colorScheme] ?? SCHEMES.purple;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left w-full",
        "transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        "hover:border-neutral-300 hover:shadow-sm",
        isSelected
          ? [s.activeBg, s.activeBorder, "border-2 shadow-sm"]
          : "bg-white border-neutral-200"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
          isSelected ? s.iconActiveBg : s.iconBg
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "w-4 h-4 transition-colors",
              isSelected ? "text-white" : "text-neutral-500"
            )}
          />
        )}
      </div>

      {/* Count */}
      <div
        className={cn(
          "text-2xl font-semibold leading-none tabular-nums",
          isSelected ? s.activeCount : "text-neutral-800"
        )}
      >
        {count}
      </div>

      {/* Label */}
      <div className="space-y-0.5">
        <p
          className={cn(
            "text-[11px] font-semibold uppercase tracking-wider leading-tight",
            isSelected ? s.activeLabel : "text-neutral-500"
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "text-[10px] leading-tight",
            isSelected ? s.activeSub : "text-neutral-400"
          )}
        >
          {sub}
        </p>
      </div>

      {/* Active indicator dot */}
      {isSelected && (
        <span
          className={cn(
            "absolute top-3 right-3 w-2 h-2 rounded-full",
            s.dot
          )}
        />
      )}
    </button>
  );
}