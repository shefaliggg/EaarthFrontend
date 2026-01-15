import { Outlet, useLocation, useParams } from "react-router-dom";
import { PageHeader } from "@/shared/components/PageHeader";
import FilterPillTabs from "@/shared/components/FilterPillTabs";

function ProjectCalendarLayout() {
  const location = useLocation();
  const params = useParams();

  const isShooting = location.pathname.includes("/shooting");
  return (
    <div className="space-y-6 container mx-auto">
      <PageHeader
        icon="Calendar"
        title="Calendar"
        primaryAction={
          !isShooting
            ? {
                label: "Create Event",
                icon: "Plus",
                size: "lg",
                clickAction: () => console.log("Open Create Event"),
              }
            : null
        }
      />

      <FilterPillTabs
        options={[
          {
            label: "Project Calendar",
            route: `/projects/${params.projectName}/calendar`,
          },
          {
            label: "Shooting Calendar",
            route: `/projects/${params.projectName}/calendar/shooting`,
          },
        ]}
        value={location.pathname}
        navigatable
      />
      <Outlet />
    </div>
  );
}

export default ProjectCalendarLayout;
