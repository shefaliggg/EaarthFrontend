import { Plus } from "lucide-react";
import UnitCard from "./UnitCard";
import { AutoHeight } from "@/shared/components/wrappers/AutoHeight";

function UnitList({ units, isEditing, onChange, emptyUnit, }) {
  const addUnit = () => {
    onChange([...units, emptyUnit()]);
  };

  const updateUnit = (id, data) => {
    onChange(units.map((u) => (u.id === id ? data : u)));
  };

  const removeUnit = (id) => {
    onChange(units.filter((u) => u.id !== id));
  };

  return (
    <>
      <div className="space-y-4">
        <AutoHeight className="flex flex-col gap-3">
          {units.map((unit) => (
            <UnitCard
              key={unit.id}
              data={unit}
                isPrimary={unit.isPrimary}
              isEditing={isEditing}
              onChange={(data) => updateUnit(unit.id, data)}
              onDelete={() => removeUnit(unit.id)}
            />
          ))}
        </AutoHeight>
        {isEditing && (
          <button
            onClick={addUnit}
            className="w-full border-2 border-dashed border-border text-primary py-10 rounded-lg flex items-center justify-center gap-2 hover:bg-muted/20"
          >
            <Plus size={16} />
            Add Unit
          </button>
        )}
      </div>
    </>
  );
}

export default UnitList;
