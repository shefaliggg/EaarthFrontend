/**
 * layouts/LayoutCrew.jsx
 *
 * CREW role only.
 *
 * SENT_TO_CREW / NEEDS_REVISION:
 *   Left:  Offer document preview
 *   Right: Accept Offer, Request Changes, Decline Offer
 *
 * PENDING_CREW_SIGNATURE (and beyond — UPM/FC/STUDIO signing stages):
 *   Left:  ContractInstancesPanel
 *   Right: Sign button (if crew's turn) + Request Changes to Production button
 *
 * "Request Changes" during signing:
 *   → Same RequestChangesDialog → PATCH /offers/:id/request-changes
 *   → NEEDS_REVISION + ChangeRequest created
 *   → Production Admin sees banner + Edit Offer button
 */

import { useState } from "react";
import {
  CheckCircle, MessageSquare, XCircle, PenLine,
  Loader2, Eye, ClipboardCheck, Lock, FileText, Shield,
} from "lucide-react";

import { CreateOfferLayout }  from "../../roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import ContractInstancesPanel from "../../../pages/ContractInstancesPanel";
import { InfoBox }            from "./layoutHelpers";
import { defaultEngineSettings } from "../../../utils/rateCalculations";

// ── helpers ───────────────────────────────────────────────────────────────────

function getInitials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const fmtMoney = (n, currency = "GBP") => {
  const num = parseFloat(n);
  if (!num) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency, minimumFractionDigits: 0 }).format(num);
};

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_MAP = {
  DRAFT:                    { label: "Draft",                  cls: "text-neutral-500 bg-neutral-100 border-neutral-200" },
  SENT_TO_CREW:             { label: "Awaiting Your Response", cls: "text-amber-600 bg-amber-50 border-amber-200"        },
  NEEDS_REVISION:           { label: "Revision Requested",     cls: "text-orange-600 bg-orange-50 border-orange-200"     },
  CREW_ACCEPTED:            { label: "Accepted",               cls: "text-blue-600 bg-blue-50 border-blue-200"           },
  PRODUCTION_CHECK:         { label: "Production Review",      cls: "text-violet-600 bg-violet-50 border-violet-200"     },
  ACCOUNTS_CHECK:           { label: "Accounts Review",        cls: "text-indigo-600 bg-indigo-50 border-indigo-200"     },
  PENDING_CREW_SIGNATURE:   { label: "Sign Required",          cls: "text-purple-600 bg-purple-50 border-purple-200"     },
  PENDING_UPM_SIGNATURE:    { label: "UPM Signing",            cls: "text-purple-600 bg-purple-50 border-purple-200"     },
  PENDING_FC_SIGNATURE:     { label: "FC Signing",             cls: "text-purple-600 bg-purple-50 border-purple-200"     },
  PENDING_STUDIO_SIGNATURE: { label: "Studio Signing",         cls: "text-purple-600 bg-purple-50 border-purple-200"     },
  COMPLETED:                { label: "Completed",              cls: "text-emerald-600 bg-emerald-50 border-emerald-200"  },
  CANCELLED:                { label: "Cancelled",              cls: "text-red-500 bg-red-50 border-red-200"              },
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

// ── Accept dialog ─────────────────────────────────────────────────────────────

function AcceptDialog({ offer, onConfirm, onClose, isLoading }) {
  const jobTitle = offer?.createOwnJobTitle && offer?.newJobTitle ? offer.newJobTitle : offer?.jobTitle || "—";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-emerald-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-[15px] font-bold text-white">Accept this Offer?</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><XCircle className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-5 space-y-4">
          <p className="text-[13px] text-neutral-600 leading-relaxed">
            By accepting, you confirm you have reviewed all terms and conditions and agree to proceed.
            Contracts will be generated and sent for review immediately.
          </p>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 grid grid-cols-2 gap-x-6 gap-y-3">
            {[
              { label: "Role",    value: jobTitle },
              { label: "Fee/day", value: fmtMoney(offer?.feePerDay, offer?.currency) },
              { label: "Start",   value: fmtDate(offer?.startDate) },
              { label: "End",     value: fmtDate(offer?.endDate) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-emerald-600 font-medium mb-0.5">{label}</p>
                <p className="text-[12px] font-semibold text-neutral-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} disabled={isLoading}
            className="flex-1 h-11 rounded-xl border border-neutral-200 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => onConfirm()} disabled={isLoading}
            className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-70 transition-colors">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Accept Offer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Request Changes dialog ─────────────────────────────────────────────────────
// Used BOTH at SENT_TO_CREW stage AND during signing stages.
// Always calls PATCH /offers/:id/request-changes → NEEDS_REVISION

function RequestChangesDialog({ offer, onConfirm, onClose, isLoading, isDuringSigning = false }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-orange-500 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white">Request Changes</h2>
              {offer?.offerCode && (
                <p className="text-[9px] text-white/60 font-mono mt-0.5">{offer.offerCode}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><XCircle className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-5 space-y-3">
          <p className="text-[13px] text-neutral-600 leading-relaxed">
            {isDuringSigning
              ? "Something incorrect in the contract? Describe the issue below. Production Admin will be notified and will update and resend the offer."
              : "Describe the changes needed. Be as specific as possible so production can action them quickly."}
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={isDuringSigning
              ? "E.G., MY DAILY RATE ON THE CONTRACT IS £750 BUT SHOULD BE £850. ALSO MY START DATE IS WRONG — SHOULD BE 20 JAN NOT 14 JAN…"
              : "E.G., THE DAILY RATE DISCUSSED WAS £850, NOT £750. ALSO, I REQUIRE A BOX RENTAL ALLOWANCE OF £400/WK..."}
            rows={5}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] uppercase placeholder:normal-case placeholder:text-neutral-400 text-neutral-800 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-colors"
          />
          {isDuringSigning && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
              <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 110 1.5A.75.75 0 018 4zm.75 7.25h-1.5v-4h1.5v4z"/>
              </svg>
              <p className="text-[10px] text-amber-700 leading-tight">
                This will set the offer to <strong>Needs Revision</strong>. The signing process will pause while production makes corrections.
              </p>
            </div>
          )}
          <p className="text-[10px] text-neutral-400">All text stored in uppercase. Production notified immediately.</p>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} disabled={isLoading}
            className="flex-1 h-11 rounded-xl border border-neutral-200 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { if (!reason.trim()) return; onConfirm({ reason: reason.toUpperCase().trim() }); }}
            disabled={isLoading || !reason.trim()}
            className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            {isDuringSigning ? "Send to Production" : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Decline dialog ────────────────────────────────────────────────────────────

function DeclineDialog({ offer, onConfirm, onClose, isLoading }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-red-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white">Decline Offer</h2>
              {offer?.offerCode && <p className="text-[9px] text-white/60 font-mono mt-0.5">{offer.offerCode}</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><XCircle className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-5 space-y-3">
          <p className="text-[13px] text-neutral-600 leading-relaxed">
            Are you sure you want to decline this offer? You can optionally provide a reason.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Optional: reason for declining..."
            rows={3}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] uppercase placeholder:normal-case placeholder:text-neutral-400 text-neutral-800 resize-none focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition-colors"
          />
          <div className="rounded-xl border border-red-100 bg-red-50 p-3">
            <p className="text-[11px] text-red-600">Production will be notified of your decline. They will review and cancel or revise the offer.</p>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} disabled={isLoading}
            className="flex-1 h-11 rounded-xl border border-neutral-200 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 transition-colors">
            Keep Offer
          </button>
          <button
            onClick={() => onConfirm({ reason: reason.toUpperCase().trim() || "DECLINED BY CREW" })}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Decline Offer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Crew action box — pre-signing ─────────────────────────────────────────────

function CrewActionBox({ status, isSubmitting, onAccept, onRequestChanges, onDecline, onSign }) {
  const canRespond = status === "SENT_TO_CREW" || status === "NEEDS_REVISION";

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-neutral-100 bg-neutral-50/60">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Your Response</p>
      </div>
      <div className="p-3 space-y-2">
        {canRespond && (
          <>
            <button disabled={isSubmitting} onClick={onAccept}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-[13px] font-bold hover:bg-emerald-700 disabled:opacity-60 transition-colors shadow-sm">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Accept Offer
            </button>
            <button disabled={isSubmitting} onClick={onRequestChanges}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-orange-300 text-orange-600 text-[13px] font-semibold hover:bg-orange-50 disabled:opacity-60 transition-colors">
              <MessageSquare className="w-4 h-4" /> Request Changes
            </button>
            <button disabled={isSubmitting} onClick={onDecline}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-500 text-[13px] font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-60 transition-colors">
              Decline Offer
            </button>
          </>
        )}
        {status === "CREW_ACCEPTED" && (
          <InfoBox icon={ClipboardCheck} color="blue">You accepted this offer. Under production review.</InfoBox>
        )}
        {["PRODUCTION_CHECK","ACCOUNTS_CHECK"].includes(status) && (
          <InfoBox icon={ClipboardCheck} color="blue">Offer is under internal review.</InfoBox>
        )}
        {status === "PENDING_CREW_SIGNATURE" && (
          <>
            <InfoBox icon={PenLine} color="purple">All documents require your signature.</InfoBox>
            <button disabled={isSubmitting} onClick={onSign}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white text-[12px] font-semibold hover:bg-purple-700 disabled:opacity-60 transition-colors">
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PenLine className="w-3.5 h-3.5" />}
              Sign All Documents
            </button>
          </>
        )}
        {["PENDING_UPM_SIGNATURE","PENDING_FC_SIGNATURE","PENDING_STUDIO_SIGNATURE"].includes(status) && (
          <InfoBox icon={PenLine} color="purple">You have signed. Awaiting further signatories.</InfoBox>
        )}
        {status === "COMPLETED" && (
          <InfoBox icon={Lock} color="green">Contract fully executed. Welcome to the production!</InfoBox>
        )}
        {status === "CANCELLED" && (
          <InfoBox icon={XCircle} color="red">This offer has been cancelled.</InfoBox>
        )}
        {status === "DRAFT" && (
          <InfoBox icon={Eye} color="gray">Offer has not been sent to you yet.</InfoBox>
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

// ── Signing stage sidebar — sign + request changes ────────────────────────────

function SigningSidebar({
  status, isSubmitting, onSign, onRequestChanges, signingStatus,
}) {
  const canSign     = status === "PENDING_CREW_SIGNATURE";
  const hasSigned   = ["PENDING_UPM_SIGNATURE","PENDING_FC_SIGNATURE","PENDING_STUDIO_SIGNATURE","COMPLETED"].includes(status);
  const isCompleted = status === "COMPLETED";

  return (
    <div className="space-y-3">

      {/* Sign / status card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-2.5">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Your Action</p>

        {canSign && (
          <>
            <InfoBox icon={PenLine} color="purple">
              Please review all documents before signing.
            </InfoBox>
            <button
              disabled={isSubmitting}
              onClick={() => onSign("CREW")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white text-[12px] font-semibold hover:bg-purple-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PenLine className="w-3.5 h-3.5" />}
              Sign All Documents
            </button>
          </>
        )}

        {hasSigned && !isCompleted && (
          <InfoBox icon={PenLine} color="purple">
            You have signed. Awaiting further signatories.
          </InfoBox>
        )}

        {isCompleted && (
          <InfoBox icon={Lock} color="green">
            Contract fully executed. Welcome to the production!
          </InfoBox>
        )}

        {/* ── Request Changes button — always shown during all signing stages ── */}
        {!isCompleted && (
          <button
            disabled={isSubmitting}
            onClick={onRequestChanges}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-orange-300 text-orange-600 text-[11px] font-semibold hover:bg-orange-50 disabled:opacity-60 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Request Changes
          </button>
        )}
      </div>

      {/* Signature status */}
      {signingStatus && <SignatureStatusCard signingStatus={signingStatus} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

export default function LayoutCrew({
  offer, contractData, allowances, calculatedRates,
  signingStatus, isSubmitting, onAction, onSign,
}) {
  // "accept" | "requestChanges" | "decline" | "signingRequestChanges"
  const [dialog, setDialog] = useState(null);

  const status = offer?.status;

  const isSigningStage = [
    "PENDING_CREW_SIGNATURE",
    "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE",
    "PENDING_STUDIO_SIGNATURE",
    "COMPLETED",
  ].includes(status);

  return (
    <>
      <div className="space-y-4">

        <OfferTopBar offer={offer} contractData={contractData} />

        {/* ── Pre-signing: offer doc + response actions ── */}
        {!isSigningStage && (
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <OfferDocumentPane
                offer={offer} contractData={contractData}
                allowances={allowances} calculatedRates={calculatedRates}
              />
            </div>
            <div className="w-[240px] shrink-0">
              <CrewActionBox
                status={status}
                isSubmitting={isSubmitting}
                onAccept={() => setDialog("accept")}
                onRequestChanges={() => setDialog("requestChanges")}
                onDecline={() => setDialog("decline")}
                onSign={() => onSign("CREW")}
              />
            </div>
          </div>
        )}

        {/* ── Signing stage: contract docs + sign / request changes ── */}
        {isSigningStage && (
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-100">
                  <FileText className="w-3.5 h-3.5 text-violet-500" />
                  <h3 className="text-[12px] font-semibold text-neutral-800">Contract Documents</h3>
                  {status === "COMPLETED"
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

            {/* Right sidebar — sign + request changes */}
            <div className="w-[240px] shrink-0">
              <SigningSidebar
                status={status}
                isSubmitting={isSubmitting}
                onSign={onSign}
                onRequestChanges={() => setDialog("signingRequestChanges")}
                signingStatus={signingStatus}
              />
            </div>
          </div>
        )}

      </div>

      {/* ── Dialogs ── */}

      {dialog === "accept" && (
        <AcceptDialog offer={offer} isLoading={isSubmitting}
          onConfirm={async () => { setDialog(null); await onAction("accept"); }}
          onClose={() => setDialog(null)} />
      )}

      {dialog === "requestChanges" && (
        <RequestChangesDialog
          offer={offer}
          isLoading={isSubmitting}
          isDuringSigning={false}
          onConfirm={async (payload) => { setDialog(null); await onAction("requestChanges", payload); }}
          onClose={() => setDialog(null)}
        />
      )}

      {/* Request Changes during signing — same API, slightly different wording */}
      {dialog === "signingRequestChanges" && (
        <RequestChangesDialog
          offer={offer}
          isLoading={isSubmitting}
          isDuringSigning={true}
          onConfirm={async (payload) => {
            setDialog(null);
            await onAction("requestChanges", {
              ...payload,
              fieldName: "CREW_SIGNING_REQUEST_CHANGES",
            });
          }}
          onClose={() => setDialog(null)}
        />
      )}

      {dialog === "decline" && (
        <DeclineDialog offer={offer} isLoading={isSubmitting}
          onConfirm={async (payload) => {
            setDialog(null);
            await onAction("requestChanges", {
              reason: payload.reason || "DECLINED BY CREW",
              fieldName: "DECLINE",
            });
          }}
          onClose={() => setDialog(null)} />
      )}
    </>
  );
}