// ─── SummaryStats ────────────────────────────────────────────────────────────
// The 5-column summary cards row from the old Dashboard.
// Props:
//   stats        – array of { label, value, icon: LucideComponent, color, bg, border, filterKey }
//   selected     – currently selected filterKey (string | null)
//   onSelect     – (filterKey) => void

export function SummaryStats({ stats, selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {stats.map((card) => {
        const Icon      = card.icon;
        const isActive  = selected === card.filterKey;

        return (
          <button
            key={card.filterKey}
            onClick={() => onSelect(isActive ? null : card.filterKey)}
            className={`
              text-left rounded-xl border p-3.5
              flex items-center gap-3
              transition-all
              ${card.bg} ${card.border}
              ${isActive ? "ring-2 ring-purple-400 shadow-md" : "hover:shadow-sm"}
            `}
          >
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
              <Icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase leading-tight">
                {card.label}
              </p>
              <p className={`text-[22px] font-semibold leading-none mt-0.5 ${card.color}`}>
                {card.value.toLocaleString()}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}