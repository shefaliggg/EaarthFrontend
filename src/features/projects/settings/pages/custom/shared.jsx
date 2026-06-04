/**
 * _shared.jsx
 *
 * Small presentational helpers shared across all CustomSettings sub-components.
 * Import from here — never duplicate in sibling files.
 */

// ─── Option sets ──────────────────────────────────────────────────────────────

export const PAID_AS_OPTIONS = [
  { value: "PERCENTAGE", label: "Percentage" },
  { value: "FIXED",       label: "Fixed"       },
  { value: "HOURLY",       label: "Hourly"       },
];



export const FIELD_OPTIONS = [
  { value: "MILEAGE",   label: "Mileage"   },
  { value: "BOX",       label: "Box"       },
  { value: "COMPUTER",  label: "Computer"  },
  { value: "EQUIPMENT", label: "Equipment" },
  { value: "MOBILE",    label: "Mobile"    },
  { value: "SOFTWARE",  label: "Software"  },
  { value: "VEHICLE",   label: "Vehicle"   },
];

export const ALL_DEPARTMENTS = [
  "All Departments", "Camera", "Sound", "Grip", "Electric",
  "Art", "Costume", "Locations", "Transport", "Construction",
  "VFX", "Production", "Accounts",
];

/** Roles shown in the Rate Visibility Matrix inside Penny Contract Settings. */
export const VISIBILITY_ROLES = [
  { role: "Studio",                   standard: true,  penny: true  },
  { role: "Crew Member (Self)",       standard: true,  penny: true  },
  { role: "HOD (Head of Department)", standard: true,  penny: false },
  { role: "Department Members",       standard: true,  penny: false },
  { role: "Production",               standard: true,  penny: true  },
  { role: "Finance",                  standard: true,  penny: true  },
  { role: "Payroll",                  standard: true,  penny: true  },
];

// ─── Micro-components ─────────────────────────────────────────────────────────

/** Eye / hidden badge used in the Rate Visibility Matrix. */
export function EyeBadge({ visible }) {
  return visible ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
        <path d="M1.5 8c0-1.5 3-5 6.5-5s6.5 3.5 6.5 5-3 5-6.5 5-6.5-3.5-6.5-5z" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
      Visible
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-semibold text-red-500">
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
        <path d="M2 2l12 12M6.5 6.6A3 3 0 0110 9.5M4 4.7C2.5 5.9 1.5 7.2 1.5 8c0 1.5 3 5 6.5 5 1.5 0 2.8-.5 3.9-1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
      Hidden
    </span>
  );
}

/**
 * Inline form panel that wraps "Add …" forms — renders cancel + submit buttons.
 *
 * @param {React.ReactNode} children
 * @param {() => void}      onCancel
 * @param {() => void}      onSubmit
 * @param {string}          submitLabel
 * @param {boolean}         isSubmitting
 */
export function InlineAddForm({ children, onCancel, onSubmit, submitLabel, isSubmitting }) {
  return (
    <div className="mt-3 rounded-2xl border border-border bg-muted/40 p-5 space-y-4">
      {children}
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-full bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </div>
  );
}

/**
 * Dashed "add" row that appears below a DataTable.
 *
 * @param {string}    label
 * @param {() => void} onClick
 */
export function AddRowButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
    >
      <span className="text-base leading-none">+</span> {label}
    </button>
  );
}

/** Three-line animated skeleton shown while data is first loading. */
export function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 rounded-xl bg-muted" />
      ))}
    </div>
  );
}

/**
 * Inline error banner.
 *
 * @param {string}         message
 * @param {(() => void)=}  onRetry  – renders a "Retry" link when provided
 */
export function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-4">
      <span className="text-xs text-red-600">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold text-red-600 hover:underline ml-4"
        >
          Retry
        </button>
      )}
    </div>
  );
}