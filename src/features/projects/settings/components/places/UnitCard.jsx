import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableDateField from "@/shared/components/wrappers/EditableDateField";
import { Button } from "@/shared/components/ui/button";
import { Trash2 } from "lucide-react";

function UnitCard({ data, onChange, isEditing, onDelete, isPrimary }) {
  return (
    <div className="flex items-center gap-3 border rounded-xl p-3 bg-card">
      <div className="grid grid-cols-[13fr_13fr_13fr_auto] gap-4 flex-1 items-stretch">
        <EditableTextDataField
          label="Unit Name"
          badge={data.isPrimary ? "Primary" : null}
          disabled={isPrimary}
          value={data.name}
          isEditing={isEditing}
          onChange={(val) =>
            onChange({
              ...data,
              name: val,
            })
          }
        />
        <EditableDateField
          label="Start Date"
          value={data.startDate}
          isEditing={isEditing}
          onChange={(val) =>
            onChange({
              ...data,
              startDate: val,
            })
          }
        />

        <EditableDateField
          label="End Date"
          value={data.endDate}
          isEditing={isEditing}
          onChange={(val) =>
            onChange({
              ...data,
              endDate: val,
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

export default UnitCard;
