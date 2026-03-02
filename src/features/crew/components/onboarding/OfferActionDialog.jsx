/**
 * OfferActionDialog.jsx
 *
 * Single dynamic component that renders 3 different confirmation dialogs:
 *  1. "sendToCrew"       — purple header, shows recipient/role/email/fee
 *  2. "acceptOffer"      — green header, shows role/fee/start/end
 *  3. "requestChanges"   — red header, textarea for reason
 *
 * Usage:
 *   <OfferActionDialog
 *     type="sendToCrew" | "acceptOffer" | "requestChanges"
 *     offer={offer}
 *     open={true}
 *     onConfirm={(payload) => ...}
 *     onClose={() => ...}
 *     isLoading={false}
 *   />
 */

import { useState } from "react";
import { X, Send, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtMoney = (n, currency = "GBP") => {
  const num = parseFloat(n);
  if (!num) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency", currency, minimumFractionDigits: 0,
  }).format(num);
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const getJobTitle = (offer) =>
  offer?.createOwnJobTitle && offer?.newJobTitle ? offer.newJobTitle : offer?.jobTitle || "—";

// ─── InfoGrid — small 2-col summary card ──────────────────────────────────────

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

// ─── Dialog configs ───────────────────────────────────────────────────────────

function SendToCrewDialog({ offer, onConfirm, onClose, isLoading }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            <Send className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-[16px] font-bold text-gray-900">Send Offer to Crew?</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="px-5 pb-2 space-y-4">
        <p className="text-[13px] text-gray-500 leading-relaxed">
          This will send the offer to the crew member for review. They will be able to accept or request changes.
        </p>
        <InfoGrid
          bg="bg-purple-50/60"
          fields={[
            { label: "Recipient", value: offer?.recipient?.fullName },
            { label: "Role",      value: getJobTitle(offer) },
            { label: "Email",     value: offer?.recipient?.email },
            { label: "Fee/day",   value: fmtMoney(offer?.feePerDay, offer?.currency) },
          ]}
        />
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-5 pb-5 pt-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 h-11 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm({})}
          disabled={isLoading}
          className="flex-1 h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send
        </button>
      </div>
    </>
  );
}

function AcceptOfferDialog({ offer, onConfirm, onClose, isLoading }) {
  return (
    <>
      {/* Header */}
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

      {/* Body */}
      <div className="px-5 pb-2 space-y-4">
        <p className="text-[13px] text-gray-500 leading-relaxed">
          By accepting this offer, you confirm that you have reviewed all terms, rates, and conditions and agree to proceed. Production will be notified immediately.
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

      {/* Footer */}
      <div className="flex gap-3 px-5 pb-5 pt-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 h-11 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm({})}
          disabled={isLoading}
          className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          Accept Offer
        </button>
      </div>
    </>
  );
}

function RequestChangesDialog({ offer, onConfirm, onClose, isLoading }) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onConfirm({ reason: reason.toUpperCase().trim() });
  };

  return (
    <>
      {/* Header */}
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

      {/* Body */}
      <div className="px-5 pb-2 space-y-4">
        <p className="text-[13px] text-gray-500 leading-relaxed">
          Please describe the changes you would like made to this offer. Be as specific as possible so the production team can address your concerns.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="E.G., THE DAILY RATE DISCUSSED WAS £850, NOT £750. ALSO, I REQUIRE A BOX RENTAL ALLOWANCE..."
          rows={5}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[13px] uppercase placeholder:normal-case placeholder:text-gray-400 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition-colors"
        />
        <p className="text-[11px] text-gray-400">
          Your comments will be sent to the production team. All text is stored in uppercase.
        </p>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-5 pb-5 pt-1">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 h-11 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !reason.trim()}
          className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Submit Request
        </button>
      </div>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function OfferActionDialog({
  type,        // "sendToCrew" | "acceptOffer" | "requestChanges"
  offer,
  open,
  onConfirm,
  onClose,
  isLoading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {type === "sendToCrew" && (
          <SendToCrewDialog offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />
        )}
        {type === "acceptOffer" && (
          <AcceptOfferDialog offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />
        )}
        {type === "requestChanges" && (
          <RequestChangesDialog offer={offer} onConfirm={onConfirm} onClose={onClose} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}