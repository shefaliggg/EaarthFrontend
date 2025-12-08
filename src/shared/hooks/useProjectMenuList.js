import { useLocation } from "react-router-dom";
import * as Icon from "lucide-react";
import { convertTitleToUrl, prettifySegment } from "../config/utils";

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
      : "Select A Project",
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
        route: `/projects/${convertTitleToUrl(p.name)}`,
      })),
    ],
  };

  const ProjectApplicationMenu = {
    id: "project-applications",
    triggerLabel: "Project Applications",
    triggerIcon: Icon.LayoutGrid,
    dropdownLabel: `Project Applications - ${projectName}`,
    align: "start",
    items: [
      {
        id: "project-calendar",
        label: "Project Calendar",
        icon: Icon.Calendar,
        route: `/projects/${projectName}/calendar`,
      },
      {
        id: "project-call-sheets",
        label: "Call Sheets",
        icon: Icon.ClipboardList,
        route: `/projects/${projectName}/call-sheets`,
      },
      {
        id: "project-shooting-schedule",
        label: "Shooting Schedule",
        icon: Icon.Video,
        route: `/projects/${projectName}/shooting-schedule`,
      },
      {
        id: "project-asset",
        label: "Asset",
        icon: Icon.Archive,
        route: `/projects/${projectName}/asset`,
      },
      {
        id: "project-costume",
        label: "Costume",
        icon: Icon.Shirt,
        route: `/projects/${projectName}/costume`,
      },
      {
        id: "project-catering",
        label: "Catering",
        icon: Icon.UtensilsCrossed,
        route: `/projects/${projectName}/catering`,
      },
      {
        id: "project-accounts",
        label: "Accounts",
        icon: Icon.DollarSign,
        route: `/projects/${projectName}/accounts`,
      },
      {
        id: "project-script",
        label: "Script",
        icon: Icon.FileText,
        route: `/projects/${projectName}/script`,
      },
      {
        id: "project-market",
        label: "Market",
        icon: Icon.ShoppingCart,
        route: `/projects/${projectName}/market`,
      },
      {
        id: "project-transport",
        label: "Transport",
        icon: Icon.Truck,
        route: `/projects/${projectName}/transport`,
      },
      {
        id: "project-eplayer",
        label: "E Player",
        icon: Icon.Video,
        route: `/projects/${projectName}/eplayer`,
      },
      {
        id: "project-forms",
        label: "Forms",
        icon: Icon.CheckSquare,
        route: `/projects/${projectName}/forms`,
      },
      {
        id: "project-props",
        label: "Props & Assets",
        icon: Icon.Package,
        route: `/projects/${projectName}/props`,
      },
      {
        id: "project-animals",
        label: "Animals",
        icon: Icon.PawPrint,
        route: `/projects/${projectName}/animals`,
      },
      {
        id: "project-vehicles",
        label: "Vehicles",
        icon: Icon.Car,
        route: `/projects/${projectName}/vehicles`,
      },
      {
        id: "project-locations",
        label: "Locations",
        icon: Icon.MapPin,
        route: `/projects/${projectName}/locations`,
      },
      {
        id: "project-cloud",
        label: "Cloud",
        icon: Icon.Cloud,
        route: `/projects/${projectName}/cloud`,
      },
      {
        id: "hod-timesheet-approval",
        label: "Timesheets",
        icon: Icon.Clock,
        route: `/projects/${projectName}/hod-timesheet-approval`,
      },
      {
        id: "project-notice-board",
        label: "Notice Board",
        icon: Icon.Megaphone,
        route: `/projects/${projectName}/notice-board`,
      },
      {
        id: "project-chat",
        label: "Project Chat",
        icon: Icon.MessageSquare,
        route: `/projects/${projectName}/chat`,
      },

      {
        id: "project-script-breakdown",
        label: "Script Breakdown",
        icon: Icon.FileText,
        route: `/projects/${projectName}/script-breakdown`,
        separatorBefore: true,
      },
      {
        id: "project-production-reports",
        label: "Production Reports",
        icon: Icon.ClipboardList,
        route: `/projects/${projectName}/production-reports`,
      },
      {
        id: "project-casting-calls",
        label: "Casting Calls",
        icon: Icon.Star,
        route: `/projects/${projectName}/casting-calls`,
      },
      {
        id: "project-crew",
        label: "Crew",
        icon: Icon.Users,
        route: `/projects/${projectName}/crew`,
      },
      {
        id: "project-cast",
        label: "Cast",
        icon: Icon.Star,
        route: `/projects/${projectName}/cast`,
      },
      {
        id: "project-schedule",
        label: "Schedule",
        icon: Icon.Calendar,
        route: `/projects/${projectName}/schedule`,
      },
      {
        id: "project-budget",
        label: "Budget",
        icon: Icon.DollarSign,
        route: `/projects/${projectName}/budget`,
      },
      {
        id: "project-documents",
        label: "Documents",
        icon: Icon.FolderOpen,
        route: `/projects/${projectName}/documents`,
      },
      {
        id: "project-esign",
        label: "EAARTH Sign",
        icon: Icon.PenTool,
        route: `/projects/${projectName}/esign`,
      },
    ],
  };

  const AIMenu = {
    id: "ai-analytics",
    triggerLabel: "AI & Analytics",
    triggerIcon: Icon.Bot,
    dropdownLabel: `AI & Analytics - ${projectName}`,
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
    dropdownLabel: `Project Settings - ${projectName}`,
    align: "start",
    items: [
      {
        id: "general",
        label: "General",
        icon: Icon.FileText,
        subItems: [
          {
            id: "project-settings-details",
            label: "Project Details",
            icon: Icon.FileText,
            route: `/projects/${projectName}/details`,
          },
          {
            id: "project-settings-dates",
            label: "Key Dates",
            icon: Icon.Calendar,
            route: `/projects/${projectName}/dates`,
          },
          {
            id: "project-settings-places",
            label: "Places & Locations",
            icon: Icon.MapPin,
            route: `/projects/${projectName}/places`,
          },
          {
            id: "project-settings-contacts",
            label: "Key Contacts",
            icon: Icon.Building2,
            route: `/projects/${projectName}/contacts`,
          },
          {
            id: "project-settings-custom",
            label: "Branding & Custom",
            icon: Icon.Palette,
            route: `/projects/${projectName}/custom`,
          },
        ],
      },
      {
        id: "configuration",
        label: "Configuration",
        icon: Icon.Settings,
        subItems: [
          {
            id: "project-settings-defaults",
            label: "Project Defaults",
            icon: Icon.Settings,
            route: `/projects/${projectName}/defaults`,
          },
          {
            id: "project-settings-permissions",
            label: "Permissions",
            icon: Icon.Shield,
            route: `/projects/${projectName}/permissions`,
          },
          {
            id: "project-settings-notifications",
            label: "Notifications",
            icon: Icon.Mail,
            route: `/projects/${projectName}/notifications`,
          },
          {
            id: "project-settings-signers",
            label: "Signers & Approval",
            icon: Icon.Edit,
            route: `/projects/${projectName}/signers`,
          },
          {
            id: "project-settings-departments",
            label: "Departments",
            icon: Icon.Layers,
            route: `/projects/${projectName}/departments`,
          },
          {
            id: "project-settings-timecard",
            label: "Timecard Settings",
            icon: Icon.Clock,
            route: `/projects/${projectName}/timecard`,
          },
          {
            id: "project-settings-vendors",
            label: "Vendors",
            icon: Icon.Briefcase,
            route: `/projects/${projectName}/vendors`,
          },
          {
            id: "project-settings-account-codes",
            label: "Account Codes",
            icon: Icon.Hash,
            route: `/projects/${projectName}/account-codes`,
          },
          {
            id: "project-settings-documents",
            label: "Documents",
            icon: Icon.FolderOpen,
            route: `/projects/${projectName}/documents`,
          },
        ],
      },
      {
        id: "rates",
        label: "Rates",
        icon: Icon.Users,
        subItems: [
          {
            id: "project-settings-standard-crew",
            label: "Standard Crew Rates",
            icon: Icon.Users,
            route: `/projects/${projectName}/standard-crew`,
          },
          {
            id: "project-settings-construction",
            label: "Construction Rates",
            icon: Icon.HardHat,
            route: `/projects/${projectName}/construction`,
          },
        ],
      },
      {
        id: "legal",
        label: "Legal",
        icon: Icon.FileCheck,
        subItems: [
          {
            id: "contract-templates",
            label: "Contract Templates",
            icon: Icon.FileCheck,
            route: `/projects/${projectName}/contract-templates`,
          },
          {
            id: "crew-onboarding-settings",
            label: "Crew Onboarding Settings",
            icon: Icon.UserCheck,
            route: `/projects/${projectName}/crew-onboarding`,
          },
        ],
      },
    ],
  };

  const projectDropdownList = isProjectSubRoute
    ? [allProjectsDropdown, ProjectApplicationMenu, AIMenu, projectSettings]
    : [allProjectsDropdown];

  return projectDropdownList;
}
