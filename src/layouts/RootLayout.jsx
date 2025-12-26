import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import LoadingScreen from "@/shared/components/LoadingScreen";

export default function RootLayout() {
  const { initialLoading, user, isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  if (initialLoading) return <LoadingScreen />;

  const isAuthRoute = pathname.startsWith("/auth") || pathname === "/invite/verify";

  if (!isAuthenticated && !isAuthRoute) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isAuthenticated && user && isAuthRoute) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
