/**
 * OnboardingDashboard.jsx  (UPDATED)
 *
 * - Loads offers from Redux (real backend)
 * - Falls back to mock data if projectId/backend not available
 * - Clicking an offer card → navigate to ViewOffer page
 * - "New Offer" button → navigate to CreateOffer (PRODUCTION_ADMIN only)
 * - View As role switcher updates Redux + localStorage
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  getProjectOffersThunk,
  selectProjectOffers,
  selectListLoading,
  selectFilteredOffers,
  selectStatusFilter,
  setStatusFilter,
} from "../store/offer.slice";

import { setViewRole, selectViewRole } from "../../demo/store/viewRole.slice";

// ─── Constants ────────────────────────────────────────────────────────────────

const WORKFLOW_STEPS = [
  { key: "DRAFT", label: "Draft", short: "Draft" },
  { key: "SENT_TO_CREW", label: "Sent to Crew", short: "Sent" },
  { key: "NEEDS_REVISION", label: "Changes Requested", short: "Revision", branch: true },
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

// ─── MOCK DATA (fallback when no backend) ─────────────────────────────────────

const MOCK_OFFERS = [
  {
    _id: "offer_001", offerCode: "OFR-001",
    recipient: { fullName: "JAMES HOLLOWAY", email: "james@crew.com" },
    status: "SENT_TO_CREW",
    jobTitle: "Director of Photography",
    department: "camera", feePerDay: "850",
    dailyOrWeekly: "daily", engagementType: "paye",
    currency: "GBP",
    startDate: "2025-03-01", endDate: "2025-06-30",
    timeline: { sentToCrewAt: "2025-02-20T10:00:00Z" },
    createdAt: "2025-02-19T09:00:00Z",
  },
  {
    _id: "offer_002", offerCode: "OFR-002",
    recipient: { fullName: "SARAH CHEN", email: "sarah@crew.com" },
    status: "CREW_ACCEPTED",
    jobTitle: "Production Designer",
    department: "art", feePerDay: "950",
    dailyOrWeekly: "weekly", engagementType: "loan_out",
    currency: "GBP",
    startDate: "2025-03-15", endDate: "2025-07-15",
    timeline: { sentToCrewAt: "2025-02-18T10:00:00Z", crewAcceptedAt: "2025-02-21T14:00:00Z" },
    createdAt: "2025-02-17T09:00:00Z",
  },
  {
    _id: "offer_003", offerCode: "OFR-003",
    recipient: { fullName: "MARCUS REID", email: "marcus@crew.com" },
    status: "NEEDS_REVISION",
    jobTitle: "Sound Mixer",
    department: "sound", feePerDay: "650",
    dailyOrWeekly: "daily", engagementType: "paye",
    currency: "GBP",
    startDate: "2025-04-01", endDate: "2025-06-30",
    timeline: { sentToCrewAt: "2025-02-15T10:00:00Z" },
    createdAt: "2025-02-14T09:00:00Z",
  },
  {
    _id: "offer_004", offerCode: "OFR-004",
    recipient: { fullName: "NINA PATEL", email: "nina@crew.com" },
    status: "PENDING_UPM_SIGNATURE",
    jobTitle: "1st Assistant Director",
    department: "assistant_directors", feePerDay: "760",
    dailyOrWeekly: "weekly", engagementType: "paye",
    currency: "GBP",
    startDate: "2025-03-01", endDate: "2025-07-31",
    timeline: { sentToCrewAt: "2025-02-10T10:00:00Z", crewAcceptedAt: "2025-02-12T11:00:00Z", crewSignedAt: "2025-02-19T14:00:00Z" },
    createdAt: "2025-02-08T09:00:00Z",
  },
  {
    _id: "offer_005", offerCode: "OFR-005",
    recipient: { fullName: "LEON WALSH", email: "leon@crew.com" },
    status: "COMPLETED",
    jobTitle: "Gaffer",
    department: "electrical", feePerDay: "750",
    dailyOrWeekly: "daily", engagementType: "paye",
    currency: "GBP",
    startDate: "2025-02-01", endDate: "2025-05-31",
    timeline: { sentToCrewAt: "2025-01-15T10:00:00Z", crewAcceptedAt: "2025-01-17T14:00:00Z", completedAt: "2025-01-28T16:00:00Z" },
    createdAt: "2025-01-14T09:00:00Z",
  },
  {
    _id: "offer_006", offerCode: "OFR-006",
    recipient: { fullName: "JAMES HOLLOWAY", email: "james@crew.com" },
    status: "DRAFT",
    jobTitle: "Director of Photography",
    department: "camera", feePerDay: "850",
    dailyOrWeekly: "daily", engagementType: "paye",
    currency: "GBP",
    startDate: "2025-03-01", endDate: "2025-06-30",
    timeline: {},
    createdAt: "2025-02-24T09:00:00Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusStep = (status) => STATUS_ORDER.indexOf(status);

const fmt = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const cs_map = { GBP: "£", USD: "$", EUR: "€" };
const getCS = (currency) => cs_map[currency?.toUpperCase()] || "£";

// ─── StatusBadge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const c = STATUS_COLORS[status] || STATUS_COLORS.DRAFT;
  const label = WORKFLOW_STEPS.find((s) => s.key === status)?.label || status?.replace(/_/g, " ") || status;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {label}
    </span>
  );
};

// ─── Role Switcher ────────────────────────────────────────────────────────────

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
            <button key={r.key} onClick={() => { onRoleChange(r.key); setOpen(false); }}
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

// ─── Offer Card ────────────────────────────────────────────────────────────────

const OfferCard = ({ offer, onClick }) => {
  const cs = getCS(offer.currency);
  const feeNum = parseFloat(offer.feePerDay) || 0;
  const dept = offer.department?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "—";
  const displayTitle = offer.createOwnJobTitle && offer.newJobTitle ? offer.newJobTitle : offer.jobTitle || "—";
  const engLabel = ({ paye: "PAYE", loan_out: "LOAN OUT", schd: "SCHD", long_form: "LONG FORM" }[offer.engagementType] || offer.engagementType?.toUpperCase() || "—");

  return (
    <div
      onClick={() => onClick(offer)}
      className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center flex-shrink-0 text-lg font-bold text-indigo-600">
              {offer.recipient?.fullName?.charAt(0) || "?"}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 text-sm truncate">{offer.recipient?.fullName || "Unknown"}</p>
              <p className="text-xs text-slate-500 truncate">{offer.recipient?.email || "—"}</p>
            </div>
          </div>
          <StatusBadge status={offer.status} />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded uppercase tracking-wider">
            {dept}
          </span>
          <span className="text-xs text-slate-700 font-medium truncate">{displayTitle}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {feeNum > 0 ? `${cs}${feeNum.toLocaleString()} / ${offer.dailyOrWeekly?.toUpperCase() || "DAY"}` : "Rate TBC"}
            <span className="ml-2 text-[10px] text-slate-400">{engLabel}</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">{offer.offerCode}</span>
        </div>

        {(offer.startDate || offer.endDate) && (
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
            {fmt(offer.startDate)} – {fmt(offer.endDate) || "TBC"}
          </div>
        )}
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
    {
      label: "In Signing",
      value: (counts.PENDING_CREW_SIGNATURE || 0) + (counts.PENDING_UPM_SIGNATURE || 0) + (counts.PENDING_FC_SIGNATURE || 0) + (counts.PENDING_STUDIO_SIGNATURE || 0),
      color: "#8b5cf6", icon: "✍️"
    },
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
    { key: "ACCOUNTS_CHECK", label: "Accts." },
    { key: "PENDING_CREW_SIGNATURE", label: "Signing" },
    { key: "COMPLETED", label: "Completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {quickFilters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f.key
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-white border text-slate-600 hover:border-indigo-300"
            }`}
          >
            {f.label}
            {f.key !== "ALL" && counts[f.key] ? (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === f.key ? "bg-white/20" : "bg-slate-100"}`}>
                {counts[f.key]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-semibold">No offers found for this filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((offer) => (
            <OfferCard key={offer._id} offer={offer} onClick={onOfferClick} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Crew Dashboard ────────────────────────────────────────────────────────────

const CrewDashboard = ({ offers, onOfferClick, userEmail }) => {
  // Show crew their own offers (matched by email or just show first sent_to_crew)
  const crewOffers = offers.filter((o) =>
    o.recipient?.email === userEmail ||
    ["SENT_TO_CREW", "NEEDS_REVISION", "CREW_ACCEPTED", "PENDING_CREW_SIGNATURE", "COMPLETED"].includes(o.status)
  );

  const activeOffer = crewOffers.find((o) => o.status === "SENT_TO_CREW" || o.status === "PENDING_CREW_SIGNATURE") || crewOffers[0];

  if (!activeOffer) {
    return (
      <div className="text-center py-24 text-slate-400">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-lg font-semibold">No offers yet</p>
        <p className="text-sm mt-1">You'll see your offer here once it's sent to you</p>
      </div>
    );
  }

  const cs = getCS(activeOffer.currency);
  const feeNum = parseFloat(activeOffer.feePerDay) || 0;
  const currentStep = getStatusStep(activeOffer.status);
  const totalSteps = WORKFLOW_STEPS.filter((s) => s.key !== "NEEDS_REVISION").length;
  const progress = Math.round((currentStep / (totalSteps - 1)) * 100);
  const needsAction = ["SENT_TO_CREW", "PENDING_CREW_SIGNATURE"].includes(activeOffer.status);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className={`rounded-2xl p-6 border-2 ${needsAction ? "border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50" : "border-slate-200 bg-white"}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Offer</p>
            <h2 className="text-xl font-bold text-slate-800">
              {activeOffer.createOwnJobTitle && activeOffer.newJobTitle ? activeOffer.newJobTitle : activeOffer.jobTitle || "Role"}
            </h2>
            <p className="text-sm text-slate-500">{activeOffer.department?.replace(/_/g, " ")}</p>
          </div>
          <StatusBadge status={activeOffer.status} />
        </div>

        {needsAction && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-600 text-white flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="font-bold text-sm">Action Required</p>
              <p className="text-xs text-indigo-200">
                {activeOffer.status === "SENT_TO_CREW" ? "Please review and respond to your offer" : "Your signature is required"}
              </p>
            </div>
            <button onClick={() => onOfferClick(activeOffer)}
              className="ml-auto px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
              View Offer
            </button>
          </div>
        )}

        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-slate-500">Offer Progress</p>
            <p className="text-xs font-bold text-indigo-600">{progress}%</p>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            ["Rate", feeNum > 0 ? `${cs}${feeNum.toLocaleString()}/${activeOffer.dailyOrWeekly?.toUpperCase() || "DAY"}` : "TBC"],
            ["Engagement", activeOffer.engagementType?.toUpperCase() || "—"],
            ["Start", fmt(activeOffer.startDate) || "TBC"],
            ["End", fmt(activeOffer.endDate) || "TBC"],
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-lg px-3 py-2 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">{label}</p>
              <p className="text-sm font-bold text-slate-700">{value}</p>
            </div>
          ))}
        </div>

        {!needsAction && (
          <button onClick={() => onOfferClick(activeOffer)}
            className="mt-4 w-full py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            View Full Offer Details
          </button>
        )}
      </div>

      {crewOffers.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">All Your Offers</p>
          <div className="space-y-2">
            {crewOffers.map((o) => (
              <div key={o._id} onClick={() => onOfferClick(o)}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-700">{o.createOwnJobTitle && o.newJobTitle ? o.newJobTitle : o.jobTitle || "—"}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{o.offerCode}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Signing Dashboard (UPM/FC/Studio/Accounts) ────────────────────────────────

const SigningDashboard = ({ offers, viewRole, onOfferClick }) => {
  const SIGNING_STATUS = {
    UPM: "PENDING_UPM_SIGNATURE",
    FC: "PENDING_FC_SIGNATURE",
    STUDIO: "PENDING_STUDIO_SIGNATURE",
    ACCOUNTS_ADMIN: "ACCOUNTS_CHECK",
  };

  const myStatus = SIGNING_STATUS[viewRole];
  const pendingOffers = offers.filter((o) => o.status === myStatus);
  const roleLabel = ROLES_CONFIG.find((r) => r.key === viewRole)?.label || viewRole;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border-2 border-indigo-100 p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">✍️</div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{roleLabel} Queue</h2>
            <p className="text-sm text-slate-500">Offers awaiting your action</p>
          </div>
        </div>

        {pendingOffers.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-semibold">All clear! Nothing waiting for you right now</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOffers.map((offer) => {
              const cs = getCS(offer.currency);
              const feeNum = parseFloat(offer.feePerDay) || 0;
              const displayTitle = offer.createOwnJobTitle && offer.newJobTitle ? offer.newJobTitle : offer.jobTitle;
              return (
                <div key={offer._id} onClick={() => onOfferClick(offer)}
                  className="flex items-center justify-between p-4 rounded-xl bg-indigo-50 border border-indigo-200 hover:border-indigo-400 cursor-pointer transition-all hover:shadow-md group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-200 to-violet-200 flex items-center justify-center font-bold text-indigo-700">
                      {offer.recipient?.fullName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{offer.recipient?.fullName || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{displayTitle} — {offer.department?.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {feeNum > 0 && (
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg">
                        {cs}{feeNum.toLocaleString()}
                      </span>
                    )}
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
    </div>
  );
};

// ─── Main Dashboard Page ───────────────────────────────────────────────────────

export default function OnboardingDashboard() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const dispatch = useDispatch();

  // Redux state
  const reduxOffers = useSelector(selectProjectOffers);
  const isLoading = useSelector(selectListLoading);
  const viewRole = useSelector(selectViewRole) || localStorage.getItem("viewRole") || "PRODUCTION_ADMIN";

  // Use real offers if available, fallback to mock
  const offers = reduxOffers.length > 0 ? reduxOffers : MOCK_OFFERS;

  // Load real offers from backend if we have a projectId
  useEffect(() => {
    if (projectId && projectId !== "demo") {
      dispatch(getProjectOffersThunk({ projectId }));
    }
  }, [projectId, dispatch]);

  const handleRoleChange = (role) => {
    dispatch(setViewRole(role));
  };

  const handleOfferClick = (offer) => {
    // Navigate to ViewOffer page
    if (offer._id?.startsWith("offer_")) {
      // Mock data — in demo, just show the offer in a simple way
      // For mock offers, we can't navigate to real backend route
      // But we still navigate — ViewOffer will show not found gracefully
      navigate(`offers/${offer._id}/review`);
    } else {
      navigate(`offers/${offer._id}/review`);
    }
  };

  const pageTitle = {
    CREW: "My Offer",
    UPM: "UPM Signing Queue",
    FC: "FC Signing Queue",
    STUDIO: "Studio Signing Queue",
    ACCOUNTS_ADMIN: "Accounts Review Queue",
  }[viewRole] || "Crew Onboarding";

  const pageDesc = {
    PRODUCTION_ADMIN: "Manage all crew offers for this production",
    CREW: "Review and sign your employment offer",
    UPM: "Offers awaiting your signature as Unit Production Manager",
    FC: "Offers awaiting your signature as Financial Controller",
    STUDIO: "Final sign-off on completed offers",
    ACCOUNTS_ADMIN: "Review offers before signature stage",
  }[viewRole] || "";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm">E</div>
            <div>
              <span className="font-bold text-slate-800 text-sm">EAARTH PRODUCTIONS</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ViewAsRoleSwitcher currentRole={viewRole} onRoleChange={handleRoleChange} />
            {viewRole === "PRODUCTION_ADMIN" && (
              <button
                onClick={() => navigate("offers/create")}
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
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800">{pageTitle}</h1>
          <p className="text-sm text-slate-500 mt-1">{pageDesc}</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {viewRole === "PRODUCTION_ADMIN" && (
              <ProductionAdminDashboard offers={offers} onOfferClick={handleOfferClick} />
            )}
            {viewRole === "CREW" && (
              <CrewDashboard offers={offers} onOfferClick={handleOfferClick} userEmail="james@crew.com" />
            )}
            {["UPM", "FC", "STUDIO", "ACCOUNTS_ADMIN"].includes(viewRole) && (
              <SigningDashboard offers={offers} viewRole={viewRole} onOfferClick={handleOfferClick} />
            )}
          </>
        )}
      </main>
    </div>
  );
}