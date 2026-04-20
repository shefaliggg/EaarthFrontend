// ─── OffersListRow ───────────────────────────────────────────────────────────
// One row in the offer list. Hover reveals action buttons.
// Delete is available for ALL offer statuses.
// Delete confirmation is handled by the parent (OffersList) via OfferActionDialog.
// LAYOUT: Buttons come BEFORE Next Action text, all in one aligned row.

import { useState, useRef, useEffect } from "react";
import {
  Eye, Pencil, PenLine, Stamp, ShieldCheck, Building2,
  Calculator, ClipboardCheck, Copy, CalendarDays, Trash2,
  MoreVertical,
} from "lucide-react";
import { CrewAvatar }       from "./CrewAvatar";
import { OfferStatusBadge } from "./OfferStatusBadge";
import { useParams }        from "react-router-dom";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getNextAction(status) {
  const map = {
    DRAFT:                    "Complete and send",
    SENT_TO_CREW:             "Awaiting crew response",
    NEEDS_REVISION:           "Review crew comments",
    CREW_ACCEPTED:            "Production review",
    PRODUCTION_CHECK:         "Verify requirements",
    ACCOUNTS_CHECK:           "Budget verification",
    PENDING_CREW_SIGNATURE:   "Awaiting crew signature",
    PENDING_UPM_SIGNATURE:    "Awaiting UPM signature",
    PENDING_FC_SIGNATURE:     "Awaiting FC signature",
    PENDING_STUDIO_SIGNATURE: "Awaiting studio approval",
    COMPLETED:                "Contract complete",
    CANCELLED:                "Offer cancelled",
    TERMINATED:               "Contract terminated",
    VOIDED:                   "Contract voided",
    REVISED:                  "Contract revised",
    DELETED:                  "Offer deleted",
  };
  return map[status] || "Review offer";
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getDeptLabel(val = "") {
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getEngagementLabel(type = "") {
  return (
    { loan_out: "Loan Out", paye: "PAYE", schd: "SCHD", long_form: "Long Form" }[type] ||
    type.replace(/_/g, " ").toUpperCase()
  );
}

// ── Primary contextual action button ─────────────────────────────────────────

function PrimaryActionButton({ status, onNavigate, base }) {
  if (status === "PRODUCTION_CHECK") {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(`${base}/view`); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors whitespace-nowrap"
      >
        <ClipboardCheck className="h-3.5 w-3.5" />
        Review
      </button>
    );
  }
  if (status === "ACCOUNTS_CHECK") {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(`${base}/view`); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
      >
        <Calculator className="h-3.5 w-3.5" />
        Accounts Review
      </button>
    );
  }
  if (status === "PENDING_CREW_SIGNATURE") {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(`${base}/view`); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors whitespace-nowrap"
      >
        <PenLine className="h-3.5 w-3.5" />
        Crew Sign
      </button>
    );
  }
  if (status === "PENDING_UPM_SIGNATURE") {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(`${base}/view`); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors whitespace-nowrap"
      >
        <Stamp className="h-3.5 w-3.5" />
        UPM Sign
      </button>
    );
  }
  if (status === "PENDING_FC_SIGNATURE") {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(`${base}/view`); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors whitespace-nowrap"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        FC Sign
      </button>
    );
  }
  if (status === "PENDING_STUDIO_SIGNATURE") {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(`${base}/view`); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-fuchsia-600 text-white hover:bg-fuchsia-700 transition-colors whitespace-nowrap"
      >
        <Building2 className="h-3.5 w-3.5" />
        Studio Sign
      </button>
    );
  }
  if (status === "COMPLETED") {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(`${base}/view?openExtend=true`); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors whitespace-nowrap"
      >
        <CalendarDays className="h-3.5 w-3.5" />
        Extend
      </button>
    );
  }
  return null;
}

// ── Three-dot dropdown menu ───────────────────────────────────────────────────

function DropdownMenu({ offer, onNavigate, onClone, onDeleteRequest, base, status }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isCloneable = !["DRAFT"].includes(status);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-700"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-1 w-52 rounded-xl shadow-xl border border-neutral-200 bg-white overflow-hidden"
          style={{ top: "100%" }}
        >
          {/* View */}
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onNavigate(`${base}/view`); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            View Offer
          </button>

          {/* Edit — only for editable statuses */}
          {["DRAFT", "NEEDS_REVISION", "PRODUCTION_CHECK", "ACCOUNTS_CHECK"].includes(status) && (
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); onNavigate(`${base}/edit`); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-neutral-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5 shrink-0" />
              Edit Offer
            </button>
          )}

          {/* Clone */}
          {isCloneable && (
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); onClone(offer); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-neutral-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 shrink-0" />
              Clone Offer
            </button>
          )}

          {/* Extend — completed only */}
          {status === "COMPLETED" && (
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); onNavigate(`${base}/view?openExtend=true`); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-neutral-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <CalendarDays className="w-3.5 h-3.5 shrink-0" />
              Extend Contract
            </button>
          )}

          {/* Delete — available for ALL statuses */}
          <div className="h-px bg-neutral-100 mx-2" />
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onDeleteRequest(offer); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            Delete Offer
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main row component ────────────────────────────────────────────────────────

export function OffersListRow({
  offer,
  onNavigate,
  onClone,
  onDeleteRequest,  // signals parent to open confirm dialog
  isLast,
  projectName,
  isDeleting = false,
}) {
  const params = useParams();
  const resolvedProjectName = projectName || params.projectName || "demo-project";

  const id     = offer.id || offer._id;
  const status = offer.status;
  const base   = `/projects/${resolvedProjectName}/offers/${id}`;

  const name    = offer.fullName || offer.recipient?.fullName || "Unnamed";
  const roles   = Array.isArray(offer.roles) ? offer.roles : [];
  const role    = roles[0];
  const dept    = role?.department || offer.department || "";
  const title   = role?.jobTitle   || offer.jobTitle   || "—";
  const rate    = role?.rateType   || (offer.dailyOrWeekly
    ? offer.dailyOrWeekly.charAt(0).toUpperCase() + offer.dailyOrWeekly.slice(1)
    : "—");
  const engType     = getEngagementLabel(offer.contractType || offer.engagementType || "");
  const lastComment = offer.lastComment || null;

  const handleRowClick = () => {
    onNavigate(`/projects/${resolvedProjectName}/offers/${id}/view`);
  };

  const handleClone = (e) => {
    e?.stopPropagation?.();
    if (onClone) onClone(offer);
  };

  const handleDeleteRequest = (e) => {
    e?.stopPropagation?.();
    if (onDeleteRequest) onDeleteRequest(offer);
  };

  return (
    <div
      onClick={handleRowClick}
      className={`
        flex items-center gap-3 px-4 py-3
        hover:bg-purple-50/30 transition-colors group cursor-pointer
        ${!isLast ? "border-b border-neutral-100" : ""}
        ${isDeleting ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      {/* Avatar */}
      <CrewAvatar name={name} />

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[13px] font-semibold text-neutral-800 truncate">{name}</span>
          <OfferStatusBadge status={status} />
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-400 flex-wrap">
          <span className="font-medium text-neutral-500">{title}</span>
          <span>·</span>
          <span>{rate} / {engType}</span>
          {dept && (
            <>
              <span>·</span>
              <span>{getDeptLabel(dept)}</span>
            </>
          )}
        </div>
        {lastComment && (
          <p className="text-[10px] text-amber-600 mt-0.5 truncate max-w-[500px]">
            Crew comment: "{lastComment}"
          </p>
        )}
      </div>

      {/* RIGHT SIDE: Action buttons FIRST, then Next Action text */}
      {/* Action buttons — visible on hover */}
      <div
        className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Contextual primary signing/action button */}
        <PrimaryActionButton status={status} onNavigate={onNavigate} base={base} />

        {/* Always: View */}
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(`${base}/view`); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors whitespace-nowrap"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>

        {/* Edit — only for editable statuses */}
        {["DRAFT", "NEEDS_REVISION", "PRODUCTION_CHECK", "ACCOUNTS_CHECK"].includes(status) && (
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate(`${base}/edit`); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors whitespace-nowrap"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        )}

        {/* Clone — all non-DRAFT statuses */}
        {!["DRAFT"].includes(status) && (
          <button
            onClick={handleClone}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-violet-200 text-violet-700 hover:bg-violet-50 transition-colors whitespace-nowrap"
          >
            <Copy className="h-3.5 w-3.5" />
            Clone
          </button>
        )}

        {/* Delete — ALL statuses */}
        <button
          onClick={handleDeleteRequest}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>

        {/* Three-dot overflow menu */}
        <DropdownMenu
          offer={offer}
          onNavigate={onNavigate}
          onClone={handleClone}
          onDeleteRequest={handleDeleteRequest}
          base={base}
          status={status}
        />
      </div>

      {/* Next Action label — AFTER buttons, hidden on mobile */}
      <div className="text-right shrink-0 hidden md:block min-w-[120px]">
        <p className="text-[10px] text-neutral-400 uppercase tracking-wider whitespace-nowrap">Next Action</p>
        <p className="text-[11px] text-neutral-600 font-medium whitespace-nowrap">{getNextAction(status)}</p>
        {offer.updatedAt && (
          <p className="text-[10px] text-neutral-400 whitespace-nowrap">{timeAgo(offer.updatedAt)}</p>
        )}
      </div>
    </div>
  );
}