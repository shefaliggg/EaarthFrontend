import { Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import LoadingScreen from "@/shared/components/LoadingScreen";

export default function RootLayout() {
  const { initialLoading } = useAuth();

  if (initialLoading) return <LoadingScreen />;

  return <Outlet />;
}
