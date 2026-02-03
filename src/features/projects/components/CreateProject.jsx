import React, { useState } from 'react';
import { PageHeader } from "../../../shared/components/PageHeader";
import ProjectDetails from '../pages/ProjectSettings/ProjectDetails';
import ConfirmActionDialog from '../../../shared/components/modals/ConfirmActionDialog';
import { INITIALIZE_PROJECT_CONFIG } from '../../../shared/config/ConfirmActionsConfig';

function CreateProject() {
  const [confirmModal, setConfirmModal] = useState({ open: false });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState(null);

  const handleProjectComplete = (data) => {
    setProjectData(data);
    setConfirmModal({ open: true });
  };

  const handleConfirmInitialize = async ({ note }) => {
    setIsCreating(true);
    setError(null);
    
    try {
      console.log("Initializing project with data:", projectData);
      console.log("Note:", note);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Close modal on success
      setConfirmModal({ open: false });
      
      // Show success message or navigate
      alert('Project initialized successfully!');
      
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

      <ProjectDetails onComplete={handleProjectComplete} />

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