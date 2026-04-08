/**
 * EndContractDialog.jsx
 *
 * Mirrors the pattern of ExtendDialog — opens as a full-page overlay directly
 * inside LayoutProductionAdmin (not via the CrewSearch OfferActionDialog path).
 *
 * Props:
 *   offer      : object  — needs offer.endDate, offer.offerCode, offer.recipient
 *   onClose    : fn
 *   onConfirm  : fn({ noticePeriodDays, reason }) — parent dispatches the thunk
 *   isLoading  : bool
 */

import { useState, useMemo } from "react";
import { OctagonX, X, Loader2 } from "lucide-react";

// ── Date helpers ──────────────────────────────────────────────────────────────

function fmtDisplay(dateStr) {
  if (!dateStr) return "—";
  return new Date(String(dateStr).split("T")[0] + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// Mirrors the backend logic: effectiveEndDate = min(today + noticeDays, existingEndDate)
function calcEffectiveEnd(endDate, noticePeriodDays) {
  const todayStr     = new Date().toISOString().split("T")[0];
  const todayMs      = new Date(todayStr + "T00:00:00").getTime();
  const noticeMs     = noticePeriodDays * 24 * 60 * 60 * 1000;
  const noticeDateMs = todayMs + noticeMs;
  const noticeDateStr = new Date(noticeDateMs).toISOString().split("T")[0];

  if (!endDate) return noticeDateStr;

  const existingStr = String(endDate).split("T")[0];
  const existingMs  = new Date(existingStr + "T00:00:00").getTime();
  return noticeDateMs < existingMs ? noticeDateStr : existingStr;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function EndContractDialog({ offer, onClose, onConfirm, isLoading }) {
  const [noticePeriodDays, setNoticePeriodDays] = useState(0);
  const [reason,           setReason          ] = useState("");

  const effectiveDate = useMemo(
    () => calcEffectiveEnd(offer?.endDate, noticePeriodDays),
    [offer?.endDate, noticePeriodDays]
  );

  const isCapped    = offer?.endDate &&
    effectiveDate === String(offer.endDate).split("T")[0] &&
    noticePeriodDays > 0;
  const isImmediate = noticePeriodDays === 0;
  const canConfirm  = reason.trim().length > 0;

  const recipientName =
    offer?.recipient?.fullName || offer?.name || "this crew member";

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
              <OctagonX className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white">End Contract Early</h2>
              {offer?.offerCode && (
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {offer.offerCode}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="transition-opacity"
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
            End the contract for{" "}
            <strong style={{ color: "var(--foreground)" }}>{recipientName}</strong>{" "}
            early. Set a notice period and provide a reason.
          </p>

          {/* Current end date */}
          {offer?.endDate && (
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2.5"
              style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}
            >
              <OctagonX className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--destructive)" }} />
              <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                Current end date:{" "}
                <strong style={{ color: "var(--foreground)" }}>
                  {fmtDisplay(offer.endDate)}
                </strong>
              </p>
            </div>
          )}

          {/* Notice period stepper */}
          <div className="space-y-2">
            <label
              className="text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted-foreground)" }}
            >
              Notice Period (days)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNoticePeriodDays((v) => Math.max(0, v - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-semibold transition-colors"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  background: "var(--card)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
              >
                −
              </button>
              <span
                className="text-[22px] font-bold min-w-[3ch] text-center"
                style={{ color: "var(--foreground)" }}
              >
                {noticePeriodDays}
              </span>
              <button
                type="button"
                onClick={() => setNoticePeriodDays((v) => Math.min(90, v + 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-semibold transition-colors"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  background: "var(--card)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
              >
                +
              </button>
              <span className="text-[12px] ml-1" style={{ color: "var(--muted-foreground)" }}>
                {isImmediate
                  ? "Immediate termination"
                  : `Today + ${noticePeriodDays} day${noticePeriodDays !== 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          {/* Effective end date preview */}
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-3"
            style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}
          >
            <OctagonX className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--destructive)" }} />
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-wide"
                style={{ color: "var(--destructive)" }}
              >
                Effective End Date
              </p>
              <p
                className="text-[15px] font-bold mt-0.5"
                style={{ color: "var(--foreground)" }}
              >
                {fmtDisplay(effectiveDate)}
              </p>
              {isCapped && (
                <p className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Notice exceeds contract end — capped at original end date
                </p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
              Reason <span style={{ color: "var(--destructive)" }}>*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Production wrapped early — all crew released from this date…"
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
              All text is stored in uppercase. This will be recorded on the contract.
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
            Keep Active
          </button>
          <button
            onClick={() => {
              if (!canConfirm) return;
              onConfirm({
                noticePeriodDays,
                reason: reason.trim().toUpperCase(),
              });
            }}
            disabled={isLoading || !canConfirm}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--destructive)", color: "white" }}
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <OctagonX className="w-4 h-4" />
            }
            {isImmediate ? "End Contract Now" : `End on ${fmtDisplay(effectiveDate)}`}
          </button>
        </div>

      </div>
    </div>
  );
}