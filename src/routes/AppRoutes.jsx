import { Navigate } from "react-router-dom";
import AuthRoutes from "../features/auth/routes/AuthRoutes";
import ErrorBoundary from "../shared/components/ErrorBoundary";
import DashboardRoutes from "./DashboardRoutes";
import { lazy } from "react";
import RootLayout from "../layouts/RootLayout";
import { AuthProvider } from "../features/auth/context/AuthContext";

const NotFound = lazy(() => import('../shared/pages/NotFound'));

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
      { path: "/", element: <Navigate to="/auth/login" replace />, },
      AuthRoutes,
      DashboardRoutes,
      { path: '*', element: <NotFound /> },
    ],
  },
];

export default AppRoutes;




