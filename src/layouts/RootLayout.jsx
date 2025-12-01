import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import LoadingScreen from "@/shared/components/LoadingScreen";

export default function RootLayout() {
  const { initialLoading, user } = useAuth();
  const { pathname } = useLocation();

  if (initialLoading) return <LoadingScreen />;

  const isAuthRoute = pathname.startsWith("/auth") ;

  if (!user && !isAuthRoute) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
