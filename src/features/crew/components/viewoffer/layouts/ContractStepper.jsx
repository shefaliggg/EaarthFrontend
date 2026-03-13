/**
 * ContractStepper.jsx — compact horizontal contract stepper
 */

import { useRef } from "react";
import { Check, FileText } from "lucide-react";
import { cn } from "../../../../../shared/config/utils";

export const SIGNED_STATUSES = new Set([
  "CREW_SIGNED", "UPM_SIGNED", "FC_SIGNED", "STUDIO_SIGNED", "COMPLETED",
]);

export const isSignedStatus = (status) => SIGNED_STATUSES.has(status);

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

function StepTab({ step, index, total, isActive, onClick }) {
  const signed = step.signed ?? isSignedStatus(step.status);

  return (
    <div className="flex items-center flex-shrink-0">
      <button
        onClick={() => onClick(index)}
        className="flex flex-col items-center group transition-all duration-200 px-1 min-w-[80px] max-w-[110px]"
      >
        {/* Bubble — smaller */}
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

        {/* Sub-status */}
        <span className={cn(
          "text-[8px] mt-px leading-tight transition-colors duration-200",
          signed   ? "text-emerald-500" :
          isActive ? "text-violet-400" :
                     "text-neutral-400"
        )}>
          {step.sublabel ?? STATUS_LABEL[step.status] ?? "Draft"}
        </span>
      </button>

      {/* Connector */}
      {index < total - 1 && (
        <div className={cn(
          "h-px w-4 mx-px rounded-full flex-shrink-0 transition-colors duration-300",
          signed ? "bg-emerald-400" : "bg-neutral-200"
        )} />
      )}
    </div>
  );
}

export function ContractStepper({ steps = [], activeIndex = 0, onSelect }) {
  const trackRef = useRef(null);

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
          />
        </div>
      ))}
    </div>
  );
}

export default ContractStepper;