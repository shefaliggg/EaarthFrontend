import { lazy } from "react";
import ProjectCalendarLayout from "../projectCalendar/layouts/ProjectCalendarLayout";
import GeneralSection from "../projectCalendar/components/calendar-settings/sections/GeneralSection";
import TimezoneSection from "../projectCalendar/components/calendar-settings/sections/TimezoneSection";
import NotificationSection from "../projectCalendar/components/calendar-settings/sections/NotificationSection";
import EventSection from "../projectCalendar/components/calendar-settings/sections/EventSection";
import AISection from "../projectCalendar/components/calendar-settings/sections/AISection";
import ViewSection from "../projectCalendar/components/calendar-settings/sections/ViewSection";


const ProjectCalendar = lazy(() => import("../projectCalendar/pages/ProjectCalendar"));
const ShootingCalendar = lazy(() => import("../projectCalendar/pages/ShootingCalendar"));
const CalendarSettingsTabsLayout = lazy(() => import("../projectCalendar/layouts/CalendarSettingsTabsLayout"));

const ProjectCalendarRoutes = {
  path: "calendar",
  element: <ProjectCalendarLayout />,
  children: [
    { index: true, element: <ProjectCalendar /> },
    { path: "shooting", element: <ShootingCalendar /> },
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
