import { Button } from "@/shared/components/ui/button";
import * as FramerMotion from "framer-motion";
import { PageHeader } from "@/shared/components/PageHeader";
import AnimatedCircularProgress from "@/features/projects/settings/components/shared/AnimatedCircularProgress";
import ProgressNavigator from "../components/ProgressNavigator";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import SettingsHeader from "@/features/projects/settings/components/SettingsHeader";
import NavigationFooter from "@/features/projects/settings/components/NavigationFooter";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchProjectSettingsThunk } from "../store/projectSettings.thunks";

// ─── Slug helper — must mirror DashboardLayout ────────────────────────────────
const toSlug = (name = "") => name.toLowerCase().replace(/\s+/g, "-");
const isObjectId = (str) => /^[a-f\d]{24}$/i.test(String(str ?? ""));

export default function SettingsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projectName } = useParams();
  // ── Resolve real project _id from Redux ───────────────────────────────────
  const currentProject = useSelector((s) => s.project?.currentProject ?? null);
  const allProjects = useSelector((s) => s.project?.projects ?? []);

  const resolvedProjectId = useMemo(() => {
    // 1. currentProject already loaded in Redux
    if (isObjectId(currentProject?._id)) return String(currentProject._id);

    // 2. Match by :projectName slug against full projects list
    if (projectName) {
      const slug = projectName.toLowerCase();
      const match = allProjects.find(
        (p) => toSlug(p.productionName ?? "") === slug,
      );
      if (isObjectId(match?._id)) return String(match._id);
    }
    return null;
  }, [currentProject, allProjects, projectName]);

  const projectId = resolvedProjectId;
  const { projectSettings } = useSelector((state) => state.projectSettings);
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectSettingsThunk(projectId));
    }
  }, [dispatch, projectId]);

  const tabs = [
    {
      path: "details",
      label: "Details",
      progress: projectSettings?.sections?.details?.completionPercent ?? 0,
      locked: projectSettings?.sections?.details?.locked ?? false,
    },
    { path: "contacts", label: "Contacts", progress: 67 },
    { path: "dates", label: "Dates", progress: 15 },
    { path: "project", label: "Project", progress: 88 },
    { path: "standard-crew", label: "Standard Crew", progress: 33 },
    { path: "construction", label: "Construction", progress: 76 },
    { path: "places", label: "Places", progress: 54 },
    { path: "departments", label: "Departments", progress: 29 },
    {
      path: "signatures-workflows",
      label: "Signatures & Workflow",
      progress: 91,
    },
    { path: "contracts-forms", label: "Contracts & Forms", progress: 63 },
    { path: "admin", label: "Admin", progress: 47 },
    { path: "custom", label: "Custom", progress: 82 },
    { path: "notifications", label: "Notifications", progress: 25 },
    { path: "timecard", label: "Timecard", progress: 70 },
    { path: "subscriptions", label: "Subscriptions", progress: 38 },
    { path: "design-style", label: "Design & Style", progress: 96 },
    { path: "layout", label: "Layout", progress: 11 },
    { path: "app-settings", label: "App Settings", progress: 58 },
    { path: "chat", label: "Chat", progress: 73 },
    { path: "calendar", label: "Calendar", progress: 19 },
    { path: "ai-knowledge-base", label: "AI Knowledge Base", progress: 85 },
  ];

  const segments = new Set(location.pathname.split("/"));
  const matchedTabIndex = tabs.findIndex((tab) => segments.has(tab.path));
  const activeIndex = matchedTabIndex === -1 ? 0 : matchedTabIndex;
  const currentTab = tabs[activeIndex];

  const goPrev = () => {
    if (activeIndex > 0) {
      navigate(tabs[activeIndex - 1].path);
    }
  };

  const goNext = () => {
    if (activeIndex < tabs.length - 1) {
      navigate(tabs[activeIndex + 1].path);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Project Settings"
        subtitle={
          <span className="flex items-center gap-2 mt-1 text-xs font-semibold">
            <span>AVATAR 1</span>
            <span>•</span>
            <span>0 / 21</span>
            <span>locked</span>
          </span>
        }
        icon="Settings"
        extraActions={
          <AnimatedCircularProgress
            progressPercentage={projectSettings?.settingsCompletionPercent ?? 0}
          />
        }
      />
      <ProgressNavigator
        tabs={tabs}
        activeIndex={activeIndex}
        currentTab={currentTab}
        goPrev={goPrev}
        goNext={goNext}
      />
      <SettingsHeader currentTab={currentTab} />
      <Outlet />
      <NavigationFooter
        activeIndex={activeIndex}
        goPrev={goPrev}
        goNext={goNext}
        tabs={tabs}
        currentTab={currentTab}
      />
    </div>
  );
}
