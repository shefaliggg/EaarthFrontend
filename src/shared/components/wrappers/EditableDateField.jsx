import { format } from "date-fns";

import { cn } from "@/shared/config/utils";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { SmartIcon } from "../SmartIcon";
import { CalendarRange, CircleQuestionMark } from "lucide-react";
import { InfoTooltip } from "../InfoTooltip";

function EditableDateField({
  label,
  value,
  icon,
  isEditing = false,
  onChange,
  placeholder = "Select date",
  infoPillDescription,
  isRequired = true,
  error,
}) {
  const dateValue = value ? new Date(value) : null;

  return (
    <div className="flex flex-col gap-1.5 rounded-xl">
      {/* Label */}
      <div className="flex items-center gap-2 text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
        {icon && <SmartIcon icon={icon} size="md" />}
        <span>{label}</span>
        {infoPillDescription && (
          <InfoTooltip content={infoPillDescription}>
            <CircleQuestionMark className="size-4" />
          </InfoTooltip>
        )}
        {isRequired && isEditing && (
          <span className="text-destructive text-xs">*</span>
        )}
      </div>

      {/* View Mode */}
      {!isEditing ? (
        <div className="text-sm font-medium text-foreground">
          {!dateValue ? (
            <span className="text-muted-foreground">Not Available</span>
          ) : (
            format(dateValue, "dd MMM yyyy")
          )}
        </div>
      ) : (
        /* Edit Mode */
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start h-9 px-2 text-sm font-medium",
                  "bg-gray-100 dark:bg-gray-800",
                  "border border-transparent",
                  "hover:bg-gray-200 dark:hover:bg-gray-700",
                )}
              >
                {dateValue ? (
                  format(dateValue, "dd MMM yyyy")
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
                <CalendarRange className="ml-auto" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => {
                  if (!date) return;
                  onChange?.(date.toISOString());
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {error && (
            <span className="text-destructive text-xs pl-2">{error}</span>
          )}
        </>
      )}
    </div>
  );
}

export default EditableDateField;
