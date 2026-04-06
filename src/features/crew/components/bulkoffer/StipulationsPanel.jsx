/**
 * StipulationsPanel.jsx
 *
 * Slide-up/center panel for editing per-row special stipulations.
 * Same fields and styling as ContractForm's Special Stipulations section.
 */

import { Plus, Trash2, X, FileText } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Card }   from "../../../../shared/components/ui/card";

export function StipulationsPanel({ row, rowIndex, onClose, onUpdate }) {
  const stipulations = row.specialStipulations || [];

  const addStipulation = () =>
    onUpdate(row.id, "specialStipulations", [...stipulations, { title: "", body: "" }]);

  const removeStipulation = i => {
    const next = [...stipulations];
    next.splice(i, 1);
    onUpdate(row.id, "specialStipulations", next);
  };

  const setStipField = (i, field, value) => {
    const next = [...stipulations];
    next[i] = { ...next[i], [field]: typeof value === "string" ? value.toUpperCase() : value };
    onUpdate(row.id, "specialStipulations", next);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg p-5 max-h-[80vh] overflow-y-auto shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Special Stipulations
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {row.recipient?.fullName || `Row ${rowIndex + 1}`}
              {stipulations.length > 0 && ` · ${stipulations.length} stipulation${stipulations.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning — identical to ContractForm */}
        <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5 mb-3">
          ⚠ In the event of a conflict, Deal Terms / Special Stipulations shall prevail over Standard Terms.
        </p>

        {/* Stipulation list */}
        <div className="space-y-3">
          {stipulations.map((s, i) => (
            <div key={i} className="border border-border rounded-lg p-3 space-y-2 bg-accent/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
                    Stipulation {i + 1}
                  </span>
                </div>
                <button
                  onClick={() => removeStipulation(i)}
                  className="text-destructive/60 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground block">Title (optional)</label>
                <input
                  value={s.title || ""}
                  onChange={e => setStipField(i, "title", e.target.value)}
                  placeholder="E.G. EXCLUSIVITY CLAUSE"
                  className="w-full border border-border rounded px-2 py-1 text-[11px] bg-input uppercase focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              {/* Body */}
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground block">
                  Clause text <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={s.body || ""}
                  onChange={e => {
                    if (e.target.value.length > 2000) return;
                    setStipField(i, "body", e.target.value);
                  }}
                  rows={3}
                  placeholder="ENTER THE CLAUSE TEXT HERE..."
                  className="w-full border border-border rounded px-2 py-1 text-[11px] bg-input uppercase resize-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                <p className="text-[10px] text-muted-foreground text-right">
                  {(s.body || "").length}/2000
                </p>
              </div>
            </div>
          ))}

          {/* Add button — styled like ContractForm */}
          <button
            onClick={addStipulation}
            className="w-full border border-dashed border-primary/40 rounded-lg py-2 text-[11px] text-primary hover:bg-primary/5 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Stipulation
          </button>
        </div>

        <Button onClick={onClose} className="w-full mt-4 h-8 text-[12px]">Done</Button>
      </Card>
    </div>
  );
}