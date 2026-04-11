/**
 * layouts/LayoutProductionAdmin.jsx
 *
 * End & Revise flow (updated):
 *   - "End & Revise" button in CrewIdentityHeader opens EndAndReviseDialog directly.
 *   - No URL param navigation needed for this action.
 *   - On confirm: calls endAndReviseThunk → on success navigates to the new
 *     offer's edit page (CreateOffer with prefilled data from the cloned offer).
 *   - URL param ?openEndAndRevise=true is still supported for deep-linking
 *     from CrewSearch (auto-opens dialog on arrival).
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
import EndContractDialog      from "../../CrewMangemant/EndContractDialog";
import VoidAndReplaceDialog   from "../../CrewMangemant/VoidAndReplaceDialog";
import EndAndReviseDialog     from "../../CrewMangemant/EndAndReviseDialog";

import {
  extendContractThunk,
  terminateContractThunk,
  getOfferThunk,
  voidAndReplaceThunk,
  endAndReviseThunk,
} from "../../../store/offer.slice";
import { defaultEngineSettings } from "../../../utils/rateCalculations";

// ── Terminated contract card ──────────────────────────────────────────────────

function EndContractCard({ offer }) {
  const endDate      = offer?.endDate;
  const terminatedAt = offer?.timeline?.terminatedAt;

  const fmtDate = (d) => {
    if (!d) return "—";
    return new Date(String(d).split("T")[0] + "T00:00:00").toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div className="rounded-xl px-4 py-4 space-y-2" style={{ background: "#fff1f1", border: "1px solid #fecaca" }}>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "#dc2626" }}>
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
            <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="text-[13px] font-bold" style={{ color: "#dc2626" }}>Contract Terminated</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-1">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#b91c1c" }}>Effective End Date</p>
          <p className="text-[13px] font-bold mt-0.5" style={{ color: "#7f1d1d" }}>{fmtDate(endDate)}</p>
        </div>
        {terminatedAt && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#b91c1c" }}>Terminated On</p>
            <p className="text-[13px] font-bold mt-0.5" style={{ color: "#7f1d1d" }}>{fmtDate(terminatedAt)}</p>
          </div>
        )}
      </div>
      <p className="text-[11px] mt-1" style={{ color: "#991b1b" }}>
        This contract has been ended early. All unsigned documents have been voided and the contract is now locked.
      </p>
    </div>
  );
}

// ── Actions sidebar card ──────────────────────────────────────────────────────

function ActionsCard({ status, isSubmitting, onSendToCrew, onCancel, onEdit }) {
  const canSend       = status === "DRAFT" || status === "NEEDS_REVISION";
  const canCancel     = !["COMPLETED", "CANCELLED", "TERMINATED"].includes(status);
  const isSent        = status === "SENT_TO_CREW";
  const needsRevision = status === "NEEDS_REVISION";
  const showEdit      = needsRevision || status === "PRODUCTION_CHECK";

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border bg-muted/40">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</p>
      </div>
      <div className="p-3 space-y-2">
        {showEdit && (
          <button onClick={onEdit} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-peach-500 text-white text-[12px] font-semibold hover:opacity-90 transition-opacity">
            <Edit2 className="w-3.5 h-3.5" />
            Edit Offer
          </button>
        )}
        {canSend && (
          <button disabled={isSubmitting} onClick={onSendToCrew}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity">
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
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
          <button disabled={isSubmitting} onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-destructive/30 text-destructive text-[12px] font-semibold hover:bg-destructive/5 disabled:opacity-60 transition-colors">
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
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
        {status === "TERMINATED" && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border" style={{ background: "#fff1f1", borderColor: "#fecaca" }}>
            <XCircle className="w-3.5 h-3.5 shrink-0" style={{ color: "#dc2626" }} />
            <p className="text-[11px] font-medium" style={{ color: "#dc2626" }}>Contract terminated</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OfferDocumentPane({ offer, contractData, allowances, calculatedRates }) {
  const [af, setAf] = useState(null);
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
        <p className="text-[13px] font-bold text-foreground uppercase tracking-wide">Offer Document</p>
        {offer?.offerCode && <span className="text-[9px] font-mono text-muted-foreground">{offer.offerCode}</span>}
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

  // ── Capture URL params ONCE on mount via lazy initializer ─────────────────
  const [fromExtend]      = useState(() => searchParams.get("openExtend")      === "true");
  const [fromEndContract] = useState(() => searchParams.get("openEndContract") === "true");
  const [fromVoidReplace] = useState(() => searchParams.get("openVoidReplace") === "true");
  // NOTE: openEndAndRevise param is still supported for deep-link but the
  // primary trigger is now direct button click — no URL param needed.
  const [fromEndAndRevise] = useState(() => searchParams.get("openEndAndRevise") === "true");

  const [dialog,             setDialog            ] = useState(null);
  const [showExtend,         setShowExtend         ] = useState(false);
  const [showEndContract,    setShowEndContract    ] = useState(false);
  const [showVoidReplace,    setShowVoidReplace    ] = useState(false);
  const [showEndAndRevise,   setShowEndAndRevise   ] = useState(false);
  const [isExtending,        setIsExtending        ] = useState(false);
  const [isTerminating,      setIsTerminating      ] = useState(false);
  const [isVoidingReplace,   setIsVoidingReplace   ] = useState(false);
  const [isEndingAndRevising,setIsEndingAndRevising] = useState(false);

  const status       = offer?.status;
  const isCompleted  = status === "COMPLETED";
  const isTerminated = status === "TERMINATED";

  const isMonitoringStage = ["DRAFT", "SENT_TO_CREW", "NEEDS_REVISION", "CREW_ACCEPTED", "PRODUCTION_CHECK"].includes(status);
  const isSigningStage    = ["PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE", "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE", "COMPLETED"].includes(status);
  const canMoveToProductionCheck = status === "CREW_ACCEPTED";

  // ── Auto-open dialogs from URL params (deep-link support) ─────────────────
  useEffect(() => {
    if (searchParams.get("openExtend") === "true" && offer?._id) {
      setShowExtend(true);
      const next = new URLSearchParams(searchParams);
      next.delete("openExtend");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, offer?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (searchParams.get("openEndContract") === "true" && offer?._id) {
      setShowEndContract(true);
      const next = new URLSearchParams(searchParams);
      next.delete("openEndContract");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, offer?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (searchParams.get("openVoidReplace") === "true" && offer?._id) {
      setShowVoidReplace(true);
      const next = new URLSearchParams(searchParams);
      next.delete("openVoidReplace");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, offer?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // End & Revise: also support URL param deep-link (from CrewSearch)
  useEffect(() => {
    if (searchParams.get("openEndAndRevise") === "true" && offer?._id) {
      setShowEndAndRevise(true);
      const next = new URLSearchParams(searchParams);
      next.delete("openEndAndRevise");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, offer?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = () => {
    if (!offer?._id) return;
    const redirectTo = status === "NEEDS_REVISION" ? "view" : "onboarding";
    navigate(`/projects/${proj}/offers/${offer._id}/edit?redirectTo=${redirectTo}`);
  };

  // ── Extend ────────────────────────────────────────────────────────────────
  const handleExtendConfirm = async ({ newEndDate, note }) => {
    if (!offer?._id) return;
    setIsExtending(true);
    toast.loading("Extending contract…", { id: "extend" });
    try {
      const result = await dispatch(extendContractThunk({ offerId: offer._id, contractId: offer.contractId, projectId: offer.projectId, newEndDate, note }));
      toast.dismiss("extend");
      if (!result.error) {
        toast.success("Contract extended — Extension Agreement generated");
        setShowExtend(false);
        dispatch(getOfferThunk(offer._id));
      } else {
        toast.error(result.payload?.errors?.map(e => e.message).join(" · ") || result.payload?.message || "Failed to extend contract");
      }
    } catch (err) {
      toast.dismiss("extend");
      toast.error(err.message || "Failed to extend contract");
    } finally {
      setIsExtending(false);
    }
  };

  // ── End Contract (Terminate) ──────────────────────────────────────────────
  const handleEndContractConfirm = async ({ noticePeriodDays, reason }) => {
    if (!offer?._id) return;
    setIsTerminating(true);
    toast.loading("Ending contract…", { id: "terminate" });
    try {
      const result = await dispatch(terminateContractThunk({ offerId: offer._id, noticePeriodDays, reason }));
      toast.dismiss("terminate");
      if (!result.error) {
        toast.success("Contract terminated successfully");
        setShowEndContract(false);
        dispatch(getOfferThunk(offer._id));
      } else {
        toast.error(result.payload?.errors?.map(e => e.message).join(" · ") || result.payload?.message || "Failed to terminate contract");
      }
    } catch (err) {
      toast.dismiss("terminate");
      toast.error(err.message || "Failed to terminate contract");
    } finally {
      setIsTerminating(false);
    }
  };

  // ── Void & Replace ────────────────────────────────────────────────────────
  const handleVoidAndReplaceConfirm = async ({ reason }) => {
    if (!offer?._id) return;
    setIsVoidingReplace(true);
    toast.loading("Voiding contract and creating replacement…", { id: "void-replace" });
    try {
      const result = await dispatch(voidAndReplaceThunk({ offerId: offer._id, reason }));
      toast.dismiss("void-replace");
      if (!result.error) {
        const newOffer = result.payload?.newOffer;
        if (newOffer?._id) {
          toast.success("Contract voided — replacement draft created. Redirecting to edit…");
          setShowVoidReplace(false);
          setTimeout(() => navigate(`/projects/${proj}/offers/${newOffer._id}/edit`), 600);
        } else {
          toast.success("Contract voided successfully");
          setShowVoidReplace(false);
          dispatch(getOfferThunk(offer._id));
        }
      } else {
        toast.error(result.payload?.errors?.map(e => e.message).join(" · ") || result.payload?.message || "Failed to void and replace contract");
      }
    } catch (err) {
      toast.dismiss("void-replace");
      toast.error(err.message || "Failed to void and replace contract");
    } finally {
      setIsVoidingReplace(false);
    }
  };

  // ── End & Revise ──────────────────────────────────────────────────────────
  // Flow:
  //   1. EndAndReviseDialog opened directly by button click (no URL navigation).
  //   2. User fills in endCurrentOn, newEffectiveFrom, reason → confirms.
  //   3. Calls endAndReviseThunk → backend marks old offer REVISED, creates new DRAFT.
  //   4. Navigates to the new offer's EDIT page (CreateOffer with prefilled data).
  const handleEndAndReviseConfirm = async ({ endCurrentOn, newEffectiveFrom, reason }) => {
    if (!offer?._id) return;
    setIsEndingAndRevising(true);
    toast.loading("Creating revised contract…", { id: "end-revise" });
    try {
      const result = await dispatch(endAndReviseThunk({
        offerId: offer._id,
        endCurrentOn,
        newEffectiveFrom,
        reason,
      }));
      toast.dismiss("end-revise");
      if (!result.error) {
        const newOffer = result.payload?.newOffer;
        if (newOffer?._id) {
          toast.success("Contract revised — opening new offer for editing…");
          setShowEndAndRevise(false);
          // Navigate to the new offer's edit page — CreateOffer loads it prefilled
          setTimeout(() => navigate(`/projects/${proj}/offers/${newOffer._id}/edit`), 400);
        } else {
          toast.success("Contract ended and revision created");
          setShowEndAndRevise(false);
          dispatch(getOfferThunk(offer._id));
        }
      } else {
        toast.error(
          result.payload?.errors?.map(e => e.message).join(" · ") ||
          result.payload?.message ||
          "Failed to end and revise contract"
        );
      }
    } catch (err) {
      toast.dismiss("end-revise");
      toast.error(err.message || "Failed to end and revise contract");
    } finally {
      setIsEndingAndRevising(false);
    }
  };

  // ── Button visibility logic ───────────────────────────────────────────────
  // When a URL param was present on mount, show ONLY that button.
  // Direct navigation (no param) → show all buttons.
  const anyParam = fromExtend || fromEndContract || fromVoidReplace || fromEndAndRevise;
  const showExtendBtn       = fromExtend       ? true : !anyParam || (!fromEndContract  && !fromVoidReplace && !fromEndAndRevise);
  const showEndContractBtn  = fromEndContract  ? true : !anyParam || (!fromExtend       && !fromVoidReplace && !fromEndAndRevise);
  const showVoidReplaceBtn  = fromVoidReplace  ? true : !anyParam || (!fromExtend       && !fromEndContract && !fromEndAndRevise);
  const showEndAndReviseBtn = fromEndAndRevise ? true : !anyParam || (!fromExtend       && !fromEndContract && !fromVoidReplace);

  return (
    <>
      <div className="space-y-4">

        {/* Identity header */}
        <CrewIdentityHeader
          contractData={contractData}
          offer={offer}
          onExtend={isCompleted ? () => setShowExtend(true) : undefined}
          onEndContract={isCompleted ? () => setShowEndContract(true) : undefined}
          onVoidAndReplace={isCompleted ? () => setShowVoidReplace(true) : undefined}
          // End & Revise: opens dialog directly — no URL navigation
          onEndAndRevise={isCompleted ? () => setShowEndAndRevise(true) : undefined}
          showExtendBtn={showExtendBtn}
          showEndContractBtn={showEndContractBtn}
          showVoidReplaceBtn={showVoidReplaceBtn}
          showEndAndReviseBtn={showEndAndReviseBtn}
        />

        {/* Terminated card */}
        {isTerminated && <EndContractCard offer={offer} />}

        {/* Change request banner */}
        {(status === "NEEDS_REVISION" || status === "PRODUCTION_CHECK") && offer?._id && (
          <ChangeRequestBanner offerId={offer._id} />
        )}

        {/* MONITORING STAGE */}
        {isMonitoringStage && (
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <OfferDocumentPane offer={offer} contractData={contractData} allowances={allowances} calculatedRates={calculatedRates} />
            </div>
            <div className="w-[240px] shrink-0 space-y-3">
              <ActionsCard
                status={status} isSubmitting={isSubmitting}
                onSendToCrew={() => setDialog("sendToCrew")}
                onCancel={() => setDialog("cancel")}
                onEdit={handleEdit}
              />
              {canMoveToProductionCheck && (
                <div className="bg-card rounded-xl border border-border p-3">
                  <button disabled={isSubmitting} onClick={() => onAction("productionCheck")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity">
                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ClipboardCheck className="w-3.5 h-3.5" />}
                    Move to Production Check
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SIGNING STAGE (includes COMPLETED) */}
        {isSigningStage && (
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <h3 className="text-[12px] font-semibold text-foreground">Contract Documents</h3>
                  {isCompleted
                    ? <span className="ml-auto text-[9px] text-mint-600 font-mono font-semibold">ALL SIGNED</span>
                    : <span className="ml-auto text-[9px] text-primary font-mono">PENDING SIGNATURE</span>
                  }
                </div>
                <div className="p-4">
                  {offer?._id
                    ? <ContractInstancesPanel offerId={offer._id} offerStatus={offer?.status} />
                    : <div className="flex flex-col items-center justify-center py-16 text-center"><FileText className="w-5 h-5 text-primary/30 mb-2" /><p className="text-sm font-semibold text-muted-foreground">Loading…</p></div>
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TERMINATED */}
        {isTerminated && (
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <h3 className="text-[12px] font-semibold text-foreground">Contract Documents</h3>
                  <span className="ml-auto text-[9px] font-mono font-semibold" style={{ color: "#dc2626" }}>TERMINATED</span>
                </div>
                <div className="p-4">
                  {offer?._id && <ContractInstancesPanel offerId={offer._id} offerStatus={offer?.status} />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CANCELLED */}
        {status === "CANCELLED" && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-6 text-center">
            <XCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-sm font-semibold text-destructive">This offer has been cancelled.</p>
          </div>
        )}

      </div>

      {/* ── Dialogs ─────────────────────────────────────────────────────────── */}
      {dialog === "sendToCrew" && (
        <OfferActionDialog type="sendToCrew" offer={offer} open
          onConfirm={async () => { setDialog(null); await onAction("sendToCrew"); }}
          onClose={() => setDialog(null)} isLoading={isSubmitting} />
      )}
      {dialog === "cancel" && (
        <OfferActionDialog type="cancelOffer" offer={offer} open
          onConfirm={async () => { setDialog(null); await onAction("cancel"); }}
          onClose={() => setDialog(null)} isLoading={isSubmitting} />
      )}

      {showExtend && (
        <ExtendDialog offer={offer} onClose={() => setShowExtend(false)} onConfirm={handleExtendConfirm} isLoading={isExtending} />
      )}
      {showEndContract && (
        <EndContractDialog offer={offer} onClose={() => setShowEndContract(false)} onConfirm={handleEndContractConfirm} isLoading={isTerminating} />
      )}
      {showVoidReplace && (
        <VoidAndReplaceDialog offer={offer} onClose={() => setShowVoidReplace(false)} onConfirm={handleVoidAndReplaceConfirm} isLoading={isVoidingReplace} />
      )}

      {/* End & Revise — opens directly, no intermediate navigation */}
      {showEndAndRevise && (
        <EndAndReviseDialog
          offer={offer}
          onClose={() => setShowEndAndRevise(false)}
          onConfirm={handleEndAndReviseConfirm}
          isLoading={isEndingAndRevising}
        />
      )}
    </>
  );
}