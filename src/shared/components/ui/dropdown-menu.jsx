import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { cn } from "@/shared/config/utils"

const DropdownMenu = ({ ...props }) => <DropdownMenuPrimitive.Root {...props} />
const DropdownMenuPortal = ({ ...props }) => <DropdownMenuPrimitive.Portal {...props} />
const DropdownMenuTrigger = React.forwardRef((props, ref) => (
  <DropdownMenuPrimitive.Trigger ref={ref} {...props} />
))
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out " +
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 " +
        "data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 " +
        "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 " +
        "data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) " +
        "min-w-[10rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden " +
        "overflow-y-auto rounded-xl border p-1 shadow-md",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))

const DropdownMenuGroup = ({ ...props }) => <DropdownMenuPrimitive.Group {...props} />
const DropdownMenuItem = React.forwardRef(({ className, inset, variant = "default", ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    data-inset={inset}
    data-variant={variant}
    className={cn(
      "focus:bg-primary dark:focus:bg-secondary focus:text-white data-[variant=destructive]:text-destructive " +
      "data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 " +
      "data-[variant=destructive]:focus:text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground " +
      "relative flex cursor-pointer items-center gap-2 rounded-xl px-3 py-1.5 text-sm outline-hidden select-none " +
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none " +
      "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  />
))
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem ref={ref} checked={checked} className={cn(
    "focus:bg-primary dark:focus:bg-secondary focus:text-white relative flex cursor-pointer items-center gap-2 " +
    "rounded-xl py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none " +
    "data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className
  )} {...props}>
    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
const DropdownMenuRadioGroup = ({ ...props }) => <DropdownMenuPrimitive.RadioGroup {...props} />
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem ref={ref} className={cn(
    "focus:bg-primary dark:focus:bg-secondary focus:text-white relative flex cursor-pointer items-center gap-2 rounded-xl " +
    "py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none " +
    "data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className
  )} {...props}>
    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CircleIcon className="size-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
const DropdownMenuLabel = ({ className, inset, ...props }) => (
  <DropdownMenuPrimitive.Label data-inset={inset} className={cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className)} {...props} />
)
const DropdownMenuSeparator = ({ className, ...props }) => (
  <DropdownMenuPrimitive.Separator className={cn("bg-border -mx-1 my-1 h-px", className)} {...props} />
)
const DropdownMenuShortcut = ({ className, ...props }) => (
  <span className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)} {...props} />
)
const DropdownMenuSub = ({ ...props }) => <DropdownMenuPrimitive.Sub {...props} />
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger ref={ref} data-inset={inset} className={cn(
    "focus:bg-primary dark:focus:bg-secondary focus:text-white data-[state=open]:bg-primary data-[state=open]:text-background " +
    "flex cursor-pointer items-center rounded-xl px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
    className
  )} {...props}>
    {children}
    <ChevronRightIcon className="ml-auto size-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out " +
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 " +
      "data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 " +
      "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] " +
      "origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-2xl border p-1 shadow-lg",
      className
    )}
    {...props}
  />
))

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}







