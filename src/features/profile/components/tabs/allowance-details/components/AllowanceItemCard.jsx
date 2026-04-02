import { Trash2 } from "lucide-react";
import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../../../../shared/components/wrappers/EditableSelectField";
import { Button } from "../../../../../../shared/components/ui/button";
import { SmartIcon } from "../../../../../../shared/components/SmartIcon";

export default function AllowanceItemCard({
  data,
  onChange,
  placeholders = {
    icon: "Camera",
    itemName: "e.g. Multi-tool, Camera Rig",
    description: "e.g. Used for on-site repairs",
  },
  onDelete,
  isDisableDelete,
  isEditing,
}) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const lineTotal = (data.qty || 0) * (data.amount || 0);

  return (
    <div className="flex items-center gap-3 border rounded-xl p-3 bg-card shadow-md">
      {/* Image */}
      <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center overflow-hidden">
        {data.image ? (
          <img src={data.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <SmartIcon
            icon={placeholders.icon}
            className={"text-muted-foreground/50"}
            size="lg"
          />
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_0.5fr] gap-3 flex-1">
        <EditableTextDataField
          label="Item Name"
          placeholder={placeholders.itemName}
          value={data.itemName}
          onChange={(value) => handleChange("itemName", value)}
          isEditing={isEditing}
        />

        <EditableTextDataField
          label="Description"
          placeholder={placeholders.description}
          value={data.description}
          onChange={(value) => handleChange("description", value)}
          isEditing={isEditing}
        />

        <EditableTextDataField
          label="Quantity"
          value={data.qty}
          onChange={(value) => handleChange("qty", Number(value))}
          isEditing={isEditing}
          type="number"
        />

        <EditableTextDataField
          label="Amount"
          value={data.amount}
          onChange={(value) => handleChange("amount", Number(value))}
          isEditing={isEditing}
          type="number"
        />

        <EditableSelectField
          label="Condition"
          value={data.condition}
          onChange={(value) => handleChange("condition", value)}
          items={[
            { label: "New", value: "new" },
            { label: "Good", value: "good" },
            { label: "Used", value: "used" },
          ]}
          isEditing={isEditing}
        />

        <div className="flex flex-col justify-center px-2">
          <span className="text-[11px] font-normal uppercase tracking-wider text-foreground ">
            TOTAL
          </span>

          <div className="h-[40px] flex items-center text-lg font-bold text-foreground">
            £{lineTotal.toFixed(2)}
          </div>
        </div>
      </div>
      {isEditing && (
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={onDelete}
          disabled={isDisableDelete}
          className="text-red-500 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 border-transparent dark:border-transparent"
        >
          <Trash2 size={16} />
        </Button>
      )}
    </div>
  );
}
