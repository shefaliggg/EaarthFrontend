/**
 * ChangeRequestBanner.jsx
 *
 * Reusable component — shows pending crew change requests.
 * Use anywhere: LayoutProductionAdmin, EditOffer page, CreateOffer edit mode, etc.
 *
 * Usage:
 *   import ChangeRequestBanner from "../components/ChangeRequestBanner";
 *   <ChangeRequestBanner offerId={offer._id} />
 *
 *   OR pass already-fetched requests:
 *   <ChangeRequestBanner changeRequests={changeRequests} />
 */

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare, Clock } from "lucide-react";

import {
  getChangeRequestsThunk,
  selectChangeRequests,
} from "../../../store/offer.slice";

// ── helpers ───────────────────────────────────────────────────────────────────

function getInitials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

const fmtDate = (d) =>
  d ? new Date(d).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }) : "";

// ── Main component ────────────────────────────────────────────────────────────

export default function ChangeRequestBanner({
  offerId,                      // if provided, fetches from backend automatically
  changeRequests: propRequests, // OR pass already-fetched requests directly
  className = "",
}) {
  const dispatch      = useDispatch();
  const storeRequests = useSelector(selectChangeRequests);
  const [searchParams] = useSearchParams();

  // Also read offerId from URL query param so CreateOffer page can use this
  // e.g. /offers/create?offerId=xxx  — navigated from LayoutProductionAdmin Edit button
  const resolvedOfferId = offerId || searchParams.get("offerId");

  // Auto-fetch if we have an offerId and no prop requests supplied
  useEffect(() => {
    if (resolvedOfferId && !propRequests) {
      dispatch(getChangeRequestsThunk(resolvedOfferId));
    }
  }, [resolvedOfferId, propRequests, dispatch]);

  const allRequests = propRequests ?? storeRequests ?? [];

  // Only show PENDING requests, newest first
  const pending = allRequests
    .filter((r) => r.status === "PENDING")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!pending.length) return null;

  const latest   = pending[0];
  const crewName = latest.requestedBy?.displayName
    || latest.requestedBy?.email
    || "Crew Member";

  return (
    <div className={`rounded-xl border border-orange-300 bg-orange-50 overflow-hidden ${className}`}>

      {/* Header — different colour/title for accounts vs crew */}
      {(() => {
        const isFromAccounts = pending.some((r) => r.fieldName === "ACCOUNTS_REVIEW");
        return (
          <div className={`flex items-center gap-2.5 px-4 py-2.5 ${isFromAccounts ? "bg-indigo-600" : "bg-orange-500"}`}>
            <MessageSquare className="w-4 h-4 text-white shrink-0" />
            <span className="text-[12px] font-bold text-white uppercase tracking-wide">
              {isFromAccounts ? "Accounts Flagged Issues" : "Crew Requested Changes"}
            </span>
            {pending.length > 1 && (
              <span className="ml-auto text-[9px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                {pending.length} requests
              </span>
            )}
          </div>
        );
      })()}

      {/* Body */}
      <div className="px-4 py-3 space-y-2">

        {/* Who + when */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-orange-700">{getInitials(crewName)}</span>
          </div>
          <span className="text-[12px] font-semibold text-orange-800">{crewName}</span>
          {latest.createdAt && (
            <span className="flex items-center gap-1 ml-auto text-[9px] text-orange-500">
              <Clock className="w-2.5 h-2.5" />
              {fmtDate(latest.createdAt)}
            </span>
          )}
        </div>

        {/* Reason / description */}
        <div className="bg-white border border-orange-200 rounded-lg px-3 py-2.5">
          <p className="text-[12px] text-neutral-800 leading-relaxed whitespace-pre-wrap">
            {latest.reason || "No reason provided."}
          </p>
        </div>

        {/* Field name if provided */}
        {latest.fieldName && (
          <p className="text-[10px] text-orange-600">
            Field: <span className="font-semibold font-mono">{latest.fieldName}</span>
          </p>
        )}

        {/* Older requests */}
        {pending.length > 1 && (
          <details className="mt-1">
            <summary className="text-[10px] text-orange-600 cursor-pointer font-medium hover:text-orange-700">
              + {pending.length - 1} older request{pending.length - 1 > 1 ? "s" : ""}
            </summary>
            <div className="mt-2 space-y-2">
              {pending.slice(1).map((r) => (
                <div key={r._id} className="bg-white border border-orange-100 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <span className="text-[7px] font-bold text-orange-600">
                        {getInitials(r.requestedBy?.displayName || "C")}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-orange-700">
                      {r.requestedBy?.displayName || "Crew"}
                    </span>
                    <span className="ml-auto text-[9px] text-orange-400">{fmtDate(r.createdAt)}</span>
                  </div>
                  <p className="text-[11px] text-neutral-700 whitespace-pre-wrap">{r.reason}</p>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}