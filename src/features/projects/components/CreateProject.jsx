import React, { useState } from 'react';
import { PageHeader } from "../../../shared/components/PageHeader";
import ProjectDetails from '../components/ProjectDetails';
import ProjectGeneral from '../components/ProjectGeneral';
import ProjectOnboarding from '../components/ProjectOnboarding';
import ProjectTimesheet from "../components/ProjectTimesheet";
import ProjectCrewOnboardingSteps from '../components/ProjectCrewOnboardingSteps';
import { StepperWrapper } from '../../../shared/components/stepper/StepperWrapper';
import ConfirmActionDialog from '../../../shared/components/modals/ConfirmActionDialog';
import { INITIALIZE_PROJECT_CONFIG } from '../../../shared/config/ConfirmActionsConfig';

function CreateProject() {
  const [activeTab, setActiveTab] = useState('details');
  const [confirmModal, setConfirmModal] = useState({ open: false });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const steps = [
    { id: "details", label: "Project Details" },
    { id: "general", label: "General Settings" },
    { id: "onboarding", label: "Project Onboarding" },
    { id: "timesheet", label: "Timesheet Setup" },
    { id: "crew-onboarding", label: "Crew Onboarding Steps" },
  ];

  const handleInitializeClick = () => {
    setConfirmModal({ open: true });
  };

  const handleConfirmInitialize = async ({ note }) => {
    setIsCreating(true);
    setError(null);
    
    try {
      // Your project initialization logic here
      console.log("Initializing project with note:", note);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal on success
      setConfirmModal({ open: false });
      
      // Handle success (e.g., navigate or show success message)
    } catch (err) {
      setError(err.message || "Failed to initialize project");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Project"
        icon="FolderPlus"
        primaryAction={{
          label: "Initialize Project Creation",
          icon: "Rocket",
          clickAction: handleInitializeClick,
        }}
        secondaryActions={[
          {
            label: "Cancel",
            icon: "X",
            variant: "outline",
            clickAction: () => {
              window.history.back();
            },
          },
        ]}
      />

      <ProjectDetails />

      <ConfirmActionDialog
        open={confirmModal.open}
        onOpenChange={(open) => setConfirmModal({ open })}
        config={INITIALIZE_PROJECT_CONFIG}
        loading={isCreating}
        error={error}
        onConfirm={handleConfirmInitialize}
      />
    </div>
  );
}

export default CreateProject;