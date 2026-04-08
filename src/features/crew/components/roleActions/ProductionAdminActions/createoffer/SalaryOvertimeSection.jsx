// sections/SalaryOvertimeSection.jsx
// These tables use plain HTML <table> + inline inputs — no custom shared component needed.
import { cn } from "@/shared/config/utils";
import { formatCurrency, formatRateHol } from "../../../../utils/rateCalculations";

function updateArr(setter, i, value) {
  setter((prev) => { const u = [...prev]; u[i] = value.toUpperCase(); return u; });
}

function RateTable({ rows, budgetCodes, setBudgetCodes, tags, setTags, onFieldFocus, onFieldBlur, rowPrefix, cs }) {
  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            {["Item", "Budget Code", "Tag", "Rate / Hol", "Gross"].map((h) => (
              <th key={h} className={cn(
                "py-1.5 px-1 font-medium text-primary uppercase tracking-wider text-[10px]",
                h === "Gross" ? "text-right" : "text-left"
              )}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/40 hover:bg-accent/10">
              <td className="py-1.5 px-1 text-foreground/80">{row.item}</td>
              <td className="py-0.5 px-1">
                <input type="text" value={budgetCodes[i] || ""}
                  onChange={(e) => updateArr(setBudgetCodes, i, e.target.value)}
                  onFocus={() => onFieldFocus?.(`${rowPrefix}_${i}`)} onBlur={onFieldBlur}
                  className="w-full bg-transparent border border-transparent hover:border-primary/40 focus:border-primary focus:outline-none rounded px-1 py-0.5 text-xs font-mono text-muted-foreground transition-colors uppercase" />
              </td>
              <td className="py-0.5 px-1">
                <input type="text" value={tags[i] || ""}
                  onChange={(e) => updateArr(setTags, i, e.target.value)}
                  onFocus={() => onFieldFocus?.(`${rowPrefix}_${i}`)} onBlur={onFieldBlur}
                  className="w-full bg-transparent border border-transparent hover:border-primary/40 focus:border-primary focus:outline-none rounded px-1 py-0.5 text-xs font-mono text-muted-foreground transition-colors uppercase" />
              </td>
              <td className="py-1.5 px-1 text-foreground/80">{formatRateHol(row.rate, row.hol, cs)}</td>
              <td className="py-1.5 px-1 text-right text-foreground/80">{formatCurrency(row.gross, cs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SalarySection({ calculatedRates, salaryBudgetCodes, setSalaryBudgetCodes, salaryTags, setSalaryTags, onFieldFocus, onFieldBlur, currencySymbol }) {
  return <RateTable rows={calculatedRates.salary} budgetCodes={salaryBudgetCodes} setBudgetCodes={setSalaryBudgetCodes} tags={salaryTags} setTags={setSalaryTags} onFieldFocus={onFieldFocus} onFieldBlur={onFieldBlur} rowPrefix="salaryRow" cs={currencySymbol} />;
}

export function OvertimeSection({ calculatedRates, overtimeBudgetCodes, setOvertimeBudgetCodes, overtimeTags, setOvertimeTags, onFieldFocus, onFieldBlur, currencySymbol }) {
  return <RateTable rows={calculatedRates.overtime} budgetCodes={overtimeBudgetCodes} setBudgetCodes={setOvertimeBudgetCodes} tags={overtimeTags} setTags={setOvertimeTags} onFieldFocus={onFieldFocus} onFieldBlur={onFieldBlur} rowPrefix="overtimeRow" cs={currencySymbol} />;
}