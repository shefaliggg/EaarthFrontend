/**
 * layouts/LayoutSignatory.jsx
 *
 * Shared layout for UPM, FC, STUDIO.
 *
 * "Edit Offer" → OfferActionDialog type="sendToProduction" role={role}
 * Each role gets its own description text inside the dialog.
 * onConfirm(notes) → navigate to /offers/:id/edit
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Eye, CheckCircle, XCircle, PenLine, ClipboardCheck,
  Loader2, FileText, Shield, Lock,
} from "lucide-react";

import ContractInstancesPanel from "../../../pages/ContractInstancesPanel";
import OfferActionDialog      from "../../onboarding/OfferActionDialog";
import CrewIdentityHeader     from "./CrewIdentityHeader";
import { InfoBox }            from "./layoutHelpers";

// ── Role config ───────────────────────────────────────────────────────────────

const ROLE_CFG = {
  UPM: {
    label:          "Unit Production Manager",
    short:          "UPM",
    requiredStatus: "PENDING_UPM_SIGNATURE",
    waitingMsg:     "Awaiting crew signature before UPM can sign.",
    signedMsg:      "You have signed as UPM. Awaiting Financial Controller.",
  },
  FC: {
    label:          "Financial Controller",
    short:          "FC",
    requiredStatus: "PENDING_FC_SIGNATURE",
    waitingMsg:     "Awaiting UPM signature before FC can sign.",
    signedMsg:      "You have signed as FC. Awaiting Studio approval.",
  },
  STUDIO: {
    label:          "Approved Production Executive",
    short:          "Studio",
    requiredStatus: "PENDING_STUDIO_SIGNATURE",
    waitingMsg:     "Awaiting FC signature before Studio can sign.",
    signedMsg:      "Contract fully executed.",
  },
};

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

// ── Signatory action sidebar ──────────────────────────────────────────────────

function SignatorySidebar({ role, offer, signingStatus, isSubmitting, onSign }) {
  const status = offer?.status;
  const cfg    = ROLE_CFG[role];
  if (!cfg) return null;

  const canSign     = status === cfg.requiredStatus;
  const isCompleted = status === "COMPLETED";
  const isCancelled = status === "CANCELLED";

  const sigs    = signingStatus?.signatories ?? [];
  const mySig   = sigs.find((s) => s.role === role);
  const iSigned = !!mySig?.signed;

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
      <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-2.5">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
          Your Action
        </p>

        {!canSign && !iSigned && !isCompleted && !isCancelled && (
          <InfoBox icon={ClipboardCheck} color="blue">{cfg.waitingMsg}</InfoBox>
        )}

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
                : <PenLine className="w-3.5 h-3.5" />}
              Sign as {cfg.short}
            </button>
          </>
        )}

        {iSigned && !isCompleted && (
          <InfoBox icon={CheckCircle} color="green">{cfg.signedMsg}</InfoBox>
        )}

        {isCompleted && (
          <InfoBox icon={Lock} color="green">Contract fully executed and locked.</InfoBox>
        )}

        {isCancelled && (
          <InfoBox icon={XCircle} color="red">This offer has been cancelled.</InfoBox>
        )}
      </div>

      {signingStatus && <SignatureStatusCard signingStatus={signingStatus} />}

    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function LayoutSignatory({
  role,
  offer, contractData, allowances, calculatedRates,
  signingStatus, previewHtml, isLoadingPrev,
  isSubmitting, onAction, onSign,
}) {
  const navigate            = useNavigate();
  const { id, projectName } = useParams();
  const proj                = projectName || "demo-project";
  const offerId             = id || offer?._id;

  const [showEditDialog, setShowEditDialog] = useState(false);

  const status = offer?.status;

  const signingInProgress = [
    "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE",
    "PENDING_STUDIO_SIGNATURE",
  ].includes(status);

  return (
    <>
      {/* Edit Offer → sendToProduction dialog with this role's text → navigate on confirm */}
      <CrewIdentityHeader
        contractData={contractData}
        offer={offer}
        showEdit={false}
        onToggleEdit={() => setShowEditDialog(true)}
      />

      <div className="flex gap-4 items-start">

        {/* Left column */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-100">
              <FileText className="w-3.5 h-3.5 text-violet-500" />
              <h3 className="text-[12px] font-semibold text-neutral-800">Contract Documents</h3>
              {status === "COMPLETED" && (
                <span className="ml-auto text-[9px] text-emerald-600 font-mono font-semibold">ALL SIGNED</span>
              )}
              {signingInProgress && (
                <span className="ml-auto text-[9px] text-violet-500 font-mono">PENDING SIGNATURE</span>
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

        {/* Right column */}
        <div className="w-[260px] shrink-0">
          <SignatorySidebar
            role={role}
            offer={offer}
            signingStatus={signingStatus}
            isSubmitting={isSubmitting}
            onSign={onSign}
          />
        </div>

      </div>

      {/* Send to Production — role prop drives the description text */}
      <OfferActionDialog
        type="sendToProduction"
        role={role}
        offer={offer}
        open={showEditDialog}
        onConfirm={(notes) => {
          setShowEditDialog(false);
          navigate(`/projects/${proj}/offers/${offerId}/edit`);
        }}
        onClose={() => setShowEditDialog(false)}
        isLoading={false}
      />
    </>
  );
}