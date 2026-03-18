/**
 * layouts/LayoutCrew.jsx
 *
 * Crew member view.
 *
 * Main column  → ContractInstancesPanel (stepper + per-document viewer with
 *                signed tick, same component used in LayoutProductionReview)
 * Right sidebar → Signing status card + accept / sign / status actions
 *
 * The old ContractPreviewIframe tab has been replaced with the full
 * ContractInstancesPanel so crew sees each document individually, with a
 * green tick on documents already signed, exactly matching the production
 * review experience.
 */

import { useState } from "react";
import {
  Eye, CheckCircle, XCircle, PenLine, ClipboardCheck,
  Loader2, MessageSquare, Lock, FileText, Shield,
} from "lucide-react";

import ContractInstancesPanel from "../../../pages/ContractInstancesPanel";
import OfferActionDialog      from "../../onboarding/OfferActionDialog";
import CrewIdentityHeader     from "./CrewIdentityHeader";

import {
  SidebarSigningCard,
  InfoBox,
} from "./layoutHelpers";

// ── Signing status sidebar card ───────────────────────────────────────────────
// Shows CREW / UPM / FC / STUDIO with filled circle if signed

function SignatureStatusCard({ signingStatus }) {
  const sigs = signingStatus?.signatories ?? [];

  const order = [
    { role: "CREW",   label: "Crew Member"          },
    { role: "UPM",    label: "UPM"                   },
    { role: "FC",     label: "Financial Controller"  },
    { role: "STUDIO", label: "Production Executive"  },
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
                signed
                  ? "bg-teal-500 border-teal-500"
                  : "bg-white border-neutral-300"
              }`}>
                {signed && (
                  <svg className="w-2 h-2 text-white" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className={`text-[11px] font-medium ${
                signed ? "text-teal-700" : "text-neutral-500"
              }`}>
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

// ── Action sidebar ────────────────────────────────────────────────────────────

function CrewActionSidebar({
  offer, signingStatus, isSubmitting, onAction, onSign, onOpenDialog,
}) {
  const status = offer?.status;

  return (
    <div className="space-y-3">

      {/* Primary action card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-2.5">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
          Your Response
        </p>

        {/* Not sent yet */}
        {status === "DRAFT" && (
          <InfoBox icon={Eye} color="gray">
            Offer has not been sent to you yet.
          </InfoBox>
        )}

        {/* Awaiting crew response */}
        {(status === "SENT_TO_CREW" || status === "NEEDS_REVISION") && (
          <>
            <InfoBox icon={Eye} color="blue">
              Review the contract carefully before responding.
            </InfoBox>
            <button
              disabled={isSubmitting}
              onClick={() => onOpenDialog("acceptOffer")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 text-white text-[12px] font-semibold hover:bg-teal-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <CheckCircle className="w-3.5 h-3.5" />
              }
              Accept Offer
            </button>
            <button
              disabled={isSubmitting}
              onClick={() => onOpenDialog("requestChanges")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 text-[12px] font-semibold hover:bg-red-50 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Request Changes
            </button>
          </>
        )}

        {/* Under production/accounts review */}
        {status === "CREW_ACCEPTED" && (
          <InfoBox icon={ClipboardCheck} color="blue">
            You accepted this offer. Under production review.
          </InfoBox>
        )}
        {["PRODUCTION_CHECK", "ACCOUNTS_CHECK"].includes(status) && (
          <InfoBox icon={ClipboardCheck} color="blue">
            Offer is under internal review.
          </InfoBox>
        )}

        {/* Pending crew signature */}
        {status === "PENDING_CREW_SIGNATURE" && (
          <>
            <InfoBox icon={PenLine} color="purple">
              All documents require your signature below.
            </InfoBox>
            <button
              disabled={isSubmitting}
              onClick={() => onSign("CREW")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white text-[12px] font-semibold hover:bg-purple-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <PenLine className="w-3.5 h-3.5" />
              }
              Sign All Documents
            </button>
          </>
        )}

        {/* Signed — awaiting other signatories */}
        {["PENDING_UPM_SIGNATURE", "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE"].includes(status) && (
          <InfoBox icon={PenLine} color="purple">
            You have signed. Awaiting further signatories.
          </InfoBox>
        )}

        {/* Completed */}
        {status === "COMPLETED" && (
          <InfoBox icon={CheckCircle} color="green">
            Contract fully executed. Welcome to the production!
          </InfoBox>
        )}

        {/* Cancelled */}
        {status === "CANCELLED" && (
          <InfoBox icon={XCircle} color="red">
            This offer has been cancelled.
          </InfoBox>
        )}
      </div>

      {/* Signature status — shows which roles have signed */}
      {signingStatus && (
        <SignatureStatusCard signingStatus={signingStatus} />
      )}

    </div>
  );
}

// ── Fallback when offer._id is not yet available ─────────────────────────────

function NoContractsPlaceholder({ status }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-3">
        <FileText className="w-5 h-5 text-violet-300" />
      </div>
      <p className="text-sm font-semibold text-neutral-500">Loading offer…</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LayoutCrew({
  offer, contractData, allowances, calculatedRates,
  signingStatus, previewHtml, isLoadingPrev,
  isSubmitting, onAction, onSign,
}) {
  const [dialog, setDialog] = useState(null);
  const status  = offer?.status;

  // Statuses where instances definitely exist — used only for the badge label
  const signingInProgress = [
    "PENDING_CREW_SIGNATURE",
    "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE",
    "PENDING_STUDIO_SIGNATURE",
  ].includes(status);

  return (
    <>
      {/* Identity header — same as LayoutProductionReview */}
      <CrewIdentityHeader
        contractData={contractData}
        offer={offer}
        showEdit={false}
      />

      <div className="flex gap-4 items-start">

        {/* ── Left column: contract documents ── */}
        <div className="flex-1 min-w-0 space-y-4">

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-100">
              <FileText className="w-3.5 h-3.5 text-violet-500" />
              <h3 className="text-[12px] font-semibold text-neutral-800">
                Contract Documents
              </h3>
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
              {/* Always render — ContractInstancesPanel manages its own
                  loading / empty / retry state internally */}
              {offer?._id ? (
                <ContractInstancesPanel offerId={offer._id} />
              ) : (
                <NoContractsPlaceholder status={status} />
              )}
            </div>
          </div>

        </div>

        {/* ── Right column: actions + status ── */}
        <div className="w-[260px] shrink-0">
          <CrewActionSidebar
            offer={offer}
            signingStatus={signingStatus}
            isSubmitting={isSubmitting}
            onAction={onAction}
            onSign={onSign}
            onOpenDialog={setDialog}
          />
        </div>

      </div>

      {/* Dialogs */}
      {dialog === "acceptOffer" && (
        <OfferActionDialog
          type="acceptOffer"
          offer={offer}
          open
          onConfirm={async (p) => { setDialog(null); await onAction("accept", p); }}
          onClose={() => setDialog(null)}
          isLoading={isSubmitting}
        />
      )}
      {dialog === "requestChanges" && (
        <OfferActionDialog
          type="requestChanges"
          offer={offer}
          open
          onConfirm={async (p) => { setDialog(null); await onAction("requestChanges", p); }}
          onClose={() => setDialog(null)}
          isLoading={isSubmitting}
        />
      )}
    </>
  );
}