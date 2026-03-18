import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ClipboardCheck, Send, Loader2, CheckCircle2, X,
  FileText, ShieldCheck, Building, Package, Monitor, Car,
  BadgeCheck, Shield, FileCheck,
} from "lucide-react";

import CrewIdentityHeader      from "../../../components/viewoffer/layouts/CrewIdentityHeader";
import ContractInstancesPanel  from "../../../pages/ContractInstancesPanel";
import SubmittedDocumentsPanel from "../../../components/viewoffer/layouts/SubmittedDocumentsPanel";

const PROD_CHECKLIST = [
  { key: "documentsUploaded",      label: "All required documents uploaded", Icon: FileCheck,   cat: "Identity",  always: true    },
  { key: "passportValid",          label: "Passport valid & not expired",    Icon: Shield,      cat: "Identity",  always: true    },
  { key: "drivingLicenceValid",    label: "Driving licence valid",           Icon: BadgeCheck,  cat: "Identity",  always: true    },
  { key: "rightToWorkVerified",    label: "Right to work verified",          Icon: ShieldCheck, cat: "Identity",  always: true    },
  { key: "companyDocsMatch",       label: "Company docs match contract",     Icon: Building,    cat: "Company",   loanOut: true   },
  { key: "vatCertValid",           label: "VAT certificate valid",           Icon: FileCheck,   cat: "Company",   loanOut: true   },
  { key: "boxInventoryComplete",   label: "Box inventory complete",          Icon: Package,     cat: "Equipment", boxRental: true },
  { key: "softwareDetailsOk",      label: "Software subscriptions provided", Icon: Monitor,     cat: "Equipment", software: true  },
  { key: "vehicleRequirementsMet", label: "Vehicle requirements met",        Icon: Car,         cat: "Equipment", vehicle: true   },
  { key: "noMissingExpiredDocs",   label: "No missing or expired documents", Icon: ShieldCheck, cat: "Final",     always: true    },
];

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
            Verification Checklist
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
                <span className="text-[9px] font-bold text-violet-500 uppercase tracking-widest">
                  {cat}
                </span>
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
                        ${on
                          ? "bg-emerald-50 border border-emerald-200"
                          : "bg-neutral-50 border border-neutral-100 hover:border-neutral-200 hover:bg-white"
                        }
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
                      {ItemIcon && (
                        <ItemIcon className={`h-3 w-3 shrink-0 ${on ? "text-emerald-400" : "text-neutral-300"}`} />
                      )}
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

export default function LayoutProductionReview({
  offer, contractData, allowances, calculatedRates,
  isSubmitting, onAction, dispatch,
}) {
  const navigate            = useNavigate();
  const { id, projectName } = useParams();
  const proj                = projectName || "demo-project";
  const offerId             = id || offer?._id;

  const [checklist,   setChecklist  ] = useState({});
  const [showApprove, setShowApprove] = useState(false);
  const [approved,    setApproved   ] = useState(false);

  const visibleItems = PROD_CHECKLIST.filter((item) => {
    if (item.always)    return true;
    if (item.loanOut)   return offer?.engagementType === "loan_out";
    if (item.boxRental) return offer?.allowances?.some((a) => a.key === "boxRental" && a.enabled);
    if (item.software)  return offer?.allowances?.some((a) => a.key === "computer"  && a.enabled);
    if (item.vehicle)   return offer?.allowances?.some((a) => a.key === "vehicle"   && a.enabled);
    return false;
  });

  const allDone = visibleItems.every((c) => checklist[c.key]);

  return (
    <div className="space-y-4">

      <CrewIdentityHeader
        contractData={contractData}
        offer={offer}
        showEdit={false}
        onToggleEdit={() => navigate(`/projects/${proj}/offers/${offerId}/edit`)}
      />

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
              {offer?._id && (
                <ContractInstancesPanel offerId={offer._id} />
              )}
            </div>
          </div>

        </div>

        {/* Right sidebar */}
        <div className="w-[260px] shrink-0 space-y-3">

          <ChecklistWidget
            items={visibleItems}
            checked={checklist}
            onChange={(key, val) => setChecklist((p) => ({ ...p, [key]: val }))}
            disabled={approved}
          />

          {!approved ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-3 space-y-2">
              <button
                onClick={() => allDone && setShowApprove(true)}
                disabled={!allDone || isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold transition-all ${
                  allDone && !isSubmitting
                    ? "bg-violet-600 text-white hover:bg-violet-700"
                    : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <ClipboardCheck className="h-3.5 w-3.5" />
                }
                Approve &amp; Send to Accounts
              </button>

              <button
                onClick={() => onAction("sendToCrew")}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 text-[11px] font-medium hover:bg-neutral-50 transition-colors"
              >
                <Send className="h-3 w-3" /> Return to Crew
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
              <p className="text-[12px] font-semibold text-emerald-800">Production Approved</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">Sent to Accounts for review</p>
            </div>
          )}

        </div>
      </div>

      {/* Approve modal */}
      {showApprove && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-violet-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-white" />
                <h3 className="text-white font-semibold">Approve &amp; Send to Accounts?</h3>
              </div>
              <button
                onClick={() => setShowApprove(false)}
                className="text-violet-300 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[13px] text-neutral-600 mb-5">
                Production checks complete for{" "}
                <strong>{contractData?.fullName}</strong>.
                Send to Accounts for financial review?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowApprove(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border text-[13px] text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await onAction("accountsCheck");
                    setApproved(true);
                    setShowApprove(false);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-violet-600 text-white text-[13px] font-semibold hover:bg-violet-700 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <ClipboardCheck className="h-4 w-4" />
                  }
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