import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableCheckboxField from "@/shared/components/wrappers/EditableCheckboxField";

const PAYMENT_LABEL_MAP = {
  daily:   "Day",
  weekly:  "Week",
  monthly: "Month",
  yearly:  "Year",
};

const PAYMENT_TYPE_OPTIONS = [
  { value: "daily",   label: "Daily"   },
  { value: "weekly",  label: "Weekly"  },
  { value: "monthly", label: "Monthly" },
  { value: "yearly",  label: "Yearly"  },
];

const PERCENTAGE_CAP_ALLOWED = ["boxRental", "software", "equipment"];
const CURRENCY_SYMBOL_MAP = { GBP: "£", USD: "$", EUR: "€" };

const fmt = (n) =>
  n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CAP_OPTIONS = [
  { value: "flat", label: "Flat Figure" },
  ...Array.from({ length: 101 }, (_, i) => ({
    value: `percent_${i}`,
    label: `${i}% of Total Value`,
    percent: i,
  })),
  { value: "na", label: "N/A" },
];

function resolveCapDropdownValue(a) {
  const capType = a.capType || "flat";
  if (capType === "na") return "na";
  if (capType === "percentage") return `percent_${a.capPercentage ?? 0}`;
  return "flat";
}

function calculateFinalPay(a, categoryTotal, allowanceKey) {
  const base    = parseFloat(a.amount) || 0;
  const capType = a.capType || "flat";
  if (capType === "na") return base;
  if (capType === "flat") {
    const cap = parseFloat(a.rateCap) || 0;
    if (cap <= 0) return base;
    return Math.min(base, cap);
  }
  if (capType === "percentage") {
    if (!PERCENTAGE_CAP_ALLOWED.includes(allowanceKey)) return base;
    const cap = (categoryTotal * (parseFloat(a.capPercentage) || 0)) / 100;
    if (cap <= 0) return base;
    return Math.min(base, cap);
  }
  return base;
}

export function AllowanceRow({
  allowanceKey,
  label,
  icon: Icon,
  hasDescription,
  allowanceData,
  onUpdate,
  onFieldFocus,
  onFieldBlur,
  currencySymbol = "£",
  categoryTotal = 0,
}) {
  const a = allowanceData;
  const [expanded, setExpanded] = useState(!!a.enabled);

  const symbol = CURRENCY_SYMBOL_MAP[a.currency] || currencySymbol;

  const resolvedCategoryTotal = categoryTotal > 0 ? categoryTotal : {
    boxRental: 120000,
    software:   80000,
    equipment:  60000,
  }[allowanceKey] ?? 0;

  const isPercentageAllowed = PERCENTAGE_CAP_ALLOWED.includes(allowanceKey);
  const capType             = a.capType || "flat";
  const isPercentageCap     = capType === "percentage";
  const isFlatCap           = capType === "flat";

  const computedCapAmount = isPercentageCap && isPercentageAllowed
    ? (resolvedCategoryTotal * (parseFloat(a.capPercentage) || 0)) / 100
    : null;

  const handleCapChange = (val) => {
    if (val === "flat") {
      onUpdate("capType", "flat");
      onUpdate("capPercentage", null);
    } else if (val === "na") {
      onUpdate("capType", "na");
      onUpdate("capPercentage", null);
      onUpdate("rateCap", null);
    } else if (val.startsWith("percent_")) {
      const percent = parseInt(val.split("_")[1], 10);
      onUpdate("capType", "percentage");
      onUpdate("capPercentage", percent);
      onUpdate("rateCap", null);
    }
  };

  const handleEnable = (checked) => {
    onUpdate("enabled", checked);
    setExpanded(checked);
  };

  const safeNumber = (val, min = 0) => {
    const n = parseFloat(val);
    return isNaN(n) ? min : Math.max(min, n);
  };

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">

      {/* ── Header ── */}
      <div className={`flex items-center gap-2 px-3 py-2 ${
        a.enabled ? "bg-primary/5 border-b border-border" : ""
      }`}>
        <EditableCheckboxField checked={!!a.enabled} onChange={handleEnable} isEditing={true} />
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {Icon && <Icon className="h-3.5 w-3.5 text-primary shrink-0" />}
          <span className={`text-[11px] font-bold tracking-widest uppercase ${
            a.enabled ? "text-primary" : "text-muted-foreground"
          }`}>
            {label}
          </span>
        </div>
        {a.enabled && (
          <span className="text-[9px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">ON</span>
        )}
        {a.enabled && (
          <button type="button" onClick={() => setExpanded((v) => !v)}
            className="text-muted-foreground hover:text-foreground transition-colors ml-1">
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* ── Body ── */}
      {a.enabled && expanded && (
        <div className="px-3 py-2 space-y-2">

          {/* Budget Code | Tag */}
          <div className="grid grid-cols-2 gap-2">
            <EditableTextDataField
              label="Budget Code" value={a.budgetCode || ""} isEditing={true}
              onChange={(val) => onUpdate("budgetCode", val.toUpperCase())}
              onFocus={() => onFieldFocus?.(`allowance_${allowanceKey}_budgetCode`)}
              onBlur={onFieldBlur} placeholder="000-00-000"
            />
            <EditableTextDataField
              label="Tag" value={a.tag || ""} isEditing={true}
              onChange={(val) => onUpdate("tag", val.toUpperCase())}
              onFocus={() => onFieldFocus?.(`allowance_${allowanceKey}_tag`)}
              onBlur={onFieldBlur} placeholder="TAG"
            />
          </div>

          {/* Description */}
          {hasDescription && (
            <EditableTextDataField
              label="Description" value={a.description || ""} isEditing={true}
              onChange={(val) => onUpdate("description", val)}
              onFocus={() => onFieldFocus?.(`allowance_${allowanceKey}_description`)}
              onBlur={onFieldBlur} placeholder="Description..."
            />
          )}

          {/* ── Row 1: Fee + Cap dropdown ── */}
          <div className="grid grid-cols-2 gap-2">

            {/* Fee input */}
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
                Fee Per {PAYMENT_LABEL_MAP[a.paymentType || "weekly"]}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">{symbol}</span>
                <input
                  type="number" min="0" step="0.01" value={a.amount ?? ""}
                  onChange={(e) => onUpdate("amount", safeNumber(e.target.value))}
                  onFocus={() => onFieldFocus?.(`allowance_${allowanceKey}_amount`)}
                  onBlur={onFieldBlur}
                  className="flex-1 h-7 text-sm font-medium text-foreground bg-background border border-transparent hover:border-border focus:border-primary focus:outline-none rounded-md px-2"
                />
              </div>
              <EditableSelectField
                value={a.paymentType || "weekly"} items={PAYMENT_TYPE_OPTIONS}
                isEditing={true} onChange={(val) => onUpdate("paymentType", val)}
              />
            </div>

            {/* Cap dropdown */}
            <EditableSelectField
              label="Cap Calculated As"
              value={resolveCapDropdownValue(a)}
              items={CAP_OPTIONS}
              isEditing={true}
              onChange={handleCapChange}
            />
          </div>

          {/* ── Row 2: Flat cap amount OR Total Value + Cap Value ── */}
          {isFlatCap && (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
                  Cap Amount
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">{symbol}</span>
                  <input
                    type="number" min="0" step="0.01" value={a.rateCap ?? ""}
                    onChange={(e) => onUpdate("rateCap", safeNumber(e.target.value))}
                    onFocus={() => onFieldFocus?.(`allowance_${allowanceKey}_rateCap`)}
                    onBlur={onFieldBlur} placeholder="0.00"
                    className="flex-1 h-8 text-sm font-medium text-foreground bg-background border border-transparent hover:border-border focus:border-primary focus:outline-none rounded-md px-2"
                  />
                </div>
              </div>
            </div>
          )}

          {isPercentageCap && (
            <div className="grid grid-cols-2 gap-2">
              {/* Total Value */}
              <div className="flex flex-col gap-0.5">
                <p className="text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
                  Total Value
                </p>
                {isPercentageAllowed && resolvedCategoryTotal > 0 ? (
                  <p className="text-sm font-semibold text-foreground tabular-nums">
                    {symbol}{fmt(resolvedCategoryTotal)}
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-500 italic">
                    {isPercentageAllowed ? "No total set" : "No total available"}
                  </p>
                )}
              </div>
              {/* Cap Value */}
              <div className="flex flex-col gap-0.5">
                <p className="text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
                  Cap Value
                </p>
                <p className="text-sm font-semibold text-primary tabular-nums">
                  {computedCapAmount != null && computedCapAmount > 0
                    ? `${symbol}${fmt(computedCapAmount)}`
                    : <span className="font-normal text-muted-foreground">—</span>
                  }
                </p>
              </div>
            </div>
          )}

          {/* Terms */}
          <EditableTextDataField
            label="Terms" value={a.terms || ""} isEditing={true}
            onChange={(val) => onUpdate("terms", val)}
            onFocus={() => onFieldFocus?.(`allowance_${allowanceKey}_terms`)}
            onBlur={onFieldBlur} placeholder="Terms..."
          />

          {/* Payable In */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-normal uppercase tracking-wider text-muted-foreground">Payable In</p>
            <div className="flex items-center gap-6">
              {[
                { field: "payablePrep",  label: "PREP"  },
                { field: "payableShoot", label: "SHOOT" },
                { field: "payableWrap",  label: "WRAP"  },
              ].map(({ field, label: pLabel }) => (
                <EditableCheckboxField
                  key={field} label={pLabel} checked={!!a[field]}
                  onChange={(checked) => onUpdate(field, checked)} isEditing={true}
                />
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}