// shared/BundlePreviewBar.jsx
// Pure display component — no inputs, no side effects.

export function BundlePreviewBar({ bundle }) {
  if (!bundle) return null;

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        <span className="text-[10px] font-semibold text-primary uppercase tracking-wide truncate">
          {bundle.name || "Bundle"}
        </span>
      </div>
      {bundle.description && (
        <span className="text-[10px] text-muted-foreground truncate">{bundle.description}</span>
      )}
      {bundle.value != null && (
        <span className="text-[10px] font-mono font-semibold text-emerald-600 shrink-0">
          {bundle.value}
        </span>
      )}
    </div>
  );
}