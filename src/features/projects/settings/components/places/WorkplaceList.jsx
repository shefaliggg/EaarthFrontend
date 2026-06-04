import React from "react";
import WorkplaceCard from "./WorkplaceCard";
import { AutoHeight } from "@/shared/components/wrappers/AutoHeight";
import { Plus } from "lucide-react";

function WorkplaceList({ workplaces, isEditing, onChange }) {
  const addWorkplace = () => {
    onChange([
      ...workplaces,
      {
        id: Date.now() + Math.random(),
        name: "",
      },
    ]);
  };

  const updateWorkplace = (id, data) => {
    onChange(workplaces.map((w) => (w.id === id ? data : w)));
  };

  const removeWorkplace = (id) => {
    onChange(workplaces.filter((w) => w.id !== id));
  };

  return (
    <>
      <div className="space-y-4">
        <AutoHeight className="flex flex-col gap-3">
          {workplaces.map((workplace) => (
            <WorkplaceCard
              key={workplace.id}
              data={workplace}
              isEditing={isEditing}
              onChange={(data) => updateWorkplace(workplace.id, data)}
              onDelete={() => removeWorkplace(workplace.id)}
            />
          ))}
        </AutoHeight>
        {isEditing && (
          <button
            onClick={addWorkplace}
            className="w-full border-2 border-dashed border-border text-primary py-10 rounded-lg flex items-center justify-center gap-2 hover:bg-muted/20"
          >
            <Plus size={16} />
            Add Workplace
          </button>
        )}
      </div>
    </>
  );
}

export default WorkplaceList;
