import { Label } from "../../../../../../shared/components/ui/label";
import { Input } from "../../../../../../shared/components/ui/input";
import { Checkbox } from "../../../../../../shared/components/ui/checkbox";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn, getCurrencySymbol } from "./Constants";

// ─── FormField ────────────────────────────────────────────────────────────────

export const FormField = ({ label, required, tooltip, children, className }) => (
  <div className={cn("space-y-1.5", className)}>
    <Label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">
      {label} {required && <span className="text-destructive">*</span>}
      {tooltip && (
        <span className="font-normal text-muted-foreground ml-1 text-[10px] normal-case">
          ({tooltip})
        </span>
      )}
    </Label>
    {children}
  </div>
);

// ─── SelectField ──────────────────────────────────────────────────────────────

export const SelectField = ({ value, onChange, options, className, ...props }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

// ─── PayableInCheckboxes ──────────────────────────────────────────────────────

export const PayableInCheckboxes = ({
  label, prep, shoot, wrap,
  onPrepChange, onShootChange, onWrapChange,
}) => (
  <FormField label={label || "Payable In"}>
    <div className="flex gap-4 pt-1">
      {[
        ["PREP",  prep,  onPrepChange],
        ["SHOOT", shoot, onShootChange],
        ["WRAP",  wrap,  onWrapChange],
      ].map(([name, checked, onChange]) => (
        <label key={name} className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={checked} onCheckedChange={onChange} />
          <span className="text-xs font-medium">{name}</span>
        </label>
      ))}
    </div>
  </FormField>
);

// ─── SliderCurrencyInput ──────────────────────────────────────────────────────

export const SliderCurrencyInput = ({
  label, value, onChange,
  currency = "GBP", required,
  min = 0, max = 5000, step = 50,
}) => {
  const sym = getCurrencySymbol(currency);
  const num = parseFloat(value) || 0;
  const pct = Math.min((num / max) * 100, 100);

  return (
    <FormField label={label} required={required}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">{sym}</span>
          <Input
            type="number" step="0.01" value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00" className="w-28"
          />
          <span className="text-xs text-muted-foreground">
            {sym}{num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{sym}0</span>
          <input
            type="range" min={min} max={max} step={step} value={num}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 h-1.5 rounded-full cursor-pointer accent-primary"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${pct}%, hsl(var(--muted)) ${pct}%, hsl(var(--muted)) 100%)`,
            }}
          />
          <span className="text-[10px] text-muted-foreground">{sym}{max.toLocaleString()}</span>
        </div>
      </div>
    </FormField>
  );
};

// ─── SectionHeader ────────────────────────────────────────────────────────────

export const SectionHeader = ({ title, icon: Icon, section, isOpen, onToggle }) => (
  <button
    onClick={() => onToggle(section)}
    className="flex items-center justify-between w-full p-4 bg-primary/5 rounded-t-lg border-b border-primary/10 hover:bg-primary/10 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm font-bold text-primary uppercase tracking-wide">{title}</span>
    </div>
    {isOpen
      ? <ChevronUp className="w-5 h-5 text-primary" />
      : <ChevronDown className="w-5 h-5 text-primary" />
    }
  </button>
);

// ─── AllowanceTableSection ────────────────────────────────────────────────────
// Wraps each allowance with a toggle checkbox, a summary table row (read-only
// except for Budget Code and Tag which are both hidden in print), and an
// expandable detail grid passed as children.

export const AllowanceTableSection = ({
  title, icon: Icon, isEnabled, onToggle,
  tag, onTagChange,
  budgetCode, onBudgetCodeChange,
  rateValue, grossValue, currency,
  children,
}) => {
  const sym = getCurrencySymbol(currency);

  return (
    <div className={cn(
      "rounded-lg border transition-all",
      isEnabled ? "border-primary/30 bg-primary/5" : "border-border bg-card"
    )}>
      {/* Toggle row */}
      <div className="flex items-center gap-3 p-3">
        <Checkbox checked={isEnabled} onCheckedChange={onToggle} className="w-5 h-5" />
        <Icon className={cn("w-4 h-4", isEnabled ? "text-primary" : "text-muted-foreground")} />
        <span className={cn("text-sm font-bold uppercase", isEnabled ? "text-primary" : "text-muted-foreground")}>
          {title}
        </span>
        {isEnabled && (
          <span className="ml-auto text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            ENABLED
          </span>
        )}
      </div>

      {isEnabled && (
        <div className="border-t border-primary/10">
          {/* Summary table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-primary/10 bg-primary/5">
                  <th className="text-left p-2 font-bold uppercase text-primary/70">Item</th>
                  <th className="text-left p-2 font-bold uppercase text-primary/70">Rate</th>
                  <th className="text-left p-2 font-bold uppercase text-primary/70">Hol.</th>
                  <th className="text-left p-2 font-bold uppercase text-primary/70">Gross</th>
                  {/* Hidden in print */}
                  <th className="text-left p-2 font-bold uppercase text-primary/70 print-hide">Budget Code</th>
                  <th className="text-left p-2 font-bold uppercase text-primary/70 print-hide">Tag</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 font-medium uppercase">{title}</td>
                  <td className="p-2 text-muted-foreground">
                    {rateValue ? `${sym}${parseFloat(rateValue).toFixed(2)}` : "—"}
                  </td>
                  <td className="p-2 text-muted-foreground">—</td>
                  <td className="p-2 font-semibold">
                    {grossValue ? `${sym}${parseFloat(grossValue).toFixed(2)}` : "—"}
                  </td>
                  <td className="p-2 print-hide">
                    <Input
                      value={budgetCode}
                      onChange={(e) => onBudgetCodeChange(e.target.value.toUpperCase())}
                      placeholder="847-13-001"
                      className="h-7 text-xs uppercase w-32"
                    />
                  </td>
                  <td className="p-2 print-hide">
                    <Input
                      value={tag}
                      onChange={(e) => onTagChange(e.target.value.toUpperCase())}
                      placeholder="E.G. TRANSPORT"
                      className="h-7 text-xs uppercase w-28"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Detail fields */}
          <div className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};