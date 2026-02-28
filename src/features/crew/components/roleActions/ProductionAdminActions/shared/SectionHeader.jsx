export function SectionHeader({ title, accent = "bg-purple-600" }) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <div className={`w-[3px] h-3.5 ${accent} rounded-full`} />
      <p className="text-[11px] font-semibold text-purple-900 tracking-wide uppercase">{title}</p>
    </div>
  );
}