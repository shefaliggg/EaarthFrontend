import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import ErrorBoundary from "../shared/components/wrappers/ErrorBoundary";

const GuardRoute = ({ allowedRoles = "all", children }) => {
  const { user, initialLoading } = useAuth();
  const location = useLocation();
  const userType = user?.userType;

  if (initialLoading) return null;

  if (
    allowedRoles !== "all" &&
    !allowedRoles.includes(userType)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return (
    <ErrorBoundary>
      {children ? children : <Outlet />}
    </ErrorBoundary>
  );
};

export default GuardRoute;
