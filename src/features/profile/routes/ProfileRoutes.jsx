import { lazy } from "react";
import { Navigate } from "react-router-dom";
// import PersonalCalendar from "../pages/PersonalCalender";

const ProfileLayout = lazy(() => import("../components/ProfileLayout"));
const ProfileDashboard = lazy(() => import("../pages/ProfileDashboard"));

// Placeholder components for other pages
const ProfileDocuments = lazy(() => import("../pages/ProfileDocuments"));
const PersonalCalendar = lazy(() => import("../pages/PersonalCalender"));
const AccountSettings = lazy(() => import("../pages/AccountSettings"));
const NotFound = lazy(() => import("@/shared/pages/NotFound"));

const ProfileRoutes = {
  path: "/profile",
  element: <ProfileLayout />,
  children: [
    { index: true, element: <ProfileDashboard /> },
    { path: "documents", element: <ProfileDocuments /> },
    { path: "calendar", element: <PersonalCalendar /> },
    { path: "settings", element: <AccountSettings /> },
    { path: "*", element: <NotFound /> },
  ],
};

export default ProfileRoutes;