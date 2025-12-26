import { lazy, Suspense } from "react";
import { useAuth } from "../../features/auth/context/AuthContext";
import LoadingScreen from "./LoadingScreen";

const CrewDashboard = lazy(() => import("../../features/crew/pages/CrewDashboard"));
const StudioDashboard = lazy(() => import("../../features/studio/pages/StudioDashboard"));
const NoAffiliationDashboard = lazy(() => import("../../features/auth/pages/NoAffiliationDashboard"));


const RoleBasedDashboard = () => {
  const { user } = useAuth();
  const userType = user?.userType ?? "";

  const renderDashboard = () => {
    switch (userType) {
      case "crew":
        return <CrewDashboard />;

      case "studio_admin":
        return <StudioDashboard />;

      case "agency_admin":
        return <StudioDashboard />;

      case "":
      default:
        return <NoAffiliationDashboard />;
    }
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      {renderDashboard()}
    </Suspense>
  );
};

export default RoleBasedDashboard;
