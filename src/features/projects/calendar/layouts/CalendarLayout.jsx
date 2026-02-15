import { PageHeader } from "@/shared/components/PageHeader";
import { Outlet, useLocation} from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Settings } from "lucide-react";
// import getApiUrl from "../../../../shared/config/enviroment";

function CalendarLayout() {
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
    if (section === "tmo") return null;
    if (section !== "calendar") return null;

    return {
      label: "Create Event",
      icon: "Plus",
      size: "lg",
      clickAction: () => console.log("Open Create Event"),
    };
  })();

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          {...headerConfig}
          primaryAction={primaryAction} 
        />
        <Outlet />
      </div>
    </>
  );
}

export default CalendarLayout;