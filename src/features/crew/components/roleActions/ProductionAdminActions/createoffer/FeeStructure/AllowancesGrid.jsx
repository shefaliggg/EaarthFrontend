export function AllowancesGrid({ enabledAllowances, allowances, activeField, currencySymbol }) {
  const cs = currencySymbol || "£";

  const getPayableLabel = (a) => {
    const parts = [];
    if (a.payablePrep) parts.push("Prep");
    if (a.payableShoot) parts.push("Shoot");
    if (a.payableWrap) parts.push("Wrap");
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  if (enabledAllowances.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-purple-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] mt-2">
      <div className="bg-purple-700 px-2.5 py-1 flex items-center justify-between">
        <p className="text-white text-[10px] font-semibold tracking-wide">Allowances</p>
        <span className="text-purple-200 text-[8px]">{enabledAllowances.length} active</span>
      </div>
      <div className={`grid gap-px bg-purple-50/50 ${
        enabledAllowances.length === 1 ? "grid-cols-1" :
        enabledAllowances.length <= 4 ? "grid-cols-2" :
        "grid-cols-3"
      }`}>
        {enabledAllowances.map(({ key, label }) => {
          const a = allowances[key];
          const isActive = activeField === `allowance_${key}`;

          const rows = [];
          if (a.description) rows.push({ field: "Description", value: a.description });
          rows.push({ field: "Fee / week", value: `${cs}${parseFloat(a.feePerWeek || "0").toFixed(2)}`, highlight: true });
          if (a.rateCap) rows.push({ field: "Cap", value: a.rateCap });
          if (a.terms) rows.push({ field: "Terms", value: a.terms });
          if (a.budgetCode) rows.push({ field: "Budget code", value: a.budgetCode });
          if (a.tag) rows.push({ field: "Tag", value: a.tag });
          rows.push({ field: "Payable in", value: getPayableLabel(a) });

          return (
            <div
              key={key}
              className={`p-1.5 transition-all duration-200 ${isActive ? "bg-blue-50 ring-2 ring-blue-400 ring-inset" : "bg-white"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-semibold text-purple-800 uppercase tracking-wider">{label}</p>
                <span className="text-[8px] font-semibold text-emerald-600">
                  {cs}{parseFloat(a.feePerWeek || "0").toFixed(2)}/wk
                </span>
              </div>
              <div className="space-y-px">
                {rows.map((r, ri) => (
                  <div key={ri} className={`flex gap-1.5 py-px px-1 rounded text-[7.5px] ${ri % 2 === 0 ? "bg-purple-50/40" : ""}`}>
                    <span className="text-neutral-400 shrink-0 w-[60px]">{r.field}</span>
                    <span className={`${r.highlight ? "text-emerald-600 font-semibold" : "text-neutral-600"} min-w-0`}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}