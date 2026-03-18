/**
 * layouts/LayoutAccountsReview.jsx
 *
 * ACCOUNTS REVIEW — differs from ProductionReview in these ways:
 *
 *  1. NO CrewIdentityHeader / No Edit button (accounts doesn't edit)
 *  2. "Return to Production" button → opens ReturnToProductionDialog
 *     (orange header, textarea for issue notes)
 *  3. Dialog confirm → navigates to /offers/:id/edit (Create Offer in edit mode)
 *     (future: will also call backend action + send notification)
 *  4. Checklist items → budget/payroll/final
 *  5. Primary action → "Approve & Send for Signatures" → onAction("pendingCrewSignature")
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ClipboardCheck, Send, Loader2, CheckCircle2, X,
  FileText, ShieldCheck, FileCheck, PenLine,
  TrendingUp, DollarSign, Receipt, BarChart2, AlertTriangle,
} from "lucide-react";

import ContractInstancesPanel  from "../../../pages/ContractInstancesPanel";
import SubmittedDocumentsPanel from "../../../components/viewoffer/layouts/SubmittedDocumentsPanel";

// ─── Checklist items ──────────────────────────────────────────────────────────

const ACCT_CHECKLIST = [
  { key: "budgetCodesVerified",   label: "All budget codes verified",           Icon: BarChart2,   cat: "Budget"  },
  { key: "rateCalcsReviewed",     label: "Rate calculations reviewed",          Icon: TrendingUp,  cat: "Budget"  },
  { key: "allowancesConfirmed",   label: "Allowances confirmed against budget", Icon: DollarSign,  cat: "Budget"  },
  { key: "overtimeRatesOk",       label: "Overtime rates confirmed",            Icon: Receipt,     cat: "Budget"  },
  { key: "payrollSetupOk",        label: "Payroll setup confirmed",             Icon: ShieldCheck, cat: "Payroll" },
  { key: "taxStatusConfirmed",    label: "Tax status confirmed",                Icon: FileCheck,   cat: "Payroll" },
  { key: "contractTermsApproved", label: "Contract terms approved by accounts", Icon: FileText,    cat: "Final"   },
  { key: "readyForSignature",     label: "Ready for crew signature",            Icon: PenLine,     cat: "Final"   },
];

// ─── Return to Production Dialog ──────────────────────────────────────────────

function ReturnToProductionDialog({ offer, onConfirm, onClose, isLoading }) {
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Orange header */}
        <div className="bg-orange-500 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-[15px] font-bold text-white">Return to Production</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <p className="text-[13px] text-neutral-600 leading-relaxed">
            Specify the issues found during accounts review for{" "}
            <strong>{offer?.recipient?.fullName || contractName}</strong>. The offer will be sent
            back to Production Review.
          </p>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.G., BUDGET CODES DO NOT MATCH APPROVED CODES. OVERTIME RATE EXCEEDS APPROVED CAP..."
            rows={5}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] uppercase placeholder:normal-case placeholder:text-neutral-400 text-neutral-800 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-colors"
          />

          <p className="text-[11px] text-neutral-400">
            All text is stored in uppercase. Production will receive a notification.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl border border-neutral-200 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(notes.trim())}
            disabled={isLoading}
            className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
            Return to Production
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Checklist widget ─────────────────────────────────────────────────────────

function ChecklistWidget({ items, checked, onChange, disabled }) {
  const cats    = [...new Set(items.map((c) => c.cat))];
  const total   = items.length;
  const done    = items.filter((c) => checked[c.key]).length;
  const allDone = done === total;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="bg-violet-600 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-3.5 w-3.5 text-white" />
          <span className="text-white text-[11px] font-semibold uppercase tracking-wide">
            Accounts Checklist
          </span>
        </div>
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
          allDone ? "bg-emerald-400 text-emerald-900" : "bg-white/20 text-white"
        }`}>
          {done}/{total} verified
        </span>
      </div>

      <div className="h-1 bg-neutral-100">
        <div
          className={`h-full transition-all duration-500 ${allDone ? "bg-emerald-500" : "bg-violet-500"}`}
          style={{ width: `${total ? (done / total) * 100 : 0}%` }}
        />
      </div>

      <div className="px-3 py-3 space-y-3">
        {cats.map((cat) => {
          const catItems = items.filter((c) => c.cat === cat);
          const catDone  = catItems.filter((c) => checked[c.key]).length;
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold text-violet-500 uppercase tracking-widest">{cat}</span>
                <span className="text-[8px] text-neutral-400">{catDone}/{catItems.length}</span>
              </div>
              <div className="space-y-1">
                {catItems.map((item) => {
                  const ItemIcon = item.Icon;
                  const on = !!checked[item.key];
                  return (
                    <button
                      key={item.key}
                      disabled={disabled}
                      onClick={() => onChange(item.key, !on)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all
                        ${on ? "bg-emerald-50 border border-emerald-200" : "bg-neutral-50 border border-neutral-100 hover:border-neutral-200 hover:bg-white"}
                        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        on ? "bg-emerald-500 border-emerald-500" : "border-neutral-300 bg-white"
                      }`}>
                        {on && (
                          <svg className="w-2 h-2 text-white" viewBox="0 0 8 8" fill="none">
                            <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      {ItemIcon && <ItemIcon className={`h-3 w-3 shrink-0 ${on ? "text-emerald-400" : "text-neutral-300"}`} />}
                      <span className={`text-[10px] leading-tight flex-1 ${on ? "text-emerald-700" : "text-neutral-600"}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {allDone && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-2 mt-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="text-[10px] font-semibold text-emerald-700">All checks complete</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export default function LayoutAccountsReview({
  offer, contractData, allowances, calculatedRates,
  isSubmitting, onAction, dispatch,
}) {
  const navigate             = useNavigate();
  const { id, projectName }  = useParams();
  const proj                 = projectName || "demo-project";
  const offerId              = id || offer?._id;

  const [checklist,   setChecklist  ] = useState({});
  const [showApprove, setShowApprove] = useState(false);
  const [showReturn,  setShowReturn  ] = useState(false);   // Return to Production dialog
  const [approved,    setApproved   ] = useState(false);

  const allDone = ACCT_CHECKLIST.every((c) => checklist[c.key]);

  // ── Return to Production confirmed ────────────────────────────────────────
  // For now: navigate to edit page. Future: also call backend + send notification.
  const handleReturnConfirm = (notes) => {
    setShowReturn(false);
    // TODO (future): dispatch action to send notes to production + reset status
    // await onAction("returnToProduction", { notes });
    navigate(`/projects/${proj}/offers/${offerId}/edit`);
  };

  return (
    <div className="space-y-4">

      {/* ── NO CrewIdentityHeader in Accounts Review ── */}

      {/* ── Main 2-col layout ── */}
      <div className="flex gap-4 items-start">

        {/* Centre column */}
        <div className="flex-1 min-w-0 space-y-4">

          <SubmittedDocumentsPanel offerId={offer?._id} offer={offer} />

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-100">
              <FileText className="w-3.5 h-3.5 text-violet-500" />
              <h3 className="text-[12px] font-semibold text-neutral-800">Contract Documents</h3>
            </div>
            <div className="p-4">
              {offer?._id && <ContractInstancesPanel offerId={offer._id} />}
            </div>
          </div>

        </div>

        {/* Right sidebar */}
        <div className="w-[260px] shrink-0 space-y-3">

          <ChecklistWidget
            items={ACCT_CHECKLIST}
            checked={checklist}
            onChange={(key, val) => setChecklist((p) => ({ ...p, [key]: val }))}
            disabled={approved}
          />

          {!approved ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-3 space-y-2">
              {/* Primary — Approve */}
              <button
                onClick={() => allDone && setShowApprove(true)}
                disabled={!allDone || isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold transition-all ${
                  allDone && !isSubmitting
                    ? "bg-violet-600 text-white hover:bg-violet-700"
                    : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PenLine className="h-3.5 w-3.5" />}
                Approve &amp; Send for Signatures
              </button>

              {/* Secondary — Return to Production (opens dialog) */}
              <button
                onClick={() => setShowReturn(true)}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-orange-200 text-orange-600 text-[11px] font-medium hover:bg-orange-50 transition-colors"
              >
                <Send className="h-3 w-3" /> Return to Production
              </button>

              {!allDone && (
                <p className="text-[9px] text-neutral-400 text-center">
                  Complete all checklist items to approve
                </p>
              )}
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-[12px] font-semibold text-emerald-800">Accounts Approved</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">Sent for crew signature</p>
            </div>
          )}

        </div>
      </div>

      {/* ── Approve modal ── */}
      {showApprove && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-violet-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenLine className="h-5 w-5 text-white" />
                <h3 className="text-white font-semibold">Approve &amp; Send for Signatures?</h3>
              </div>
              <button onClick={() => setShowApprove(false)} className="text-violet-300 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[13px] text-neutral-600 mb-5">
                Financial checks complete for <strong>{contractData?.fullName}</strong>. Send for crew signature?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowApprove(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border text-[13px] text-neutral-600 hover:bg-neutral-50">
                  Cancel
                </button>
                <button
                  onClick={async () => { await onAction("pendingCrewSignature"); setApproved(true); setShowApprove(false); }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-[13px] font-semibold hover:bg-violet-700 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
                  Approve &amp; Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Return to Production dialog ── */}
      {showReturn && (
        <ReturnToProductionDialog
          offer={offer}
          onConfirm={handleReturnConfirm}
          onClose={() => setShowReturn(false)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}