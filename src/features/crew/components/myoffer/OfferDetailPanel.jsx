/**
 * OfferDetailPanel.jsx
 *
 * Right-side panel on the MyOffer page.
 * Shows offer overview, contract documents, signature status, and status tracker
 * in a tabbed layout when an offer is selected from the left list.
 *
 * Props:
 *   offer          — current offer object (null = empty state)
 *   onView         — (offerId) => void   — navigate to ViewOffer
 *   projectName    — string for routing
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, PenLine, CheckCircle2, Clock, ArrowRight,
  Download, RefreshCw, Eye, AlertTriangle,
} from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { OfferStatusBadge } from "../onboarding/OfferStatusBadge";
import { cn } from "../../../../shared/config/utils";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

const engLabel = (val = "") => {
  const map = { loan_out: "Loan Out", paye: "PAYE", schd: "SCHD", long_form: "Long Form" };
  return map[val] || val.replace(/_/g, " ").toUpperCase();
};

// ── Tabs config ───────────────────────────────────────────────────────────────

const TABS = [
  { key: "overview",   label: "Overview"            },
  { key: "documents",  label: "Contract Documents"  },
  { key: "signatures", label: "Signatures"          },
  { key: "status",     label: "Status Tracker"      },
];

// ── Status progress steps ─────────────────────────────────────────────────────

const STATUS_STEPS = [
  { label: "Offer Sent",          statuses: ["SENT_TO_CREW"] },
  { label: "Offer Accepted",      statuses: ["CREW_ACCEPTED", "PRODUCTION_CHECK", "ACCOUNTS_CHECK"] },
  { label: "Pending Signatures",  statuses: ["PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE", "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE"] },
  { label: "Active Contract",     statuses: ["COMPLETED"] },
];

function stepIndexForStatus(status) {
  for (let i = STATUS_STEPS.length - 1; i >= 0; i--) {
    if (STATUS_STEPS[i].statuses.includes(status)) return i;
  }
  return -1;
}

// ── Signature row ─────────────────────────────────────────────────────────────

function SigRow({ role, signed, signedAt }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-neutral-100 last:border-b-0">
      <div
        className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
          signed
            ? "bg-emerald-500"
            : "bg-white border-2 border-neutral-200"
        )}
      >
        {signed && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="text-[12px] font-medium text-neutral-700 flex-1">{role}</span>
      {signed && signedAt && (
        <span className="text-[10px] text-neutral-400">{fmtDate(signedAt)}</span>
      )}
      <span
        className={cn(
          "text-[10px] font-semibold uppercase tracking-wide",
          signed ? "text-emerald-600" : "text-neutral-400"
        )}
      >
        {signed ? "Signed" : "Pending"}
      </span>
    </div>
  );
}

// ── Tab: Overview ─────────────────────────────────────────────────────────────

function TabOverview({ offer }) {
  const items = [
    { label: "Recipient",   value: offer.recipient?.fullName || "—" },
    { label: "Department",  value: offer.department ? deptLabel(offer.department) : "—" },
    { label: "Job Title",
      value: offer.createOwnJobTitle && offer.newJobTitle ? offer.newJobTitle : offer.jobTitle || "—" },
    { label: "Rate",
      value: offer.feePerDay
        ? `${fmtMoney(offer.feePerDay, offer.currency || "GBP")} / ${offer.dailyOrWeekly || "day"}`
        : "—" },
    { label: "Engagement",  value: offer.engagementType ? engLabel(offer.engagementType) : "—" },
    { label: "Start Date",  value: fmtDate(offer.startDate) },
    { label: "End Date",    value: fmtDate(offer.endDate)   },
    { label: "Working Week",value: offer.workingWeek ? `${offer.workingWeek} days` : "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="bg-neutral-50 rounded-lg px-3 py-2.5"
        >
          <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-0.5">{label}</p>
          <p className="text-[12px] font-medium text-neutral-800 truncate">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Documents ────────────────────────────────────────────────────────────

function TabDocuments({ offer }) {
  // In a real app, fetch contractInstances from Redux.
  // Here we show a placeholder list based on what we know.
  const hasDocs = !!(offer.contractId);

  if (!hasDocs) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
        <FileText className="w-6 h-6 text-neutral-300" />
        <p className="text-[12px] text-neutral-500">
          Contract documents will appear here once generated.
        </p>
        <p className="text-[11px] text-neutral-400">
          Documents are created after the crew accepts the offer.
        </p>
      </div>
    );
  }

  // Derive rough signing status from offer.status
  const signingStatuses = [
    "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE", "COMPLETED",
  ];
  const isInSigning = signingStatuses.includes(offer.status);

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-neutral-400 uppercase tracking-wide mb-3">
        Contract Documents
      </p>
      {/* Placeholder rows — replace with actual contractInstances from Redux */}
      {["Deal Memo", "Riders", "Policies", "Start Form"].map((name, i) => {
        const signed = offer.status === "COMPLETED" ||
          (isInSigning && offer.status !== "PENDING_CREW_SIGNATURE" && i < 2);
        return (
          <div
            key={name}
            className="flex items-center gap-3 px-3 py-2.5 border border-neutral-100 rounded-lg"
          >
            <div className="w-7 h-7 rounded-md bg-neutral-50 flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-neutral-700">{name}</p>
            </div>
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                signed
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              )}
            >
              {signed ? "Signed" : "Pending"}
            </span>
            <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Tab: Signatures ───────────────────────────────────────────────────────────

function TabSignatures({ offer }) {
  const tl = offer.timeline || {};
  const signatories = [
    { role: "Crew Member",          signed: !!tl.crewSignedAt,   signedAt: tl.crewSignedAt   },
    { role: "Unit Production Manager (UPM)", signed: !!tl.upmSignedAt,    signedAt: tl.upmSignedAt    },
    { role: "Financial Controller (FC)",     signed: !!tl.fcSignedAt,     signedAt: tl.fcSignedAt     },
    { role: "Production Executive",          signed: !!tl.studioSignedAt, signedAt: tl.studioSignedAt },
  ];

  const signedCount = signatories.filter((s) => s.signed).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] text-neutral-400 uppercase tracking-wide">
          Signature Status
        </p>
        <span className="text-[11px] text-neutral-500">
          {signedCount} / {signatories.length} signed
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-neutral-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: `${(signedCount / signatories.length) * 100}%` }}
        />
      </div>

      <div>
        {signatories.map((s) => (
          <SigRow key={s.role} {...s} />
        ))}
      </div>
    </div>
  );
}

// ── Tab: Status Tracker ───────────────────────────────────────────────────────

function TabStatus({ offer }) {
  const currentIdx = stepIndexForStatus(offer.status);
  const tl = offer.timeline || {};

  const stepTimestamps = [
    tl.sentToCrewAt,
    tl.crewAcceptedAt,
    tl.pendingCrewSignatureAt,
    tl.completedAt,
  ];

  return (
    <div className="space-y-0">
      {STATUS_STEPS.map((step, i) => {
        const done    = i < currentIdx;
        const current = i === currentIdx;
        const future  = i > currentIdx;

        return (
          <div key={step.label} className="flex gap-3">
            {/* Left: connector line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10",
                  done    ? "bg-emerald-500" : "",
                  current ? "bg-[#7F77DD]"  : "",
                  future  ? "bg-neutral-100 border border-neutral-200" : ""
                )}
              >
                {done && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {current && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-px flex-1 my-1",
                    done ? "bg-emerald-300" : "bg-neutral-150"
                  )}
                  style={{ minHeight: 20 }}
                />
              )}
            </div>

            {/* Right: label + timestamp */}
            <div className="pb-5 flex-1 min-w-0">
              <p
                className={cn(
                  "text-[12px] font-medium leading-none mb-0.5",
                  done    ? "text-emerald-700" : "",
                  current ? "text-[#534AB7]"  : "",
                  future  ? "text-neutral-400" : ""
                )}
              >
                {step.label}
              </p>
              {stepTimestamps[i] && (
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  {fmtDate(stepTimestamps[i])}
                </p>
              )}
              {current && (
                <span className="inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#EEEDFE] text-[#534AB7] uppercase tracking-wide">
                  Current
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── CTA bar ───────────────────────────────────────────────────────────────────

function CtaBar({ offer, onView }) {
  const isReview = ["SENT_TO_CREW", "NEEDS_REVISION"].includes(offer.status);
  const isSign   = [
    "PENDING_CREW_SIGNATURE", "PENDING_UPM_SIGNATURE",
    "PENDING_FC_SIGNATURE", "PENDING_STUDIO_SIGNATURE",
  ].includes(offer.status);

  return (
    <div className="px-4 py-3 border-t border-neutral-100 flex items-center gap-2 shrink-0">
      {isSign && (
        <Button
          size="sm"
          className="gap-1.5 bg-[#534AB7] hover:bg-[#3C3489] text-white text-[12px] h-8"
          onClick={() => onView(offer._id)}
        >
          <PenLine className="w-3.5 h-3.5" />
          Sign Contract
        </Button>
      )}
      {isReview && (
        <Button
          size="sm"
          className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[12px] h-8"
          onClick={() => onView(offer._id)}
        >
          <Eye className="w-3.5 h-3.5" />
          Review Offer
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        className="gap-1.5 text-[12px] h-8"
        onClick={() => onView(offer._id)}
      >
        <ArrowRight className="w-3.5 h-3.5" />
        View Full Offer
      </Button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function OfferDetailPanel({ offer, onView, projectName }) {
  const [tab, setTab] = useState("overview");

  // Empty state
  if (!offer) {
    return (
      <div className="flex-1 bg-white rounded-xl border border-neutral-200 flex flex-col items-center justify-center gap-3 min-h-[400px]">
        <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center">
          <FileText className="w-5 h-5 text-neutral-300" />
        </div>
        <p className="text-[13px] font-medium text-neutral-500">
          Select an offer to view details
        </p>
        <p className="text-[11px] text-neutral-400">
          Choose from the list on the left
        </p>
      </div>
    );
  }

  const name =
    offer.recipient?.fullName || offer.fullName || "Offer";
  const jobTitle =
    offer.createOwnJobTitle && offer.newJobTitle
      ? offer.newJobTitle
      : offer.jobTitle || "";

  return (
    <div className="flex-1 bg-white rounded-xl border border-neutral-200 flex flex-col overflow-hidden min-h-[400px]">
      {/* Header */}
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
          </div>
          <p className="text-[12px] text-neutral-500 mt-0.5">
            {jobTitle}
            {offer.department ? ` · ${deptLabel(offer.department)}` : ""}
          </p>
        </div>
        <button
          className="text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
          onClick={() => onView(offer._id)}
          title="Open full offer"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-100 px-4 shrink-0 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-3 py-2.5 text-[11px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
              tab === t.key
                ? "border-[#534AB7] text-[#534AB7]"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div className="flex-1 overflow-y-auto p-5">
        {tab === "overview"   && <TabOverview   offer={offer} />}
        {tab === "documents"  && <TabDocuments  offer={offer} />}
        {tab === "signatures" && <TabSignatures offer={offer} />}
        {tab === "status"     && <TabStatus     offer={offer} />}
      </div>

      {/* CTA bar */}
      <CtaBar offer={offer} onView={onView} />
    </div>
  );
}