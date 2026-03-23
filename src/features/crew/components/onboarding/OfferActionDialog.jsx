/**
 * OfferActionDialog.jsx
 *
 * Dialog types:
 *   "sendToCrew"       — purple  — send offer to crew
 *   "acceptOffer"      — green   — crew accepts offer
 *   "requestChanges"   — red     — crew requests changes
 *   "cancelOffer"      — red     — production cancels offer (real backend call)
 *   "sendToProduction" — violet  — any role sends edit request to production
 */

import { useState } from "react";
import { X, Send, CheckCircle, AlertTriangle, Loader2, Edit2, XCircle } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtMoney = (n, currency = "GBP") => {
  const num = parseFloat(n);
  if (!num) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency, minimumFractionDigits: 0 }).format(num);
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const getJobTitle = (offer) =>
  offer?.createOwnJobTitle && offer?.newJobTitle ? offer.newJobTitle : offer?.jobTitle || "—";

// ─── InfoGrid ─────────────────────────────────────────────────────────────────

function InfoGrid({ fields, bg = "bg-gray-50" }) {
  return (
    <div className={`rounded-xl border border-gray-200 ${bg} p-4 grid grid-cols-2 gap-x-8 gap-y-3`}>
      {fields.map(({ label, value }) => (
        <div key={label}>
          <p className="text-[11px] text-gray-400 font-medium mb-0.5">{label}</p>
          <p className="text-[13px] font-semibold text-gray-800 truncate">{value || "—"}</p>
        </div>
      ))}
    </div>
  );
}

// ─── 1. Send to Crew ──────────────────────────────────────────────────────────

function SendToCrewDialog({ offer, onConfirm, onClose, isLoading }) {
  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
            <Send className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-[16px] font-bold text-gray-900">Send Offer to Crew?</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-5 pb-2 space-y-4">
        <p className="text-[13px] text-gray-500 leading-relaxed">
          This will send the offer to the crew member for review. They will be notified and can
          accept or request changes.
        </p>
        <InfoGrid
          bg="bg-violet-50/60"
          fields={[
            { label: "Recipient", value: offer?.recipient?.fullName },
            { label: "Role",      value: getJobTitle(offer) },
            { label: "Email",     value: offer?.recipient?.email },
            { label: "Fee/day",   value: fmtMoney(offer?.feePerDay, offer?.currency) },
          ]}
        />
      </div>
      <div className="flex gap-3 px-5 pb-5 pt-3">
        <button onClick={onClose} disabled={isLoading}
          className="flex-1 h-11 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button onClick={() => onConfirm({})} disabled={isLoading}
          className="flex-1 h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send to Crew
        </button>
      </div>
    </>
  );
}

// ─── 2. Accept Offer ──────────────────────────────────────────────────────────

function AcceptOfferDialog({ offer, onConfirm, onClose, isLoading }) {
  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-[16px] font-bold text-gray-900">Accept this Offer?</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-5 pb-2 space-y-4">
        <p className="text-[13px] text-gray-500 leading-relaxed">
          By accepting this offer, you confirm that you have reviewed all terms, rates, and
          conditions and agree to proceed. Production will be notified immediately.
        </p>
        <InfoGrid
          bg="bg-emerald-50/60"
          fields={[
            { label: "Role",    value: getJobTitle(offer) },
            { label: "Fee/day", value: fmtMoney(offer?.feePerDay, offer?.currency) },
            { label: "Start",   value: fmtDate(offer?.startDate) },
            { label: "End",     value: fmtDate(offer?.endDate) },
          ]}
        />
      </div>
      <div className="flex gap-3 px-5 pb-5 pt-3">
        <button onClick={onClose} disabled={isLoading}
          className="flex-1 h-11 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button onClick={() => onConfirm({})} disabled={isLoading}
          className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          Accept Offer
        </button>
      </div>
    </>
  );
}

// ─── 3. Request Changes ───────────────────────────────────────────────────────

function RequestChangesDialog({ offer, onConfirm, onClose, isLoading }) {
  const [reason, setReason] = useState("");
  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-[16px] font-bold text-gray-900">Request Changes</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-5 pb-2 space-y-4">
        <p className="text-[13px] text-gray-500 leading-relaxed">
          Describe the changes you would like made. Be as specific as possible.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="E.G., THE DAILY RATE DISCUSSED WAS £850, NOT £750..."
          rows={5}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[13px] uppercase placeholder:normal-case placeholder:text-gray-400 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition-colors"
        />
        <p className="text-[11px] text-gray-400">All text is stored in uppercase.</p>
      </div>
      <div className="flex gap-3 px-5 pb-5 pt-1">
        <button onClick={onClose} disabled={isLoading}
          className="flex-1 h-11 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button
          onClick={() => { if (!reason.trim()) return; onConfirm({ reason: reason.toUpperCase().trim() }); }}
          disabled={isLoading || !reason.trim()}
          className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Submit Request
        </button>
      </div>
    </>
  );
}

// ─── 4. Cancel Offer ─────────────────────────────────────────────────────────
// Production Admin cancels an offer — calls backend PATCH /:id/cancel

function CancelOfferDialog({ offer, onConfirm, onClose, isLoading }) {
  const name     = offer?.recipient?.fullName || "this crew member";
  const jobTitle = getJobTitle(offer);

  return (
    <>
      {/* Red header */}
      <div className="bg-red-600 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <XCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white leading-tight">Cancel Offer</h2>
            {offer?.offerCode && (
              <p className="text-[9px] text-white/60 font-mono mt-0.5">{offer.offerCode}</p>
            )}
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-5 space-y-4">
        <p className="text-[13px] text-neutral-600 leading-relaxed">
          Are you sure you want to cancel the offer for{" "}
          <strong className="text-neutral-900">{name}</strong>
          {jobTitle !== "—" && (
            <> — <span className="text-neutral-700">{jobTitle}</span></>
          )}
          ? This action cannot be undone.
        </p>

        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-[12px] text-red-700 font-semibold mb-1">This will:</p>
          <ul className="text-[11px] text-red-600 space-y-1 list-disc list-inside">
            <li>Set the offer status to CANCELLED</li>
            <li>Notify the crew member if already sent</li>
            <li>Prevent any further actions on this offer</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-5 pb-5">
        <button onClick={onClose} disabled={isLoading}
          className="flex-1 h-11 rounded-xl border border-neutral-200 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50">
          Keep Offer
        </button>
        <button
          onClick={() => onConfirm({})}
          disabled={isLoading}
          className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          Yes, Cancel Offer
        </button>
      </div>
    </>
  );
}

// ─── 5. Send to Production ────────────────────────────────────────────────────

const ROLE_CFG = {
  CREW: {
    label: "Crew Member", heading: "Request an Edit to Your Offer",
    description: "If something in your offer is incorrect — such as your start date, daily rate, allowances, or job title — describe the issue below. Your request will be sent directly to the Production Admin.",
    placeholder: "E.G., MY START DATE SHOULD BE 20 JAN 2025, NOT 14 JAN...",
    badge: "bg-teal-100 text-teal-700",
  },
  UPM: {
    label: "Unit Production Manager", heading: "Send Edit Request to Production",
    description: "As UPM, if you have identified an issue with the contract terms, rates, or crew details that requires amendment, describe the required changes below.",
    placeholder: "E.G., OVERTIME RATE IS INCORRECT — SHOULD REFLECT THE AGREED SCHEDULE D RATES...",
    badge: "bg-violet-100 text-violet-700",
  },
  FC: {
    label: "Financial Controller", heading: "Send Financial Correction to Production",
    description: "As Financial Controller, if you have identified discrepancies in the fee structure, budget codes, allowances, or tax status, detail the corrections needed below.",
    placeholder: "E.G., BUDGET CODE FOR BOX RENTAL IS INCORRECT — SHOULD BE AC-4421 NOT AC-4412...",
    badge: "bg-amber-100 text-amber-700",
  },
  STUDIO: {
    label: "Production Executive", heading: "Request Offer Amendment",
    description: "As the approving Production Executive, if you require changes to the offer before final sign-off, describe the amendments required below.",
    placeholder: "E.G., ENGAGEMENT TYPE SHOULD BE LOAN OUT NOT PAYE...",
    badge: "bg-purple-100 text-purple-700",
  },
};

function SendToProductionDialog({ role = "CREW", offer, onConfirm, onClose, isLoading }) {
  const [notes, setNotes] = useState("");
  const cfg           = ROLE_CFG[role] || ROLE_CFG.CREW;
  const recipientName = offer?.recipient?.fullName || "";
  const offerCode     = offer?.offerCode || "";

  return (
    <>
      <div className="bg-violet-600 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Edit2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white leading-tight">{cfg.heading}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
              {offerCode && <span className="text-[9px] text-white/60 font-mono">{offerCode}</span>}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-5 py-4 space-y-3">
        {recipientName && (
          <p className="text-[12px] text-neutral-500">
            Offer for <strong className="text-neutral-800">{recipientName}</strong>
          </p>
        )}
        <p className="text-[13px] text-neutral-600 leading-relaxed">{cfg.description}</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={cfg.placeholder}
          rows={5}
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] uppercase placeholder:normal-case placeholder:text-neutral-400 text-neutral-800 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-500 transition-colors"
        />
        <p className="text-[10px] text-neutral-400">All text is stored in uppercase.</p>
      </div>
      <div className="flex gap-3 px-5 pb-5">
        <button onClick={onClose} disabled={isLoading}
          className="flex-1 h-11 rounded-xl border border-neutral-200 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button
          onClick={() => { if (!notes.trim()) return; onConfirm(notes.trim().toUpperCase()); }}
          disabled={isLoading || !notes.trim()}
          className="flex-1 h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send to Production
        </button>
      </div>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function OfferActionDialog({
  type,           // "sendToCrew" | "acceptOffer" | "requestChanges" | "cancelOffer" | "sendToProduction"
  role = "CREW",  // only used by "sendToProduction"
  offer,
  open,
  onConfirm,
  onClose,
  isLoading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {type === "sendToCrew"       && <SendToCrewDialog       offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
        {type === "acceptOffer"      && <AcceptOfferDialog      offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
        {type === "requestChanges"   && <RequestChangesDialog   offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
        {type === "cancelOffer"      && <CancelOfferDialog      offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
        {type === "sendToProduction" && <SendToProductionDialog role={role}   offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />}
      </div>
    </div>
  );
}