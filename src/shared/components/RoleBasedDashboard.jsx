import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../features/auth/context/AuthContext";
import { isDevelopment } from "../../features/auth/config/axiosConfig";

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  const types = user?.userType || []; // array

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

  // Changed: Check crew first, then studio_admin, then agency_admin
  if (types.includes("crew")) {
    return <Navigate to="/crew" replace />;
  }
  if (types.includes("studio_admin")) {
    return <Navigate to="/studio" replace />;
  }
  if (types.includes("agency_admin")) {
    return <Navigate to="/agency" replace />;
  }

  return <Navigate to="/auth/login" replace />;
};

export default RoleBasedDashboard;