/**
 * offerStageConfig.js
 *
 * CREW PAGE ONLY. After crew signs (PENDING_UPM/FC/STUDIO_SIGNATURE),
 * the offer is no longer shown on MyOffer — those stages belong to ViewOffer.
 *
 *   offer_review         → SENT_TO_CREW, NEEDS_REVISION, CREW_ACCEPTED,
 *                          PRODUCTION_CHECK, ACCOUNTS_CHECK
 *   contract_review_sign → PENDING_CREW_SIGNATURE only
 *   contract_active      → COMPLETED + endDate in future (or no endDate)
 *   contract_ended       → TERMINATED, CANCELLED, COMPLETED past endDate
 *   everything else      → null (not shown on MyOffer)
 */

import { FileText, PenLine, CheckCircle, Clock } from "lucide-react";

export const OFFER_STAGES = [
  {
    key: "offer_review",
    label: "Offer Review",
    sub: "Waiting for your decision",
    icon: FileText,
    colorScheme: "amber",
    statuses: [
      "SENT_TO_CREW",
      "NEEDS_REVISION",
      "CREW_ACCEPTED",
      "PRODUCTION_CHECK",
      "ACCOUNTS_CHECK",
    ],
  },
  {
    key: "contract_review_sign",
    label: "Contract & Sign",
    sub: "Documents to review and sign",
    icon: PenLine,
    colorScheme: "purple",
    // Only crew's own signing turn — once they sign the offer leaves MyOffer
    statuses: ["PENDING_CREW_SIGNATURE"],
  },
  {
    key: "contract_active",
    label: "Contract Active",
    sub: "Signed & live contracts",
    icon: CheckCircle,
    colorScheme: "green",
    statuses: ["COMPLETED"],
  },
  {
    key: "contract_ended",
    label: "Contract Ended",
    sub: "Past engagements",
    icon: Clock,
    colorScheme: "gray",
    statuses: ["COMPLETED", "TERMINATED", "CANCELLED"],
    dateFilter: "ended",
  },
];

/**
 * Returns the stage key for a given offer (crew perspective).
 * Returns null for statuses not shown on the crew MyOffer page.
 * PENDING_UPM/FC/STUDIO_SIGNATURE → null (ViewOffer only).
 */
export function getStageForOffer(offer) {
  const status = offer?.status;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = offer?.endDate ? new Date(offer.endDate) : null;

  if ([
    "SENT_TO_CREW",
    "NEEDS_REVISION",
    "CREW_ACCEPTED",
    "PRODUCTION_CHECK",
    "ACCOUNTS_CHECK",
  ].includes(status)) {
    return "offer_review";
  }

  if (status === "PENDING_CREW_SIGNATURE") {
    return "contract_review_sign";
  }

  // PENDING_UPM_SIGNATURE, PENDING_FC_SIGNATURE, PENDING_STUDIO_SIGNATURE
  // → null — offer disappears from MyOffer once crew has signed

  if (["TERMINATED", "CANCELLED"].includes(status)) {
    return "contract_ended";
  }

  if (status === "COMPLETED") {
    if (end && end < today) return "contract_ended";
    return "contract_active";
  }

  return null;
}

/**
 * Count offers per stage.
 */
export function countByStage(offers = []) {
  const counts = Object.fromEntries(OFFER_STAGES.map((s) => [s.key, 0]));
  offers.forEach((o) => {
    const key = getStageForOffer(o);
    if (key) counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

/**
 * Filter offers by stage key.
 * If stageKey is null, returns all offers that have a visible stage.
 */
export function filterByStage(offers = [], stageKey) {
  if (!stageKey) return offers.filter((o) => getStageForOffer(o) !== null);
  return offers.filter((o) => getStageForOffer(o) === stageKey);
}

/**
 * Maps an offer status to the 3-step crew stepper index.
 *   0 = Offer  |  1 = Contract  |  2 = Active/Ended
 */
export function getStepperIndex(status) {
  if ([
    "SENT_TO_CREW",
    "NEEDS_REVISION",
    "CREW_ACCEPTED",
    "PRODUCTION_CHECK",
    "ACCOUNTS_CHECK",
  ].includes(status)) return 0;

  if ([
    "PENDING_CREW_SIGNATURE",
    "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE",
    "PENDING_STUDIO_SIGNATURE",
  ].includes(status)) return 1;

  if (["COMPLETED", "TERMINATED", "CANCELLED"].includes(status)) return 2;

  return 0;
}