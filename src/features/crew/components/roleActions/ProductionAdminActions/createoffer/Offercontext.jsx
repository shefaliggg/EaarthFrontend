import { createContext, useContext, useState } from "react";
import { defaultEngineSettings } from "../../../../utils/rateCalculations";
import { defaultAllowances } from "../../../../utils/Defaultallowance";

// ── Default contract data ──────────────────────────────────────────────────
export const defaultContractData = {
  // Recipient
  fullName: "",
  email: "",
  mobileNumber: "",
  isViaAgent: false,
  agentEmail: "",
  // Alternative Contract
  alternativeContract: "",
  // Unit and Department
  unit: "",
  department: "",
  subDepartment: "",
  // Role
  jobTitle: "",
  searchAllDepartments: false,
  createOwnJobTitle: false,
  newJobTitle: "",
  jobTitleSuffix: "",
  // Tax Status
  allowSelfEmployed: "no",
  engagementType: "paye",
  statusDeterminationReason: "",
  otherStatusDeterminationReason: "",
  // Place of Work
  regularSiteOfWork: "",
  workingInUK: "yes",
  // Engagement
  startDate: "",
  endDate: "",
  dailyOrWeekly: "daily",
  workingWeek: "5",
  // Rates
  currency: "GBP",
  feePerDay: "",
  overtime: "calculated",
  otherOT: "",
  cameraOTSWD: "",
  cameraOTSCWD: "",
  cameraOTCWD: "",
  // Other
  otherDealProvisions: "",
  additionalNotes: "",
};

// ── Default offer factory ──────────────────────────────────────────────────
function createOffer(id, overrides = {}) {
  return {
    id,
    status: "draft", // draft | pending_approval | revision_requested | accepted
    contractData: { ...defaultContractData },
    engineSettings: { ...defaultEngineSettings },
    salaryBudgetCodes: [],
    salaryTags: [],
    overtimeBudgetCodes: [],
    overtimeTags: [],
    allowances: { ...defaultAllowances },
    history: [
      { action: "Offer created", actor: "admin", timestamp: new Date() },
    ],
    ...overrides,
  };
}

// ── Context ────────────────────────────────────────────────────────────────
const OfferContext = createContext(null);

export function OfferProvider({ children }) {
  const [offers, setOffers] = useState(() => {
    // Seed a demo offer so the page doesn't immediately show "not found"
    return { "demo-001": createOffer("demo-001") };
  });

  const getOffer = (id) => offers[id] ?? null;

  const updateOffer = (id, patch) => {
    setOffers((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
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
      value={{ offers, getOffer, updateOffer, addHistoryEntry, setOfferStatus, createNewOffer }}
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