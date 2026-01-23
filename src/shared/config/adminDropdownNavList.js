import * as Icon from "lucide-react";

//common menu

const displayModeItem = {
  id: "display-mode",
  label: "Display Mode",
  icon: Icon.LayoutPanelLeft,
  type: "submenu",
  children: [
    { id: "text-icon", label: "Text + Icon", icon: Icon.Columns, action: "display-mode" },
    { id: "icon-only", label: "Icon Only", icon: Icon.Grid, action: "display-mode" },
    { id: "text-only", label: "Text Only", icon: Icon.Type, action: "display-mode" },
  ],
};

const commonBottom = [
  {
    id: "settings",
    label: "Settings",
    icon: Icon.Settings,
    route: "/settings",
    separatorBefore: true,
  },
  {
    id: "support",
    label: "Help & Support",
    icon: Icon.HelpCircle,
    route: "/support",
  },
  displayModeItem,
  {
    id: "logout",
    label: "Logout",
    icon: Icon.LogOut,
    action: "logout",
    danger: true,
    separatorBefore: true,
  },
];

//role specific

const crewMenu = [
  {
    id: "offers",
    label: "My Offers",
    icon: Icon.FileText,
    route: "/projects/Myoffers",
  },
  {
    id: "messages",
    label: "My Messages",
    icon: Icon.MessageCircle,
    action: "messages",
    badge: true,
  },
  {
    id: "profile",
    label: "My Profile",
    icon: Icon.User,
    route: "/profile",
  },
];

// TEMP: studio admin uses crew menu
const studioAdminMenu = [...crewMenu];

/* ===== EXPORT ===== */

export const adminDropdownConfig = (role) => {
  if (role === "studio_admin") return [...studioAdminMenu, ...commonBottom];
  if (role === "crew") return [...crewMenu, ...commonBottom];
  return [...commonBottom];
};
