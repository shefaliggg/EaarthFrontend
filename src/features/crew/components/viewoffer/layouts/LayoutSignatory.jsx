/**
 * layouts/LayoutSignatory.jsx
 *
 * Shared layout for UPM, FC, STUDIO signing stages.
 *
 * "Request Changes" button lives inside the sidebar action card —
 * same pattern as LayoutCrew's SigningSidebar.
 * Clicking opens EditRequestDialog (role-specific wording).
 * Submitting calls PATCH /offers/:id/request-changes → NEEDS_REVISION + ChangeRequest.
 */

import { useState }           from "react";
import { useParams }          from "react-router-dom";
import { toast }              from "sonner";
import {
  Eye, CheckCircle, XCircle, PenLine, ClipboardCheck,
  Loader2, FileText, Shield, Lock, Edit2, Send, X, MessageSquare,
} from "lucide-react";

import ContractInstancesPanel from "../../../pages/ContractInstancesPanel";
import CrewIdentityHeader     from "./CrewIdentityHeader";
import { InfoBox }            from "./layoutHelpers";

import {
  crewRequestChangesThunk,
  getOfferThunk,
} from "../../../store/offer.slice";

// ── Role config ───────────────────────────────────────────────────────────────

const ROLE_CFG = {
  UPM: {
    label:          "Unit Production Manager",
    short:          "UPM",
    requiredStatus: "PENDING_UPM_SIGNATURE",
    waitingMsg:     "Awaiting crew signature before UPM can sign.",
    signedMsg:      "You have signed as UPM. Awaiting Financial Controller.",
    badge:          { bg: "bg-violet-100", text: "text-violet-700" },
    heading:        "Send Edit Request to Production",
    description:    "As UPM, if you have identified an issue with the contract terms, rates, or crew details that requires amendment before you can sign, describe the required changes below. Production Admin will be notified immediately.",
    placeholder:    "E.G., OVERTIME RATE IS INCORRECT — SHOULD REFLECT THE AGREED SCHEDULE D RATES. ALSO THE ENGAGEMENT TYPE SHOULD BE LOAN OUT…",
  },
  FC: {
    label:          "Financial Controller",
    short:          "FC",
    requiredStatus: "PENDING_FC_SIGNATURE",
    waitingMsg:     "Awaiting UPM signature before FC can sign.",
    signedMsg:      "You have signed as FC. Awaiting Studio approval.",
    badge:          { bg: "bg-amber-100", text: "text-amber-700" },
    heading:        "Send Financial Correction to Production",
    description:    "As Financial Controller, if you have identified discrepancies in the fee structure, budget codes, allowances, or tax status that must be corrected before you can sign, detail the corrections needed below.",
    placeholder:    "E.G., BUDGET CODE FOR BOX RENTAL IS INCORRECT — SHOULD BE AC-4421 NOT AC-4412. OVERTIME CAP IS ALSO MISSING…",
  },
  STUDIO: {
    label:          "Approved Production Executive",
    short:          "Studio",
    requiredStatus: "PENDING_STUDIO_SIGNATURE",
    waitingMsg:     "Awaiting FC signature before Studio can sign.",
    signedMsg:      "Contract fully executed.",
    badge:          { bg: "bg-purple-100", text: "text-purple-700" },
    heading:        "Request Offer Amendment",
    description:    "As the approving Production Executive, if you require changes to the offer before final sign-off, describe the amendments required below. Production Admin will receive your notes and action the changes.",
    placeholder:    "E.G., ENGAGEMENT TYPE SHOULD BE LOAN OUT NOT PAYE. ALSO THE DEPARTMENT LISTED IS INCORRECT — SHOULD BE CAMERA NOT GRIP…",
  },
};

// ── Request Changes Dialog ────────────────────────────────────────────────────

function RequestChangesDialog({ role, offer, onConfirm, onClose, isLoading }) {
  const [notes, setNotes] = useState("");
  const cfg           = ROLE_CFG[role] || ROLE_CFG.UPM;
  const recipientName = offer?.recipient?.fullName || "";
  const offerCode     = offer?.offerCode || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        <div className="bg-orange-500 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white leading-tight">
                {cfg.heading}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${cfg.badge.bg} ${cfg.badge.text}`}>
                  {cfg.label}
                </span>
                {offerCode && (
                  <span className="text-[9px] text-white/60 font-mono">{offerCode}</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {recipientName && (
            <p className="text-[12px] text-neutral-500">
              Offer for <strong className="text-neutral-800">{recipientName}</strong>
            </p>
          )}
          <p className="text-[13px] text-neutral-600 leading-relaxed">
            {cfg.description}
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={cfg.placeholder}
            rows={5}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] uppercase placeholder:normal-case placeholder:text-neutral-400 text-neutral-800 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-colors"
          />
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
            <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 110 1.5A.75.75 0 018 4zm.75 7.25h-1.5v-4h1.5v4z"/>
            </svg>
            <p className="text-[10px] text-amber-700 leading-tight">
              This will set the offer to <strong>Needs Revision</strong>. Production Admin will be notified and can edit and resend to crew.
            </p>
          </div>
          <p className="text-[10px] text-neutral-400">All text is stored in uppercase.</p>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl border border-neutral-200 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (!notes.trim()) return; onConfirm(notes.trim().toUpperCase()); }}
            disabled={isLoading || !notes.trim()}
            className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
            Send to Production
          </button>
        </div>

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
        <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
          Signature Status
        </span>
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
                    <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`text-[11px] font-medium ${signed ? "text-teal-700" : "text-neutral-500"}`}>
                {label}
              </span>
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

// ── Signatory sidebar ─────────────────────────────────────────────────────────

function SignatorySidebar({
  role, offer, signingStatus, isSubmitting, onSign, onRequestChanges,
}) {
  const status    = offer?.status;
  const cfg       = ROLE_CFG[role];
  if (!cfg) return null;

  const canSign     = status === cfg.requiredStatus;
  const isCompleted = status === "COMPLETED";
  const isCancelled = status === "CANCELLED";
  const sigs        = signingStatus?.signatories ?? [];
  const mySig       = sigs.find((s) => s.role === role);
  const iSigned     = !!mySig?.signed;

  return (
    <div className="space-y-3">

      {/* Role badge */}
      <div className="bg-white rounded-xl border border-neutral-200 px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
            <Shield className="w-3 h-3 text-violet-600" />
          </div>
          <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider">
            {cfg.label}
          </span>
        </div>
        <p className="text-[10px] text-neutral-400">Signing as {cfg.short}</p>
      </div>

      {/* Action card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3 space-y-2">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
          Your Action
        </p>

        {/* Waiting for prior signature */}
        {!canSign && !iSigned && !isCompleted && !isCancelled && (
          <InfoBox icon={ClipboardCheck} color="blue">{cfg.waitingMsg}</InfoBox>
        )}

        {/* Can sign */}
        {canSign && !iSigned && (
          <>
            <InfoBox icon={Eye} color="purple">
              Please review all documents before signing.
            </InfoBox>
            <button
              disabled={isSubmitting}
              onClick={() => onSign(role)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white text-[12px] font-semibold hover:bg-purple-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <PenLine className="w-3.5 h-3.5" />
              }
              Sign as {cfg.short}
            </button>
          </>
        )}

        {/* Already signed */}
        {iSigned && !isCompleted && (
          <InfoBox icon={CheckCircle} color="green">{cfg.signedMsg}</InfoBox>
        )}

        {isCompleted && (
          <InfoBox icon={Lock} color="green">Contract fully executed and locked.</InfoBox>
        )}

        {isCancelled && (
          <InfoBox icon={XCircle} color="red">This offer has been cancelled.</InfoBox>
        )}

        {/* Request Changes — shown for all non-terminal states */}
        {!isCompleted && !isCancelled && (
          <>
            <div className="border-t border-neutral-100 my-1" />
            <button
              disabled={isSubmitting}
              onClick={onRequestChanges}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-orange-300 text-orange-600 text-[13px] font-semibold hover:bg-orange-50 disabled:opacity-60 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Request Changes
            </button>
          </>
        )}
      </div>

      {signingStatus && <SignatureStatusCard signingStatus={signingStatus} />}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function LayoutSignatory({
  role,
  offer, contractData,
  signingStatus,
  isSubmitting, onSign,
  dispatch,
}) {
  const { id } = useParams();
  const offerId = id || offer?._id;

  const [showDialog,   setShowDialog  ] = useState(false);
  const [isSending,    setIsSending   ] = useState(false);
  const [requestSent,  setRequestSent ] = useState(false);

  const status = offer?.status;

  const signingInProgress = [
    "PENDING_CREW_SIGNATURE",
    "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE",
    "PENDING_STUDIO_SIGNATURE",
  ].includes(status);

  const handleConfirm = async (reason) => {
    if (!offerId || !reason) return;
    setIsSending(true);
    toast.loading("Sending to production…", { id: "rc-req" });
    try {
      const result = await dispatch(
        crewRequestChangesThunk({
          offerId,
          reason,
          fieldName: `${role}_REQUEST_CHANGES`,
        })
      );
      toast.dismiss("rc-req");
      if (!result.error) {
        toast.success("Request sent. Offer set to Needs Revision.");
        setShowDialog(false);
        setRequestSent(true);
        dispatch(getOfferThunk(offerId));
      } else {
        toast.error(result.payload?.message || "Failed to send. Please try again.");
      }
    } catch (err) {
      toast.dismiss("rc-req");
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Top identity bar — no edit button, info only */}
      <CrewIdentityHeader
        contractData={contractData}
        offer={offer}
      />

      {/* Sent confirmation banner */}
      {requestSent && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Send className="w-4 h-4 text-amber-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-amber-800">
              Request sent to Production
            </p>
            <p className="text-[10px] text-amber-600 mt-0.5">
              Offer is now <strong>Needs Revision</strong>. Production Admin will review, edit and resend to crew.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-4 items-start">

        {/* Left — contract documents */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-100">
              <FileText className="w-3.5 h-3.5 text-violet-500" />
              <h3 className="text-[12px] font-semibold text-neutral-800">Contract Documents</h3>
              {status === "COMPLETED" && (
                <span className="ml-auto text-[9px] text-emerald-600 font-mono font-semibold">
                  ALL SIGNED
                </span>
              )}
              {signingInProgress && (
                <span className="ml-auto text-[9px] text-violet-500 font-mono">
                  PENDING SIGNATURE
                </span>
              )}
            </div>
            <div className="p-4">
              {offer?._id ? (
                <ContractInstancesPanel offerId={offer._id} />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-violet-300" />
                  </div>
                  <p className="text-sm font-semibold text-neutral-500">Loading offer…</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — signing sidebar with Request Changes button */}
        <div className="w-[260px] shrink-0">
          <SignatorySidebar
            role={role}
            offer={offer}
            signingStatus={signingStatus}
            isSubmitting={isSubmitting}
            onSign={onSign}
            onRequestChanges={() => !requestSent && setShowDialog(true)}
          />
        </div>

      </div>

      {/* Request Changes dialog */}
      {showDialog && (
        <RequestChangesDialog
          role={role}
          offer={offer}
          onConfirm={handleConfirm}
          onClose={() => setShowDialog(false)}
          isLoading={isSending}
        />
      )}
    </>
  );
}