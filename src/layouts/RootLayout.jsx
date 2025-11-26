import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import LoadingScreen from "@/shared/components/LoadingScreen";
import { toast } from "sonner";
import { useEffect } from "react";
import { isDevelopment } from "../features/auth/config/axiosConfig";

export default function RootLayout() {
  const { initialLoading, user } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!user && !initialLoading && !pathname.startsWith("/auth")) {
      if (isDevelopment) {
        toast.warning("Dev Mode:: User not authenticated.", {
          description:
            "Please ensure you are logged in to access all features and avoid null errors.",
        });
      } else {
        toast.error("User not authenticated", {
          description: "Redirecting to login page...",
        });
        return <Navigate to="/auth/login" />;
      }
    }
  }, [initialLoading, user, pathname]);

  if (initialLoading) return <LoadingScreen />;

  return <Outlet />;
}
