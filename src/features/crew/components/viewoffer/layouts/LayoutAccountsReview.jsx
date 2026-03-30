/**
 * layouts/LayoutAccountsReview.jsx — ACCOUNTS_CHECK stage.
 *
 * THEMING: 100% CSS variables from index.css — fully dark/light mode aware.
 *
 * CHANGES:
 *   - Inline custom approve modal removed entirely
 *   - Now uses <OfferActionDialog type="approveOffer" /> exactly like
 *     LayoutProductionReview uses it — passes verifiedItems derived from
 *     ACCT_CHECKLIST filtered by current checklist state
 *   - Body copy: "You have verified all budget and payroll items for NAME.
 *                 This will move the offer to the Crew Signing stage."
 *   - Button label: "Approve" (matches screenshot)
 */

import { useState }               from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast }                  from "sonner";
import {
  ClipboardCheck, Loader2, CheckCircle2,
  FileText, ShieldCheck, FileCheck, PenLine,
  TrendingUp, DollarSign, Receipt, BarChart2, MessageSquare,
} from "lucide-react";

import ContractInstancesPanel  from "../../../pages/ContractInstancesPanel";
import SubmittedDocumentsPanel from "../../../components/viewoffer/layouts/SubmittedDocumentsPanel";
import CrewIdentityHeader      from "../../../components/viewoffer/layouts/CrewIdentityHeader";
import OfferActionDialog       from "../../../components/onboarding/OfferActionDialog";

import {
  getProjectOffersThunk,
  returnToProductionThunk,
} from "../../../store/offer.slice";

import { APP_CONFIG } from "../../../config/appConfig";

// ── Checklist config ──────────────────────────────────────────────────────────

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
      {/* Header */}
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
            Accounts Checklist
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

                      {/* Icon */}
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

export default function LayoutAccountsReview({
  offer, contractData, allowances, calculatedRates,
  // retained for parent prop-compatibility — not consumed here
  salaryBudgetCodes   = [],
  salaryTags          = [],
  overtimeBudgetCodes = [],
  overtimeTags        = [],
  isSubmitting, onAction, dispatch,
}) {
  const navigate            = useNavigate();
  const { id, projectName } = useParams();
  const proj                = projectName || "demo-project";
  const offerId             = id || offer?._id;

  const [checklist,   setChecklist  ] = useState({});
  const [showApprove, setShowApprove] = useState(false);
  const [showReturn,  setShowReturn  ] = useState(false);
  const [returning,   setReturning  ] = useState(false);
  const [approved,    setApproved   ] = useState(false);

  const allDone       = ACCT_CHECKLIST.every((c) => checklist[c.key]);
  // Pass only the ticked items into the dialog so the list matches reality
  const verifiedItems = ACCT_CHECKLIST.filter((c) => checklist[c.key]);

  const handleReturnConfirm = async (notes) => {
    setShowReturn(false);
    setReturning(true);
    toast.loading("Returning to production…", { id: "return-prod" });
    try {
      const result = await dispatch(returnToProductionThunk({
        offerId,
        reason: notes.toUpperCase(),
      }));
      toast.dismiss("return-prod");
      if (!result.error) {
        toast.success("Returned to production. Offer set to Needs Revision.");
        const projectId = offer?.projectId || APP_CONFIG.PROJECT_ID;
        await dispatch(getProjectOffersThunk({ projectId }));
        setTimeout(() => navigate(`/projects/${proj}/onboarding`), 500);
      } else {
        toast.error(result.payload?.message || "Failed to return to production. Please try again.");
      }
    } catch (err) {
      toast.dismiss("return-prod");
      toast.error(err.message || "Something went wrong.");
    } finally {
      setReturning(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* Crew avatar, name, title, rate, dates, status badge */}
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
              <span className="ml-auto text-[9px] font-mono" style={{ color: "var(--primary)" }}>
                ACCOUNTS REVIEW
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
        <div className="w-[300px] shrink-0 space-y-3">
          <ChecklistWidget
            items={ACCT_CHECKLIST}
            checked={checklist}
            onChange={(key, val) => setChecklist((p) => ({ ...p, [key]: val }))}
            disabled={approved}
          />

          {!approved ? (
            <div
              className="rounded-xl p-3 space-y-2"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              {/* Approve — enabled only when all items are checked */}
              <button
                onClick={() => allDone && setShowApprove(true)}
                disabled={!allDone || isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold transition-all"
                style={
                  allDone && !isSubmitting
                    ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                    : { background: "var(--muted)", color: "var(--muted-foreground)", cursor: "not-allowed" }
                }
                onMouseEnter={(e) => { if (allDone && !isSubmitting) e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={(e) => { if (allDone && !isSubmitting) e.currentTarget.style.opacity = "1"; }}
              >
                {isSubmitting
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <PenLine className="h-3.5 w-3.5" />
                }
                Approve &amp; Send for Signatures
              </button>

              {/* Return to Production */}
              <button
                onClick={() => setShowReturn(true)}
                disabled={isSubmitting || returning}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[11px] font-medium transition-colors disabled:opacity-60"
                style={{
                  background: "var(--peach-50)",
                  border: "1px solid var(--peach-200)",
                  color: "var(--peach-600)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--peach-100)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--peach-50)")}
              >
                {returning
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <MessageSquare className="h-3 w-3" />
                }
                Return to Production
              </button>

              {!allDone && (
                <p className="text-[9px] text-center" style={{ color: "var(--muted-foreground)" }}>
                  Complete all checklist items to approve
                </p>
              )}
            </div>
          ) : (
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: "var(--mint-50)", border: "1px solid var(--mint-200)" }}
            >
              <CheckCircle2 className="h-6 w-6 mx-auto mb-1.5" style={{ color: "var(--mint-500)" }} />
              <p className="text-[12px] font-semibold" style={{ color: "var(--mint-800)" }}>
                Accounts Approved
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--mint-600)" }}>
                Sent for crew signature
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Approve dialog — shared OfferActionDialog (same pattern as LayoutProductionReview) */}
      <OfferActionDialog
        type="approveOffer"
        open={showApprove}
        offer={offer}
        verifiedItems={verifiedItems}
        isLoading={isSubmitting}
        onClose={() => setShowApprove(false)}
        onConfirm={async () => {
          await onAction("pendingCrewSignature");
          setApproved(true);
          setShowApprove(false);
        }}
      />

      {/* ── Return to production dialog — shared OfferActionDialog */}
      <OfferActionDialog
        type="returnToProduction"
        open={showReturn}
        offer={offer}
        isLoading={returning}
        onClose={() => setShowReturn(false)}
        onConfirm={handleReturnConfirm}
      />
    </div>
  );
}