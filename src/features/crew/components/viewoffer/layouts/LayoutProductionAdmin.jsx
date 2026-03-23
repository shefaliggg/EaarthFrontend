/**
 * layouts/LayoutProductionAdmin.jsx
 *
 * EDIT BUTTON ROUTING:
 *   NEEDS_REVISION → /offers/:id/edit?redirectTo=view
 *     → CreateOffer edit → save → back to ViewOffer
 *
 *   PRODUCTION_CHECK (came from Accounts "Return to Production" or normal flow)
 *     → /offers/:id/edit?redirectTo=onboarding
 *     → CreateOffer edit → save → back to Onboarding
 *
 * ChangeRequestBanner shown for both NEEDS_REVISION and PRODUCTION_CHECK
 * so production always sees crew/accounts notes before editing.
 */

import { useState }               from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Edit2, Send, ClipboardCheck, PenLine, Loader2,
  Eye, FileText, Lock, Shield, XCircle, CheckCircle,
} from "lucide-react";

import { CreateOfferLayout }  from "../../roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import ContractInstancesPanel from "../../../pages/ContractInstancesPanel";
import OfferActionDialog      from "../../onboarding/OfferActionDialog";
import ChangeRequestBanner    from "../../../components/viewoffer/layouts/ChangeRequestBanner";
import { InfoBox }            from "./layoutHelpers";

import { defaultEngineSettings } from "../../../utils/rateCalculations";

// ── helpers ───────────────────────────────────────────────────────────────────

function getInitials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
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

// ── Top identity bar ──────────────────────────────────────────────────────────

function OfferTopBar({ offer, contractData }) {
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
  // Show Edit button on NEEDS_REVISION and PRODUCTION_CHECK (accounts returned)
  const showEdit      = needsRevision || status === "PRODUCTION_CHECK";

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-neutral-100 bg-neutral-50/60">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Actions</p>
      </div>
      <div className="p-3 space-y-2">

        {/* Edit Offer button — for NEEDS_REVISION and PRODUCTION_CHECK */}
        {showEdit && (
          <button
            onClick={onEdit}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500 text-white text-[12px] font-semibold hover:bg-orange-600 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Offer
          </button>
        )}

        {/* Send / Resend to Crew */}
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

        {/* Awaiting info */}
        {isSent && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200">
            <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <p className="text-[11px] text-amber-700 font-medium">Awaiting crew response</p>
          </div>
        )}

        {/* Cancel */}
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

// ── Signature status card ─────────────────────────────────────────────────────

function SignatureStatusCard({ signingStatus }) {
  const sigs  = signingStatus?.signatories ?? [];
  const order = [
    { role: "CREW",   label: "Crew Member"         },
    { role: "UPM",    label: "UPM"                  },
    { role: "FC",     label: "Financial Controller" },
    { role: "STUDIO", label: "Production Executive" },
  ];
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-neutral-100 bg-teal-50">
        <Shield className="w-3.5 h-3.5 text-teal-600" />
        <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Signature Status</span>
      </div>
      <div className="px-3 py-3 space-y-2">
        {order.map(({ role, label }) => {
          const sig    = sigs.find((s) => s.role === role);
          const signed = !!sig?.signed;
          return (
            <div key={role} className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                signed ? "bg-teal-500 border-teal-500" : "bg-white border-neutral-300"
              }`}>
                {signed && (
                  <svg className="w-2 h-2 text-white" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`text-[11px] font-medium ${signed ? "text-teal-700" : "text-neutral-500"}`}>{label}</span>
              {signed && sig?.signedAt && (
                <span className="ml-auto text-[9px] text-neutral-400 shrink-0">
                  {new Date(sig.signedAt).toLocaleDateString("en-GB")}
                </span>
              )}
            </div>
          );
        })}
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
  const proj            = projectName || "demo-project";

  const [dialog, setDialog] = useState(null);

  const status = offer?.status;

  const isMonitoringStage = ["DRAFT", "SENT_TO_CREW", "NEEDS_REVISION", "CREW_ACCEPTED", "PRODUCTION_CHECK"].includes(status);
  const isSigningStage    = [
    "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE", "COMPLETED",
  ].includes(status);

  const isCompleted              = status === "COMPLETED";
  const canMoveToProductionCheck = status === "CREW_ACCEPTED";

  // ── Edit button routing ────────────────────────────────────────────────────
  // NEEDS_REVISION → redirectTo=view  (come back to ViewOffer after save)
  // PRODUCTION_CHECK → redirectTo=onboarding (came from accounts or prod review)
  const handleEdit = () => {
    if (!offer?._id) return;
    const redirectTo = status === "NEEDS_REVISION" ? "view" : "onboarding";
    navigate(`/projects/${proj}/offers/${offer._id}/edit?redirectTo=${redirectTo}`);
  };

  return (
    <>
      <div className="space-y-4">

        {/* ── Top identity bar ─────────────────────────────────────────────── */}
        <OfferTopBar offer={offer} contractData={contractData} />

        {/* ── Change request banner ─────────────────────────────────────────
            Shown for NEEDS_REVISION (crew requested changes)
            AND PRODUCTION_CHECK (accounts returned with notes)
            Both use ChangeRequestBanner — it auto-detects fieldName=ACCOUNTS_REVIEW
            and renders indigo "Accounts Flagged Issues" vs orange "Crew Requested Changes"
        ─────────────────────────────────────────────────────────────────── */}
        {(status === "NEEDS_REVISION" || status === "PRODUCTION_CHECK") && offer?._id && (
          <ChangeRequestBanner offerId={offer._id} />
        )}

        {/* ════════════════════════════════════════════════════════════════════
            MONITORING — DRAFT / SENT_TO_CREW / NEEDS_REVISION / CREW_ACCEPTED
                         / PRODUCTION_CHECK
        ════════════════════════════════════════════════════════════════════ */}
        {isMonitoringStage && (
          <div className="flex gap-4 items-start">

            {/* Left — offer document */}
            <div className="flex-1 min-w-0">
              <OfferDocumentPane
                offer={offer} contractData={contractData}
                allowances={allowances} calculatedRates={calculatedRates}
              />
            </div>

            {/* Right — actions */}
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

        {/* ════════════════════════════════════════════════════════════════════
            SIGNING — PENDING_*_SIGNATURE / COMPLETED
        ════════════════════════════════════════════════════════════════════ */}
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
                    ? <ContractInstancesPanel offerId={offer._id} />
                    : <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FileText className="w-5 h-5 text-violet-300 mb-2" />
                        <p className="text-sm font-semibold text-neutral-500">Loading…</p>
                      </div>
                  }
                </div>
              </div>
            </div>
            <div className="w-[240px] shrink-0 space-y-3">
              <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-2.5">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Contract Status</p>
                {status === "PENDING_CREW_SIGNATURE" && (
                  <>
                    <InfoBox icon={PenLine} color="purple">Awaiting crew signature on all documents.</InfoBox>
                    <button disabled={isSubmitting} onClick={() => onSign("CREW")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white text-[12px] font-semibold hover:bg-purple-700 disabled:opacity-60 transition-colors">
                      {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PenLine className="w-3.5 h-3.5" />}
                      Sign as Crew
                    </button>
                  </>
                )}
                {["PENDING_UPM_SIGNATURE", "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE"].includes(status) && (
                  <InfoBox icon={Eye} color="blue">Signing in progress. Monitor signature status below.</InfoBox>
                )}
                {isCompleted && (
                  <InfoBox icon={Lock} color="green">Contract fully executed and locked.</InfoBox>
                )}
              </div>
              {signingStatus && <SignatureStatusCard signingStatus={signingStatus} />}
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
    </>
  );
}