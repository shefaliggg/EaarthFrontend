import React from "react";
import * as Icons from "lucide-react";
import { cn } from "@/shared/config/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from "@/shared/components/ui/select";
import { Check } from "lucide-react";

export function SelectMenu({
  label = "Select",
  textCase = "normal",
  items = [],
  selected,
  onSelect,
  className = "w-[220px]",
}) {
  const selectedItem = items.find((item) => item.value === selected);

  return (
    <Select value={selected} onValueChange={onSelect}>
      <SelectTrigger textCase={textCase} className={cn("w-full min-w-0", className)}>
        <SelectValue>
          {selectedItem ? selectedItem.label : label}
        </SelectValue>
      </SelectTrigger>

      <SelectContent textCase={textCase}>
        {items.map((item, index) => {
          if (item.divider) {
            return <SelectSeparator key={index} />;
          }

          const Icon = item.icon && Icons[item.icon];
          const isSelected = selected === item.value;

          return (
            <SelectItem
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                {Icon ? (
                  <Icon className="w-3 h-3" />
                ) : (
                  <span className="w-0" />
                )}
                {item.label}
              </span>

              {item.shortcut && (
                <span className="text-xs text-muted-foreground">
                  {item.shortcut}
                </span>
              )}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
