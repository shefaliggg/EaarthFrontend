// src/layouts/DashboardLayout.jsx
import { useEffect, useState, useCallback } from "react";
import {
  Briefcase,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileText,
  Home,
  Lock,
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
import { useSelector, useDispatch } from "react-redux";

import eaarthLogo from "@/assets/eaarth.webp";
import Header from "@/shared/components/header/Header";
import AiChatWidget from "../features/ai/components/AIChatWidget";
import SuspenseOutlet from "../shared/components/SuspenseOutlet";
import { Footer } from "../shared/components/Footer";
import {
  cn,
  convertToPrettyText,
} from "../shared/config/utils";
import { useAuth } from "../features/auth/context/AuthContext";
import { useScrollHeaderTracker } from "../shared/hooks/useScrollHeaderTracker.js";
import { getAllProjectsThunk } from "../features/projects/store/project.thunks";

// ── Constants ─────────────────────────────────────────────────────────────────

const DASHBOARD_APPLICATIONS = [
  { id: "onboarding",  label: "ONBOARDING",  icon: Users,         route: "onboarding" },
  { id: "timesheets",  label: "TIMESHEETS",  icon: ClipboardList, route: "timesheets" },
  { id: "calendar",    label: "CALENDAR",    icon: CalendarDays,  route: "calendar" },
  { id: "chat",        label: "CHAT",        icon: MessageSquare, route: "chat" },
  { id: "call-sheets", label: "CALL SHEETS", icon: Video,         route: "call-sheets" },
];

/**
 * Default palette — used ONLY when a project has no persisted branding.accentColor.
 * Once Fix 4 is live on the backend, this becomes purely a fallback for legacy data.
 */
const PROJECT_ACCENT_PALETTE = [
  "#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#a78bfa",
  "#f97316", "#22d3ee", "#818cf8", "#e879f9", "#4ade80",
];

// ── Approval status helpers ───────────────────────────────────────────────────

/**
 * Returns true when the project's apps should be fully accessible.
 * Only "approved" unlocks navigation; every other status (draft, pending, rejected)
 * keeps the sub-nav locked.
 */
function isProjectApproved(approvalStatus) {
  return approvalStatus === "approved";
}

/**
 * Human-readable label + colour token for each approval state.
 * Used in the sidebar lock tooltip.
 */
function approvalStatusMeta(approvalStatus) {
  switch (approvalStatus) {
    case "pending":  return { label: "Awaiting approval",  color: "#fbbf24" };
    case "rejected": return { label: "Rejected — resubmit", color: "#fb7185" };
    case "draft":    return { label: "Draft — not submitted", color: "#94a3b8" };
    default:         return null;
  }
}

// ── Project helpers ───────────────────────────────────────────────────────────

/**
 * Derive accent color for a production.
 * Priority: persisted branding.accentColor → fallback palette (index-based).
 *
 * Fix 4: once the backend schema has `branding.accentColor`, every new project
 * will have a deterministic, persisted color instead of a random per-session one.
 */
function resolveAccentColor(production, index) {
  return (
    production?.branding?.accentColor ??
    PROJECT_ACCENT_PALETTE[index % PROJECT_ACCENT_PALETTE.length]
  );
}

/** Turn a Redux production into a sidebar-project-shaped object */
function productionToSidebarProject(p, index) {
  return {
    id:             p._id,
    name:           p.productionName,
    accent:         resolveAccentColor(p, index),
    approvalStatus: p.approvalStatus ?? "draft",
  };
}

/** Build a URL slug from a production name (display-only; routing uses _id) */
function toSlug(name = "") {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// ── Workspace tab helpers ─────────────────────────────────────────────────────

const createWorkspaceTabId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeDashboardPath = (path) => {
  if (!path || path === "/") return "/home";
  return path.replace(/\/+$/, "") || "/home";
};

function getProjectBySlug(projectSlug, dynamicProjects) {
  return dynamicProjects.find((p) => toSlug(p.name) === projectSlug) ?? null;
}

function resolveWorkspaceTabMeta(path, dynamicProjects) {
  const normalizedPath = normalizeDashboardPath(path);
  const segments = normalizedPath.split("/").filter(Boolean);

  if (normalizedPath === "/home")            return { label: "HOME",           icon: Home };
  if (normalizedPath === "/projects")        return { label: "PROJECTS",       icon: Briefcase };
  if (normalizedPath === "/projects/create") return { label: "CREATE PROJECT", icon: Briefcase };
  if (normalizedPath === "/support")         return { label: "SUPPORT",        icon: LifeBuoy };
  if (normalizedPath === "/profile")         return { label: "PROFILE",        icon: UserRound };

  if (segments[0] === "settings") {
    return segments.length === 1
      ? { label: "SETTINGS", icon: Settings }
      : {
          label: `SETTINGS - ${segments.slice(1).map(convertToPrettyText).join(" - ").toUpperCase()}`,
          icon:  Settings,
        };
  }

  if (segments[0] === "projects") {
    const projectSlug  = segments[1];
    const project      = getProjectBySlug(projectSlug, dynamicProjects);
    const projectLabel = (project?.name ?? convertToPrettyText(projectSlug)).toUpperCase();

    if (segments.length === 2) {
      return { label: projectLabel, icon: UserRound, accent: project?.accent ?? null };
    }

    const appSlug = segments[2];
    const app     = DASHBOARD_APPLICATIONS.find((item) => item.route === appSlug);

    return app
      ? { label: app.label, icon: app.icon, accent: project?.accent ?? null }
      : {
          label:  segments.slice(2).map(convertToPrettyText).join(" - ").toUpperCase(),
          icon:   FileText,
          accent: project?.accent ?? null,
        };
  }

  return {
    label: segments.map(convertToPrettyText).join(" / ").toUpperCase() || "HOME",
    icon:  FileText,
  };
}

function getProjectIdFromPath(path, dynamicProjects) {
  const normalizedPath = normalizeDashboardPath(path);
  const match = normalizedPath.match(/^\/projects\/([^/]+)/);
  const activeSlug = match?.[1] || "";
  if (!activeSlug) return null;
  return getProjectBySlug(activeSlug, dynamicProjects)?.id || null;
}

function createWorkspaceTab(path, dynamicProjects) {
  const normalizedPath = normalizeDashboardPath(path);
  const meta = resolveWorkspaceTabMeta(normalizedPath, dynamicProjects);
  return {
    id:     createWorkspaceTabId(),
    path:   normalizedPath,
    label:  meta.label,
    icon:   meta.icon,
    accent: meta.accent || null,
  };
}

// ── Locked app tooltip ────────────────────────────────────────────────────────

/**
 * A subtle inline tooltip shown when hovering a locked app link.
 * Rendered as a `<span>` so it stays in-flow and doesn't need position:fixed.
 */
function LockedAppItem({ item, statusMeta }) {
  const [hovered, setHovered] = useState(false);
  const ItemIcon = item.icon;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Connector line decoration (mirrors the unlocked item) */}
      <span className="absolute -left-5 top-[calc(50%-12px)] h-9 w-5 border-l border-b border-sidebar-border/70 rounded-bl-[22px]" />

      {/* The locked button — visually dimmed, cursor blocked */}
      <button
        type="button"
        disabled
        aria-label={`${item.label} — ${statusMeta?.label ?? "locked"}`}
        className="relative flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm opacity-40 cursor-not-allowed select-none"
      >
        <ItemIcon className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {/* Lock icon — subtle, right-aligned */}
        <Lock className="w-3 h-3 shrink-0 opacity-60" />
      </button>

      {/* Hover tooltip */}
      {hovered && statusMeta && (
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 whitespace-nowrap rounded-md border border-sidebar-border bg-sidebar px-2.5 py-1.5 shadow-lg pointer-events-none"
          role="tooltip"
        >
          <p
            className="text-[11px] font-medium"
            style={{ color: statusMeta.color }}
          >
            {statusMeta.label}
          </p>
          <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">
            Available after admin approval
          </p>
        </div>
      )}
    </div>
  );
}

// ── Approval status banner ────────────────────────────────────────────────────

/**
 * A compact inline banner shown inside the project's sidebar section when the
 * project is not yet approved.  Keeps the user informed without requiring them
 * to navigate to the dashboard.
 */
function ApprovalStatusBadge({ approvalStatus }) {
  if (approvalStatus === "approved") return null;

  const meta = approvalStatusMeta(approvalStatus);
  if (!meta) return null;

  return (
    <div
      className="mx-2 mb-1 flex items-center gap-1.5 rounded-md px-2 py-1"
      style={{
        backgroundColor: `${meta.color}18`,
        border:          `1px solid ${meta.color}40`,
      }}
    >
      <Lock className="w-2.5 h-2.5 shrink-0" style={{ color: meta.color }} />
      <span
        className="text-[10px] font-medium leading-tight"
        style={{ color: meta.color }}
      >
        {meta.label}
      </span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedProjectId, setExpandedProjectId]     = useState(null);

  const { user }     = useAuth();
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();
  const showHeader   = useScrollHeaderTracker(); // eslint-disable-line no-unused-vars

  // ── Redux: real projects list ─────────────────────────────────────────────
  const reduxProjects  = useSelector((s) => s.project?.projects ?? []);
  const currentProject = useSelector((s) => s.project?.currentProject);

  // Fetch user's productions on mount
  useEffect(() => {
    dispatch(getAllProjectsThunk({}));
  }, [dispatch]);

  // ── Build sidebar projects from Redux only ────────────────────────────────
  const dynamicProjects = reduxProjects.map(productionToSidebarProject);

  /**
   * If a project was just created and isn't in the fetched list yet (e.g. the
   * list query filters by approvalStatus=approved), prepend it so the sidebar
   * shows it immediately.
   */
  const mergedProjects = (() => {
    if (!currentProject) return dynamicProjects;
    const alreadyIn = dynamicProjects.some((p) => p.id === currentProject._id);
    if (alreadyIn) return dynamicProjects;
    return [productionToSidebarProject(currentProject, 0), ...dynamicProjects];
  })();

  const activeSidebarProjects = mergedProjects;

  const canCreateProject = user?.userType === "studio_admin";
  const activeProjectId  = getProjectIdFromPath(pathname, mergedProjects);

  // ── Workspace tabs ────────────────────────────────────────────────────────
  const [workspaceState, setWorkspaceState] = useState(() => {
    const initialTab = createWorkspaceTab(pathname, []);
    return { tabs: [initialTab], activeTabId: initialTab.id };
  });

  const { tabs: workspaceTabs, activeTabId } = workspaceState;

  // Patch tab labels when project names resolve from Redux
  useEffect(() => {
    if (mergedProjects.length === 0) return;
    setWorkspaceState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((tab) => {
        const meta = resolveWorkspaceTabMeta(tab.path, mergedProjects);
        return { ...tab, label: meta.label, accent: meta.accent ?? tab.accent };
      }),
    }));
  }, [mergedProjects.map((p) => p.name).join(",")]); // eslint-disable-line

  const handleOpenWorkspaceTab = useCallback((path) => {
    const nextPath      = normalizeDashboardPath(path);
    const nextProjectId = getProjectIdFromPath(nextPath, mergedProjects);

    setWorkspaceState((prev) => {
      const existing = prev.tabs.find((t) => t.path === nextPath);
      if (existing) return { ...prev, activeTabId: existing.id };
      const nextTab = createWorkspaceTab(nextPath, mergedProjects);
      return { tabs: [...prev.tabs, nextTab], activeTabId: nextTab.id };
    });

    setExpandedProjectId(nextProjectId);
    setIsMobileSidebarOpen(false);
    if (nextPath !== pathname) navigate(nextPath);
  }, [mergedProjects, pathname, navigate]);

  const handleActivateWorkspaceTab = useCallback((tabId) => {
    const nextTab = workspaceTabs.find((t) => t.id === tabId);
    if (!nextTab) return;
    setWorkspaceState((prev) => ({ ...prev, activeTabId: tabId }));
    setExpandedProjectId(getProjectIdFromPath(nextTab.path, mergedProjects));
    if (nextTab.path !== pathname) navigate(nextTab.path);
  }, [workspaceTabs, mergedProjects, pathname, navigate]);

  const handleCloseWorkspaceTab = useCallback((tabId) => {
    let nextPath = null;

    setWorkspaceState((prev) => {
      const tabIndex = prev.tabs.findIndex((t) => t.id === tabId);
      if (tabIndex === -1) return prev;

      const nextTabs = prev.tabs.filter((t) => t.id !== tabId);

      if (!nextTabs.length) {
        const fallback = createWorkspaceTab("/home", mergedProjects);
        nextPath = fallback.path;
        return { tabs: [fallback], activeTabId: fallback.id };
      }

      if (prev.activeTabId === tabId) {
        const fallback = nextTabs[Math.min(tabIndex, nextTabs.length - 1)];
        nextPath = fallback.path;
        return { tabs: nextTabs, activeTabId: fallback.id };
      }

      return { ...prev, tabs: nextTabs };
    });

    setExpandedProjectId(nextPath ? getProjectIdFromPath(nextPath, mergedProjects) : null);
    if (nextPath && nextPath !== pathname) navigate(nextPath);
  }, [mergedProjects, pathname, navigate]);

  // ── Render ────────────────────────────────────────────────────────────────
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
        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-50 flex h-screen w-50 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 ease-in-out",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
        >
          {/* Logo */}
          <div className="flex h-12 items-center justify-center border-b border-sidebar-border">
            <img src={eaarthLogo} alt="EAARTH" className="h-12 w-auto object-contain" />
          </div>

          {/* Create project button */}
          {canCreateProject && (
            <>
              <div className="px-3 py-2">
                <button
                  type="button"
                  onClick={() => handleOpenWorkspaceTab("/projects/create")}
                  className="flex h-9 w-full items-center gap-2 rounded-md bg-sidebar-primary px-3 text-sm font-medium text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/90"
                  title="CREATE PROJECT"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span>CREATE PROJECT</span>
                </button>
              </div>
              <div className="border-b border-sidebar-border" />
            </>
          )}

          {/* Projects list */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto p-3">
              <div className="space-y-3">
                {activeSidebarProjects.length === 0 && (
                  <p className="px-2 text-[11px] text-sidebar-foreground/40">
                    NO PROJECTS YET.
                  </p>
                )}

                {activeSidebarProjects.map((project) => {
                  const slug        = toSlug(project.name);
                  const projectPath = `/projects/${slug}`;
                  const isActive    = pathname.startsWith(`/projects/${slug}`);
                  const isOpen      = activeProjectId === project.id || expandedProjectId === project.id;

                  // ── Fix 3: derive approval state for gating ─────────────
                  const approved    = isProjectApproved(project.approvalStatus);
                  const statusMeta  = approvalStatusMeta(project.approvalStatus);
                  // Show the amber dot for anything that isn't approved
                  const isPending   = !approved;

                  const projectInitials = project.name
                    .split(" ").filter(Boolean).slice(0, 2)
                    .map((w) => w[0]).join("").toUpperCase();

                  return (
                    <div key={project.id} className="space-y-1">
                      {/* ── Project header row ────────────────────────── */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenWorkspaceTab(projectPath)}
                          className={cn(
                            "flex-1 flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                          )}
                          title={project.name.toUpperCase()}
                        >
                          {/* Project avatar */}
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center border text-[10px] font-bold text-white shadow-sm"
                            style={{
                              backgroundColor: project.accent || "#7c3aed",
                              borderColor:     `${project.accent || "#7c3aed"}80`,
                              borderRadius:    "8px",
                            }}
                          >
                            {projectInitials}
                          </span>

                          <span className="flex-1 truncate text-left font-medium uppercase">
                            {project.name}
                          </span>

                          {/* Status dot — amber = not approved */}
                          {isPending && (
                            <span
                              className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: statusMeta?.color ?? "#fbbf24" }}
                              title={statusMeta?.label}
                            />
                          )}
                        </button>

                        {/* Expand/collapse chevron */}
                        <button
                          type="button"
                          aria-label={`${isOpen ? "COLLAPSE" : "EXPAND"} ${project.name.toUpperCase()}`}
                          onClick={() =>
                            setExpandedProjectId((prev) =>
                              prev === project.id ? null : project.id
                            )
                          }
                          className={cn(
                            "inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
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

                      {/* ── Expanded sub-nav ──────────────────────────── */}
                      {isOpen && (
                        <div className="space-y-0.5">
                          {/* Fix 3: approval status badge (draft / pending / rejected) */}
                          <ApprovalStatusBadge approvalStatus={project.approvalStatus} />

                          <div className="relative ml-5 pl-3 pt-0 space-y-1">
                            <div className="absolute left-0 top-0 bottom-1 w-px rounded-full bg-sidebar-border/70" />

                            {DASHBOARD_APPLICATIONS.map((item) => {
                              const to = `/projects/${slug}/${item.route}`;

                              // ── Fix 3: gate navigation on approval ────
                              if (!approved) {
                                return (
                                  <LockedAppItem
                                    key={`${project.id}-${item.id}`}
                                    item={item}
                                    statusMeta={statusMeta}
                                  />
                                );
                              }

                              // Approved — normal clickable link
                              const ItemIcon    = item.icon;
                              const isAppActive = pathname === to;

                              return (
                                <div key={`${project.id}-${item.id}`} className="relative">
                                  <span className="absolute -left-5 top-[calc(50%-12px)] h-9 w-5 border-l border-b border-sidebar-border/70 rounded-bl-[22px]" />
                                  <button
                                    type="button"
                                    onClick={() => handleOpenWorkspaceTab(to)}
                                    className={cn(
                                      "relative flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                      isAppActive && "bg-sidebar-primary text-sidebar-primary-foreground",
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
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content ───────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 md:pl-50">
          <button
            type="button"
            aria-label="OPEN SIDEBAR"
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
            projectCount={mergedProjects.length}
          />

          <div className="p-6 pl-3 min-h-[calc(100svh-68px-29px)]">
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