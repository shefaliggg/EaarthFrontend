import { Button } from "@/shared/components/ui/button";
import * as FramerMotion from "framer-motion";
import { PageHeader } from "@/shared/components/PageHeader";
import AnimatedCircularProgress from "@/features/projects/settings/components/shared/AnimatedCircularProgress";
import ProgressNavigator from "./ProgressNavigator";
import { Outlet } from "react-router-dom";
import SettingsStatusHeader from "@/features/projects/settings/components/SettingsStatusHeader";


export default function SettingsLayout() {
  const tabs = [
    { path: "details", label: "Details", progress: 42 },
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
        extraActions={<AnimatedCircularProgress progressPercentage={100} />}
      />
      <ProgressNavigator tabs={tabs} />
      <SettingsStatusHeader tabs={tabs} />
      <Outlet />
    </div>
  );
}
