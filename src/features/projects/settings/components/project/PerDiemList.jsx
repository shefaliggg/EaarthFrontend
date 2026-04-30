import { Plus } from "lucide-react";
import { AutoHeight } from "@/shared/components/wrappers/AutoHeight";
import PerDiemItemCard from "./PerDiemItemCard";

const emptyItem = () => ({
  id: Date.now() + Math.random(),
  name: "",
  amount: 0,
});

export default function PerDiemList({ items = [], onChange, isEditing }) {
  const addItem = () => {
    onChange([...(items || []), emptyItem()]);
  };

  const updateItem = (id, updated) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, ...updated } : item
      )
    );
  };

  const removeItem = (id) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <AutoHeight className="flex flex-col gap-3 p-2">
        {items.map((item) => (
          <PerDiemItemCard
            key={item.id}
            data={item}
            isEditing={isEditing}
            onChange={(data) => updateItem(item.id, data)}
            onDelete={() => removeItem(item.id)}
          />
        ))}
      </AutoHeight>

      {isEditing && (
        <button
          onClick={addItem}
          className="w-full border-2 border-dashed border-border text-primary py-8 rounded-lg flex items-center justify-center gap-2 hover:bg-muted/20"
        >
          <Plus size={16} />
          Add Per Diem
        </button>
      )}
    </div>
  );
}