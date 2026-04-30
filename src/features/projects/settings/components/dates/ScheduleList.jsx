import { Plus } from "lucide-react";
import ScheduleItemCard from "./ScheduleItemCard";
import { AutoHeight } from "@/shared/components/wrappers/AutoHeight";

const emptyItem = () => ({
  id: Date.now() + Math.random(),
  description: "",
  start: "",
  end: "",
});

const hasGaps = (items) => {
  if (!items.length) return false;

  const sorted = [...items]
    .filter((i) => i.start && i.end)
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  for (let i = 0; i < sorted.length - 1; i++) {
    const currentEnd = new Date(sorted[i].end);
    const nextStart = new Date(sorted[i + 1].start);

    const oneDay = 24 * 60 * 60 * 1000;
    const diff = nextStart.getTime() - currentEnd.getTime();

    if (diff > oneDay || diff < 0) {
      return true;
    }
  }

  return false;
};

export default function ScheduleList({ items = [], onChange, isEditing }) {
  const addItem = () => {
    onChange([...(items || []), emptyItem()]);
  };

  const updateItem = (id, updated) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...updated } : item)),
    );
  };

  const removeItem = (id) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const showGapError = hasGaps(items);

  return (
    <div className="space-y-4">
      <AutoHeight className="flex flex-col gap-3 p-2">
        {items.map((item) => (
          <ScheduleItemCard
            key={item.id}
            data={item}
            isEditing={isEditing}
            onChange={(data) => updateItem(item.id, data)}
            onDelete={() => removeItem(item.id)}
          />
        ))}
      </AutoHeight>

      {showGapError && (
        <p className="text-sm text-destructive px-2">
          ⚠ Schedule has gaps between dates. Please make them continuous.
        </p>
      )}

      {isEditing && (
        <button
          onClick={addItem}
          className="w-full border-2 border-dashed border-border text-primary py-10 rounded-lg flex items-center justify-center gap-2 hover:bg-muted/20"
        >
          <Plus size={16} />
          Add New Schedule
        </button>
      )}
    </div>
  );
}
