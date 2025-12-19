import { useLocation } from "react-router-dom";
import * as Icon from "lucide-react";
import { convertTitleToUrl, prettifySegment } from "../config/utils";

export function useCrewMenus(assignedProjects = []) {
  const { pathname } = useLocation();

  const match = pathname.match(/\/crew\/projects\/([^/]+)/);
  const projectName = match ? match[1] : null;

  const isCrewRoute = pathname.startsWith("/crew");
  const isCrewProjectsRoute = pathname === "/crew/projects";
  const isCrewProjectSubRoute = !!projectName && pathname.startsWith("/crew/projects/");

  // Crew Projects Dropdown (similar to Studio Projects)
  const crewProjectsDropdown = {
    id: "crew-projects",
    triggerLabel: isCrewProjectSubRoute
      ? prettifySegment(projectName)
      : isCrewProjectsRoute
      ? "My Projects"
      : "Projects",
    triggerIcon: Icon.Film,
    dropdownLabel: "My Projects",
    align: "start",
    items: [
      {
        id: "all-crew-projects",
        label: "View All Projects",
        icon: Icon.Film,
        route: "/crew/projects",
      },
      ...assignedProjects.map((p) => ({
        id: p.id,
        label: p.name,
        icon: Icon.Film,
        navigateWithName: true,
        projectCode: `${p.name}tempcode`,
        route: `/crew/projects/${convertTitleToUrl(p.name)}`,
      })),
    ],
  };

  // Crew Applications Menu (similar to Project Applications)
  const CrewApplicationMenu = {
    id: "crew-applications",
    triggerLabel: "Applications",
    triggerIcon: Icon.LayoutGrid,
    dropdownLabel: "Crew Applications",
    align: "start",
    items: [
      {
        id: "crew-calendar",
        label: "My Calendar",
        icon: Icon.Calendar,
        route: "/crew/calendar",
      },
      {
        id: "crew-call-sheets",
        label: "Call Sheets",
        icon: Icon.ClipboardList,
        route: "/crew/call-sheets",
      },
      {
        id: "crew-shooting-schedule",
        label: "Shooting Schedule",
        icon: Icon.Video,
        route: "/crew/shooting-schedule",
      },
      {
        id: "crew-timesheet",
        label: "My Timesheet",
        icon: Icon.Clock,
        route: "/crew/timesheet",
      },
      {
        id: "crew-tasks",
        label: "My Tasks",
        icon: Icon.CheckSquare,
        route: "/crew/tasks",
      },
      {
        id: "crew-documents",
        label: "Documents",
        icon: Icon.FolderOpen,
        route: "/crew/documents",
      },
      {
        id: "crew-assets",
        label: "Assets",
        icon: Icon.Archive,
        route: "/crew/assets",
      },
      {
        id: "crew-costume",
        label: "Costume",
        icon: Icon.Shirt,
        route: "/crew/costume",
      },
      {
        id: "crew-catering",
        label: "Catering",
        icon: Icon.UtensilsCrossed,
        route: "/crew/catering",
      },
      {
        id: "crew-script",
        label: "Script",
        icon: Icon.FileText,
        route: "/crew/script",
      },
      {
        id: "crew-transport",
        label: "Transport",
        icon: Icon.Truck,
        route: "/crew/transport",
      },
      {
        id: "crew-eplayer",
        label: "E Player",
        icon: Icon.Video,
        route: "/crew/eplayer",
      },
      {
        id: "crew-props",
        label: "Props & Assets",
        icon: Icon.Package,
        route: "/crew/props",
      },
      {
        id: "crew-locations",
        label: "Locations",
        icon: Icon.MapPin,
        route: "/crew/locations",
      },
      {
        id: "crew-cloud",
        label: "Cloud",
        icon: Icon.Cloud,
        route: "/crew/cloud",
      },
      {
        id: "crew-notice-board",
        label: "Notice Board",
        icon: Icon.Megaphone,
        route: "/crew/notice-board",
      },
      {
        id: "crew-chat",
        label: "Crew Chat",
        icon: Icon.MessageSquare,
        route: "/crew/chat",
      },
      {
        id: "crew-production-reports",
        label: "Production Reports",
        icon: Icon.ClipboardList,
        route: "/crew/production-reports",
        separatorBefore: true,
      },
      {
        id: "crew-schedule",
        label: "Schedule",
        icon: Icon.Calendar,
        route: "/crew/schedule",
      },
      {
        id: "crew-cast",
        label: "Cast",
        icon: Icon.Star,
        route: "/crew/cast",
      },
      {
        id: "crew-crew-list",
        label: "Crew List",
        icon: Icon.Users,
        route: "/crew/crew-list",
      },
      {
        id: "crew-esign",
        label: "EAARTH Sign",
        icon: Icon.PenTool,
        route: "/crew/esign",
      },
    ],
  };

  // AI & Analytics Menu for Crew
  const CrewAIMenu = {
    id: "crew-ai-analytics",
    triggerLabel: "AI & Analytics",
    triggerIcon: Icon.Bot,
    dropdownLabel: "AI & Analytics",
    align: "start",
    items: [
      {
        id: "crew-ai-assistant",
        label: "AI Assistant Chat",
        icon: Icon.BotMessageSquare,
        route: "/crew/ai-assistant-chat",
      },
      {
        id: "crew-ai-search",
        label: "AI Search & Filtering",
        icon: Icon.Search,
        route: "/crew/ai-search-filtering",
      },
      {
        id: "crew-ai-templates",
        label: "AI Template Studio",
        icon: Icon.FileText,
        route: "/crew/ai-template-studio",
      },
      {
        id: "crew-document-management",
        label: "Document Management",
        icon: Icon.FolderOpen,
        route: "/crew/document-management",
      },
      {
        id: "crew-workflow",
        label: "Workflow Automation",
        icon: Icon.Workflow,
        route: "/crew/workflow-automation",
      },
      {
        id: "crew-analytics",
        label: "My Analytics",
        icon: Icon.Eye,
        route: "/crew/analytics",
      },
    ],
  };

  // Crew Settings Menu
  const CrewSettingsMenu = {
    id: "crew-settings",
    triggerLabel: "Settings",
    triggerIcon: Icon.Settings,
    dropdownLabel: "Crew Settings",
    align: "start",
    items: [
      {
        id: "personal",
        label: "Personal",
        icon: Icon.User,
        subItems: [
          {
            id: "crew-profile",
            label: "Profile",
            icon: Icon.User,
            route: "/crew/profile",
          },
          {
            id: "crew-contact-info",
            label: "Contact Information",
            icon: Icon.Phone,
            route: "/crew/contact-info",
          },
          {
            id: "crew-emergency-contacts",
            label: "Emergency Contacts",
            icon: Icon.AlertCircle,
            route: "/crew/emergency-contacts",
          },
          {
            id: "crew-preferences",
            label: "Preferences",
            icon: Icon.Settings,
            route: "/crew/preferences",
          },
        ],
      },
      {
        id: "work",
        label: "Work",
        icon: Icon.Briefcase,
        subItems: [
          {
            id: "crew-availability",
            label: "Availability",
            icon: Icon.Calendar,
            route: "/crew/availability",
          },
          {
            id: "crew-rates",
            label: "My Rates",
            icon: Icon.DollarSign,
            route: "/crew/rates",
          },
          {
            id: "crew-certifications",
            label: "Certifications",
            icon: Icon.Award,
            route: "/crew/certifications",
          },
          {
            id: "crew-skills",
            label: "Skills",
            icon: Icon.Star,
            route: "/crew/skills",
          },
        ],
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Icon.Bell,
        subItems: [
          {
            id: "crew-notification-settings",
            label: "Notification Settings",
            icon: Icon.Bell,
            route: "/crew/notification-settings",
          },
          {
            id: "crew-email-preferences",
            label: "Email Preferences",
            icon: Icon.Mail,
            route: "/crew/email-preferences",
          },
        ],
      },
      {
        id: "documents",
        label: "Documents",
        icon: Icon.FileText,
        subItems: [
          {
            id: "crew-contracts",
            label: "My Contracts",
            icon: Icon.FileCheck,
            route: "/crew/contracts",
          },
          {
            id: "crew-tax-forms",
            label: "Tax Forms",
            icon: Icon.FileText,
            route: "/crew/tax-forms",
          },
          {
            id: "crew-onboarding-docs",
            label: "Onboarding Documents",
            icon: Icon.Files,
            route: "/crew/onboarding-docs",
          },
        ],
      },
    ],
  };

  const crewMenuList = isCrewRoute
    ? [crewProjectsDropdown, CrewApplicationMenu, CrewAIMenu, CrewSettingsMenu]
    : [];

  return crewMenuList;
}