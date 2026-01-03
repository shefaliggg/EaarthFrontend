// shared/components/SmartIcon.jsx
import * as LucideIcons from "lucide-react";
import { cn } from "@/shared/config/utils";
import { currentEnv } from "../config/enviroment";

export function SmartIcon({ icon, className }) {
  if (typeof icon === "function") {
    const IconComponent = icon;
    return <IconComponent className={cn(className)} />;
  }

  if (typeof icon === "string") {
    const IconComponent = LucideIcons[icon];

    if (!IconComponent) {
      if (currentEnv === "development") {
        console.warn(`SmartIcon: Lucide icon "${icon}" not found`);
      }
      return null;
    }

    return <IconComponent className={cn(className)} />;
  }

  return null;
}
