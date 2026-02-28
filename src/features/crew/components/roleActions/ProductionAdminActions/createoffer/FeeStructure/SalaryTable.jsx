import { formatCurrency } from "../../../../../utils/rateCalculations";

export function SalaryTable({
  calculatedRates,
  salaryBudgetCodes,
  setSalaryBudgetCodes,
  salaryTags,
  setSalaryTags,
  activeField,
  onFieldFocus,
  onFieldBlur,
  currencySymbol,
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
        <p className="text-white text-[10px] font-semibold tracking-wide">Salary</p>
        <span className="text-purple-200 text-[8px]">{calculatedRates.salary.length} items</span>
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
          {calculatedRates.salary.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-purple-50/50 ${
                activeField === `salaryRow_${i}`
                  ? "ring-2 ring-blue-400 ring-inset bg-blue-50/50"
                  : i % 2 === 0
                  ? "bg-white"
                  : "bg-purple-50/20"
              } transition-all duration-200`}
            >
              <td className="px-1.5 py-[2px] text-neutral-700 whitespace-nowrap">{row.item}</td>

              {/* Editable Budget Code */}
              <td className="px-1.5 py-[2px]">
                {setSalaryBudgetCodes ? (
                  <input
                    type="text"
                    value={salaryBudgetCodes[i] || ""}
                    placeholder="BUDGET CODE"
                    onChange={(e) => updateArr(setSalaryBudgetCodes, i, e.target.value)}
                    onFocus={() => onFieldFocus?.(`salaryRow_${i}`)}
                    onBlur={onFieldBlur}
                    className="w-full bg-transparent border border-transparent hover:border-purple-300 focus:border-purple-500 focus:outline-none rounded px-1 py-0.5 text-[7.5px] font-mono text-neutral-500 placeholder:text-neutral-300 transition-colors uppercase"
                  />
                ) : (
                  <span className="font-mono text-neutral-500 text-[7.5px]">
                    {salaryBudgetCodes[i] || "—"}
                  </span>
                )}
              </td>

              {/* Editable Tag */}
              <td className="px-1.5 py-[2px]">
                {setSalaryTags ? (
                  <input
                    type="text"
                    value={salaryTags[i] || ""}
                    placeholder="TAG"
                    onChange={(e) => updateArr(setSalaryTags, i, e.target.value)}
                    onFocus={() => onFieldFocus?.(`salaryRow_${i}`)}
                    onBlur={onFieldBlur}
                    className="w-full bg-transparent border border-transparent hover:border-purple-300 focus:border-purple-500 focus:outline-none rounded px-1 py-0.5 text-[7.5px] text-neutral-400 placeholder:text-neutral-300 transition-colors uppercase"
                  />
                ) : (
                  <span className="text-neutral-400 text-[7.5px]">{salaryTags[i] || "—"}</span>
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