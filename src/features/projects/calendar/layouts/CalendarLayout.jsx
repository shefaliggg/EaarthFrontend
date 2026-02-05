import { PageHeader } from "@/shared/components/PageHeader";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Settings } from "lucide-react";

function CalendarLayout() {
  const { projectName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const section = (() => {
    if (location.pathname.includes("/shooting")) return "shooting";
    if (location.pathname.includes("/settings")) return "settings";
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
    return {
      icon: "Settings",
      title: "Calendar Settings",
      subtitle: "Manage calendar preferences",
    };
  })();

  const primaryAction = (() => {
    if (section !== "calendar") return null;

    return {
      label: "Create Event",
      icon: "Plus",
      size: "lg",
      clickAction: () => console.log("Open Create Event"),
    };
  })();

  const secondaryActions = (() => {
    if (section !== "calendar") return null;

    return [
      {
        label: "Shooting Calendar",
        icon: "Calendar",
        clickAction: () =>
          navigate(`/projects/${projectName}/calendar/shooting`),
      },
    ];
  })();

  const extraActions = (() => {
    if (section !== "calendar") return null;

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
