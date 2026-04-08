const accentColor = "#7c3aed";

/**
 * SettingsCard
 * The rounded card with a title, gradient divider, and slotted body.
 * Used for both category cards and form group cards.
 *
 * Props:
 *  - title: string
 *  - children: ReactNode  (the list of rows)
 */
export function SettingsCard({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-card hover:border-purple-200 dark:hover:border-purple-800 transition-colors group/card">
      <h1 className="truncate mx-3 mt-3 mb-2 text-gray-800 dark:text-gray-200 uppercase">
        {title}
      </h1>

      {/* Gradient divider */}
      <div
        className="h-px mx-3"
        style={{
          background: `linear-gradient(to right, ${accentColor}40, ${accentColor}15, transparent)`,
        }}
      />

      <div className="pl-4 pr-3 py-2 space-y-1">{children}</div>
    </div>
  );
}