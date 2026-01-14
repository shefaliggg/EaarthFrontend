import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from "@/shared/components/PageHeader";
import FilterPillTabs from "@/shared/components/FilterPillTabs";
import { Button } from "@/shared/components/ui/button";
import ViewToggleButton from '../../../../shared/components/buttons/ViewToggleButton';

function TimesheetSettingsLayout() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const [isEditMode, setIsEditMode] = useState("read mode");


  return (
    <div className='space-y-4'>
      <PageHeader
        icon={"CalendarCog"}
        title={"Timesheet Settings"}
        subtitle={"Configure timesheet defaults, allowances, and approval workflows"}
        // primaryAction={{
        //   label: "Edit Settings",
        //   clickAction: () => console.log("Edit clicked"),
        //   icon: "Edit",
        //   size: "lg",
        // }}
        extraActions={
          <ViewToggleButton view={isEditMode} onViewChange={setIsEditMode} listIcon='Pen' listLabel='edit mode' gridIcon='Eye' GridLabel='read mode' showLabel={true} />
        }
      />
      <FilterPillTabs
        options={[
          {
            label: "Timesheet",
            route: `/projects/${params.projectName}/timesheets/${params.week}/settings`,
          },
          {
            label: "Onboarding",
            route: `/projects/${params.projectName}/timesheets/${params.week}/settings/onboarding`,
          },
          {
            label: "Project Details",
            route: `/projects/${params.projectName}/timesheets/${params.week}/settings/project-details`,
          },
        ]}
        value={pathname}
        navigatable
      />
      <Outlet />
    </div>
  )
}

export default TimesheetSettingsLayout