/**
 * bulkOfferUtils.js
 *
 * Shared constants, column definitions, defaultAllowances factory,
 * row factory, validation, and payload builder for BulkOfferCreate.
 *
 * UPDATED: Added schedule, salary/overtime calculated rates, special stipulations
 */

import { calculateRates, defaultEngineSettings } from "./rateCalculations";

// ─── Default allowance factory ────────────────────────────────────────────────
const mkAllow = (overrides = {}) => ({
  enabled: false,
  description: "",
  feePerWeek: "0.00",
  weeklyRate: "0.00",
  shootDayRate: "0.00",
  nonShootDayRate: "0.00",
  capCalculatedAs: "flat_figure",
  currency: "GBP",
  terms: "",
  payablePrep: false,
  payableShoot: true,
  payableWrap: false,
  budgetCode: "",
  tag: "",
  rateCap: "",
  ...overrides,
});

export const DEFAULT_ALLOWANCES = {
  boxRental: mkAllow({
    budgetCode: "823-58-001", tag: "BOX RENT",
    description: "Box Rental is reduced pro-rata on a 5 day/week basis, for weekly hires. Capped at 50% of Inventory.",
    feePerWeek: "400.00", rateCap: "£57,481.50 (50% of total value)",
    terms: "Box Rental is reduced pro-rata on a 5 day/week basis, for weekly hires. Capped at 50% of Inventory.",
    payablePrep: true, payableShoot: true, payableWrap: true,
  }),
  computer: mkAllow({
    budgetCode: "858-58-001", tag: "COMPUTER",
    description: "Computer rental is reduced pro-rata on a 5 day/week basis, for weekly hires",
    feePerWeek: "25.00", capCalculatedAs: "flat_figure", rateCap: "£250.00",
    terms: "Computer rental is reduced pro-rata on a 5 day/week basis, for weekly hires",
    payablePrep: true, payableShoot: true, payableWrap: true,
  }),
  software: mkAllow({
    budgetCode: "858-58-002", tag: "SOFTWARE",
    description: "Software subscription allowance for production-required tools",
    feePerWeek: "15.00", rateCap: "£150.00",
    terms: "Software allowance is reduced pro-rata on a 5 day/week basis, for weekly hires",
    payablePrep: true, payableShoot: true, payableWrap: false,
  }),
  equipment: mkAllow({
    budgetCode: "823-58-010", tag: "EQUIP",
    description: "Personal equipment rental for specialist tools required on production",
    feePerWeek: "75.00", rateCap: "£750.00",
    terms: "Equipment Rental is reduced pro-rata on a 5 day/week basis, for weekly hires",
    payablePrep: false, payableShoot: true, payableWrap: false,
  }),
  vehicle: mkAllow({
    budgetCode: "823-58-051", tag: "VEHICLE",
    feePerWeek: "150.00",
    terms: "Vehicle Rental is reduced pro-rata on a 5 day/week basis, for weekly hires.",
    payablePrep: true, payableShoot: true, payableWrap: true,
  }),
  mobile: mkAllow({
    budgetCode: "858-58-005", tag: "MOBILE",
    feePerWeek: "10.00", rateCap: "£100.00",
    terms: "Mobile allowance is flat rate per week",
    payablePrep: true, payableShoot: true, payableWrap: true,
  }),
  living: mkAllow({
    budgetCode: "823-58-030", tag: "LIVING", currency: "GBP",
    feePerWeek: "200.00", weeklyRate: "200.00", rateCap: "£2,000.00",
    terms: "Living allowance paid weekly for crew working 40+ miles from home address",
    payablePrep: true, payableShoot: true, payableWrap: true,
  }),
  perDiem1: mkAllow({
    budgetCode: "823-58-020", tag: "PER DIEM", currency: "GBP",
    shootDayRate: "50.00", nonShootDayRate: "25.00", rateCap: "£350.00",
    terms: "Payable per qualifying day on location. Non-shoot days at 50%.",
    payablePrep: false, payableShoot: true, payableWrap: false,
  }),
  perDiem2: mkAllow({
    budgetCode: "823-58-021", tag: "PER DIEM 2", currency: "USD",
    shootDayRate: "75.00", nonShootDayRate: "37.50", rateCap: "£525.00",
    terms: "Payable per qualifying day overseas. Subject to receipts.",
    payablePrep: false, payableShoot: true, payableWrap: false,
  }),
};

// ─── Default schedule factory ─────────────────────────────────────────────────
export const createDefaultSchedule = () => ({
  hiatus: [{ start: "", end: "", reason: "" }],
  prePrep: { start: "", end: "", notes: "" },
  blocks: [
    {
      name: "BLOCK 1",
      prep: { start: "", end: "", notes: "" },
      start: "",
      end: "",
      notes: "",
    },
  ],
  wrap: { start: "", end: "", notes: "" },
  totalDays: 0,
});

// ─── Column definitions ───────────────────────────────────────────────────────

const DEPARTMENTS = [
  "", "Accounts", "Action Vehicles", "Aerial", "Animals", "Animation", "Armoury", "Art",
  "Assets", "Assistant Directors", "Camera", "Cast", "Chaperones", "Choreography",
  "Clearances", "Computer Graphics", "Construction", "Continuity", "Costume",
  "Costume FX", "Covid Safety", "Creature Effects", "DIT", "Digital Assets",
  "Digital Playback", "Director", "Documentary", "Drapes", "EPK", "Editorial",
  "Electrical", "Electrical Rigging", "Franchise", "Greens", "Greenscreens", "Grip",
  "Hair and Makeup", "Health and Safety", "IT", "Locations", "Marine", "Medical",
  "Military", "Music", "Photography", "Picture Vehicles", "Post Production",
  "Production", "Prop Making", "Props", "Prosthetics", "Publicity", "Puppeteer",
  "Rigging", "SFX", "Script", "Script Editing", "Security", "Set Dec", "Sound",
  "Standby", "Storyboard", "Studio Unit", "Stunts", "Supporting Artist",
  "Sustainability", "Transport", "Tutors", "Underwater", "VFX", "Video", "Voice",
];

const ENGAGEMENT_TYPE_OPTIONS = [
  { value: "",          label: "— Select —" },
  { value: "loan_out",  label: "Loan Out" },
  { value: "paye",      label: "PAYE" },
  { value: "schd",      label: "SCHD" },
  { value: "long_form", label: "Long Form" },
];

const WORKING_WEEK_OPTIONS = [
  { value: "",    label: "— Select —" },
  { value: "5",   label: "5 days" },
  { value: "5.5", label: "5.5 days" },
  { value: "5_6", label: "5/6 days" },
  { value: "6",   label: "6 days" },
];

const CURRENCY_OPTIONS = ["GBP", "USD", "EUR", "AUD", "CAD", "NZD", "DKK", "ISK"];

const CATEGORY_OPTIONS = [
  { value: "",              label: "— Select —" },
  { value: "standard_crew", label: "Standard Crew" },
  { value: "senior_buyout", label: "Senior / Buyout" },
  { value: "construction",  label: "Construction" },
  { value: "electrical",    label: "Electrical" },
  { value: "hod",           label: "HOD" },
  { value: "rigging",       label: "Rigging" },
  { value: "transport",     label: "Transport" },
];

const OVERTIME_OPTIONS = [
  { value: "calculated", label: "Calculated" },
  { value: "custom",     label: "Custom" },
];

const ALT_CONTRACT_LABELS = {
  "":           "— None —",
  hod:          "HoD",
  no_contract:  "No Contract",
  senior:       "Senior Agreement",
};

const STATUS_DET_REASON_OPTIONS = [
  { value: "",          label: "— Select —" },
  { value: "hmrc_list", label: "HMRC List" },
  { value: "cest",      label: "CEST" },
  { value: "lorimer",   label: "Lorimer" },
  { value: "other",     label: "Other" },
];

export const COLUMNS = [
  // ── Frozen
  { key: "_select",  label: "",        width: 40,  frozen: true, type: "select"  },
  { key: "_actions", label: "",        width: 116, frozen: true, type: "actions" },
  { key: "_status",  label: "STATUS",  width: 110, frozen: true, type: "status"  },

  // ── Recipient
  { key: "recipient.fullName",        label: "FULL NAME",   width: 180, type: "text",     required: true, group: "recipient",  section: "Recipient" },
  { key: "recipient.email",           label: "EMAIL",       width: 200, type: "email",    required: true, group: "recipient",  section: "Recipient" },
  { key: "recipient.mobileNumber",    label: "MOBILE",      width: 130, type: "text",     group: "recipient", section: "Recipient" },
  { key: "representation.isViaAgent", label: "VIA AGENT",   width: 80,  type: "checkbox", group: "recipient", section: "Recipient" },
  { key: "representation.agentName",  label: "AGENT NAME",  width: 150, type: "text",     group: "recipient", section: "Recipient" },
  { key: "representation.agentEmail", label: "AGENT EMAIL", width: 170, type: "email",    group: "recipient", section: "Recipient" },

  // ── Alt Contract
  { key: "alternativeContract", label: "ALT CONTRACT", width: 140, type: "select",
    options: ["", "hod", "no_contract", "senior"].map(v => ({ value: v, label: ALT_CONTRACT_LABELS[v] })),
    group: "altcontract", section: "Alt. Contract" },

  // ── Unit & Dept
  { key: "unit",          label: "UNIT",       width: 120, type: "text",   group: "dept", section: "Unit & Dept" },
  { key: "department",    label: "DEPARTMENT", width: 160, type: "select",
    options: DEPARTMENTS.map(d => ({ value: d, label: d || "— Select —" })),
    group: "dept", section: "Unit & Dept" },
  { key: "subDepartment", label: "SUB-DEPT",   width: 130, type: "text",   group: "dept", section: "Unit & Dept" },

  // ── Role
  { key: "jobTitle",          label: "JOB TITLE",     width: 200, type: "text",     required: true, group: "role", section: "Role" },
  { key: "createOwnJobTitle", label: "CUSTOM TITLE?", width: 90,  type: "checkbox", group: "role",  section: "Role" },
  { key: "newJobTitle",       label: "CUSTOM TITLE",  width: 170, type: "text",     group: "role",  section: "Role" },
  { key: "jobTitleSuffix",    label: "SUFFIX",        width: 120, type: "text",     group: "role",  section: "Role" },

  // ── Tax Status
  { key: "taxStatus.allowSelfEmployed",              label: "SELF-EMP",      width: 100, type: "select",
    options: [{ value: "", label: "—" }, { value: "yes", label: "Yes" }, { value: "no", label: "No" }],
    group: "tax", section: "Tax Status" },
  { key: "taxStatus.statusDeterminationReason",      label: "STATUS REASON", width: 120, type: "select",
    options: STATUS_DET_REASON_OPTIONS, group: "tax", section: "Tax Status" },
  { key: "taxStatus.otherStatusDeterminationReason", label: "OTHER REASON",  width: 160, type: "text",
    group: "tax", section: "Tax Status" },

  // ── Place of Work
  { key: "regularSiteOfWork", label: "SITE OF WORK",  width: 120, type: "select",
    options: [{ value: "", label: "—" }, { value: "on_set", label: "On Set" }, { value: "off_set", label: "Off Set" }],
    group: "place", section: "Place of Work" },
  { key: "workingInUK",       label: "WORKING IN UK", width: 100, type: "select",
    options: [{ value: "yes", label: "Yes" }, { value: "never", label: "Never" }],
    group: "place", section: "Place of Work" },

  // ── Engagement
  { key: "categoryId",    label: "CATEGORY",     width: 150, type: "select", options: CATEGORY_OPTIONS, required: true, group: "engagement", section: "Engagement" },
  { key: "startDate",     label: "START DATE",   width: 130, type: "date",   required: true, group: "engagement", section: "Engagement" },
  { key: "endDate",       label: "END DATE",     width: 130, type: "date",   group: "engagement", section: "Engagement" },
  { key: "dailyOrWeekly", label: "DAILY/WEEKLY", width: 105, type: "select",
    options: [{ value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }],
    group: "engagement", section: "Engagement" },
  { key: "engagementType", label: "ENGAGEMENT",  width: 130, type: "select", options: ENGAGEMENT_TYPE_OPTIONS, group: "engagement", section: "Engagement" },
  { key: "workingWeek",   label: "WORK WEEK",    width: 110, type: "select", options: WORKING_WEEK_OPTIONS,    group: "engagement", section: "Engagement" },

  // ── Rates
  { key: "currency",     label: "CURR",          width: 80,  type: "select",
    options: CURRENCY_OPTIONS.map(c => ({ value: c, label: c })), group: "rates", section: "Rates" },
  { key: "feePerDay",    label: "FEE / DAY",     width: 110, type: "number", required: true, group: "rates", section: "Rates" },
  { key: "workingHours", label: "STD HRS / DAY", width: 105, type: "number", group: "rates", section: "Rates" },
  { key: "overtime",     label: "OVERTIME",      width: 110, type: "select", options: OVERTIME_OPTIONS, group: "rates", section: "Rates" },
  { key: "otherOT",      label: "OTHER O/T",     width: 95,  type: "number", group: "rates", section: "Rates" },
  { key: "cameraOTSWD",  label: "CAM SWD",       width: 90,  type: "number", group: "rates", section: "Rates" },
  { key: "cameraOTSCWD", label: "CAM SCWD",      width: 90,  type: "number", group: "rates", section: "Rates" },
  { key: "cameraOTCWD",  label: "CAM CWD",       width: 90,  type: "number", group: "rates", section: "Rates" },

  // ── Salary & Overtime (calculated preview panel)
  { key: "_rates", label: "SALARY / OT RATES", width: 170, type: "rates_preview", group: "rates_table", section: "Salary & OT" },

  // ── Schedule (panel)
  { key: "_schedule", label: "SCHEDULE", width: 140, type: "schedule_preview", group: "schedule", section: "Schedule" },

  // ── Allowances (panel)
  { key: "_allowances", label: "ALLOWANCES", width: 160, type: "allowances_preview", group: "allowances", section: "Allowances" },

  // ── Special Stipulations (panel)
  { key: "_stipulations", label: "STIPULATIONS", width: 130, type: "stipulations_preview", group: "stipulations", section: "Stipulations" },

  // ── Notes
  { key: "notes.otherDealProvisions", label: "OTHER PROVISIONS", width: 220, type: "text", group: "notes", section: "Notes" },
  { key: "notes.additionalNotes",     label: "INTERNAL NOTES",   width: 220, type: "text", group: "notes", section: "Notes" },
];

// ─── Deep get/set helpers ─────────────────────────────────────────────────────

export function deepGet(obj, path) {
  return path.split(".").reduce((acc, k) => acc?.[k], obj);
}

export function deepSet(obj, path, value) {
  const keys  = path.split(".");
  const clone = { ...obj };
  let cur     = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...cur[keys[i]] };
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return clone;
}

// ─── Empty row factory ────────────────────────────────────────────────────────

export function createEmptyRow(prev = null, copySettings = true) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const freshAllowances = Object.fromEntries(
    Object.entries(DEFAULT_ALLOWANCES).map(([k, v]) => [k, { ...v, key: k, enabled: false }])
  );

  const base = {
    id,
    recipient: { fullName: "", email: "", mobileNumber: "" },
    representation: { isViaAgent: false, agentName: "", agentEmail: "" },
    alternativeContract: "",
    unit: "", department: "", subDepartment: "",
    jobTitle: "", createOwnJobTitle: false, newJobTitle: "", jobTitleSuffix: "",
    taxStatus: {
      allowSelfEmployed: "",
      statusDeterminationReason: "hmrc_list",
      otherStatusDeterminationReason: "",
    },
    regularSiteOfWork: "on_set",
    workingInUK: "yes",
    categoryId: "",
    startDate: "", endDate: "",
    dailyOrWeekly: "daily",
    engagementType: "paye",
    workingWeek: "5",
    currency: "GBP",
    feePerDay: "",
    workingHours: 11,
    overtime: "calculated",
    otherOT: "", cameraOTSWD: "", cameraOTSCWD: "", cameraOTCWD: "",
    // Salary & overtime budget codes/tags (mirrors ContractForm)
    salaryBudgetCodes: [],
    salaryTags: [],
    overtimeBudgetCodes: [],
    overtimeTags: [],
    // Calculated rates (auto-updated when feePerDay changes)
    calculatedRates: { salary: [], overtime: [] },
    // Schedule (full structure matching ContractForm)
    schedule: createDefaultSchedule(),
    allowances: freshAllowances,
    notes: { otherDealProvisions: "", additionalNotes: "" },
    specialStipulations: [],
    _selected: false,
  };

  if (prev && copySettings) {
    base.department     = prev.department;
    base.unit           = prev.unit;
    base.engagementType = prev.engagementType;
    base.workingWeek    = prev.workingWeek;
    base.dailyOrWeekly  = prev.dailyOrWeekly;
    base.currency       = prev.currency;
    base.overtime       = prev.overtime;
    base.workingHours   = prev.workingHours;
    base.categoryId     = prev.categoryId;
  }

  return base;
}

// ─── Recalculate rates for a row (call whenever feePerDay or workingHours changes) ──

export function recalcRowRates(row) {
  const fee = parseFloat(row.feePerDay) || 0;
  const settings = {
    ...defaultEngineSettings,
    standardHoursPerDay: row.workingHours ?? 11,
  };
  const calculatedRates = calculateRates(fee, settings);
  return { ...row, calculatedRates };
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateRow(row) {
  const errors = [];
  if (!row.recipient?.fullName?.trim())
    errors.push("Full name required");
  if (!row.recipient?.email?.trim())
    errors.push("Email required");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.recipient.email.trim()))
    errors.push("Invalid email");
  if (!row.startDate)
    errors.push("Start date required");
  if (!row.feePerDay && row.feePerDay !== 0)
    errors.push("Fee/day required");
  if (!row.categoryId)
    errors.push("Category required");
  return { valid: errors.length === 0, errors };
}

// ─── API payload builder ──────────────────────────────────────────────────────

export function buildPayload(row, studioId, projectId) {
  const allowancesArr = Object.entries(row.allowances)
    .filter(([, a]) => a.enabled)
    .map(([key, a]) => ({ key, ...a }));

  return {
    studioId,
    projectId,
    saveAsDraft: true,
    recipient: {
      fullName:     row.recipient.fullName     || "",
      email:        row.recipient.email        || "",
      mobileNumber: row.recipient.mobileNumber || undefined,
    },
    representation: {
      isViaAgent: !!row.representation.isViaAgent,
      agentName:  row.representation.agentName  || undefined,
      agentEmail: row.representation.agentEmail || undefined,
    },
    alternativeContract: row.alternativeContract || "",
    unit:          row.unit          || "",
    department:    row.department    || "",
    subDepartment: row.subDepartment || "",
    jobTitle:          row.jobTitle          || "",
    newJobTitle:       row.newJobTitle       || "",
    createOwnJobTitle: !!row.createOwnJobTitle,
    jobTitleSuffix:    row.jobTitleSuffix    || "",
    taxStatus: {
      allowSelfEmployed:              row.taxStatus.allowSelfEmployed              || "",
      statusDeterminationReason:      row.taxStatus.statusDeterminationReason      || "",
      otherStatusDeterminationReason: row.taxStatus.otherStatusDeterminationReason || "",
    },
    regularSiteOfWork: row.regularSiteOfWork || "",
    workingInUK:       row.workingInUK       || "yes",
    startDate:      row.startDate      || "",
    endDate:        row.endDate        || "",
    dailyOrWeekly:  row.dailyOrWeekly  || "daily",
    engagementType: row.engagementType || "paye",
    workingWeek:    row.workingWeek    || "5",
    categoryId:     row.categoryId     || undefined,
    currency:    row.currency    || "GBP",
    feePerDay:   row.feePerDay   || "",
    workingHours: row.workingHours ?? 11,
    overtime:    row.overtime    || "calculated",
    otherOT:     row.otherOT     || "",
    cameraOTSWD: row.cameraOTSWD || "",
    cameraOTSCWD:row.cameraOTSCWD|| "",
    cameraOTCWD: row.cameraOTCWD || "",
    schedule:    row.schedule    || createDefaultSchedule(),
    calculatedRates: row.calculatedRates || { salary: [], overtime: [] },
    salaryBudgetCodes:   row.salaryBudgetCodes   || [],
    salaryTags:          row.salaryTags          || [],
    overtimeBudgetCodes: row.overtimeBudgetCodes || [],
    overtimeTags:        row.overtimeTags        || [],
    allowances: allowancesArr,
    specialStipulations: (row.specialStipulations || []).filter(s => s.body?.trim()),
    notes: {
      otherDealProvisions: row.notes.otherDealProvisions || "",
      additionalNotes:     row.notes.additionalNotes     || "",
    },
  };
}