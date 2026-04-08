export function AllowancesGrid({ enabledAllowances, allowances, activeField, currencySymbol, categoryTotals = { box: 120000, software: 80000, equipment: 60000 } }) {
  const cs = currencySymbol || "£";

  const PAYMENT_LABEL_MAP = {
    daily: "Day", weekly: "Week", monthly: "Month", yearly: "Year",
  };

  const getPayableLabel = (a) => {
    const parts = [];
    if (a.payablePrep)  parts.push("Prep");
    if (a.payableShoot) parts.push("Shoot");
    if (a.payableWrap)  parts.push("Wrap");
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  const resolveCategoryTotal = (key) => {
    if (key === "boxRental") return categoryTotals.box       ?? 0;
    if (key === "software")  return categoryTotals.software  ?? 0;
    if (key === "equipment") return categoryTotals.equipment ?? 0;
    return 0;
  };

  const fmt = (n) =>
    parseFloat(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const getCapDisplay = (a, key) => {
    const capType = a.capType || "flat";
    if (capType === "na") return { label: "N/A", capValue: null };
    if (capType === "percentage" && a.capPercentage != null) {
      const total    = resolveCategoryTotal(key);
      const computed = total > 0 ? (total * parseFloat(a.capPercentage)) / 100 : null;
const combined = computed != null
  ? `${cs}${fmt(computed)} (${a.capPercentage}% of total value)`
  : `${a.capPercentage}% of total value`;
  
      return { label: combined, capValue: null };
    }
    if (capType === "flat" && a.rateCap) {
      return { label: `${cs}${fmt(a.rateCap)}`, capValue: null };
    }
    return { label: null, capValue: null };
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
          const a        = allowances[key];
          const isActive = activeField === `allowance_${key}`;

          const payLabel           = PAYMENT_LABEL_MAP[a.paymentType || "weekly"];
          const amount             = parseFloat(a.amount || "0").toFixed(2);
          const { label: capLabel } = getCapDisplay(a, key);

          const rows = [];
          if (a.description) rows.push({ field: "Description",  value: a.description });
          rows.push({          field: `Fee / ${payLabel}`,       value: `${cs}${amount}`, highlight: true });
          if (capLabel)        rows.push({ field: "Cap",         value: capLabel, highlight: true });
          if (a.terms)         rows.push({ field: "Terms",       value: a.terms });
          if (a.budgetCode)    rows.push({ field: "Budget code", value: a.budgetCode });
          if (a.tag)           rows.push({ field: "Tag",         value: a.tag });
          rows.push({          field: "Payable in",              value: getPayableLabel(a) });

          return (
            <div
              key={key}
              className={`p-1.5 transition-all duration-200 ${isActive ? "bg-blue-50 ring-2 ring-blue-400 ring-inset" : "bg-white"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-semibold text-purple-800 uppercase tracking-wider">{label}</p>
                <span className="text-[8px] font-semibold text-emerald-600">
                  {cs}{amount}/{(a.paymentType || "weekly").slice(0, 2)}
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