import { motion } from "framer-motion";

const accentColor = "#7c3aed";

/**
 * SettingsSection
 * Animated card wrapper with accent bar, title, subtitle, hover gradient.
 *
 * Props:
 *  - title: string
 *  - subtitle?: string
 *  - headerRight?: ReactNode   (e.g. the "N departments" count label)
 *  - children: ReactNode
 */
export function SettingsSection({ title, subtitle, headerRight, children }) {
  return ( 
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-2xl overflow-hidden group"
    >
      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${accentColor}15, transparent 60%)` }}
      />

      <div className="rounded-2xl bg-card border border-gray-100/80 dark:border-gray-800/50 shadow-sm transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {/* Accent bar */}
            <div
              className="w-1.5 h-5 rounded-full origin-center transition-transform duration-300 ease-out group-hover:scale-y-125"
              style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}60)` }}
            />
            <div className="flex flex-col">
              <h3 className="text-gray-900 dark:text-gray-100 text-sm">{title}</h3>
              {subtitle && (
                <p className="text-gray-400 dark:text-gray-500 text-[0.6rem] mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>

        {/* Body */}
        <div className="p-4">{children}</div>
      </div>
    </motion.section>
  );
}