/**
 * OfferActionDialog.jsx
 *
 * NEW dialog type added:
 *   "deleteOffer"  — confirmation dialog for permanently deleting a DRAFT/CANCELLED/VOIDED offer.
 *                    Replaces the inline DeleteConfirmDialog that used to live in OffersListRow.
 *
 *   "endAndRevise" — preview/info dialog that navigates → ?openEndAndRevise=true
 *                    (same pattern as "extendContract", "endContract", "voidAndReplace")
 *
 * All other dialog types unchanged.
 */

import { useState } from "react";
import {
  X, Send, CheckCircle, AlertTriangle, Loader2, Edit2, XCircle,
  ClipboardCheck, MessageSquare, CalendarDays, Copy, OctagonX, ShieldAlert, GitBranch,
  Trash2,
} from "lucide-react";

const fmtMoney = (n, currency = "GBP") => {
  const num = parseFloat(n);
  if (!num) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency, minimumFractionDigits: 0 }).format(num);
};

const fmtDate = (d) =>
  d ? new Date(String(d).split("T")[0] + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const getJobTitle = (offer) =>
  offer?.createOwnJobTitle && offer?.newJobTitle ? offer.newJobTitle : offer?.jobTitle || "—";

function DialogShell({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-[2px]" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden" style={{ background: "var(--card)" }}>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ bg, icon: Icon, title, subtitle, offerCode, onClose }) {
  return (
    <div className="px-5 pt-5 pb-3 flex items-center justify-between" style={{ background: bg }}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
          <Icon className="w-4 h-4" style={{ color: "white" }} />
        </div>
        <div>
          <h2 className="text-[16px] font-bold leading-tight" style={{ color: "white" }}>{title}</h2>
          {(subtitle || offerCode) && (
            <div className="flex items-center gap-2 mt-0.5">
              {subtitle && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>{subtitle}</span>}
              {offerCode && <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.6)" }}>{offerCode}</span>}
            </div>
          )}
        </div>
      </div>
      <button onClick={onClose} className="transition-colors shrink-0" style={{ color: "rgba(255,255,255,0.7)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}>
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

function InfoGrid({ fields, bgVar = "var(--muted)" }) {
  return (
    <div className="rounded-xl p-4 grid grid-cols-2 gap-x-8 gap-y-3" style={{ background: bgVar, border: "1px solid var(--border)" }}>
      {fields.map(({ label, value }) => (
        <div key={label}>
          <p className="text-[11px] font-medium mb-0.5" style={{ color: "var(--muted-foreground)" }}>{label}</p>
          <p className="text-[13px] font-semibold truncate" style={{ color: "var(--foreground)" }}>{value || "—"}</p>
        </div>
      ))}
    </div>
  );
}

function DialogFooter({ onClose, onConfirm, isLoading, confirmLabel, confirmBg, confirmHoverBg, confirmIcon: ConfirmIcon, disabled, cancelLabel = "Cancel" }) {
  return (
    <div className="flex gap-3 px-5 pb-5 pt-3">
      <button onClick={onClose} disabled={isLoading}
        className="flex-1 h-11 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50"
        style={{ border: "1px solid var(--border)", color: "var(--foreground)", background: "var(--card)" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
      >{cancelLabel}</button>
      <button onClick={onConfirm} disabled={isLoading || disabled}
        className="flex-1 h-11 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: confirmBg, color: "white" }}
        onMouseEnter={(e) => { if (!isLoading && !disabled && confirmHoverBg) e.currentTarget.style.background = confirmHoverBg; }}
        onMouseLeave={(e) => (e.currentTarget.style.background = confirmBg)}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : ConfirmIcon && <ConfirmIcon className="w-4 h-4" />}
        {confirmLabel}
      </button>
    </div>
  );
}

// ─── 0. Delete Offer ──────────────────────────────────────────────────────────
// Replaces the inline DeleteConfirmDialog from OffersListRow.
// Used when user clicks Delete on a DRAFT / CANCELLED / VOIDED offer in the list.

function DeleteOfferDialog({ offer, onConfirm, onClose, isLoading }) {
  const name = offer?.recipient?.fullName || offer?.fullName || "this offer";
  return (
    <DialogShell onClose={isLoading ? undefined : onClose}>
      <DialogHeader
        bg="var(--destructive, #dc2626)"
        icon={Trash2}
        title="Delete Offer?"
        offerCode={offer?.offerCode}
        onClose={isLoading ? undefined : onClose}
      />
      <div className="px-5 py-5 space-y-4">
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Are you sure you want to permanently delete the offer for{" "}
          <strong style={{ color: "var(--foreground)" }}>{name}</strong>?
          This cannot be undone.
        </p>
        <div
          className="rounded-xl px-4 py-3 flex items-start gap-2.5"
          style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--destructive, #dc2626)" }} />
          <ul className="text-[11px] space-y-1 list-disc list-inside" style={{ color: "var(--destructive, #dc2626)" }}>
            <li>The offer and all associated data will be removed</li>
            <li>This action cannot be reversed</li>
          </ul>
        </div>
      </div>
      <DialogFooter
        onClose={onClose}
        onConfirm={onConfirm}
        isLoading={isLoading}
        confirmLabel="Yes, Delete"
        confirmBg="var(--destructive, #dc2626)"
        confirmHoverBg="#b91c1c"
        confirmIcon={Trash2}
        cancelLabel="Keep Offer"
      />
    </DialogShell>
  );
}

// ─── 1. Send to Crew ─────────────────────────────────────────────────────────

function SendToCrewDialog({ offer, onConfirm, onClose, isLoading }) {
  return (
    <DialogShell onClose={onClose}>
      <DialogHeader bg="var(--primary)" icon={Send} title="Send Offer to Crew?" onClose={onClose} />
      <div className="px-5 pb-2 space-y-4" style={{ paddingTop: "1.25rem" }}>
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          This will send the offer to the crew member for review. They will be notified and can accept or request changes.
        </p>
        <InfoGrid bgVar="var(--lavender-50)" fields={[
          { label: "Recipient", value: offer?.recipient?.fullName },
          { label: "Role",      value: getJobTitle(offer) },
          { label: "Email",     value: offer?.recipient?.email },
          { label: "Fee/day",   value: fmtMoney(offer?.feePerDay, offer?.currency) },
        ]} />
      </div>
      <DialogFooter onClose={onClose} onConfirm={() => onConfirm({})} isLoading={isLoading} confirmLabel="Send to Crew" confirmBg="var(--primary)" confirmIcon={Send} />
    </DialogShell>
  );
}

// ─── 2. Accept Offer ─────────────────────────────────────────────────────────

function AcceptOfferDialog({ offer, onConfirm, onClose, isLoading }) {
  return (
    <DialogShell onClose={onClose}>
      <DialogHeader bg="var(--mint-600)" icon={CheckCircle} title="Accept this Offer?" onClose={onClose} />
      <div className="px-5 pb-2 space-y-4" style={{ paddingTop: "1.25rem" }}>
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          By accepting, you confirm you have reviewed all terms and agree to proceed. Production will be notified immediately.
        </p>
        <InfoGrid bgVar="var(--mint-50)" fields={[
          { label: "Role",    value: getJobTitle(offer) },
          { label: "Fee/day", value: fmtMoney(offer?.feePerDay, offer?.currency) },
          { label: "Start",   value: fmtDate(offer?.startDate) },
          { label: "End",     value: fmtDate(offer?.endDate) },
        ]} />
      </div>
      <DialogFooter onClose={onClose} onConfirm={() => onConfirm({})} isLoading={isLoading} confirmLabel="Accept Offer" confirmBg="var(--mint-600)" confirmHoverBg="var(--mint-700)" confirmIcon={CheckCircle} />
    </DialogShell>
  );
}

// ─── 3. Request Changes ──────────────────────────────────────────────────────

function RequestChangesDialog({ offer, onConfirm, onClose, isLoading }) {
  const [reason, setReason] = useState("");
  const trimmed = reason.trim();
  return (
    <DialogShell onClose={onClose}>
      <DialogHeader bg="var(--destructive)" icon={AlertTriangle} title="Request Changes" onClose={onClose} />
      <div className="px-5 pt-5 pb-2 space-y-4">
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>Please describe the changes you would like made to this offer.</p>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)}
          placeholder="E.G., THE DAILY RATE DISCUSSED WAS £850, NOT £750..." rows={6}
          className="w-full rounded-xl px-4 py-3 text-[13px] uppercase placeholder:normal-case resize-none outline-none"
          style={{ background: "var(--input)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
      </div>
      <DialogFooter onClose={onClose} onConfirm={() => { if (!trimmed) return; onConfirm({ reason: trimmed.toUpperCase() }); }}
        isLoading={isLoading} disabled={!trimmed} confirmLabel="Submit Request" confirmBg="var(--destructive)" confirmIcon={Send} />
    </DialogShell>
  );
}

// ─── 4. Cancel Offer ─────────────────────────────────────────────────────────

function CancelOfferDialog({ offer, onConfirm, onClose, isLoading }) {
  const name = offer?.recipient?.fullName || "this crew member";
  const jobTitle = getJobTitle(offer);
  return (
    <DialogShell onClose={onClose}>
      <DialogHeader bg="var(--destructive)" icon={XCircle} title="Cancel Offer" offerCode={offer?.offerCode} onClose={onClose} />
      <div className="px-5 py-5 space-y-4">
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Are you sure you want to cancel the offer for <strong style={{ color: "var(--foreground)" }}>{name}</strong>
          {jobTitle !== "—" && <> — <span style={{ color: "var(--foreground)" }}>{jobTitle}</span></>}? This action cannot be undone.
        </p>
        <div className="rounded-xl p-4" style={{ background: "var(--lavender-50)", border: "1px solid var(--lavender-200)" }}>
          <p className="text-[12px] font-semibold mb-1" style={{ color: "var(--destructive)" }}>This will:</p>
          <ul className="text-[11px] space-y-1 list-disc list-inside" style={{ color: "var(--destructive)" }}>
            <li>Set the offer status to CANCELLED</li>
            <li>Notify the crew member if already sent</li>
            <li>Prevent any further actions on this offer</li>
          </ul>
        </div>
      </div>
      <div className="flex gap-3 px-5 pb-5">
        <button onClick={onClose} disabled={isLoading}
          className="flex-1 h-11 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50"
          style={{ border: "1px solid var(--border)", color: "var(--foreground)", background: "var(--card)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
        >Keep Offer</button>
        <button onClick={() => onConfirm({})} disabled={isLoading}
          className="flex-1 h-11 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: "var(--destructive)", color: "white" }}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          Yes, Cancel Offer
        </button>
      </div>
    </DialogShell>
  );
}

// ─── 5. Send to Production ───────────────────────────────────────────────────

const ROLE_CFG = {
  CREW:   { label: "Crew Member",            heading: "Request an Edit to Your Offer",          description: "If something in your offer is incorrect — such as your start date, daily rate, allowances, or job title — describe the issue below. Your request will be sent directly to the Production Admin.", placeholder: "E.G., MY START DATE SHOULD BE 20 JAN 2025, NOT 14 JAN..." },
  UPM:    { label: "Unit Production Manager", heading: "Send Edit Request to Production",        description: "As UPM, if you have identified an issue with the contract terms, rates, or crew details that requires amendment, describe the required changes below.", placeholder: "E.G., OVERTIME RATE IS INCORRECT — SHOULD REFLECT THE AGREED SCHEDULE D RATES..." },
  FC:     { label: "Financial Controller",    heading: "Send Financial Correction to Production", description: "As Financial Controller, if you have identified discrepancies in the fee structure, budget codes, allowances, or tax status, detail the corrections needed below.", placeholder: "E.G., BUDGET CODE FOR BOX RENTAL IS INCORRECT — SHOULD BE AC-4421 NOT AC-4412..." },
  STUDIO: { label: "Production Executive",    heading: "Request Offer Amendment",               description: "As the approving Production Executive, if you require changes to the offer before final sign-off, describe the amendments required below.", placeholder: "E.G., ENGAGEMENT TYPE SHOULD BE LOAN OUT NOT PAYE..." },
};

function SendToProductionDialog({ role = "CREW", offer, onConfirm, onClose, isLoading }) {
  const [notes, setNotes] = useState("");
  const cfg = ROLE_CFG[role] || ROLE_CFG.CREW;
  const recipientName = offer?.recipient?.fullName || "";
  return (
    <DialogShell onClose={onClose}>
      <DialogHeader bg="var(--primary)" icon={Edit2} title={cfg.heading} subtitle={cfg.label} offerCode={offer?.offerCode} onClose={onClose} />
      <div className="px-5 py-4 space-y-3">
        {recipientName && <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>Offer for <strong style={{ color: "var(--foreground)" }}>{recipientName}</strong></p>}
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{cfg.description}</p>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={cfg.placeholder} rows={5}
          className="w-full rounded-xl px-4 py-3 text-[13px] uppercase resize-none outline-none"
          style={{ background: "var(--input)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
      </div>
      <DialogFooter onClose={onClose} onConfirm={() => { if (!notes.trim()) return; onConfirm(notes.trim().toUpperCase()); }}
        isLoading={isLoading} disabled={!notes.trim()} confirmLabel="Send to Production" confirmBg="var(--primary)" confirmIcon={Send} />
    </DialogShell>
  );
}

// ─── 6. Approve Offer ────────────────────────────────────────────────────────

function ApproveOfferDialog({ offer, verifiedItems = [], onConfirm, onClose, isLoading }) {
  const name = offer?.recipient?.fullName ? offer.recipient.fullName.toUpperCase() : "THIS CREW MEMBER";
  return (
    <DialogShell onClose={onClose}>
      <DialogHeader bg="var(--mint-600)" icon={ClipboardCheck} title="Approve & Send for Signatures?" onClose={onClose} />
      <div className="px-5 pt-5 pb-2 space-y-4">
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          You have verified all budget and payroll items for <strong style={{ color: "var(--foreground)" }}>{name}</strong>. This will move the offer to the Crew Signing stage.
        </p>
        {verifiedItems.length > 0 && (
          <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--mint-50)", border: "1px solid var(--mint-100)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--mint-700)" }}>Verified Items</p>
            {verifiedItems.map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--mint-500)" }} />
                <span className="text-[12px]" style={{ color: "var(--mint-800)" }}>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <DialogFooter onClose={onClose} onConfirm={() => onConfirm({})} isLoading={isLoading}
        confirmLabel="Approve" confirmBg="var(--mint-600)" confirmHoverBg="var(--mint-700)" confirmIcon={CheckCircle} />
    </DialogShell>
  );
}

// ─── 7. Return to Production ─────────────────────────────────────────────────

function ReturnToProductionDialog({ offer, onConfirm, onClose, isLoading }) {
  const [notes, setNotes] = useState("");
  const name = offer?.recipient?.fullName || "this crew member";
  return (
    <DialogShell onClose={onClose}>
      <DialogHeader bg="var(--peach-500)" icon={MessageSquare} title="Return to Production" offerCode={offer?.offerCode} onClose={onClose} />
      <div className="px-5 py-5 space-y-3">
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Specify the issues found during accounts review for <strong style={{ color: "var(--foreground)" }}>{name}</strong>. The offer will be sent back to Production Review.
        </p>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="E.G., BUDGET CODES DO NOT MATCH APPROVED CODES..." rows={4}
          className="w-full rounded-xl px-4 py-3 text-[13px] uppercase placeholder:normal-case resize-none outline-none"
          style={{ background: "var(--input)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
      </div>
      <DialogFooter onClose={onClose} onConfirm={() => { if (!notes.trim()) return; onConfirm(notes.trim().toUpperCase()); }}
        isLoading={isLoading} disabled={!notes.trim()} confirmLabel="Return to Production"
        confirmBg="var(--peach-500)" confirmHoverBg="var(--peach-600)" confirmIcon={Send} />
    </DialogShell>
  );
}

// ─── 8. Extend Contract ──────────────────────────────────────────────────────

function ExtendContractDialog({ offer, onConfirm, onClose, isLoading }) {
  return (
    <DialogShell onClose={onClose}>
      <DialogHeader bg="var(--primary)" icon={CalendarDays} title="Extend Contract" offerCode={offer?.offerCode} onClose={onClose} />
      <div className="px-5 pt-5 pb-2 space-y-4">
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          You're about to extend the contract for <strong style={{ color: "var(--foreground)" }}>{offer?.name || offer?.recipient?.fullName}</strong> ({offer?.role || getJobTitle(offer)}).
        </p>
        <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: "var(--lavender-50)", border: "1px solid var(--lavender-200)" }}>
          <CalendarDays className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--lavender-500)" }}>Current End Date</p>
            <p className="text-[13px] font-semibold mt-0.5" style={{ color: "var(--foreground)" }}>{fmtDate(offer?.endDate)}</p>
          </div>
        </div>
        <div className="rounded-xl px-4 py-3 flex items-start gap-2.5" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--muted-foreground)" }} />
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            You'll be taken to the contract page where you can set the new end date and add notes before confirming the extension.
          </p>
        </div>
      </div>
      <DialogFooter onClose={onClose} onConfirm={() => onConfirm(offer)} isLoading={isLoading}
        confirmLabel="Go to Contract" confirmBg="var(--primary)" confirmHoverBg="var(--lavender-400)" confirmIcon={CalendarDays} />
    </DialogShell>
  );
}

// ─── 9. Clone Offer ──────────────────────────────────────────────────────────

function CloneOfferDialog({ offer, onConfirm, onClose, isLoading }) {
  const WHAT_COPIES = ["Rates & Allowances", "Schedule", "Stipulations", "Contract type"];
  return (
    <DialogShell onClose={onClose}>
      <DialogHeader bg="var(--primary)" icon={Copy} title="Clone Offer" offerCode={offer?.offerCode} onClose={onClose} />
      <div className="px-5 pt-5 pb-2 space-y-4">
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Clone <strong style={{ color: "var(--foreground)" }}>{offer?.name || offer?.recipient?.fullName}'s</strong>{" "}
          offer ({offer?.role || getJobTitle(offer)}) into a new Draft with the same terms — recipient cleared for a new crew member.
        </p>
        <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--lavender-50)", border: "1px solid var(--lavender-100)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--lavender-700)" }}>What gets copied</p>
          {WHAT_COPIES.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--primary)" }} />
              <span className="text-[12px]" style={{ color: "var(--foreground)" }}>{item}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-4 py-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>Recipient details will be blank — fill them in before sending.</p>
        </div>
      </div>
      <DialogFooter onClose={onClose} onConfirm={() => onConfirm(offer)} isLoading={isLoading}
        confirmLabel="Clone Offer" confirmBg="var(--primary)" confirmHoverBg="var(--lavender-700)" confirmIcon={Copy} />
    </DialogShell>
  );
}

// ─── 10. End Contract ────────────────────────────────────────────────────────

function EndContractDialog({ offer, onConfirm, onClose, isLoading }) {
  const name = offer?.name || offer?.recipient?.fullName || "this crew member";
  const jobTitle = getJobTitle(offer);
  return (
    <DialogShell onClose={onClose}>
      <DialogHeader bg="var(--destructive)" icon={OctagonX} title="End Contract Early" offerCode={offer?.offerCode} onClose={onClose} />
      <div className="px-5 pt-5 pb-2 space-y-4">
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          You're about to end the contract early for <strong style={{ color: "var(--foreground)" }}>{name}</strong>
          {jobTitle !== "—" && <> ({jobTitle})</>}.
        </p>
        <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}>
          <OctagonX className="w-4 h-4 shrink-0" style={{ color: "var(--destructive)" }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--destructive)" }}>Current End Date</p>
            <p className="text-[13px] font-semibold mt-0.5" style={{ color: "var(--foreground)" }}>{fmtDate(offer?.endDate)}</p>
          </div>
        </div>
        <div className="rounded-xl px-4 py-3 flex items-start gap-2.5" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--muted-foreground)" }} />
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            You'll be taken to the contract page to set the notice period and reason before confirming.
          </p>
        </div>
      </div>
      <DialogFooter onClose={onClose} onConfirm={() => onConfirm(offer)} isLoading={isLoading}
        confirmLabel="Go to Contract" confirmBg="var(--destructive)" confirmIcon={OctagonX} cancelLabel="Keep Active" />
    </DialogShell>
  );
}

// ─── 11. Void & Replace (preview) ────────────────────────────────────────────

function VoidAndReplacePreviewDialog({ offer, onConfirm, onClose, isLoading }) {
  const name = offer?.name || offer?.recipient?.fullName || "this crew member";
  const jobTitle = getJobTitle(offer);

  const WHAT_HAPPENS = [
    "Existing contract marked as VOIDED and locked (read-only)",
    "All unsigned documents voided immediately",
    "New DRAFT offer created with all data copied",
    "Production can correct errors and restart workflow",
    "Original contract retained for audit — linked to new contract",
  ];

  return (
    <DialogShell onClose={onClose}>
      <DialogHeader bg="var(--destructive)" icon={ShieldAlert} title="Void & Replace Contract" offerCode={offer?.offerCode} onClose={onClose} />
      <div className="px-5 pt-5 pb-2 space-y-4">
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          You're about to void the contract for{" "}
          <strong style={{ color: "var(--foreground)" }}>{name}</strong>
          {jobTitle !== "—" && <> ({jobTitle})</>}{" "}
          due to <strong style={{ color: "var(--foreground)" }}>incorrect data</strong>. A replacement draft will be created.
        </p>
        <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.2)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--destructive)" }}>What happens</p>
          {WHAT_HAPPENS.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--destructive)" }} />
              <span className="text-[11px]" style={{ color: "var(--foreground)" }}>{item}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-4 py-3 flex items-start gap-2.5" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--muted-foreground)" }} />
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            You'll be taken to the contract page to provide a reason and confirm.
            The replacement offer will open for editing immediately after.
          </p>
        </div>
      </div>
      <DialogFooter onClose={onClose} onConfirm={() => onConfirm(offer)} isLoading={isLoading}
        confirmLabel="Go to Contract" confirmBg="var(--destructive)" confirmIcon={ShieldAlert} cancelLabel="Keep Contract" />
    </DialogShell>
  );
}

// ─── 12. End & Revise (preview) ───────────────────────────────────────────── NEW

function EndAndRevisePreviewDialog({ offer, onConfirm, onClose, isLoading }) {
  const name     = offer?.name || offer?.recipient?.fullName || "this crew member";
  const jobTitle = getJobTitle(offer);

  const WHAT_HAPPENS = [
    "Current contract ended on the date you choose",
    "Old contract marked as REVISED — preserved for full audit trail",
    "New DRAFT offer created with all terms copied",
  ];

  return (
    <DialogShell onClose={onClose}>
      <DialogHeader
        bg="var(--lavender-600,#7c3aed)"
        icon={GitBranch}
        title="End & Revise Contract"
        offerCode={offer?.offerCode}
        onClose={onClose}
      />
      <div className="px-5 pt-5 pb-2 space-y-4">
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Use this when the contract for{" "}
          <strong style={{ color: "var(--foreground)" }}>{name}</strong>
          {jobTitle !== "—" && <> ({jobTitle})</>}{" "}
          was <strong style={{ color: "var(--foreground)" }}>correct but the terms need to change</strong> — such as a rate increase, schedule change, or new agreement.
        </p>

        <div
          className="rounded-xl p-3 grid grid-cols-2 gap-x-6 gap-y-2"
          style={{ background: "var(--lavender-50,#f5f3ff)", border: "1px solid var(--lavender-200,#ddd6fe)" }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--lavender-600,#7c3aed)" }}>Current Start</p>
            <p className="text-[13px] font-bold" style={{ color: "var(--foreground)" }}>{fmtDate(offer?.startDate)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--lavender-600,#7c3aed)" }}>Current End</p>
            <p className="text-[13px] font-bold" style={{ color: "var(--foreground)" }}>{fmtDate(offer?.endDate) || "Open"}</p>
          </div>
        </div>

        <div
          className="rounded-xl p-4 space-y-2"
          style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--muted-foreground)" }}>
            What happens
          </p>
          {WHAT_HAPPENS.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--lavender-600,#7c3aed)" }} />
              <span className="text-[11px]" style={{ color: "var(--foreground)" }}>{item}</span>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl px-4 py-3 flex items-start gap-2.5"
          style={{ background: "var(--lavender-50,#f5f3ff)", border: "1px solid var(--lavender-200,#ddd6fe)" }}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--lavender-600,#7c3aed)" }} />
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--lavender-700,#6d28d9)" }}>
            You'll be taken to the contract page to set the end date, new effective date, and reason.
            The revised offer will open for editing immediately after.
          </p>
        </div>
      </div>
      <DialogFooter
        onClose={onClose}
        onConfirm={() => onConfirm(offer)}
        isLoading={isLoading}
        confirmLabel="Go to Contract"
        confirmBg="var(--lavender-600,#7c3aed)"
        confirmIcon={GitBranch}
        cancelLabel="Keep Contract"
      />
    </DialogShell>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function OfferActionDialog({
  type, role = "CREW", offer, open, onConfirm, onClose, isLoading = false, verifiedItems = [],
}) {
  if (!open) return null;
  return (
    <>
      {type === "deleteOffer"        && <DeleteOfferDialog            offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      {type === "sendToCrew"         && <SendToCrewDialog             offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      {type === "acceptOffer"        && <AcceptOfferDialog            offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      {type === "requestChanges"     && <RequestChangesDialog         offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      {type === "cancelOffer"        && <CancelOfferDialog            offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      {type === "sendToProduction"   && <SendToProductionDialog       role={role}   offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      {type === "approveOffer"       && <ApproveOfferDialog           offer={offer} verifiedItems={verifiedItems} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      {type === "returnToProduction" && <ReturnToProductionDialog     offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      {type === "extendContract"     && <ExtendContractDialog         offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      {type === "cloneOffer"         && <CloneOfferDialog             offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      {type === "endContract"        && <EndContractDialog            offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      {type === "voidAndReplace"     && <VoidAndReplacePreviewDialog  offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      {type === "endAndRevise"       && <EndAndRevisePreviewDialog    offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
    </>
  );
}