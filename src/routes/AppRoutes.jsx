import { Navigate } from "react-router-dom";
import AuthRoutes from "../features/auth/routes/AuthRoutes";
import ErrorBoundary from "../shared/components/ErrorBoundary";
import DashboardRoutes from "./DashboardRoutes";
import { lazy } from "react";

const NotFound = lazy(() => import('../shared/pages/NotFound'));

const AppRoutes = [
  { path: "/", element: <Navigate to="/auth/login" replace />, },
  AuthRoutes,
  DashboardRoutes,
  { path: '*', element: <ErrorBoundary><NotFound /></ErrorBoundary> },
];

export default AppRoutes;




