import { useState } from "react";
import {
  Archive,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileText,
  Home,
  Menu,
  MessageSquare,
  Plus,
  Settings,
  UserRound,
  Users,
  Video,
  LifeBuoy,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import eaarthLogo from "@/assets/eaarth.webp";
import Header from "@/shared/components/header/Header";
import AiChatWidget from "../features/ai/components/AIChatWidget";
import SuspenseOutlet from "../shared/components/SuspenseOutlet";
import { Footer } from "../shared/components/Footer";
import {
  cn,
  convertTitleToUrl,
  convertToPrettyText,
} from "../shared/config/utils";
import { projects as projectCatalog } from "../features/projects/pages/ProjectSettings/data.js";
import { useAuth } from "../features/auth/context/AuthContext";
import { useScrollHeaderTracker } from "../shared/hooks/useScrollHeaderTracker.js";

const DASHBOARD_PROJECTS = [
  {
    id: "avatar1",
    name: "AVATAR 1",
    accent: "#38bdf8",
    badgeClass: "border-sky-400/30 bg-sky-400/15 text-sky-400",
  },
  {
    id: "avatar2",
    name: "AVATAR 2",
    accent: "#34d399",
    badgeClass: "border-emerald-400/30 bg-emerald-400/15 text-emerald-400",
  },
  {
    id: "avatar3",
    name: "AVATAR 3",
    accent: "#fbbf24",
    badgeClass: "border-amber-400/30 bg-amber-400/15 text-amber-400",
  },
  {
    id: "avatar4",
    name: "AVATAR 4",
    accent: "#fb7185",
    badgeClass: "border-rose-400/30 bg-rose-400/15 text-rose-400",
  },
  {
    id: "avatar5",
    name: "AVATAR 5",
    accent: "#a78bfa",
    badgeClass: "border-violet-400/30 bg-violet-400/15 text-violet-400",
  },
];

const DASHBOARD_APPLICATIONS = [
  { id: "onboarding", label: "Onboarding", icon: Users, route: "onboarding" },
  {
    id: "timesheets",
    label: "Timesheets",
    icon: ClipboardList,
    route: "timesheets",
  },
  { id: "calendar", label: "Calendar", icon: CalendarDays, route: "calendar" },
  { id: "chat", label: "Chat", icon: MessageSquare, route: "chat" },
  {
    id: "call-sheets",
    label: "Call Sheets",
    icon: Video,
    route: "call-sheets",
  },
];

const createWorkspaceTabId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeDashboardPath = (path) => {
  if (!path || path === "/") return "/home";

  const normalized = path.replace(/\/+$/, "");
  return normalized || "/home";
};

const getProjectBySlug = (projectSlug) =>
  DASHBOARD_PROJECTS.find(
    (item) => convertTitleToUrl(item.name) === projectSlug,
  ) ||
  projectCatalog.find((item) => convertTitleToUrl(item.name) === projectSlug);

const resolveWorkspaceTabMeta = (path) => {
  const normalizedPath = normalizeDashboardPath(path);
  const segments = normalizedPath.split("/").filter(Boolean);

  if (normalizedPath === "/home") {
    return { label: "Home", icon: Home };
  }

  if (normalizedPath === "/projects") {
    return { label: "Projects", icon: Briefcase };
  }

  if (normalizedPath === "/projects/create") {
    return { label: "Create Project", icon: Briefcase };
  }

  if (normalizedPath === "/support") {
    return { label: "Support", icon: LifeBuoy };
  }

  if (normalizedPath === "/profile") {
    return { label: "Profile", icon: UserRound };
  }

  if (segments[0] === "settings") {
    if (segments.length === 1) {
      return { label: "Settings", icon: Settings };
    }

    return {
      label: `Settings - ${segments.slice(1).map(convertToPrettyText).join(" - ")}`,
      icon: Settings,
    };
  }

  if (segments[0] === "projects") {
    const projectSlug = segments[1];
    const project = getProjectBySlug(projectSlug);
    const projectLabel = project?.name ?? convertToPrettyText(projectSlug);

    if (segments.length === 2) {
      return {
        label: projectLabel,
        icon: UserRound,
        accent: project?.accent ?? null,
      };
    }

    const appSlug = segments[2];
    const app = DASHBOARD_APPLICATIONS.find((item) => item.route === appSlug);

    if (app) {
      return {
        label: `${projectLabel} - ${app.label}`,
        icon: app.icon,
        accent: project?.accent ?? null,
      };
    }

    return {
      label: `${projectLabel} - ${segments.slice(2).map(convertToPrettyText).join(" - ")}`,
      icon: FileText,
      accent: project?.accent ?? null,
    };
  }

  return {
    label: segments.map(convertToPrettyText).join(" / ") || "Home",
    icon: FileText,
  };
};

const getProjectIdFromPath = (path) => {
  const normalizedPath = normalizeDashboardPath(path);
  const match = normalizedPath.match(/^\/projects\/([^/]+)/);
  const activeSlug = match?.[1] || "";

  if (!activeSlug) {
    return null;
  }

  const activeProject = getProjectBySlug(activeSlug);

  return activeProject?.id || null;
};

const createWorkspaceTab = (path) => {
  const normalizedPath = normalizeDashboardPath(path);
  const meta = resolveWorkspaceTabMeta(normalizedPath);

  return {
    id: createWorkspaceTabId(),
    path: normalizedPath,
    label: meta.label,
    icon: meta.icon,
    accent: meta.accent || null,
  };
};

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [isArchivedSidebarOpen, setIsArchivedSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeProjectId = getProjectIdFromPath(pathname);
  const activeProjectSlugs = new Set(
    DASHBOARD_PROJECTS.map((project) => convertTitleToUrl(project.name)),
  );
  const archivedSidebarProjects = projectCatalog.filter(
    (project) => !activeProjectSlugs.has(convertTitleToUrl(project.name)),
  );
  const canCreateProject = user?.userType === "studio_admin";

  const [workspaceState, setWorkspaceState] = useState(() => {
    const initialTab = createWorkspaceTab(pathname);

    return {
      tabs: [initialTab],
      activeTabId: initialTab.id,
    };
  });

  const { tabs: workspaceTabs, activeTabId } = workspaceState;
  const showHeader = useScrollHeaderTracker();

  const handleOpenWorkspaceTab = (path) => {
    const nextPath = normalizeDashboardPath(path);
    const nextProjectId = getProjectIdFromPath(nextPath);

    setWorkspaceState((prev) => {
      const existingTab = prev.tabs.find((tab) => tab.path === nextPath);

      if (existingTab) {
        return {
          ...prev,
          activeTabId: existingTab.id,
        };
      }

      const nextTab = createWorkspaceTab(nextPath);

      return {
        tabs: [...prev.tabs, nextTab],
        activeTabId: nextTab.id,
      };
    });

    setExpandedProjectId(nextProjectId);
    setIsMobileSidebarOpen(false);
    if (nextPath !== pathname) {
      navigate(nextPath);
    }
  };

  const handleActivateWorkspaceTab = (tabId) => {
    const nextTab = workspaceTabs.find((tab) => tab.id === tabId);
    if (!nextTab) return;

    setWorkspaceState((prev) => ({
      ...prev,
      activeTabId: tabId,
    }));

    setExpandedProjectId(getProjectIdFromPath(nextTab.path));

    if (nextTab.path !== pathname) {
      navigate(nextTab.path);
    }
  };

  const handleCloseWorkspaceTab = (tabId) => {
    let nextPath = null;

    setWorkspaceState((prev) => {
      const tabIndex = prev.tabs.findIndex((tab) => tab.id === tabId);
      if (tabIndex === -1) return prev;

      const nextTabs = prev.tabs.filter((tab) => tab.id !== tabId);

      if (!nextTabs.length) {
        const fallbackTab = createWorkspaceTab("/home");
        nextPath = fallbackTab.path;

        return {
          tabs: [fallbackTab],
          activeTabId: fallbackTab.id,
        };
      }

      if (prev.activeTabId === tabId) {
        const fallbackTab = nextTabs[Math.min(tabIndex, nextTabs.length - 1)];
        nextPath = fallbackTab.path;

        return {
          tabs: nextTabs,
          activeTabId: fallbackTab.id,
        };
      }

      return {
        ...prev,
        tabs: nextTabs,
      };
    });

    setExpandedProjectId(nextPath ? getProjectIdFromPath(nextPath) : null);

    if (nextPath && nextPath !== pathname) {
      navigate(nextPath);
    }
  };

  return (
    <div className="min-h-screen">
      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/45 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className="flex">
        <aside
          className={cn(
            "fixed top-0 left-0 z-50 flex h-screen w-50 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out",
            isMobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0",
          )}
        >
          <div
            className={cn(
              "flex h-12 items-center justify-center border-b border-r border-sidebar-border",
            )}
          >
            <img
              src={eaarthLogo}
              alt="EAARTH"
              className="h-8 w-auto object-contain"
            />
          </div>

          {canCreateProject && (
            <div className="px-3 py-2">
              <button
                type="button"
                onClick={() => handleOpenWorkspaceTab("/projects/create")}
                className={cn(
                  "flex h-9 w-full items-center gap-2 rounded-md bg-sidebar-primary px-3 text-sm font-medium text-sidebar-primary-foreground transition-colors",
                  "hover:bg-sidebar-primary/90",
                )}
                title="Create Project"
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span>Create Project</span>
              </button>
            </div>
          )}

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-r border-sidebar-border">
            <div className="flex-1 min-h-0 overflow-y-auto p-3">
              <div className="space-y-3">
                {DASHBOARD_PROJECTS.map((project) => {
                  const slug = convertTitleToUrl(project.name);
                  const projectPath = `/projects/${slug}`;
                  const isActive = pathname.startsWith(`/projects/${slug}`);
                  const isOpen =
                    activeProjectId === project.id ||
                    expandedProjectId === project.id;

                  return (
                    <div key={project.id} className="space-y-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenWorkspaceTab(projectPath)}
                          className={cn(
                            "flex-1 flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isActive &&
                              "bg-sidebar-primary text-sidebar-primary-foreground",
                          )}
                          title={project.name}
                        >
                          <span className="flex-1 text-left font-medium">
                            {project.name}
                          </span>
                        </button>

                        <button
                          type="button"
                          aria-label={`${isOpen ? "Collapse" : "Expand"} ${project.name}`}
                          onClick={() =>
                            setExpandedProjectId((prev) =>
                              prev === project.id ? null : project.id,
                            )
                          }
                          className={cn(
                            "inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isActive &&
                              "bg-sidebar-primary text-sidebar-primary-foreground",
                          )}
                        >
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 shrink-0 transition-transform",
                              isOpen && "rotate-180",
                            )}
                          />
                        </button>
                      </div>

                      {isOpen && (
                        <div className="relative ml-5 pl-3 pt-0 space-y-1">
                          <div className="absolute left-0 top-0 bottom-1 w-px rounded-full bg-sidebar-border/70" />
                          {DASHBOARD_APPLICATIONS.map((item) => {
                            const ItemIcon = item.icon;
                            const to = `/projects/${slug}/${item.route}`;
                            const isAppActive = pathname === to;

                            return (
                              <div
                                key={`${project.id}-${item.id}`}
                                className="relative"
                              >
                                <span className="absolute -left-5 top-[calc(50%-12px)] h-9 w-5 border-l border-b border-sidebar-border/70 rounded-bl-[22px]" />
                                <button
                                  type="button"
                                  onClick={() => handleOpenWorkspaceTab(to)}
                                  className={cn(
                                    "relative flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    isAppActive &&
                                      "bg-sidebar-primary text-sidebar-primary-foreground",
                                  )}
                                  title={item.label}
                                >
                                  <ItemIcon className="w-4 h-4 shrink-0" />
                                  <span>{item.label}</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {archivedSidebarProjects.length > 0 && (
              <div className="shrink-0 border-t border-sidebar-border bg-sidebar/95 px-3 py-3">
                <button
                  type="button"
                  onClick={() => setIsArchivedSidebarOpen((prev) => !prev)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition-colors",
                    "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  aria-expanded={isArchivedSidebarOpen}
                  aria-label="Toggle archived projects"
                >
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em]">
                    <Archive className="h-3 w-3" />
                    Archived
                  </span>

                  <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em]">
                    <span>{archivedSidebarProjects.length}</span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-transform",
                        isArchivedSidebarOpen && "rotate-180",
                      )}
                    />
                  </span>
                </button>

                {isArchivedSidebarOpen && (
                  <div className="mt-2 max-h-40 space-y-1.5 overflow-y-auto pr-1">
                    {archivedSidebarProjects.map((project) => {
                      const slug = convertTitleToUrl(project.name);
                      const projectPath = `/projects/${slug}`;
                      const projectInitials = project.name
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((word) => word.charAt(0))
                        .join("")
                        .toUpperCase();

                      return (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => handleOpenWorkspaceTab(projectPath)}
                          className={cn(
                            "group flex w-full items-center gap-2 rounded-md px-2 py-2 text-left transition-colors",
                            "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                          title={project.name}
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold text-white shadow-sm"
                            style={{
                              backgroundColor: project.color || "#7c3aed",
                            }}
                          >
                            {projectInitials}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12px] font-medium">
                              {project.name}
                            </span>
                            <span className="block truncate text-[10px] text-sidebar-foreground/45">
                              {project.subtitle}
                            </span>
                          </span>

                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sidebar-accent/70 text-sidebar-foreground/50 transition-colors group-hover:bg-sidebar-primary group-hover:text-sidebar-primary-foreground">
                            <Archive className="h-3 w-3" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        <div className="flex-1 min-w-0 md:pl-50">
          <button
            type="button"
            aria-label="Open sidebar"
            className="md:hidden fixed top-4 left-4 z-30 inline-flex items-center justify-center h-9 w-9 rounded-md border bg-background hover:bg-muted transition-colors"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Header
            workspaceTabs={workspaceTabs}
            activeWorkspaceTabId={activeTabId}
            onWorkspaceTabSelect={handleActivateWorkspaceTab}
            onWorkspaceTabClose={handleCloseWorkspaceTab}
            onWorkspaceTabOpen={handleOpenWorkspaceTab}
            projectCount={DASHBOARD_PROJECTS.length}
          />
          <div className="p-6 pl-3 min-h-[calc(100svh-68px-52px)]">
            <SuspenseOutlet />
            <AiChatWidget />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
