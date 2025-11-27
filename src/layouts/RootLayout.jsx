import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import LoadingScreen from "@/shared/components/LoadingScreen";
import { toast } from "sonner";

export default function RootLayout() {
  const { initialLoading, user } = useAuth();
  const { pathname } = useLocation();

  if (initialLoading) return <LoadingScreen />;

  const isAuthRoute = pathname.startsWith("/auth");

  if (!user && !isAuthRoute) {
    toast.error("User not authenticated");
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
