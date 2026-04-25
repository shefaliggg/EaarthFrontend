/**
 * OfferListItem.jsx
 *
 * Compact offer row used inside the left-panel offer list on the MyOffer page.
 *
 * Props:
 *   offer       — offer object from Redux
 *   isSelected  — boolean
 *   onClick     — () => void
 *
 * Display rules:
 *   - PRODUCTION_CHECK / ACCOUNTS_CHECK → show CREW_ACCEPTED badge
 *   - PRODUCTION_CHECK                  → show amber "Production review" dot
 *   - ACCOUNTS_CHECK                    → show amber "Finance review" dot
 */

import { cn } from "../../../../shared/config/utils";
import { OfferStatusBadge } from "../onboarding/OfferStatusBadge";
import { Clock } from "lucide-react";

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const deptLabel = (val = "") =>
  val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// Statuses that are "post-accept but pre-contract" — display as CREW_ACCEPTED
const POST_ACCEPT_STATUSES = ["PRODUCTION_CHECK", "ACCOUNTS_CHECK"];

export function OfferListItem({ offer, isSelected = false, onClick }) {
  const name =
    offer.recipient?.fullName || offer.fullName || "—";

  const jobTitle =
    offer.createOwnJobTitle && offer.newJobTitle
      ? offer.newJobTitle
      : offer.jobTitle || "—";

  const dept = offer.department ? deptLabel(offer.department) : null;

  // Whether to override the displayed badge to CREW_ACCEPTED
  const isPostAccept      = POST_ACCEPT_STATUSES.includes(offer.status);
  const isAccountsReview  = offer.status === "ACCOUNTS_CHECK";

  // The badge status to actually render
  const displayStatus = isPostAccept ? "CREW_ACCEPTED" : offer.status;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-3 border-b border-neutral-100 last:border-b-0",
        "transition-colors duration-100 focus:outline-none",
        "hover:bg-purple-50/40",
        isSelected
          ? "bg-[#EEEDFE] border-l-[3px] border-l-[#7F77DD] pl-[9px]"
          : "border-l-[3px] border-l-transparent"
      )}
    >
      {/* Name + badge */}
      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
        <span
          className={cn(
            "text-[12px] font-semibold truncate max-w-[120px]",
            isSelected ? "text-[#3C3489]" : "text-neutral-800"
          )}
        >
          {name}
        </span>
        <OfferStatusBadge status={displayStatus} />
      </div>

      {/* Job title + dept */}
      <p className="text-[11px] text-neutral-500 truncate">
        {jobTitle}
        {dept ? ` · ${dept}` : ""}
      </p>

      {/* Production / Finance review progress dot */}
      {isPostAccept ? (
        <div className="flex items-center gap-1 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-[10px] text-amber-600 font-medium">
            {isAccountsReview ? "Finance review" : "Production review"}
          </span>
        </div>
      ) : (
        /* Updated at — only shown when not in post-accept review */
        offer.updatedAt && (
          <div className="flex items-center gap-1 mt-1">
            <Clock className="w-2.5 h-2.5 text-neutral-300" />
            <span className="text-[10px] text-neutral-400">
              {timeAgo(offer.updatedAt)}
            </span>
          </div>
        )
      )}
    </button>
  );
}