import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/config/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/shared/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { triggerGlobalLogout } from "@/features/auth/config/globalLogoutConfig";
import { useNavigateWithName } from "../../hooks/useNavigateWithName";

function NavigationDropdown({ menu, displayMode = "text-icon" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const navigateWithName = useNavigateWithName();


  const renderMenuButton = (label, Icon) => {
    if (displayMode === "icon-only") return <Icon className="w-5 h-5" />;
    if (displayMode === "text-only") return label;

    return (
      <>
        <Icon className="w-4 h-4" />
        <span className="hidden md:inline">{label}</span>
      </>
    );
  };

  const TriggerIcon = menu.triggerIcon;

  const isDropdownActive = menu?.items?.some(
    (item) =>
      `${item.route}` === pathname ||
      item.subItems?.some((sub) => `${sub.route}` === pathname)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "gap-2",
            isDropdownActive && "bg-accent/20",
            displayMode === "icon-only" && "px-2"
          )}
        >
          {renderMenuButton(menu.triggerLabel, TriggerIcon)}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={menu.align || "start"}>
        {menu.dropdownLabel && (
          <>
            <DropdownMenuLabel>{menu.dropdownLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        {menu.items.map((item) => {
          const ItemIcon = item.icon;
          const hasSubMenu = item.subItems && item.subItems.length > 0;

          const isItemActive = `${item.route}` === pathname;

          return (
            <React.Fragment key={item.id}>
              {item.separatorBefore && <DropdownMenuSeparator />}

              {hasSubMenu ? (
                <DropdownMenuSub>
                  {(() => {
                    const isSubMenuActive = item.subItems.some(
                      (sub) => `${sub.route}` === pathname
                    );
                    return (
                      <DropdownMenuSubTrigger
                        className={cn(
                          "flex items-center gap-2",
                          isSubMenuActive && "bg-accent/20",
                        )}
                      >
                        <ItemIcon className="w-4 h-4 mr-1" />
                        {item.label}
                      </DropdownMenuSubTrigger>
                    );
                  })()}
                  <DropdownMenuSubContent>
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = `${sub.route}` === pathname;

                      return (
                        <DropdownMenuItem
                          key={sub.id}
                          onClick={() => navigate(sub.route)}
                          className={cn(
                            isSubActive && "bg-primary text-white"
                          )}
                        >
                          {SubIcon && (
                            <SubIcon
                              className={cn(
                                "w-5 h-5",
                                isSubActive ? "text-white" : "text-foreground"
                              )}
                            />
                          )}
                          {sub.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    const isNavigateWithName = item.route && item.navigateWithName
                    return isNavigateWithName
                      ? navigateWithName({
                        title: item.label,
                        uniqueCode: item.projectCode,
                        basePath: "projects",
                        storageKey: "currentProjectUniqueKey"
                      })
                      : item.route ? navigate(item.route) : triggerGlobalLogout()
                  }}
                  className={cn(
                    isItemActive && "bg-primary text-white",
                    item.danger &&
                    "text-destructive focus:text-destructive"
                  )}
                >
                  <ItemIcon
                    className={cn(
                      isItemActive ? "text-white" : "text-foreground",
                      "w-5 h-5 mr-1"
                    )}
                  />
                  {item.label}
                </DropdownMenuItem>
              )}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavigationDropdown;
