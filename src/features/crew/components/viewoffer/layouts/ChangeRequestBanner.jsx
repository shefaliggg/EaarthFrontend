/**
 * ChangeRequestBanner.jsx
 *
 * THEMING: All colors use CSS variables from index.css.
 *   No hardcoded Tailwind color classes.
 *   Role color mapping uses index.css variable families:
 *     CREW / DEFAULT              → --peach-* (orange)
 *     CREW_SIGNING_REQUEST_CHANGES → --peach-* (amber-ish, same family)
 *     UPM_EDIT_REQUEST            → --lavender-* / --primary
 *     FC_EDIT_REQUEST             → --peach-* (warm amber)
 *     STUDIO_EDIT_REQUEST         → --lavender-* (deeper)
 *     ACCOUNTS_REVIEW             → --sky-*
 *     DECLINE                     → --destructive
 */

import { useEffect }               from "react";
import { useSearchParams }         from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare, Clock, AlertCircle } from "lucide-react";

import {
  getChangeRequestsThunk,
  selectChangeRequests,
} from "../../../store/offer.slice";

// ── Role → CSS variable theme config ─────────────────────────────────────────
// All values reference variables defined in index.css.

const ROLE_STYLE = {
  ACCOUNTS_REVIEW: {
    label:       "Accounts Flagged Issues",
    roleName:    "Accounts",
    headerBg:    "var(--sky-600)",
    borderColor: "var(--sky-200)",
    bgColor:     "var(--sky-50)",
    avatarBg:    "var(--sky-100)",
    avatarColor: "var(--sky-700)",
    nameColor:   "var(--sky-800)",
    timeColor:   "var(--sky-400)",
    msgBg:       "var(--card)",
    msgBorder:   "var(--sky-100)",
    fieldColor:  "var(--sky-500)",
    dotColor:    "var(--sky-500)",
  },
  UPM_EDIT_REQUEST: {
    label:       "UPM Requested Changes",
    roleName:    "Unit Production Manager",
    headerBg:    "var(--primary)",
    borderColor: "var(--lavender-200)",
    bgColor:     "var(--lavender-50)",
    avatarBg:    "var(--lavender-100)",
    avatarColor: "var(--lavender-700)",
    nameColor:   "var(--lavender-800)",
    timeColor:   "var(--lavender-400)",
    msgBg:       "var(--card)",
    msgBorder:   "var(--lavender-100)",
    fieldColor:  "var(--lavender-500)",
    dotColor:    "var(--lavender-500)",
  },
  FC_EDIT_REQUEST: {
    label:       "Financial Controller Flagged Issues",
    roleName:    "Financial Controller",
    headerBg:    "var(--peach-600)",
    borderColor: "var(--peach-200)",
    bgColor:     "var(--peach-50)",
    avatarBg:    "var(--peach-100)",
    avatarColor: "var(--peach-700)",
    nameColor:   "var(--peach-800)",
    timeColor:   "var(--peach-400)",
    msgBg:       "var(--card)",
    msgBorder:   "var(--peach-100)",
    fieldColor:  "var(--peach-500)",
    dotColor:    "var(--peach-500)",
  },
  STUDIO_EDIT_REQUEST: {
    label:       "Studio Requested Amendment",
    roleName:    "Production Executive",
    headerBg:    "var(--lavender-800)",
    borderColor: "var(--lavender-200)",
    bgColor:     "var(--lavender-50)",
    avatarBg:    "var(--lavender-100)",
    avatarColor: "var(--lavender-700)",
    nameColor:   "var(--lavender-800)",
    timeColor:   "var(--lavender-400)",
    msgBg:       "var(--card)",
    msgBorder:   "var(--lavender-100)",
    fieldColor:  "var(--lavender-500)",
    dotColor:    "var(--lavender-500)",
  },
  CREW_SIGNING_REQUEST_CHANGES: {
    label:       "Crew Requested Changes During Signing",
    roleName:    "Crew Member",
    headerBg:    "var(--peach-500)",
    borderColor: "var(--peach-200)",
    bgColor:     "var(--peach-50)",
    avatarBg:    "var(--peach-100)",
    avatarColor: "var(--peach-700)",
    nameColor:   "var(--peach-800)",
    timeColor:   "var(--peach-400)",
    msgBg:       "var(--card)",
    msgBorder:   "var(--peach-100)",
    fieldColor:  "var(--peach-500)",
    dotColor:    "var(--peach-500)",
  },
  DECLINE: {
    label:       "Crew Declined Offer",
    roleName:    "Crew Member",
    headerBg:    "var(--destructive)",
    borderColor: "var(--pastel-pink-200)",
    bgColor:     "var(--pastel-pink-50)",
    avatarBg:    "var(--pastel-pink-100)",
    avatarColor: "var(--pastel-pink-700)",
    nameColor:   "var(--pastel-pink-800)",
    timeColor:   "var(--pastel-pink-400)",
    msgBg:       "var(--card)",
    msgBorder:   "var(--pastel-pink-100)",
    fieldColor:  "var(--pastel-pink-500)",
    dotColor:    "var(--pastel-pink-500)",
  },
  DEFAULT: {
    label:       "Crew Requested Changes",
    roleName:    "Crew Member",
    headerBg:    "var(--peach-500)",
    borderColor: "var(--peach-200)",
    bgColor:     "var(--peach-50)",
    avatarBg:    "var(--peach-100)",
    avatarColor: "var(--peach-700)",
    nameColor:   "var(--peach-800)",
    timeColor:   "var(--peach-400)",
    msgBg:       "var(--card)",
    msgBorder:   "var(--peach-100)",
    fieldColor:  "var(--peach-500)",
    dotColor:    "var(--peach-400)",
  },
};

function getStyle(fieldName) {
  if (!fieldName) return ROLE_STYLE.DEFAULT;
  const upper = fieldName.toUpperCase();
  if (ROLE_STYLE[upper])           return ROLE_STYLE[upper];
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

// ── RequestCard ───────────────────────────────────────────────────────────────

function RequestCard({ request, style }) {
  const name =
    request.requestedBy?.displayName ||
    request.requestedBy?.email ||
    style.roleName ||
    "Unknown";

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${style.borderColor}`, background: style.bgColor }}
    >
      {/* Who + when */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: style.avatarBg }}
        >
          <span className="text-[10px] font-bold" style={{ color: style.avatarColor }}>
            {getInitials(name)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold leading-tight" style={{ color: style.nameColor }}>
            {name}
          </p>
          <p className="text-[10px] leading-tight" style={{ color: style.timeColor }}>
            {style.roleName}
          </p>
        </div>
        {request.createdAt && (
          <div className="flex items-center gap-1 shrink-0" style={{ color: style.timeColor }}>
            <Clock className="w-2.5 h-2.5" />
            <span className="text-[9px]">{fmtDate(request.createdAt)}</span>
          </div>
        )}
      </div>

      {/* Message */}
      <div
        className="mx-3.5 mb-3 rounded-lg px-3 py-2.5"
        style={{ background: style.msgBg, border: `1px solid ${style.msgBorder}` }}
      >
        <p
          className="text-[12px] leading-relaxed whitespace-pre-wrap"
          style={{ color: "var(--foreground)" }}
        >
          {request.reason || "No reason provided."}
        </p>
      </div>

      {/* Field tag */}
      {request.fieldName &&
        !["ACCOUNTS_REVIEW", "DECLINE"].includes(request.fieldName) && (
          <div className="px-3.5 pb-2.5">
            <span
              className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded"
              style={{
                color: style.fieldColor,
                background: "rgba(255,255,255,0.7)",
                border: `1px solid ${style.borderColor}`,
              }}
            >
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
  const pending     = allRequests
    .filter((r) => r.status === "PENDING")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!pending.length) return null;

  const latest = pending[0];
  const style  = getStyle(latest.fieldName);

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-sm ${className}`}
      style={{ border: `1px solid ${style.borderColor}` }}
    >
      {/* Header bar */}
      <div
        className="px-4 py-3 flex items-center gap-2.5"
        style={{ background: style.headerBg }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <MessageSquare className="w-3.5 h-3.5" style={{ color: "white" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold leading-tight" style={{ color: "white" }}>
            {style.label}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
            Review the notes below and action the required changes
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2.5" style={{ background: style.bgColor }}>
        {/* Latest request */}
        <RequestCard request={latest} style={style} />

        {/* Older requests — collapsible */}
        {pending.length > 1 && (
          <details className="group">
            <summary
              className="text-[10px] font-semibold cursor-pointer list-none flex items-center gap-1.5 select-none transition-opacity hover:opacity-80"
              style={{ color: style.fieldColor }}
            >
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