// ─── OffersListRow ───────────────────────────────────────────────────────────
// One row in the offer list. Hover reveals action buttons.

import { Eye, Pencil, PenLine, Stamp, ShieldCheck, Building2, Calculator, ClipboardCheck } from "lucide-react";
import { CrewAvatar } from "./CrewAvatar";
import { OfferStatusBadge } from "./OfferStatusBadge";
import { useParams } from "react-router-dom";

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
  return { loan_out: "Loan Out", paye: "PAYE", schd: "SCHD", long_form: "Long Form" }[type]
    || type.replace(/_/g, " ").toUpperCase();
}

function ActionButtons({ offer, onNavigate, projectName }) {
  const id     = offer.id || offer._id;
  const status = offer.status;
  const base   = `/projects/${projectName || "demo-project"}/offers/${id}`;

  const btn = (label, icon, color, path) => (
    <button
      key={label}
      onClick={() => onNavigate(path)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${color}`}
    >
      {icon}
      {label}
    </button>
  );

  const actions = [];

  // Contextual primary action based on status
  if (status === "PRODUCTION_CHECK")
    actions.push(btn("Review", <ClipboardCheck className="h-3.5 w-3.5" />,
      "bg-purple-600 text-white hover:bg-purple-700", `${base}/view`));

  if (status === "ACCOUNTS_CHECK")
    actions.push(btn("Accounts Review", <Calculator className="h-3.5 w-3.5" />,
      "bg-blue-600 text-white hover:bg-blue-700", `${base}/view`));

  if (status === "PENDING_CREW_SIGNATURE")
    actions.push(btn("Crew Sign", <PenLine className="h-3.5 w-3.5" />,
      "bg-teal-600 text-white hover:bg-teal-700", `${base}/sign`));

  if (status === "PENDING_UPM_SIGNATURE")
    actions.push(btn("UPM Sign", <Stamp className="h-3.5 w-3.5" />,
      "bg-indigo-600 text-white hover:bg-indigo-700", `${base}/sign`));

  if (status === "PENDING_FC_SIGNATURE")
    actions.push(btn("FC Sign", <ShieldCheck className="h-3.5 w-3.5" />,
      "bg-violet-600 text-white hover:bg-violet-700", `${base}/sign`));

  if (status === "PENDING_STUDIO_SIGNATURE")
    actions.push(btn("Studio Sign", <Building2 className="h-3.5 w-3.5" />,
      "bg-fuchsia-600 text-white hover:bg-fuchsia-700", `${base}/sign`));

  // Always show View + Edit
  actions.push(
    btn("View", <Eye className="h-3.5 w-3.5" />,
      "border border-neutral-200 text-neutral-600 hover:bg-neutral-50", `${base}/view`),
    btn("Edit", <Pencil className="h-3.5 w-3.5" />,
      "border border-purple-200 text-purple-700 hover:bg-purple-50", `${base}/edit`),
  );

  return (
    <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
      {actions}
    </div>
  );
}

export function OffersListRow({ offer, onNavigate, isLast, projectName }) {
  const params = useParams();
  const resolvedProjectName = projectName || params.projectName || "demo-project";

  const name    = offer.fullName || offer.recipient?.fullName || "Unnamed";
  const roles   = Array.isArray(offer.roles) ? offer.roles : [];
  const role    = roles[0];
  const dept    = role?.department || offer.department || "";
  const title   = role?.jobTitle   || offer.jobTitle   || "—";
  const rate    = role?.rateType   || (offer.dailyOrWeekly
    ? offer.dailyOrWeekly.charAt(0).toUpperCase() + offer.dailyOrWeekly.slice(1)
    : "—");
  const engType = getEngagementLabel(offer.contractType || offer.engagementType || "");
  const lastComment = offer.lastComment || null;

  const handleRowClick = () => {
    const id = offer.id || offer._id;
    onNavigate(`/projects/${resolvedProjectName}/offers/${id}/view`);
  };

  return (
    <div
      onClick={handleRowClick}
      className={`
        flex items-center gap-4 px-4 py-3
        hover:bg-purple-50/30 transition-colors group cursor-pointer
        ${!isLast ? "border-b border-neutral-100" : ""}
      `}
    >
      <CrewAvatar name={name} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[13px] font-semibold text-neutral-800 truncate">{name}</span>
          <OfferStatusBadge status={offer.status} />
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

      <div className="text-right shrink-0 mr-2 hidden md:block">
        <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Next Action</p>
        <p className="text-[11px] text-neutral-600 font-medium">{getNextAction(offer.status)}</p>
        {offer.updatedAt && (
          <p className="text-[10px] text-neutral-400">{timeAgo(offer.updatedAt)}</p>
        )}
      </div>

      <ActionButtons offer={offer} onNavigate={onNavigate} projectName={resolvedProjectName} />
    </div>
  );
}