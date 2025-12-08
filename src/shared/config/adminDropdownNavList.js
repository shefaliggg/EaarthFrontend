import * as Icon from "lucide-react";
import React from "react";

export function adminDropdownList(userRole = "studio-admin") {
  const commonListTopItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Icon.LayoutDashboard,
      route: "/home",
    },
    {
      id: "staff",
      label: "Team",
      icon: Icon.Briefcase,
      route: "/staff",
    },
    {
      id: "profile",
      label: "Profile",
      icon: Icon.User,
      route: "/profile",
      separatorBefore: true,
    },
  ];

  const commonListBottomItems = [
    {
      id: "support",
      label: "Help and Support",
      icon: Icon.HelpCircle,
      route: "/support",
    },
    {
      id: "logout",
      label: "Logout",
      icon: Icon.LogOut,
      danger: true,
      separatorBefore: true,
    },
  ];

  const studioAdminMenu = {
    id: "studio-admin",
    triggerLabel: "Studio Admin",
    triggerIcon: Icon.LayoutDashboard,
    dropdownLabel: "Studio Admin",
    align: "end",
    items: [
      ...commonListTopItems,
      {
        id: "studio-settings",
        label: "Studio Settings",
        icon: Icon.LucideColumnsSettings,
        route: "/studio-settings",
      },
      {
        id: "user-settings",
        label: "User Settings",
        icon: Icon.Settings,
        route: "/user-settings",
      },
      ...commonListBottomItems
    ],
  };

  if (userRole === "studio-admin") return studioAdminMenu;
  return null;
}
