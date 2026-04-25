/**
 * OfferStageFilter.jsx
 *
 * Renders the 4 clickable stage cards at the top of the MyOffer page.
 * Replaces the inline grid + StageCard from MyOffer.jsx.
 *
 * Props:
 *   stages      — array from OFFER_STAGES (offerStageConfig.js)
 *   counts      — { [stageKey]: number } from countByStage()
 *   activeStage — string key of selected stage (or null = show all)
 *   onChange    — (stageKey) => void  — toggles stage (deselects if same)
 */

import { cn } from "../../../../shared/config/utils";

const SCHEMES = {
  purple: {
    activeBg:     "bg-[#EEEDFE]",
    activeBorder: "border-[#7F77DD]",
    activeCount:  "text-[#3C3489]",
    activeLabel:  "text-[#534AB7]",
    activeSub:    "text-[#7F77DD]",
    iconBg:       "bg-[#EEEDFE]",
    iconActiveBg: "bg-[#7F77DD]",
    dot:          "bg-[#7F77DD]",
  },
  amber: {
    activeBg:     "bg-[#FAEEDA]",
    activeBorder: "border-[#BA7517]",
    activeCount:  "text-[#412402]",
    activeLabel:  "text-[#854F0B]",
    activeSub:    "text-[#BA7517]",
    iconBg:       "bg-[#FAEEDA]",
    iconActiveBg: "bg-[#BA7517]",
    dot:          "bg-[#BA7517]",
  },
  green: {
    activeBg:     "bg-[#EAF3DE]",
    activeBorder: "border-[#3B6D11]",
    activeCount:  "text-[#173404]",
    activeLabel:  "text-[#3B6D11]",
    activeSub:    "text-[#639922]",
    iconBg:       "bg-[#EAF3DE]",
    iconActiveBg: "bg-[#3B6D11]",
    dot:          "bg-[#3B6D11]",
  },
  gray: {
    activeBg:     "bg-[#F1EFE8]",
    activeBorder: "border-[#5F5E5A]",
    activeCount:  "text-[#2C2C2A]",
    activeLabel:  "text-[#5F5E5A]",
    activeSub:    "text-[#888780]",
    iconBg:       "bg-[#F1EFE8]",
    iconActiveBg: "bg-[#5F5E5A]",
    dot:          "bg-[#888780]",
  },
};

const ICON_COLORS = {
  amber:  "#f59e0b",
  purple: "#7F77DD",
  green:  "#3B6D11",
  gray:   "#888780",
};

function StageCard({ stage, count, isSelected, onClick }) {
  const s = SCHEMES[stage.colorScheme] ?? SCHEMES.purple;
  const Icon = stage.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col justify-between rounded-xl border px-4 py-4 w-full min-h-[90px] text-left",
        "transition-all duration-150 focus:outline-none hover:shadow-md cursor-pointer",
        isSelected
          ? [s.activeBg, s.activeBorder, "border-2 shadow-sm"]
          : "bg-white border-neutral-200"
      )}
    >
      {/* Top row: label left, icon right */}
      <div className="flex items-start justify-between gap-2">
        <p className={cn(
          "text-md font-semibold uppercase tracking-wider leading-tight",
          isSelected ? s.activeLabel : "text-neutral-500"
        )}>
          {stage.label}
        </p>
        {Icon && (
          <Icon
            className={cn(
              "w-6 h-6 shrink-0 transition-colors",
              isSelected ? s.activeLabel : ""
            )}
            style={isSelected ? {} : { color: ICON_COLORS[stage.colorScheme] }}
          />
        )}
      </div>

      {/* Bottom: count */}
      <p className={cn(
        "text-3xl font-bold leading-none tabular-nums mt-3",
        isSelected ? s.activeCount : "text-neutral-800"
      )}>
        {count ?? 0}
      </p>
    </button>
  );
}

export function OfferStageFilter({ stages, counts, activeStage, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stages.map((stage) => (
        <StageCard
          key={stage.key}
          stage={stage}
          count={counts[stage.key] ?? 0}
          isSelected={activeStage === stage.key}
          onClick={() => onChange(stage.key)}
        />
      ))}
    </div>
  );
}