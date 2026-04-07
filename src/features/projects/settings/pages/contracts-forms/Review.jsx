import { useLocation } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Layers, FileText } from "lucide-react";

function AutoIframe({ html, title }) {
  if (!html) {
    return (
      <div className="flex items-center justify-center h-[400px] text-sm" style={{ color: "var(--muted-foreground)" }}>
        No template available
      </div>
    );
  }

  return (
    <iframe
      srcDoc={html}
      title={title}
      className="w-full border-0 block"
      style={{ height: "1200px" }}
      scrolling="no"
    />
  );
}

export default function Preview() {
  const { state } = useLocation();

  const override = state?.override;
  const rawForms = override?.bundle?.forms || [];

  const forms = rawForms
    .map((form) => {
      const html =
        form.formGroupId?.forms?.find(
          (f) => f.key === form.formKey
        )?.htmlTemplate || "";

      return {
        ...form,
        html,
      };
    })
    .filter((f) => f.html);

  const [activeIdx, setActiveIdx] = useState(0);

  const current = forms[activeIdx];
  const total = forms.length;

  if (!forms.length) {
    return (
      <div className="flex items-center justify-center py-20 text-sm" style={{ color: "var(--muted-foreground)" }}>
        No previewable forms
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Bundle Header */}
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div
          className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
          style={{ background: "var(--primary)" }}
        >
          <Layers className="w-4 h-4" style={{ color: "var(--primary-foreground)" }} />
        </div>
        <div>
          <h2 className="text-[13px] font-bold" style={{ color: "var(--foreground)" }}>
            {override.bundle?.name || "Bundle"}
          </h2>
          <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
            {total} forms in bundle
          </p>
        </div>
      </div>

      {/* Form Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {forms.map((form, i) => (
          <button
            key={form.formKey}
            onClick={() => setActiveIdx(i)}
            className="px-3 py-1.5 rounded-lg text-[12px] transition-all whitespace-nowrap"
            style={{
              border: "1px solid var(--border)",
              background: i === activeIdx ? "var(--primary)" : "var(--card)",
              color: i === activeIdx ? "var(--primary-foreground)" : "var(--muted-foreground)",
            }}
          >
            {form.formName}
          </button>
        ))}
      </div>

      {/* Document Card */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ background: "var(--primary)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">
              {current.formName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[8px] font-bold px-1.5 py-px rounded border uppercase tracking-wider"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              >
                {current.displayType?.toUpperCase() || "FORM"}
              </span>
              <span
                className="text-[8px] font-mono uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                DOC {activeIdx + 1} OF {total}
              </span>
            </div>
          </div>
        </div>

        {/* Iframe */}
        <div className="px-5 py-4" style={{ background: "var(--lavender-50)" }}>
          <div
            className="rounded-lg overflow-hidden"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <AutoIframe html={current.html} title={current.formName} />
          </div>
        </div>

        {total > 1 && (
          <div
            className="flex justify-between items-center px-5 py-3"
            style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}
          >
            <button
              onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
              disabled={activeIdx === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ border: "1px solid var(--border)", color: "var(--foreground)", background: "var(--card)" }}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
              {activeIdx + 1} of {total}
            </span>

            <button
              onClick={() => setActiveIdx((i) => Math.min(total - 1, i + 1))}
              disabled={activeIdx === total - 1}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ border: "1px solid var(--border)", color: "var(--foreground)", background: "var(--card)" }}
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
}