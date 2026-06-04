import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import { Button } from "@/shared/components/ui/button";
import { Trash2 } from "lucide-react";
function WorkplaceCard({ data, onChange, isEditing, onDelete }) {
  return (
    <div className="flex items-center gap-3 border rounded-xl p-3 bg-card">
      <div className="grid  grid-cols-[1fr_auto] gap-4 flex-1 items-stretch">
        <EditableTextDataField
          label="Workplace Name"
          value={data.name}
          isEditing={isEditing}
          onChange={(val) =>
            onChange({
              ...data,
              name: val,
            })
          }
        />

        {isEditing && (
          <div className="flex items-center justify-center self-stretch pt-6">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-100 border-transparent"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkplaceCard;
