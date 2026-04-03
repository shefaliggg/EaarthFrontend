/**
 * ExtendDialog.jsx
 * Themed with Tailwind CSS variable utility classes:
 * bg-primary, bg-card, bg-muted, bg-input, text-foreground, etc.
 */

import { useState } from "react";
import { CalendarDays, X, Loader2 } from "lucide-react";

function addDays(dateStr, days) {
  if (!dateStr) return "";
  const d = new Date(String(dateStr).split("T")[0] + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function ExtendDialog({ offer, onClose, onConfirm, isLoading }) {
  const [newEndDate, setNewEndDate] = useState("");
  const [note, setNote] = useState("");

  const currentEnd = offer?.endDate
    ? new Date(String(offer.endDate).split("T")[0] + "T00:00:00").toLocaleDateString("en-GB")
    : "—";

  const minDate = addDays(offer?.endDate, 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-[2px] bg-shadow/40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 bg-card border border-border">

        {/* ── Header ── */}
        <div className="px-5 py-4 flex items-center justify-between bg-primary">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-foreground/15">
              <CalendarDays className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-primary-foreground">
                Extend Contract
              </h2>
              <p className="text-[10px] mt-0.5 text-primary-foreground/60">
                {offer?.offerCode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="opacity-70 hover:opacity-100 transition-opacity text-primary-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-4 space-y-4">

          {/* Current end date pill */}
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-lavender-50 border border-lavender-200">
            <CalendarDays className="w-3.5 h-3.5 shrink-0 text-primary" />
            <p className="text-[11px] text-muted-foreground">
              Current end date:{" "}
              <strong className="text-foreground">{currentEnd}</strong>
            </p>
          </div>

          {/* New end date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              New end date <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              min={minDate}
              className="w-full h-10 rounded-xl px-3 text-sm bg-input border border-border text-foreground"
            />
            {minDate && (
              <p className="text-[10px] text-muted-foreground">
                Must be after {currentEnd}
              </p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Reason / note{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Schedule extended due to additional photography days…"
              rows={3}
              className="w-full rounded-xl px-3 py-2.5 text-[12px] resize-none bg-input border border-border text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          <p className="text-[10px] text-muted-foreground">
            This will update the contract end date and generate an Extension Agreement.
            The same contract continues with the extended term.
          </p>
        </div>

        {/* ── Footer ── */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold disabled:opacity-50 transition-colors bg-muted text-muted-foreground border border-border hover:opacity-80"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (newEndDate) onConfirm({ newEndDate, note }); }}
            disabled={isLoading || !newEndDate}
            className="flex-1 h-11 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-primary text-primary-foreground hover:opacity-90"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <CalendarDays className="w-4 h-4" />
            }
            Extend Contract
          </button>
        </div>

      </div>
    </div>
  );
}