// import { useAuth } from "@/shared/context/AuthContext";
import { lazy } from "react";
import { toast } from "sonner";
import Login from "../../features/auth/pages/Login";
import { useAuth } from "../../features/auth/context/AuthContext";

const StudioDashboard = lazy(() => import("@/features/studio/pages/StudioDashboard"));

const RoleBasedDashboard = () => {
    const { user } = useAuth();

    const type = user?.userType.at(0);

    if (type === "studio_admin")
        return <StudioDashboard />;

    // if (type === "agency-admin" || type === "project-user")
    //     return <ProjectDashboard />;

    toast.error("Unknown user role");
    return <Login />; 
};

export default RoleBasedDashboard;












