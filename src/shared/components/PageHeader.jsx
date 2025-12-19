import * as Icons from "lucide-react";
import UrlBasedBreadcrumbs from "./UrlBasedBreadcrumb";
import { cn } from "@/shared/config/utils";

export function PageHeader({ title, subtitle, icon }) {
  // ✅ Convert main icon string → component
  const IconComponent = icon && Icons[icon] ? Icons[icon] : null;

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row  justify-between gap-6 mt-2">
          <div className="flex items-center gap-6">
            {IconComponent && (
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center shadow-lg shrink-0",
                  "bg-primary text-primary-foreground"
                )}
              >
                <IconComponent className="w-7 h-7" />
              </div>
            )}

            <div className="flex flex-col">
              <h1 className="text-2xl uppercase font-extrabold leading-none mb-2 text-foreground">
                {title}
              </h1>

              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}

              <UrlBasedBreadcrumbs />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
