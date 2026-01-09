import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/shared/config/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Button } from "@/shared/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/shared/components/ui/command"
import { convertToPrettyText } from "../../../../../shared/config/utils"

export function TableLocationSelect({
  value,
  onChange,
  items = [],
  placeholder = "Location",
  className,
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "h-6 px-1 justify-between text-[10px] font-normal hover:bg-accent/30 hover:text-foreground",
            "truncate",
            className
          )}
        >
          <span className="truncate">
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-1 h-3 w-3 opacity-40 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput
            placeholder="Search location..."
            className="h-8 text-xs"
          />
          <CommandEmpty>No location found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item}
                value={item}
                onSelect={() => {
                  onChange(item)
                  setOpen(false)
                }}
                className="text-xs"
              >
                <Check
                  className={cn(
                    "h-3 w-3",
                    value === item ? "opacity-100" : "opacity-0"
                  )}
                />
                {convertToPrettyText(item)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
