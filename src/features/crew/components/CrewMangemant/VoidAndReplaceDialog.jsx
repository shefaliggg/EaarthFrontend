/**
 * VoidAndReplaceDialog.jsx
 *
 * Opens inside LayoutProductionAdmin when offer status is COMPLETED
 * and ?openVoidReplace=true is in the URL (arriving from CrewSearch).
 *
 * Flow:
 *   1. User fills in reason
 *   2. Confirms → parent dispatches voidAndReplaceThunk
 *   3. On success → navigate to new replacement offer's edit page
 *
 * Props:
 *   offer      : object  — needs offer.endDate, offer.offerCode, offer.recipient
 *   onClose    : fn
 *   onConfirm  : fn({ reason }) — parent dispatches the thunk
 *   isLoading  : bool
 */

import { useState } from "react";
import { ShieldAlert, X, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

function fmtDisplay(dateStr) {
  if (!dateStr) return "—";
  return new Date(String(dateStr).split("T")[0] + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function VoidAndReplaceDialog({ offer, onClose, onConfirm, isLoading }) {
  const [reason, setReason] = useState("");

  const canConfirm  = reason.trim().length > 0;
  const recipientName =
    offer?.recipient?.fullName || offer?.name || "this crew member";

  const WHAT_HAPPENS = [
    "Existing contract is marked as VOIDED and locked",
    "All unsigned documents are voided immediately",
    "A new DRAFT offer is created with all data copied",
    "Production can correct errors and restart workflow",
    "Original contract is retained for audit purposes",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        {/* ── Header ── */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: "var(--destructive)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white">Void & Replace Contract</h2>
              {offer?.offerCode && (
                <p className="text-[10px] mt-0.5 font-mono" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {offer.offerCode}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: "rgba(255,255,255,0.7)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-4 space-y-4">

          <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            You're voiding the contract for{" "}
            <strong style={{ color: "var(--foreground)" }}>{recipientName}</strong>{" "}
            because it contains <strong style={{ color: "var(--foreground)" }}>incorrect data</strong>.
            A new draft will be created for correction.
          </p>

          {/* What happens */}
          <div
            className="rounded-xl p-4 space-y-2"
            style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.2)" }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: "var(--destructive)" }}
            >
              What happens
            </p>
            {WHAT_HAPPENS.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--destructive)" }} />
                <span className="text-[11px]" style={{ color: "var(--foreground)" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Advisory */}
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-2.5"
            style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--muted-foreground)" }} />
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              This action <strong>cannot be undone</strong>. The voided contract will be retained
              for audit purposes only. The new draft will open for editing immediately after.
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted-foreground)" }}
            >
              Reason for voiding <span style={{ color: "var(--destructive)" }}>*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Wrong daily rate entered — should be £750 not £500. Engagement type also incorrect…"
              rows={3}
              className="w-full rounded-xl px-3 py-2.5 text-[12px] uppercase resize-none"
              style={{
                background: "var(--input)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                outline: "none",
              }}
            />
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              All text is stored in uppercase. This will be recorded on the voided contract.
            </p>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50"
            style={{
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              background: "var(--muted)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Keep Contract
          </button>
          <button
            onClick={() => {
              if (!canConfirm) return;
              onConfirm({ reason: reason.trim().toUpperCase() });
            }}
            disabled={isLoading || !canConfirm}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--destructive)", color: "white" }}
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <ShieldAlert className="w-4 h-4" />
            }
            Void & Create Replacement
          </button>
        </div>
      </div>
    </div>
  );
}