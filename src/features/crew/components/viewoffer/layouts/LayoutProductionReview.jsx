
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ClipboardCheck, Loader2, CheckCircle2,
  FileText, ShieldCheck, Building, Package, Monitor, Car,
  BadgeCheck, Shield, FileCheck, Edit2,
} from "lucide-react";

import CrewIdentityHeader      from "../../../components/viewoffer/layouts/CrewIdentityHeader";
import ContractInstancesPanel  from "../../../pages/ContractInstancesPanel";
import SubmittedDocumentsPanel from "../../../components/viewoffer/layouts/SubmittedDocumentsPanel";
import OfferActionDialog       from "../../../components/onboarding/OfferActionDialog";

// ── Checklist config ──────────────────────────────────────────────────────────

const PROD_CHECKLIST = [
  { key: "documentsUploaded",      label: "All required documents uploaded",  Icon: FileCheck,   cat: "Identity",  always: true    },
  { key: "passportValid",          label: "Passport valid & not expired",     Icon: Shield,      cat: "Identity",  always: true    },
  { key: "drivingLicenceValid",    label: "Driving licence valid",            Icon: BadgeCheck,  cat: "Identity",  always: true    },
  { key: "rightToWorkVerified",    label: "Right to work verified",           Icon: ShieldCheck, cat: "Identity",  always: true    },
  { key: "companyDocsMatch",       label: "Company docs match contract",      Icon: Building,    cat: "Company",   loanOut: true   },
  { key: "vatCertValid",           label: "VAT certificate valid",            Icon: FileCheck,   cat: "Company",   loanOut: true   },
  { key: "boxInventoryComplete",   label: "Box inventory complete",           Icon: Package,     cat: "Equipment", boxRental: true },
  { key: "softwareDetailsOk",      label: "Software subscriptions provided",  Icon: Monitor,     cat: "Equipment", software: true  },
  { key: "vehicleRequirementsMet", label: "Vehicle requirements met",         Icon: Car,         cat: "Equipment", vehicle: true   },
  { key: "noMissingExpiredDocs",   label: "No missing or expired documents",  Icon: ShieldCheck, cat: "Final",     always: true    },
];

// ── ChecklistWidget ───────────────────────────────────────────────────────────

function ChecklistWidget({ items, checked, onChange, disabled }) {
  const cats    = [...new Set(items.map((c) => c.cat))];
  const total   = items.length;
  const done    = items.filter((c) => checked[c.key]).length;
  const allDone = done === total;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {/* Header — single row */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ background: "var(--primary)" }}
      >
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-3.5 w-3.5" style={{ color: "var(--primary-foreground)" }} />
          <span
            className="text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap"
            style={{ color: "var(--primary-foreground)" }}
          >
            Verification Checklist
          </span>
        </div>
        <span
          className="text-[9px] px-2 py-0.5 rounded-full font-bold"
          style={
            allDone
              ? { background: "var(--mint-400)", color: "var(--mint-900)" }
              : { background: "rgba(255,255,255,0.2)", color: "var(--primary-foreground)" }
          }
        >
          {done}/{total} verified
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1" style={{ background: "var(--muted)" }}>
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${total ? (done / total) * 100 : 0}%`,
            background: allDone ? "var(--mint-500)" : "var(--primary)",
          }}
        />
      </div>

      {/* Category groups */}
      <div className="px-3 py-3 space-y-3">
        {cats.map((cat) => {
          const catItems = items.filter((c) => c.cat === cat);
          const catDone  = catItems.filter((c) => checked[c.key]).length;
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--lavender-500)" }}
                >
                  {cat}
                </span>
                <span className="text-[8px]" style={{ color: "var(--muted-foreground)" }}>
                  {catDone}/{catItems.length}
                </span>
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
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all"
                      style={
                        on
                          ? {
                              background: "var(--mint-50)",
                              border: "1px solid var(--mint-200)",
                              opacity: disabled ? 0.6 : 1,
                              cursor: disabled ? "not-allowed" : "pointer",
                            }
                          : {
                              background: "var(--muted)",
                              border: "1px solid var(--border)",
                              opacity: disabled ? 0.6 : 1,
                              cursor: disabled ? "not-allowed" : "pointer",
                            }
                      }
                    >
                      {/* Checkbox */}
                      <div
                        className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 transition-colors"
                        style={
                          on
                            ? { background: "var(--mint-500)", border: "1px solid var(--mint-500)" }
                            : { background: "var(--card)", border: "1.5px dashed var(--primary)", opacity: 0.5 }
                        }
                      >
                        {on && (
                          <svg className="w-2 h-2" viewBox="0 0 8 8" fill="none">
                            <path
                              d="M1.5 4l2 2 3-3"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Icon — primary when unchecked, mint when checked */}
                      {ItemIcon && (
                        <ItemIcon
                          className="h-3 w-3 shrink-0"
                          style={{ color: on ? "var(--mint-400)" : "var(--primary)" }}
                        />
                      )}

                      <span
                        className="text-[10px] leading-tight flex-1"
                        style={{ color: on ? "var(--mint-700)" : "var(--foreground)" }}
                      >
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
          <div
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 mt-1"
            style={{ background: "var(--mint-50)", border: "1px solid var(--mint-200)" }}
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--mint-500)" }} />
            <span className="text-[10px] font-semibold" style={{ color: "var(--mint-700)" }}>
              All checks complete
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

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

  const handleEdit = () => {
    if (offerId) navigate(`/projects/${proj}/offers/${offerId}/edit?redirectTo=onboarding`);
  };

  const visibleItems = PROD_CHECKLIST.filter((item) => {
    if (item.always)    return true;
    if (item.loanOut)   return offer?.engagementType === "loan_out";
    if (item.boxRental) return offer?.allowances?.some((a) => a.key === "boxRental" && a.enabled);
    if (item.software)  return offer?.allowances?.some((a) => a.key === "computer"  && a.enabled);
    if (item.vehicle)   return offer?.allowances?.some((a) => a.key === "vehicle"   && a.enabled);
    return false;
  });

  const allDone       = visibleItems.every((c) => checklist[c.key]);
  const verifiedItems = visibleItems.filter((c) => checklist[c.key]);

  return (
    <div className="space-y-4">

      {/* Reuses CrewIdentityHeader — avatar, name, title, rate, dates, status badge */}
      <CrewIdentityHeader contractData={contractData} offer={offer} />

      <div className="flex gap-4 items-start">

        {/* ── Left: submitted docs + contract documents */}
        <div className="flex-1 min-w-0 space-y-4">
          <SubmittedDocumentsPanel offerId={offer?._id} offer={offer} />

          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <FileText className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
              <h3 className="text-[12px] font-semibold" style={{ color: "var(--foreground)" }}>
                Contract Documents
              </h3>
              <span
                className="ml-auto text-[9px] font-mono"
                style={{ color: "var(--primary)" }}
              >
                PRODUCTION REVIEW
              </span>
            </div>
            <div className="p-4">
              {offer?._id && (
                <ContractInstancesPanel
                  offerId={offer._id}
                  offerStatus={offer?.status}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Right: checklist + action buttons */}
        <div className="w-[320px] shrink-0 space-y-3">
          <ChecklistWidget
            items={visibleItems}
            checked={checklist}
            onChange={(key, val) => setChecklist((p) => ({ ...p, [key]: val }))}
            disabled={approved}
          />

          {!approved ? (
            <div
              className="rounded-xl p-3 space-y-2"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <button
                onClick={() => allDone && setShowApprove(true)}
                disabled={!allDone || isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold transition-all"
                style={
                  allDone && !isSubmitting
                    ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                    : {
                        background: "var(--muted)",
                        color: "var(--muted-foreground)",
                        cursor: "not-allowed",
                      }
                }
              >
                {isSubmitting
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <ClipboardCheck className="h-3.5 w-3.5" />
                }
                Approve &amp; Send to Accounts
              </button>

              <button
                onClick={handleEdit}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[11px] font-medium transition-colors"
                style={{
                  background: "var(--peach-50)",
                  border: "1px solid var(--peach-200)",
                  color: "var(--peach-600)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--peach-100)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--peach-50)")}
              >
                <Edit2 className="h-3 w-3" /> Edit &amp; Resend to Crew
              </button>

              {!allDone && (
                <p
                  className="text-[9px] text-center"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Complete all checklist items to approve
                </p>
              )}
            </div>
          ) : (
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: "var(--mint-50)", border: "1px solid var(--mint-200)" }}
            >
              <CheckCircle2
                className="h-6 w-6 mx-auto mb-1.5"
                style={{ color: "var(--mint-500)" }}
              />
              <p className="text-[12px] font-semibold" style={{ color: "var(--mint-800)" }}>
                Production Approved
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--mint-600)" }}>
                Sent to Accounts for review
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Approve dialog */}
      <OfferActionDialog
        type="approveOffer"
        open={showApprove}
        offer={offer}
        verifiedItems={verifiedItems}
        isLoading={isSubmitting}
        onClose={() => setShowApprove(false)}
        onConfirm={async () => {
          await onAction("accountsCheck");
          setApproved(true);
          setShowApprove(false);
        }}
      />
    </div>
  );
}