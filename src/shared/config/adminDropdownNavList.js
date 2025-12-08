import * as Icon from "lucide-react";
import React from "react";

export function adminDropdownList(userRole = "studio-admin") {
  const studioAdminMenu = {
    id: "studio-admin",
    triggerLabel: "Studio Admin",
    triggerIcon: Icon.LayoutDashboard,
    dropdownLabel: "Studio Admin",
    align: "end",
    items: [
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
        id: "profile-settings",
        label: "Profile Settings",
        icon: Icon.User,
        route: "/profile-settings",
        separatorBefore: true,
      },
      {
        id: "user-access",
        label: "User Access",
        icon: Icon.Shield,
        route: "/user-access",
      },
      {
        id: "master-settings",
        label: "Master Settings",
        icon: Icon.Sparkles,
        route: "/master-settings",
      },
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
    ],
  };

  if (userRole === "studio-admin") return studioAdminMenu;
}
