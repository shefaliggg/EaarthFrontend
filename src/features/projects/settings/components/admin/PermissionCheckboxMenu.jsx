import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/config/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

function PermissionCheckboxMenu({
  items = [],
  selected = [],
  onChange,
  className,
}) {
  const handleToggle = (value) => {
    let updated = [];

    if (selected.includes(value)) {
      updated = selected.filter((item) => item !== value);
    } else {
      updated = [...selected, value];
    }

    onChange?.(updated);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div className="p-2 rounded-2xl border bg-background shadow-sm cursor-pointer">
            <span className="text-primary text-xs">
              {selected.length
                ? items
                    .filter((item) => selected.includes(item.value))
                    .map((item) => item.label)
                    .join(", ")
                : "Select"}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-background p-1 pb-2 border shadow-sm">
          {items.map((item) => {
            const checked = selected.includes(item.value);

            return (
              <label
                key={item.value}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors",
                  "hover:bg-muted",
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => handleToggle(item.value)}
                />

                <span className="text-sm font-medium">{item.label}</span>
              </label>
            );
          })}
        </PopoverContent>
      </Popover>
    </>
  );
}

export default PermissionCheckboxMenu;
