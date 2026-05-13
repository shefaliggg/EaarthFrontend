import {
  BrainCircuit,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn, formatDate } from "@/shared/config/utils";
import { StatusBadge } from "../../../../shared/components/badges/StatusBadge";
import { InfoPanel } from "../../../../shared/components/panels/InfoPanel";
import { getCountryOptions } from "@/shared/config/countriesDataConfig";
import { getCountryLabel } from "../../../../shared/config/countriesDataConfig";

// ─────────────────────────────────────────────────────────────
// AI Scan Banner
// ─────────────────────────────────────────────────────────────

export function AIScanBanner({
  status,
  error,
  autoFilledCount = 0,
  conflictCount = 0,
}) {
  if (status === "idle") return null;

  if (status === "scanning") {
    return (
      <InfoPanel
        icon={Info}
        title="Scanning document"
        variant="info"
        className="animate-in fade-in-0"
      >
        <div className="flex items-center justify-between gap-3">
          <p>Extracting details using AI.</p>
        </div>
      </InfoPanel>
    );
  }

  if (status === "error") {
    return (
      <InfoPanel
        icon={AlertCircle}
        title="Unable to scan document"
        variant="danger"
      >
        <div className="space-y-2">
          <p>
            {typeof error === "object"
              ? error?.message
              : error || "Please enter the details manually."}
          </p>

          <p className="text-[11px] opacity-70">
            You can still continue by filling the fields manually.
          </p>
        </div>
      </InfoPanel>
    );
  }

  if (autoFilledCount === 0 && conflictCount === 0) {
    return (
      <InfoPanel icon={CheckCircle2} title="AI Scan completed" variant="success">
        <p>Everything is already up to date.</p>
      </InfoPanel>
    );
  }

  return (
    <InfoPanel icon={CheckCircle2} title="AI scan completed" variant="success">
      <div className="flex flex-wrap items-center gap-2">
        {autoFilledCount > 0 && (
          <StatusBadge
            status="success"
            label={`${autoFilledCount} fields filled`}
            size="sm"
          />
        )}

        {conflictCount > 0 && (
          <StatusBadge
            status="warning"
            label={`${conflictCount} review needed`}
            size="sm"
          />
        )}
      </div>
    </InfoPanel>
  );
}

// ─────────────────────────────────────────────────────────────
// Conflict Panel
// ─────────────────────────────────────────────────────────────

export function AIConflictPanel({ conflicts, onAccept, onReject }) {
  if (!conflicts?.length) return null;

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 overflow-hidden bg-amber-50/40 dark:bg-amber-950/10">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <div className="flex size-10 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900/40">
          <BrainCircuit className="size-4 text-amber-600 dark:text-amber-400" />
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">
            Review suggested updates
          </p>

          <p className="text-xs text-muted-foreground">
            AI found a few values that differ from the current information
          </p>
        </div>
      </div>

      {/* Conflict rows */}
      <div className="divide-y divide-amber-100 dark:divide-amber-900/40 p-1 pb-3">
        {conflicts.map((conflict) => (
          <ConflictRow
            key={conflict.aiKey}
            conflict={conflict}
            onAccept={onAccept}
            onReject={onReject}
          />
        ))}
      </div>
    </div>
  );
}

function ConflictRow({ conflict, onAccept, onReject }) {
  console.log("conflict value in row:", conflict);
  return (
    <div className="px-4 py-3 space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {conflict.label}
      </p>

      <div className="grid grid-cols-2 gap-2">
        {/* Current value */}
        <div className="bg-card rounded-lg border px-3 py-2.5 space-y-1.5">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
            Current
          </p>
          <p className="text-sm font-medium truncate">
            {formatConflictValue(conflict.currentValue, conflict)}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 w-full text-xs"
            onClick={() => onReject(conflict)}
          >
            Keep this
          </Button>
        </div>

        {/* AI suggestion */}
        <div className="bg-primary/5 rounded-lg border border-primary/20 px-3 py-2.5 space-y-1.5">
          <p className="text-[10px] text-primary font-medium uppercase tracking-wide flex items-center gap-1">
            <Sparkles className="size-2.5" />
            AI suggested
          </p>
          <p className="text-sm font-medium truncate">
            {formatConflictValue(conflict.aiValue, conflict)}
          </p>
          <Button
            type="button"
            size="sm"
            className="h-7 w-full text-xs"
            onClick={() => onAccept(conflict)}
          >
            Use this
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AI Filled Badge
// ─────────────────────────────────────────────────────────────

export function AIFilledBadge({ className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary",
        className,
      )}
    >
      <Sparkles className="size-2.5" />
      AI Filled
    </span>
  );
}

function formatConflictValue(value, conflict) {
  if (!value) return "—";

  // Format dates
  if (/^\d{4}-\d{2}-\d{2}/.test(String(value))) {
    return formatDate(value);
  }

  // Convert country ISO code -> country name
  const isCountryField =
    conflict?.aiKey === "issuingCountry" ||
    conflict?.formPath?.includes("issuingCountry") ||
    conflict?.formPath?.includes("country");

  console.log("is country field:", isCountryField, conflict);
  if (isCountryField) {
    return getCountryLabel(value) || value;
  }

  return String(value);
}
