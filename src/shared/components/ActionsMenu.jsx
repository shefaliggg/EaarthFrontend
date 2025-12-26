import * as LucideIcons from "lucide-react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";

import { Button } from "@/shared/components/ui/button";
import { MoreVertical, ChevronRight } from "lucide-react";

function getSafeIcon(icon) {
  if (typeof icon === "function") return icon;
  if (typeof icon === "string") {
    const IconFromString = LucideIcons[icon];
    if (IconFromString) return IconFromString;
  }
  return MoreVertical;
}

function renderMenuItems(items) {
  return items.map((item, idx) => {
    const Icon = getSafeIcon(item.icon);

    if (item.subMenu && Array.isArray(item.subMenu)) {
      return (
        <React.Fragment key={idx}>
          {item.separatorBefore && <DropdownMenuSeparator />}

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
              {/* <ChevronRight className="ml-auto h-4 w-4 opacity-60" /> */}
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent>
              {renderMenuItems(item.subMenu)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment key={idx}>
        {item.separatorBefore && <DropdownMenuSeparator />}

        <DropdownMenuItem
          onClick={item.onClick}
          className={item.destructive ? "text-red-600 focus:text-red-600" : ""}
        >
          <Icon className="h-4 w-4" />
          {item.label}
        </DropdownMenuItem>
      </React.Fragment>
    );
  });
}

export default function ActionsMenu({ actions = [] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {renderMenuItems(actions)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
