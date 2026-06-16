import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSignaturesWorkflowsSettingsThunk,
  addSignerThunk,
  updateSignerThunk,
  deleteSignerThunk,
  addWorkflowThunk,
  updateWorkflowThunk,
  deleteWorkflowThunk,
} from "../../store/thunks/signaturesWorkflowsSettings.thunks";

const DEFAULTS = {
  signers:   [],
  workflows: [],
};

export function useSignaturesWorkflowsSettings(projectId) {
  const dispatch = useDispatch();

  const raw          = useSelector((s) => s.projectSettings.signaturesWorkflowsSettings);
  const isFetching   = useSelector((s) => s.projectSettings.isFetching   ?? false);
  const isUpdating   = useSelector((s) => s.projectSettings.isUpdating   ?? false);
  const isSubmitting = useSelector((s) => s.projectSettings.isSubmitting ?? false);
  const error        = useSelector((s) => s.projectSettings.error        ?? null);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchSignaturesWorkflowsSettingsThunk(projectId));
  }, [projectId, dispatch]);

  const settings = {
    signers:   raw?.signers   ?? DEFAULTS.signers,
    workflows: raw?.workflows ?? DEFAULTS.workflows,
  };

  const addSigner      = useCallback((data)               => dispatch(addSignerThunk({ projectId, data })),                    [dispatch, projectId]);
  const updateSigner   = useCallback((signerId, data)     => dispatch(updateSignerThunk({ projectId, signerId, data })),       [dispatch, projectId]);
  const deleteSigner   = useCallback((signerId)           => dispatch(deleteSignerThunk({ projectId, signerId })),             [dispatch, projectId]);
  const addWorkflow    = useCallback((data)               => dispatch(addWorkflowThunk({ projectId, data })),                  [dispatch, projectId]);
  const updateWorkflow = useCallback((workflowId, data)   => dispatch(updateWorkflowThunk({ projectId, workflowId, data })),   [dispatch, projectId]);
  const deleteWorkflow = useCallback((workflowId)         => dispatch(deleteWorkflowThunk({ projectId, workflowId })),         [dispatch, projectId]);

  return {
    settings,
    isFetching,
    isUpdating,
    isSubmitting,
    error,
    addSigner,
    updateSigner,
    deleteSigner,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
  };
}