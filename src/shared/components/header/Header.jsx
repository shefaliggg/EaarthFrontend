import { Fragment, useEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers3,
  LayoutGrid,
  Search,
  Settings,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { NotificationsPanel } from "../NotificationPanel";
import { ChatPanel } from "../ChatPanel";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";

import {
  cn,
  convertTitleToUrl,
  convertToPrettyText,
  getFullName,
} from "../../config/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { triggerGlobalLogout } from "../../../features/auth/config/globalLogoutConfig";
import { SmartIcon } from "../SmartIcon";
import { adminDropdownConfig } from "../../config/adminDropdownNavList";
import { useScrollHeaderTracker } from "../../hooks/useScrollHeaderTracker";
import useChatStore from "../../../features/projects/project-chat/store/chat.store";
import { projects as projectCatalog } from "@/constants/data.js";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "system";

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return "system";
};

export default function Header({
  workspaceTabs = [],
  activeWorkspaceTabId = null,
  onWorkspaceTabSelect,
  onWorkspaceTabClose,
  onWorkspaceTabOpen,
  projectCount = projectCatalog.length,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);
  const [launcherPanelView, setLauncherPanelView] = useState("apps");
  const [appLauncherQuery, setAppLauncherQuery] = useState("");
  const [appLauncherView, setAppLauncherView] = useState("grid");
  const [displayMode, setDisplayMode] = useState("text-icon");
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme);
  const [notificationCount] = useState(5);
  const [messageCount] = useState(3);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const scrollRef = useRef(null);

  const showHeader = useScrollHeaderTracker();
  const navigate = useNavigate();
  const params = useParams();

  const projectId = params.projectId || "avatar-1";
  const routeProjectKey = params.projectName || params.projectId || "avatar-1";
  const { currentUser } = useSelector((state) => state.user);

  const fullName = getFullName(currentUser) || "Not Available";
  const role = currentUser?.userType || "Not Available";
  const onlineCount = useChatStore((state) => state.onlineUsers.size);
  const activeWorkspaceTab = workspaceTabs.find(
    (tab) => tab.id === activeWorkspaceTabId,
  );
  const currentProject =
    projectCatalog.find(
      (project) =>
        project.id === routeProjectKey ||
        convertTitleToUrl(project.name) === routeProjectKey,
    ) || projectCatalog[0];
  const currentProjectApps = currentProject?.apps || [];
  const filteredLauncherApps = currentProjectApps.filter((app) => {
    const query = appLauncherQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      app.name.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query)
    );
  });

  const nameParts = fullName.split(" ").filter(Boolean);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  const displayName =
    lastName && firstName ? `${lastName}, ${firstName}` : fullName;
  const initials = `${lastName.charAt(0)}${firstName.charAt(0)}`.toUpperCase();
  const avatar = currentUser?.avatar;
  const projectInitials = (currentProject?.name || routeProjectKey || "PROJECT")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  const adminMenuItems = adminDropdownConfig(role);
  const activeWorkspaceLabel = activeWorkspaceTab?.label || "workspace";
  const projectAccent = currentProject?.color || "#7c3aed";

  const handleThemeChange = (value) => {
    setCurrentTheme(value);
    localStorage.setItem("theme", value);
  };

  const handleOpenLauncherRoute = (path) => {
    setIsAppLauncherOpen(false);
    setLauncherPanelView("apps");
    onWorkspaceTabOpen?.(path);
  };

  const handleAppLauncherOpenChange = (nextOpen) => {
    setIsAppLauncherOpen(nextOpen);

    if (!nextOpen) {
      setAppLauncherQuery("");
      setAppLauncherView("grid");
      setLauncherPanelView("apps");
    }
  };

  const handleProjectSwitch = (project) => {
    handleOpenLauncherRoute(`/projects/${convertTitleToUrl(project.name)}`);
  };

  const resolveLauncherRoute = (appId) => {
    const base = `/projects/${routeProjectKey}`;

    switch (appId) {
      case "project-calendar":
      case "calendar":
        return `${base}/calendar`;
      case "call-sheets":
        return `${base}/call-sheets`;
      case "shooting-schedule":
        return `${base}/calendar/shooting`;
      case "tmo":
        return `${base}/calendar/tmo`;
      case "onboarding":
        return `${base}/onboarding`;
      case "timesheets":
        return `${base}/timesheets`;
      case "cloud":
        return `${base}/cloud`;
      case "chat":
      case "project-chat":
        return `${base}/chat`;
      case "crew-search":
        return `${base}/crew-search`;
      default:
        return base;
    }
  };

  const handleLauncherSelect = (appId) => {
    handleOpenLauncherRoute(resolveLauncherRoute(appId));
  };

  const actionHandlers = {
    logout: () => triggerGlobalLogout(),
    messages: () => setShowMessages(true),
    "display-mode": (value) => setDisplayMode(value),
    theme: (value) => handleThemeChange(value),
  };

  useEffect(() => {
    if (currentTheme === "dark") {
      document.body.classList.add("dark");
    } else if (currentTheme === "light") {
      document.body.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    window.dispatchEvent(new Event("theme-change"));
  }, [currentTheme]);

  useEffect(() => {
    document.body.classList.toggle(
      "overflow-hidden",
      showMessages || showNotifications,
    );

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showMessages, showNotifications]);

  useEffect(() => {
    const activeTab = document.querySelector("#active-tab");
    activeTab?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, [activeWorkspaceTabId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateFade = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;

      setShowLeftFade(scrollLeft > 0);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1);
    };

    updateFade();
    el.addEventListener("scroll", updateFade);

    return () => el.removeEventListener("scroll", updateFade);
  }, []);
  return (
    <>
      <div
        className={`sticky top-0 z-40 bg-background/40 backdrop-blur-xs transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="">
          <div className="flex h-12 items-end gap-3 px-6 pl-0 border border-border/60 border-l-0 bg-background/40">
            {workspaceTabs.length > 0 && (
              <div className="min-w-0 flex-1 self-stretch relative">
                <div
                  ref={scrollRef}
                  className="scrollbar-none flex h-full items-end bg-transparent gap-0.5 overflow-x-auto overflow-y-hidden px-2"
                >
                  {workspaceTabs.map((tab) => {
                    const isActive = tab.id === activeWorkspaceTabId;

                    return (
                      <div
                        id="active-tab"
                        key={tab.id}
                        className={cn(
                          "group relative shrink-0",
                          isActive ? "z-10" : "z-0",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => onWorkspaceTabSelect?.(tab.id)}
                          className={cn(
                            "relative flex min-w-[8.5rem] max-w-[14rem] items-center gap-2 border border-border/40 px-3 pr-8 text-left text-[13px] backdrop-blur-sm transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            isActive
                              ? "rounded-t-[10px] h-10 border-b-transparent bg-primary/10 text-primary"
                              : "rounded-[10px] h-9 mb-1 shadow bg-background/30 text-muted-foreground hover:bg-background/40 hover:text-foreground",
                          )}
                          title={tab.label}
                        >
                          <span className="min-w-0 max-w-[10rem] truncate font-medium">
                            {tab.label}
                          </span>
                        </button>

                        <button
                          type="button"
                          aria-label={`Close ${tab.label}`}
                          onClick={() => onWorkspaceTabClose?.(tab.id)}
                          className={cn(
                            "absolute right-1 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-sm transition-all",
                            "text-muted-foreground/80 hover:bg-muted hover:text-foreground",
                            isActive
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                          )}
                        >
                          <X className="h-3 w-3" strokeWidth={2} />
                        </button>
                      </div>
                    );
                  })}
                  <div aria-hidden="true" className="shrink-0 w-10" />
                </div>

                {showLeftFade && (
                  <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-foreground/5 to-transparent" />
                )}

                {showRightFade && (
                  <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-foreground/5 to-transparent" />
                )}
              </div>
            )}

            <div className="ml-auto flex shrink-0 items-center gap-1.5 self-center">
              <div className="hidden min-w-0 max-w-[34rem] items-center gap-2 rounded-full border border-border/60 bg-background/35 px-4 py-2 text-sm backdrop-blur-sm lg:flex">
                <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-muted-foreground">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="font-medium">{onlineCount} online</span>
                </div>

                <div className="h-5 w-px bg-border/70" />

                <span className="min-w-0 truncate text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {firstName || "You"}
                  </span>{" "}
                  In{" "}
                  <span className="font-semibold text-primary">
                    {activeWorkspaceLabel}
                  </span>
                </span>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowNotifications(true)}
                className="relative h-10 w-10 rounded-full text-muted-foreground hover:bg-background/50 hover:text-foreground"
                aria-label="Notifications"
                title="Notifications"
              >
                <span className="relative inline-flex h-5 w-5 items-center justify-center">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-600 px-1 text-[9px] leading-none text-background">
                      {notificationCount}
                    </span>
                  )}
                </span>
              </Button>

              <Popover
                open={isAppLauncherOpen}
                onOpenChange={handleAppLauncherOpenChange}
              >
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "h-9 w-9 rounded-full text-muted-foreground hover:bg-background/50 hover:text-foreground",
                      isAppLauncherOpen && "bg-background/50 text-foreground",
                    )}
                    aria-label="Open app launcher"
                    title="Apps"
                  >
                    <span className="grid h-3.5 w-3.5 grid-cols-2 gap-0.5">
                      <span className="h-[5px] w-[5px] rounded-[2px] border border-current bg-transparent" />
                      <span className="h-[5px] w-[5px] rounded-[2px] border border-current bg-transparent" />
                      <span className="h-[5px] w-[5px] rounded-[2px] border border-current bg-transparent" />
                      <span className="h-[5px] w-[5px] rounded-[2px] border border-current bg-transparent" />
                    </span>
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  sideOffset={10}
                  className="w-[min(84vw,28rem)] overflow-hidden rounded-[22px] border-border/50 bg-popover/95 p-0 text-popover-foreground shadow-[0_20px_56px_-32px_rgba(124,58,237,0.35)] ring-1 ring-primary/5"
                >
                  <div className="flex h-[calc(100vh-6.5rem)] flex-col bg-popover/95 backdrop-blur-2xl">
                    <div
                      className="h-0.5 shrink-0"
                      style={{
                        background: `linear-gradient(90deg, ${projectAccent}, rgba(147, 51, 234, 0.85), rgba(59, 130, 246, 0.85))`,
                      }}
                    />

                    <div className="shrink-0 border-b border-border/60 px-3 py-2.5">
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] text-base font-semibold text-white shadow-sm"
                            style={{
                              backgroundColor:
                                currentProject?.color || "#7c3aed",
                            }}
                          >
                            {projectInitials}
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="truncate text-[17px] font-semibold tracking-tight text-foreground">
                              {currentProject?.name ||
                                convertToPrettyText(routeProjectKey)}
                            </div>

                            <div
                              className="inline-flex max-w-full items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                              style={{
                                color: currentProject?.color || "#7c3aed",
                                backgroundColor:
                                  currentProject?.colorLight ||
                                  "rgba(124, 58, 237, 0.12)",
                              }}
                            >
                              <span className="truncate">
                                {currentProject?.subtitle || "Project apps"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            setLauncherPanelView((current) =>
                              current === "projects" ? "apps" : "projects",
                            )
                          }
                          className="h-8 rounded-full px-2 text-[11px] font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                        >
                          <span>{projectCount} projects</span>
                          {launcherPanelView === "projects" ? (
                            <ChevronLeft className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {launcherPanelView === "apps" ? (
                      <>
                        <div className="shrink-0 px-3 pt-2.5">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-1 items-center gap-2 rounded-[16px] border border-primary/30 bg-background/75 px-2.5 py-1.5 shadow-[0_6px_16px_-18px_rgba(124,58,237,0.45)]">
                              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <Input
                                value={appLauncherQuery}
                                onChange={(event) =>
                                  setAppLauncherQuery(event.target.value)
                                }
                                placeholder={`Search ${currentProjectApps.length} apps...`}
                                className="h-7 border-0 bg-transparent px-0 text-[13px] font-medium shadow-none focus-visible:ring-0"
                              />
                            </div>

                            <div className="flex shrink-0 items-center rounded-[14px] bg-muted/70 p-0.5">
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => setAppLauncherView("grid")}
                                className={cn(
                                  "h-7 w-7 rounded-[10px] text-muted-foreground hover:bg-background/80 hover:text-foreground",
                                  appLauncherView === "grid" &&
                                    "bg-background text-primary shadow-sm",
                                )}
                                aria-label="Grid view"
                              >
                                <LayoutGrid className="h-3 w-3" />
                              </Button>

                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => setAppLauncherView("list")}
                                className={cn(
                                  "h-7 w-7 rounded-[10px] text-muted-foreground hover:bg-background/80 hover:text-foreground",
                                  appLauncherView === "list" &&
                                    "bg-background text-primary shadow-sm",
                                )}
                                aria-label="List view"
                              >
                                <Layers3 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex min-h-0 flex-1 px-3 pb-3 pt-2.5">
                          <ScrollArea className="min-h-0 flex-1">
                            <div className="pr-1">
                              {filteredLauncherApps.length > 0 ? (
                                appLauncherView === "grid" ? (
                                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
                                    {filteredLauncherApps.map((app) => {
                                      const AppIcon = app.icon;
                                      const hasNotifications =
                                        (app.notifications || 0) > 0;

                                      return (
                                        <button
                                          key={app.id}
                                          type="button"
                                          onClick={() =>
                                            handleLauncherSelect(app.id)
                                          }
                                          className="group flex flex-col items-center gap-2 rounded-[16px] p-1 text-center transition-transform hover:-translate-y-0.5"
                                          title={app.description}
                                        >
                                          <div className="relative">
                                            <div
                                              className="flex h-14 w-14 items-center justify-center rounded-[18px] text-primary shadow-sm transition-colors group-hover:shadow-md"
                                              style={{
                                                backgroundColor: `${currentProject?.color || "#7c3aed"}14`,
                                                color:
                                                  currentProject?.color ||
                                                  "#7c3aed",
                                              }}
                                            >
                                              <AppIcon
                                                className="h-6 w-6"
                                                strokeWidth={2}
                                              />
                                            </div>

                                            {hasNotifications && (
                                              <span className="absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold leading-none text-white shadow-sm">
                                                {app.notifications > 9
                                                  ? "9+"
                                                  : app.notifications}
                                              </span>
                                            )}
                                          </div>

                                          <div className="min-h-[1.75rem]">
                                            <div className="max-w-[7rem] truncate text-[10px] font-semibold uppercase tracking-wide text-foreground/75">
                                              {app.name}
                                            </div>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {filteredLauncherApps.map((app) => {
                                      const AppIcon = app.icon;
                                      const hasNotifications =
                                        (app.notifications || 0) > 0;

                                      return (
                                        <button
                                          key={app.id}
                                          type="button"
                                          onClick={() =>
                                            handleLauncherSelect(app.id)
                                          }
                                          className="flex w-full items-center gap-2.5 rounded-[14px] border border-border/60 px-2.5 py-2 text-left transition-colors hover:bg-muted/60"
                                          title={app.description}
                                        >
                                          <div
                                            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px]"
                                            style={{
                                              backgroundColor: `${currentProject?.color || "#7c3aed"}14`,
                                              color:
                                                currentProject?.color ||
                                                "#7c3aed",
                                            }}
                                          >
                                            <AppIcon
                                              className="h-[18px] w-[18px]"
                                              strokeWidth={2}
                                            />

                                            {hasNotifications && (
                                              <span className="absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold leading-none text-white shadow-sm">
                                                {app.notifications > 9
                                                  ? "9+"
                                                  : app.notifications}
                                              </span>
                                            )}
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <div className="truncate text-[12px] font-semibold text-foreground">
                                              {app.name}
                                            </div>
                                            <div className="truncate text-[10px] text-muted-foreground">
                                              {app.description}
                                            </div>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )
                              ) : (
                                <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-border/70 py-8 text-center">
                                  <div className="text-[11px] font-medium text-foreground">
                                    No apps found
                                  </div>
                                  <div className="mt-1 text-[10px] text-muted-foreground">
                                    Try a different search term.
                                  </div>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </div>
                      </>
                    ) : (
                      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-2.5">
                        <div className="px-1 pb-2 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                          Switch Project
                        </div>

                        <ScrollArea className="min-h-0 flex-1">
                          <div className="space-y-2 pr-1">
                            {projectCatalog.map((project) => {
                              const isSelected =
                                project.id === currentProject?.id;
                              const projectNotifications = project.apps.reduce(
                                (count, app) =>
                                  count + (app.notifications || 0),
                                0,
                              );
                              const projectAppsCount = project.apps.length;
                              const projectAvatarInitials = (project.name || "")
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
                                  onClick={() => handleProjectSwitch(project)}
                                  className={cn(
                                    "relative flex w-full items-center gap-2.5 rounded-[22px] border border-transparent px-3 py-2.5 text-left transition-colors",
                                    isSelected
                                      ? "border-primary/10 bg-primary/5 shadow-[0_12px_24px_-24px_rgba(124,58,237,0.55)]"
                                      : "hover:bg-muted/50",
                                  )}
                                  title={project.name}
                                >
                                  {isSelected && (
                                    <span
                                      className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
                                      style={{
                                        backgroundColor:
                                          project.color || "#7c3aed",
                                      }}
                                    />
                                  )}

                                  <div
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] text-sm font-semibold text-white shadow-sm"
                                    style={{
                                      backgroundColor:
                                        project.color || "#7c3aed",
                                    }}
                                  >
                                    {projectAvatarInitials}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="truncate text-[15px] font-semibold tracking-tight text-foreground">
                                      {project.name}
                                    </div>

                                    <div className="mt-1 flex items-center gap-2">
                                      <span
                                        className="truncate text-[11px] font-medium"
                                        style={{
                                          color: project.color || "#7c3aed",
                                        }}
                                      >
                                        {project.subtitle}
                                      </span>

                                      <div className="flex min-w-0 flex-1 items-center gap-2">
                                        <div className="h-2 w-16 overflow-hidden rounded-full bg-muted/80">
                                          <div
                                            className="h-full rounded-full"
                                            style={{
                                              width: `${project.progress}%`,
                                              backgroundColor:
                                                project.color || "#7c3aed",
                                            }}
                                          />
                                        </div>
                                        <span className="text-[11px] font-medium text-muted-foreground">
                                          {project.progress}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex shrink-0 items-center gap-1.5">
                                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-red-500 px-2 text-[11px] font-semibold leading-none text-white shadow-sm">
                                      {projectNotifications > 99
                                        ? "99+"
                                        : projectNotifications}
                                    </span>

                                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-muted px-2 text-[11px] font-semibold leading-none text-muted-foreground shadow-sm">
                                      {projectAppsCount}
                                    </span>

                                    {isSelected ? (
                                      <span
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm"
                                        style={{
                                          backgroundColor:
                                            project.color || "#7c3aed",
                                        }}
                                      >
                                        <Check
                                          className="h-4 w-4"
                                          strokeWidth={3}
                                        />
                                      </span>
                                    ) : null}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    <div className="shrink-0 border-t border-border/60 px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <span className="inline-flex h-1.5 w-8 rounded-full bg-primary/80" />
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-300" />
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-violet-300" />
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground">
                            {currentProjectApps.length} apps
                          </span>

                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                              handleOpenLauncherRoute(
                                `/projects/${routeProjectKey}/settings`,
                              )
                            }
                            className="h-8 rounded-full px-2.5 text-[10px] font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                          >
                            <Settings className="h-3 w-3" />
                            Settings
                          </Button>

                          <Button
                            type="button"
                            onClick={() =>
                              handleOpenLauncherRoute(
                                `/projects/${routeProjectKey}/settings`,
                              )
                            }
                            className="h-8 rounded-full px-2.5 text-[10px] font-semibold"
                          >
                            Manage Apps
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="group flex h-10 items-center px-1.5 !transition-none hover:!bg-transparent active:!bg-transparent"
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={avatar}
                        alt={displayName}
                        className="h-full w-full rounded-full object-cover"
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  {adminMenuItems.map((item) => {
                    if (item.type === "submenu") {
                      return (
                        <Fragment key={item.id}>
                          {item.separatorBefore && <DropdownMenuSeparator />}

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="gap-2">
                              <SmartIcon icon={item.icon} className="mr-2" />
                              {item.label}
                            </DropdownMenuSubTrigger>

                            <DropdownMenuSubContent className="w-44">
                              {item.children.map((child) => {
                                const isActive =
                                  item.id === "display-mode"
                                    ? displayMode === child.id
                                    : currentTheme === child.id;

                                return (
                                  <DropdownMenuItem
                                    key={child.id}
                                    onClick={() =>
                                      actionHandlers[child.action](child.id)
                                    }
                                    className={cn(
                                      isActive && "bg-accent text-background",
                                    )}
                                  >
                                    <SmartIcon
                                      icon={child.icon}
                                      className={cn(
                                        "mr-2",
                                        isActive && "text-background",
                                      )}
                                    />
                                    {child.label}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        </Fragment>
                      );
                    }

                    return (
                      <Fragment key={item.id}>
                        {item.separatorBefore && <DropdownMenuSeparator />}

                        <DropdownMenuItem
                          className={cn(item.danger && "text-red-600")}
                          onClick={() => {
                            if (item.route) navigate(item.route);
                            if (item.action) actionHandlers[item.action]?.();
                          }}
                        >
                          <SmartIcon
                            icon={item.icon}
                            className="mr-2 h-4 w-4"
                          />
                          {item.label}

                          {item.badge && messageCount > 0 && (
                            <span className="ml-auto rounded-full bg-purple-600 px-1.5 text-xs text-background">
                              {messageCount}
                            </span>
                          )}
                        </DropdownMenuItem>
                      </Fragment>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {showNotifications && (
        <NotificationsPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          projectId={projectId}
        />
      )}

      {showMessages && (
        <ChatPanel
          isOpen={showMessages}
          onClose={() => setShowMessages(false)}
        />
      )}
    </>
  );
}
