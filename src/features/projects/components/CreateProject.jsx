// src/features/projects/pages/CreateProject.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { PageHeader } from "../../../shared/components/PageHeader";
import ProjectDetails from "../pages/ProjectDetails";
import ConfirmActionDialog from "../../../shared/components/modals/ConfirmActionDialog";
import { INITIALIZE_PROJECT_CONFIG } from "../../../shared/config/ConfirmActionsConfig";

import { createProjectThunk } from "../store/project.thunks";
import { clearError, clearSuccessMessage } from "../store/project.slice";

function CreateProject() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ── Redux state ────────────────────────────────────────────────────────────
  const isCreating     = useSelector((state) => state.project.isCreating);
  const error          = useSelector((state) => state.project.error);
  const successMessage = useSelector((state) => state.project.successMessage);

  // ── Local state ────────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen]           = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [createdId, setCreatedId]           = useState(null);

  // ── Navigate once creation succeeds ───────────────────────────────────────
  useEffect(() => {
    if (successMessage && createdId) {
      setModalOpen(false);
      dispatch(clearSuccessMessage());
      navigate(`/productions/${createdId}`);
    }
  }, [successMessage, createdId, navigate, dispatch]);

  // ── Clean up error when modal closes ──────────────────────────────────────
  const handleModalOpenChange = (open) => {
    setModalOpen(open);
    if (!open) dispatch(clearError());
  };

  // ── Called by ProjectDetails "Finish" ─────────────────────────────────────
  const handleProjectComplete = (payload) => {
    setPendingPayload(payload);
    setModalOpen(true);
  };

  // ── Modal confirm ──────────────────────────────────────────────────────────
  const handleConfirmInitialize = async () => {
    if (!pendingPayload) return;

    // studioId must come from your auth state or be collected in ProjectDetails.
    // Example: const studioId = useSelector(s => s.auth.user.activeAffiliation.studioId)
    const body = {
      productionName:  pendingPayload.productionName,
      productionType:  pendingPayload.productionType,
      studioId:        pendingPayload.studioId,       // ← wire your studioId here
      country:         pendingPayload.country,
      prepStartDate:   pendingPayload.prepStartDate,
      prepEndDate:     pendingPayload.prepEndDate,
      shootStartDate:  pendingPayload.shootStartDate,
      shootEndDate:    pendingPayload.shootEndDate,
      wrapStartDate:   pendingPayload.wrapStartDate,
      wrapEndDate:     pendingPayload.wrapEndDate,
      applications:    pendingPayload.applications    ?? [],
      packageTier:     pendingPayload.packageTier     ?? "basic",
      projectContacts: pendingPayload.projectContacts ?? [],
    };

    const result = await dispatch(createProjectThunk(body));

    // RTK gives us the new production in result.payload on success
    if (createProjectThunk.fulfilled.match(result)) {
      setCreatedId(result.payload._id);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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
            clickAction: () => navigate(-1),
          },
        ]}
      />

      <ProjectDetails onComplete={handleProjectComplete} />

      <ConfirmActionDialog
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        config={INITIALIZE_PROJECT_CONFIG}
        loading={isCreating}
        error={error}
        onConfirm={handleConfirmInitialize}
      />
    </div>
  );
}

export default CreateProject;