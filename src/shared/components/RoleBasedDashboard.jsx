import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../features/auth/context/AuthContext";
import { isDevelopment } from "../../features/auth/config/axiosConfig";
import CrewDashboard from "../../features/crew/pages/CrewDashboard";
import StudioDashboard from "../../features/studio/pages/StudioDashboard";

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  const types = user?.userType || [];

  const validRoles = ["studio_admin", "agency_admin", "crew"];

  useEffect(() => {
    if (!types.length) return;

    const isValid = validRoles.some(role => types.includes(role));

    if (!isValid) {
      const msg = "Unknown user role.";
      const desc = "The application has detected an unknown user role.";

      isDevelopment
        ? toast.warning("Dev Mode:: " + msg, { description: desc })
        : toast.error(msg, { description: desc });
    }
  }, [types]);

  if (types.includes("crew")) {
    return <CrewDashboard />
  }
  if (types.includes("studio_admin")) {
    return <StudioDashboard />
  } else {
    return <StudioDashboard />
  }
};

export default RoleBasedDashboard;