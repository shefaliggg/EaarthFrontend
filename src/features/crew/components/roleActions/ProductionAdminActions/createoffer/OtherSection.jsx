// sections/OtherSection.jsx
import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";

export function OtherSection({ data, onChange }) {
  const notes = data.notes || {};

  const setNotes = (field, value) => {
    const v = typeof value === "string" ? value.toUpperCase() : value;
    onChange({ ...data, notes: { ...notes, [field]: v } });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <EditableTextDataField
          label="Other deal provisions"
          icon="ScrollText"
          value={notes.otherDealProvisions ?? ""}
          isEditing
          multiline
          onChange={(v) => { if (v.length <= 300) setNotes("otherDealProvisions", v); }}
          placeholder="Other deal provisions..."
        />
        <p className="text-xs text-muted-foreground text-right">{(notes.otherDealProvisions ?? "").length}/300</p>
      </div>

      <div className="space-y-1">
        <EditableTextDataField
          label="Internal notes"
          icon="StickyNote"
          value={notes.additionalNotes ?? ""}
          isEditing
          multiline
          onChange={(v) => { if (v.length <= 300) setNotes("additionalNotes", v); }}
          placeholder="Internal notes..."
        />
        <p className="text-xs text-muted-foreground text-right">{(notes.additionalNotes ?? "").length}/300</p>
        <p className="text-xs text-muted-foreground">
          Internal notes are shown to everyone in Offers in Engine, but NOT on contracts/documents.
        </p>
      </div>
    </div>
  );
}