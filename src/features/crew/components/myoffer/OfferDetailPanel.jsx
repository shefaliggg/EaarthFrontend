import { FileText, ArrowRight } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { cn } from "../../../../shared/config/utils";

import { OfferStatusBadge } from "../onboarding/OfferStatusBadge";
import {
  OfferReviewPanel,
  ContractSignPanel,
  ContractActivePanel,
  ContractEndedPanel,
} from "./index";
import { getStageForOffer } from "./offerStageConfig";

const deptLabel = (val = "") =>
  val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex-1 bg-white rounded-xl border border-neutral-200 flex flex-col items-center justify-center gap-3 min-h-[500px]">
      <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center">
        <FileText className="w-5 h-5 text-neutral-300" />
      </div>
      <p className="text-[13px] font-medium text-neutral-500">
        Select an offer to view details
      </p>
      <p className="text-[11px] text-neutral-400">Choose from the list on the left</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function OfferDetailsPanel({
  offer,
  profileSignature,
  isSubmitting,
  onView,
  onAccept,
  onRequestChanges,
  onSignInstance,
  onAllSigned,
}) {
  if (!offer) return <EmptyState />;

  const stage    = getStageForOffer(offer);
  const name     = offer.recipient?.fullName || "Offer";
  const jobTitle = offer.createOwnJobTitle && offer.newJobTitle
    ? offer.newJobTitle
    : offer.jobTitle || "";

  // Action Required only when crew needs to act
  const needsAction =
    offer.status === "SENT_TO_CREW" || offer.status === "PENDING_CREW_SIGNATURE";

  return (
    <div className="flex-1 bg-white rounded-xl border border-neutral-200 flex flex-col overflow-hidden min-h-[500px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-100 flex items-start justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-[15px] font-semibold text-neutral-900 truncate">{name}</h2>
            <OfferStatusBadge status={offer.status} />
            {offer.offerCode && (
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                {offer.offerCode}
              </span>
            )}
            {needsAction && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 animate-pulse uppercase tracking-wide">
                Action Required
              </span>
            )}
          </div>
          <p className="text-[12px] text-neutral-500 mt-0.5">
            {jobTitle}
            {offer.department ? ` · ${deptLabel(offer.department)}` : ""}
          </p>
        </div>
        <button
          className="text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
          onClick={() => onView(offer._id)}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stage-specific panel */}
      <div className="flex-1 overflow-y-auto">
        {stage === "offer_review" && (
          <OfferReviewPanel
            offer={offer}
            isSubmitting={isSubmitting}
            onAccept={() => onAccept(offer._id)}
            onRequestChanges={(reason) => onRequestChanges(offer._id, reason)}
          />
        )}

        {stage === "contract_review_sign" && (
          <div className="p-5">
            <ContractSignPanel
              offer={offer}
              profileSignature={profileSignature}
              isSubmitting={isSubmitting}
              onSignInstance={onSignInstance}
              onAllSigned={onAllSigned}
            />
          </div>
        )}

        {stage === "contract_active" && (
          <ContractActivePanel offer={offer} onView={onView} />
        )}

        {stage === "contract_ended" && (
          <ContractEndedPanel offer={offer} onView={onView} />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-100 px-4 py-2.5 flex justify-end shrink-0">
        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5 h-7 text-[11px] text-neutral-400 hover:text-neutral-600"
          onClick={() => onView(offer._id)}
        >
          Full view <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}