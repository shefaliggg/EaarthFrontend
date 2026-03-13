/**
 * layouts/LayoutAccountsReview.jsx
 *
 * Layout 3 — Accounts Admin + ACCOUNTS_CHECK status.
 *
 * [InlineEditPanel?] | [crew identity + financial summary + contract docs + rates tables + offer doc] | [288px checklist + actions sidebar]
 *
 * FIX: Added ContractInstancesPanel (same as LayoutProductionReview) so accounts
 *      can see contract documents during their review. Guarded with offer?._id
 *      to prevent mounting before offer is loaded.
 */

import { useState } from "react";
import {
  Edit2, TrendingUp, PenLine, Loader2, CheckCircle2, X,
  ClipboardCheck, ShieldCheck, CheckSquare, Square, FileText,
} from "lucide-react";

import { Button }             from "../../../../../shared/components/ui/button";
import ContractInstancesPanel from "../../../pages/ContractInstancesPanel";
import {
  InlineEditPanel, CollapsibleOfferDoc,
  SidebarSummaryCard, SidebarTimelineCard,
  getDeptLabel, getInitials, getEngLabel, fmtMoney,
} from "./layoutHelpers";

import { formatCurrency, defaultEngineSettings } from "../../../utils/rateCalculations";

const ACCT_CHECKLIST = [
  { key:"budgetCodesVerified",   label:"All budget codes verified",           cat:"Budget"  },
  { key:"rateCalcsReviewed",     label:"Rate calculations reviewed",          cat:"Budget"  },
  { key:"allowancesConfirmed",   label:"Allowances confirmed against budget", cat:"Budget"  },
  { key:"overtimeRatesOk",       label:"Overtime rates confirmed",            cat:"Budget"  },
  { key:"payrollSetupOk",        label:"Payroll setup confirmed",             cat:"Payroll" },
  { key:"taxStatusConfirmed",    label:"Tax status confirmed",                cat:"Payroll" },
  { key:"contractTermsApproved", label:"Contract terms approved",             cat:"Final"   },
  { key:"readyForSignature",     label:"Ready for crew signature",            cat:"Final"   },
];

function ChecklistWidget({ items, checked, onChange, disabled }) {
  const cats    = [...new Set(items.map((c) => c.cat))];
  const total   = items.length;
  const done    = items.filter((c) => checked[c.key]).length;
  const allDone = done === total;
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="bg-indigo-700 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-3.5 w-3.5 text-white" />
          <span className="text-white text-[11px] font-semibold uppercase tracking-wide">Accounts Checklist</span>
        </div>
        <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${allDone?"bg-emerald-400 text-emerald-900":"bg-white/20 text-white"}`}>
          {done}/{total}
        </span>
      </div>
      <div className="p-4">
        <div className="h-1.5 bg-neutral-100 rounded-full mb-4 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${allDone?"bg-emerald-500":"bg-indigo-500"}`}
            style={{ width:`${total?(done/total)*100:0}%` }} />
        </div>
        {cats.map((cat) => {
          const catItems = items.filter((c) => c.cat === cat);
          const catDone  = catItems.filter((c) => checked[c.key]).length;
          return (
            <div key={cat} className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{cat}</p>
                <span className="text-[8px] text-neutral-400">{catDone}/{catItems.length}</span>
              </div>
              <div className="space-y-1">
                {catItems.map((item) => {
                  const on = !!checked[item.key];
                  return (
                    <button key={item.key} disabled={disabled}
                      onClick={() => onChange(item.key, !on)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition-all ${
                        on?"border-emerald-200 bg-emerald-50/60":"border-neutral-100 bg-neutral-50/50 hover:border-neutral-200 hover:bg-white"
                      } ${disabled?"opacity-60 cursor-not-allowed":"cursor-pointer"}`}>
                      {on ? <CheckSquare className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          : <Square     className="h-3.5 w-3.5 text-neutral-300 shrink-0" />}
                      <span className={`text-[10px] leading-tight ${on?"text-emerald-700":"text-neutral-600"}`}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {allDone && (
          <div className="mt-1 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="text-[10px] font-semibold text-emerald-700">All checks complete</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function LayoutAccountsReview({
  offer, contractData, allowances, calculatedRates,
  isSubmitting, onAction, dispatch,
}) {
  const [showEdit,    setShowEdit   ] = useState(false);
  const [checklist,   setChecklist  ] = useState({});
  const [showApprove, setShowApprove] = useState(false);
  const [approved,    setApproved   ] = useState(false);

  const allDone    = ACCT_CHECKLIST.every((c) => checklist[c.key]);
  const feePerDay  = parseFloat(contractData.feePerDay) || 0;
  const cur        = contractData.currency || "GBP";
  const cs         = { GBP:"£", USD:"$", EUR:"€", AUD:"A$", CAD:"C$" }[cur] || "£";
  const enabledAll = Object.entries(allowances).filter(([, a]) => a.enabled);
  const totalAll   = enabledAll.reduce((acc, [, a]) => acc + (parseFloat(a.feePerWeek) || 0), 0);
  const jobTitle   = offer?.createOwnJobTitle && offer?.newJobTitle ? offer.newJobTitle : offer?.jobTitle || "—";

  return (
    <div className="flex gap-4 items-start">
      <InlineEditPanel
        show={showEdit} onClose={() => setShowEdit(false)}
        offer={offer} contractData={contractData}
        calculatedRates={calculatedRates} allowances={allowances} dispatch={dispatch}
        accentBg="bg-indigo-700" accentText="text-indigo-300"
      />

      <div className="flex-1 min-w-0 space-y-4">

        {/* Crew identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[12px] font-bold shrink-0">
              {getInitials(contractData.fullName)}
            </div>
            <div>
              <p className="text-[13px] font-bold text-neutral-800">{contractData.fullName || "—"}</p>
              <p className="text-[10px] text-neutral-500">{jobTitle} · {getDeptLabel(contractData.department)}</p>
            </div>
          </div>
          <Button size="sm" variant={showEdit ? "default" : "outline"}
            onClick={() => setShowEdit((p) => !p)}
            className={`gap-1.5 h-8 text-xs shrink-0 ${showEdit?"bg-indigo-600 hover:bg-indigo-700 text-white border-0":"border-indigo-200 text-indigo-700 hover:bg-indigo-50"}`}>
            <Edit2 className="h-3.5 w-3.5" />
            {showEdit ? "Close Editor" : "Edit Offer"}
          </Button>
        </div>

        {/* Contract documents */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-neutral-100">
            <FileText className="w-4 h-4 text-indigo-500" />
            <h3 className="text-[13px] font-semibold text-neutral-800">Contract Documents</h3>
            <span className="ml-auto text-[9px] text-neutral-400 uppercase tracking-wider">{offer?.status}</span>
          </div>
          <div className="p-4">
            {/* FIX: only mount once offer._id is available */}
            {offer?._id && (
              <ContractInstancesPanel offerId={offer._id} />
            )}
          </div>
        </div>

        {/* Financial summary */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-100 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <h3 className="text-[13px] font-semibold text-neutral-800">Financial Summary</h3>
          </div>
          <div className="p-5">
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Rate Breakdown</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label:"Fee / Day",       value:fmtMoney(feePerDay, cur),     sub:"Incl. holiday uplift"       },
                { label:"Weekly (5 day)",  value:fmtMoney(feePerDay*5, cur),   sub:"Fee × 5 days", hi:true      },
                { label:"Total Allowances",value:fmtMoney(totalAll),           sub:`${enabledAll.length} active`},
              ].map(({ label, value, sub, hi }) => (
                <div key={label} className={`rounded-xl border px-4 py-3 ${hi?"bg-indigo-50 border-indigo-200":"bg-white border-neutral-200"}`}>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">{label}</p>
                  <p className={`text-[17px] font-bold tabular-nums ${hi?"text-indigo-700":"text-neutral-800"}`}>{value}</p>
                  <p className="text-[9px] text-neutral-400 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-3 text-[11px] border-t border-neutral-100 pt-3 mb-5">
              {[
                ["Engagement",   getEngLabel(contractData.engagementType)],
                ["Frequency",    contractData.dailyOrWeekly==="weekly"?"Weekly":"Daily"],
                ["Working Week", contractData.workingWeek?`${contractData.workingWeek} days`:"—"],
                ["Overtime",     contractData.overtime==="custom"?"Custom":"Calculated"],
                ["Currency",     cur],
              ].map(([lbl, val]) => (
                <div key={lbl}>
                  <p className="text-[9px] text-neutral-400 uppercase tracking-wider">{lbl}</p>
                  <p className="font-semibold text-neutral-700 mt-0.5">{val}</p>
                </div>
              ))}
            </div>

            {/* Salary rates table */}
            {[
              { title:"Salary Rates",   rows:calculatedRates.salary,   badge:null },
              { title:"Overtime Rates", rows:calculatedRates.overtime,
                badge: contractData.overtime==="custom"
                  ? { label:"CUSTOM",     cls:"bg-amber-400 text-amber-900" }
                  : { label:"CALCULATED", cls:"bg-indigo-500 text-white"    } },
            ].map(({ title, rows, badge }) => (
              <div key={title} className="border border-neutral-100 rounded-xl overflow-hidden mb-3">
                <div className="bg-indigo-700 px-3 py-1.5 flex items-center justify-between">
                  <span className="text-white text-[10px] font-semibold">{title}</span>
                  {badge  && <span className={`text-[7px] px-1.5 py-0.5 rounded font-bold ${badge.cls}`}>{badge.label}</span>}
                  {!badge && <span className="text-indigo-200 text-[8px]">{rows.length} items</span>}
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-indigo-50/60 border-b border-indigo-100">
                      {["Item","Rate","Hol","Gross"].map((h) => (
                        <th key={h} className={`px-2 py-1.5 text-[8px] font-semibold text-indigo-600 uppercase tracking-wider ${h==="Item"?"text-left":"text-right"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className={`border-b border-neutral-50 text-[10px] ${i%2?"bg-indigo-50/20":""}`}>
                        <td className="py-1.5 px-2 text-neutral-700">{row.item}</td>
                        <td className="py-1.5 px-2 text-right tabular-nums text-neutral-500">{formatCurrency(row.rate, cs)}</td>
                        <td className="py-1.5 px-2 text-right tabular-nums text-neutral-400">{formatCurrency(row.hol, cs)}</td>
                        <td className="py-1.5 px-2 text-right tabular-nums font-semibold text-indigo-600">{formatCurrency(row.gross, cs)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {enabledAll.length > 0 && (
              <div className="border border-neutral-100 rounded-xl overflow-hidden">
                <div className="bg-indigo-700 px-3 py-1.5">
                  <span className="text-white text-[10px] font-semibold">Allowances</span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-indigo-50/60 border-b border-indigo-100">
                      {["Allowance","Fee / Week","Budget Code","Tag","Payable In"].map((h) => (
                        <th key={h} className={`px-2 py-1.5 text-[8px] font-semibold text-indigo-600 uppercase tracking-wider ${h==="Fee / Week"?"text-right":"text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {enabledAll.map(([key, a], i) => {
                      const payable = [a.payablePrep&&"Prep",a.payableShoot&&"Shoot",a.payableWrap&&"Wrap"].filter(Boolean).join(", ");
                      return (
                        <tr key={key} className={`border-b border-neutral-50 text-[10px] ${i%2?"bg-indigo-50/20":""}`}>
                          <td className="py-1.5 px-2 text-neutral-700 font-medium capitalize">{key.replace(/([A-Z])/g," $1").trim()}</td>
                          <td className="py-1.5 px-2 text-right tabular-nums font-semibold text-indigo-600">{cs}{parseFloat(a.feePerWeek||0).toFixed(2)}</td>
                          <td className="py-1.5 px-2 text-neutral-400 font-mono text-[9px]">{a.budgetCode||"—"}</td>
                          <td className="py-1.5 px-2 text-neutral-400 text-[9px]">{a.tag||"—"}</td>
                          <td className="py-1.5 px-2 text-neutral-500 text-[9px]">{payable||"—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <CollapsibleOfferDoc offer={offer} contractData={contractData} allowances={allowances} calculatedRates={calculatedRates} />
      </div>

      {/* Right sidebar */}
      <div className="w-[288px] shrink-0 space-y-3">
        <ChecklistWidget
          items={ACCT_CHECKLIST} checked={checklist}
          onChange={(key, val) => setChecklist((p) => ({ ...p, [key]: val }))}
          disabled={approved}
        />

        {!approved ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-2">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Actions</p>
            <button onClick={() => allDone && setShowApprove(true)} disabled={!allDone||isSubmitting}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold transition-all ${allDone&&!isSubmitting?"bg-indigo-600 text-white hover:bg-indigo-700":"bg-neutral-100 text-neutral-400 cursor-not-allowed"}`}>
              {isSubmitting?<Loader2 className="h-3.5 w-3.5 animate-spin"/>:<PenLine className="h-3.5 w-3.5"/>}
              Approve &amp; Send for Signatures
            </button>
            <button onClick={() => onAction("productionCheck")} disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 text-neutral-600 text-[12px] font-medium hover:bg-neutral-50 transition-colors">
              <TrendingUp className="h-3.5 w-3.5" /> Return to Production
            </button>
            {!allDone && <p className="text-[9px] text-neutral-400 text-center">Complete all checklist items to approve</p>}
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <CheckCircle2 className="h-7 w-7 text-emerald-500 mx-auto mb-1.5" />
            <p className="text-[12px] font-semibold text-emerald-800">Accounts Approved</p>
            <p className="text-[10px] text-emerald-600 mt-1">Sent for crew signature</p>
          </div>
        )}

        <SidebarSummaryCard offer={offer} />
        <SidebarTimelineCard offer={offer} />
      </div>

      {/* Approve modal */}
      {showApprove && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-indigo-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenLine className="h-5 w-5 text-white" />
                <h3 className="text-white font-semibold">Approve &amp; Send for Signatures?</h3>
              </div>
              <button onClick={() => setShowApprove(false)} className="text-indigo-300 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <p className="text-[13px] text-neutral-600 mb-5">
                Financial checks complete for <strong>{contractData.fullName}</strong>. Send for crew signature?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowApprove(false)} className="flex-1 px-4 py-2.5 rounded-lg border text-[13px] text-neutral-600 hover:bg-neutral-50">Cancel</button>
                <button onClick={async () => { await onAction("pendingCrewSignature"); setApproved(true); setShowApprove(false); }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-[13px] font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-60">
                  {isSubmitting?<Loader2 className="h-4 w-4 animate-spin"/>:<PenLine className="h-4 w-4"/>}
                  Approve &amp; Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}