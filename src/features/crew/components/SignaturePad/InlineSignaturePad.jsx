/**
 * InlineSignaturePad.jsx
 *
 * Renders INSIDE the contract document view — not a popup dialog.
 * Shows:
 *   - If already signed: signature image + date
 *   - If awaiting prior role: locked waiting state
 *   - If my turn: live canvas to sign directly
 */

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  CheckCircle2, PenLine, Lock, RotateCcw, Loader2, Clock,
} from "lucide-react";
import { cn } from "../../../../shared/config/utils";

// ── Role display config ───────────────────────────────────────────────────────

const ROLE_CFG = {
  CREW: {
    label:     "Crew Member",
    short:     "Crew",
    color:     "violet",
    required:  "PENDING_CREW_SIGNATURE",
    signedSet: new Set(["CREW_SIGNED","UPM_SIGNED","FC_SIGNED","STUDIO_SIGNED","COMPLETED"]),
  },
  UPM: {
    label:     "Unit Production Manager",
    short:     "UPM",
    color:     "sky",
    required:  "PENDING_UPM_SIGNATURE",
    signedSet: new Set(["UPM_SIGNED","FC_SIGNED","STUDIO_SIGNED","COMPLETED"]),
  },
  FC: {
    label:     "Financial Controller",
    short:     "FC",
    color:     "amber",
    required:  "PENDING_FC_SIGNATURE",
    signedSet: new Set(["FC_SIGNED","STUDIO_SIGNED","COMPLETED"]),
  },
  STUDIO: {
    label:     "Approved Production Executive",
    short:     "Studio",
    color:     "emerald",
    required:  "PENDING_STUDIO_SIGNATURE",
    signedSet: new Set(["STUDIO_SIGNED","COMPLETED"]),
  },
};

const COLOR = {
  violet:  { border: "border-violet-200",  bg: "bg-violet-50",   text: "text-violet-700",  btn: "bg-violet-600 hover:bg-violet-700", badge: "bg-violet-100 text-violet-700"  },
  sky:     { border: "border-sky-200",     bg: "bg-sky-50",      text: "text-sky-700",     btn: "bg-sky-600 hover:bg-sky-700",       badge: "bg-sky-100 text-sky-700"        },
  amber:   { border: "border-amber-200",   bg: "bg-amber-50",    text: "text-amber-700",   btn: "bg-amber-600 hover:bg-amber-700",   badge: "bg-amber-100 text-amber-700"    },
  emerald: { border: "border-emerald-200", bg: "bg-emerald-50",  text: "text-emerald-700", btn: "bg-emerald-600 hover:bg-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
};

// ── Single signature block ────────────────────────────────────────────────────

function SignatureBlock({ role, instanceStatus, sigData, viewRole, onSign, isSubmitting }) {
  const cfg        = ROLE_CFG[role];
  const col        = COLOR[cfg.color];
  const sigRef     = useRef(null);
  const [empty,    setEmpty]    = useState(true);
  const [localErr, setLocalErr] = useState("");

  // Has THIS role already signed?
  const isSigned   = cfg.signedSet.has(instanceStatus);
  // Is it currently THIS role's turn?
  const isMyTurn   = instanceStatus === cfg.required && viewRole === role;
  // Is this role viewing their own not-yet-signed slot (but not yet their turn)?
  const isWaiting  = !isSigned && !isMyTurn;

  const handleClear = () => {
    sigRef.current?.clear();
    setEmpty(true);
    setLocalErr("");
  };

  const handleConfirm = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      setLocalErr("Please draw your signature above.");
      return;
    }
    const dataUrl = sigRef.current.toDataURL("image/png");
    onSign(role, dataUrl);
  };

  // ── Already signed ─────────────────────────────────────────────────────────
  if (isSigned && sigData?.signatureImage) {
    return (
      <div className={cn("rounded-xl border overflow-hidden", col.border)}>
        <div className={cn("flex items-center justify-between px-4 py-2.5 border-b", col.bg, col.border)}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className={cn("w-4 h-4", col.text)} />
            <span className={cn("text-[11px] font-bold uppercase tracking-wider", col.text)}>
              {cfg.label}
            </span>
          </div>
          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full", col.badge)}>
            SIGNED
          </span>
        </div>
        <div className="px-4 py-3 bg-white flex items-end gap-6">
          <div className="flex-1">
            <p className="text-[9px] text-neutral-400 uppercase tracking-wider mb-1">Signature</p>
            <div className={cn("h-14 border rounded-lg flex items-center px-3", col.border, col.bg)}>
              <img
                src={
                  sigData.signatureImage.startsWith("data:")
                    ? sigData.signatureImage
                    : `data:image/png;base64,${sigData.signatureImage}`
                }
                alt={`${cfg.short} signature`}
                className="max-h-12 max-w-full object-contain"
              />
            </div>
          </div>
          {sigData.signedAt && (
            <div className="shrink-0">
              <p className="text-[9px] text-neutral-400 uppercase tracking-wider mb-1">Date</p>
              <p className={cn("text-[11px] font-semibold font-mono", col.text)}>
                {new Date(sigData.signedAt).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </p>
            </div>
          )}
          {sigData.signatureId && (
            <div className="shrink-0">
              <p className="text-[9px] text-neutral-400 uppercase tracking-wider mb-1">ID</p>
              <p className="text-[9px] text-neutral-400 font-mono">{sigData.signatureId}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Signed but no image stored (fallback) ──────────────────────────────────
  if (isSigned) {
    return (
      <div className={cn("rounded-xl border overflow-hidden", col.border)}>
        <div className={cn("flex items-center gap-2 px-4 py-3", col.bg)}>
          <CheckCircle2 className={cn("w-4 h-4", col.text)} />
          <span className={cn("text-[11px] font-semibold", col.text)}>
            {cfg.label} — Signed
          </span>
          {sigData?.signedAt && (
            <span className="ml-auto text-[9px] text-neutral-400 font-mono">
              {new Date(sigData.signedAt).toLocaleDateString("en-GB")}
            </span>
          )}
        </div>
      </div>
    );
  }

  // ── My turn — show live canvas ─────────────────────────────────────────────
  if (isMyTurn) {
    return (
      <div className={cn("rounded-xl border-2 overflow-hidden", col.border)}>
        {/* Header */}
        <div className={cn("flex items-center justify-between px-4 py-2.5 border-b", col.bg, col.border)}>
          <div className="flex items-center gap-2">
            <PenLine className={cn("w-4 h-4", col.text)} />
            <span className={cn("text-[11px] font-bold uppercase tracking-wider", col.text)}>
              {cfg.label}
            </span>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white border border-current text-orange-500 border-orange-300">
            YOUR SIGNATURE REQUIRED
          </span>
        </div>

        <div className="px-4 py-4 bg-white space-y-3">
          {/* Legal notice */}
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            By signing below you confirm you have read and agree to all terms in this agreement.
            This electronic signature is legally binding.
          </p>

          {/* Canvas area */}
          <div>
            <p className="text-[9px] text-neutral-400 uppercase tracking-wider mb-1.5">
              Draw your signature
            </p>
            <div className={cn(
              "relative rounded-xl border-2 border-dashed overflow-hidden",
              col.border, col.bg
            )}>
              <SignatureCanvas
                ref={sigRef}
                canvasProps={{
                  width:     700,
                  height:    110,
                  className: "block w-full",
                  style:     { touchAction: "none", cursor: "crosshair" },
                }}
                penColor="#1e1b4b"
                onEnd={() => { setEmpty(false); setLocalErr(""); }}
              />
              {empty && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span className={cn("text-[12px] font-medium", col.text, "opacity-50")}>
                    Sign here ↓
                  </span>
                </div>
              )}
              {/* Baseline */}
              <div className="absolute bottom-7 left-6 right-6 border-b border-neutral-300 pointer-events-none" />
              <p className="absolute bottom-1.5 left-6 text-[8px] text-neutral-400 pointer-events-none select-none">
                Sign above the line
              </p>
            </div>
          </div>

          {/* Date auto-fill row */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[9px] text-neutral-400 uppercase tracking-wider mb-1">Date</p>
              <p className="text-[11px] font-semibold font-mono text-neutral-700">
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleClear}
                disabled={empty || isSubmitting}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 text-[11px] text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
              <button
                onClick={handleConfirm}
                disabled={empty || isSubmitting}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-[11px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                  col.btn
                )}
              >
                {isSubmitting
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <CheckCircle2 className="w-3.5 h-3.5" />
                }
                {isSubmitting ? "Saving…" : "Confirm Signature"}
              </button>
            </div>
          </div>

          {localErr && (
            <p className="text-[10px] text-red-500">{localErr}</p>
          )}
        </div>
      </div>
    );
  }

  // ── Waiting (not my turn yet) ──────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-50">
        <div className="flex items-center gap-2">
          {isWaiting && viewRole !== role
            ? <Clock className="w-4 h-4 text-neutral-400" />
            : <Lock className="w-4 h-4 text-neutral-400" />
          }
          <span className="text-[11px] font-semibold text-neutral-500">
            {cfg.label}
          </span>
        </div>
        <span className="text-[9px] text-neutral-400 font-mono uppercase">
          Awaiting signature
        </span>
      </div>
      <div className="px-4 py-3 bg-white">
        <div className="h-10 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center">
          <span className="text-[10px] text-neutral-400">Signature pending</span>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
// Renders ALL four signature blocks in a 2x2 grid, same as real contract layout.

export default function InlineSignaturePad({
  instanceStatus,
  signatures = {},
  viewRole,
  onSign,
  isSubmitting = false,
}) {
  const roles = ["CREW", "UPM", "FC", "STUDIO"];

  return (
    <div className="space-y-4">
      {/* Legal notice bar */}
      <div className="bg-neutral-900 rounded-xl px-4 py-3">
        <p className="text-[10px] text-neutral-300 text-center uppercase tracking-widest font-semibold">
          This notice is effective only upon signature of Crew Member,
          Unit Production Manager, Financial Controller and the Approved Production Executive
        </p>
      </div>

      {/* 2×2 grid — matches contract document layout */}
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => (
          <SignatureBlock
            key={role}
            role={role}
            instanceStatus={instanceStatus}
            sigData={signatures[role.toLowerCase()]}
            viewRole={viewRole}
            onSign={onSign}
            isSubmitting={isSubmitting}
          />
        ))}
      </div>
    </div>
  );
}