// OnboardingDashboard.jsx — role-based offer workflow UI
// Drop this at: src/features/offers/pages/OnboardingDashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setViewRole, selectViewRole } from "../../../features/crew/store/viewrole.slice";

// ─── Mock data for demo ───────────────────────────────────────────────────────

const MOCK_OFFERS = [
  {
    _id: "offer_001",
    offerCode: "OFR-001",
    recipient: { fullName: "JAMES HOLLOWAY", email: "james@crew.com" },
    status: "SENT_TO_CREW",
    roles: [{ isPrimary: true, engagementType: "PAYE", rateType: "DAILY",
      salary: { base: { amount: 850, currency: "GBP" } },
      jobRoleId: { name: "Director of Photography" },
      jobDepartmentId: { name: "CAMERA" },
      startDate: "2025-03-01", endDate: "2025-06-30" }],
    timeline: { sentToCrewAt: "2025-02-20T10:00:00Z" },
    createdAt: "2025-02-19T09:00:00Z",
  },
  {
    _id: "offer_002",
    offerCode: "OFR-002",
    recipient: { fullName: "SARAH CHEN", email: "sarah@crew.com" },
    status: "CREW_ACCEPTED",
    roles: [{ isPrimary: true, engagementType: "LOAN_OUT", rateType: "WEEKLY",
      salary: { base: { amount: 4200, currency: "GBP" } },
      jobRoleId: { name: "Production Designer" },
      jobDepartmentId: { name: "ART" },
      startDate: "2025-03-15", endDate: "2025-07-15" }],
    timeline: { sentToCrewAt: "2025-02-18T10:00:00Z", crewAcceptedAt: "2025-02-21T14:00:00Z" },
    createdAt: "2025-02-17T09:00:00Z",
  },
  {
    _id: "offer_003",
    offerCode: "OFR-003",
    recipient: { fullName: "MARCUS REID", email: "marcus@crew.com" },
    status: "NEEDS_REVISION",
    roles: [{ isPrimary: true, engagementType: "PAYE", rateType: "DAILY",
      salary: { base: { amount: 650, currency: "GBP" } },
      jobRoleId: { name: "Sound Mixer" },
      jobDepartmentId: { name: "SOUND" },
      startDate: "2025-04-01", endDate: "2025-06-30" }],
    timeline: { sentToCrewAt: "2025-02-15T10:00:00Z" },
    createdAt: "2025-02-14T09:00:00Z",
  },
  {
    _id: "offer_004",
    offerCode: "OFR-004",
    recipient: { fullName: "NINA PATEL", email: "nina@crew.com" },
    status: "PENDING_UPM_SIGNATURE",
    roles: [{ isPrimary: true, engagementType: "PAYE", rateType: "WEEKLY",
      salary: { base: { amount: 3800, currency: "GBP" } },
      jobRoleId: { name: "1st Assistant Director" },
      jobDepartmentId: { name: "ASSISTANT DIRECTORS" },
      startDate: "2025-03-01", endDate: "2025-07-31" }],
    timeline: {
      sentToCrewAt: "2025-02-10T10:00:00Z",
      crewAcceptedAt: "2025-02-12T11:00:00Z",
      productionCheckCompletedAt: "2025-02-14T15:00:00Z",
      accountsCheckCompletedAt: "2025-02-16T10:00:00Z",
      pendingCrewSignatureAt: "2025-02-18T09:00:00Z",
      crewSignedAt: "2025-02-19T14:00:00Z",
    },
    createdAt: "2025-02-08T09:00:00Z",
  },
  {
    _id: "offer_005",
    offerCode: "OFR-005",
    recipient: { fullName: "LEON WALSH", email: "leon@crew.com" },
    status: "COMPLETED",
    roles: [{ isPrimary: true, engagementType: "PAYE", rateType: "DAILY",
      salary: { base: { amount: 750, currency: "GBP" } },
      jobRoleId: { name: "Gaffer" },
      jobDepartmentId: { name: "ELECTRICAL" },
      startDate: "2025-02-01", endDate: "2025-05-31" }],
    timeline: {
      sentToCrewAt: "2025-01-15T10:00:00Z",
      crewAcceptedAt: "2025-01-17T14:00:00Z",
      completedAt: "2025-01-28T16:00:00Z",
    },
    createdAt: "2025-01-14T09:00:00Z",
  },
  {
    _id: "offer_006",
    offerCode: "OFR-006",
    recipient: { fullName: "JAMES HOLLOWAY", email: "james@crew.com" },
    status: "DRAFT",
    roles: [{ isPrimary: true, engagementType: "PAYE", rateType: "DAILY",
      salary: { base: { amount: 850, currency: "GBP" } },
      jobRoleId: { name: "Director of Photography" },
      jobDepartmentId: { name: "CAMERA" },
      startDate: "2025-03-01", endDate: "2025-06-30" }],
    timeline: {},
    createdAt: "2025-02-24T09:00:00Z",
  },
];

const MY_OFFER = MOCK_OFFERS[0]; // crew sees their own offer

// ─── Constants ────────────────────────────────────────────────────────────────

const WORKFLOW_STEPS = [
  { key: "DRAFT", label: "Draft", short: "Draft" },
  { key: "SENT_TO_CREW", label: "Sent to Crew", short: "Sent" },
  { key: "NEEDS_REVISION", label: "Revision Requested", short: "Revision", branch: true },
  { key: "CREW_ACCEPTED", label: "Crew Accepted", short: "Accepted" },
  { key: "PRODUCTION_CHECK", label: "Production Check", short: "Prod." },
  { key: "ACCOUNTS_CHECK", label: "Accounts Check", short: "Accts." },
  { key: "PENDING_CREW_SIGNATURE", label: "Crew Signing", short: "Crew Sig." },
  { key: "PENDING_UPM_SIGNATURE", label: "UPM Signing", short: "UPM Sig." },
  { key: "PENDING_FC_SIGNATURE", label: "FC Signing", short: "FC Sig." },
  { key: "PENDING_STUDIO_SIGNATURE", label: "Studio Signing", short: "Studio Sig." },
  { key: "COMPLETED", label: "Completed", short: "Done" },
];

const STATUS_ORDER = WORKFLOW_STEPS.map((s) => s.key);

const STATUS_COLORS = {
  DRAFT: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  SENT_TO_CREW: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  NEEDS_REVISION: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  CREW_ACCEPTED: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  PRODUCTION_CHECK: { bg: "bg-violet-100", text: "text-violet-700", dot: "bg-violet-500" },
  ACCOUNTS_CHECK: { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
  PENDING_CREW_SIGNATURE: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  PENDING_UPM_SIGNATURE: { bg: "bg-pink-100", text: "text-pink-700", dot: "bg-pink-500" },
  PENDING_FC_SIGNATURE: { bg: "bg-rose-100", text: "text-rose-700", dot: "bg-rose-500" },
  PENDING_STUDIO_SIGNATURE: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  COMPLETED: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
};

const ROLES_CONFIG = [
  { key: "PRODUCTION_ADMIN", label: "Production Admin", color: "#6366f1" },
  { key: "CREW", label: "Crew Member", color: "#0ea5e9" },
  { key: "UPM", label: "UPM", color: "#10b981" },
  { key: "FC", label: "Financial Controller", color: "#f59e0b" },
  { key: "STUDIO", label: "Studio", color: "#8b5cf6" },
  { key: "ACCOUNTS_ADMIN", label: "Accounts Admin", color: "#ef4444" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getPrimaryRole = (offer) => offer.roles?.find((r) => r.isPrimary) || offer.roles?.[0];

const getStatusStep = (status) => STATUS_ORDER.indexOf(status);

const fmt = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const StatusBadge = ({ status }) => {
  const c = STATUS_COLORS[status] || STATUS_COLORS.DRAFT;
  const label = WORKFLOW_STEPS.find((s) => s.key === status)?.label || status;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {label}
    </span>
  );
};

// ─── Role Switcher (Demo Navbar element) ──────────────────────────────────────

const ViewAsRoleSwitcher = ({ currentRole, onRoleChange }) => {
  const [open, setOpen] = useState(false);
  const config = ROLES_CONFIG.find((r) => r.key === currentRole) || ROLES_CONFIG[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-sm font-semibold transition-all hover:shadow-md"
        style={{ borderColor: config.color, color: config.color }}
      >
        <span className="w-2 h-2 rounded-full" style={{ background: config.color }} />
        View as: {config.label}
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
          <div className="px-3 py-2 border-b bg-slate-50">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Demo Role Switcher</p>
          </div>
          {ROLES_CONFIG.map((r) => (
            <button
              key={r.key}
              onClick={() => { onRoleChange(r.key); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-slate-50 transition-colors ${currentRole === r.key ? "bg-slate-100 font-semibold" : ""}`}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: r.color }} />
              {r.label}
              {currentRole === r.key && (
                <svg className="w-4 h-4 ml-auto text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Workflow Timeline ─────────────────────────────────────────────────────────

const WorkflowTimeline = ({ status, timeline = {} }) => {
  const currentStep = getStatusStep(status);
  const isNeedsRevision = status === "NEEDS_REVISION";
  const isCancelled = status === "CANCELLED";

  const mainSteps = WORKFLOW_STEPS.filter((s) => s.key !== "NEEDS_REVISION");

  const timelineMap = {
    SENT_TO_CREW: timeline.sentToCrewAt,
    CREW_ACCEPTED: timeline.crewAcceptedAt,
    PRODUCTION_CHECK: timeline.productionCheckCompletedAt,
    ACCOUNTS_CHECK: timeline.accountsCheckCompletedAt,
    PENDING_CREW_SIGNATURE: timeline.pendingCrewSignatureAt,
    PENDING_UPM_SIGNATURE: timeline.crewSignedAt,
    PENDING_FC_SIGNATURE: timeline.upmSignedAt,
    PENDING_STUDIO_SIGNATURE: timeline.fcSignedAt,
    COMPLETED: timeline.completedAt,
  };

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex items-center min-w-max px-4">
        {mainSteps.map((step, i) => {
          const stepIndex = getStatusStep(step.key);
          const isDone = currentStep > stepIndex;
          const isCurrent = step.key === status;
          const ts = timelineMap[step.key];

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                  ${isCancelled ? "bg-red-50 border-red-200 text-red-400" :
                    isDone ? "bg-emerald-500 border-emerald-500 text-white" :
                    isCurrent ? "bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100" :
                    "bg-white border-slate-200 text-slate-400"}
                `}>
                  {isDone ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <div className="mt-1.5 text-center">
                  <p className={`text-[10px] font-semibold whitespace-nowrap ${
                    isCurrent ? "text-indigo-700" :
                    isDone ? "text-emerald-600" : "text-slate-400"
                  }`}>
                    {step.short}
                  </p>
                  {ts && (
                    <p className="text-[9px] text-slate-400 whitespace-nowrap">{fmt(ts)}</p>
                  )}
                </div>
              </div>
              {i < mainSteps.length - 1 && (
                <div className={`w-10 h-0.5 mx-1 flex-shrink-0 ${
                  isCancelled ? "bg-red-200" :
                  currentStep > stepIndex ? "bg-emerald-400" : "bg-slate-200"
                }`} />
              )}
            </div>
          );
        })}
      </div>
      {isNeedsRevision && (
        <div className="mt-3 mx-4 flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
          <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs font-semibold text-amber-700">Crew has requested revisions — offer is paused pending update</p>
        </div>
      )}
    </div>
  );
};

// ─── Offer Card ────────────────────────────────────────────────────────────────

const OfferCard = ({ offer, viewRole, onClick }) => {
  const role = getPrimaryRole(offer);
  const deptName = role?.jobDepartmentId?.name || "—";
  const roleName = role?.jobRoleId?.name || "Untitled Role";
  const rate = role?.salary?.base;

  return (
    <div
      onClick={() => onClick(offer)}
      className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center flex-shrink-0 text-lg font-bold text-indigo-600">
              {offer.recipient.fullName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">{offer.recipient.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{offer.recipient.email}</p>
            </div>
          </div>
          <StatusBadge status={offer.status} />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded uppercase tracking-wider">
            {deptName}
          </span>
          <span className="text-xs text-slate-700 font-medium truncate">{roleName}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {rate ? `£${rate.amount.toLocaleString()} / ${rate.unit || "DAY"}` : "Rate TBC"}
          </span>
          <span className="text-[10px] font-mono text-slate-400">{offer.offerCode}</span>
        </div>

        {role?.startDate && (
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>{fmt(role.startDate)} – {fmt(role.endDate) || "TBC"}</span>
            <span>{role.engagementType}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Offer Detail Modal ────────────────────────────────────────────────────────

const OfferDetailModal = ({ offer, viewRole, onClose, onAction }) => {
  const [changeReqOpen, setChangeReqOpen] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const [changeField, setChangeField] = useState("");
  const [changeValue, setChangeValue] = useState("");

  if (!offer) return null;

  const role = getPrimaryRole(offer);
  const roleName = role?.jobRoleId?.name || "Untitled Role";
  const deptName = role?.jobDepartmentId?.name || "—";

  // What actions can this role take on this offer?
  const getActions = () => {
    const s = offer.status;
    const r = viewRole;
    const actions = [];

    if (r === "PRODUCTION_ADMIN") {
      if (s === "DRAFT") actions.push({ label: "Send to Crew", toStatus: "SENT_TO_CREW", color: "bg-blue-600 hover:bg-blue-700" });
      if (s === "NEEDS_REVISION") actions.push({ label: "Resend to Crew", toStatus: "SENT_TO_CREW", color: "bg-blue-600 hover:bg-blue-700" });
      if (s === "CREW_ACCEPTED") actions.push({ label: "Move to Production Check", toStatus: "PRODUCTION_CHECK", color: "bg-violet-600 hover:bg-violet-700" });
      if (s === "PRODUCTION_CHECK") actions.push({ label: "Move to Accounts Check", toStatus: "ACCOUNTS_CHECK", color: "bg-indigo-600 hover:bg-indigo-700" });
      if (["DRAFT", "SENT_TO_CREW", "NEEDS_REVISION", "CREW_ACCEPTED", "PRODUCTION_CHECK"].includes(s)) {
        actions.push({ label: "Cancel Offer", toStatus: "CANCELLED", color: "bg-red-600 hover:bg-red-700" });
      }
    }

    if (r === "ACCOUNTS_ADMIN" && s === "ACCOUNTS_CHECK") {
      actions.push({ label: "Send for Crew Signature", toStatus: "PENDING_CREW_SIGNATURE", color: "bg-orange-600 hover:bg-orange-700" });
    }

    if (r === "CREW") {
      if (s === "SENT_TO_CREW") {
        actions.push({ label: "Accept Offer", toStatus: "CREW_ACCEPTED", color: "bg-emerald-600 hover:bg-emerald-700" });
        actions.push({ label: "Request Changes", action: "request_change", color: "bg-amber-500 hover:bg-amber-600" });
      }
      if (s === "PENDING_CREW_SIGNATURE") {
        actions.push({ label: "Sign Offer", toStatus: "PENDING_UPM_SIGNATURE", color: "bg-emerald-600 hover:bg-emerald-700" });
      }
    }

    if (r === "UPM" && s === "PENDING_UPM_SIGNATURE") {
      actions.push({ label: "Sign as UPM", toStatus: "PENDING_FC_SIGNATURE", color: "bg-emerald-600 hover:bg-emerald-700" });
    }

    if (r === "FC" && s === "PENDING_FC_SIGNATURE") {
      actions.push({ label: "Sign as FC", toStatus: "PENDING_STUDIO_SIGNATURE", color: "bg-emerald-600 hover:bg-emerald-700" });
    }

    if (r === "STUDIO" && s === "PENDING_STUDIO_SIGNATURE") {
      actions.push({ label: "Sign & Complete", toStatus: "COMPLETED", color: "bg-green-600 hover:bg-green-700" });
    }

    return actions;
  };

  const actions = getActions();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center font-bold text-indigo-600">
              {offer.recipient.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-slate-800">{offer.recipient.fullName}</h2>
              <p className="text-xs text-slate-500">{offer.offerCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={offer.status} />
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Workflow Timeline */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Workflow Progress</p>
            <div className="bg-slate-50 rounded-xl border">
              <WorkflowTimeline status={offer.status} timeline={offer.timeline} />
            </div>
          </div>

          {/* Role details */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Role Details</p>
            <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-4">
              {[
                ["Department", deptName],
                ["Role", roleName],
                ["Engagement", role?.engagementType || "—"],
                ["Rate Type", role?.rateType || "—"],
                ["Fee", role?.salary?.base ? `£${role.salary.base.amount.toLocaleString()} / ${role.salary.base.unit}` : "—"],
                ["Start Date", fmt(role?.startDate) || "TBC"],
                ["End Date", fmt(role?.endDate) || "TBC"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">{label}</p>
                  <p className="text-sm font-semibold text-slate-700">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline events */}
          {Object.keys(offer.timeline || {}).filter((k) => offer.timeline[k]).length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Activity</p>
              <div className="space-y-2">
                {[
                  ["Sent to Crew", offer.timeline.sentToCrewAt],
                  ["Crew Accepted", offer.timeline.crewAcceptedAt],
                  ["Crew Rejected", offer.timeline.crewRejectedAt],
                  ["Production Check Done", offer.timeline.productionCheckCompletedAt],
                  ["Accounts Check Done", offer.timeline.accountsCheckCompletedAt],
                  ["Pending Crew Signature", offer.timeline.pendingCrewSignatureAt],
                  ["Crew Signed", offer.timeline.crewSignedAt],
                  ["UPM Signed", offer.timeline.upmSignedAt],
                  ["FC Signed", offer.timeline.fcSignedAt],
                  ["Completed", offer.timeline.completedAt],
                  ["Cancelled", offer.timeline.cancelledAt],
                ].filter(([, ts]) => ts).map(([label, ts]) => (
                  <div key={label} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-50 text-xs">
                    <span className="font-medium text-slate-600">{label}</span>
                    <span className="text-slate-400">{fmt(ts)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && !changeReqOpen && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Actions</p>
              <div className="flex flex-wrap gap-2">
                {actions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      if (action.action === "request_change") {
                        setChangeReqOpen(true);
                      } else {
                        onAction(offer._id, action.toStatus);
                        onClose();
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${action.color}`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Change request form */}
          {changeReqOpen && (
            <div className="border border-amber-200 rounded-xl p-4 bg-amber-50">
              <p className="text-sm font-bold text-amber-800 mb-3">Request Changes</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-amber-700 uppercase">Field to Change</label>
                  <input
                    value={changeField}
                    onChange={(e) => setChangeField(e.target.value)}
                    placeholder="e.g. Daily Rate, Start Date..."
                    className="mt-1 w-full px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-amber-700 uppercase">Requested Change</label>
                  <input
                    value={changeValue}
                    onChange={(e) => setChangeValue(e.target.value)}
                    placeholder="What do you want it changed to?"
                    className="mt-1 w-full px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-amber-700 uppercase">Reason *</label>
                  <textarea
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    placeholder="Why are you requesting this change?"
                    rows={3}
                    className="mt-1 w-full px-3 py-2 text-sm border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (changeReason) {
                        onAction(offer._id, "NEEDS_REVISION", { fieldName: changeField, requestedValue: changeValue, reason: changeReason });
                        onClose();
                      }
                    }}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Submit Request
                  </button>
                  <button
                    onClick={() => setChangeReqOpen(false)}
                    className="px-4 py-2 bg-white border border-amber-200 text-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${color}15` }}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
    </div>
  </div>
);

// ─── Production Admin Dashboard ────────────────────────────────────────────────

const ProductionAdminDashboard = ({ offers, onOfferClick }) => {
  const [filter, setFilter] = useState("ALL");

  const counts = offers.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const filtered = filter === "ALL" ? offers : offers.filter((o) => o.status === filter);

  const stats = [
    { label: "Total Offers", value: offers.length, color: "#6366f1", icon: "📋" },
    { label: "Awaiting Crew", value: counts.SENT_TO_CREW || 0, color: "#0ea5e9", icon: "👤" },
    { label: "Needs Revision", value: counts.NEEDS_REVISION || 0, color: "#f59e0b", icon: "✏️" },
    { label: "In Signing", value: (counts.PENDING_CREW_SIGNATURE || 0) + (counts.PENDING_UPM_SIGNATURE || 0) + (counts.PENDING_FC_SIGNATURE || 0) + (counts.PENDING_STUDIO_SIGNATURE || 0), color: "#8b5cf6", icon: "✍️" },
    { label: "Completed", value: counts.COMPLETED || 0, color: "#10b981", icon: "✅" },
    { label: "Drafts", value: counts.DRAFT || 0, color: "#94a3b8", icon: "📝" },
  ];

  const quickFilters = [
    { key: "ALL", label: "All" },
    { key: "DRAFT", label: "Drafts" },
    { key: "SENT_TO_CREW", label: "Sent" },
    { key: "NEEDS_REVISION", label: "Revisions" },
    { key: "CREW_ACCEPTED", label: "Accepted" },
    { key: "PRODUCTION_CHECK", label: "Prod. Check" },
    { key: "ACCOUNTS_CHECK", label: "Accts. Check" },
    { key: "PENDING_CREW_SIGNATURE", label: "Signing" },
    { key: "COMPLETED", label: "Completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {quickFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f.key
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-white border text-slate-600 hover:border-indigo-300"
            }`}
          >
            {f.label}
            {f.key !== "ALL" && counts[f.key] ? (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                filter === f.key ? "bg-white/20" : "bg-slate-100"
              }`}>
                {counts[f.key]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Offers grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-semibold">No offers found for this filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((offer) => (
            <OfferCard key={offer._id} offer={offer} viewRole="PRODUCTION_ADMIN" onClick={onOfferClick} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Crew Dashboard ────────────────────────────────────────────────────────────

const CrewDashboard = ({ offer, onOfferClick }) => {
  if (!offer) {
    return (
      <div className="text-center py-24 text-slate-400">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-lg font-semibold">No offers yet</p>
        <p className="text-sm mt-1">You'll see your offer here once it's sent to you</p>
      </div>
    );
  }

  const role = getPrimaryRole(offer);
  const currentStep = getStatusStep(offer.status);
  const totalSteps = WORKFLOW_STEPS.filter(s => s.key !== "NEEDS_REVISION").length;
  const progress = Math.round((currentStep / (totalSteps - 1)) * 100);

  const needsAction = offer.status === "SENT_TO_CREW" || offer.status === "PENDING_CREW_SIGNATURE";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Hero card */}
      <div className={`rounded-2xl p-6 border-2 ${needsAction ? "border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50" : "border-slate-200 bg-white"}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Offer</p>
            <h2 className="text-xl font-bold text-slate-800">{role?.jobRoleId?.name || "Role"}</h2>
            <p className="text-sm text-slate-500">{role?.jobDepartmentId?.name}</p>
          </div>
          <StatusBadge status={offer.status} />
        </div>

        {needsAction && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-600 text-white flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="font-bold text-sm">Action Required</p>
              <p className="text-xs text-indigo-200">
                {offer.status === "SENT_TO_CREW" ? "Please review and respond to your offer" : "Your signature is required"}
              </p>
            </div>
            <button
              onClick={() => onOfferClick(offer)}
              className="ml-auto px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors"
            >
              View Offer
            </button>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-slate-500">Offer Progress</p>
            <p className="text-xs font-bold text-indigo-600">{progress}%</p>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            ["Rate", role?.salary?.base ? `£${role.salary.base.amount.toLocaleString()} / ${role.salary.base.unit}` : "TBC"],
            ["Engagement", role?.engagementType || "—"],
            ["Start", fmt(role?.startDate) || "TBC"],
            ["End", fmt(role?.endDate) || "TBC"],
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-lg px-3 py-2 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">{label}</p>
              <p className="text-sm font-bold text-slate-700">{value}</p>
            </div>
          ))}
        </div>

        {!needsAction && (
          <button
            onClick={() => onOfferClick(offer)}
            className="mt-4 w-full py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            View Full Offer Details
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Offer Journey</p>
        <WorkflowTimeline status={offer.status} timeline={offer.timeline} />
      </div>
    </div>
  );
};

// ─── Signing Dashboard (UPM/FC/Studio) ────────────────────────────────────────

const SigningDashboard = ({ offers, viewRole, onOfferClick }) => {
  const SIGNING_STATUS = {
    UPM: "PENDING_UPM_SIGNATURE",
    FC: "PENDING_FC_SIGNATURE",
    STUDIO: "PENDING_STUDIO_SIGNATURE",
    ACCOUNTS_ADMIN: "ACCOUNTS_CHECK",
  };

  const myStatus = SIGNING_STATUS[viewRole];
  const pendingOffers = offers.filter((o) => o.status === myStatus);
  const recentlySigned = offers.filter((o) => {
    if (viewRole === "UPM") return getStatusStep(o.status) > getStatusStep("PENDING_UPM_SIGNATURE");
    if (viewRole === "FC") return getStatusStep(o.status) > getStatusStep("PENDING_FC_SIGNATURE");
    return false;
  });

  const roleLabel = ROLES_CONFIG.find((r) => r.key === viewRole)?.label || viewRole;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border-2 border-indigo-100 p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">✍️</div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{roleLabel} Signing Queue</h2>
            <p className="text-sm text-slate-500">Offers awaiting your signature</p>
          </div>
        </div>

        {pendingOffers.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-semibold">All clear! No offers waiting for your signature</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOffers.map((offer) => {
              const role = getPrimaryRole(offer);
              return (
                <div
                  key={offer._id}
                  onClick={() => onOfferClick(offer)}
                  className="flex items-center justify-between p-4 rounded-xl bg-indigo-50 border border-indigo-200 hover:border-indigo-400 cursor-pointer transition-all hover:shadow-md group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-200 to-violet-200 flex items-center justify-center font-bold text-indigo-700">
                      {offer.recipient.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{offer.recipient.fullName}</p>
                      <p className="text-xs text-slate-500">{role?.jobRoleId?.name} — {role?.jobDepartmentId?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg">
                      {role?.salary?.base ? `£${role.salary.base.amount.toLocaleString()}` : "—"}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{offer.offerCode}</span>
                    <svg className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {recentlySigned.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recently Signed</p>
          <div className="space-y-2">
            {recentlySigned.slice(0, 3).map((offer) => (
              <div key={offer._id} onClick={() => onOfferClick(offer)}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <span className="text-sm font-medium text-slate-700">{offer.recipient.fullName}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={offer.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Dashboard Page ───────────────────────────────────────────────────────

export default function OnboardingDashboard() {
  const navigate = useNavigate();
  const { projectName } = useParams();

  // In real app: use Redux. For demo: local state with mock data.
  const [viewRole, setViewRoleLocal] = useState(
    () => localStorage.getItem("viewRole") || "PRODUCTION_ADMIN"
  );
  const [offers, setOffers] = useState(MOCK_OFFERS);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [toast, setToast] = useState(null);

  const handleRoleChange = (role) => {
    setViewRoleLocal(role);
    localStorage.setItem("viewRole", role);
    setSelectedOffer(null);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAction = (offerId, toStatus, extra = {}) => {
    setOffers((prev) =>
      prev.map((o) => {
        if (o._id !== offerId) return o;
        const now = new Date().toISOString();
        const timelineMap = {
          SENT_TO_CREW: { sentToCrewAt: now },
          CREW_ACCEPTED: { crewAcceptedAt: now },
          NEEDS_REVISION: { crewRejectedAt: now },
          PRODUCTION_CHECK: { productionCheckCompletedAt: now },
          ACCOUNTS_CHECK: { accountsCheckCompletedAt: now },
          PENDING_CREW_SIGNATURE: { pendingCrewSignatureAt: now },
          PENDING_UPM_SIGNATURE: { crewSignedAt: now },
          PENDING_FC_SIGNATURE: { upmSignedAt: now },
          PENDING_STUDIO_SIGNATURE: { fcSignedAt: now },
          COMPLETED: { completedAt: now },
          CANCELLED: { cancelledAt: now },
        };
        return {
          ...o,
          status: toStatus,
          timeline: { ...o.timeline, ...(timelineMap[toStatus] || {}) },
        };
      })
    );
    const label = WORKFLOW_STEPS.find((s) => s.key === toStatus)?.label || toStatus;
    showToast(`✅ Status updated to: ${label}`);
  };

  const crewOffer = offers.find((o) => o.recipient.email === "james@crew.com");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm">
              E
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm">EAARTH PRODUCTIONS</span>
              {projectName && (
                <span className="ml-2 text-xs text-slate-400">/ {decodeURIComponent(projectName)}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ViewAsRoleSwitcher currentRole={viewRole} onRoleChange={handleRoleChange} />
            {viewRole === "PRODUCTION_ADMIN" && (
              <button
                onClick={() => navigate(`/projects/${projectName}/onboarding/create-offer`)}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Offer
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800">
            {viewRole === "CREW" ? "My Offer" :
             viewRole === "UPM" ? "UPM Signing Queue" :
             viewRole === "FC" ? "FC Signing Queue" :
             viewRole === "STUDIO" ? "Studio Signing Queue" :
             viewRole === "ACCOUNTS_ADMIN" ? "Accounts Review Queue" :
             "Crew Onboarding"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {viewRole === "PRODUCTION_ADMIN" && "Manage all crew offers for this production"}
            {viewRole === "CREW" && "Review and sign your employment offer"}
            {viewRole === "UPM" && "Offers awaiting your signature as Unit Production Manager"}
            {viewRole === "FC" && "Offers awaiting your signature as Financial Controller"}
            {viewRole === "STUDIO" && "Final sign-off on completed offers"}
            {viewRole === "ACCOUNTS_ADMIN" && "Review offers before signature stage"}
          </p>
        </div>

        {/* Role-based content */}
        {viewRole === "PRODUCTION_ADMIN" && (
          <ProductionAdminDashboard
            offers={offers}
            onOfferClick={setSelectedOffer}
          />
        )}

        {viewRole === "CREW" && (
          <CrewDashboard
            offer={crewOffer}
            onOfferClick={setSelectedOffer}
          />
        )}

        {["UPM", "FC", "STUDIO", "ACCOUNTS_ADMIN"].includes(viewRole) && (
          <SigningDashboard
            offers={offers}
            viewRole={viewRole}
            onOfferClick={setSelectedOffer}
          />
        )}
      </main>

      {/* Offer detail modal */}
      {selectedOffer && (
        <OfferDetailModal
          offer={offers.find((o) => o._id === selectedOffer._id) || selectedOffer}
          viewRole={viewRole}
          onClose={() => setSelectedOffer(null)}
          onAction={handleAction}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white z-50 transition-all ${
          toast.type === "error" ? "bg-red-600" : "bg-slate-800"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}