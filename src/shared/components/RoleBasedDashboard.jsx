import { lazy, useEffect } from "react";
import { toast } from "sonner";
import Login from "../../features/auth/pages/Login";
import { useAuth } from "../../features/auth/context/AuthContext";
import { isDevelopment } from "../../features/auth/config/axiosConfig";

const StudioDashboard = lazy(() => import("@/features/studio/pages/StudioDashboard"));

const RoleBasedDashboard = () => {
    const { user } = useAuth();
    const type = user?.userType?.[0];

    // handle unknown role
    useEffect(() => {
        if (!type) return;

        if (type !== "studio_admin"  || type !== "agency-admin" || type !== "crew") {
            if (isDevelopment) {
                toast.warning("Dev Mode:: Unknown user role.", {
                    description: "The application has detected an unknown user role. Please Fix the issue if Exist",
                });
            } else {
                toast.error("Unknown user role.", {
                    description: "The application has detected an unknown user role.",
                });
            }
        }
    }, [type]);

    if (type === "studio_admin") return <StudioDashboard />;

    return <Login />;
};

export default RoleBasedDashboard;
