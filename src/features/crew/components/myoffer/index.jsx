/**
 * panels/index.jsx
 *
 * CREW-ONLY perspective in MyOffer:
 *
 *   PENDING_CREW_SIGNATURE → signing interface (canSignRole=true)
 *
 * After crew signs the offer moves to PENDING_UPM/FC/STUDIO_SIGNATURE.
 * Those statuses return null from getStageForOffer so the offer is no longer
 * visible on MyOffer at all — UPM/FC/Studio signing is ViewOffer only.
 */

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  ThumbsUp, MessageSquare, X, CheckCircle2, PenLine, CheckCircle,
} from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { cn } from "../../../../shared/config/utils";

import ContractInstancesPanel from "../../pages/ContractInstancesPanel";
import { CreateOfferLayout } from "../roleActions/ProductionAdminActions/createoffer/CreateOfferLayout";

import { calculateRates, defaultEngineSettings } from "../../utils/rateCalculations";
import { defaultAllowances } from "../../utils/Defaultallowance";

// ── Shared formatters ─────────────────────────────────────────────────────────

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "—";

const fmtMoney = (n, currency = "GBP") => {
  const num = parseFloat(n);
  if (!num) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency", currency, minimumFractionDigits: 0,
  }).format(num);
};

const deptLabel = (val = "") =>
  val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ── Allowance helpers ─────────────────────────────────────────────────────────

const ALLOWANCE_KEY_MAP = {
  boxRental: "boxRental", computer: "computer", software: "software",
  equipment: "equipment", vehicle: "vehicle", mobile: "mobile",
  living: "living", perDiem1: "perDiem1", perDiem2: "perDiem2",
  breakfast: "breakfast", lunch: "lunch", dinner: "dinner",
  fuel: "fuel", mileage: "mileage",
  BOX_RENTAL: "boxRental", COMPUTER: "computer", SOFTWARE: "software",
  EQUIPMENT: "equipment", VEHICLE: "vehicle", MOBILE: "mobile",
  LIVING: "living", PER_DIEM: "perDiem1", PER_DIEM_1: "perDiem1",
  PER_DIEM_2: "perDiem2",
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
    if (!canonical) {
      result[a.key] = { ...a, key: a.key, enabled: !!a.enabled };
      return;
    }
    result[canonical] = { ...result[canonical], ...a, key: canonical, enabled: !!a.enabled };
  });
  return result;
}

function offerToContractData(offer) {
  if (!offer) return {};
  return {
    fullName:          offer.recipient?.fullName     || "",
    email:             offer.recipient?.email        || "",
    mobileNumber:      offer.recipient?.mobileNumber || "",
    isViaAgent:        offer.representation?.isViaAgent  || false,
    agentEmail:        offer.representation?.agentEmail  || "",
    unit:              offer.unit          || "",
    department:        offer.department    || "",
    subDepartment:     offer.subDepartment || "",
    jobTitle:          offer.jobTitle      || "",
    newJobTitle:       offer.newJobTitle   || "",
    createOwnJobTitle: offer.createOwnJobTitle || false,
    startDate:         offer.startDate     || "",
    endDate:           offer.endDate       || "",
    dailyOrWeekly:     offer.dailyOrWeekly || "daily",
    engagementType:    offer.engagementType || "paye",
    workingWeek:       offer.workingWeek   || "5",
    currency:          offer.currency      || "GBP",
    feePerDay:         offer.feePerDay     || "",
    overtime:          offer.overtime      || "calculated",
    notes: {
      otherDealProvisions: offer.notes?.otherDealProvisions || "",
      additionalNotes:     offer.notes?.additionalNotes     || "",
    },
    specialStipulations: Array.isArray(offer.specialStipulations)
      ? offer.specialStipulations
      : [],
  };
}

// ── Statuses where crew can respond ──────────────────────────────────────────
const CREW_CAN_ACCEPT_STATUSES  = ["SENT_TO_CREW"];
const CREW_CAN_DECLINE_STATUSES = ["SENT_TO_CREW", "NEEDS_REVISION"];

// ════════════════════════════════════════════════════════════════════════════════
// OfferReviewPanel
// ════════════════════════════════════════════════════════════════════════════════

export function OfferReviewPanel({ offer, isSubmitting, onAccept, onRequestChanges }) {
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

  const canAccept     = CREW_CAN_ACCEPT_STATUSES.includes(offer?.status);
  const canDecline    = CREW_CAN_DECLINE_STATUSES.includes(offer?.status);
  const showActionBar = canAccept || canDecline;

  const isAccepted = ["CREW_ACCEPTED", "PRODUCTION_CHECK", "ACCOUNTS_CHECK"].includes(offer?.status);

  const inProgressConfig = {
    CREW_ACCEPTED:    { label: "Offer accepted — sent to production", sub: "Production team is reviewing your deal details." },
    PRODUCTION_CHECK: { label: "Offer accepted — sent to production", sub: "Production team is reviewing your deal details." },
    ACCOUNTS_CHECK:   { label: "Offer accepted — sent to production", sub: "Finance team is verifying your deal. Almost there!" },
  }[offer?.status];

  const handleSendRequest = () => {
    if (!reason.trim()) { toast.error("Please provide a reason"); return; }
    onRequestChanges(reason);
    setShowReason(false);
    setReason("");
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {isAccepted && inProgressConfig && (
        <div className="mx-5 mt-4 mb-2 rounded-xl px-4 py-3 flex items-start gap-3 shrink-0 bg-emerald-50 border border-emerald-200">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-emerald-800">{inProgressConfig.label}</p>
            <p className="text-[11px] mt-0.5 text-emerald-600">{inProgressConfig.sub}</p>
          </div>
        </div>
      )}

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

      {showActionBar && (
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
              {canAccept && (
                <Button size="sm" className="gap-1.5 h-8 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onAccept} disabled={isSubmitting}>
                  <ThumbsUp className="w-3 h-3" /> Accept Offer
                </Button>
              )}
              {canDecline && (
                <Button size="sm" variant="outline" className="gap-1.5 h-8 text-[11px] border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => setShowReason(true)} disabled={isSubmitting}>
                  <MessageSquare className="w-3 h-3" /> Request Changes
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ContractSignPanel
// ════════════════════════════════════════════════════════════════════════════════

export function ContractSignPanel({
  offer,
  profileSignature,
  isSubmitting,
  onSignInstance,
  onAllSigned,
}) {
  const status = offer?.status;

  if (status !== "PENDING_CREW_SIGNATURE") return null;

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ background: "#faf9ff", border: "1px solid #ddd6fe" }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#ede9fe" }}>
          <PenLine className="w-4 h-4" style={{ color: "#7c3aed" }} />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold" style={{ color: "#7c3aed" }}>
            Please sign your contract
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "#a78bfa" }}>
            Signing as: CREW
          </p>
        </div>
      </div>

      {offer?._id && (
        <ContractInstancesPanel
          offerId={offer._id}
          offerStatus={offer.status}
          canSignRole={true}
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
// ContractActivePanel — simple banner style (Image 2)
// ════════════════════════════════════════════════════════════════════════════════

export function ContractActivePanel({ offer, onView }) {
  const jobTitle =
    offer.createOwnJobTitle && offer.newJobTitle
      ? offer.newJobTitle
      : offer.jobTitle || "—";

  const items = [
    { label: "Name",         value: offer.recipient?.fullName || "—" },
    { label: "Role",         value: jobTitle },
    { label: "Department",   value: offer.department ? deptLabel(offer.department) : "—" },
    { label: "Rate / day",   value: fmtMoney(offer.feePerDay, offer.currency || "GBP") },
    { label: "Engagement",   value: (offer.engagementType || "").toUpperCase() },
    { label: "Working week", value: offer.workingWeek ? `${offer.workingWeek} days` : "—" },
    { label: "Start",        value: fmtDate(offer.startDate) },
    { label: "End",          value: fmtDate(offer.endDate) },
  ];

  const tl = offer?.timeline || {};
  const totalDocs = offer?.contractInstanceCount ?? 4;

  const signatories = [
    { role: "You (Crew)",              roleKey: "crew",   signed: !!tl.crewSignedAt,   signedAt: tl.crewSignedAt,   docsLabel: `${totalDocs} / ${totalDocs}` },
    { role: "Production (UPM)",        roleKey: "upm",    signed: !!tl.upmSignedAt,    signedAt: tl.upmSignedAt,    docsLabel: `${totalDocs} / ${totalDocs}` },
    { role: "Finance (FC)",            roleKey: "fc",     signed: !!tl.fcSignedAt,     signedAt: tl.fcSignedAt,     docsLabel: `${totalDocs} / ${totalDocs}` },
    { role: "Final Approval (Studio)", roleKey: "studio", signed: !!tl.studioSignedAt, signedAt: tl.studioSignedAt, docsLabel: `${totalDocs} / ${totalDocs}` },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* ── Banner (Image 2 style) ── */}
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-emerald-800">Contract Active</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">
            All signatures collected — your contract is live.
          </p>
        </div>
        <button
          onClick={() => onView?.(offer._id)}
          className="shrink-0 rounded-[9px] bg-white border border-emerald-200 px-3 py-1.5 text-[12px] font-medium text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          View
        </button>
      </div>

      {/* ── Detail card ── */}
      <div className="overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
        <div className="grid grid-cols-2 divide-x divide-y divide-neutral-100">
          {items.map(({ label, value }) => (
            <div key={label} className="px-[14px] py-[10px]">
              <p className="mb-[3px] text-[9px] font-semibold uppercase tracking-[0.07em] text-neutral-400">{label}</p>
              <p className="text-[13px] font-medium text-neutral-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Docs summary row ── */}
      <div className="flex items-center gap-[10px] rounded-xl border border-neutral-100 bg-neutral-50 px-[14px] py-[11px]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#EEEDFE]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="1.5" width="10" height="13" rx="2" stroke="#534AB7" strokeWidth="1.2"/>
            <path d="M5.5 5h5M5.5 7.5h5M5.5 10h3" stroke="#534AB7" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="text-[12px] font-medium text-neutral-900">Contract Documents</p>
          <p className="mt-[1px] text-[10px] text-neutral-500">All documents signed by all parties</p>
        </div>
        <span className="ml-auto rounded-full bg-[#EAF3DE] px-[10px] py-[4px] text-[10px] font-semibold text-[#27500A] whitespace-nowrap">
          {totalDocs} / {totalDocs} signed
        </span>
      </div>

      {/* ── Signature cards ── */}
      <div>
        <p className="mb-[10px] text-[9px] font-semibold uppercase tracking-[0.08em] text-neutral-400">Signatures</p>
        <div className="flex flex-col gap-[6px]">
          {signatories.map((s) => (
            <div
              key={s.roleKey}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all",
                s.signed
                  ? "bg-emerald-50 border border-emerald-100"
                  : "bg-neutral-50 border border-dashed border-neutral-200"
              )}
            >
              {/* Status dot */}
              <div className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                s.signed ? "bg-emerald-200" : "border border-neutral-200 bg-white"
              )}>
                {s.signed ? (
                  <svg className="w-2.5 h-2.5 text-emerald-700" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                )}
              </div>

              {/* Role */}
              <p className={cn("flex-1 text-[12px] font-medium", s.signed ? "text-emerald-800" : "text-neutral-400")}>
                {s.role}
              </p>

              {/* Date + doc count */}
              {s.signed ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-emerald-600">{fmtDate(s.signedAt)}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {totalDocs}/{totalDocs}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-neutral-400 italic">Awaiting</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// ContractEndedPanel
// ════════════════════════════════════════════════════════════════════════════════

export function ContractEndedPanel({ offer, onView }) {
  const jobTitle =
    offer.createOwnJobTitle && offer.newJobTitle
      ? offer.newJobTitle
      : offer.jobTitle || "—";

  const items = [
    { label: "Name",         value: offer.recipient?.fullName || "—" },
    { label: "Role",         value: jobTitle },
    { label: "Department",   value: offer.department ? deptLabel(offer.department) : "—" },
    { label: "Rate / day",   value: fmtMoney(offer.feePerDay, offer.currency || "GBP") },
    { label: "Engagement",   value: (offer.engagementType || "").toUpperCase() },
    { label: "Working week", value: offer.workingWeek ? `${offer.workingWeek} days` : "—" },
    { label: "Start",        value: fmtDate(offer.startDate) },
    { label: "End",          value: fmtDate(offer.endDate) },
  ];

  const tl = offer?.timeline || {};
  const totalDocs = offer?.contractInstanceCount ?? 4;

  const signatories = [
    { role: "You (Crew)",              roleKey: "crew",   signed: !!tl.crewSignedAt,   signedAt: tl.crewSignedAt   },
    { role: "Production (UPM)",        roleKey: "upm",    signed: !!tl.upmSignedAt,    signedAt: tl.upmSignedAt    },
    { role: "Finance (FC)",            roleKey: "fc",     signed: !!tl.fcSignedAt,     signedAt: tl.fcSignedAt     },
    { role: "Final Approval (Studio)", roleKey: "studio", signed: !!tl.studioSignedAt, signedAt: tl.studioSignedAt },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* ── Banner ── */}
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
          <CheckCircle className="w-4 h-4 text-red-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-red-700">Contract Ended</p>
          <p className="text-[11px] text-red-400 mt-0.5">Engagement concluded — archived.</p>
        </div>
        <button
          onClick={() => onView?.(offer._id)}
          className="shrink-0 rounded-[9px] bg-white border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          View
        </button>
      </div>

      {/* ── Detail card ── */}
      <div className="overflow-hidden rounded-xl border border-red-100 bg-red-50/40">
        <div className="grid grid-cols-2 divide-x divide-y divide-red-100">
          {items.map(({ label, value }) => (
            <div key={label} className="px-[14px] py-[10px]">
              <p className="mb-[3px] text-[9px] font-semibold uppercase tracking-[0.07em] text-red-300">{label}</p>
              <p className="text-[13px] font-medium text-neutral-700">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Docs summary ── */}
      <div className="flex items-center gap-[10px] rounded-xl border border-red-100 bg-red-50/40 px-[14px] py-[11px]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-red-100">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="1.5" width="10" height="13" rx="2" stroke="#ef4444" strokeWidth="1.2"/>
            <path d="M5.5 5h5M5.5 7.5h5M5.5 10h3" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="text-[12px] font-medium text-neutral-700">Contract Documents</p>
          <p className="mt-[1px] text-[10px] text-red-400">All documents signed by all parties</p>
        </div>
        <span className="ml-auto rounded-full bg-red-100 px-[10px] py-[4px] text-[10px] font-semibold text-red-600 whitespace-nowrap">
          {totalDocs} / {totalDocs} signed
        </span>
      </div>

      {/* ── Signature cards ── */}
      <div>
        <p className="mb-[10px] text-[9px] font-semibold uppercase tracking-[0.08em] text-red-300">Signatures</p>
        <div className="flex flex-col gap-[6px]">
          {signatories.map((s) => (
            <div
              key={s.roleKey}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all",
                s.signed
                  ? "bg-red-50 border border-red-100"
                  : "bg-neutral-50 border border-dashed border-neutral-200"
              )}
            >
              {/* Status dot */}
              <div className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                s.signed ? "bg-red-200" : "border border-neutral-200 bg-white"
              )}>
                {s.signed ? (
                  <svg className="w-2.5 h-2.5 text-red-600" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                )}
              </div>

              {/* Role */}
              <p className={cn("flex-1 text-[12px] font-medium", s.signed ? "text-red-800" : "text-neutral-400")}>
                {s.role}
              </p>

              {/* Date + doc count */}
              {s.signed ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-red-400">{fmtDate(s.signedAt)}</span>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                    {totalDocs}/{totalDocs}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-neutral-400 italic">Awaiting</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}