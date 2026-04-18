/**
 * layouts/LayoutCrew.jsx
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
  signContractInstanceThunk,
  selectInstancesSigning,
  selectInstancesSignError,
  getContractInstancesThunk,
} from "../../../store/contractInstances.slice";
import {
  CheckCircle, MessageSquare, XCircle, PenLine,
  Loader2, Eye, ClipboardCheck, Lock, FileText, Shield,
} from "lucide-react";

import { CreateOfferLayout }  from "../../roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import ContractInstancesPanel from "../../../pages/ContractInstancesPanel";
import CrewIdentityHeader     from "./CrewIdentityHeader";
import OfferActionDialog      from "../../../components/onboarding/OfferActionDialog";
import { InfoBox }            from "./layoutHelpers";
import { defaultEngineSettings } from "../../../utils/rateCalculations";

import { selectProfileSignatureUrl } from "../../../../signature/store/signature.slice";

// ── Constants ─────────────────────────────────────────────────────────────────

const CREW_SIGNABLE_STATUSES = ["PENDING_CREW_SIGNATURE"];

const SIGNING_STAGE_STATUSES = [
  "PENDING_CREW_SIGNATURE",
  "PENDING_UPM_SIGNATURE",
  "PENDING_FC_SIGNATURE",
  "PENDING_STUDIO_SIGNATURE",
  "COMPLETED",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const fmtMoney = (n, currency = "GBP") => {
  const num = parseFloat(n);
  if (!num) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(num);
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

// ── Accept dialog ─────────────────────────────────────────────────────────────

function AcceptDialog({ offer, onConfirm, onClose, isLoading }) {
  const jobTitle =
    offer?.createOwnJobTitle && offer?.newJobTitle
      ? offer.newJobTitle
      : offer?.jobTitle || "—";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{ background: "var(--card)" }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: "var(--mint-600)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-[15px] font-bold text-white">Accept this Offer?</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-5 space-y-4">
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            By accepting, you confirm you have reviewed all terms and agree to
            proceed. Contracts will be generated immediately.
          </p>
          <div
            className="rounded-xl p-4 grid grid-cols-2 gap-x-6 gap-y-3"
            style={{ background: "var(--mint-50)", border: "1px solid var(--mint-100)" }}
          >
            {[
              { label: "Role",    value: jobTitle },
              { label: "Fee/day", value: fmtMoney(offer?.feePerDay, offer?.currency) },
              { label: "Start",   value: fmtDate(offer?.startDate) },
              { label: "End",     value: fmtDate(offer?.endDate) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p
                  className="text-[10px] font-medium mb-0.5"
                  style={{ color: "var(--mint-600)" }}
                >
                  {label}
                </p>
                <p
                  className="text-[12px] font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50"
            style={{
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              background: "var(--card)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm()}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl text-white text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
            style={{ background: "var(--mint-600)" }}
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <CheckCircle className="w-4 h-4" />
            }
            Accept Offer
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
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{ background: "var(--card)" }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: "var(--destructive)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <XCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white">Decline Offer</h2>
              {offer?.offerCode && (
                <p className="text-[9px] text-white/60 font-mono mt-0.5">
                  {offer.offerCode}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-5 space-y-3">
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Are you sure you want to decline this offer? You can optionally provide a reason.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Optional: reason for declining..."
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-[13px] uppercase placeholder:normal-case resize-none focus:outline-none transition-colors"
            style={{
              border: "1px solid var(--border)",
              background: "var(--muted)",
              color: "var(--foreground)",
            }}
          />
          <div
            className="rounded-xl p-3"
            style={{
              background: "var(--destructive-50, #fff1f1)",
              border: "1px solid var(--destructive-200, #fecaca)",
            }}
          >
            <p className="text-[11px]" style={{ color: "var(--destructive)" }}>
              Production will be notified. They will review and cancel or revise the offer.
            </p>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50"
            style={{
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              background: "var(--card)",
            }}
          >
            Keep Offer
          </button>
          <button
            onClick={() =>
              onConfirm({ reason: reason.toUpperCase().trim() || "DECLINED BY CREW" })
            }
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl text-white text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
            style={{ background: "var(--destructive)" }}
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <XCircle className="w-4 h-4" />
            }
            Decline Offer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Crew action box ───────────────────────────────────────────────────────────

function CrewActionBox({
  status, isSubmitting, onAccept, onRequestChanges, onDecline, onSign,
}) {
  const canRespond = status === "SENT_TO_CREW" || status === "NEEDS_REVISION";
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div
        className="px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--muted-foreground)" }}
        >
          Your Response
        </p>
      </div>
      <div className="p-3 space-y-2">
        {canRespond && (
          <>
            <button
              disabled={isSubmitting}
              onClick={onAccept}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-[13px] font-bold disabled:opacity-60 transition-colors"
              style={{ background: "var(--mint-600)" }}
            >
              {isSubmitting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <CheckCircle className="w-4 h-4" />
              }
              Accept Offer
            </button>
            <button
              disabled={isSubmitting}
              onClick={onRequestChanges}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold disabled:opacity-60 transition-colors"
              style={{
                border: "2px solid var(--peach-300)",
                color: "var(--peach-600)",
                background: "transparent",
              }}
            >
              <MessageSquare className="w-4 h-4" /> Request Changes
            </button>
            <button
              disabled={isSubmitting}
              onClick={onDecline}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium disabled:opacity-60 transition-colors"
              style={{
                border: "1px solid var(--border)",
                color: "var(--muted-foreground)",
                background: "transparent",
              }}
            >
              Decline Offer
            </button>
          </>
        )}
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
        {status === "PENDING_CREW_SIGNATURE" && (
          <InfoBox icon={PenLine} color="purple">
            Click your signature field inside each document to sign.
          </InfoBox>
        )}
        {[
          "PENDING_UPM_SIGNATURE",
          "PENDING_FC_SIGNATURE",
          "PENDING_STUDIO_SIGNATURE",
        ].includes(status) && (
          <InfoBox icon={PenLine} color="purple">
            You have signed. Awaiting further signatories.
          </InfoBox>
        )}
        {status === "COMPLETED" && (
          <InfoBox icon={Lock} color="green">
            Contract fully executed. Welcome to the production!
          </InfoBox>
        )}
        {status === "CANCELLED" && (
          <InfoBox icon={XCircle} color="red">
            This offer has been cancelled.
          </InfoBox>
        )}
        {status === "DRAFT" && (
          <InfoBox icon={Eye} color="gray">
            Offer has not been sent to you yet.
          </InfoBox>
        )}
      </div>
    </div>
  );
}

// ── Offer document pane ───────────────────────────────────────────────────────

function OfferDocumentPane({ offer, contractData, allowances, calculatedRates }) {
  const [af, setAf] = useState(null);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}
      >
        <p
          className="text-[13px] font-bold uppercase tracking-wide"
          style={{ color: "var(--foreground)" }}
        >
          Offer Document
        </p>
        {offer?.offerCode && (
          <span className="text-[9px] font-mono" style={{ color: "var(--muted-foreground)" }}>
            {offer.offerCode}
          </span>
        )}
      </div>
      <CreateOfferLayout
        data={contractData}
        offer={offer}
        activeField={af}
        onFieldFocus={setAf}
        onFieldBlur={() => setAf(null)}
        calculatedRates={calculatedRates}
        engineSettings={defaultEngineSettings}
        salaryBudgetCodes={offer?.salaryBudgetCodes     || []}
        setSalaryBudgetCodes={() => {}}
        salaryTags={offer?.salaryTags                   || []}
        setSalaryTags={() => {}}
        overtimeBudgetCodes={offer?.overtimeBudgetCodes || []}
        setOvertimeBudgetCodes={() => {}}
        overtimeTags={offer?.overtimeTags               || []}
        setOvertimeTags={() => {}}
        allowances={allowances}
        hideOfferSections={false}
        hideContractDocument={true}
        isDocumentLocked={true}
        initialOfferCollapsed={false}
      />
    </div>
  );
}

// ── Signing stage sidebar ─────────────────────────────────────────────────────

function SigningSidebar({ status, isSubmitting, onRequestChanges, signingStatus }) {
  const hasSigned = [
    "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE",
    "PENDING_STUDIO_SIGNATURE",
    "COMPLETED",
  ].includes(status);
  const isCompleted = status === "COMPLETED";
  const canSign     = status === "PENDING_CREW_SIGNATURE";

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
        {canSign && (
          <InfoBox icon={PenLine} color="purple">
            Click your highlighted signature field inside each document to sign inline.
          </InfoBox>
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
        {!isCompleted && (
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

export default function LayoutCrew({
  offer,
  contractData,
  allowances,
  calculatedRates,
  isSubmitting,
  onAction,
  dispatch: _dispatch,
  profileSignature: profileSignatureProp,
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
  const signError = useSelector(selectInstancesSignError);

  // Profile signature: prefer Redux store, fall back to prop
  const profileSignatureFromStore = useSelector(selectProfileSignatureUrl);
  const profileSignature = profileSignatureFromStore ?? profileSignatureProp ?? null;

  const [dialog, setDialog] = useState(null);

  const status         = offer?.status;
  const isSigningStage = SIGNING_STAGE_STATUSES.includes(status);
  const canSign        = CREW_SIGNABLE_STATUSES.includes(status);

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

    toast.success("Document signed");

    // Refresh in background — no clearInstances to avoid flash
    if (offer?._id) {
      dispatch(getContractInstancesThunk(offer._id));
    }
  };

  const handleSignRequest = (upperRole) => {
    if (onSign) onSign(upperRole);
  };

  if (!offer) return null;

  return (
    <>
      <div className="space-y-4">

        <CrewIdentityHeader contractData={contractData} offer={offer} />

        {/* Pre-signing stage */}
        {!isSigningStage && (
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <OfferDocumentPane
                offer={offer}
                contractData={contractData}
                allowances={allowances}
                calculatedRates={calculatedRates}
              />
            </div>
            <div className="w-[240px] shrink-0">
              <CrewActionBox
                status={status}
                isSubmitting={isSubmitting}
                onAccept={() => setDialog("accept")}
                onRequestChanges={() => setDialog("requestChanges")}
                onDecline={() => setDialog("decline")}
                onSign={() => onSign?.("CREW")}
              />
            </div>
          </div>
        )}

        {/* Signing stage */}
        {isSigningStage && (
          <div className="flex gap-4 items-start">
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
                  ) : (
                    <span
                      className="ml-auto text-[9px] font-mono"
                      style={{ color: "var(--primary)" }}
                    >
                      PENDING SIGNATURE
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
                      onSignRequest={handleSignRequest}
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
            <div className="w-[240px] shrink-0">
              <SigningSidebar
                status={status}
                isSubmitting={isSubmitting}
                onRequestChanges={() => setDialog("signingRequestChanges")}
                signingStatus={signingStatus}
              />
            </div>
          </div>
        )}
      </div>

      {/* Accept dialog */}
      {dialog === "accept" && (
        <AcceptDialog
          offer={offer}
          isLoading={isSubmitting}
          onConfirm={async () => {
            setDialog(null);
            await onAction("accept");
          }}
          onClose={() => setDialog(null)}
        />
      )}

      {/* Request Changes */}
      <OfferActionDialog
        type="requestChanges"
        open={dialog === "requestChanges"}
        offer={offer}
        isLoading={isSubmitting}
        onClose={() => setDialog(null)}
        onConfirm={async (payload) => {
          setDialog(null);
          await onAction("requestChanges", payload);
        }}
      />

      {/* Signing-stage request changes */}
      <OfferActionDialog
        type="requestChanges"
        open={dialog === "signingRequestChanges"}
        offer={offer}
        isLoading={isSubmitting}
        onClose={() => setDialog(null)}
        onConfirm={async (payload) => {
          setDialog(null);
          await onAction("requestChanges", {
            ...payload,
            fieldName: "CREW_SIGNING_REQUEST_CHANGES",
          });
        }}
      />

      {/* Decline dialog */}
      {dialog === "decline" && (
        <DeclineDialog
          offer={offer}
          isLoading={isSubmitting}
          onConfirm={async (payload) => {
            setDialog(null);
            await onAction("requestChanges", {
              reason: payload.reason || "DECLINED BY CREW",
              fieldName: "DECLINE",
            });
          }}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  );
}