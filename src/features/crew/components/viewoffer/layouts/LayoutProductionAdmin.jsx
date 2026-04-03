/**
 * layouts/LayoutProductionAdmin.jsx
 *
 * CHANGES:
 *   - OfferTopBar replaced with CrewIdentityHeader
 *   - ExtendDialog imported from ./ExtendDialog
 *   - All colors use Tailwind CSS variable classes (bg-primary, bg-card, etc.)
 *   - Reads ?openExtend=true from URL → auto-opens ExtendDialog on mount
 *   - Clears ?openExtend param from URL after opening (clean history)
 */

import { useState, useEffect }                     from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast }                                   from "sonner";
import {
  Edit2, Send, ClipboardCheck, Loader2,
  Eye, FileText, XCircle, CheckCircle,
} from "lucide-react";

import { CreateOfferLayout }  from "../../roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import ContractInstancesPanel from "../../../pages/ContractInstancesPanel";
import OfferActionDialog      from "../../onboarding/OfferActionDialog";
import ChangeRequestBanner    from "../../../components/viewoffer/layouts/ChangeRequestBanner";
import CrewIdentityHeader     from "../../../../crew/components/viewoffer/layouts/CrewIdentityHeader";
import ExtendDialog           from "../../CrewMangemant/ExtendDialog";

import {
  extendContractThunk,
  getOfferThunk,
} from "../../../store/offer.slice";
import { defaultEngineSettings } from "../../../utils/rateCalculations";

// ── Actions sidebar card ──────────────────────────────────────────────────────

function ActionsCard({ status, isSubmitting, onSendToCrew, onCancel, onEdit }) {
  const canSend       = status === "DRAFT" || status === "NEEDS_REVISION";
  const canCancel     = !["COMPLETED", "CANCELLED"].includes(status);
  const isSent        = status === "SENT_TO_CREW";
  const needsRevision = status === "NEEDS_REVISION";
  const showEdit      = needsRevision || status === "PRODUCTION_CHECK";

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border bg-muted/40">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Actions
        </p>
      </div>
      <div className="p-3 space-y-2">

        {showEdit && (
          <button
            onClick={onEdit}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-peach-500 text-white text-[12px] font-semibold hover:opacity-90 transition-opacity"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Offer
          </button>
        )}

        {canSend && (
          <button
            disabled={isSubmitting}
            onClick={onSendToCrew}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {isSubmitting
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Send className="w-3.5 h-3.5" />
            }
            {needsRevision ? "Resend to Crew" : "Send to Crew"}
          </button>
        )}

        {isSent && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-peach-50 border border-peach-200">
            <Eye className="w-3.5 h-3.5 text-peach-500 shrink-0" />
            <p className="text-[11px] text-peach-700 font-medium">Awaiting crew response</p>
          </div>
        )}

        {canCancel && (
          <button
            disabled={isSubmitting}
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-destructive/30 text-destructive text-[12px] font-semibold hover:bg-destructive/5 disabled:opacity-60 transition-colors"
          >
            {isSubmitting
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <XCircle className="w-3.5 h-3.5" />
            }
            Cancel Offer
          </button>
        )}

        {status === "CANCELLED" && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-destructive/5 border border-destructive/20">
            <XCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
            <p className="text-[11px] text-destructive font-medium">Offer cancelled</p>
          </div>
        )}

        {status === "COMPLETED" && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-mint-50 border border-mint-200">
            <CheckCircle className="w-3.5 h-3.5 text-mint-600 shrink-0" />
            <p className="text-[11px] text-mint-700 font-medium">Contract fully executed</p>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Offer document pane (read-only) ──────────────────────────────────────────

function OfferDocumentPane({ offer, contractData, allowances, calculatedRates }) {
  const [af, setAf] = useState(null);
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
        <p className="text-[13px] font-bold text-foreground uppercase tracking-wide">
          Offer Document
        </p>
        {offer?.offerCode && (
          <span className="text-[9px] font-mono text-muted-foreground">
            {offer.offerCode}
          </span>
        )}
      </div>
      <CreateOfferLayout
        data={contractData} offer={offer}
        activeField={af} onFieldFocus={setAf} onFieldBlur={() => setAf(null)}
        calculatedRates={calculatedRates} engineSettings={defaultEngineSettings}
        salaryBudgetCodes={offer?.salaryBudgetCodes     || []} setSalaryBudgetCodes={() => {}}
        salaryTags={offer?.salaryTags                   || []} setSalaryTags={() => {}}
        overtimeBudgetCodes={offer?.overtimeBudgetCodes || []} setOvertimeBudgetCodes={() => {}}
        overtimeTags={offer?.overtimeTags               || []} setOvertimeTags={() => {}}
        allowances={allowances}
        hideOfferSections={false} hideContractDocument={true}
        isDocumentLocked={true} initialOfferCollapsed={false}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

export default function LayoutProductionAdmin({
  offer, contractData, allowances, calculatedRates,
  signingStatus, isSubmitting, onAction, onSign, dispatch,
}) {
  const navigate        = useNavigate();
  const { projectName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const proj = projectName || "demo-project";

  const [dialog,      setDialog     ] = useState(null);
  const [showExtend,  setShowExtend ] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  const status = offer?.status;

  const isMonitoringStage = [
    "DRAFT", "SENT_TO_CREW", "NEEDS_REVISION", "CREW_ACCEPTED", "PRODUCTION_CHECK",
  ].includes(status);

  const isSigningStage = [
    "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE", "COMPLETED",
  ].includes(status);

  const isCompleted              = status === "COMPLETED";
  const canMoveToProductionCheck = status === "CREW_ACCEPTED";

  // ── Auto-open ExtendDialog from URL param ───────────────────────────────────
  useEffect(() => {
    if (searchParams.get("openExtend") === "true" && offer?._id) {
      setShowExtend(true);
      const next = new URLSearchParams(searchParams);
      next.delete("openExtend");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, offer?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = () => {
    if (!offer?._id) return;
    const redirectTo = status === "NEEDS_REVISION" ? "view" : "onboarding";
    navigate(`/projects/${proj}/offers/${offer._id}/edit?redirectTo=${redirectTo}`);
  };

  // ── Extend ──────────────────────────────────────────────────────────────────
  const handleExtendConfirm = async ({ newEndDate, note }) => {
    if (!offer?._id) return;
    setIsExtending(true);
    toast.loading("Extending contract…", { id: "extend" });
    try {
      const result = await dispatch(extendContractThunk({
        offerId:    offer._id,
        contractId: offer.contractId,
        projectId:  offer.projectId,
        newEndDate,
        note,
      }));
      toast.dismiss("extend");
      if (!result.error) {
        toast.success("Contract extended — Extension Agreement generated");
        setShowExtend(false);
        dispatch(getOfferThunk(offer._id));
      } else {
        toast.error(
          result.payload?.errors?.map(e => e.message).join(" · ") ||
          result.payload?.message ||
          "Failed to extend contract"
        );
      }
    } catch (err) {
      toast.dismiss("extend");
      toast.error(err.message || "Failed to extend contract");
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <>
      <div className="space-y-4">

        {/* ── Identity header ─────────────────────────────────────────────── */}
        <CrewIdentityHeader
          contractData={contractData}
          offer={offer}
          onExtend={isCompleted ? () => setShowExtend(true) : undefined}
        />

        {/* ── Change request banner ────────────────────────────────────────── */}
        {(status === "NEEDS_REVISION" || status === "PRODUCTION_CHECK") && offer?._id && (
          <ChangeRequestBanner offerId={offer._id} />
        )}

        {/* ── MONITORING STAGE ─────────────────────────────────────────────── */}
        {isMonitoringStage && (
          <div className="flex gap-4 items-start">

            {/* Left — offer doc */}
            <div className="flex-1 min-w-0">
              <OfferDocumentPane
                offer={offer} contractData={contractData}
                allowances={allowances} calculatedRates={calculatedRates}
              />
            </div>

            {/* Right — actions sidebar */}
            <div className="w-[240px] shrink-0 space-y-3">
              <ActionsCard
                status={status}
                isSubmitting={isSubmitting}
                onSendToCrew={() => setDialog("sendToCrew")}
                onCancel={() => setDialog("cancel")}
                onEdit={handleEdit}
              />
              {canMoveToProductionCheck && (
                <div className="bg-card rounded-xl border border-border p-3">
                  <button
                    disabled={isSubmitting}
                    onClick={() => onAction("productionCheck")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
                  >
                    {isSubmitting
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <ClipboardCheck className="w-3.5 h-3.5" />
                    }
                    Move to Production Check
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SIGNING STAGE ────────────────────────────────────────────────── */}
        {isSigningStage && (
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <h3 className="text-[12px] font-semibold text-foreground">
                    Contract Documents
                  </h3>
                  {isCompleted
                    ? <span className="ml-auto text-[9px] text-mint-600 font-mono font-semibold">ALL SIGNED</span>
                    : <span className="ml-auto text-[9px] text-primary font-mono">PENDING SIGNATURE</span>
                  }
                </div>
                <div className="p-4">
                  {offer?._id
                    ? <ContractInstancesPanel offerId={offer._id} offerStatus={offer?.status} />
                    : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FileText className="w-5 h-5 text-primary/30 mb-2" />
                        <p className="text-sm font-semibold text-muted-foreground">Loading…</p>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CANCELLED ────────────────────────────────────────────────────── */}
        {status === "CANCELLED" && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-6 text-center">
            <XCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-sm font-semibold text-destructive">
              This offer has been cancelled.
            </p>
          </div>
        )}

      </div>

      {/* ── Dialogs ───────────────────────────────────────────────────────────── */}
      {dialog === "sendToCrew" && (
        <OfferActionDialog
          type="sendToCrew" offer={offer} open
          onConfirm={async () => { setDialog(null); await onAction("sendToCrew"); }}
          onClose={() => setDialog(null)} isLoading={isSubmitting}
        />
      )}
      {dialog === "cancel" && (
        <OfferActionDialog
          type="cancelOffer" offer={offer} open
          onConfirm={async () => { setDialog(null); await onAction("cancel"); }}
          onClose={() => setDialog(null)} isLoading={isSubmitting}
        />
      )}

      {showExtend && (
        <ExtendDialog
          offer={offer}
          onClose={() => setShowExtend(false)}
          onConfirm={handleExtendConfirm}
          isLoading={isExtending}
        />
      )}
    </>
  );
}