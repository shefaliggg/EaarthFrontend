/**
 * layouts/layoutHelpers.jsx
 *
 * Shared micro-components and pure helpers used by all layout files.
 * InlineEditPanel uses direct imports (no require) — all ESM-compatible.
 */

import { useState }           from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Users, ChevronDown, Edit2, X } from "lucide-react";
import { ContractForm }        from "../../roleActions/ProductionAdminActions/createoffer/Contractform";
import { CreateOfferLayout }   from "../../roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import { defaultEngineSettings } from "../../../utils/rateCalculations";
import { updateOfferThunk }    from "../../../store/offer.slice";

// ─── Pure helpers ─────────────────────────────────────────────────────────────

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) : "—";

export const fmtMoney = (n, cur = "GBP") => {
  const v = parseFloat(n);
  if (!v) return "—";
  return new Intl.NumberFormat("en-GB", { style:"currency", currency:cur, minimumFractionDigits:0 }).format(v);
};

export function getInitials(name = "") {
  return name.trim().split(/\s+/).map((p) => p[0]).join("").slice(0,2).toUpperCase() || "??";
}
export function getEngLabel(v) {
  return { loan_out:"Loan Out", paye:"PAYE", schd:"SCHD", long_form:"Long Form" }[v] || v || "—";
}
export function getDeptLabel(v) {
  return v ? v.replace(/_/g," ").replace(/\b\w/g,(c)=>c.toUpperCase()) : "—";
}

// ─── Shared config ────────────────────────────────────────────────────────────

export const STATUS_CONFIG = {
  DRAFT:                    { label:"Draft",            color:"bg-gray-100 text-gray-600",       dot:"bg-gray-400"    },
  SENT_TO_CREW:             { label:"Sent to Crew",     color:"bg-amber-100 text-amber-700",     dot:"bg-amber-500"   },
  NEEDS_REVISION:           { label:"Needs Revision",   color:"bg-orange-100 text-orange-700",   dot:"bg-orange-500"  },
  CREW_ACCEPTED:            { label:"Crew Accepted",    color:"bg-blue-100 text-blue-700",       dot:"bg-blue-500"    },
  PRODUCTION_CHECK:         { label:"Production Check", color:"bg-violet-100 text-violet-700",   dot:"bg-violet-500"  },
  ACCOUNTS_CHECK:           { label:"Accounts Check",   color:"bg-indigo-100 text-indigo-700",   dot:"bg-indigo-500"  },
  PENDING_CREW_SIGNATURE:   { label:"Crew Signature",   color:"bg-purple-100 text-purple-700",   dot:"bg-purple-500"  },
  PENDING_UPM_SIGNATURE:    { label:"UPM Signing",      color:"bg-purple-100 text-purple-700",   dot:"bg-purple-500"  },
  PENDING_FC_SIGNATURE:     { label:"FC Signing",       color:"bg-purple-100 text-purple-700",   dot:"bg-purple-500"  },
  PENDING_STUDIO_SIGNATURE: { label:"Studio Signing",   color:"bg-purple-100 text-purple-700",   dot:"bg-purple-500"  },
  COMPLETED:                { label:"Completed",        color:"bg-emerald-100 text-emerald-700", dot:"bg-emerald-500" },
  CANCELLED:                { label:"Cancelled",        color:"bg-red-100 text-red-700",         dot:"bg-red-500"     },
};

export const SIGN_ROLE_MAP = {
  CREW:   { requiredStatus:"PENDING_CREW_SIGNATURE",   label:"Crew Member",          btnColor:"bg-teal-600 hover:bg-teal-700"     },
  UPM:    { requiredStatus:"PENDING_UPM_SIGNATURE",    label:"Unit Production Mgr",  btnColor:"bg-indigo-600 hover:bg-indigo-700" },
  FC:     { requiredStatus:"PENDING_FC_SIGNATURE",     label:"Financial Controller", btnColor:"bg-pink-600 hover:bg-pink-700"     },
  STUDIO: { requiredStatus:"PENDING_STUDIO_SIGNATURE", label:"Production Executive", btnColor:"bg-violet-600 hover:bg-violet-700" },
};

// ─── Micro components ─────────────────────────────────────────────────────────

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label:status, color:"bg-gray-100 text-gray-600", dot:"bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function InfoBox({ icon: Icon, children, color = "blue" }) {
  const MAP = {
    blue:   "bg-blue-50   border-blue-200   text-blue-800",
    amber:  "bg-amber-50  border-amber-200  text-amber-800",
    green:  "bg-emerald-50 border-emerald-200 text-emerald-800",
    red:    "bg-red-50    border-red-200    text-red-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
    violet: "bg-violet-50 border-violet-200 text-violet-800",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-800",
    gray:   "bg-gray-50   border-gray-200   text-gray-600",
  };
  return (
    <div className={`rounded-lg border p-3 text-xs flex items-start gap-2 ${MAP[color] || MAP.blue}`}>
      {Icon && <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}

export function TabBar({ active, onChange, accentBg = "bg-purple-600" }) {
  const tabs = [
    { key:"preview", label:"Contract Preview", Icon:FileText },
    { key:"offer",   label:"Offer Details",    Icon:Users    },
  ];
  return (
    <div className="flex gap-1">
      {tabs.map(({ key, label, Icon }) => (
        <button key={key} onClick={() => onChange(key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            active === key ? `${accentBg} text-white` : "bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-800"
          }`}>
          <Icon className="w-3.5 h-3.5" />{label}
        </button>
      ))}
    </div>
  );
}

// ─── Sidebar cards ────────────────────────────────────────────────────────────

export function SidebarSummaryCard({ offer }) {
  const jobTitle = offer?.createOwnJobTitle && offer?.newJobTitle ? offer.newJobTitle : offer?.jobTitle || "—";
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Offer Summary</p>
        <StatusBadge status={offer?.status} />
      </div>
      {offer?.offerCode && <p className="text-[10px] font-mono text-neutral-400 mb-3">{offer.offerCode}</p>}
      <div className="space-y-1.5 text-[11px]">
        {[
          ["Recipient",  offer?.recipient?.fullName],
          ["Role",       jobTitle],
          ["Department", getDeptLabel(offer?.department)],
          offer?.feePerDay && ["Rate", `${fmtMoney(offer.feePerDay, offer.currency||"GBP")} / ${offer.dailyOrWeekly||"day"}`],
          ["Engagement", getEngLabel(offer?.engagementType)],
          offer?.category  && ["Category", offer.category],
          offer?.startDate && ["Start",    fmtDate(offer.startDate)],
          offer?.endDate   && ["End",      fmtDate(offer.endDate)],
        ].filter(Boolean).map(([lbl,val]) => (
          <div key={lbl} className="flex justify-between gap-2">
            <span className="text-neutral-400">{lbl}</span>
            <span className="font-medium text-neutral-700 truncate max-w-[160px] text-right">{val||"—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SidebarSigningCard({ signingStatus }) {
  if (!signingStatus) return null;
  const ORDER  = ["CREW","UPM","FC","STUDIO"];
  const LABELS = { CREW:"Crew", UPM:"UPM", FC:"Finance", STUDIO:"Studio" };
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Signatures</p>
        {signingStatus.isLocked && (
          <span className="text-[9px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Locked</span>
        )}
      </div>
      <div className="space-y-1.5">
        {ORDER.map((role) => {
          const sig    = signingStatus.signatories?.find((s) => s.role === role);
          const signed = sig?.signed ?? false;
          return (
            <div key={role} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${signed?"bg-emerald-500":"bg-neutral-300"}`} />
                <span className={signed?"font-medium text-neutral-800":"text-neutral-400"}>{LABELS[role]}</span>
              </div>
              <span className="text-[10px] text-neutral-400">
                {signed && sig.signedAt ? fmtDate(sig.signedAt) : "Pending"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SidebarTimelineCard({ offer }) {
  const tl = offer?.timeline || {};
  const events = [
    { label:"Created",            date:offer?.createdAt              },
    { label:"Sent to Crew",       date:tl.sentToCrewAt               },
    { label:"Crew Viewed",        date:tl.crewViewedAt               },
    { label:"Crew Accepted",      date:tl.crewAcceptedAt             },
    { label:"Production Check",   date:tl.productionCheckCompletedAt },
    { label:"Accounts Check",     date:tl.accountsCheckCompletedAt   },
    { label:"Sent for Signature", date:tl.pendingCrewSignatureAt     },
    { label:"Crew Signed",        date:tl.crewSignedAt               },
    { label:"UPM Signed",         date:tl.upmSignedAt                },
    { label:"FC Signed",          date:tl.fcSignedAt                 },
    { label:"Studio Signed",      date:tl.studioSignedAt             },
    { label:"Completed",          date:tl.completedAt                },
    { label:"Cancelled",          date:tl.cancelledAt                },
  ].filter((e) => e.date);
  if (!events.length) return null;
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Offer Timeline</p>
      <div className="space-y-2.5">
        {events.map((e,i) => (
          <div key={i} className="flex gap-2.5">
            <div className="flex flex-col items-center">
              <div className="h-2 w-2 rounded-full mt-0.5 bg-violet-400 ring-2 ring-violet-100 shrink-0" />
              {i < events.length-1 && <div className="w-px flex-1 bg-neutral-100 mt-0.5" />}
            </div>
            <div className="pb-2">
              <p className="text-[10px] font-medium text-neutral-700">{e.label}</p>
              <p className="text-[9px] text-neutral-400 mt-0.5">{fmtDate(e.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CollapsibleOfferDoc ──────────────────────────────────────────────────────

export function CollapsibleOfferDoc({ offer, contractData, allowances, calculatedRates }) {
  const [open, setOpen] = useState(false);
  const [af,   setAf  ] = useState(null);
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <button onClick={() => setOpen((p) => !p)}
        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-violet-500" />
          <span className="text-[13px] font-semibold text-neutral-800">Offer Document</span>
          <span className="text-[10px] text-neutral-400 ml-1">Reference</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${open?"rotate-180":""}`} />
      </button>
      {open && (
        <div className="border-t border-neutral-100">
          <CreateOfferLayout
            data={contractData} offer={offer}
            activeField={af} onFieldFocus={setAf} onFieldBlur={() => setAf(null)}
            calculatedRates={calculatedRates} engineSettings={defaultEngineSettings}
            salaryBudgetCodes={offer?.salaryBudgetCodes||[]}     setSalaryBudgetCodes={() => {}}
            salaryTags={offer?.salaryTags||[]}                   setSalaryTags={() => {}}
            overtimeBudgetCodes={offer?.overtimeBudgetCodes||[]} setOvertimeBudgetCodes={() => {}}
            overtimeTags={offer?.overtimeTags||[]}               setOvertimeTags={() => {}}
            allowances={allowances} initialOfferCollapsed={false} hideContractDocument={false}
          />
        </div>
      )}
    </div>
  );
}

// ─── InlineEditPanel ─────────────────────────────────────────────────────────

export function InlineEditPanel({ show, onClose, offer, contractData, calculatedRates, allowances, dispatch, accentBg="bg-violet-700", accentText="text-violet-300" }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div key="edit-inline"
          initial={{ width:0, opacity:0 }}
          animate={{ width:380, opacity:1 }}
          exit={{ width:0, opacity:0 }}
          transition={{ type:"spring", stiffness:280, damping:28 }}
          className="shrink-0 overflow-hidden">
          <div className="w-[380px] bg-white rounded-xl border border-violet-100 shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-180px)]">
            <div className={`${accentBg} px-4 py-2.5 flex items-center justify-between shrink-0`}>
              <div className="flex items-center gap-2">
                <Edit2 className="h-3.5 w-3.5 text-white" />
                <span className="text-white text-[12px] font-semibold">Edit Offer</span>
              </div>
              <button onClick={onClose} className={`${accentText} hover:text-white transition-colors`}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ContractForm
                data={contractData}
                onChange={(val) => {
                  if (offer?._id) dispatch(updateOfferThunk({
                    id:offer._id, data:{ ...val, studioId:offer.studioId, projectId:offer.projectId },
                  }));
                }}
                onPrint={() => {}} onFieldFocus={() => {}} onFieldBlur={() => {}}
                calculatedRates={calculatedRates} engineSettings={defaultEngineSettings}
                salaryBudgetCodes={offer?.salaryBudgetCodes||[]}     setSalaryBudgetCodes={() => {}}
                salaryTags={offer?.salaryTags||[]}                   setSalaryTags={() => {}}
                overtimeBudgetCodes={offer?.overtimeBudgetCodes||[]} setOvertimeBudgetCodes={() => {}}
                overtimeTags={offer?.overtimeTags||[]}               setOvertimeTags={() => {}}
                allowances={allowances} setAllowances={() => {}}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}