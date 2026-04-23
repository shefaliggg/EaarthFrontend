

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate, useParams }   from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast }                    from "sonner";

import {
  Loader2, AlertTriangle, RefreshCw, ArrowRight,
  FileText, PenLine, CheckCircle2, Clock,
  ThumbsUp, MessageSquare, X,
} from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { cn }     from "../../../shared/config/utils";

import {
  getProjectOffersThunk,
  getOfferThunk,
  crewAcceptThunk,
  crewRequestChangesThunk,
  moveToPendingUpmSignatureThunk,
  moveToPendingFcSignatureThunk,
  moveToPendingStudioSignatureThunk,
  completeOfferThunk,
  selectProjectOffers,
  selectListLoading,
} from "../store/offer.slice";

import {
  clearInstances,
  getContractInstancesThunk,
  signContractInstanceThunk,
} from "../store/contractInstances.slice";

import { fetchCurrentSignatureThunk }  from "../../signature/store/signature.thunk";
import { selectProfileSignatureUrl }   from "../../signature/store/signature.slice";

import ContractInstancesPanel from "../pages/ContractInstancesPanel";
import { OfferStatusBadge }   from "../components/onboarding/OfferStatusBadge";
import { CreateOfferLayout }  from "../components/roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";

// ── Reuse the EXACT same status bar from ViewOffer — no new code ──────────────
import OfferStatusProgress from "../components/viewoffer/OfferStatusProgress";

import { calculateRates, defaultEngineSettings } from "../utils/rateCalculations";
import { defaultAllowances }                      from "../utils/Defaultallowance";

// ─── Hardcoded fallback ───────────────────────────────────────────────────────
const FALLBACK_PROJECT_ID = "697c899668977a7ca2b27462";
const isObjectId = (str) => /^[a-f\d]{24}$/i.test(String(str ?? ""));

// ── Redux selectors ───────────────────────────────────────────────────────────
const selectIsSubmitting = (s) => s?.offers?.isSubmitting ?? false;
const selectListError    = (s) => s?.offers?.error        ?? null;

// ── Stage config — CREW-ONLY ──────────────────────────────────────────────────
const OFFER_STAGES = [
  {
    key:         "offer_review",
    label:       "OFFER REVIEW",
    icon:        FileText,
    colorScheme: "amber",
    statuses:    ["DRAFT", "SENT_TO_CREW", "NEEDS_REVISION"],
  },
  {
    key:         "contract_sign",
    label:       "CONTRACT & SIGN",
    icon:        PenLine,
    colorScheme: "purple",
    statuses:    [
      "PENDING_CREW_SIGNATURE",
      "PENDING_UPM_SIGNATURE",
      "PENDING_FC_SIGNATURE",
      "PENDING_STUDIO_SIGNATURE",
    ],
  },
  {
    key:         "contract_active",
    label:       "CONTRACT ACTIVE",
    icon:        CheckCircle2,
    colorScheme: "green",
    statuses:    ["COMPLETED"],
  },
  {
    key:         "contract_ended",
    label:       "CONTRACT ENDED",
    icon:        Clock,
    colorScheme: "gray",
    statuses:    ["TERMINATED", "CANCELLED", "VOIDED", "REVISED"],
  },
];

function getStageForOffer(offer) {
  const status = offer?.status;
  const today  = new Date(); today.setHours(0, 0, 0, 0);
  const end    = offer?.endDate ? new Date(offer.endDate) : null;

  if (["DRAFT", "SENT_TO_CREW", "NEEDS_REVISION"].includes(status))   return "offer_review";
  if (["PENDING_CREW_SIGNATURE"].includes(status))                      return "contract_sign";
  if (["TERMINATED","CANCELLED","VOIDED","REVISED"].includes(status))  return "contract_ended";
  if (status === "COMPLETED") {
    if (end && end < today) return "contract_ended";
    return "contract_active";
  }
  return null;
}

function countByStage(offers) {
  const counts = Object.fromEntries(OFFER_STAGES.map((s) => [s.key, 0]));
  offers.forEach((o) => {
    const k = getStageForOffer(o);
    if (k) counts[k] = (counts[k] || 0) + 1;
  });
  return counts;
}

function filterByStage(offers, stageKey) {
  if (!stageKey) return offers.filter((o) => getStageForOffer(o) !== null);
  return offers.filter((o) => getStageForOffer(o) === stageKey);
}

// ── Stage Card — image-1 style: icon centered above, label, BIG count ─────────
// ── Stage Card — image style: icon on LEFT, label and count on RIGHT ─────────
// ── Stage Card — icon on RIGHT, label and count on LEFT ─────────
function StageCard({ stage, count, isSelected, onClick }) {
  const Icon = stage.icon;

  const colors = {
    amber:  { icon: "#f59e0b", count: "#d97706", ring: "#f59e0b", bg: "#fffbeb" },
    purple: { icon: "#534AB7", count: "#534AB7", ring: "#534AB7", bg: "#faf9ff" },
    green:  { icon: "#059669", count: "#059669", ring: "#059669", bg: "#f0fdf4" },
    gray:   { icon: "#6b7280", count: "#6b7280", ring: "#9ca3af", bg: "#f9fafb" },
  }[stage.colorScheme] || { icon: "#534AB7", count: "#534AB7", ring: "#534AB7", bg: "#faf9ff" };

  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-neutral-200 px-4 py-6 flex items-center justify-between gap-4 transition-all hover:shadow-md cursor-pointer w-full",
        isSelected ? "ring-2 shadow-sm" : ""
      )}
      style={isSelected ? { outline: `2px solid ${colors.ring}`, outlineOffset: "2px" } : {}}
    >
      {/* Text content - Left side */}
      <div className="flex-1 text-left">
        <p className="text-md font-semibold uppercase tracking-wider text-neutral-500">
          {stage.label}
        </p>
        <p className="text-3xl font-bold leading-tight" style={{ color: colors.count }}>
          {count ?? 0}
        </p>
      </div>
      
      {/* Icon - Right side */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: colors.bg }}
      >
        <Icon style={{ color: colors.icon }} className="w-6 h-6" />
      </div>
    </button>
  );
}
// ── Signing helpers ───────────────────────────────────────────────────────────
const CREW_CAN_SIGN_STATUS = "PENDING_CREW_SIGNATURE";

const ADVANCE_THUNK = {
  CREW:   (oid, dispatch) => dispatch(moveToPendingUpmSignatureThunk(oid)),
  UPM:    (oid, dispatch) => dispatch(moveToPendingFcSignatureThunk(oid)),
  FC:     (oid, dispatch) => dispatch(moveToPendingStudioSignatureThunk(oid)),
  STUDIO: (oid, dispatch) => dispatch(completeOfferThunk(oid)),
};

function signingMessage(status) {
  switch (status) {
    case "PENDING_CREW_SIGNATURE":
      return { text: "Please sign your contract", color: "#7c3aed", icon: "sign" };
    case "CREW_ACCEPTED":
    case "PRODUCTION_CHECK":
    case "ACCOUNTS_CHECK":
    case "PENDING_UPM_SIGNATURE":
    case "PENDING_FC_SIGNATURE":
    case "PENDING_STUDIO_SIGNATURE":
      return { text: "Contract is being processed for approvals", color: "#d97706", icon: "wait" };
    case "COMPLETED":
      return { text: "Contract active — all done!", color: "#16a34a", icon: "done" };
    default:
      return { text: "Pending", color: "#6b7280", icon: "wait" };
  }
}

// ── Allowance / contract data helpers ────────────────────────────────────────
const ALLOWANCE_KEY_MAP = {
  boxRental:"boxRental",computer:"computer",software:"software",equipment:"equipment",
  vehicle:"vehicle",mobile:"mobile",living:"living",perDiem1:"perDiem1",perDiem2:"perDiem2",
  breakfast:"breakfast",lunch:"lunch",dinner:"dinner",fuel:"fuel",mileage:"mileage",
  BOX_RENTAL:"boxRental",COMPUTER:"computer",SOFTWARE:"software",EQUIPMENT:"equipment",
  VEHICLE:"vehicle",MOBILE:"mobile",LIVING:"living",PER_DIEM:"perDiem1",
  PER_DIEM_1:"perDiem1",PER_DIEM_2:"perDiem2",
};
function toCamelCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/[_\s-]([a-z])/g, (_, c) => c.toUpperCase());
}
function offerToAllowances(offer) {
  const result = Object.fromEntries(
    Object.entries(defaultAllowances).map(([k, v]) => [k, { ...v, enabled: false }])
  );
  if (!Array.isArray(offer?.allowances) || !offer.allowances.length) return result;
  offer.allowances.forEach((a) => {
    if (!a?.key) return;
    const canonical =
      ALLOWANCE_KEY_MAP[a.key] ||
      ALLOWANCE_KEY_MAP[toCamelCase(a.key)] ||
      (result[a.key] !== undefined ? a.key : null);
    if (!canonical) { result[a.key] = { ...a, key: a.key, enabled: !!a.enabled }; return; }
    result[canonical] = { ...result[canonical], ...a, key: canonical, enabled: !!a.enabled };
  });
  return result;
}
function offerToContractData(offer) {
  if (!offer) return {};
  return {
    fullName:           offer.recipient?.fullName     || "",
    email:              offer.recipient?.email        || "",
    mobileNumber:       offer.recipient?.mobileNumber || "",
    isViaAgent:         offer.representation?.isViaAgent  || false,
    agentEmail:         offer.representation?.agentEmail  || "",
    unit:               offer.unit          || "",
    department:         offer.department    || "",
    subDepartment:      offer.subDepartment || "",
    jobTitle:           offer.jobTitle      || "",
    newJobTitle:        offer.newJobTitle   || "",
    createOwnJobTitle:  offer.createOwnJobTitle || false,
    startDate:          offer.startDate     || "",
    endDate:            offer.endDate       || "",
    dailyOrWeekly:      offer.dailyOrWeekly || "daily",
    engagementType:     offer.engagementType || "paye",
    workingWeek:        offer.workingWeek   || "5",
    currency:           offer.currency      || "GBP",
    feePerDay:          offer.feePerDay     || "",
    overtime:           offer.overtime      || "calculated",
    notes: {
      otherDealProvisions: offer.notes?.otherDealProvisions || "",
      additionalNotes:     offer.notes?.additionalNotes     || "",
    },
    specialStipulations: Array.isArray(offer.specialStipulations) ? offer.specialStipulations : [],
  };
}

// ── Formatters ────────────────────────────────────────────────────────────────
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
const fmtMoney = (n, currency = "GBP") => {
  const num = parseFloat(n);
  if (!num) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency, minimumFractionDigits: 0 }).format(num);
};
const deptLabel = (v = "") => v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const timeAgo   = (d) => {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ════════════════════════════════════════════════════════════════════════════════
// OFFER LIST ITEM — with colored status badges
// ════════════════════════════════════════════════════════════════════════════════
function OfferListItem({ offer, isSelected, onClick, index }) {
  // Get name
  const name = offer.recipient?.fullName || 
               offer.recipient?.name || 
               offer.name || 
               offer.title || 
               "Offer";
  
  const jobTitle = offer.createOwnJobTitle && offer.newJobTitle 
    ? offer.newJobTitle 
    : (offer.jobTitle || offer.role || "—");
  
  const company = offer.company || 
                  offer.productionCompany || 
                  offer.department || 
                  "Production";
  
  const rate = fmtMoney(offer.feePerDay, offer.currency || "GBP");
  const rateLabel = offer.dailyOrWeekly === "weekly" ? "/Wk" : "/Day";
  const status = offer.status;

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case "SENT_TO_CREW":
        return { bg: "#FEF3C7", text: "#D97706", badge: "PENDING" };  // Orange/Yellow
      case "CREW_ACCEPTED":
        return { bg: "#D1FAE5", text: "#059669", badge: "ACCEPTED" };  // Green
      case "NEEDS_REVISION":
        return { bg: "#FEE2E2", text: "#DC2626", badge: "CHANGES" };    // Red
      case "PENDING_CREW_SIGNATURE":
        return { bg: "#DBEAFE", text: "#2563EB", badge: "SIGN" };        // Blue
      case "COMPLETED":
        return { bg: "#D1FAE5", text: "#059669", badge: "COMPLETED" };   // Green
      case "TERMINATED":
      case "CANCELLED":
        return { bg: "#F3E8FF", text: "#9333EA", badge: "ENDED" };       // Purple
      default:
        return { bg: "#F3F4F6", text: "#6B7280", badge: "PENDING" };     // Gray
    }
  };

  const statusColor = getStatusColor();

  // Get person badge (2 letters)
  const getPersonBadge = () => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 transition-all duration-150 focus:outline-none",
        isSelected
          ? "bg-[#EEEDFE] border-l-[3px] border-l-[#7F77DD]"
          : "border-l-[3px] border-l-transparent hover:bg-gray-50"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Person Badge - Left side */}
        
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {name}
          </p>
          
          <p className="text-xs text-gray-500 truncate mb-1">
            {jobTitle} • {company}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-900">
              {rate}{rateLabel}
            </span>
            <span 
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
            >
              {statusColor.badge}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
// ════════════════════════════════════════════════════════════════════════════════
// OFFER REVIEW PANEL
// ════════════════════════════════════════════════════════════════════════════════
function OfferReviewPanel({ offer, isSubmitting, onAccept, onRequestChanges }) {
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason]         = useState("");

  const contractData    = useMemo(() => offerToContractData(offer), [offer]);
  const allowances      = useMemo(() => offerToAllowances(offer),   [offer]);
  const calculatedRates = useMemo(() => {
    const stored = offer?.calculatedRates;
    if (stored?.salary?.length > 0 || stored?.overtime?.length > 0)
      return { salary: stored.salary || [], overtime: stored.overtime || [] };
    return calculateRates(parseFloat(offer?.feePerDay) || 0, defaultEngineSettings);
  }, [offer?.calculatedRates, offer?.feePerDay]);

  const canRespond = offer?.status === "SENT_TO_CREW";

  const handleSendRequest = () => {
    if (!reason.trim()) { toast.error("Please provide a reason"); return; }
    onRequestChanges(reason);
    setShowReason(false);
    setReason("");
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto">
        <CreateOfferLayout
          data={contractData}
          offer={offer}
          allowances={allowances}
          calculatedRates={calculatedRates}
          engineSettings={defaultEngineSettings}
          salaryBudgetCodes={offer?.salaryBudgetCodes || []}
          salaryTags={offer?.salaryTags || []}
          overtimeBudgetCodes={offer?.overtimeBudgetCodes || []}
          overtimeTags={offer?.overtimeTags || []}
          isDocumentLocked={true}
          hideContractDocument={false}
          hideOfferSections={false}
          initialOfferCollapsed={false}
          activeField={null}
          onFieldClick={() => {}}
          onFieldFocus={() => {}}
          onFieldBlur={() => {}}
        />
      </div>
      {canRespond && (
        <div className="border-t border-neutral-100 bg-white px-5 py-3 shrink-0">
          {showReason ? (
            <div className="space-y-2">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe what needs to change…"
                className="w-full text-[12px] border border-neutral-200 rounded-lg px-3 py-2 resize-none h-20 focus:outline-none focus:border-purple-400"
              />
              <div className="flex gap-2">
                <Button size="sm" className="h-8 text-[11px] gap-1.5 bg-amber-600 hover:bg-amber-700 text-white" onClick={handleSendRequest} disabled={isSubmitting}>
                  <MessageSquare className="w-3 h-3" /> Send Request
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-[11px]" onClick={() => setShowReason(false)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" className="gap-1.5 h-8 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onAccept} disabled={isSubmitting}>
                <ThumbsUp className="w-3 h-3" /> Accept Offer
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 h-8 text-[11px] border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => setShowReason(true)} disabled={isSubmitting}>
                <MessageSquare className="w-3 h-3" /> Request Changes
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// CONTRACT SIGN PANEL
// ════════════════════════════════════════════════════════════════════════════════
function ContractSignPanel({ offer, profileSignature, isSubmitting, onSignInstance, onAllSigned }) {
  const canSign = offer?.status === CREW_CAN_SIGN_STATUS;
  const msg     = signingMessage(offer?.status);

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{
          background: msg.icon === "done" ? "#f0fdf4" : canSign ? "#faf9ff" : "#fffbeb",
          border: `1px solid ${msg.icon === "done" ? "#bbf7d0" : canSign ? "#ddd6fe" : "#fde68a"}`,
        }}
      >
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          msg.icon === "done" ? "bg-emerald-100" : canSign ? "bg-purple-100" : "bg-amber-100"
        )}>
          {msg.icon === "done"
            ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            : canSign
              ? <PenLine className="w-4 h-4 text-purple-600" />
              : <Clock className="w-4 h-4 text-amber-600" />
          }
        </div>
        <p className="text-[12px] font-semibold" style={{ color: msg.color }}>{msg.text}</p>
      </div>

      {offer?._id && (
        <ContractInstancesPanel
          offerId={offer._id}
          offerStatus={offer.status}
          canSignRole={canSign}
          profileSignature={profileSignature}
          onSignInstance={onSignInstance}
          isSubmitting={isSubmitting}
          onAllSigned={onAllSigned}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// CONTRACT ACTIVE PANEL
// ════════════════════════════════════════════════════════════════════════════════
function ContractActivePanel({ offer }) {
  const jobTitle = offer.createOwnJobTitle && offer.newJobTitle ? offer.newJobTitle : offer.jobTitle || "—";
  const items = [
    { label: "Name",         value: offer.recipient?.fullName || "—" },
    { label: "Role",         value: jobTitle },
    { label: "Department",   value: offer.department ? deptLabel(offer.department) : "—" },
    { label: "Rate / day",   value: fmtMoney(offer.feePerDay, offer.currency || "GBP") },
    { label: "Engagement",   value: (offer.engagementType || "").toUpperCase() },
    { label: "Start",        value: fmtDate(offer.startDate) },
    { label: "End",          value: fmtDate(offer.endDate) },
    { label: "Working Week", value: offer.workingWeek ? `${offer.workingWeek} days` : "—" },
  ];
  const tl = offer?.timeline || {};
  const signatories = [
    { role: "You",            signed: !!tl.crewSignedAt,   signedAt: tl.crewSignedAt   },
    { role: "Production",     signed: !!tl.upmSignedAt,    signedAt: tl.upmSignedAt    },
    { role: "Finance",        signed: !!tl.fcSignedAt,     signedAt: tl.fcSignedAt     },
    { role: "Final Approval", signed: !!tl.studioSignedAt, signedAt: tl.studioSignedAt },
  ];
  return (
    <div className="space-y-5 p-5">
      <div className="rounded-xl px-4 py-3 flex items-center gap-3 bg-emerald-50 border border-emerald-200">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <p className="text-[12px] font-bold text-emerald-800">Contract Active</p>
          <p className="text-[11px] text-emerald-600">All signatures collected — your contract is live.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ label, value }) => (
          <div key={label} className="bg-neutral-50 rounded-lg px-3 py-2.5">
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-0.5">{label}</p>
            <p className="text-[12px] font-medium text-neutral-800 truncate">{value}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Signatures</p>
        <div className="space-y-0">
          {signatories.map((s) => (
            <div key={s.role} className="flex items-center gap-3 py-2 border-b border-neutral-100 last:border-b-0">
              <div className={cn("w-4 h-4 rounded-full flex items-center justify-center shrink-0", s.signed ? "bg-emerald-500" : "bg-neutral-200")}>
                {s.signed && (
                  <svg className="w-2 h-2 text-white" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className={cn("text-[11px] font-medium flex-1", s.signed ? "text-neutral-700" : "text-neutral-400")}>{s.role}</span>
              {s.signed && s.signedAt && (
                <span className="text-[10px] text-neutral-400">{fmtDate(s.signedAt)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// RIGHT PANEL
// ════════════════════════════════════════════════════════════════════════════════
function RightPanel({ offer, profileSignature, isSubmitting, onView, onAccept, onRequestChanges, onSignInstance, onAllSigned }) {
  if (!offer) {
    return (
      <div className="flex-1 bg-white rounded-xl border border-neutral-200 flex flex-col items-center justify-center gap-3 min-h-[500px]">
        <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center">
          <FileText className="w-5 h-5 text-neutral-300" />
        </div>
        <p className="text-[13px] font-medium text-neutral-500">Select an offer to view details</p>
        <p className="text-[11px] text-neutral-400">Choose from the list on the left</p>
      </div>
    );
  }

  const stage    = getStageForOffer(offer);
  const name     = offer.recipient?.fullName || "Offer";
  const jobTitle = offer.createOwnJobTitle && offer.newJobTitle ? offer.newJobTitle : offer.jobTitle || "";
  const needsAction = offer.status === "SENT_TO_CREW" || offer.status === CREW_CAN_SIGN_STATUS;

  return (
    <div className="flex-1 bg-white rounded-xl border border-neutral-200 flex flex-col overflow-hidden min-h-[500px]">
      <div className="px-5 py-4 border-b border-neutral-100 flex items-start justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-[15px] font-semibold text-neutral-900 truncate">{name}</h2>
            <OfferStatusBadge status={offer.status} />
            {offer.offerCode && (
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                {offer.offerCode}
              </span>
            )}
            {needsAction && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 animate-pulse uppercase tracking-wide">
                Action Required
              </span>
            )}
          </div>
          <p className="text-[12px] text-neutral-500 mt-0.5">
            {jobTitle}{offer.department ? ` · ${deptLabel(offer.department)}` : ""}
          </p>
        </div>
        <button className="text-neutral-400 hover:text-neutral-600 transition-colors shrink-0" onClick={() => onView(offer._id)}>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {stage === "offer_review" && (
          <OfferReviewPanel
            offer={offer}
            isSubmitting={isSubmitting}
            onAccept={() => onAccept(offer._id)}
            onRequestChanges={(reason) => onRequestChanges(offer._id, reason)}
          />
        )}
        {stage === "contract_sign" && offer.status === "PENDING_CREW_SIGNATURE" && (
          <div className="p-5">
            <ContractSignPanel
              offer={offer}
              profileSignature={profileSignature}
              isSubmitting={isSubmitting}
              onSignInstance={onSignInstance}
              onAllSigned={onAllSigned}
            />
          </div>
        )}
        {(stage === "contract_active" || stage === "contract_ended") && (
          <ContractActivePanel offer={offer} />
        )}
      </div>

      <div className="border-t border-neutral-100 px-4 py-2.5 flex justify-end shrink-0">
        <Button size="sm" variant="ghost" className="gap-1.5 h-7 text-[11px] text-neutral-400 hover:text-neutral-600" onClick={() => onView(offer._id)}>
          Full view <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN — MyOffer
// ════════════════════════════════════════════════════════════════════════════════
export default function MyOffer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params   = useParams();

  const selectedProject = useSelector(
    (s) => s.projects?.selectedProject ?? s.project?.current ?? null
  );

  const resolvedProjectId = useMemo(() => {
    if (isObjectId(params.projectId))        return params.projectId;
    if (isObjectId(params.id))               return params.id;
    if (isObjectId(selectedProject?._id))    return String(selectedProject._id);
    console.warn("[MyOffer] Using fallback projectId");
    return FALLBACK_PROJECT_ID;
  }, [params.projectId, params.id, selectedProject]);

  const projectSlug = params.projectName ?? params.projectId ?? "demo-project";

  const allOffers    = useSelector(selectProjectOffers);
  const isLoading    = useSelector(selectListLoading);
  const listError    = useSelector(selectListError);
  const isSubmitting = useSelector(selectIsSubmitting);
  const profileSignature = useSelector(selectProfileSignatureUrl);

  const [activeStage,   setActiveStage]   = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const advancingRef = useRef(false);

  const fetchOffers = useCallback(() => {
    dispatch(getProjectOffersThunk({ projectId: resolvedProjectId }));
  }, [dispatch, resolvedProjectId]);

  useEffect(() => {
    fetchOffers();
    dispatch(fetchCurrentSignatureThunk());
  }, [dispatch, fetchOffers]);

  // Keep selectedOffer in sync with Redux store
  useEffect(() => {
    if (!selectedOffer) return;
    const fresh = allOffers.find((o) => o._id === selectedOffer._id);
    if (fresh) setSelectedOffer(fresh);
  }, [allOffers]);

  // Clear selection if offer no longer belongs to active stage
  useEffect(() => {
    if (!selectedOffer || !activeStage) return;
    if (getStageForOffer(selectedOffer) !== activeStage) setSelectedOffer(null);
  }, [activeStage]);

  const stageCounts   = useMemo(() => countByStage(allOffers),               [allOffers]);
  const displayOffers = useMemo(() => filterByStage(allOffers, activeStage), [allOffers, activeStage]);

  const handleStageClick  = (key) => { setActiveStage((prev) => prev === key ? null : key); setSelectedOffer(null); };
  const handleSelectOffer = (offer) => setSelectedOffer(offer);
  const handleView        = (offerId) => navigate(`/projects/${projectSlug}/offers/${offerId}/view`);

  const handleAccept = useCallback(async (offerId) => {
    toast.loading("Accepting offer…", { id: "accept" });
    const result = await dispatch(crewAcceptThunk(offerId));
    toast.dismiss("accept");
    if (result.error) { toast.error(result.payload?.message || "Failed to accept"); return; }
    toast.success("Offer accepted! Contracts will be ready shortly.");
    fetchOffers();
    const fresh = await dispatch(getOfferThunk(offerId));
    if (fresh.payload) setSelectedOffer(fresh.payload);
  }, [dispatch, fetchOffers]);

  const handleRequestChanges = useCallback(async (offerId, reason) => {
    toast.loading("Sending request…", { id: "req" });
    const result = await dispatch(crewRequestChangesThunk({ offerId, reason }));
    toast.dismiss("req");
    if (result.error) { toast.error(result.payload?.message || "Failed"); return; }
    toast.success("Change request sent!");
    fetchOffers();
  }, [dispatch, fetchOffers]);

  const handleSignInstance = useCallback(async (instanceId, meta = {}) => {
    const signatureImage = meta.signatureUrl ?? profileSignature ?? undefined;
    const result = await dispatch(signContractInstanceThunk({ instanceId, signatureImage }));
    if (result.error) {
      const msg = result.payload?.message || "Failed to sign";
      toast.error(msg);
      throw new Error(msg);
    }
    setTimeout(async () => {
      if (selectedOffer?._id) {
        const fresh = await dispatch(getOfferThunk(selectedOffer._id));
        if (fresh.payload) setSelectedOffer(fresh.payload);
        dispatch(getContractInstancesThunk(selectedOffer._id));
      }
    }, 2500);
  }, [dispatch, selectedOffer?._id, profileSignature]);

  const handleAllSigned = useCallback(async (role) => {
    const oid = selectedOffer?._id;
    if (!oid || advancingRef.current) return;
    advancingRef.current = true;

    const advanceFn = ADVANCE_THUNK[role?.toUpperCase()];
    if (!advanceFn) { advancingRef.current = false; return; }

    try {
      toast.loading("Submitting signatures…", { id: "adv" });
      const result = await advanceFn(oid, dispatch);
      toast.dismiss("adv");
      if (result.error) {
        toast.error(result.payload?.message || "Could not advance stage");
        advancingRef.current = false;
        return;
      }
      const fresh    = await dispatch(getOfferThunk(oid));
      const newOffer = fresh.payload;
      toast.success(
        newOffer?.status === "COMPLETED"
          ? "🎉 Contract fully executed!"
          : "Signatures submitted — waiting for approvals"
      );
      if (newOffer) setSelectedOffer(newOffer);
      dispatch(clearInstances());
      dispatch(getContractInstancesThunk(oid));
      fetchOffers();
    } catch {
      toast.dismiss("adv");
      toast.error("Something went wrong — please refresh");
    } finally {
      setTimeout(() => { advancingRef.current = false; }, 5000);
    }
  }, [dispatch, selectedOffer?._id, fetchOffers]);

  // ── Loading / error ───────────────────────────────────────────────────────
  if (isLoading && !allOffers.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-7 h-7 animate-spin text-[#534AB7] mx-auto" />
          <p className="text-sm text-neutral-500">Loading your offers…</p>
        </div>
      </div>
    );
  }

  if (listError && !allOffers.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertTriangle className="w-7 h-7 text-red-400 mx-auto" />
          <p className="text-sm font-medium text-red-600">{listError.message || "Failed to load offers"}</p>
          <Button size="sm" variant="outline" onClick={fetchOffers} className="gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  // ── Derive timeline props from selected offer ─────────────────────────────
  const tl = selectedOffer?.timeline || {};

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 py-2">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">My Offers</h1>
         
        </div>
        <Button size="sm" variant="outline" onClick={fetchOffers} className="h-8 w-8 p-0" title="Refresh">
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* ── Stage cards — image-1 style: icon top-center, label, BIG count ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {OFFER_STAGES.map((stage) => (
          <StageCard
            key={stage.key}
            stage={stage}
            count={stageCounts[stage.key] ?? 0}
            isSelected={activeStage === stage.key}
            onClick={() => handleStageClick(stage.key)}
          />
        ))}
      </div>

      {/* ── OfferStatusProgress — exact same component used in ViewOffer ── */}
      {selectedOffer && (
        <OfferStatusProgress
          status={selectedOffer.status}
          sentToCrewAt={tl.sentToCrewAt}
          updatedAt={selectedOffer.updatedAt}
          crewAcceptedAt={tl.crewAcceptedAt}
          productionCheckCompletedAt={tl.productionCheckCompletedAt}
          accountsCheckCompletedAt={tl.accountsCheckCompletedAt}
          crewSignedAt={tl.crewSignedAt}
          upmSignedAt={tl.upmSignedAt}
          fcSignedAt={tl.fcSignedAt}
          studioSignedAt={tl.studioSignedAt}
        />
      )}

      {/* ── Main split view ── */}
      <div className="flex gap-3 items-start min-h-[560px]">

        {/* Left — offer list (image-3 style) */}
        <div className="w-[300px] shrink-0 bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-gray-50">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              {activeStage
                ? (OFFER_STAGES.find((s) => s.key === activeStage)?.label ?? "Offers")
                : "All Offers"}
            </span>
            <span className="text-[11px] font-medium text-neutral-500 bg-white px-2 py-0.5 rounded-full">
              {displayOffers.length} total
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {displayOffers.length === 0 ? (
  <div className="px-4 py-12 text-center">
    <p className="text-[12px] text-neutral-400">
      {activeStage ? "No offers in this stage" : "No offers found"}
    </p>
  </div>
) : (
  displayOffers.map((offer, idx) => (
    <OfferListItem
      key={offer._id}
      offer={offer}
      index={idx}
      isSelected={selectedOffer?._id === offer._id}
      onClick={() => handleSelectOffer(offer)}
    />
  ))
)}
          </div>
        </div>

        {/* Right — adaptive detail panel */}
        <RightPanel
          offer={selectedOffer}
          profileSignature={profileSignature}
          isSubmitting={isSubmitting}
          onView={handleView}
          onAccept={handleAccept}
          onRequestChanges={handleRequestChanges}
          onSignInstance={handleSignInstance}
          onAllSigned={handleAllSigned}
        />
      </div>
    </div>
  );
}