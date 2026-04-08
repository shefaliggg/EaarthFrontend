// ── Default allowance factory ──────────────────────────────────────────────
//
// CHANGES:
//   • capType now supports "flat" | "percentage" | "na"
//     – "percentage" valid for boxRental, software, and equipment (category totals)
//     – "na" for computer, vehicle, mobile, living (no cap applied)
//   • calculateAllowance now accepts `categoryTotal` (per-allowance category sum)
//     instead of the old global `totalProductValue`
//   • Per-diem allowances remain in defaults but are excluded from UI per previous spec
//
export const defaultAllowance = (overrides = {}) => ({
  enabled: false,
  description: "",

  // ✅ Unified payment fields
  amount: "0.00",
  paymentType: "weekly",     // "daily" | "weekly" | "monthly" | "yearly"

  // ✅ Cap fields
  capType: "flat",           // "flat" | "percentage" | "na"
  rateCap: "£0.00",          // used when capType === "flat"
  capPercentage: 0,          // 0–100, used when capType === "percentage"

  currency: "GBP",
  terms: "",

  payablePrep: false,
  payableShoot: true,
  payableWrap: false,

  budgetCode: "",
  tag: "",

  ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// Calculation helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * calculateAllowance
 *
 * @param {object} al               – allowance object (from defaultAllowance)
 * @param {number} days             – total working days on engagement
 * @param {number} weekValue        – total weeks (can be fractional, e.g. 4.6)
 * @param {number} months           – total months
 * @param {number} years            – total years
 * @param {number} categoryTotal    – sum of (quantity × amount) for THIS allowance's
 *                                    category (box / software / equipment).
 *                                    Pass 0 for allowances that don't support % caps.
 * @returns {number}
 */
export function calculateAllowance({
  al,
  days = 0,
  weekValue = 0,
  months = 0,
  years = 0,
  categoryTotal = 0,
}) {
  const amount = parseFloat(al.amount || 0);
  let value = 0;

  // ── Step 1: Calculate raw value based on payment type ────────────────────
  switch (al.paymentType) {
    case "daily":   value = amount * days;       break;
    case "weekly":  value = amount * weekValue;  break;
    case "monthly": value = amount * months;     break;
    case "yearly":  value = amount * years;      break;
    default:        value = amount * weekValue;  break;
  }

  // ── Step 2: Apply cap ─────────────────────────────────────────────────────
  if (al.capType === "percentage" && categoryTotal > 0) {
    // Percentage cap — uses the category-specific total (box / software / equipment)
    const cap = (categoryTotal * (al.capPercentage || 0)) / 100;
    value = Math.min(value, cap);
  } else if (al.capType === "flat") {
    // Flat cap (default)
    const capNum = parseFloat(String(al.rateCap || "").replace(/[^\d.]/g, ""));
    if (!isNaN(capNum) && capNum > 0) {
      value = Math.min(value, capNum);
    }
  }
  // capType === "na" → no cap applied, value returned as-is

  return value;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: resolve category total for a given allowance key
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getCategoryTotalForKey
 *
 * Maps an allowance key to the correct category bucket from categoryTotals.
 *
 * @param {string} key            – allowance key e.g. "boxRental"
 * @param {object} categoryTotals – { box: number, software: number, equipment: number }
 * @returns {number}
 */
export function getCategoryTotalForKey(key, categoryTotals = {}) {
  if (key === "boxRental")  return categoryTotals.box       ?? 0;
  if (key === "software")   return categoryTotals.software  ?? 0;
  if (key === "equipment")  return categoryTotals.equipment ?? 0;
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: compute display cap amount for timesheet column
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getCapAmountDisplay
 *
 * Returns a human-readable cap amount string for timesheet/summary tables.
 *
 * @param {string} allowanceKey
 * @param {object} al             – allowance object
 * @param {object} categoryTotals – { box, software, equipment }
 * @param {string} currencySymbol – e.g. "£"
 * @returns {string}              – e.g. "£5,000.00" | "N/A" | "—"
 */
export function getCapAmountDisplay(allowanceKey, al, categoryTotals = {}, currencySymbol = "£") {
  if (al.capType === "na") return "N/A";

  if (al.capType === "percentage") {
    const total = getCategoryTotalForKey(allowanceKey, categoryTotals);
    if (!total) return "—";
    const cap = (total * (al.capPercentage || 0)) / 100;
    return `${currencySymbol}${cap.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // flat
  const capNum = parseFloat(String(al.rateCap || "").replace(/[^\d.]/g, ""));
  if (isNaN(capNum) || capNum === 0) return "—";
  return `${currencySymbol}${capNum.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default allowance presets
// ─────────────────────────────────────────────────────────────────────────────

export const defaultAllowances = {

  // ── Box Rental ─ percentage cap (% of box category total) ────────────────
  boxRental: defaultAllowance({
    enabled: false,
    budgetCode: "823-58-001",
    tag: "BOX RENT",
    description: "Box Rental is reduced pro-rata on a 5 day/week basis, for weekly hires.",
    amount: "400.00",
    paymentType: "weekly",
    capType: "percentage",
    capPercentage: 50,
    rateCap: "£0.00",
    terms: "Box Rental is reduced pro-rata on a 5 day/week basis, for weekly hires. Capped at 50% of Box Inventory.",
    payablePrep: true,
    payableShoot: true,
    payableWrap: true,
  }),

  // ── Computer ─ N/A cap (no cap applied) ──────────────────────────────────
  computer: defaultAllowance({
    enabled: false,
    budgetCode: "858-58-001",
    tag: "COMPUTER",
    description: "Computer rental is reduced pro-rata on a 5 day/week basis, for weekly hires.",
    amount: "25.00",
    paymentType: "weekly",
    capType: "na",
    rateCap: "£250.00",
    terms: "Computer rental is reduced pro-rata on a 5 day/week basis, for weekly hires.",
    payablePrep: true,
    payableShoot: true,
    payableWrap: true,
  }),

  // ── Software ─ percentage cap (% of software category total) ─────────────
  software: defaultAllowance({
    enabled: false,
    budgetCode: "858-58-002",
    tag: "SOFTWARE",
    description: "Software subscription allowance for production-required tools.",
    amount: "15.00",
    paymentType: "weekly",
    capType: "percentage",
    capPercentage: 50,
    rateCap: "£0.00",
    terms: "Software allowance is reduced pro-rata on a 5 day/week basis, for weekly hires.",
    payablePrep: true,
    payableShoot: true,
    payableWrap: false,
  }),

  // ── Equipment ─ percentage cap (% of equipment category total) ───────────
  equipment: defaultAllowance({
    enabled: false,
    budgetCode: "823-58-010",
    tag: "EQUIP",
    description: "Personal equipment rental for specialist tools required on production.",
    amount: "75.00",
    paymentType: "weekly",
    capType: "percentage",
    capPercentage: 50,
    rateCap: "£0.00",
    terms: "Equipment Rental is reduced pro-rata on a 5 day/week basis, for weekly hires.",
    payablePrep: false,
    payableShoot: true,
    payableWrap: false,
  }),

  // ── Vehicle ─ N/A cap ─────────────────────────────────────────────────────
  vehicle: defaultAllowance({
    enabled: false,
    budgetCode: "823-58-051",
    tag: "VEHICLE",
    description: "",
    amount: "150.00",
    paymentType: "weekly",
    capType: "na",
    rateCap: "£0.00",
    terms: "Vehicle Rental is reduced pro-rata on a 5 day/week basis, for weekly hires.",
    payablePrep: true,
    payableShoot: true,
    payableWrap: true,
  }),

  // ── Mobile ─ N/A cap ──────────────────────────────────────────────────────
  mobile: defaultAllowance({
    enabled: false,
    budgetCode: "858-58-005",
    tag: "MOBILE",
    description: "",
    amount: "10.00",
    paymentType: "weekly",
    capType: "na",
    rateCap: "£100.00",
    terms: "Mobile allowance is flat rate per week.",
    payablePrep: true,
    payableShoot: true,
    payableWrap: true,
  }),

  // ── Living ─ N/A cap ──────────────────────────────────────────────────────
  living: defaultAllowance({
    enabled: false,
    budgetCode: "823-58-030",
    tag: "LIVING",
    currency: "GBP",
    description: "Living allowance for crew based away from home.",
    amount: "200.00",
    paymentType: "weekly",
    capType: "na",
    rateCap: "£2,000.00",
    terms: "Living allowance paid weekly for crew working 40+ miles from home address.",
    payablePrep: true,
    payableShoot: true,
    payableWrap: true,
  }),

  // ── Per Diem 1 ─ flat cap (UI hidden but kept in defaults) ───────────────
  perDiem1: defaultAllowance({
    enabled: false,
    budgetCode: "823-58-020",
    tag: "PER DIEM",
    currency: "GBP",
    description: "Per Diem — UK location shoot days.",
    amount: "50.00",
    paymentType: "daily",
    capType: "flat",
    rateCap: "£350.00",
    terms: "Payable per qualifying day on location. Non-shoot days at 50%.",
    payablePrep: false,
    payableShoot: true,
    payableWrap: false,
  }),

  // ── Per Diem 2 ─ flat cap (UI hidden but kept in defaults) ───────────────
  perDiem2: defaultAllowance({
    enabled: false,
    budgetCode: "823-58-021",
    tag: "PER DIEM 2",
    currency: "USD",
    description: "Per Diem — overseas location.",
    amount: "75.00",
    paymentType: "daily",
    capType: "flat",
    rateCap: "£525.00",
    terms: "Payable per qualifying day overseas. Subject to receipts.",
    payablePrep: false,
    payableShoot: true,
    payableWrap: false,
  }),
};