import { useEffect, useState, useMemo } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as FramerMotion from "framer-motion";

import { PageHeader }             from "@/shared/components/PageHeader";
import AnimatedCircularProgress   from "@/features/projects/settings/components/shared/AnimatedCircularProgress";
import ProgressNavigator          from "../components/ProgressNavigator";
import SettingsHeader             from "@/features/projects/settings/components/SettingsHeader";
import NavigationFooter           from "@/features/projects/settings/components/NavigationFooter";

// ── Helpers ───────────────────────────────────────────────────────────────────

const toSlug     = (name = "") => name.toLowerCase().replace(/\s+/g, "-");
const isObjectId = (str)       => /^[a-f\d]{24}$/i.test(String(str ?? ""));

// ── Tabs config ───────────────────────────────────────────────────────────────

const TABS = [
  { path: "details",              label: "Details",               progress: 42 },
  { path: "contacts",             label: "Contacts",              progress: 67 },
  { path: "dates",                label: "Dates",                 progress: 15 },
  { path: "project",              label: "Project",               progress: 88 },
  { path: "standard-crew",        label: "Standard Crew",         progress: 33 },
  { path: "construction",         label: "Construction",          progress: 76 },
  { path: "places",               label: "Places",                progress: 54 },
  { path: "departments",          label: "Departments",           progress: 29 },
  { path: "signatures-workflows", label: "Signatures & Workflow", progress: 91 },
  { path: "contracts-forms",      label: "Contracts & Forms",     progress: 63 },
  { path: "admin",                label: "Admin",                 progress: 47 },
  { path: "custom",               label: "Custom",                progress: 82 },
  { path: "notifications",        label: "Notifications",         progress: 25 },
  { path: "timecard",             label: "Timecard",              progress: 70 },
  { path: "subscriptions",        label: "Subscriptions",         progress: 38 },
  { path: "design-style",         label: "Design & Style",        progress: 96 },
  { path: "layout",               label: "Layout",                progress: 11 },
  { path: "app-settings",         label: "App Settings",          progress: 58 },
  { path: "chat",                 label: "Chat",                  progress: 73 },
  { path: "calendar",             label: "Calendar",              progress: 19 },
  { path: "ai-knowledge-base",    label: "AI Knowledge Base",     progress: 85 },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function SettingsLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // ── URL param: /projects/:projectName/settings/... ────────────────────────
  const { projectName } = useParams();

  // ── Redux ─────────────────────────────────────────────────────────────────
  const allProjects    = useSelector((s) => s.project?.projects    ?? []);
  const currentProject = useSelector((s) => s.project?.currentProject ?? null);

  // ── Resolve the project document ──────────────────────────────────────────
  // Priority:
  //   1. Slug match against allProjects (most reliable when list is loaded)
  //   2. currentProject in Redux (set when user clicked a project row)
  const resolvedProject = useMemo(() => {
    if (projectName) {
      const slug  = projectName.toLowerCase();
      const match = allProjects.find((p) => toSlug(p.productionName ?? "") === slug);
      if (match) return match;
    }
    return currentProject ?? null;
  }, [projectName, allProjects, currentProject]);

  // ── IDs exposed to all child settings pages via Outlet context ────────────
  // studioId: try the populated ref first (.studioId._id), then a flat string
  // ref (.studioId), then a "studio" alias some schemas use.
  const projectId = useMemo(
    () => resolvedProject?._id?.toString() ?? null,
    [resolvedProject]
  );

  const studioId = useMemo(() => {
    if (!resolvedProject) return null;
    const raw = resolvedProject.studioId ?? resolvedProject.studio ?? null;
    if (!raw) return null;
    // Populated mongoose object
    if (raw?._id) return raw._id.toString();
    // Plain ObjectId string / ObjectId instance
    return raw.toString();
  }, [resolvedProject]);

  // ── Active tab ────────────────────────────────────────────────────────────
  const segments     = new Set(location.pathname.split("/"));
  const matchedIndex = TABS.findIndex((tab) => segments.has(tab.path));
  const activeIndex  = matchedIndex === -1 ? 0 : matchedIndex;
  const currentTab   = TABS[activeIndex];

  // ── Navigation ────────────────────────────────────────────────────────────
  // Build the base path from the current URL so navigation stays inside the
  // correct project's settings section.
  const settingsBasePath = useMemo(() => {
    // e.g. "/projects/avatar-1/settings"
    const match = location.pathname.match(/^(\/projects\/[^/]+\/settings)/);
    return match ? match[1] : "/settings";
  }, [location.pathname]);

  const goPrev = () => {
    if (activeIndex > 0) navigate(`${settingsBasePath}/${TABS[activeIndex - 1].path}`);
  };

  const goNext = () => {
    if (activeIndex < TABS.length - 1) navigate(`${settingsBasePath}/${TABS[activeIndex + 1].path}`);
  };

  // ── Overall progress (average across all tabs) ────────────────────────────
  const overallProgress = Math.round(
    TABS.reduce((sum, t) => sum + t.progress, 0) / TABS.length
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <PageHeader
        title="Project Settings"
        subtitle={
          <span className="flex items-center gap-2 mt-1 text-xs font-semibold">
            <span>{resolvedProject?.productionName?.toUpperCase() ?? "PROJECT"}</span>
            <span>•</span>
            <span>0 / {TABS.length}</span>
            <span>locked</span>
          </span>
        }
        icon="Settings"
        extraActions={<AnimatedCircularProgress progressPercentage={overallProgress} />}
      />

      <ProgressNavigator
        tabs={TABS}
        activeIndex={activeIndex}
        currentTab={currentTab}
        goPrev={goPrev}
        goNext={goNext}
      />

      <SettingsHeader currentTab={currentTab} />

      {/*
       * Pass projectId + studioId to every child settings page.
       * Child pages read them with:
       *   const { projectId, studioId } = useOutletContext();
       */}
      <Outlet context={{ projectId, studioId }} />

      <NavigationFooter
        activeIndex={activeIndex}
        goPrev={goPrev}
        goNext={goNext}
        tabs={TABS}
      />
    </div>
  );
}