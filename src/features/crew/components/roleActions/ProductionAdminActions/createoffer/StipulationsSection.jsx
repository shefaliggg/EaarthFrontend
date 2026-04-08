// sections/StipulationsSection.jsx
import { Plus, Trash2, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";

export function StipulationsSection({ data, onChange }) {
  const stipulations = data.specialStipulations || [];

  const addStipulation    = () => onChange({ ...data, specialStipulations: [...stipulations, { title: "", body: "" }] });
  const removeStipulation = (i) => { const n = [...stipulations]; n.splice(i, 1); onChange({ ...data, specialStipulations: n }); };
  const setStipulation    = (i, field, value) => {
    const n = [...stipulations];
    n[i] = { ...n[i], [field]: typeof value === "string" ? value.toUpperCase() : value };
    onChange({ ...data, specialStipulations: n });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Special stipulations override standard contract terms. Add custom legal clauses specific to this deal.
        <span className="block mt-0.5 text-[10px] text-amber-500/80 font-medium">
          ⚠ In the event of a conflict, Deal Terms / Special Stipulations shall prevail over Standard Terms.
        </span>
      </p>

      {stipulations.map((s, i) => (
        <div key={i} className="border border-border rounded-lg p-3 space-y-3 bg-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">Stipulation {i + 1}</span>
            </div>
            <button type="button" onClick={() => removeStipulation(i)} className="text-destructive/60 hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <EditableTextDataField
            label="Title (optional)"
            value={s.title ?? ""}
            isEditing
            onChange={(v) => setStipulation(i, "title", v)}
            placeholder="e.g. EXCLUSIVITY CLAUSE"
          />

          <div className="space-y-1">
            <EditableTextDataField
              label="Clause text *"
              value={s.body ?? ""}
              isEditing
              multiline
              onChange={(v) => { if (v.length <= 2000) setStipulation(i, "body", v); }}
              placeholder="Enter the clause text here..."
            />
            <p className="text-[10px] text-muted-foreground text-right">{(s.body ?? "").length}/2000</p>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addStipulation}
        className="w-full h-8 text-[11px] gap-1.5 border-dashed border-primary/40 text-primary hover:bg-primary/10">
        <Plus className="h-3.5 w-3.5" />
        Add Special Stipulation
      </Button>
    </div>
  );
}