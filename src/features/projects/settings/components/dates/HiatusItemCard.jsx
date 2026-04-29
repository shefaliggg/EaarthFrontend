import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableDateField from "@/shared/components/wrappers/EditableDateField";

export default function HiatusItemCard({
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
        <span className="text-sm font-medium text-foreground">
          {data.name || "Untitled Hiatus"}
        </span>

        {isEditing && (
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <EditableTextDataField
          label="Hiatus Name"
          value={data.name}
          isEditing={isEditing}
          onChange={(val) => handleChange("name", val)}
        />

        <EditableDateField
          label="Start Date"
          value={data.start}
          isEditing={isEditing}
          onChange={(val) => handleChange("start", val)}
        />

        <EditableDateField
          label="End Date"
          value={data.end}
          isEditing={isEditing}
          onChange={(val) => handleChange("end", val)}
        />
      </div>
    </div>
  );
}