/**
 * AccountsReview.jsx — Updated UI matching screenshot design
 * Accounts admin view: financial summary, rates breakdown, checklist, offer document
 */

import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate }        from "react-router-dom";
import { useDispatch, useSelector }      from "react-redux";
import { toast }                         from "sonner";
import { AnimatePresence, motion }       from "framer-motion";

import {
  ArrowLeft, FileText, CheckCircle2, Clock, Eye,
  ChevronRight, Home, Calculator, X, ClipboardCheck,
  User, Briefcase, Calendar, MessageSquare, ShieldCheck,
  FileCheck, PanelLeftClose, PanelLeftOpen, Loader2, RefreshCw,
  Edit2, ChevronDown, TrendingUp, DollarSign, PenLine,
  CheckSquare, Square, Building, Package, Monitor, Car, Send,
  BadgeCheck, Shield,
} from "lucide-react";

import { Card, CardContent }   from "../../../../../shared/components/ui/card";
import { Button }              from "../../../../../shared/components/ui/button";
import { Badge }               from "../../../../../shared/components/ui/badge";

import { CreateOfferLayout }   from "../../roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";
import { ContractForm }        from "../../roleActions/ProductionAdminActions/createoffer/Contractform";
import OfferStatusProgress     from "../../viewoffer/OfferStatusProgress";

import {
  getOfferThunk,
  moveToAccountsCheckThunk,
  moveToPendingCrewSignatureThunk,
  updateOfferThunk,
  selectCurrentOffer,
  selectOfferLoading,
  selectSubmitting,
  selectOfferError,
  clearOfferError,
} from "../../../store/offer.slice";

import { calculateRates, formatCurrency, defaultEngineSettings } from "../../../utils/rateCalculations";
import { defaultAllowances }                                      from "../../../utils/Defaultallowance";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const fmtMoney = (n, currency = "GBP") => {
  const num = parseFloat(n);
  if (isNaN(num) || !num) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency, minimumFractionDigits: 2 }).format(num);
};

function getInitials(name = "") {
  return name.trim().split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "??";
}

function getDeptLabel(val) {
  if (!val) return "—";
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getEngLabel(val) {
  return { loan_out: "Loan Out", paye: "PAYE", schd: "SCHD", long_form: "Long Form" }[val] || val || "—";
}

function offerToContractData(offer) {
  if (!offer) return {};
  return {
    fullName:                       offer.recipient?.fullName        || "",
    email:                          offer.recipient?.email           || "",
    mobileNumber:                   offer.recipient?.mobileNumber    || "",
    isViaAgent:                     offer.representation?.isViaAgent || false,
    agentEmail:                     offer.representation?.agentEmail || "",
    agentName:                      offer.representation?.agentName  || "",
    alternativeContract:            offer.alternativeContract        || "",
    unit:                           offer.unit                       || "",
    department:                     offer.department                 || "",
    subDepartment:                  offer.subDepartment              || "",
    jobTitle:                       offer.jobTitle                   || "",
    newJobTitle:                    offer.newJobTitle                || "",
    createOwnJobTitle:              offer.createOwnJobTitle          || false,
    jobTitleSuffix:                 offer.jobTitleSuffix             || "",
    allowSelfEmployed:              offer.taxStatus?.allowSelfEmployed              || "",
    statusDeterminationReason:      offer.taxStatus?.statusDeterminationReason      || "",
    otherStatusDeterminationReason: offer.taxStatus?.otherStatusDeterminationReason || "",
    regularSiteOfWork:              offer.regularSiteOfWork || "",
    workingInUK:                    offer.workingInUK       || "yes",
    startDate:                      offer.startDate         || "",
    endDate:                        offer.endDate           || "",
    dailyOrWeekly:                  offer.dailyOrWeekly     || "daily",
    engagementType:                 offer.engagementType    || "paye",
    workingWeek:                    offer.workingWeek       || "5",
    currency:                       offer.currency          || "GBP",
    feePerDay:                      offer.feePerDay         || "",
    overtime:                       offer.overtime          || "calculated",
    otherOT:      offer.otherOT      || "",
    cameraOTSWD:  offer.cameraOTSWD  || "",
    cameraOTSCWD: offer.cameraOTSCWD || "",
    cameraOTCWD:  offer.cameraOTCWD  || "",
    otherDealProvisions: offer.notes?.otherDealProvisions || "",
    additionalNotes:     offer.notes?.additionalNotes     || "",
  };
}

function offerToAllowances(offer) {
  if (!offer?.allowances?.length) return defaultAllowances;
  const result = { ...defaultAllowances };
  offer.allowances.forEach((a) => {
    if (a.key && result[a.key] !== undefined) result[a.key] = { ...result[a.key], ...a };
  });
  return result;
}

const cs = "£";

// ─── Accounts Checklist config ────────────────────────────────────────────────

const ACCOUNTS_CHECKLIST = [
  { key: "budgetCodesVerified",  label: "All budget codes verified",              category: "Budget"   },
  { key: "rateCalcsReviewed",    label: "Rate calculations reviewed",             category: "Budget"   },
  { key: "allowancesConfirmed",  label: "Allowances confirmed against budget",    category: "Budget"   },
  { key: "overtimeRatesOk",      label: "Overtime rates confirmed",               category: "Budget"   },
  { key: "payrollSetupOk",       label: "Payroll setup confirmed",                category: "Payroll"  },
  { key: "taxStatusConfirmed",   label: "Tax status confirmed",                   category: "Payroll"  },
  { key: "contractTermsApproved",label: "Contract terms approved by accounts",    category: "Final"    },
  { key: "readyForSignature",    label: "Ready for crew signature",               category: "Final"    },
];

// ─── Rate Summary Card ────────────────────────────────────────────────────────

function RateSummaryCard({ label, value, sub, highlight }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${highlight ? "bg-indigo-50 border-indigo-200" : "bg-white border-neutral-200"}`}>
      <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">{label}</p>
      <p className={`text-[18px] font-bold tabular-nums ${highlight ? "text-indigo-700" : "text-neutral-800"}`}>{value}</p>
      {sub && <p className="text-[9px] text-neutral-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Rate Table Row ───────────────────────────────────────────────────────────

function RateRow({ item, rate, hol, gross, highlight, budgetCode, tag }) {
  return (
    <tr className={`border-b border-neutral-50 text-[10px] ${highlight ? "bg-indigo-50/40" : "hover:bg-neutral-50/50"} transition-colors`}>
      <td className="py-1.5 px-2 text-neutral-700">{item}</td>
      <td className="py-1.5 px-2 text-right tabular-nums text-neutral-500">{formatCurrency(rate, cs)}</td>
      <td className="py-1.5 px-2 text-right tabular-nums text-neutral-400">{formatCurrency(hol, cs)}</td>
      <td className="py-1.5 px-2 text-right tabular-nums font-semibold text-indigo-600">{formatCurrency(gross, cs)}</td>
      {budgetCode !== undefined && (
        <td className="py-1.5 px-2 text-neutral-400 font-mono text-[9px]">{budgetCode || "—"}</td>
      )}
      {tag !== undefined && (
        <td className="py-1.5 px-2 text-neutral-400 text-[9px]">{tag || "—"}</td>
      )}
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AccountsReview() {
  const { id, projectName } = useParams();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();

  const offer        = useSelector(selectCurrentOffer);
  const isLoading    = useSelector(selectOfferLoading);
  const isSubmitting = useSelector(selectSubmitting);
  const apiError     = useSelector(selectOfferError);

  const proj = projectName || "demo-project";

  const [showEditPanel,     setShowEditPanel]     = useState(false);
  const [activeField,       setActiveField]       = useState(null);
  const [checklist,         setChecklist]         = useState({});
  const [showApproveModal,  setShowApproveModal]  = useState(false);
  const [offerDocCollapsed, setOfferDocCollapsed] = useState(true);
  const [isApproved,        setIsApproved]        = useState(false);

  useEffect(() => {
    if (id) dispatch(getOfferThunk(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (apiError) {
      toast.error(apiError.errors?.map((e) => e.message).join(" · ") || apiError.message || "Error");
      dispatch(clearOfferError());
    }
  }, [apiError, dispatch]);

  const contractData    = useMemo(() => offerToContractData(offer), [offer]);
  const allowances      = useMemo(() => offerToAllowances(offer),   [offer]);
  const calculatedRates = useMemo(() => {
    const fee = parseFloat(contractData.feePerDay) || 0;
    return calculateRates(fee, defaultEngineSettings);
  }, [contractData.feePerDay]);

  const tl = offer?.timeline || {};
  const jobTitle = offer?.createOwnJobTitle && offer?.newJobTitle ? offer.newJobTitle : offer?.jobTitle || "—";

  const feePerDay   = parseFloat(contractData.feePerDay) || 0;
  const hf          = defaultEngineSettings.holidayUplift;
  const weeklyGross = feePerDay * 5;
  const enabledAllowances = Object.entries(allowances).filter(([, a]) => a.enabled);
  const totalAllowances   = enabledAllowances.reduce((acc, [, a]) => acc + (parseFloat(a.feePerWeek) || 0), 0);

  // Accounts checklist
  const allChecked   = ACCOUNTS_CHECKLIST.every((c) => checklist[c.key]);
  const checkedCount = ACCOUNTS_CHECKLIST.filter((c) => checklist[c.key]).length;
  const categories   = [...new Set(ACCOUNTS_CHECKLIST.map((c) => c.category))];

  const handleApproveAndSendForSignature = async () => {
    const result = await dispatch(moveToPendingCrewSignatureThunk(offer._id));
    if (!result.error) {
      toast.success("Approved — sent for crew signature!");
      setIsApproved(true);
      setShowApproveModal(false);
    }
  };

  // Keep move to production check button for direction purposes
  const handleMoveToProductionCheck = async () => {
    const result = await dispatch(moveToAccountsCheckThunk(offer._id));
    if (!result.error) {
      toast.success("Moved to Accounts Check");
    }
  };

  if (isLoading && !offer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!offer && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <FileText className="h-12 w-12 text-neutral-300 mx-auto" />
          <p className="text-sm font-medium">Offer not found</p>
          <Button size="sm" variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">

      {/* ── Top Nav ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-indigo-700 flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-black tracking-tight">E</span>
            </div>
            <span className="font-semibold text-[13px] text-neutral-900">EAARTH</span>
            <div className="h-4 w-px bg-neutral-200" />
            <nav className="flex items-center gap-1 text-[12px]">
              <button onClick={() => navigate(`/projects/${proj}/offers`)}
                className="text-neutral-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                <Home className="h-3 w-3" /> Home
              </button>
              <ChevronRight className="h-3 w-3 text-neutral-300" />
              <button onClick={() => navigate(`/projects/${proj}/offers`)}
                className="text-neutral-400 hover:text-indigo-600 transition-colors">
                Onboarding
              </button>
              <ChevronRight className="h-3 w-3 text-neutral-300" />
              <span className="text-indigo-700 font-semibold">Accounts Review</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Budget & Payroll badge */}
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5">
              <Calculator className="h-3 w-3 text-indigo-500" />
              <span className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wide">Budget &amp; Payroll Certification</span>
            </div>
            <Button
              size="sm"
              variant={showEditPanel ? "default" : "outline"}
              className={`gap-2 h-8 text-xs font-medium ${showEditPanel ? "bg-indigo-600 hover:bg-indigo-700 text-white border-0" : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"}`}
              onClick={() => setShowEditPanel((p) => !p)}
            >
              <Edit2 className="h-3.5 w-3.5" />
              {showEditPanel ? "Close Editor" : "Edit Offer"}
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 text-neutral-500 hover:text-indigo-600"
              onClick={() => navigate(`/projects/${proj}/offers`)}>
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-5 space-y-5">

        {/* ── Status Progress ── */}
        <OfferStatusProgress
          status={offer?.status}
          sentToCrewAt={tl.sentToCrewAt}
          crewAcceptedAt={tl.crewAcceptedAt}
          productionCheckCompletedAt={tl.productionCheckCompletedAt}
          accountsCheckCompletedAt={tl.accountsCheckCompletedAt}
          crewSignedAt={tl.crewSignedAt}
          upmSignedAt={tl.upmSignedAt}
          fcSignedAt={tl.fcSignedAt}
          studioSignedAt={tl.studioSignedAt}
        />

        {/* ── Crew Profile Header ── */}
        <div className="bg-white rounded-xl border border-neutral-200 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[15px] font-bold shrink-0">
                {getInitials(contractData.fullName)}
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-neutral-900 tracking-tight">{contractData.fullName || "—"}</h2>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-indigo-600">{jobTitle}</span>
                  <span className="text-neutral-300">·</span>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                    <User className="h-3 w-3" />
                    <span>{getEngLabel(contractData.engagementType)}</span>
                  </div>
                  <span className="text-neutral-300">·</span>
                  <span className="text-[11px] text-neutral-500">{getDeptLabel(contractData.department)}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-[11px] font-bold text-neutral-800">
                    {fmtMoney(contractData.feePerDay, contractData.currency)}/day
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-400">
                  <Calendar className="h-3 w-3" />
                  <span>{fmtDate(contractData.startDate)} — {fmtDate(contractData.endDate)}</span>
                  <span>·</span>
                  <span>{contractData.email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="text-[10px] px-3 py-1 font-semibold tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                ACCOUNTS CHECK
              </Badge>
              {offer?.offerCode && (
                <span className="text-[10px] text-neutral-400 font-mono bg-neutral-50 border border-neutral-200 px-2 py-1 rounded">
                  {offer.offerCode}
                </span>
              )}
              {/* Move to Production Check button (direction placeholder) */}
              <Button size="sm" variant="outline"
                className="h-8 text-xs gap-1.5 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                disabled={isSubmitting}
                onClick={handleMoveToProductionCheck}>
                {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <TrendingUp className="h-3 w-3" />}
                Accounts Check
              </Button>
            </div>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="flex gap-5 items-start">

          {/* Edit Panel */}
          <AnimatePresence>
            {showEditPanel && (
              <motion.div
                key="edit-panel"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 380, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="shrink-0 overflow-hidden"
              >
                <div className="w-[380px] bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                  <div className="bg-indigo-700 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Edit2 className="h-3.5 w-3.5 text-white" />
                      <span className="text-white text-[12px] font-semibold tracking-wide">Edit Offer</span>
                    </div>
                    <button onClick={() => setShowEditPanel(false)} className="text-indigo-300 hover:text-white">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-[calc(100vh-180px)]">
                    <ContractForm
                      data={contractData}
                      onChange={(val) => {
                        if (offer?._id) dispatch(updateOfferThunk({ id: offer._id, data: { ...val, studioId: offer.studioId, projectId: offer.projectId } }));
                      }}
                      onPrint={() => {}}
                      onFieldFocus={(f) => setActiveField(f)}
                      onFieldBlur={() => setActiveField(null)}
                      calculatedRates={calculatedRates}
                      engineSettings={defaultEngineSettings}
                      salaryBudgetCodes={offer?.salaryBudgetCodes || []}
                      setSalaryBudgetCodes={() => {}}
                      salaryTags={offer?.salaryTags || []}
                      setSalaryTags={() => {}}
                      overtimeBudgetCodes={offer?.overtimeBudgetCodes || []}
                      setOvertimeBudgetCodes={() => {}}
                      overtimeTags={offer?.overtimeTags || []}
                      setOvertimeTags={() => {}}
                      allowances={allowances}
                      setAllowances={() => {}}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Center Column ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Financial Summary */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-[13px] font-semibold text-neutral-800">Financial Summary</h3>
                </div>
                <button className="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                  <Eye className="h-3 w-3" /> Raw rates
                </button>
              </div>

              <div className="p-5">
                {/* Rate breakdown cards */}
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Rate Breakdown</p>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <RateSummaryCard
                    label="Daily Rate"
                    value={fmtMoney(feePerDay, contractData.currency)}
                    sub={`Base: ${fmtMoney(feePerDay / (1 + hf), contractData.currency)}`}
                  />
                  <RateSummaryCard
                    label="Weekly Rate (5 day)"
                    value={fmtMoney(weeklyGross, contractData.currency)}
                    sub="Incl. holiday uplift"
                    highlight
                  />
                  <RateSummaryCard
                    label="Total Allowances"
                    value={fmtMoney(totalAllowances, contractData.currency)}
                    sub={`${enabledAllowances.length} active allowances`}
                  />
                </div>

                {/* Engagement details grid */}
                <div className="grid grid-cols-6 gap-3 text-[11px] border-t border-neutral-100 pt-4">
                  {[
                    ["Engagement Type", getEngLabel(contractData.engagementType)],
                    ["Frequency",       contractData.dailyOrWeekly === "weekly" ? "Weekly" : "Daily"],
                    ["Working Week",    contractData.workingWeek ? `${contractData.workingWeek} days` : "—"],
                    ["Active Budget Codes", (offer?.salaryBudgetCodes || []).filter(Boolean).length + (offer?.overtimeBudgetCodes || []).filter(Boolean).length],
                    ["Overtime",        contractData.overtime === "custom" ? "Custom" : "Calculated"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-wider">{label}</p>
                      <p className="font-semibold text-neutral-700 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Salary Rates Table */}
                <div className="mt-4 border border-neutral-100 rounded-xl overflow-hidden">
                  <div className="bg-indigo-700 px-3 py-1.5 flex items-center justify-between">
                    <span className="text-white text-[10px] font-semibold tracking-wide">Salary Rates</span>
                    <span className="text-indigo-200 text-[8px]">{calculatedRates.salary.length} items</span>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-indigo-50/60 border-b border-indigo-100">
                        {["Item", "Rate", "Hol", "Gross"].map((h) => (
                          <th key={h} className={`px-2 py-1.5 text-[8px] font-semibold text-indigo-600 uppercase tracking-wider ${h === "Item" ? "text-left" : "text-right"}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {calculatedRates.salary.map((row, i) => (
                        <RateRow key={i} {...row} highlight={i % 2 !== 0} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Overtime Rates Table */}
                <div className="mt-3 border border-neutral-100 rounded-xl overflow-hidden">
                  <div className="bg-indigo-700 px-3 py-1.5 flex items-center justify-between">
                    <span className="text-white text-[10px] font-semibold tracking-wide">Overtime Rates</span>
                    <span className={`text-[7px] px-1.5 py-0.5 rounded font-bold ${contractData.overtime === "custom" ? "bg-amber-400 text-amber-900" : "bg-indigo-500 text-indigo-100"}`}>
                      {contractData.overtime === "custom" ? "CUSTOM" : "CALCULATED"}
                    </span>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-indigo-50/60 border-b border-indigo-100">
                        {["Item", "Rate", "Hol", "Gross"].map((h) => (
                          <th key={h} className={`px-2 py-1.5 text-[8px] font-semibold text-indigo-600 uppercase tracking-wider ${h === "Item" ? "text-left" : "text-right"}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {calculatedRates.overtime.map((row, i) => (
                        <RateRow key={i} {...row} highlight={i % 2 !== 0} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Allowances */}
                {enabledAllowances.length > 0 && (
                  <div className="mt-3 border border-neutral-100 rounded-xl overflow-hidden">
                    <div className="bg-indigo-700 px-3 py-1.5">
                      <span className="text-white text-[10px] font-semibold tracking-wide">Allowances</span>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="bg-indigo-50/60 border-b border-indigo-100">
                          {["Allowance", "Fee / Week", "Budget Code", "Tag", "Payable In"].map((h) => (
                            <th key={h} className={`px-2 py-1.5 text-[8px] font-semibold text-indigo-600 uppercase tracking-wider ${h === "Fee / Week" ? "text-right" : "text-left"}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {enabledAllowances.map(([key, a], i) => {
                          const payable = [a.payablePrep && "Prep", a.payableShoot && "Shoot", a.payableWrap && "Wrap"].filter(Boolean).join(", ");
                          return (
                            <tr key={key} className={`border-b border-neutral-50 text-[10px] ${i % 2 !== 0 ? "bg-indigo-50/20" : ""}`}>
                              <td className="py-1.5 px-2 text-neutral-700 font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</td>
                              <td className="py-1.5 px-2 text-right tabular-nums font-semibold text-indigo-600">{cs}{parseFloat(a.feePerWeek || 0).toFixed(2)}</td>
                              <td className="py-1.5 px-2 text-neutral-400 font-mono text-[9px]">{a.budgetCode || "—"}</td>
                              <td className="py-1.5 px-2 text-neutral-400 text-[9px]">{a.tag || "—"}</td>
                              <td className="py-1.5 px-2 text-neutral-500 text-[9px]">{payable || "—"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Offer Document (collapsible) */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <button
                onClick={() => setOfferDocCollapsed((p) => !p)}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-[13px] font-semibold text-neutral-800">Offer Document</h3>
                  <span className="text-[10px] text-neutral-400 ml-1">Reference</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${offerDocCollapsed ? "" : "rotate-180"}`} />
              </button>

              {!offerDocCollapsed && (
                <div className="border-t border-neutral-100">
                  <CreateOfferLayout
                    data={contractData}
                    offer={offer}
                    activeField={activeField}
                    onFieldFocus={(f) => setActiveField(f)}
                    onFieldBlur={() => setActiveField(null)}
                    calculatedRates={calculatedRates}
                    engineSettings={defaultEngineSettings}
                    salaryBudgetCodes={offer?.salaryBudgetCodes     || []}
                    setSalaryBudgetCodes={() => {}}
                    salaryTags={offer?.salaryTags                   || []}
                    setSalaryTags={() => {}}
                    overtimeBudgetCodes={offer?.overtimeBudgetCodes || []}
                    setOvertimeBudgetCodes={() => {}}
                    overtimeTags={offer?.overtimeTags               || []}
                    setOvertimeTags={() => {}}
                    allowances={allowances}
                    initialOfferCollapsed={false}
                    hideContractDocument={false}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="w-[300px] shrink-0 space-y-4">

            {/* Accounts Checklist */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="bg-indigo-700 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-3.5 w-3.5 text-white" />
                  <span className="text-white text-[11px] font-semibold tracking-wide uppercase">Accounts Checklist</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold tracking-wider ${
                  allChecked ? "bg-emerald-400 text-emerald-900" : "bg-indigo-500 text-white"
                }`}>
                  {allChecked ? "All verified" : `${checkedCount}/${ACCOUNTS_CHECKLIST.length}`}
                </span>
              </div>

              <div className="p-4">
                <div className="h-1.5 bg-neutral-100 rounded-full mb-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${allChecked ? "bg-emerald-500" : "bg-indigo-500"}`}
                    style={{ width: `${(checkedCount / ACCOUNTS_CHECKLIST.length) * 100}%` }}
                  />
                </div>

                <div className="space-y-3">
                  {categories.map((cat) => {
                    const items = ACCOUNTS_CHECKLIST.filter((c) => c.category === cat);
                    const catDone = items.filter((c) => checklist[c.key]).length;
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{cat}</p>
                          <span className="text-[8px] text-neutral-400">{catDone}/{items.length}</span>
                        </div>
                        <div className="space-y-1">
                          {items.map((item) => {
                            const checked = !!checklist[item.key];
                            return (
                              <button key={item.key}
                                disabled={isApproved}
                                onClick={() => setChecklist((p) => ({ ...p, [item.key]: !p[item.key] }))}
                                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition-all ${
                                  checked
                                    ? "border-emerald-200 bg-emerald-50/60"
                                    : "border-neutral-100 bg-neutral-50/50 hover:border-neutral-200 hover:bg-white"
                                } ${isApproved ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                              >
                                {checked
                                  ? <CheckSquare className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                  : <Square className="h-3.5 w-3.5 text-neutral-300 shrink-0" />}
                                <span className={`text-[10px] leading-tight ${checked ? "text-emerald-700" : "text-neutral-600"}`}>
                                  {item.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {allChecked && (
                  <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="text-[10px] font-semibold text-emerald-700">All checks complete</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {!isApproved && (
              <div className="bg-white rounded-xl border border-neutral-200 p-4">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Actions</p>
                <div className="space-y-2">
                  <button
                    onClick={() => allChecked && setShowApproveModal(true)}
                    disabled={!allChecked || isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold transition-all ${
                      allChecked && !isSubmitting
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PenLine className="h-3.5 w-3.5" />}
                    Approve &amp; Send for Signatures
                  </button>
                  {/* Direction button — kept for reference */}
                  <button
                    onClick={handleMoveToProductionCheck}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 text-neutral-600 text-[12px] font-medium hover:bg-neutral-50 transition-colors"
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Return to Production
                  </button>
                </div>
                {!allChecked && (
                  <p className="text-[9px] text-neutral-400 text-center mt-2">
                    Complete all checklist items to enable approval
                  </p>
                )}
              </div>
            )}

            {isApproved && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-[12px] font-semibold text-emerald-800">Accounts Approved</p>
                <p className="text-[10px] text-emerald-600 mt-1">Sent for crew signature</p>
              </div>
            )}

            {/* Offer Summary */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Offer Summary</p>
              <div className="space-y-1.5 text-[11px]">
                {[
                  ["Fee / Day",    fmtMoney(contractData.feePerDay, contractData.currency)],
                  ["Frequency",    contractData.dailyOrWeekly === "weekly" ? "Weekly" : "Daily"],
                  ["Engagement",   getEngLabel(contractData.engagementType)],
                  ["Working Week", contractData.workingWeek ? `${contractData.workingWeek} days` : "—"],
                  ["Total Allowances", fmtMoney(totalAllowances)],
                  ["Currency",     contractData.currency || "GBP"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-neutral-400">{label}</span>
                    <span className="font-medium text-neutral-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Offer Timeline */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Offer Timeline</p>
              <div className="space-y-2.5">
                {[
                  { label: "Offer Created",            date: offer?.createdAt,                    dot: "bg-emerald-500 ring-emerald-100" },
                  { label: "Sent to Crew for review",  date: tl.sentToCrewAt,                     dot: "bg-blue-400 ring-blue-100"       },
                  { label: "Offer accepted",           date: tl.crewAcceptedAt,                   dot: "bg-emerald-500 ring-emerald-100" },
                  { label: "Production approved",      date: tl.productionCheckCompletedAt,        dot: "bg-violet-500 ring-violet-100"   },
                  { label: "Moved to accounts review", date: tl.accountsCheckCompletedAt,          dot: "bg-indigo-500 ring-indigo-100"   },
                ].filter((e) => e.date).map((e, i, arr) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="flex flex-col items-center">
                      <div className={`h-2 w-2 rounded-full mt-1 shrink-0 ring-2 ${e.dot}`} />
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-neutral-100 mt-1 mb-0.5" />}
                    </div>
                    <div className="pb-2 min-w-0">
                      <p className="text-[10px] font-medium text-neutral-700">{e.label}</p>
                      <p className="text-[9px] text-neutral-400 mt-0.5">{fmtDate(e.date)}</p>
                    </div>
                  </div>
                ))}
                {!offer?.createdAt && (
                  <p className="text-[10px] text-neutral-400 italic">No timeline events yet</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Approve & Send for Signature Modal ── */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-indigo-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenLine className="h-5 w-5 text-white" />
                <h3 className="text-white font-semibold">Approve &amp; Send for Signatures?</h3>
              </div>
              <button onClick={() => setShowApproveModal(false)} className="text-indigo-300 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[13px] text-neutral-600 mb-4">
                All financial checks completed for <strong>{contractData.fullName}</strong>.
                This will send the contract for crew signature.
              </p>
              <div className="bg-indigo-50 rounded-lg p-3 mb-5 border border-indigo-100">
                <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-1.5">Verified Items</p>
                <div className="space-y-1">
                  {ACCOUNTS_CHECKLIST.map((c) => (
                    <div key={c.key} className="flex items-center gap-2 text-[11px]">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span className="text-neutral-600">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowApproveModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-200 text-[13px] text-neutral-600 hover:bg-neutral-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleApproveAndSendForSignature} disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-[13px] font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
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