import { useState } from "react";
import { Plus } from "lucide-react";
import AllowanceItemCard from "./AllowanceItemCard";
import { AutoHeight } from "../../../../../../shared/components/wrappers/AutoHeight";
import { SmartIcon } from "../../../../../../shared/components/SmartIcon";

// allowance.config.js

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

export default function AllowanceItemsList({
  allowanceType = "equipment",
  isEditing = false,
}) {
  const [items, setItems] = useState([
    {
      id: Date.now(),
      image: "",
      itemName: "",
      description: "",
      qty: 1,
      amount: 0,
      condition: "",
    },
  ]);
  const config = ALLOWANCE_CONFIG[allowanceType] || ALLOWANCE_CONFIG.equipment;

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        image: "",
        itemName: "",
        description: "",
        qty: 1,
        amount: 0,
        condition: "",
      },
    ]);
  };

  const updateItem = (id, updatedData) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)),
    );
  };

  const removeItem = (id) => {
    if (
      items.length === 1 &&
      items[0].itemName === "" &&
      items[0].description === ""
    )
      return;

    if (
      items.length === 1 &&
      (items[0].itemName !== "" || items[0].description !== "")
    ) {
      setItems([
        {
          id: Date.now(),
          image: "",
          itemName: "",
          description: "",
          qty: 1,
          amount: 0,
          condition: "",
        },
      ]);
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };
  if (
    !isEditing &&
    items.length === 1 &&
    items[0].itemName === "" &&
    items[0].description === ""
  ) {
    return (
      <div className="p-8 pt-2 flex flex-col items-center justify-center text-center gap-4">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center">
          <SmartIcon icon={config.icon} className="text-primary" size="lg" />
        </div>

        {/* Text */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            No {allowanceType.replace("_", " ")} items added
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
        {items.length > 0 &&
          items.map((item) => (
            <AllowanceItemCard
              key={item.id}
              data={item}
              onChange={(data) => updateItem(item.id, data)}
              onDelete={() => removeItem(item.id)}
              isDisableDelete={
                items.length === 1 &&
                items[0].itemName === "" &&
                items[0].description === ""
              }
              placeholders={config}
              isEditing={isEditing}
            />
          ))}
      </AutoHeight>

      {/* Add Button */}
      <button
        onClick={addItem}
        className="w-full border-2 border-dashed border-border ursor-pointer transition-all text-primary duration-300 hover:border-primary hover:bg-muted/20 py-10 rounded-lg flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        {config.addButtonLabel}
      </button>
    </div>
  );
}
