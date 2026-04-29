import { Plus } from "lucide-react";
import HiatusItemCard from "./HiatusItemCard";
import { AutoHeight } from "../../../../../shared/components/wrappers/AutoHeight";

const emptyHiatus = () => ({
  id: Date.now() + Math.random(),
  name: "",
  start: "",
  end: "",
});

export default function HiatusList({ items = [], onChange, isEditing }) {
  const addItem = () => {
    onChange([...(items || []), emptyHiatus()]);
  };

  const updateItem = (id, updated) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...updated } : item)),
    );
  };

  const removeItem = (id) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <AutoHeight className="flex flex-col gap-3 p-2">
        {items.map((item) => (
          <HiatusItemCard
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
          className="w-full border-2 border-dashed border-border cursor-pointer transition-all text-primary duration-300 hover:border-primary hover:bg-muted/20 py-10 rounded-lg flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add New Hiatus
        </button>
      )}
    </div>
  );
}
