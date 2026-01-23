import React, { useState } from 'react';
import { PageHeader } from "../../../shared/components/PageHeader";
import ProjectDetails from '../components/ProjectDetails';
import ProjectGeneral from '../components/ProjectGeneral';
import ProjectOnboarding from '../components/ProjectOnboarding';
import ProjectTimesheet from "../components/ProjectTimesheet";
import ProjectCrewOnboardingSteps from '../components/ProjectCrewOnboardingSteps';
import { StepperWrapper } from '../../../shared/components/stepper/StepperWrapper';


function CreateProject() {
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'general', 'onboarding', 'timesheet', or 'crew-onboarding'

  const steps = [
    { id: "details", label: "Project Details" },
    { id: "general", label: "General Settings" },
    { id: "onboarding", label: "Project Onboarding" },
    { id: "timesheet", label: "Timesheet Setup" },
    { id: "crew-onboarding", label: "Crew Onboarding Steps" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Project"

        icon="FolderPlus"
        primaryAction={{
          label: "Initialize Project Creation",
          icon: "Rocket",
          clickAction: () => {
            // Handle save logic here
            console.log("Save project");
          },
        }}
        secondaryActions={[
          {
            label: "Cancel",
            icon: "X",
            variant: "outline",
            clickAction: () => {
              // Handle cancel logic
              window.history.back();
            },
          },
        ]}
      />

      <ProjectDetails />


      {/* <StepperWrapper steps={steps}>
        <ProjectGeneral />
        <ProjectOnboarding />
        <ProjectTimesheet />
        <ProjectCrewOnboardingSteps />
      </StepperWrapper> */}
      {/* Tab Content */}
      {/* {activeTab === 'details' && <ProjectDetails />}
      {activeTab === 'general' && <ProjectGeneral />}
      {activeTab === 'onboarding' && <ProjectOnboarding />}
      {activeTab === "timesheet" && <ProjectTimesheet />}
      {activeTab === "crew-onboarding" && <ProjectCrewOnboardingSteps />} */}
    </div>
  );
}

export default CreateProject;
