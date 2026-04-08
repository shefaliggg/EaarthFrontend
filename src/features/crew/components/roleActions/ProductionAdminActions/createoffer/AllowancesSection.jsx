// sections/AllowancesSection.jsx
import { Package, Monitor, Code, Wrench, Car, Smartphone, Home } from "lucide-react";
import { AllowanceRow } from "../createoffer/FeeStructure/AllowanceRow";

// ─── Config ───────────────────────────────────────────────────────────────────

const ALLOWANCE_CONFIG = [
  { key: "boxRental",  label: "BOX RENTAL",             icon: Package,    hasDescription: true  },
  { key: "computer",   label: "COMPUTER ALLOWANCE",     icon: Monitor,    hasDescription: false },
  { key: "software",   label: "SOFTWARE ALLOWANCE",     icon: Code,       hasDescription: true  },
  { key: "equipment",  label: "EQUIPMENT RENTAL",       icon: Wrench,     hasDescription: true  },
  { key: "vehicle",    label: "VEHICLE ALLOWANCE",      icon: Car,        hasDescription: false },
  { key: "mobile",     label: "MOBILE PHONE ALLOWANCE", icon: Smartphone, hasDescription: false },
  { key: "living",     label: "LIVING ALLOWANCE",       icon: Home,       hasDescription: false },
];

// ─── Key → bucket mapping ─────────────────────────────────────────────────────
// categoryTotals from parent uses { box, software, equipment }.
// "boxRental" key must map to .box — this function does that translation.
// When backend is ready, categoryTotals will be populated from real data.

function resolveCategoryTotal(key, categoryTotals = {}) {
  if (key === "boxRental")  return categoryTotals.box       ?? 0;
  if (key === "software")   return categoryTotals.software  ?? 0;
  if (key === "equipment")  return categoryTotals.equipment ?? 0;
  return 0;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AllowancesSection({
  allowances,
  setAllowances,
  onFieldFocus,
  onFieldBlur,
  currencySymbol: cs,
  // ✅ TEMP: when no real data exists, fall back to mock totals so UI works now.
  // Replace these mock values once backend/profile data is wired up.
  categoryTotals = {
    box:       120000,   // mock: total value of all box items
    software:   80000,   // mock: total value of all software items
    equipment:  60000,   // mock: total value of all equipment items
  },
}) {
  const hasCategoryTotals =
    categoryTotals.box > 0 ||
    categoryTotals.software > 0 ||
    categoryTotals.equipment > 0;

  const updateAllowance = (key, field, value) => {
    // Don't uppercase free-text or enum fields — only code/tag identifiers
    const shouldUppercase =
      typeof value === "string" &&
      field !== "capType" &&
      field !== "paymentType" &&
      field !== "description" &&
      field !== "terms";

    const v = shouldUppercase ? value.toUpperCase() : value;
    setAllowances((prev) => ({ ...prev, [key]: { ...prev[key], [field]: v } }));
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Enable allowances below. Set the amount, how often it's paid, and the cap.
      </p>

      {/* Category totals summary banner */}
      {hasCategoryTotals && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 space-y-1">
          <p className="text-[10px] font-semibold text-primary uppercase tracking-wide">
            Category totals
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Box",       value: categoryTotals.box       },
              { label: "Software",  value: categoryTotals.software  },
              { label: "Equipment", value: categoryTotals.equipment },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-0.5">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-xs font-bold text-foreground tabular-nums">
                  {value > 0 ? `${cs}${value.toLocaleString("en-GB")}` : "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {ALLOWANCE_CONFIG.map(({ key, label, icon, hasDescription }) => (
          <AllowanceRow
            key={key}
            allowanceKey={key}
            label={label}
            icon={icon}
            hasDescription={hasDescription}
            allowanceData={allowances[key] || {}}
            onUpdate={(field, value) => updateAllowance(key, field, value)}
            onFieldFocus={onFieldFocus}
            onFieldBlur={onFieldBlur}
            currencySymbol={cs}
            // ✅ Resolved to a single number — no key mismatch possible
            categoryTotal={resolveCategoryTotal(key, categoryTotals)}
          />
        ))}
      </div>
    </div>
  );
}