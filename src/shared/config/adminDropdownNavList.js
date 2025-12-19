import * as Icon from "lucide-react";

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
        icon: Icon.Settings,
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

  const crewMenu = {
    id: "crew-menu",
    triggerLabel: "Crew",
    triggerIcon: Icon.Users,
    dropdownLabel: "Crew Menu",
    align: "end",
    items: [
      {
        id: "crew-dashboard",
        label: "Dashboard",
        icon: Icon.LayoutDashboard,
        route: "/crew/dashboard",
      },
      {
        id: "crew-schedule",
        label: "My Schedule",
        icon: Icon.Calendar,
        route: "/crew/schedule",
      },
      {
        id: "crew-tasks",
        label: "My Tasks",
        icon: Icon.CheckSquare,
        route: "/crew/tasks",
      },
      {
        id: "crew-notifications",
        label: "Notifications",
        icon: Icon.Bell,
        route: "/crew/notifications",
      },
      {
        id: "crew-profile",
        label: "Profile",
        icon: Icon.User,
        route: "/crew/profile",
        separatorBefore: true,
      },
      {
        id: "crew-settings",
        label: "Settings",
        icon: Icon.Settings,
        route: "/crew/settings",
      },
      ...commonListBottomItems
    ],
  };

  if (userRole === "studio-admin") return studioAdminMenu;
  if (userRole === "crew") return crewMenu;
  
  return null;
}