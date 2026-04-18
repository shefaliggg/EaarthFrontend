/**
 * DocumentSignatureBox.jsx
 *
 * Per-document signature UI component.
 *
 * FLOW:
 *   1. Shown at the bottom of each DocumentView inside ContractInstancesPanel
 *   2. User clicks "Sign This Document" → dialog appears with their saved
 *      profile signature (read from user profile / passed as prop)
 *   3. User confirms → calls onSign(instanceId) → parent dispatches thunk
 *   4. After signing, box shows a "Signed" confirmation state
 *
 * PROPS:
 *   instanceId       string   - ContractInstance._id
 *   instanceName     string   - Document name for display
 *   status           string   - ContractInstance.status
 *   viewRole         string   - CREW | UPM | FC | STUDIO
 *   canSign          bool     - true when it's this role's turn and doc is unsigned
 *   isSigned         bool     - true if this role has already signed this doc
 *   signedAt         string?  - ISO date string if signed
 *   signatureId      string?  - SIG-XXX-... if signed
 *   profileSignature string?  - base64 dataURL of saved profile sig (optional)
 *   isSubmitting     bool     - loading state
 *   onSign           fn(instanceId) → Promise  - called on confirm
 *
 * THEMING: Uses CSS variables from index.css — no hardcoded colors.
 */

import { useState, useRef, useEffect } from "react";
import {
  PenLine, CheckCircle2, Clock, Lock, Shield,
  ChevronDown, ChevronUp, X, Loader2, Check,
  AlertCircle, FileSignature, Fingerprint,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const ROLE_LABEL = {
  CREW:   "Crew Member",
  UPM:    "Unit Production Manager",
  FC:     "Financial Controller",
  STUDIO: "Production Executive",
};

// ── Signature preview (shows the saved profile sig or a placeholder) ──────────

function SignaturePreview({ dataUrl, name }) {
  if (!dataUrl) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl"
        style={{
          height: 80,
          background: "var(--muted)",
          border: "1.5px dashed var(--border)",
        }}
      >
        <Fingerprint className="w-5 h-5 mb-1" style={{ color: "var(--muted-foreground)" }} />
        <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
          No saved signature
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-xl overflow-hidden"
      style={{
        height: 80,
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <img
        src={dataUrl}
        alt={`${name} signature`}
        style={{
          maxHeight: 64,
          maxWidth: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}

// ── Confirm Dialog ─────────────────────────────────────────────────────────────

function SignConfirmDialog({
  open,
  onClose,
  onConfirm,
  isLoading,
  viewRole,
  instanceName,
  profileSignature,
}) {
  const roleLabel = ROLE_LABEL[viewRole] || viewRole;
  const backdropRef = useRef(null);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  // Trap focus / close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          animation: "dialogIn 0.18s ease-out",
        }}
      >
        <style>{`
          @keyframes dialogIn {
            from { opacity: 0; transform: scale(0.96) translateY(6px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: "var(--primary)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              <FileSignature className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-white leading-tight">
                Sign Document
              </h2>
              <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                {roleLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-white/60 hover:text-white transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Document name */}
          <div
            className="rounded-lg px-3 py-2.5 flex items-center gap-2"
            style={{ background: "var(--lavender-50)", border: "1px solid var(--lavender-100)" }}
          >
            <FileSignature className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--lavender-600)" }} />
            <p className="text-[12px] font-semibold truncate" style={{ color: "var(--lavender-700)" }}>
              {instanceName}
            </p>
          </div>

          {/* Signature preview */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Your Signature
            </p>
            <SignaturePreview dataUrl={profileSignature} name={roleLabel} />
            {!profileSignature && (
              <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                To set a signature, update your profile settings.
              </p>
            )}
          </div>

          {/* Legal notice */}
          <div
            className="rounded-lg px-3 py-2.5 flex gap-2"
            style={{ background: "var(--peach-50)", border: "1px solid var(--peach-200)" }}
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--peach-500)" }} />
            <p className="text-[10px] leading-relaxed" style={{ color: "var(--peach-700)" }}>
              By confirming, you are applying a legally binding signature to this document
              as <strong>{roleLabel}</strong>. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)", background: "var(--card)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || !profileSignature}
            className="flex-1 h-11 rounded-xl text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--primary)" }}
            title={!profileSignature ? "No saved signature — update your profile first" : undefined}
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <PenLine className="w-4 h-4" />
            }
            Apply Signature
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Signed State ──────────────────────────────────────────────────────────────

function SignedState({ viewRole, signedAt, signatureId }) {
  const roleLabel = ROLE_LABEL[viewRole] || viewRole;
  return (
    <div
      className="rounded-xl px-4 py-3 flex items-center gap-3"
      style={{ background: "var(--mint-50)", border: "1px solid var(--mint-200)" }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "var(--mint-100)" }}
      >
        <Check className="w-4 h-4" style={{ color: "var(--mint-600)", strokeWidth: 2.5 }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold" style={{ color: "var(--mint-700)" }}>
          Signed as {roleLabel}
        </p>
        {signedAt && (
          <p className="text-[10px] mt-0.5" style={{ color: "var(--mint-600)" }}>
            {fmtDate(signedAt)}
          </p>
        )}
      </div>
      {signatureId && (
        <span
          className="text-[8px] font-mono px-2 py-1 rounded shrink-0"
          style={{ background: "var(--mint-100)", color: "var(--mint-700)", border: "1px solid var(--mint-200)" }}
        >
          {signatureId}
        </span>
      )}
    </div>
  );
}

// ── Waiting State ─────────────────────────────────────────────────────────────

function WaitingState({ message }) {
  return (
    <div
      className="rounded-xl px-4 py-3 flex items-center gap-3"
      style={{ background: "var(--sky-50)", border: "1px solid var(--sky-200)" }}
    >
      <Clock className="w-4 h-4 shrink-0" style={{ color: "var(--sky-500)" }} />
      <p className="text-[12px]" style={{ color: "var(--sky-700)" }}>{message}</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

/**
 * DocumentSignatureBox
 *
 * Drop this at the bottom of each DocumentView:
 *
 *   <DocumentSignatureBox
 *     instanceId={current._id}
 *     instanceName={current.formName}
 *     status={current.status}
 *     viewRole={viewRole}
 *     canSign={canSign}
 *     isSigned={isSigned}
 *     signedAt={current.signatures?.[viewRole.toLowerCase()]?.signedAt}
 *     signatureId={current.signatures?.[viewRole.toLowerCase()]?.signatureId}
 *     profileSignature={user?.savedSignature}
 *     isSubmitting={isSubmitting}
 *     onSign={handleSignInstance}
 *   />
 */
export default function DocumentSignatureBox({
  instanceId,
  instanceName,
  status,
  viewRole,
  canSign,
  isSigned,
  signedAt,
  signatureId,
  profileSignature,
  isSubmitting,
  onSign,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localSigning, setLocalSigning] = useState(false);

  const handleConfirm = async () => {
    if (!profileSignature) return;
    setLocalSigning(true);
    try {
      await onSign(instanceId);
      setDialogOpen(false);
    } finally {
      setLocalSigning(false);
    }
  };

  const isLocked  = status === "COMPLETED";
  const isVoided  = status === "VOIDED" || status === "SUPERSEDED";
  const busy      = isSubmitting || localSigning;

  // ── Locked / voided — no interaction ──────────────────────────────────────
  if (isLocked || isVoided) {
    return (
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
      >
        <Lock className="w-4 h-4 shrink-0" style={{ color: "var(--muted-foreground)" }} />
        <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
          {isLocked ? "Contract fully executed." : "This document has been superseded."}
        </p>
      </div>
    );
  }

  // ── Already signed by this role ───────────────────────────────────────────
  if (isSigned) {
    return (
      <SignedState
        viewRole={viewRole}
        signedAt={signedAt}
        signatureId={signatureId}
      />
    );
  }

  // ── Waiting for a prior signatory ─────────────────────────────────────────
  if (!canSign) {
    const waitMsg = {
      CREW:   "Awaiting document to be sent for your signature.",
      UPM:    "Awaiting crew signature before you can sign.",
      FC:     "Awaiting UPM signature before you can sign.",
      STUDIO: "Awaiting Financial Controller signature before you can sign.",
    }[viewRole] || "Not yet available for signing.";

    return <WaitingState message={waitMsg} />;
  }

  // ── Ready to sign ─────────────────────────────────────────────────────────
  return (
    <>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1.5px solid var(--lavender-200)", background: "var(--lavender-50)" }}
      >
        {/* Header strip */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ borderBottom: "1px solid var(--lavender-100)", background: "var(--lavender-100)" }}
        >
          <Shield className="w-3.5 h-3.5" style={{ color: "var(--lavender-600)" }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--lavender-700)" }}>
            Signature Required
          </span>
          <span
            className="ml-auto text-[8px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "var(--lavender-200)", color: "var(--lavender-700)" }}
          >
            {ROLE_LABEL[viewRole] || viewRole}
          </span>
        </div>

        {/* Sign action */}
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Saved sig thumbnail */}
          {profileSignature ? (
            <div
              className="w-20 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
              style={{ background: "var(--card)", border: "1px solid var(--lavender-200)" }}
            >
              <img
                src={profileSignature}
                alt="Your signature"
                style={{ maxHeight: 36, maxWidth: "100%", objectFit: "contain" }}
              />
            </div>
          ) : (
            <div
              className="w-20 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--muted)", border: "1.5px dashed var(--border)" }}
            >
              <Fingerprint className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>
              {profileSignature ? "Apply your saved signature" : "No saved signature"}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {profileSignature
                ? "Review the document above before signing."
                : "Add a signature in your profile settings."}
            </p>
          </div>

          <button
            onClick={() => setDialogOpen(true)}
            disabled={busy || !profileSignature}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[12px] font-bold shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: busy ? "var(--muted)" : "var(--primary)", minWidth: 120 }}
          >
            {busy
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--primary)" }} />
              : <PenLine className="w-3.5 h-3.5" />
            }
            {busy ? "Signing…" : "Sign"}
          </button>
        </div>
      </div>

      <SignConfirmDialog
        open={dialogOpen}
        onClose={() => !busy && setDialogOpen(false)}
        onConfirm={handleConfirm}
        isLoading={busy}
        viewRole={viewRole}
        instanceName={instanceName}
        profileSignature={profileSignature}
      />
    </>
  );
}