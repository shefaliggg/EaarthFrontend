// ─── OfferStatusBadge ────────────────────────────────────────────────────────
// Matches the old dashboard's tiny uppercase tracking badge style.

const STATUS_STYLES = {
  "DRAFT":            { bg: "bg-neutral-100",  text: "text-neutral-600",  border: "border-neutral-200" },
  "OFFER SENT":       { bg: "bg-blue-50",       text: "text-blue-700",     border: "border-blue-200"    },
  "REQUIRES ATTENTION":{ bg: "bg-red-50",       text: "text-red-700",      border: "border-red-200"     },
  "CREW ACCEPTED":    { bg: "bg-emerald-50",    text: "text-emerald-700",  border: "border-emerald-200" },
  "PRODUCTION CHECK": { bg: "bg-purple-50",     text: "text-purple-700",   border: "border-purple-200"  },
  "ACCOUNTS CHECK":   { bg: "bg-blue-50",       text: "text-blue-700",     border: "border-blue-200"    },
  "CREW SIGN":        { bg: "bg-teal-50",       text: "text-teal-700",     border: "border-teal-200"    },
  "UPM SIGN":         { bg: "bg-indigo-50",     text: "text-indigo-700",   border: "border-indigo-200"  },
  "FC SIGN":          { bg: "bg-violet-50",     text: "text-violet-700",   border: "border-violet-200"  },
  "STUDIO SIGN":      { bg: "bg-fuchsia-50",    text: "text-fuchsia-700",  border: "border-fuchsia-200" },
  "CONTRACTED":       { bg: "bg-emerald-50",    text: "text-emerald-700",  border: "border-emerald-200" },
};

export function getStatusLabel(rawStatus) {
  const map = {
    DRAFT:                    "DRAFT",
    SENT_TO_CREW:             "OFFER SENT",
    NEEDS_REVISION:           "REQUIRES ATTENTION",
    CREW_ACCEPTED:            "CREW ACCEPTED",
    PRODUCTION_CHECK:         "PRODUCTION CHECK",
    ACCOUNTS_CHECK:           "ACCOUNTS CHECK",
    PENDING_CREW_SIGNATURE:   "CREW SIGN",
    PENDING_UPM_SIGNATURE:    "UPM SIGN",
    PENDING_FC_SIGNATURE:     "FC SIGN",
    PENDING_STUDIO_SIGNATURE: "STUDIO SIGN",
    COMPLETED:                "CONTRACTED",
  };
  return map[rawStatus] || rawStatus;
}

export function OfferStatusBadge({ status }) {
  const label  = getStatusLabel(status);
  const styles = STATUS_STYLES[label] || { bg: "bg-muted", text: "text-muted-foreground", border: "border-muted" };

  return (
    <span
      className={`
        inline-flex items-center
        text-[9px] px-2 py-0.5 rounded
        font-semibold tracking-wider uppercase
        border
        ${styles.bg} ${styles.text} ${styles.border}
      `}
    >
      {label}
    </span>
  );
}