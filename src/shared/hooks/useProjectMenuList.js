import { useLocation } from "react-router-dom";
import * as Icon from "lucide-react";
import {
  convertTitleToUrl,
  prettifySegment,
  convertToPrettyText,
} from "../config/utils";

export function useProjectMenus(allProjects = []) {
  const { pathname } = useLocation();

  const match = pathname.match(/\/projects\/([^/]+)/);
  const projectName = match ? match[1] : null;

  const isAllProjectRoute = pathname === "/projects";
  const isProjectSubRoute = !!projectName && pathname !== "/projects";

  const allProjectsDropdown = {
    id: "projects",
    triggerLabel: isProjectSubRoute
      ? prettifySegment(projectName)
      : isAllProjectRoute
      ? "All Projects"
      : "Projects",
    triggerIcon: Icon.Film,
    dropdownLabel: "Active Projects",
    align: "start",
    items: [
      {
        id: "all-projects",
        label: "All Projects",
        icon: Icon.Film,
        route: "/projects",
      },
      ...allProjects.map((p) => ({
        id: p.id,
        label: p.name,
        icon: Icon.Film,
        navigateWithName: true,
        projectCode: `${p.name}tempcode`,
        // This will navigate to /projects/:projectName which shows ProjectDetails
        route: `/projects/${convertTitleToUrl(p.name)}`,
      })),
    ],
  };

  const ProjectApplicationMenu = {
    id: "project-applications",
    triggerLabel: "Applications",
    triggerIcon: Icon.LayoutGrid,
    dropdownLabel: `Applications - ${convertToPrettyText(projectName)}`,
    align: "start",
    items: [
      {
        id: "crew-onboarding",
        label: "Crew Onboarding",
        icon: Icon.UserPlus,
        route: `/projects/${projectName}/onboarding`,
      },
      {
        id: "offers",
        label: "My Offers",
        icon: Icon.UserPlus,
        route: `/projects/${projectName}/offers`,
      },
      {
        id: "contracts",
        label: "Contracts",
        icon: Icon.UserPlus,
        route: `/projects/${projectName}/contracts`,
      },
      {
        id: "hod-timesheet-approval",
        label: "Timesheets",
        icon: Icon.Clock,
        route: `/projects/${projectName}/timesheets`,
      },
      {
        id: "project-calendar",
        label: "Calendar",
        icon: Icon.Calendar,
        route: `/projects/${projectName}/calendar`,
      },
      {
        id: "project-chat",
        label: "Chat",
        icon: Icon.MessageSquare,
        route: `/projects/${projectName}/chat`,
      },
      {
        id: "project-call-sheets",
        label: "Call Sheets",
        icon: Icon.ClipboardList,
        route: `/projects/${projectName}/call-sheets`,
      },
      // {
      //   id: "project-shooting-schedule",
      //   label: "Shooting Schedule",
      //   icon: Icon.Video,
      //   route: `/projects/${projectName}/shooting-schedule`,
      // },
      // {
      //   id: "project-asset",
      //   label: "Asset",
      //   icon: Icon.Archive,
      //   route: `/projects/${projectName}/asset`,
      // },
      // {
      //   id: "project-costume",
      //   label: "Costume",
      //   icon: Icon.Shirt,
      //   route: `/projects/${projectName}/costume`,
      // },
      // {
      //   id: "project-catering",
      //   label: "Catering",
      //   icon: Icon.UtensilsCrossed,
      //   route: `/projects/${projectName}/catering`,
      // },
      // {
      //   id: "project-accounts",
      //   label: "Accounts",
      //   icon: Icon.DollarSign,
      //   route: `/projects/${projectName}/accounts`,
      // },
      // {
      //   id: "project-script",
      //   label: "Script",
      //   icon: Icon.FileText,
      //   route: `/projects/${projectName}/script`,
      // },
      // {
      //   id: "project-market",
      //   label: "Market",
      //   icon: Icon.ShoppingCart,
      //   route: `/projects/${projectName}/market`,
      // },
      // {
      //   id: "project-transport",
      //   label: "Transport",
      //   icon: Icon.Truck,
      //   route: `/projects/${projectName}/transport`,
      // },
      // {
      //   id: "project-eplayer",
      //   label: "E Player",
      //   icon: Icon.Video,
      //   route: `/projects/${projectName}/eplayer`,
      // },
      // {
      //   id: "project-forms",
      //   label: "Forms",
      //   icon: Icon.CheckSquare,
      //   route: `/projects/${projectName}/forms`,
      // },
      // {
      //   id: "project-props",
      //   label: "Props & Assets",
      //   icon: Icon.Package,
      //   route: `/projects/${projectName}/props`,
      // },
      // {
      //   id: "project-animals",
      //   label: "Animals",
      //   icon: Icon.PawPrint,
      //   route: `/projects/${projectName}/animals`,
      // },
      // {
      //   id: "project-vehicles",
      //   label: "Vehicles",
      //   icon: Icon.Car,
      //   route: `/projects/${projectName}/vehicles`,
      // },
      // {
      //   id: "project-locations",
      //   label: "Locations",
      //   icon: Icon.MapPin,
      //   route: `/projects/${projectName}/locations`,
      // },
      // {
      //   id: "project-cloud",
      //   label: "Cloud",
      //   icon: Icon.Cloud,
      //   route: `/projects/${projectName}/cloud`,
      // },
      // {
      //   id: "project-notice-board",
      //   label: "Notice Board",
      //   icon: Icon.Megaphone,
      //   route: `/projects/${projectName}/notice-board`,
      // },
      // {
      //   id: "project-chat",
      //   label: "Project Chat",
      //   icon: Icon.MessageSquare,
      //   route: `/projects/${projectName}/chat`,
      // },

      // {
      //   id: "project-script-breakdown",
      //   label: "Script Breakdown",
      //   icon: Icon.FileText,
      //   route: `/projects/${projectName}/script-breakdown`,
      //   separatorBefore: true,
      // },
      // {
      //   id: "project-production-reports",
      //   label: "Production Reports",
      //   icon: Icon.ClipboardList,
      //   route: `/projects/${projectName}/production-reports`,
      // },
      // {
      //   id: "project-casting-calls",
      //   label: "Casting Calls",
      //   icon: Icon.Star,
      //   route: `/projects/${projectName}/casting-calls`,
      // },
      // {
      //   id: "project-crew",
      //   label: "Crew",
      //   icon: Icon.Users,
      //   route: `/projects/${projectName}/crew`,
      // },
      // {
      //   id: "project-cast",
      //   label: "Cast",
      //   icon: Icon.Star,
      //   route: `/projects/${projectName}/cast`,
      // },
      // {
      //   id: "project-schedule",
      //   label: "Schedule",
      //   icon: Icon.Calendar,
      //   route: `/projects/${projectName}/schedule`,
      // },
      // {
      //   id: "project-budget",
      //   label: "Budget",
      //   icon: Icon.DollarSign,
      //   route: `/projects/${projectName}/budget`,
      // },
      // {
      //   id: "project-documents",
      //   label: "Documents",
      //   icon: Icon.FolderOpen,
      //   route: `/projects/${projectName}/documents`,
      // },
      // {
      //   id: "project-esign",
      //   label: "EAARTH Sign",
      //   icon: Icon.PenTool,
      //   route: `/projects/${projectName}/esign`,
      // },
    ],
  };

  const AIMenu = {
    id: "ai-analytics",
    triggerLabel: "AI & Analytics",
    triggerIcon: Icon.Bot,
    dropdownLabel: `AI & Analytics - ${convertToPrettyText(projectName)}`,
    align: "start",
    items: [
      {
        id: "ai-template-studio",
        label: "AI Template Studio",
        icon: Icon.FileText,
        route: `/projects/${projectName}/ai-template-studio`,
      },
      {
        id: "ai-compliance",
        label: "AI Compliance",
        icon: Icon.Shield,
        route: `/projects/${projectName}/ai-compliance`,
      },
      {
        id: "predictive-analytics",
        label: "Predictive Analytics",
        icon: Icon.Eye,
        route: `/projects/${projectName}/predictive-analytics`,
      },
      {
        id: "audit-trail",
        label: "Audit Trail",
        icon: Icon.Clock,
        route: `/projects/${projectName}/audit-trail`,
      },
      {
        id: "document-management",
        label: "Document Management",
        icon: Icon.FolderOpen,
        route: `/projects/${projectName}/document-management`,
      },
      {
        id: "workflow-automation",
        label: "Workflow Automation",
        icon: Icon.Workflow,
        route: `/projects/${projectName}/workflow-automation`,
      },
      {
        id: "budget-management",
        label: "Budget Management",
        icon: Icon.DollarSign,
        route: `/projects/${projectName}/budget-management`,
      },
      {
        id: "ai-assistant-chat",
        label: "AI Assistant Chat",
        icon: Icon.BotMessageSquare,
        route: `/projects/${projectName}/ai-assistant-chat`,
      },
      {
        id: "ai-search-filtering",
        label: "AI Search & Filtering",
        icon: Icon.Search,
        route: `/projects/${projectName}/ai-search-filtering`,
      },
    ],
  };

  const projectSettings = {
    id: "project-settings",
    triggerLabel: "Project Settings",
    triggerIcon: Icon.Settings,
    items: [
      {
        id: "calendar",
        label: "Calendar Settings",
        icon: Icon.Calendar,
        route: `/projects/${projectName}/calendar-settings`,
      },
      {
        id: "timecard",
        label: "Timesheets Settings",
        icon: Icon.Clock,
        route: `/projects/${projectName}/timecard`,
      },
    ],
  };

  const projectDropdownList = isProjectSubRoute
    ? [allProjectsDropdown, ProjectApplicationMenu, AIMenu, projectSettings]
    : [allProjectsDropdown];

  return projectDropdownList;
}
