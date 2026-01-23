import React, { useState } from 'react';
import { PageHeader } from "../../../shared/components/PageHeader";
import ProjectDetails from '../components/ProjectDetails';
import ProjectGeneral from '../components/ProjectGeneral';
import ProjectOnboarding from '../components/ProjectOnboarding';
import ProjectTimesheet from "../components/ProjectTimesheet";
import ProjectCrewOnboardingSteps from '../components/ProjectCrewOnboardingSteps';


function CreateProject() {
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'general', 'onboarding', 'timesheet', or 'crew-onboarding'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Project"
        subtitle="Set up a new project with all necessary details"
        icon="FolderPlus"
        primaryAction={{
          label: "Save Project",
          icon: "Save",
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

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === "details"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Project Details
        </button>

        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === "general"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          General
        </button>

        <button
          onClick={() => setActiveTab("onboarding")}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === "onboarding"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Onboarding
        </button>

        <button
          onClick={() => setActiveTab("timesheet")}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === "timesheet"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Timesheet
        </button>

        {/* ✅ NEW TAB - Crew Onboarding Steps */}
        <button
          onClick={() => setActiveTab("crew-onboarding")}
          className={`px-4 py-2 font-medium text-sm transition-all ${
            activeTab === "crew-onboarding"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Crew Onboarding Steps
        </button>
      </div>


      {/* Tab Content */}
      {activeTab === 'details' && <ProjectDetails />}
      {activeTab === 'general' && <ProjectGeneral />}
      {activeTab === 'onboarding' && <ProjectOnboarding />}
      {activeTab === "timesheet" && <ProjectTimesheet />}
      {activeTab === "crew-onboarding" && <ProjectCrewOnboardingSteps />}
    </div>
  );
}

export default CreateProject;
