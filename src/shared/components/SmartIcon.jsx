import * as LucideIcons from "lucide-react";
import React from "react";
import { cn } from "../config/utils";

export function SmartIcon({ icon, className, size = "md" }) {
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
    "2xl": "w-7 h-7"
  };

  if (typeof icon === "string") {
    const IconComponent = LucideIcons[icon];

    if (!IconComponent) {
      console.warn(`Unknown lucide icon: ${icon}`);
      return null;
    }

    return (
      <IconComponent className={cn(className, iconSizes[size])} />
    );
  }

  if (icon) {
    return React.createElement(icon, {
      className: cn(className, iconSizes[size]),
    });
  }

  return null;
}