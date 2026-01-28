import { lazy, Suspense } from "react";
import { useAuth } from "../../features/auth/context/AuthContext";
import LoadingScreen from "./LoadingScreen";
import { StepperWrapper } from "./stepper/StepperWrapper";

const CrewDashboard = lazy(() => import("../../features/crew/pages/CrewDashboard"));
const ProjectList = lazy(() => import("../../features/projects/pages/ProjectList"));
const NoAffiliationDashboard = lazy(() => import("../../features/auth/pages/NoAffiliationDashboard"));


const RoleBasedDashboard = () => {
  const { user } = useAuth();
  const userType = user?.userType ?? "";

  const renderDashboard = () => {
    switch (userType) {
      case "crew":
        return <CrewDashboard />;

      case "studio_admin":
        return <ProjectList />;

      case "agency_admin":
        return <ProjectList />;

      case "none":
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
