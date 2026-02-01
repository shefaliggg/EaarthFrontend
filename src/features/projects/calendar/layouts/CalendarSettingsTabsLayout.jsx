import React, { useState } from "react";
import FilterPillTabs from "../../../../shared/components/FilterPillTabs";
import { Outlet, useLocation, useParams } from "react-router-dom";

function CalendarSettingsTabsLayout() {
  const params = useParams();
  const location = useLocation();
  const pathname = location.pathname;

  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="space-y-6">
      {/* ACTION BAR */}
      <div className="flex justify-end gap-2">
        {!isEditMode ? (
          <button
            onClick={() => setIsEditMode(true)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsEditMode(false)}
              className="px-4 py-2 rounded-lg border text-sm"
            >
              Cancel
            </button>

            <button
              onClick={() => setIsEditMode(false)}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
            >
              Save
            </button>
          </>
        )}
      </div>

      {/* TABS */}
      <FilterPillTabs
        options={[
          {
            label: "General",
            icon: "Settings",
            route: `/projects/${params.projectName}/calendar/settings`,
          },
          {
            label: "Time Zone",
            icon: "Clock",
            route: `/projects/${params.projectName}/calendar/settings/timezone`,
          },
          {
            label: "View Options",
            icon: "Layout",
            route: `/projects/${params.projectName}/calendar/settings/view`,
          },
          {
            label: "Notification Settings",
            icon: "Bell",
            route: `/projects/${params.projectName}/calendar/settings/notifications`,
          },
          {
            label: "Event Settings",
            icon: "Calendar",
            route: `/projects/${params.projectName}/calendar/settings/events`,
          },
          {
            label: "AI & Inteligence",
            icon: "Brain",
            route: `/projects/${params.projectName}/calendar/settings/ai`,
          },
        ]}
        value={pathname}
        navigatable
        fullWidth
        transparentBg={false}
      />

      {/* PASS isEditMode TO CHILDREN */}
      <Outlet context={{ isEditMode }} />
    </div>
  );
}

export default CalendarSettingsTabsLayout;
