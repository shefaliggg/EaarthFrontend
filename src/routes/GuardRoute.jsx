import { Navigate, Outlet } from "react-router-dom";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import { useAuth } from "../features/auth/context/AuthContext";


const GuardRoute = ({ allowedRoles }) => {
    const { user, initialLoading } = useAuth();
    const userType = user?.userType ?? "";

    if (initialLoading) return null; 

    if (!user || !allowedRoles.includes(userType)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <ErrorBoundary>
            <Outlet />
        </ErrorBoundary>
    );
};

export default GuardRoute;