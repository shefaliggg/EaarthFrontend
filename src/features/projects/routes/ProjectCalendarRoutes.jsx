import { lazy } from "react";
import ProjectCalendarLayout from "../projectCalendar/layouts/ProjectCalendarLayout";

const ProjectCalendar = lazy(() => import("../projectCalendar/pages/ProjectCalendar"));
const ShootingCalendar = lazy(() => import("../projectCalendar/pages/ShootingCalendar"));
const CalendarSettings = lazy(() => import("../projectCalendar/pages/CalendarSettings"));

const ProjectCalendarRoutes = {
  path: "calendar",
  element: <ProjectCalendarLayout />,
  children: [
    { index: true, element: <ProjectCalendar /> },
    { path: "shooting", element: <ShootingCalendar /> },
    { path: "settings", element: <CalendarSettings /> },
  ],
};

export default ProjectCalendarRoutes;
