import { PageHeader } from "../../../shared/components/PageHeader";
import { studioActiveProjects } from "../constants/studioActiveProjectsData";
import { studioMilestones } from "../constants/studioMilestonesData";
import StudioActiveProjectsCard from "../components/StudioActiveProjectsCard";
import StudioMilestonesCard from "../components/StudioMilestonesCard";

import Metrics from "../../../shared/components/Metrics";
import { useSelector } from "react-redux";
import { getFullName } from "../../../shared/config/utils";

export default function StudioDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  console.log("user data", currentUser)

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={
            <>
              Welcome back, <span className="text-primary">{getFullName(currentUser)}</span>
            </>
          }
          icon={"Building2"}
        />
        <Metrics />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StudioActiveProjectsCard projects={studioActiveProjects} />
          </div>
          <div className="lg:col-span-1">
            <StudioMilestonesCard milestones={studioMilestones} />
          </div>
        </div>
      </div>
    </>
  );
}
