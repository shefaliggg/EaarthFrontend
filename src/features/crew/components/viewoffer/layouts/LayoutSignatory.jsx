import { useState }           from "react";
import { useParams }          from "react-router-dom";
import { toast }              from "sonner";
import {
  Eye, CheckCircle, XCircle, PenLine, ClipboardCheck,
  Loader2, FileText, Shield, Lock, Send, X, MessageSquare,
} from "lucide-react";

import ContractInstancesPanel from "../../../pages/ContractInstancesPanel";
import CrewIdentityHeader     from "./CrewIdentityHeader";
import { InfoBox }            from "./layoutHelpers";

import {
  crewRequestChangesThunk,
  getOfferThunk,
} from "../../../store/offer.slice";

const ROLE_CFG = {
  UPM: {
    label:          "Unit Production Manager",
    short:          "UPM",
    requiredStatus: "PENDING_UPM_SIGNATURE",
    waitingMsg:     "Awaiting crew signature before UPM can sign.",
    signedMsg:      "You have signed as UPM. Awaiting Financial Controller.",
    heading:        "Send Edit Request to Production",
    description:    "As UPM, if you have identified an issue with the contract terms, rates, or crew details that requires amendment before you can sign, describe the required changes below.",
    placeholder:    "E.G., OVERTIME RATE IS INCORRECT — SHOULD REFLECT THE AGREED SCHEDULE D RATES…",
  },
  FC: {
    label:          "Financial Controller",
    short:          "FC",
    requiredStatus: "PENDING_FC_SIGNATURE",
    waitingMsg:     "Awaiting UPM signature before FC can sign.",
    signedMsg:      "You have signed as FC. Awaiting Studio approval.",
    heading:        "Send Financial Correction to Production",
    description:    "As Financial Controller, if you have identified discrepancies in the fee structure, budget codes, allowances, or tax status that must be corrected before you can sign, detail the corrections needed below.",
    placeholder:    "E.G., BUDGET CODE FOR BOX RENTAL IS INCORRECT — SHOULD BE AC-4421 NOT AC-4412…",
  },
  STUDIO: {
    label:          "Approved Production Executive",
    short:          "Studio",
    requiredStatus: "PENDING_STUDIO_SIGNATURE",
    waitingMsg:     "Awaiting FC signature before Studio can sign.",
    signedMsg:      "Contract fully executed.",
    heading:        "Request Offer Amendment",
    description:    "As the approving Production Executive, if you require changes to the offer before final sign-off, describe the amendments required below.",
    placeholder:    "E.G., ENGAGEMENT TYPE SHOULD BE LOAN OUT NOT PAYE…",
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
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{ background: "var(--card)" }}
      >
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: "var(--peach-500)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white leading-tight">{cfg.heading}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
                >
                  {cfg.label}
                </span>
                {offerCode && (
                  <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.6)" }}>{offerCode}</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {recipientName && (
            <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
              Offer for <strong style={{ color: "var(--foreground)" }}>{recipientName}</strong>
            </p>
          )}
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            {cfg.description}
          </p>
          <textarea
            value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder={cfg.placeholder}
            rows={5}
            className="w-full rounded-xl px-4 py-3 text-[13px] uppercase placeholder:normal-case resize-none focus:outline-none transition-colors"
            style={{ border: "1px solid var(--border)", background: "var(--muted)", color: "var(--foreground)" }}
          />
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ background: "var(--peach-50)", border: "1px solid var(--peach-200)" }}
          >
            <svg className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--peach-500)" }} viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 110 1.5A.75.75 0 018 4zm.75 7.25h-1.5v-4h1.5v4z"/>
            </svg>
            <p className="text-[10px] leading-tight" style={{ color: "var(--peach-700)" }}>
              This will set the offer to <strong>Needs Revision</strong>. Production Admin will be notified and can edit and resend to crew.
            </p>
          </div>
          <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>All text is stored in uppercase.</p>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} disabled={isLoading}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)", background: "var(--card)" }}>
            Cancel
          </button>
          <button
            onClick={() => { if (!notes.trim()) return; onConfirm(notes.trim().toUpperCase()); }}
            disabled={isLoading || !notes.trim()}
            className="flex-1 h-11 rounded-xl text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--peach-500)" }}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
    <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--mint-50)" }}
      >
        <Shield className="w-3.5 h-3.5" style={{ color: "var(--mint-600)" }} />
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--mint-700)" }}>
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
                    <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round" />
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
                <span className="ml-auto text-[9px] shrink-0" style={{ color: "var(--muted-foreground)" }}>
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

function SignatorySidebar({ role, offer, signingStatus, isSubmitting, onSign, onRequestChanges }) {
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
      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "var(--lavender-100)" }}
          >
            <Shield className="w-3 h-3" style={{ color: "var(--lavender-600)" }} />
          </div>
          <span
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "var(--lavender-600)" }}
          >
            {cfg.label}
          </span>
        </div>
        <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Signing as {cfg.short}</p>
      </div>

      {/* Action card */}
      <div
        className="rounded-xl p-3 space-y-2"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
          Your Action
        </p>

        {!canSign && !iSigned && !isCompleted && !isCancelled && (
          <InfoBox icon={ClipboardCheck} color="blue">{cfg.waitingMsg}</InfoBox>
        )}

        {canSign && !iSigned && (
          <>
            <InfoBox icon={Eye} color="purple">Please review all documents before signing.</InfoBox>
            <button
              disabled={isSubmitting} onClick={() => onSign(role)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-[12px] font-semibold disabled:opacity-60 transition-colors"
              style={{ background: "var(--primary)" }}
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PenLine className="w-3.5 h-3.5" />}
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

        {!isCompleted && !isCancelled && (
          <>
            <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />
            <button
              disabled={isSubmitting} onClick={onRequestChanges}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold disabled:opacity-60 transition-colors"
              style={{ border: "2px solid var(--peach-300)", color: "var(--peach-600)", background: "transparent" }}
            >
              <MessageSquare className="w-4 h-4" /> Request Changes
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
  role, offer, contractData,
  signingStatus, isSubmitting, onSign, dispatch,
}) {
  const { id } = useParams();
  const offerId = id || offer?._id;

  const [showDialog,  setShowDialog ] = useState(false);
  const [isSending,   setIsSending  ] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const status = offer?.status;

  const signingInProgress = [
    "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE",
  ].includes(status);

  const handleConfirm = async (reason) => {
    if (!offerId || !reason) return;
    setIsSending(true);
    toast.loading("Sending to production…", { id: "rc-req" });
    try {
      const result = await dispatch(
        crewRequestChangesThunk({ offerId, reason, fieldName: `${role}_REQUEST_CHANGES` })
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
      <CrewIdentityHeader contractData={contractData} offer={offer} />

      {/* Sent confirmation banner */}
      {requestSent && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: "var(--peach-50)", border: "1px solid var(--peach-200)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--peach-100)" }}
          >
            <Send className="w-4 h-4" style={{ color: "var(--peach-600)" }} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold" style={{ color: "var(--peach-800)" }}>
              Request sent to Production
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--peach-600)" }}>
              Offer is now <strong>Needs Revision</strong>. Production Admin will review, edit and resend to crew.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-4 items-start">

        {/* Left — contract documents */}
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
              <h3 className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>
                Contract Documents
              </h3>
              {status === "COMPLETED" && (
                <span className="ml-auto text-[9px] font-mono font-semibold" style={{ color: "var(--mint-600)" }}>
                  ALL SIGNED
                </span>
              )}
              {signingInProgress && (
                <span className="ml-auto text-[9px] font-mono" style={{ color: "var(--primary)" }}>
                  PENDING SIGNATURE
                </span>
              )}
            </div>
            <div className="p-4">
              {offer?._id ? (
                <ContractInstancesPanel offerId={offer._id} offerStatus={offer?.status} />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: "var(--lavender-50)", border: "1px solid var(--lavender-100)" }}
                  >
                    <FileText className="w-5 h-5" style={{ color: "var(--lavender-300)" }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>
                    Loading offer…
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — signing sidebar */}
        <div className="w-[260px] shrink-0">
          <SignatorySidebar
            role={role} offer={offer}
            signingStatus={signingStatus}
            isSubmitting={isSubmitting}
            onSign={onSign}
            onRequestChanges={() => !requestSent && setShowDialog(true)}
          />
        </div>
      </div>

      {showDialog && (
        <RequestChangesDialog
          role={role} offer={offer}
          onConfirm={handleConfirm}
          onClose={() => setShowDialog(false)}
          isLoading={isSending}
        />
      )}
    </>
  );
}