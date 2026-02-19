import { lazy } from "react";
import GeneralSection from "../calendar/components/calendar-settings/sections/GeneralSection";
import TimezoneSection from "../calendar/components/calendar-settings/sections/TimezoneSection";
import NotificationSection from "../calendar/components/calendar-settings/sections/NotificationSection";
import EventSection from "../calendar/components/calendar-settings/sections/EventSection";
import AISection from "../calendar/components/calendar-settings/sections/AISection";
import ViewSection from "../calendar/components/calendar-settings/sections/ViewSection";
import CalendarLayout from "@/features/projects/calendar/layouts/CalendarLayout";
import CalendarPreviewPage from "../calendar/components/preview/CalendarPreviewPage";

const ProjectCalendar = lazy(() => import("../calendar/pages/ProjectCalendar"));
const ShootingCalendar = lazy(() => import("../calendar/pages/ShootingCalendar"));
const TravelManagement = lazy(() => import("../calendar/pages/TravelManagement"));
const CalendarSettingsTabsLayout = lazy(() => import("../calendar/layouts/CalendarSettingsTabsLayout"));

const ProjectCalendarRoutes = {
  path: "calendar",
  element: <CalendarLayout />,
  children: [
    { index: true, element: <ProjectCalendar /> },
    { path: "shooting", element: <ShootingCalendar /> },
    { path: "tmo", element: <TravelManagement /> },
    { path: "preview", element: <CalendarPreviewPage /> }, 
    {
      path: "settings",
      element: <CalendarSettingsTabsLayout />,
      children: [
        { index: true, element: <GeneralSection /> },
        { path: "timezone", element: <TimezoneSection /> },
        { path: "view", element: <ViewSection /> },
        { path: "notifications", element: <NotificationSection /> },
        { path: "events", element: <EventSection /> },
        { path: "ai", element: <AISection /> },
      ],
    },
  ],
};

export default ProjectCalendarRoutes;
