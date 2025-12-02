import { lazy, useEffect } from "react";
import { toast } from "sonner";
import Login from "../../features/auth/pages/Login";
import { useAuth } from "../../features/auth/context/AuthContext";
import { isDevelopment } from "../../features/auth/config/axiosConfig";

const StudioDashboard = lazy(() => import("@/features/studio/pages/StudioDashboard"));

const RoleBasedDashboard = () => {
    const { user } = useAuth();
    const types = user?.userType || []; // ensure array

    const validRoles = ["studio_admin", "agency-admin", "crew"];

    useEffect(() => {
        if (types.length === 0) return;

        const isValid = validRoles.some(role => types.includes(role));

        if (!isValid) {
            const msg = "Unknown user role.";
            const desc = "The application has detected an unknown user role.";

            isDevelopment
                ? toast.warning("Dev Mode:: " + msg, { description: desc })
                : toast.error(msg, { description: desc });
        }
    }, [types]);

    if (types.includes("studio_admin")) return <StudioDashboard />;

    return <Login />;
};

export default RoleBasedDashboard;
