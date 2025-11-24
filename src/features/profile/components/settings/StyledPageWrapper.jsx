import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// Breadcrumb Component
export function Breadcrumbs({ items }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-sm font-medium hover:text-primary transition-all duration-300 text-muted-foreground"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-sm font-semibold text-foreground">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// Page Wrapper with Full Width
export function StyledPageWrapper({
  children,
  title,
  subtitle,
  icon: Icon,
  actions,
  breadcrumbs,
  sidebar,
}) {
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      {sidebar && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-64 flex-shrink-0 border-r border-sidebar-border p-6 bg-sidebar"
        >
          {sidebar}
        </motion.div>
      )}

      {/* Main Content - Full Width */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen p-8 bg-background">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} />
          )}

          {/* Page Header */}
          {(title || actions) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {Icon && (
                    <div className="w-11 h-11 bg-primary rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                  <div>
                    {title && (
                      <h1 className="font-semibold text-foreground text-xl">
                        {title}
                      </h1>
                    )}
                    {subtitle && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            </motion.div>
          )}

          {/* Content */}
          <div className="space-y-6 animate-fadeIn">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Card Component
export function StyledCard({
  children,
  title,
  subtitle,
  icon: Icon,
  actions,
  className = '',
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`rounded-lg border shadow-md border-border overflow-hidden bg-card ${className}`}
    >
      {/* Card Header */}
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary">
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div>
                {title && (
                  <h3 className="font-semibold text-card-foreground text-base">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 text-card-foreground">
        {children}
      </div>
    </motion.div>
  );
}

// Filter Pills Component
export function StyledFilterPills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.value;
        return (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 border flex items-center gap-2 ${
              isActive
                ? 'bg-primary text-primary-foreground border-transparent'
                : 'bg-card border-border text-foreground hover:border-primary hover:bg-muted/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// Input Component
export function StyledInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  disabled = false,
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2.5 border border-border rounded-lg outline-none transition-all duration-400 font-normal bg-input text-foreground placeholder-muted-foreground focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    />
  );
}

// Select Component
export function StyledSelect({
  value,
  onChange,
  options,
  className = '',
  disabled = false,
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-4 py-2.5 border border-border rounded-lg outline-none transition-all duration-400 font-normal bg-input text-foreground focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Button Component
export function StyledButton({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  disabled = false,
  className = '',
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary hover:opacity-90 text-primary-foreground hover:border-gray-300';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:opacity-90';
      case 'outline':
        return 'bg-card border border-border text-foreground hover:border-primary hover:bg-muted/50';
      case 'danger':
        return 'bg-destructive text-destructive-foreground hover:opacity-90 hover:border-gray-300';
      default:
        return '';
    }
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${getVariantClasses()} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
}

// Sidebar Navigation Item
export function SidebarNavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
  badge,
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
        active
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          active 
            ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground' 
            : 'bg-primary/10 text-primary'
        }`}>
          {badge}
        </span>
      )}
    </motion.button>
  );
}

// Table Component
export function StyledTable({ headers, children, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-lg border shadow-md border-border ${className}`}>
      <table className="w-full">
        <thead className="bg-muted/30 border-b border-border">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {children}
        </tbody>
      </table>
    </div>
  );
}

// Table Row Component
export function StyledTableRow({ children, onClick, className = '' }) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors duration-200 hover:bg-muted/30 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </tr>
  );
}

// Table Cell Component
export function StyledTableCell({ children, className = '' }) {
  return (
    <td className={`px-6 py-4 text-sm text-card-foreground ${className}`}>
      {children}
    </td>
  );
}

// Badge Component
export function StyledBadge({ children, variant = 'default', className = '' }) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'default':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'secondary':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'success':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'danger':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'outline':
        return 'bg-transparent text-foreground border-border';
      default:
        return '';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getVariantClasses()} ${className}`}
    >
      {children}
    </span>
  );
}

// Alert Component
export function StyledAlert({ children, variant = 'info', icon: Icon, className = '' }) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'info':
        return 'bg-primary/5 border-primary/20 text-foreground';
      case 'success':
        return 'bg-accent/5 border-accent/20 text-foreground';
      case 'warning':
        return 'bg-secondary/5 border-secondary/20 text-foreground';
      case 'danger':
        return 'bg-destructive/5 border-destructive/20 text-foreground';
      default:
        return '';
    }
  };

  return (
    <div className={`rounded-lg border shadow-md p-4 ${getVariantClasses()} ${className}`}>
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-current" />
        )}
        <div className="flex-1 text-sm">{children}</div>
      </div>
    </div>
  );
}

// Divider Component
export function StyledDivider({ label, className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-border" />
      {label && (
        <>
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <div className="flex-1 h-px bg-border" />
        </>
      )}
    </div>
  );
}

// Textarea Component
export function StyledTextarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
  disabled = false,
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`w-full px-4 py-2.5 border border-border rounded-lg outline-none transition-all duration-400 font-normal bg-input text-foreground placeholder-muted-foreground focus:border-primary resize-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    />
  );
}







