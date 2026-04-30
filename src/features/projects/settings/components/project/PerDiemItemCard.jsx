import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";

export default function PerDiemItemCard({
  data,
  onChange,
  onDelete,
  isEditing,
}) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="p-4 rounded-3xl border bg-background">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {data.name || "Untitled"}
        </span>

        {isEditing && (
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <EditableTextDataField
          label="Name"
          value={data.name}
          isEditing={isEditing}
          onChange={(val) => handleChange("name", val)}
        />

        <EditableTextDataField
          label="Amount"
          type="number"
          value={data.amount}
          isEditing={isEditing}
          onChange={(val) =>
            handleChange("amount", Number(val))
          }
        />
      </div>
    </div>
  );
}