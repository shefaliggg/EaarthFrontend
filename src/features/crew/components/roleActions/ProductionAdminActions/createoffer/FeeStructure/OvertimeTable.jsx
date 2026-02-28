import { formatCurrency } from "../../../../../utils/rateCalculations";

export function OvertimeTable({
  calculatedRates,
  overtimeBudgetCodes,
  setOvertimeBudgetCodes,
  overtimeTags,
  setOvertimeTags,
  activeField,
  onFieldFocus,
  onFieldBlur,
  currencySymbol,
  overtimeMode,
}) {
  const cs = currencySymbol || "£";

  const updateArr = (setter, i, value) =>
    setter((prev) => {
      const u = [...prev];
      u[i] = value.toUpperCase();
      return u;
    });

  return (
    <div className="bg-white rounded-xl border border-purple-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="bg-purple-700 px-2.5 py-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-white text-[10px] font-semibold tracking-wide">Overtime</p>
          <span
            className={`text-[7px] px-1.5 py-px rounded font-semibold tracking-wider ${
              overtimeMode === "custom"
                ? "bg-amber-400/90 text-amber-900"
                : "bg-purple-500/60 text-purple-100"
            }`}
          >
            {overtimeMode === "custom" ? "CUSTOM" : "CALCULATED"}
          </span>
        </div>
        <span className="text-purple-200 text-[8px]">{calculatedRates.overtime.length} items</span>
      </div>
      <table className="w-full" style={{ fontSize: "8px" }}>
        <thead>
          <tr className="bg-purple-50/60 border-b border-purple-100">
            {["Item", "Budget Code", "Tag", "Rate", "Hol", "Gross"].map((h) => (
              <th
                key={h}
                className={`${
                  h === "Rate" || h === "Hol" || h === "Gross" ? "text-right" : "text-left"
                } px-1.5 py-0.5 text-purple-600 font-medium text-[7.5px] uppercase tracking-wider`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calculatedRates.overtime.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-purple-50/50 ${
                activeField === `overtimeRow_${i}`
                  ? "ring-2 ring-blue-400 ring-inset bg-blue-50/50"
                  : i % 2 === 0
                  ? "bg-white"
                  : "bg-purple-50/20"
              } transition-all duration-200`}
            >
              <td className="px-1.5 py-[2px] text-neutral-700 whitespace-nowrap">{row.item}</td>

              {/* Editable Budget Code */}
              <td className="px-1.5 py-[2px]">
                {setOvertimeBudgetCodes ? (
                  <input
                    type="text"
                    value={overtimeBudgetCodes[i] || ""}
                    placeholder="BUDGET CODE"
                    onChange={(e) => updateArr(setOvertimeBudgetCodes, i, e.target.value)}
                    onFocus={() => onFieldFocus?.(`overtimeRow_${i}`)}
                    onBlur={onFieldBlur}
                    className="w-full bg-transparent border border-transparent hover:border-purple-300 focus:border-purple-500 focus:outline-none rounded px-1 py-0.5 text-[7.5px] font-mono text-neutral-500 placeholder:text-neutral-300 transition-colors uppercase"
                  />
                ) : (
                  <span className="font-mono text-neutral-500 text-[7.5px]">
                    {overtimeBudgetCodes[i] || "—"}
                  </span>
                )}
              </td>

              {/* Editable Tag */}
              <td className="px-1.5 py-[2px]">
                {setOvertimeTags ? (
                  <input
                    type="text"
                    value={overtimeTags[i] || ""}
                    placeholder="TAG"
                    onChange={(e) => updateArr(setOvertimeTags, i, e.target.value)}
                    onFocus={() => onFieldFocus?.(`overtimeRow_${i}`)}
                    onBlur={onFieldBlur}
                    className="w-full bg-transparent border border-transparent hover:border-purple-300 focus:border-purple-500 focus:outline-none rounded px-1 py-0.5 text-[7.5px] text-neutral-400 placeholder:text-neutral-300 transition-colors uppercase"
                  />
                ) : (
                  <span className="text-neutral-400 text-[7.5px]">{overtimeTags[i] || "—"}</span>
                )}
              </td>

              <td className="px-1.5 py-[2px] text-right text-neutral-700 whitespace-nowrap tabular-nums">
                {formatCurrency(row.rate, cs)}
              </td>
              <td className="px-1.5 py-[2px] text-right text-neutral-400 whitespace-nowrap tabular-nums">
                {formatCurrency(row.hol, cs)}
              </td>
              <td className="px-1.5 py-[2px] text-right text-emerald-600 font-semibold whitespace-nowrap tabular-nums">
                {formatCurrency(row.gross, cs)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}