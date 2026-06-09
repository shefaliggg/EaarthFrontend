/**
 * ScheduleList.jsx
 * Path: src/features/projects/settings/components/dates/ScheduleList.jsx
 */

import { Trash2 } from "lucide-react";

// Assumes your existing date input / text input components
// Adjust field component names to match your codebase

function ScheduleItem({ item, index, isEditing, onChange, onDelete }) {
  const patch = (key) => (val) => onChange({ ...item, [key]: val });

  return (
    <div className="rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{item.description}</span>
        {/* Only non-default (hiatus) items can be deleted */}
        {isEditing && !item.isDefault && (
          <button
            type="button"
            onClick={onDelete}
            className="text-destructive hover:text-destructive/80 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Description — uppercase display */}
        <div className="flex flex-col gap-1">
          <label className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
            Description <span className="text-destructive">*</span>
          </label>
          {isEditing ? (
            <input
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm uppercase"
              value={item.description}
              onChange={(e) => patch("description")(e.target.value)}
            />
          ) : (
            <span className="text-sm uppercase">{item.description || "—"}</span>
          )}
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
            Start Date <span className="text-destructive">*</span>
          </label>
          {isEditing ? (
            <input
              type="date"
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              value={item.start ?? ""}
              onChange={(e) => patch("start")(e.target.value || null)}
            />
          ) : (
            <span className="text-sm">
              {item.start
                ? new Date(item.start).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                : "—"}
            </span>
          )}
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
            End Date <span className="text-destructive">*</span>
          </label>
          {isEditing ? (
            <input
              type="date"
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              value={item.end ?? ""}
              onChange={(e) => patch("end")(e.target.value || null)}
            />
          ) : (
            <span className="text-sm">
              {item.end
                ? new Date(item.end).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                : "—"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ScheduleList({ items = [], isEditing, onChange }) {
  const handleChange = (index, updated) => {
    const next = [...items];
    next[index] = updated;
    onChange(next);
  };

  const handleDelete = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <ScheduleItem
          key={item._id ?? `${item.description}-${index}`}
          item={item}
          index={index}
          isEditing={isEditing}
          onChange={(updated) => handleChange(index, updated)}
          onDelete={() => handleDelete(index)}
        />
      ))}
    </div>
  );
}

export default ScheduleList;