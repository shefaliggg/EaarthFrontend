import { Navigate } from "react-router-dom";
import AuthRoutes from "../features/auth/routes/AuthRoutes";
import ErrorBoundary from "../shared/components/ErrorBoundary";
import DashboardRoutes from "./DashboardRoutes";
import { lazy } from "react";
import RootLayout from "../layouts/RootLayout";
import VerifyEmail from "../features/auth/pages/VerifyEmail";

const NotFound = lazy(() => import('../shared/pages/NotFound'));

const AppRoutes = [
  {
    element: (
      <ErrorBoundary>
        <RootLayout />
      </ErrorBoundary>
    ),
    children: [
      { path: "/", element: <Navigate to="/auth/login" replace /> },

      // ⭐ PUBLIC ROUTE - Email verification (no auth needed)
      { path: "/invite/verify", element: <VerifyEmail /> },

      // ⭐ PUBLIC AUTH ROUTES (login, otp, passwords, etc.)
      AuthRoutes,

      // ⭐ PRIVATE ROUTES - Dashboard (requires auth)
      DashboardRoutes,

      { path: "*", element: <NotFound /> },
    ],
  },
];

export default AppRoutes;