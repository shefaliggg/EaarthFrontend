import { Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import LoadingScreen from "@/shared/components/LoadingScreen";
import { toast } from "sonner";

export default function RootLayout() {
  const { initialLoading, user } = useAuth();

  
    if (!user && !initialLoading) {
        toast.error("User not authenticated");
        return <Login />;
    }

  if (initialLoading) return <LoadingScreen />;

  return <Outlet />;
}
