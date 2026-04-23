/**
 * OfferListItem.jsx
 *
 * Compact offer row used inside the left-panel offer list on the MyOffer page.
 *
 * Props:
 *   offer       — offer object from Redux
 *   isSelected  — boolean
 *   onClick     — () => void
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

export function OfferListItem({ offer, isSelected = false, onClick }) {
  const name =
    offer.recipient?.fullName || offer.fullName || "—";
  const jobTitle =
    offer.createOwnJobTitle && offer.newJobTitle
      ? offer.newJobTitle
      : offer.jobTitle || "—";
  const dept = offer.department ? deptLabel(offer.department) : null;

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
        <OfferStatusBadge status={offer.status} />
      </div>

      {/* Job title + dept */}
      <p className="text-[11px] text-neutral-500 truncate">
        {jobTitle}
        {dept ? ` · ${dept}` : ""}
      </p>

      {/* Updated at */}
      {offer.updatedAt && (
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-2.5 h-2.5 text-neutral-300" />
          <span className="text-[10px] text-neutral-400">
            {timeAgo(offer.updatedAt)}
          </span>
        </div>
      )}
    </button>
  );
}