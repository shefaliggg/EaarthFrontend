import { Info, Plus, XCircle } from "lucide-react";
import AllowanceItemCard from "./AllowanceItemCard";
import { AutoHeight } from "@/shared/components/wrappers/AutoHeight";
import { SmartIcon } from "@/shared/components/SmartIcon";
import { InfoPanel } from "../../../../../../shared/components/panels/InfoPanel";
import { convertToPrettyText } from "../../../../../../shared/config/utils";

export const ALLOWANCE_CONFIG = {
  equipment: {
    icon: "Wrench",
    itemName: "e.g. Multi-tool, Camera Rig",
    description: "e.g. Used for on-site repairs",
    addButtonLabel: "Add New Equipment",
  },
  computer: {
    icon: "Laptop",
    itemName: "e.g. MacBook Pro, Desktop PC",
    description: "e.g. Development or office work",
    addButtonLabel: "Add New Computer",
  },
  mobile: {
    icon: "Smartphone",
    itemName: "e.g. iPhone 13, Samsung Galaxy",
    description: "e.g. Communication or testing",
    addButtonLabel: "Add New Mobile Phone",
  },
  box_rentals: {
    icon: "Package",
    itemName: "e.g. Storage Box, Transport Case",
    description: "e.g. Used for equipment storage",
    addButtonLabel: "Add New Rental",
  },
  software: {
    icon: "AppWindow",
    itemName: "e.g. Adobe Premiere Pro, VS Code License",
    description: "e.g. Software subscription or license",
    addButtonLabel: "Add New Software",
  },
};

const emptyItem = () => ({
  id: Date.now() + Math.random(),
  image: "",
  imageFile: null,
  itemName: "",
  description: "",
  qty: 1,
  amount: 0,
  condition: "",
});

const isItemEmpty = (item) => !item.itemName && !item.description;

export default function AllowanceItemsList({
  allowanceType = "equipment",
  isEditing = false,
  errors,
  items = [],
  onChange,
}) {
  const config = ALLOWANCE_CONFIG[allowanceType] || ALLOWANCE_CONFIG.equipment;

  const addItem = () => onChange([...items, emptyItem()]);

  const updateItem = (id, updatedData) =>
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item,
      ),
    );

  const removeItem = (id) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const isEmpty = items.length === 0;

  if (!isEditing && isEmpty) {
    return (
      <div className="p-8 pt-2 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center">
          <SmartIcon icon={config.icon} className="text-primary" size="lg" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            No{" "}
            {convertToPrettyText(
              allowanceType === "boxRentals" ? "Box Rentals" : allowanceType,
            )}{" "}
            items added
          </p>
          <p className="text-xs text-muted-foreground">
            Start by adding your first item to track costs
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AutoHeight className="flex flex-col gap-3">
        {isEditing && isEmpty && (
          <InfoPanel variant="info" title="No items added" icon={Info}>
            You can leave this empty or add items if needed.
          </InfoPanel>
        )}
        {items.map((item, index) => (
          <AllowanceItemCard
            key={item.id}
            data={item}
            onChange={(data) => updateItem(item.id, data)}
            onDelete={() => removeItem(item.id)}
            isDisableDelete={items.length === 0}
            placeholders={config}
            isEditing={isEditing}
            errors={errors?.[index]}
          />
        ))}
      </AutoHeight>

      {isEditing && (
        <button
          type="button"
          onClick={addItem}
          className="w-full border-2 border-dashed border-border cursor-pointer transition-all text-primary duration-300 hover:border-primary hover:bg-muted/20 py-10 rounded-lg flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          {config.addButtonLabel}
        </button>
      )}
    </div>
  );
}
