// ─── Constants ────────────────────────────────────────────────────────────────

export const DEPARTMENTS = [
  "ACCOUNTS","ACTION VEHICLES","AERIAL","ANIMALS","ANIMATION","ARMOURY","ART",
  "ASSETS","ASSISTANT DIRECTORS","CAMERA","CAST","CHAPERONES","CHOREOGRAPHY",
  "CLEARANCES","COMPUTER GRAPHICS","CONSTRUCTION","CONTINUITY","COSTUME",
  "COSTUME FX","COVID SAFETY","CREATURE EFFECTS","DIT","DIGITAL ASSETS",
  "DIGITAL PLAYBACK","DIRECTOR","DOCUMENTARY","DRAPES","EPK","EDITORIAL",
  "ELECTRICAL","ELECTRICAL RIGGING","FRANCHISE","GREENS","GREENSCREENS","GRIP",
  "HAIR AND MAKEUP","HEALTH AND SAFETY","IT","LOCATIONS","MARINE","MEDICAL",
  "MILITARY","MUSIC","PHOTOGRAPHY","PICTURE VEHICLES","POST PRODUCTION",
  "PRODUCTION","PROP MAKING","PROPS","PROSTHETICS","PUBLICITY","PUPPETEER",
  "RIGGING","SFX","SCRIPT","SCRIPT EDITING","SECURITY","SET DEC","SOUND",
  "STANDBY","STORYBOARD","STUDIO UNIT","STUNTS","SUPPORTING ARTIST",
  "SUSTAINABILITY","TRANSPORT","TUTORS","UNDERWATER","VFX","VIDEO","VOICE",
];

export const CONTRACT_OPTIONS = [
  { value: "", label: "SELECT AN OPTION" },
  { value: "HOD", label: "HOD" },
  { value: "NO_CONTRACT", label: "NO CONTRACT (ALL OTHER DOCUMENTS TO BE PROCESSED)" },
  { value: "SENIOR_AGREEMENT", label: "SENIOR AGREEMENT" },
];

export const STATUS_REASONS = [
  { value: "", label: "SELECT AN OPTION" },
  { value: "HMRC_LIST", label: "HMRC LIST OF 'ROLES NORMALLY TREATED AS SELF-EMPLOYED'" },
  { value: "CEST_ASSESSMENT", label: "CEST ASSESSMENT CONFIRMED 'OFF-PAYROLL WORKING RULES DO NOT APPLY'" },
  { value: "LORIMER_LETTER", label: "YOU HAVE SUPPLIED A VALID LORIMER LETTER" },
  { value: "OTHER", label: "OTHER" },
];

export const ENGAGEMENT_TYPES = [
  { value: "", label: "SELECT ENGAGEMENT TYPE" },
  { value: "LOAN_OUT", label: "LOAN OUT" },
  { value: "PAYE", label: "PAYE" },
  { value: "SCHD", label: "SCHD (DAILY/WEEKLY)" },
  { value: "LONG_FORM", label: "LONG FORM" },
];

export const RATE_TYPES = [
  { value: "DAILY", label: "DAILY" },
  { value: "WEEKLY", label: "WEEKLY" },
];

export const CAP_TYPES = [
  { value: "", label: "SELECT CAP TYPE" },
  { value: "FLAT", label: "FLAT FIGURE" },
  { value: "PERCENTAGE", label: "PERCENTAGE OF INVENTORY" },
  { value: "NO_CAP", label: "NO CAP" },
];

export const CURRENCIES = [
  { value: "GBP", label: "GBP (£)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
];

export const SPECIAL_DAY_TYPES = [
  { key: "SIXTH_DAY", label: "6th Day" },
  { key: "SEVENTH_DAY", label: "7th Day" },
  { key: "PUBLIC_HOLIDAY", label: "Public Holiday" },
  { key: "TRAVEL_DAY", label: "Travel Day" },
  { key: "TURNAROUND", label: "Turnaround" },
];

// Bundle config: rateType_engagementType → template list
export const BUNDLE_CONFIG = {
  "DAILY_PAYE":       ["Daily PAYE Contract", "Box Rental Form", "Policy Acknowledgement", "Crew Information Form"],
  "DAILY_LOAN_OUT":   ["Daily Loan Out Agreement", "Box Rental Form", "Loan Out Declaration"],
  "WEEKLY_PAYE":      ["Weekly PAYE Contract", "Policy Acknowledgement", "Crew Information Form"],
  "WEEKLY_LOAN_OUT":  ["Weekly Loan Out Agreement", "Loan Out Declaration"],
  "DAILY_SCHD":       ["SCHD Daily Rate Card", "Crew Information Form"],
  "WEEKLY_SCHD":      ["SCHD Weekly Rate Card", "Crew Information Form"],
  "DAILY_LONG_FORM":  ["Long Form Daily Agreement", "Box Rental Form", "Policy Acknowledgement"],
  "WEEKLY_LONG_FORM": ["Long Form Weekly Agreement", "Policy Acknowledgement"],
};

// ─── Utilities ────────────────────────────────────────────────────────────────

export const cn = (...cls) => cls.filter(Boolean).join(" ");

export const getCurrencySymbol = (c) => ({ GBP: "£", USD: "$", EUR: "€" }[c] || "£");

export const getBundleForms = (rateType, engagementType) => {
  if (!rateType || !engagementType) return null;
  return BUNDLE_CONFIG[`${rateType}_${engagementType}`] ?? null;
};

// ─── Default State Factories ──────────────────────────────────────────────────

export const getDefaultAllowances = () => ({
  boxRental: false, boxRentalTag: "", boxRentalDescription: "", boxRentalFeePerWeek: "",
  boxRentalCapCalculatedAs: "", boxRentalCap: "", boxRentalCapPercentage: "",
  boxRentalTerms: "", boxRentalBudgetCode: "",
  boxRentalPayableInPrep: false, boxRentalPayableInShoot: true, boxRentalPayableInWrap: false,

  computerAllowance: false, computerAllowanceTag: "", computerAllowanceFeePerWeek: "",
  computerAllowanceCapCalculatedAs: "", computerAllowanceCap: "",
  computerAllowanceTerms: "", computerAllowanceBudgetCode: "",
  computerAllowancePayableInPrep: false, computerAllowancePayableInShoot: true, computerAllowancePayableInWrap: false,

  softwareAllowance: false, softwareAllowanceTag: "", softwareAllowanceDescription: "",
  softwareAllowanceFeePerWeek: "", softwareAllowanceTerms: "", softwareAllowanceBudgetCode: "",
  softwareAllowancePayableInPrep: false, softwareAllowancePayableInShoot: true, softwareAllowancePayableInWrap: false,

  equipmentRental: false, equipmentRentalTag: "", equipmentRentalDescription: "",
  equipmentRentalFeePerWeek: "", equipmentRentalTerms: "", equipmentRentalBudgetCode: "",
  equipmentRentalPayableInPrep: false, equipmentRentalPayableInShoot: true, equipmentRentalPayableInWrap: false,

  mobilePhoneAllowance: false, mobilePhoneAllowanceTag: "", mobilePhoneAllowanceFeePerWeek: "",
  mobilePhoneAllowanceTerms: "", mobilePhoneAllowanceBudgetCode: "",
  mobilePhoneAllowancePayableInPrep: false, mobilePhoneAllowancePayableInShoot: true, mobilePhoneAllowancePayableInWrap: false,

  vehicleAllowance: false, vehicleAllowanceTag: "", vehicleAllowanceFeePerWeek: "",
  vehicleAllowanceTerms: "", vehicleAllowanceBudgetCode: "",
  vehicleAllowancePayableInPrep: false, vehicleAllowancePayableInShoot: true, vehicleAllowancePayableInWrap: false,

  vehicleHire: false, vehicleHireTag: "", vehicleHireRate: "",
  vehicleHireTerms: "", vehicleHireBudgetCode: "",
  vehicleHirePayableInPrep: false, vehicleHirePayableInShoot: true, vehicleHirePayableInWrap: false,

  perDiem1: false, perDiem1Tag: "", perDiem1Currency: "GBP", perDiem1ShootDayRate: "",
  perDiem1NonShootDayRate: "", perDiem1Terms: "", perDiem1BudgetCode: "",
  perDiem1PayableInPrep: false, perDiem1PayableInShoot: true, perDiem1PayableInWrap: false,

  perDiem2: false, perDiem2Tag: "", perDiem2Currency: "USD", perDiem2ShootDayRate: "",
  perDiem2NonShootDayRate: "", perDiem2Terms: "", perDiem2BudgetCode: "",
  perDiem2PayableInPrep: false, perDiem2PayableInShoot: true, perDiem2PayableInWrap: false,

  livingAllowance: false, livingAllowanceTag: "", livingAllowanceCurrency: "GBP",
  livingAllowanceDailyRate: "", livingAllowanceWeeklyRate: "",
  livingAllowanceTerms: "", livingAllowanceBudgetCode: "",
  livingAllowancePayableInPrep: false, livingAllowancePayableInShoot: true, livingAllowancePayableInWrap: false,
});

export const createDefaultRole = (index) => ({
  id: Date.now().toString() + index,
  isPrimaryRole: index === 0,
  roleName: `ROLE ${index + 1}`,
  jobTitle: "", jobTitleSuffix: "",
  searchAllDepartments: false, createOwnJobTitle: false,
  unit: "", department: "", subDepartment: "", regularSiteOfWork: "",
  engagementType: "", rateType: "DAILY", currency: "GBP",
  feePerDay: "", feePerWeek: "",
  startDate: "", endDate: "", workingWeek: "",
  workingInUnitedKingdom: "YES", budgetCode: "",
  allowances: getDefaultAllowances(),
  specialDayRates: SPECIAL_DAY_TYPES.map((d) => ({ type: d.key, amount: "", unit: "DAILY" })),
});

export const createDefaultFormData = () => ({
  fullName: "", emailAddress: "", mobileNumber: "",
  isViaAgent: false, agentName: "", agentEmailAddress: "",
  alternativeContractType: "",
  allowAsSelfEmployedOrLoanOut: "",
  statusDeterminationReason: "", otherStatusDeterminationReason: "",
  otherDealProvisions: "", additionalNotes: "", isLivingInUk: true,
});