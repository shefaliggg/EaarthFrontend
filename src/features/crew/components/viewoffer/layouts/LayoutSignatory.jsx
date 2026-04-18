/**
 * layouts/LayoutSignatory.jsx
 *
 * FIXES APPLIED:
 *   - handleSignInstance passes { instanceId, signatureImage } as an object
 *     to signContractInstanceThunk (previously passed instanceId as a plain
 *     string, so signatureImage was silently dropped by the thunk).
 *   - No clearInstances() on post-sign refresh (prevents UI flicker).
 *   - profileSignature reads from Redux store first, falls back to prop.
 *   - Everything else unchanged.
 */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  PenLine, MessageSquare, Lock, FileText, Shield,
  CheckCircle2, Clock, XCircle, Loader2,
} from "lucide-react";

import ContractInstancesPanel from "../../../pages/ContractInstancesPanel";
import { InfoBox }            from "./layoutHelpers";
import {
  signContractInstanceThunk,
  selectInstancesSigning,
  getContractInstancesThunk,
} from "../../../store/contractInstances.slice";
import OfferActionDialog from "../../../components/onboarding/OfferActionDialog";

import { selectProfileSignatureUrl } from "../../../../signature/store/signature.slice";

// ── Role config ───────────────────────────────────────────────────────────────

const ROLE_LABEL = {
  UPM:    "Unit Production Manager",
  FC:     "Financial Controller",
  STUDIO: "Production Executive",
};

const SIGNING_STATUS_FOR_ROLE = {
  UPM:    "PENDING_UPM_SIGNATURE",
  FC:     "PENDING_FC_SIGNATURE",
  STUDIO: "PENDING_STUDIO_SIGNATURE",
};

const ROLE_SIGNABLE_STATUS = SIGNING_STATUS_FOR_ROLE;

const HAS_SIGNED_STATUSES = {
  UPM:    ["PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE", "COMPLETED"],
  FC:     ["PENDING_STUDIO_SIGNATURE", "COMPLETED"],
  STUDIO: ["COMPLETED"],
};

const SIGNING_STAGE_STATUSES = [
  "PENDING_CREW_SIGNATURE",
  "PENDING_UPM_SIGNATURE",
  "PENDING_FC_SIGNATURE",
  "PENDING_STUDIO_SIGNATURE",
  "COMPLETED",
];

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
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--mint-50)" }}
      >
        <Shield className="w-3.5 h-3.5" style={{ color: "var(--mint-600)" }} />
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: "var(--mint-700)" }}
        >
          Signature Status
        </span>
      </div>
      <div className="px-3 py-3 space-y-2">
        {order.map(({ role, label }) => {
          const sig    = sigs.find((s) => s.role === role);
          const signed = !!sig?.signed;
          return (
            <div key={role} className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                style={
                  signed
                    ? { background: "var(--mint-500)", borderColor: "var(--mint-500)" }
                    : { background: "var(--card)", borderColor: "var(--border)" }
                }
              >
                {signed && (
                  <svg className="w-2 h-2 text-white" viewBox="0 0 8 8" fill="none">
                    <path
                      d="M1.5 4l2 2 3-3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                className="text-[11px] font-medium"
                style={{ color: signed ? "var(--mint-700)" : "var(--muted-foreground)" }}
              >
                {label}
              </span>
              {signed && sig?.signedAt && (
                <span
                  className="ml-auto text-[9px] shrink-0"
                  style={{ color: "var(--muted-foreground)" }}
                >
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
  role, status, isSubmitting, signingStatus, onRequestChanges,
}) {
  const myTurn    = status === SIGNING_STATUS_FOR_ROLE[role];
  const hasSigned = HAS_SIGNED_STATUSES[role]?.includes(status);
  const completed = status === "COMPLETED";
  const waiting   = !myTurn && !hasSigned && !completed;

  return (
    <div className="space-y-3">
      <div
        className="rounded-xl p-4 space-y-2.5"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-1"
          style={{ color: "var(--muted-foreground)" }}
        >
          Your Action
        </p>

        {myTurn && (
          <InfoBox icon={PenLine} color="purple">
            Click your highlighted signature field inside each document to sign inline.
          </InfoBox>
        )}

        {waiting && (
          <InfoBox icon={Clock} color="blue">
            Awaiting prior signatures before you can sign.
          </InfoBox>
        )}

        {hasSigned && !completed && (
          <InfoBox icon={PenLine} color="purple">
            You have signed. Awaiting further signatories.
          </InfoBox>
        )}

        {completed && (
          <InfoBox icon={Lock} color="green">
            Contract fully executed.
          </InfoBox>
        )}

        {!completed && (
          <button
            disabled={isSubmitting}
            onClick={onRequestChanges}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[11px] font-semibold disabled:opacity-60 transition-colors"
            style={{
              border: "2px solid var(--peach-300)",
              color: "var(--peach-600)",
              background: "transparent",
            }}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Request Changes
          </button>
        )}
      </div>

      {signingStatus && <SignatureStatusCard signingStatus={signingStatus} />}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function LayoutSignatory({
  offer,
  contractData,
  allowances,
  calculatedRates,
  isSubmitting,
  onAction,
  dispatch: _dispatch,
  profileSignature: profileSignatureProp,
  role,
  salaryBudgetCodes,
  salaryTags,
  overtimeBudgetCodes,
  overtimeTags,
  signingStatus,
  previewHtml,
  isLoadingPrev,
  onSign,
}) {
  const dispatch  = useDispatch();
  const isSigning = useSelector(selectInstancesSigning);

  // Profile signature: prefer Redux store, fall back to prop
  const profileSignatureFromStore = useSelector(selectProfileSignatureUrl);
  const profileSignature = profileSignatureFromStore ?? profileSignatureProp ?? null;

  const [dialog, setDialog] = useState(null);

  const status         = offer?.status;
  const isSigningStage = SIGNING_STAGE_STATUSES.includes(status);
  const requiredStatus = ROLE_SIGNABLE_STATUS[role];
  const canSign        = !!requiredStatus && status === requiredStatus;
  const canSignRole    = canSign;

  // ── Per-document sign handler ─────────────────────────────────────────────
  // FIX: pass { instanceId, signatureImage } object — the thunk now expects this
  // shape. Previously instanceId was passed as a plain string and signatureImage
  // was silently discarded.
  const handleSignInstance = async (instanceId, meta = {}) => {
    const signatureImage = meta.signatureUrl ?? profileSignature ?? undefined;

    const result = await dispatch(
      signContractInstanceThunk({ instanceId, signatureImage })
    );

    if (result.error) {
      const msg =
        result.payload?.message ||
        result.payload?.error ||
        "Failed to sign document";
      toast.error(msg);
      throw new Error(msg);
    }

    toast.success("Document signed successfully");

    // Refresh in background — no clearInstances to avoid flash
    if (offer?._id) {
      dispatch(getContractInstancesThunk(offer._id));
    }
  };

  if (!offer) return null;

  // ── Not yet in signing stage ──────────────────────────────────────────────
  if (!isSigningStage) {
    return (
      <div
        className="rounded-xl px-5 py-8 flex flex-col items-center justify-center text-center gap-3"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: "var(--lavender-50)",
            border: "1px solid var(--lavender-100)",
          }}
        >
          <Clock className="w-5 h-5" style={{ color: "var(--lavender-400)" }} />
        </div>
        <p className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
          {ROLE_LABEL[role] || role}
        </p>
        <p
          className="text-[12px] max-w-xs leading-relaxed"
          style={{ color: "var(--muted-foreground)" }}
        >
          This offer is not yet at the signing stage. You will be notified when
          documents are ready for your signature.
        </p>
      </div>
    );
  }

  // ── Signing stage ─────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex gap-4 items-start">

        {/* Documents panel */}
        <div className="flex-1 min-w-0">
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <FileText className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
              <h3
                className="text-[12px] font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                Contract Documents
              </h3>
              {status === "COMPLETED" ? (
                <span
                  className="ml-auto text-[9px] font-mono font-semibold"
                  style={{ color: "var(--mint-600)" }}
                >
                  ALL SIGNED
                </span>
              ) : canSignRole ? (
                <span
                  className="ml-auto text-[9px] font-mono"
                  style={{ color: "var(--primary)" }}
                >
                  PENDING YOUR SIGNATURE
                </span>
              ) : (
                <span
                  className="ml-auto text-[9px] font-mono"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  AWAITING OTHER SIGNATORIES
                </span>
              )}
            </div>
            <div className="p-4">
              {offer?._id ? (
                <ContractInstancesPanel
                  offerId={offer._id}
                  offerStatus={offer.status}
                  canSignRole={canSign}
                  profileSignature={profileSignature}
                  onSignInstance={handleSignInstance}
                  isSubmitting={isSigning || isSubmitting}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText
                    className="w-5 h-5 mb-2"
                    style={{ color: "var(--lavender-300)" }}
                  />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Loading…
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[240px] shrink-0">
          <SignatorySidebar
            role={role}
            status={status}
            isSubmitting={isSubmitting}
            signingStatus={signingStatus}
            onRequestChanges={() => setDialog("requestChanges")}
          />
        </div>
      </div>

      {/* Request Changes dialog */}
      <OfferActionDialog
        type="requestChanges"
        open={dialog === "requestChanges"}
        offer={offer}
        isLoading={isSubmitting}
        onClose={() => setDialog(null)}
        onConfirm={async (payload) => {
          setDialog(null);
          await onAction("requestChanges", {
            ...payload,
            fieldName: `${role}_SIGNING_REQUEST_CHANGES`,
          });
        }}
      />
    </>
  );
}