/**
 * ContractStepper.jsx — compact horizontal contract stepper.
 *
 * THEMING: All colors use CSS variables from index.css.
 *   --primary / --lavender-*  → active / current step
 *   --mint-*                  → signed / complete steps
 *   --muted / --border        → inactive steps
 */

import { useRef } from "react";
import { useSelector } from "react-redux";
import { Check, FileText } from "lucide-react";
import { cn } from "../../../../../shared/config/utils";
import { selectViewRole } from "../../../store/viewrole.slice";

// ── Signing order ─────────────────────────────────────────────────────────────

export const SIGNED_STATUSES = new Set([
  "CREW_SIGNED", "UPM_SIGNED", "FC_SIGNED", "STUDIO_SIGNED", "COMPLETED",
]);

export const isSignedStatus = (status) => SIGNED_STATUSES.has(status);

const SIGNED_FOR_ROLE = {
  CREW:             new Set(["CREW_SIGNED", "UPM_SIGNED", "FC_SIGNED", "STUDIO_SIGNED", "COMPLETED"]),
  UPM:              new Set(["UPM_SIGNED", "FC_SIGNED", "STUDIO_SIGNED", "COMPLETED"]),
  FC:               new Set(["FC_SIGNED", "STUDIO_SIGNED", "COMPLETED"]),
  STUDIO:           new Set(["STUDIO_SIGNED", "COMPLETED"]),
  PRODUCTION_ADMIN: SIGNED_STATUSES,
  ACCOUNTS_ADMIN:   SIGNED_STATUSES,
  SUPER_ADMIN:      SIGNED_STATUSES,
};

export function isSignedForRole(status, viewRole) {
  if (!viewRole) return SIGNED_STATUSES.has(status);
  const set = SIGNED_FOR_ROLE[viewRole] ?? SIGNED_STATUSES;
  return set.has(status);
}

// ── Status labels ─────────────────────────────────────────────────────────────

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

function getSubLabel(status, viewRole) {
  if (status === "COMPLETED") return "All signed";
  if (viewRole === "CREW") {
    return SIGNED_FOR_ROLE.CREW.has(status) ? "You signed" : "Sign required";
  }
  if (viewRole === "UPM") {
    if (SIGNED_FOR_ROLE.UPM.has(status)) return "UPM signed";
    if (status === "CREW_SIGNED") return "Awaiting UPM";
    return "Waiting";
  }
  if (viewRole === "FC") {
    if (SIGNED_FOR_ROLE.FC.has(status)) return "FC signed";
    if (["CREW_SIGNED", "UPM_SIGNED"].includes(status)) return "Awaiting FC";
    return "Waiting";
  }
  if (viewRole === "STUDIO") {
    if (SIGNED_FOR_ROLE.STUDIO.has(status)) return "Studio signed";
    if (["CREW_SIGNED", "UPM_SIGNED", "FC_SIGNED"].includes(status)) return "Awaiting Studio";
    return "Waiting";
  }
  return STATUS_LABEL[status] ?? "Draft";
}

// ── StepTab ───────────────────────────────────────────────────────────────────

function StepTab({ step, index, total, isActive, onClick, viewRole }) {
  const signed = isSignedForRole(step.status, viewRole);

  const bubbleStyle = signed
    ? {
        background: "var(--mint-500)",
        border: "2px solid var(--mint-500)",
        color: "#fff",
        boxShadow: "0 1px 3px var(--mint-200)",
      }
    : isActive
    ? {
        background: "var(--primary)",
        border: "2px solid var(--primary)",
        color: "var(--primary-foreground)",
        boxShadow: "0 1px 3px var(--lavender-200)",
      }
    : {
        background: "var(--card)",
        border: "2px solid var(--border)",
        color: "var(--muted-foreground)",
      };

  const labelStyle = signed
    ? { color: "var(--mint-600)", fontWeight: 600 }
    : isActive
    ? { color: "var(--primary)", fontWeight: 600 }
    : { color: "var(--muted-foreground)" };

  const subStyle = signed
    ? { color: "var(--mint-500)" }
    : isActive
    ? { color: "var(--lavender-400)" }
    : { color: "var(--muted-foreground)" };

  const connectorStyle = {
    height: "1px",
    width: "1rem",
    margin: "0 2px",
    borderRadius: "9999px",
    flexShrink: 0,
    background: signed ? "var(--mint-400)" : "var(--border)",
    transition: "background 0.3s",
  };

  return (
    <div className="flex items-center flex-shrink-0">
      <button
        onClick={() => onClick(index)}
        className="flex flex-col items-center group transition-all duration-200 px-1 min-w-[80px] max-w-[110px]"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 relative z-10"
          style={bubbleStyle}
        >
          {signed ? (
            <Check className="w-3 h-3" style={{ strokeWidth: 2.5 }} />
          ) : isActive ? (
            <FileText className="w-3 h-3" />
          ) : (
            <span className="text-[10px] font-semibold">{index + 1}</span>
          )}
        </div>
        <span
          className="mt-1 text-[9px] text-center leading-tight px-0.5 transition-colors duration-200 line-clamp-2"
          style={labelStyle}
        >
          {step.label}
        </span>
        <span
          className="text-[8px] mt-px leading-tight transition-colors duration-200"
          style={subStyle}
        >
          {step.sublabel ?? getSubLabel(step.status, viewRole)}
        </span>
      </button>
      {index < total - 1 && <div style={connectorStyle} />}
    </div>
  );
}

// ── Main ContractStepper ──────────────────────────────────────────────────────

export function ContractStepper({
  steps = [],
  activeIndex = 0,
  onSelect,
  viewRole: propViewRole,
}) {
  const trackRef  = useRef(null);
  const reduxRole = useSelector(selectViewRole);
  const viewRole  = propViewRole ?? reduxRole;

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