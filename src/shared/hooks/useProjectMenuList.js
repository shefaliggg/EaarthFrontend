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
    ],
  };

  const projectSettings = {
    id: "project-settings",
    triggerLabel: "Project Settings",
    triggerIcon: Icon.Settings,
    items: [
      {
        id: "detail",
        label: "Project Detail",
        icon: Icon.FileText,
        route: `/projects/${projectName}/settings/detail`,
      },
      {
        id: "general",
        label: "General Settings",
        icon: Icon.Settings2,
        route: `/projects/${projectName}/settings/general`,
      },
      {
        id: "construction",
        label: "Construction Settings",
        icon: Icon.Settings2,
        route: `/projects/${projectName}/settings/construction`,
      },
      {
        id: "onboarding",
        label: "Onboarding Settings",
        icon: Icon.UserPlus,
        route: `/projects/${projectName}/settings/onboarding`,
      },
      {
        id: "contracts", // 🆕 ADD THIS
        label: "Contracts",
        icon: Icon.FileText,
        route: `/projects/${projectName}/contractss`,
      },
      {
        id: "calendar",
        label: "Calendar Settings",
        icon: Icon.Calendar,
        route: `/projects/${projectName}/calendar/settings`,
      },
      {
        id: "timecard",
        label: "Timesheets Settings",
        icon: Icon.Clock,
        route: `/projects/${projectName}/settings/timesheet`,
      },
      {
        id: "roles",
        label: "Roles Settings",
        icon: Icon.User,
        route: `/projects/${projectName}/settings/roles`,
      },
      {
        id: "notifications",
        label: "Notifications Settings",
        icon: Icon.Bell,
        route: `/projects/${projectName}/settings/notifications`,
      },
      {
        id: "signers-recipients",
        label: "Signers & Recipients Settings",
        icon: Icon.Users,
        route: `/projects/${projectName}/settings/signers-recipients`,
      },
      {
        id: "approval-workflows",
        label: "Approval Workflows",
        icon: Icon.GitBranch,
        route: `/projects/${projectName}/settings/approval-workflows`,
      },
      {
        id: "billing",
        label: "Billing",
        icon: Icon.CreditCard,
        route: `/projects/${projectName}/settings/billing`,
      },
    ],
  };

  const projectDropdownList = isProjectSubRoute
    ? [allProjectsDropdown, ProjectApplicationMenu]
    : [allProjectsDropdown];

  return projectDropdownList;
}
