// import { useAuth } from "@/shared/context/AuthContext";
import { lazy } from "react";
import { toast } from "sonner";
import Login from "../../features/auth/pages/Login";

const StudioDashboard = lazy(() => import("@/features/studio/pages/StudioDashboard"));

const RoleBasedDashboard = () => {
    // const { user } = useAuth();
    // Temporary user object for demonstration purposes
    const user = { userType: "studio-admin" };

    if (!user) {
        toast.error("User not authenticated");
        return <Login />;
    }

    const type = user?.userType;

    if (type === "studio-admin" || type === "studio-user")
        return <StudioDashboard />;

    // if (type === "agency-admin" || type === "project-user")
    //     return <ProjectDashboard />;

    toast.error("Unknown user role");
    return <Login />; 
};

export default RoleBasedDashboard;
