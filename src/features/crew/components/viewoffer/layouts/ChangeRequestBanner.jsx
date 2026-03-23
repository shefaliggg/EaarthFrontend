/**
 * ChangeRequestBanner.jsx
 *
 * Role-aware change request banner.
 * Matches the app's purple/lavender theme from index.css.
 *
 * Role color mapping:
 *   CREW / DECLINE              → orange  (pre-signing request)
 *   CREW_SIGNING_REQUEST_CHANGES → amber  (crew during signing)
 *   UPM_REQUEST_CHANGES         → violet
 *   FC_REQUEST_CHANGES          → amber
 *   STUDIO_REQUEST_CHANGES      → purple
 *   ACCOUNTS_REVIEW             → indigo
 *   default                     → orange
 */

import { useEffect }             from "react";
import { useSearchParams }       from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare, Clock, AlertCircle } from "lucide-react";

import {
  getChangeRequestsThunk,
  selectChangeRequests,
} from "../../../store/offer.slice";

// ── Role → visual config ──────────────────────────────────────────────────────

const ROLE_STYLE = {
  ACCOUNTS_REVIEW: {
    label:    "Accounts Flagged Issues",
    roleName: "Accounts",
    header:   "bg-indigo-600",
    border:   "border-indigo-200",
    bg:       "bg-indigo-50",
    avatar:   "bg-indigo-100 text-indigo-700",
    name:     "text-indigo-800",
    time:     "text-indigo-400",
    msgBg:    "bg-white border-indigo-100",
    msgText:  "text-neutral-800",
    field:    "text-indigo-500",
    dot:      "bg-indigo-500",
  },
  UPM_EDIT_REQUEST: {
    label:    "UPM Requested Changes",
    roleName: "Unit Production Manager",
    header:   "bg-violet-600",
    border:   "border-violet-200",
    bg:       "bg-violet-50",
    avatar:   "bg-violet-100 text-violet-700",
    name:     "text-violet-800",
    time:     "text-violet-400",
    msgBg:    "bg-white border-violet-100",
    msgText:  "text-neutral-800",
    field:    "text-violet-500",
    dot:      "bg-violet-500",
  },
  FC_EDIT_REQUEST: {
    label:    "Financial Controller Flagged Issues",
    roleName: "Financial Controller",
    header:   "bg-amber-600",
    border:   "border-amber-200",
    bg:       "bg-amber-50",
    avatar:   "bg-amber-100 text-amber-700",
    name:     "text-amber-800",
    time:     "text-amber-400",
    msgBg:    "bg-white border-amber-100",
    msgText:  "text-neutral-800",
    field:    "text-amber-500",
    dot:      "bg-amber-500",
  },
  STUDIO_EDIT_REQUEST: {
    label:    "Studio Requested Amendment",
    roleName: "Production Executive",
    header:   "bg-purple-700",
    border:   "border-purple-200",
    bg:       "bg-purple-50",
    avatar:   "bg-purple-100 text-purple-700",
    name:     "text-purple-800",
    time:     "text-purple-400",
    msgBg:    "bg-white border-purple-100",
    msgText:  "text-neutral-800",
    field:    "text-purple-500",
    dot:      "bg-purple-500",
  },
  CREW_SIGNING_REQUEST_CHANGES: {
    label:    "Crew Requested Changes During Signing",
    roleName: "Crew Member",
    header:   "bg-amber-500",
    border:   "border-amber-200",
    bg:       "bg-amber-50",
    avatar:   "bg-amber-100 text-amber-700",
    name:     "text-amber-800",
    time:     "text-amber-400",
    msgBg:    "bg-white border-amber-100",
    msgText:  "text-neutral-800",
    field:    "text-amber-500",
    dot:      "bg-amber-500",
  },
  DECLINE: {
    label:    "Crew Declined Offer",
    roleName: "Crew Member",
    header:   "bg-red-600",
    border:   "border-red-200",
    bg:       "bg-red-50",
    avatar:   "bg-red-100 text-red-700",
    name:     "text-red-800",
    time:     "text-red-400",
    msgBg:    "bg-white border-red-100",
    msgText:  "text-neutral-800",
    field:    "text-red-500",
    dot:      "bg-red-500",
  },
  // Default — crew pre-signing change request
  DEFAULT: {
    label:    "Crew Requested Changes",
    roleName: "Crew Member",
    header:   "bg-orange-500",
    border:   "border-orange-200",
    bg:       "bg-orange-50",
    avatar:   "bg-orange-100 text-orange-700",
    name:     "text-orange-800",
    time:     "text-orange-400",
    msgBg:    "bg-white border-orange-100",
    msgText:  "text-neutral-800",
    field:    "text-orange-500",
    dot:      "bg-orange-400",
  },
};

function getStyle(fieldName) {
  if (!fieldName) return ROLE_STYLE.DEFAULT;
  const upper = fieldName.toUpperCase();

  // 1. Direct exact match
  if (ROLE_STYLE[upper]) return ROLE_STYLE[upper];

  // 2. Check if fieldName starts with a known role prefix
  if (upper.startsWith("UPM_"))    return ROLE_STYLE.UPM_EDIT_REQUEST;
  if (upper.startsWith("FC_"))     return ROLE_STYLE.FC_EDIT_REQUEST;
  if (upper.startsWith("STUDIO_")) return ROLE_STYLE.STUDIO_EDIT_REQUEST;
  if (upper === "ACCOUNTS_REVIEW") return ROLE_STYLE.ACCOUNTS_REVIEW;
  if (upper === "DECLINE")         return ROLE_STYLE.DECLINE;
  if (upper.startsWith("CREW_SIGNING")) return ROLE_STYLE.CREW_SIGNING_REQUEST_CHANGES;

  return ROLE_STYLE.DEFAULT;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "";

// ── Single request card ───────────────────────────────────────────────────────

function RequestCard({ request, style, isLatest = false }) {
  const name = request.requestedBy?.displayName
    || request.requestedBy?.email
    || style.roleName
    || "Unknown";

  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} overflow-hidden`}>
      {/* Who + when */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <div className={`w-7 h-7 rounded-full ${style.avatar} flex items-center justify-center shrink-0`}>
          <span className="text-[10px] font-bold">{getInitials(name)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[12px] font-semibold ${style.name} leading-tight`}>{name}</p>
          <p className={`text-[10px] ${style.time} leading-tight`}>{style.roleName}</p>
        </div>
        {request.createdAt && (
          <div className={`flex items-center gap-1 ${style.time} shrink-0`}>
            <Clock className="w-2.5 h-2.5" />
            <span className="text-[9px]">{fmtDate(request.createdAt)}</span>
          </div>
        )}
      </div>

      {/* Message */}
      <div className={`mx-3.5 mb-3 rounded-lg border ${style.msgBg} px-3 py-2.5`}>
        <p className={`text-[12px] ${style.msgText} leading-relaxed whitespace-pre-wrap`}>
          {request.reason || "No reason provided."}
        </p>
      </div>

      {/* Field tag */}
      {request.fieldName && !["ACCOUNTS_REVIEW", "DECLINE"].includes(request.fieldName) && (
        <div className="px-3.5 pb-2.5">
          <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-semibold ${style.field} bg-white/70 border ${style.border} px-1.5 py-0.5 rounded`}>
            {request.fieldName.replace(/_/g, " ")}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ChangeRequestBanner({
  offerId,
  changeRequests: propRequests,
  className = "",
}) {
  const dispatch       = useDispatch();
  const storeRequests  = useSelector(selectChangeRequests);
  const [searchParams] = useSearchParams();

  const resolvedOfferId = offerId || searchParams.get("offerId");

  useEffect(() => {
    if (resolvedOfferId && !propRequests) {
      dispatch(getChangeRequestsThunk(resolvedOfferId));
    }
  }, [resolvedOfferId, propRequests, dispatch]);

  const allRequests = propRequests ?? storeRequests ?? [];

  const pending = allRequests
    .filter((r) => r.status === "PENDING")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!pending.length) return null;

  const latest = pending[0];
  const style  = getStyle(latest.fieldName);

  return (
    <div className={`rounded-2xl border ${style.border} overflow-hidden shadow-sm ${className}`}>

      {/* Header bar */}
      <div className={`${style.header} px-4 py-3 flex items-center gap-2.5`}>
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <MessageSquare className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-white leading-tight">
            {style.label}
          </p>
          <p className="text-[10px] text-white/70 mt-0.5">
            Review the notes below and action the required changes
          </p>
        </div>

      </div>

      {/* Body */}
      <div className={`${style.bg} px-4 py-3 space-y-2.5`}>

        {/* Latest request — full card */}
        <RequestCard request={latest} style={style} isLatest />

        {/* Older requests — collapsible */}
        {pending.length > 1 && (
          <details className="group">
            <summary className={`text-[10px] font-semibold ${style.field} cursor-pointer list-none flex items-center gap-1.5 select-none hover:opacity-80 transition-opacity`}>
              <AlertCircle className="w-3 h-3" />
              {pending.length - 1} older request{pending.length - 1 > 1 ? "s" : ""}
              <span className="ml-auto group-open:rotate-180 transition-transform text-[8px]">▼</span>
            </summary>
            <div className="mt-2 space-y-2">
              {pending.slice(1).map((r) => (
                <RequestCard key={r._id} request={r} style={getStyle(r.fieldName)} />
              ))}
            </div>
          </details>
        )}
      </div>

    </div>
  );
}