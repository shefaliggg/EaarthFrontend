import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Settings } from "lucide-react";
import { useMemo } from "react";

const ProjectCalendarLayout = () => {
  const { projectName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const section = (() => {
    if (location.pathname.includes("/settings")) return "settings";
    if (location.pathname.includes("/shooting")) return "shooting";
    return "calendar";
  })();

  const headerConfig = useMemo(() => {
    if (section === "settings") {
      return {
        icon: "Settings",
        title: "Calendar Settings",
        subtitle: "Manage calendar preferences",
      };
    }

    if (section === "shooting") {
      return {
        icon: "Calendar",
        title: "Shooting Calendar",
      };
    }

    return {
      icon: "Calendar",
      title: "Calendar",
    };
  }, [section]);

  const primaryAction = useMemo(() => {
    if (section === "settings" || section === "shooting") return null;

    return {
      label: "Create Event",
      icon: "Plus",
      size: "lg",
      clickAction: () => console.log("Open Create Event"),
    };
  }, [section]);

  return (
    <div className="space-y-6 container mx-auto">
      <PageHeader
        {...headerConfig}
        primaryAction={primaryAction}
        secondaryActions={
          section === "calendar"
            ? [
                {
                  label: "Shooting Calendar",
                  icon: "Calendar",
                  clickAction: () =>
                    navigate(`/projects/${projectName}/calendar/shooting`),
                },
              ]
            : null
        }
        extraActions={
          section === "calendar" && (
            <Button
              variant="outline"
              size="lg"
              className="gap-0 w-11 group"
              onClick={() =>
                navigate(`/projects/${projectName}/calendar/settings`)
              }
            >
              <Settings
                className="w-4 h-4 text-primary group-hover:text-background"
                strokeWidth={3}
              />
            </Button>
          )
        }
      />

      <Outlet />
    </div>
  );
};

export default ProjectCalendarLayout;
