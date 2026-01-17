import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/shared/components/PageHeader";

function ProjectCalendarLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectName } = useParams();

  const isShooting = location.pathname.includes("/shooting");

  return (
    <div className="space-y-6 container mx-auto">
      <PageHeader
        icon="Calendar"
        title={isShooting ? "Shooting Calendar" : "Calendar"}
        primaryAction={
          !isShooting
            ? {
                label: "Create Event",
                icon: "Plus",
                size: "lg",
                clickAction: () => console.log("Open Create Event"),
              }
            : {
                label: "Back to Calendar",
                icon: "ArrowLeft",
                variant: "outline",
                size: "lg",
                clickAction: () =>
                  navigate(`/projects/${projectName}/calendar`),
              }
        }
        secondaryActions={
          !isShooting
            ? [
                {
                  label: "Shooting Calendar",
                  icon: "Video",
                  variant: "outline",
                  size: "lg",
                  clickAction: () =>
                    navigate(
                      `/projects/${projectName}/calendar/shooting`
                    ),
                },
              ]
            : []
        }
      />

      <Outlet />
    </div>
  );
}

export default ProjectCalendarLayout;
