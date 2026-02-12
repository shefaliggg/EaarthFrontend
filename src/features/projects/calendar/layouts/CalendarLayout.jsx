import { PageHeader } from "@/shared/components/PageHeader";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Settings } from "lucide-react";
// import getApiUrl from "../../../../shared/config/enviroment";

function CalendarLayout() {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const section = (() => {
    if (location.pathname.includes("/shooting")) return "shooting";
    if (location.pathname.includes("/settings")) return "settings";
    if (location.pathname.includes("/tmo")) return "tmo"; 
    return "calendar";
  })();

  const headerConfig = (() => {
    if (section === "calendar")
      return {
        icon: "Calendar",
        title: "Calendar",
      };
    if (section === "shooting")
      return {
        icon: "Calendar",
        title: "Shooting Calendar",
      };
    // Add header config for TMO
    if (section === "tmo")
      return {
        icon: "Plane",
        title: "Tmo",
      };
    return {
      icon: "Settings",
      title: "Calendar Settings",
      subtitle: "Manage calendar preferences",
    };
  })();

  const primaryAction = (() => {
    // Hide 'Create Event' button on TMO page if desired, or keep it
    if (section === "tmo") return null;
    if (section !== "calendar") return null;

    return {
      label: "Create Event",
      icon: "Plus",
      size: "lg",
      clickAction: () => console.log("Open Create Event"),
    };
  })();

  const secondaryActions = (() => {
    // If we are on the TMO page, show a "Back to Calendar" button instead
    if (section === "tmo") {
      return [
        {
          label: "Back to Calendar",
          icon: "Calendar",
          clickAction: () => navigate(`/projects/${projectName}/calendar`),
        },
      ];
    }

    if (section !== "calendar") return null;

    return [
      {
        label: "Shooting Calendar",
        icon: "Calendar",
        clickAction: () =>
          navigate(`/projects/${projectName}/calendar/shooting`),
      },
      {
        label: "TMO",
        icon: "Plane",
        // Update this action to navigate
        clickAction: () => navigate(`/projects/${projectName}/calendar/tmo`),
      },
      {
        label: "Export PDF",
        icon: "Download",
        clickAction: () => {
          // const apiBase = getApiUrl();
          // const projectName = window.location.pathname.split("/")[2];

          // const url = `${apiBase}/calendar/export-pdf?view=${view}&date=${currentDate.toISOString()}&projectName=${projectName}`;

          // window.open(url, "_blank");
        },
      },
    ];
  })();

  const extraActions = (() => {
    // You might want to hide settings on TMO page, or keep it.
    // This logic hides it if not on main calendar.
    if (section !== "calendar" && section !== "tmo") return null;

    return (
      <Button
        variant="outline"
        size="lg"
        className="gap-0 w-11 group"
        onClick={() => navigate(`/projects/${projectName}/calendar/settings`)}
      >
        <Settings
          className="w-4 h-4 text-primary group-hover:text-background"
          strokeWidth={3}
        />
      </Button>
    );
  })();

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          {...headerConfig}
          primaryAction={primaryAction}
          secondaryActions={secondaryActions}
          extraActions={extraActions}
        />
        <Outlet />
      </div>
    </>
  );
}

export default CalendarLayout;
