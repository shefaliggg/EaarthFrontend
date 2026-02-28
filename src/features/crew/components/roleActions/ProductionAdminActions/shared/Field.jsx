export function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <p className="text-neutral-400 text-[9px] uppercase tracking-wider mb-px">{label}</p>
      <div className="text-neutral-800 text-[11px]">{children}</div>
    </div>
  );
}