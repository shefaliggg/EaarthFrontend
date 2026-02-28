/**
 * HighlightField
 *
 * Wraps a single field value. When `active` is true it applies a blue
 * highlight to just that cell — a soft blue background on the value text,
 * matching the screenshot behaviour where only the focused field row
 * gets highlighted, not the whole section.
 */
export function HighlightField({ fieldName, active, onClick, children, className = "" }) {
  return (
    <div
      data-field={fieldName}
      onClick={() => onClick && onClick(fieldName)}
      className={`
        rounded px-1 -mx-1 transition-all duration-150
        ${active
          ? "bg-blue-100/80 ring-1 ring-blue-300 ring-offset-0"
          : "hover:bg-purple-50/60"
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}