import { createContext, useContext, useState } from "react";
import { defaultEngineSettings } from "../../../../utils/rateCalculations";
import { defaultAllowances } from "../../../../utils/Defaultallowance";

// ── Default contract data ──────────────────────────────────────────────────
// workingHours lives HERE (rates level), NOT in schedule.
// subDepartment is a plain string typed by production per project.
export const defaultContractData = {
  // ── Recipient
  recipient: {
    fullName: "",
    email: "",
    mobileNumber: "",
    userId: null,
  },

  // ── Representation
  representation: {
    isViaAgent: false,
    agentName: "",
    agentEmail: "",
    agencyId: null,
  },

  // ── Alternative Contract
  alternativeContract: "",

  // ── Unit and Department
  // unit          → plain string (e.g. "MAIN UNIT", "SECOND UNIT")
  // department    → display name from global list (e.g. "Camera", "Art")
  // subDepartment → plain string, manually typed per project (e.g. "Drone Operator")
  unit: "",
  department: "",
  subDepartment: "",

  // ── Role
  jobTitle: "",
  searchAllDepartments: false,
  createOwnJobTitle: false,
  newJobTitle: "",
  jobTitleSuffix: "",

  // ── Tax Status
  taxStatus: {
    allowSelfEmployed: "",
    statusDeterminationReason: "",
    otherStatusDeterminationReason: "",
  },

  // ── Place of Work
  regularSiteOfWork: "",
  workingInUK: "yes",

  // ── Engagement
  categoryId: "",
  startDate: "",
  endDate: "",
  dailyOrWeekly: "daily",
  engagementType: "paye",
  workingWeek: "5",

  // ── Rates
  currency: "GBP",
  feePerDay: "",

  // workingHours = standard hours/day = overtime threshold.
  // This is a RATE field, not a schedule field.
  // Stored here so it goes to the backend as part of the offer payload.
  workingHours: 11,

  overtime: "calculated",
  otherOT: "",
  cameraOTSWD: "",
  cameraOTSCWD: "",
  cameraOTCWD: "",

  // ── Special Stipulations
  // Free-text legal clauses that override Standard Terms and Conditions.
  // Each entry: { title: string (optional), body: string (required) }
  specialStipulations: [],

  // ── Notes
  notes: {
    otherDealProvisions: "",
    additionalNotes: "",
  },
};

// ── Default schedule — NO workingHours here ────────────────────────────────
// workingHours was removed from schedule and moved to contractData (rates level).
export const defaultSchedule = {
  hiatus: [],
  prePrep: { start: "", end: "", notes: "" },
  blocks: [],
  wrap: { start: "", end: "", notes: "" },
  totalDays: 0,
};

// ── Default offer factory ──────────────────────────────────────────────────
function createOffer(id, overrides = {}) {
  return {
    id,
    offerCode: null,
    version: 1,
    status: "draft",
    contractData: { ...defaultContractData },
    schedule: { ...defaultSchedule },
    engineSettings: { ...defaultEngineSettings },
    salaryBudgetCodes: [],
    salaryTags: [],
    overtimeBudgetCodes: [],
    overtimeTags: [],
    allowances: { ...defaultAllowances },
    calculatedRates: { salary: [], overtime: [] },
    history: [
      { action: "Offer created", actor: "admin", timestamp: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

// ── Context ────────────────────────────────────────────────────────────────
const OfferContext = createContext(null);

export function OfferProvider({ children }) {
  const [offers, setOffers] = useState(() => {
    return { "demo-001": createOffer("demo-001") };
  });

  const getOffer = (id) => offers[id] ?? null;

  const updateOffer = (id, patch) => {
    setOffers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch,
        updatedAt: new Date(),
      },
    }));
  };

  // Update only contractData — used by ContractForm onChange
  const updateContractData = (id, newData) => {
    setOffers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        contractData: newData,
        updatedAt: new Date(),
      },
    }));
  };

  // Update only schedule — used by setSchedule prop
  const updateSchedule = (id, newSchedule) => {
    setOffers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        schedule: newSchedule,
        updatedAt: new Date(),
      },
    }));
  };

  const addHistoryEntry = (id, entry) => {
    setOffers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        history: [...(prev[id]?.history ?? []), entry],
      },
    }));
  };

  const setOfferStatus = (id, status) => {
    updateOffer(id, { status });
  };

  const createNewOffer = (overrides = {}) => {
    const id = `offer-${Date.now()}`;
    const offer = createOffer(id, overrides);
    setOffers((prev) => ({ ...prev, [id]: offer }));
    return id;
  };

  return (
    <OfferContext.Provider
      value={{
        offers,
        getOffer,
        updateOffer,
        updateContractData,
        updateSchedule,
        addHistoryEntry,
        setOfferStatus,
        createNewOffer,
      }}
    >
      {children}
    </OfferContext.Provider>
  );
}

export function useOffers() {
  const ctx = useContext(OfferContext);
  if (!ctx) throw new Error("useOffers must be used inside <OfferProvider>");
  return ctx;
}