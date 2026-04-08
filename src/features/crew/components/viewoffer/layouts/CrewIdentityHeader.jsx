/**
 * CrewIdentityHeader.jsx
 *
 * CHANGES:
 *   - No longer reads URL search params directly (they get deleted by
 *     LayoutProductionAdmin's useEffects before this component can read them).
 *   - Instead accepts showExtendBtn / showEndContractBtn as props, which
 *     LayoutProductionAdmin captures once on mount via useState initializer
 *     before the params are cleaned from the URL.
 *
 * Props:
 *   contractData      : object  — fullName, jobTitle, department, engagementType,
 *                                 dailyOrWeekly, feePerDay, currency, startDate, endDate, email
 *   offer             : object  — for status badge + jobTitle override (createOwnJobTitle / newJobTitle)
 *   onExtend          : fn      — optional; called when Extend Contract button is clicked
 *   onEndContract     : fn      — optional; called when End Contract button is clicked
 *   showExtendBtn     : bool    — default true; set false when arriving via ?openEndContract=true
 *   showEndContractBtn: bool    — default true; set false when arriving via ?openExtend=true
 */

import { Calendar, User, CalendarDays, OctagonX } from "lucide-react";

const ENG_LABELS   = { paye: "PAYE", loan_out: "Loan Out", schd: "Schedule D", long_form: "Direct Hire" };
const CURRENCY_SYM = { GBP: "£", USD: "$", EUR: "€", AUD: "A$", CAD: "C$" };
const DEPT_LABELS  = {
  camera: "Camera", electrical: "Electrical", grip: "Grip", art: "Art",
  costume: "Costume", makeup: "Makeup", sound: "Sound", production: "Production",
  locations: "Locations", transport: "Transport", vfx: "VFX", editing: "Editing",
  construction: "Construction",
};

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_MAP = {
  DRAFT:                    { label: "Draft",             bg: "var(--muted)",         color: "var(--muted-foreground)",  border: "var(--border)"         },
  SENT_TO_CREW:             { label: "Awaiting Response", bg: "var(--peach-50)",      color: "var(--peach-600)",         border: "var(--peach-200)"      },
  NEEDS_REVISION:           { label: "Needs Revision",    bg: "var(--peach-100)",     color: "var(--peach-700)",         border: "var(--peach-300)"      },
  CREW_ACCEPTED:            { label: "Accepted",          bg: "var(--sky-50)",        color: "var(--sky-600)",           border: "var(--sky-200)"        },
  PRODUCTION_CHECK:         { label: "Production Review", bg: "var(--lavender-50)",   color: "var(--lavender-600)",      border: "var(--lavender-200)"   },
  ACCOUNTS_CHECK:           { label: "Accounts Review",   bg: "var(--lavender-100)",  color: "var(--lavender-700)",      border: "var(--lavender-300)"   },
  PENDING_CREW_SIGNATURE:   { label: "Crew Signature",    bg: "var(--lavender-50)",   color: "var(--lavender-500)",      border: "var(--lavender-200)"   },
  PENDING_UPM_SIGNATURE:    { label: "UPM Signature",     bg: "var(--lavender-50)",   color: "var(--lavender-500)",      border: "var(--lavender-200)"   },
  PENDING_FC_SIGNATURE:     { label: "FC Signature",      bg: "var(--lavender-50)",   color: "var(--lavender-500)",      border: "var(--lavender-200)"   },
  PENDING_STUDIO_SIGNATURE: { label: "Studio Signature",  bg: "var(--lavender-50)",   color: "var(--lavender-500)",      border: "var(--lavender-200)"   },
  COMPLETED:                { label: "Completed",         bg: "var(--mint-50)",       color: "var(--mint-600)",          border: "var(--mint-200)"       },
  CANCELLED:                { label: "Cancelled",         bg: "#fff1f1",              color: "#dc2626",                  border: "#fecaca"               },
  TERMINATED:               { label: "Terminated",        bg: "#fff1f1",              color: "#dc2626",                  border: "#fecaca"               },
  VOIDED:                   { label: "Voided",            bg: "var(--muted)",         color: "var(--muted-foreground)",  border: "var(--border)"         },
  REVISED:                  { label: "Revised",           bg: "var(--peach-50)",      color: "var(--peach-600)",         border: "var(--peach-200)"      },
};

function StatusBadge({ status }) {
  if (!status) return null;
  const cfg = STATUS_MAP[status] ?? {
    label: status,
    bg: "var(--muted)",
    color: "var(--muted-foreground)",
    border: "var(--border)",
  };
  return (
    <span
      className="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide shrink-0"
      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getInitials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

export function fmtDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return dateStr; }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CrewIdentityHeader({
  contractData = {},
  offer,
  onExtend,
  onEndContract,
  showExtendBtn = true,       // false when arriving via ?openEndContract=true
  showEndContractBtn = true,  // false when arriving via ?openExtend=true
}) {
  const jobTitle  = offer?.createOwnJobTitle && offer?.newJobTitle
    ? offer.newJobTitle
    : contractData.jobTitle || offer?.jobTitle || "";
  const engLabel  = ENG_LABELS[contractData.engagementType]  || contractData.engagementType  || "";
  const deptLabel = DEPT_LABELS[contractData.department]     || contractData.department       || "";
  const currency  = CURRENCY_SYM[contractData.currency]     || "£";
  const rate      = contractData.feePerDay
    ? `${currency}${parseFloat(contractData.feePerDay).toLocaleString()}/day` : "";
  const freq      = contractData.dailyOrWeekly === "weekly" ? "Weekly" : "Daily";
  const dateRange = (contractData.startDate || contractData.endDate)
    ? `${fmtDate(contractData.startDate)} – ${fmtDate(contractData.endDate)}` : "";

  const isCompleted = offer?.status === "COMPLETED";

  return (
    <div
      className="rounded-xl px-4 py-3 flex items-center justify-between gap-4 w-full"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {/* Left — avatar + details */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Avatar */}
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 select-none"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          {getInitials(contractData.fullName)}
        </div>

        <div className="min-w-0">

          {/* Row 1 — name + chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[14px] font-bold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              {contractData.fullName || "—"}
            </span>

            {jobTitle && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                style={{
                  background: "var(--lavender-50)",
                  color: "var(--lavender-600)",
                  border: "1px solid var(--lavender-200)",
                }}
              >
                {jobTitle}
              </span>
            )}

            {engLabel && (
              <>
                <span className="text-[11px]" style={{ color: "var(--border)" }}>·</span>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" style={{ color: "var(--muted-foreground)" }} />
                  <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                    {engLabel}
                  </span>
                </div>
              </>
            )}

            {deptLabel && (
              <>
                <span className="text-[11px]" style={{ color: "var(--border)" }}>·</span>
                <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  {deptLabel}
                </span>
              </>
            )}

            {rate && (
              <>
                <span className="text-[11px]" style={{ color: "var(--border)" }}>·</span>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {rate}
                </span>
              </>
            )}
          </div>

          {/* Row 2 — dates + freq + email */}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {dateRange && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 shrink-0" style={{ color: "var(--muted-foreground)" }} />
                <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  {dateRange}
                </span>
              </div>
            )}
            {dateRange && (
              <span className="text-[10px]" style={{ color: "var(--border)" }}>·</span>
            )}
            <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              {freq}
            </span>
            {contractData.email && (
              <>
                <span className="text-[10px]" style={{ color: "var(--border)" }}>·</span>
                <span
                  className="text-[10px] uppercase tracking-wide"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {contractData.email}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right — action buttons (COMPLETED only) + Status badge */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Extend Contract — shown when COMPLETED, handler provided, and showExtendBtn is true */}
        {isCompleted && onExtend && showExtendBtn && (
          <button
            onClick={onExtend}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-90"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Extend Contract
          </button>
        )}

        {/* End Contract — shown when COMPLETED, handler provided, and showEndContractBtn is true */}
        {isCompleted && onEndContract && showEndContractBtn && (
          <button
            onClick={onEndContract}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-90"
            style={{
              background: "var(--destructive)",
              color: "white",
            }}
          >
            <OctagonX className="w-3.5 h-3.5" />
            End Contract
          </button>
        )}

        <StatusBadge status={offer?.status} />
      </div>
    </div>
  );
}