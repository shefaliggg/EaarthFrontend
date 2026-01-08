// src/crew/mocks/offerStatusPresets.js

/**
 * Status-specific data that gets merged with base offer
 * Each status has associated timestamps and signatures
 */

const now = new Date();
const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const OFFER_STATUS_PRESETS = {
  DRAFT: {
    // No additional data
  },
  
  SENT_TO_CREW: {
    sentToCrewAt: daysAgo(2),
  },
  
  NEEDS_REVISION: {
    sentToCrewAt: daysAgo(3),
  },
  
  CREW_ACCEPTED: {
    sentToCrewAt: daysAgo(5),
    crewAcceptedAt: daysAgo(1),
  },
  
  PRODUCTION_CHECK: {
    sentToCrewAt: daysAgo(7),
    crewAcceptedAt: daysAgo(3),
  },
  
  ACCOUNTS_CHECK: {
    sentToCrewAt: daysAgo(10),
    crewAcceptedAt: daysAgo(6),
    productionCheckCompletedAt: daysAgo(2),
  },
  
  PENDING_CREW_SIGNATURE: {
    sentToCrewAt: daysAgo(14),
    crewAcceptedAt: daysAgo(10),
    productionCheckCompletedAt: daysAgo(5),
    accountsCheckCompletedAt: daysAgo(2),
    budgetCodes: { main: "PRD-2025-001", department: "CAM-001" },
  },
  
  PENDING_UPM_SIGNATURE: {
    sentToCrewAt: daysAgo(16),
    crewAcceptedAt: daysAgo(12),
    productionCheckCompletedAt: daysAgo(7),
    accountsCheckCompletedAt: daysAgo(4),
    budgetCodes: { main: "PRD-2025-001", department: "CAM-001" },
    crewSignature: "John Smith",
    crewSignedAt: daysAgo(1),
  },
  
  PENDING_FC_SIGNATURE: {
    sentToCrewAt: daysAgo(20),
    crewAcceptedAt: daysAgo(16),
    productionCheckCompletedAt: daysAgo(10),
    accountsCheckCompletedAt: daysAgo(7),
    budgetCodes: { main: "PRD-2025-001", department: "CAM-001" },
    crewSignature: "John Smith",
    crewSignedAt: daysAgo(5),
    upmSignature: "Mark Johnson (UPM)",
    upmSignedAt: daysAgo(2),
  },
  
  PENDING_STUDIO_SIGNATURE: {
    sentToCrewAt: daysAgo(25),
    crewAcceptedAt: daysAgo(21),
    productionCheckCompletedAt: daysAgo(15),
    accountsCheckCompletedAt: daysAgo(10),
    budgetCodes: { main: "PRD-2025-001", department: "CAM-001" },
    crewSignature: "John Smith",
    crewSignedAt: daysAgo(8),
    upmSignature: "Mark Johnson (UPM)",
    upmSignedAt: daysAgo(5),
    fcSignature: "Andrew Williams (FC)",
    fcSignedAt: daysAgo(2),
  },
  
  COMPLETED: {
    sentToCrewAt: daysAgo(30),
    crewAcceptedAt: daysAgo(26),
    productionCheckCompletedAt: daysAgo(20),
    accountsCheckCompletedAt: daysAgo(15),
    budgetCodes: { main: "PRD-2025-001", department: "CAM-001" },
    crewSignature: "John Smith",
    crewSignedAt: daysAgo(12),
    upmSignature: "Mark Johnson (UPM)",
    upmSignedAt: daysAgo(9),
    fcSignature: "Andrew Williams (FC)",
    fcSignedAt: daysAgo(6),
    studioSignature: "BBC Studios",
    studioSignedAt: daysAgo(3),
    completedAt: daysAgo(3),
    documentPath: "/contracts/completed/john-smith-dop.pdf",
  },
  
  CANCELLED: {
    sentToCrewAt: daysAgo(5),
  },
};

export const STATUS_CONFIG = {
  DRAFT: { label: "Draft", color: "bg-slate-100 text-slate-700" },
  SENT_TO_CREW: { label: "Pending Your Review", color: "bg-amber-100 text-amber-700" },
  NEEDS_REVISION: { label: "Changes Requested", color: "bg-red-100 text-red-700" },
  CREW_ACCEPTED: { label: "Accepted", color: "bg-green-100 text-green-700" },
  PRODUCTION_CHECK: { label: "Production Review", color: "bg-teal-100 text-teal-700" },
  ACCOUNTS_CHECK: { label: "Accounts Review", color: "bg-purple-100 text-purple-700" },
  PENDING_CREW_SIGNATURE: { label: "Ready to Sign", color: "bg-blue-100 text-blue-700" },
  PENDING_UPM_SIGNATURE: { label: "Awaiting UPM", color: "bg-indigo-100 text-indigo-700" },
  PENDING_FC_SIGNATURE: { label: "Awaiting FC", color: "bg-pink-100 text-pink-700" },
  PENDING_STUDIO_SIGNATURE: { label: "Awaiting Studio", color: "bg-violet-100 text-violet-700" },
  COMPLETED: { label: "Signed", color: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};