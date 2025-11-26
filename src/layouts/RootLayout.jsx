import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import LoadingScreen from "@/shared/components/LoadingScreen";
import { toast } from "sonner";
import LoginPage from "../features/auth/pages/Login";
import { useEffect } from "react";

export default function RootLayout() {
  const { initialLoading, user } = useAuth();
  const {pathname} = useLocation();
  useEffect(() => {
      if (!user && !initialLoading && !pathname.startsWith("/auth")) {
        toast.error("User not authenticated");
        return <LoginPage />;
    }
  }, [initialLoading, user, pathname]);
  if (initialLoading) return <LoadingScreen />;

  return <Outlet />;
}
