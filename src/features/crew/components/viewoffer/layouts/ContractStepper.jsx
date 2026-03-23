/**
 * ContractStepper.jsx — compact horizontal contract stepper
 *
 * FIX: Role-aware signing display.
 *
 * The instance status reflects the LAST person who signed:
 *   CREW_SIGNED → crew signed, waiting for UPM
 *   UPM_SIGNED  → upm signed, waiting for FC
 *   FC_SIGNED   → fc signed, waiting for Studio
 *   STUDIO_SIGNED / COMPLETED → fully signed
 *
 * RULE: A step is "signed" (green) only when the instance status means
 * ALL required signatures UP TO AND INCLUDING that role are collected.
 *
 * So:
 *   viewRole CREW    → signed if status is any signed status (they already signed)
 *   viewRole UPM     → signed if status is UPM_SIGNED, FC_SIGNED, STUDIO_SIGNED, COMPLETED
 *   viewRole FC      → signed if status is FC_SIGNED, STUDIO_SIGNED, COMPLETED
 *   viewRole STUDIO  → signed if status is STUDIO_SIGNED, COMPLETED
 *   PRODUCTION_ADMIN → show ALL green (they can see full picture)
 *
 * When no viewRole passed → use full signed set (production/admin view).
 */

import { useRef } from "react";
import { useSelector } from "react-redux";
import { Check, FileText, Clock } from "lucide-react";
import { cn } from "../../../../../shared/config/utils";
import { selectViewRole } from "../../../store/viewrole.slice";

// ── Signing order ─────────────────────────────────────────────────────────────

export const SIGNED_STATUSES = new Set([
  "CREW_SIGNED", "UPM_SIGNED", "FC_SIGNED", "STUDIO_SIGNED", "COMPLETED",
]);

export const isSignedStatus = (status) => SIGNED_STATUSES.has(status);

// Statuses that count as "signed" for each role
// i.e. "has THIS role's signature been collected yet?"
const SIGNED_FOR_ROLE = {
  CREW:              new Set(["CREW_SIGNED","UPM_SIGNED","FC_SIGNED","STUDIO_SIGNED","COMPLETED"]),
  UPM:               new Set(["UPM_SIGNED","FC_SIGNED","STUDIO_SIGNED","COMPLETED"]),
  FC:                new Set(["FC_SIGNED","STUDIO_SIGNED","COMPLETED"]),
  STUDIO:            new Set(["STUDIO_SIGNED","COMPLETED"]),
  PRODUCTION_ADMIN:  SIGNED_STATUSES,
  ACCOUNTS_ADMIN:    SIGNED_STATUSES,
  SUPER_ADMIN:       SIGNED_STATUSES,
};

/**
 * Is this instance "signed" from the perspective of `viewRole`?
 * Returns true only when the role's own signature has been collected.
 */
export function isSignedForRole(status, viewRole) {
  if (!viewRole) return SIGNED_STATUSES.has(status);
  const set = SIGNED_FOR_ROLE[viewRole] ?? SIGNED_STATUSES;
  return set.has(status);
}

// ── Status label ──────────────────────────────────────────────────────────────

const STATUS_LABEL = {
  DRAFT:                  "Draft",
  PENDING_REVIEW:         "Pending",
  PENDING_CREW_SIGNATURE: "Awaiting sig.",
  CREW_SIGNED:            "Crew signed",
  UPM_SIGNED:             "UPM signed",
  FC_SIGNED:              "FC signed",
  STUDIO_SIGNED:          "Studio signed",
  COMPLETED:              "Completed",
  SUPERSEDED:             "Superseded",
  VOIDED:                 "Voided",
};

// ── Step label for the sub-status shown under each doc ───────────────────────
// When viewed by a specific role, show a friendlier label

function getSubLabel(status, viewRole) {
  if (status === "COMPLETED") return "All signed";

  if (viewRole === "CREW") {
    if (SIGNED_FOR_ROLE.CREW.has(status)) return "You signed";
    return "Sign required";
  }
  if (viewRole === "UPM") {
    if (SIGNED_FOR_ROLE.UPM.has(status)) return "UPM signed";
    if (status === "CREW_SIGNED") return "Awaiting UPM";
    return "Waiting";
  }
  if (viewRole === "FC") {
    if (SIGNED_FOR_ROLE.FC.has(status)) return "FC signed";
    if (["CREW_SIGNED","UPM_SIGNED"].includes(status)) return "Awaiting FC";
    return "Waiting";
  }
  if (viewRole === "STUDIO") {
    if (SIGNED_FOR_ROLE.STUDIO.has(status)) return "Studio signed";
    if (["CREW_SIGNED","UPM_SIGNED","FC_SIGNED"].includes(status)) return "Awaiting Studio";
    return "Waiting";
  }

  // Admin / default — show actual status label
  return STATUS_LABEL[status] ?? "Draft";
}

// ── StepTab ───────────────────────────────────────────────────────────────────

function StepTab({ step, index, total, isActive, onClick, viewRole }) {
  // Use role-aware signed check
  const signed  = isSignedForRole(step.status, viewRole);
  // "my turn" — this role needs to sign this doc
  const myTurn  = !signed && isActive;

  return (
    <div className="flex items-center flex-shrink-0">
      <button
        onClick={() => onClick(index)}
        className="flex flex-col items-center group transition-all duration-200 px-1 min-w-[80px] max-w-[110px]"
      >
        {/* Bubble */}
        <div className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-200 relative z-10",
          signed
            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-200"
            : isActive
            ? "bg-violet-600 border-violet-600 text-white shadow-sm shadow-violet-200"
            : "bg-white border-neutral-200 text-neutral-400 group-hover:border-violet-300 group-hover:text-violet-500"
        )}>
          {signed
            ? <Check className="w-3 h-3 stroke-[2.5]" />
            : isActive
            ? <FileText className="w-3 h-3" />
            : <span className="text-[10px] font-semibold">{index + 1}</span>
          }
        </div>

        {/* Form name */}
        <span className={cn(
          "mt-1 text-[9px] text-center leading-tight px-0.5 transition-colors duration-200 line-clamp-2",
          signed   ? "text-emerald-600 font-semibold" :
          isActive ? "text-violet-700 font-semibold" :
                     "text-neutral-500 group-hover:text-neutral-700"
        )}>
          {step.label}
        </span>

        {/* Sub-status — role aware */}
        <span className={cn(
          "text-[8px] mt-px leading-tight transition-colors duration-200",
          signed   ? "text-emerald-500" :
          isActive ? "text-violet-400" :
                     "text-neutral-400"
        )}>
          {step.sublabel ?? getSubLabel(step.status, viewRole)}
        </span>
      </button>

      {/* Connector — green only if this step is signed for this role */}
      {index < total - 1 && (
        <div className={cn(
          "h-px w-4 mx-px rounded-full flex-shrink-0 transition-colors duration-300",
          signed ? "bg-emerald-400" : "bg-neutral-200"
        )} />
      )}
    </div>
  );
}

// ── Main ContractStepper ──────────────────────────────────────────────────────

export function ContractStepper({ steps = [], activeIndex = 0, onSelect, viewRole: propViewRole }) {
  const trackRef    = useRef(null);
  // Read from Redux if not passed as prop
  const reduxRole   = useSelector(selectViewRole);
  const viewRole    = propViewRole ?? reduxRole;

  const handleSelect = (i) => {
    onSelect?.(i);
    setTimeout(() => {
      const tabs = trackRef.current?.querySelectorAll(".cs-tab");
      tabs?.[i]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }, 40);
  };

  if (!steps.length) return null;

  return (
    <div
      ref={trackRef}
      className="flex items-start overflow-x-auto pb-1"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {steps.map((step, i) => (
        <div key={step.id ?? i} className="cs-tab flex items-center flex-shrink-0">
          <StepTab
            step={step}
            index={i}
            total={steps.length}
            isActive={i === activeIndex}
            onClick={handleSelect}
            viewRole={viewRole}
          />
        </div>
      ))}
    </div>
  );
}

export default ContractStepper;