// ─── StageGrid ───────────────────────────────────────────────────────────────
// The 8-column stage pipeline cards from the old Dashboard.
// Props:
//   stages   – array of { key, label, count, icon: LucideComponent, color, bg, border }
//   selected – currently active stage key (string | null)
//   onSelect – (key) => void

export function StageGrid({ stages, selected, onSelect }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
      {stages.map((stage) => {
        const Icon     = stage.icon;
        const isActive = selected === stage.key;

        return (
          <button
            key={stage.key}
            onClick={() => onSelect(isActive ? null : stage.key)}
            className={`
              rounded-xl border p-2.5 text-left
              transition-all
              ${isActive
                ? `${stage.bg} ${stage.border} ring-2 ring-purple-300`
                : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
              }
            `}
          >
            <div className="flex items-center justify-between mb-1.5">
              <Icon className={`h-4 w-4 ${stage.color}`} />
              <span className={`text-[18px] font-semibold leading-none ${stage.color}`}>
                {stage.count}
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 font-medium tracking-wide uppercase leading-tight">
              {stage.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}