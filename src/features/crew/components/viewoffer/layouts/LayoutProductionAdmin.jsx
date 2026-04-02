/**
 * layouts/LayoutProductionAdmin.jsx
 *
 * CHANGES:
 *   - Reads ?openExtend=true from URL → auto-opens ExtendDialog on mount
 *   - Clears ?openExtend param from URL after opening (clean history)
 *   - ExtendDialog min date = current endDate + 1 day
 *   - Clone button REMOVED from completed sidebar
 *   - SignatureStatusCard REMOVED from signing stage sidebar
 *   - All existing functionality preserved
 */

import { useState, useEffect }        from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast }                  from "sonner";
import {
  Edit2, Send, ClipboardCheck, Loader2,
  Eye, FileText, XCircle,
  CalendarDays, X,
} from "lucide-react";

import { CreateOfferLayout }  from "../../roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import ContractInstancesPanel from "../../../pages/ContractInstancesPanel";
import OfferActionDialog      from "../../onboarding/OfferActionDialog";
import ChangeRequestBanner    from "../../../components/viewoffer/layouts/ChangeRequestBanner";


import {
  extendContractThunk,
  getOfferThunk,
} from "../../../store/offer.slice";
import { defaultEngineSettings } from "../../../utils/rateCalculations";

// ── helpers ───────────────────────────────────────────────────────────────────

function getInitials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

function addDays(dateStr, days) {
  if (!dateStr) return "";
  const d = new Date(String(dateStr).split("T")[0] + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_MAP = {
  DRAFT:                    { label: "Draft",                   cls: "text-neutral-500 bg-neutral-100 border-neutral-200" },
  SENT_TO_CREW:             { label: "Sent to Crew",            cls: "text-amber-600 bg-amber-50 border-amber-200"        },
  NEEDS_REVISION:           { label: "Needs Revision",          cls: "text-orange-600 bg-orange-50 border-orange-200"     },
  CREW_ACCEPTED:            { label: "Crew Accepted",           cls: "text-blue-600 bg-blue-50 border-blue-200"           },
  PRODUCTION_CHECK:         { label: "Production Check",        cls: "text-violet-600 bg-violet-50 border-violet-200"     },
  ACCOUNTS_CHECK:           { label: "Accounts Check",          cls: "text-indigo-600 bg-indigo-50 border-indigo-200"     },
  PENDING_CREW_SIGNATURE:   { label: "Awaiting Crew Signature", cls: "text-purple-600 bg-purple-50 border-purple-200"     },
  PENDING_UPM_SIGNATURE:    { label: "Awaiting UPM Signature",  cls: "text-purple-600 bg-purple-50 border-purple-200"     },
  PENDING_FC_SIGNATURE:     { label: "Awaiting FC Signature",   cls: "text-purple-600 bg-purple-50 border-purple-200"     },
  PENDING_STUDIO_SIGNATURE: { label: "Awaiting Studio Sign",    cls: "text-purple-600 bg-purple-50 border-purple-200"     },
  COMPLETED:                { label: "Completed",               cls: "text-emerald-600 bg-emerald-50 border-emerald-200"  },
  CANCELLED:                { label: "Cancelled",               cls: "text-red-500 bg-red-50 border-red-200"              },
};

function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] ?? { label: status, cls: "text-neutral-500 bg-neutral-100 border-neutral-200" };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ── Extend Contract Dialog ────────────────────────────────────────────────────

function ExtendDialog({ offer, onClose, onConfirm, isLoading }) {
  const [newEndDate, setNewEndDate] = useState("");
  const [note,       setNote      ] = useState("");

  const currentEnd = offer?.endDate
    ? new Date(String(offer.endDate).split("T")[0] + "T00:00:00").toLocaleDateString("en-GB")
    : "—";

  const minDate = addDays(offer?.endDate, 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 bg-white">

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between bg-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20">
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white">Extend Contract</h2>
              <p className="text-[10px] text-blue-200 mt-0.5">{offer?.offerCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-blue-50 border border-blue-200">
            <CalendarDays className="w-3.5 h-3.5 shrink-0 text-blue-500" />
            <p className="text-[11px] text-blue-700">
              Current end date: <strong>{currentEnd}</strong>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-700">
              New end date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              min={minDate}
              className="w-full h-10 rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
            />
            {minDate && (
              <p className="text-[10px] text-neutral-400">
                Must be after {currentEnd}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-700">
              Reason / note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. SCHEDULE EXTENDED DUE TO ADDITIONAL PHOTOGRAPHY DAYS…"
              rows={3}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[12px] uppercase placeholder:normal-case resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <p className="text-[10px] text-neutral-400">
            This will update the contract end date and generate an Extension Agreement. The same contract continues with the extended term.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl border border-neutral-200 text-neutral-700 text-[13px] font-semibold disabled:opacity-50 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (newEndDate) onConfirm({ newEndDate, note }); }}
            disabled={isLoading || !newEndDate}
            className="flex-1 h-11 rounded-xl bg-blue-600 text-white text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarDays className="w-4 h-4" />}
            Extend Contract
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Top identity bar ──────────────────────────────────────────────────────────

function OfferTopBar({ offer, contractData, onExtend }) {
  const name     = contractData?.fullName || offer?.recipient?.fullName || "—";
  const jobTitle = offer?.createOwnJobTitle && offer?.newJobTitle
    ? offer.newJobTitle
    : contractData?.jobTitle || offer?.jobTitle || "—";
  const dept  = contractData?.department || offer?.department || "";
  const email = contractData?.email || offer?.recipient?.email || "";

  return (
    <div className="bg-white rounded-xl border border-neutral-200 px-4 py-3 flex items-center gap-3 w-full">
      <div className="h-9 w-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-[12px] font-bold shrink-0 select-none">
        {getInitials(name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-bold text-neutral-900 truncate">{name}</span>
          {jobTitle && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-violet-50 text-violet-700 border-violet-200 uppercase tracking-wide">
              {jobTitle}
            </span>
          )}
          {dept && <span className="text-[11px] text-neutral-400">{dept}</span>}
        </div>
        {email && <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{email}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {offer?.offerCode && (
          <span className="text-[9px] font-mono text-neutral-400 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
            {offer.offerCode}
          </span>
        )}
        <StatusBadge status={offer?.status} />
        {offer?.status === "COMPLETED" && onExtend && (
          <button
            onClick={onExtend}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 transition-colors"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Extend Contract
          </button>
        )}
      </div>
    </div>
  );
}

// ── Actions sidebar card ──────────────────────────────────────────────────────

function ActionsCard({ status, isSubmitting, onSendToCrew, onCancel, onEdit }) {
  const canSend       = status === "DRAFT" || status === "NEEDS_REVISION";
  const canCancel     = !["COMPLETED", "CANCELLED"].includes(status);
  const isSent        = status === "SENT_TO_CREW";
  const needsRevision = status === "NEEDS_REVISION";
  const showEdit      = needsRevision || status === "PRODUCTION_CHECK";

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-neutral-100 bg-neutral-50/60">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Actions</p>
      </div>
      <div className="p-3 space-y-2">

        {showEdit && (
          <button
            onClick={onEdit}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500 text-white text-[12px] font-semibold hover:bg-orange-600 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit Offer
          </button>
        )}

        {canSend && (
          <button
            disabled={isSubmitting}
            onClick={onSendToCrew}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-[12px] font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            {needsRevision ? "Resend to Crew" : "Send to Crew"}
          </button>
        )}

        {isSent && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200">
            <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <p className="text-[11px] text-amber-700 font-medium">Awaiting crew response</p>
          </div>
        )}

        {canCancel && (
          <button
            disabled={isSubmitting}
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-500 text-[12px] font-semibold hover:bg-red-50 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
            Cancel Offer
          </button>
        )}

        {status === "CANCELLED" && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <p className="text-[11px] text-red-600 font-medium">Offer cancelled</p>
          </div>
        )}

        {status === "COMPLETED" && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <p className="text-[11px] text-emerald-700 font-medium">Contract fully executed</p>
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
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100 bg-neutral-50/60">
        <p className="text-[13px] font-bold text-neutral-800 uppercase tracking-wide">Offer Document</p>
        {offer?.offerCode && <span className="text-[9px] font-mono text-neutral-400">{offer.offerCode}</span>}
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
  const proj            = projectName || "demo-project";

  const [dialog,      setDialog     ] = useState(null);
  const [showExtend,  setShowExtend ] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  const status = offer?.status;

  const isMonitoringStage = ["DRAFT", "SENT_TO_CREW", "NEEDS_REVISION", "CREW_ACCEPTED", "PRODUCTION_CHECK"].includes(status);
  const isSigningStage    = [
    "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE", "COMPLETED",
  ].includes(status);

  const isCompleted              = status === "COMPLETED";
  const canMoveToProductionCheck = status === "CREW_ACCEPTED";

  // ── Auto-open ExtendDialog when arriving with ?openExtend=true
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

  // ── Extend ─────────────────────────────────────────────────────────────────
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

        <OfferTopBar
          offer={offer}
          contractData={contractData}
          onExtend={isCompleted ? () => setShowExtend(true) : undefined}
        />

        {(status === "NEEDS_REVISION" || status === "PRODUCTION_CHECK") && offer?._id && (
          <ChangeRequestBanner offerId={offer._id} />
        )}

        {/* ── MONITORING STAGE ─────────────────────────────────────────────── */}
        {isMonitoringStage && (
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <OfferDocumentPane
                offer={offer} contractData={contractData}
                allowances={allowances} calculatedRates={calculatedRates}
              />
            </div>
            <div className="w-[240px] shrink-0 space-y-3">
              <ActionsCard
                status={status}
                isSubmitting={isSubmitting}
                onSendToCrew={() => setDialog("sendToCrew")}
                onCancel={() => setDialog("cancel")}
                onEdit={handleEdit}
              />
              {canMoveToProductionCheck && (
                <div className="bg-white rounded-xl border border-neutral-200 p-3">
                  <button
                    disabled={isSubmitting}
                    onClick={() => onAction("productionCheck")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-[12px] font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors"
                  >
                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ClipboardCheck className="w-3.5 h-3.5" />}
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
              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-100">
                  <FileText className="w-3.5 h-3.5 text-violet-500" />
                  <h3 className="text-[12px] font-semibold text-neutral-800">Contract Documents</h3>
                  {isCompleted
                    ? <span className="ml-auto text-[9px] text-emerald-600 font-mono font-semibold">ALL SIGNED</span>
                    : <span className="ml-auto text-[9px] text-violet-500 font-mono">PENDING SIGNATURE</span>
                  }
                </div>
                <div className="p-4">
                  {offer?._id
                    ? <ContractInstancesPanel offerId={offer._id} offerStatus={offer?.status} />
                    : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FileText className="w-5 h-5 text-violet-300 mb-2" />
                        <p className="text-sm font-semibold text-neutral-500">Loading…</p>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>


          </div>
        )}

        {status === "CANCELLED" && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-6 text-center">
            <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-red-700">This offer has been cancelled.</p>
          </div>
        )}

      </div>

      {/* ── Dialogs ───────────────────────────────────────────────────────────── */}
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

      {/* Extend Contract Dialog — opened via header button or ?openExtend=true */}
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