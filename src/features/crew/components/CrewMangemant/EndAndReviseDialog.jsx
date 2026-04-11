/**
 * EndAndReviseDialog.jsx
 *
 * Collects:
 *   - endCurrentOn      (date the old contract officially ends)
 *   - newEffectiveFrom  (date the new contract starts)
 *   - reason            (free-text, required, min 5 chars)
 *
 * On confirm → caller calls endAndRevise API then navigates to
 * CreateOffer page with the new offer's ID (prefilled data).
 */

import { useState } from "react";
import { X, GitBranch, CalendarDays, Calendar, ChevronRight, Loader2 } from "lucide-react";

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(String(d).split("T")[0] + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
};

export default function EndAndReviseDialog({ offer, onClose, onConfirm, isLoading }) {
  const currentEndDate   = offer?.endDate   ? String(offer.endDate).split("T")[0]   : "";
  const currentStartDate = offer?.startDate ? String(offer.startDate).split("T")[0] : "";

  const [endCurrentOn,     setEndCurrentOn    ] = useState(currentEndDate);
  const [newEffectiveFrom, setNewEffectiveFrom ] = useState("");
  const [reason,           setReason          ] = useState("");

  const canSubmit =
    endCurrentOn.trim() &&
    newEffectiveFrom.trim() &&
    reason.trim().length >= 5 &&
    !isLoading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onConfirm({
      endCurrentOn:     endCurrentOn.trim(),
      newEffectiveFrom: newEffectiveFrom.trim(),
      reason:           reason.trim().toUpperCase(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{ background: "rgba(0,0,0,0.55)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "var(--card)" }}
      >
        {/* Header */}
        <div
          className="px-5 pt-5 pb-3 flex items-center justify-between"
          style={{ background: "var(--lavender-600, #7c3aed)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <GitBranch className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold leading-tight text-white">
                End &amp; Revise Contract
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
                >
                  Terms Changed
                </span>
                {offer?.offerCode && (
                  <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {offer.offerCode}
                  </span>
                )}
              </div>
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

        {/* Body */}
        <div className="px-5 py-4 space-y-4">

          {/* Explainer */}
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Use this when the contract is{" "}
            <strong style={{ color: "var(--foreground)" }}>correct but terms need to change</strong>
            {" "}— rate increase, schedule change, etc. The old contract is preserved for audit; a
            new offer will open prefilled for you to update and re-send.
          </p>

          {/* Current contract info — read only */}
          <div
            className="rounded-xl p-3 grid grid-cols-2 gap-x-6 gap-y-1"
            style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
          >
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-wide mb-0.5"
                style={{ color: "var(--muted-foreground)" }}
              >
                Current start
              </p>
              <p className="text-[13px] font-bold" style={{ color: "var(--foreground)" }}>
                {fmtDate(currentStartDate) || "—"}
              </p>
            </div>
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-wide mb-0.5"
                style={{ color: "var(--muted-foreground)" }}
              >
                Current end
              </p>
              <p className="text-[13px] font-bold" style={{ color: "var(--foreground)" }}>
                {fmtDate(currentEndDate) || "Open"}
              </p>
            </div>
          </div>

          {/* Flow visual */}
          <div className="flex items-center gap-2">
            <div
              className="flex-1 px-3 py-2 rounded-lg text-center text-[11px] font-semibold"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            >
              Old contract → REVISED
            </div>
            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--muted-foreground)" }} />
            <div
              className="flex-1 px-3 py-2 rounded-lg text-center text-[11px] font-semibold"
              style={{
                background: "var(--lavender-50,#f5f3ff)",
                border: "1px solid var(--lavender-200,#ddd6fe)",
                color: "var(--lavender-700,#6d28d9)",
              }}
            >
              New offer prefilled
            </div>
          </div>

          {/* Date pickers — side by side */}
          <div className="grid grid-cols-2 gap-3">

            {/* End current on */}
            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                <CalendarDays className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
                End current on
                <span style={{ color: "var(--destructive)" }}> *</span>
              </label>
              <input
                type="date"
                value={endCurrentOn}
                onChange={(e) => setEndCurrentOn(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-[13px] outline-none"
                style={{
                  background: "var(--input)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
              <p className="text-[10px] mt-1" style={{ color: "var(--muted-foreground)" }}>
                Old contract ends &amp; marked REVISED.
              </p>
            </div>

            {/* New effective from */}
            <div>
              <label
                className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: "var(--foreground)" }}
              >
                <Calendar className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
                New effective from
                <span style={{ color: "var(--destructive)" }}> *</span>
              </label>
              <input
                type="date"
                value={newEffectiveFrom}
                onChange={(e) => setNewEffectiveFrom(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-[13px] outline-none"
                style={{
                  background: "var(--input)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
              <p className="text-[10px] mt-1" style={{ color: "var(--muted-foreground)" }}>
                New draft starts. Can be backdated.
              </p>
            </div>

          </div>

          {/* Reason */}
          <div>
            <label
              className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: "var(--foreground)" }}
            >
              Reason for revision
              <span style={{ color: "var(--destructive)" }}> *</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.G., RATE INCREASE AGREED — NEW DAILY RATE £850 FROM 1 MARCH..."
              className="w-full rounded-xl px-4 py-3 text-[13px] uppercase placeholder:normal-case resize-none outline-none"
              style={{
                background: "var(--input)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            />
            <p className="text-[10px] mt-1" style={{ color: "var(--muted-foreground)" }}>
              Recorded on the revised offer for audit purposes.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5 pt-1">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50"
            style={{
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              background: "var(--card)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--lavender-600,#7c3aed)", color: "white" }}
            onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <GitBranch className="w-4 h-4" />
            }
            End &amp; Revise Contract
          </button>
        </div>
      </div>
    </div>
  );
}