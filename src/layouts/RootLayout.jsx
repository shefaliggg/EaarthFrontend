import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { useAuth } from "@/features/auth/context/AuthContext";
import SuspenseOutlet from "../shared/components/SuspenseOutlet";
import LoadingScreen from "@/shared/components/LoadingScreen";

export default function RootLayout() {
  const { initialLoading, isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user.currentUser);

  if (initialLoading) {
    return <LoadingScreen />;
  }

  const isAuthRoute = pathname.startsWith("/auth") || pathname === "/invite/verify";

  if (!isAuthenticated && !isAuthRoute) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isAuthenticated && user && isAuthRoute) {
    return <Navigate to="/home" replace />;
  }

  return <SuspenseOutlet />;
}