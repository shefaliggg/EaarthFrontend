import { Navigate } from "react-router-dom";
import AuthRoutes from "../features/auth/routes/AuthRoutes";
import ErrorBoundary from "../shared/components/ErrorBoundary";
import DashboardRoutes from "./DashboardRoutes";
import { lazy } from "react";
import RootLayout from "@/layouts/RootLayout";
import { AuthProvider } from "@/features/auth/context/AuthContext";

const NotFound = lazy(() => import('@/shared/pages/NotFound'));
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmail'));

const AppRoutes = [
  {
    element: (
      <AuthProvider>
        <ErrorBoundary>
          <RootLayout />
        </ErrorBoundary>
      </AuthProvider>
    ),
    children: [
      { path: "/invite/verify", element: <VerifyEmailPage /> },

      AuthRoutes,
      DashboardRoutes,

      { path: '*', element: <NotFound /> },
    ],
  },
];

export default AppRoutes;












