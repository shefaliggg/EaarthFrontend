// src/features/project/hooks/useProject.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProjectThunk,
  submitProjectForApprovalThunk,
  getAllProjectsThunk,
  getProjectByIdThunk,
  updateProjectThunk,
  deleteProjectThunk,
} from '../store/project.thunks';
import {
  resetProjectState,
  clearCurrentProject,
  setCurrentPage,
  setSearch,
  setProjectType,
  setStudioId,
  setApprovalStatus,
  setSort,
  clearError,
  clearSuccessMessage,
} from '../store/project.slice';

export const useProject = () => {
  const dispatch = useDispatch();
  const {
    projects,
    currentProject,
    isCreating,
    isSubmitting,
    isFetching,
    isFetchingDetails,
    isUpdating,
    isDeleting,
    error,
    successMessage,
    search,
    projectType,
    studioId,
    approvalStatus,
    sort,
    page,
    pages,
    total,
    limit,
  } = useSelector((state) => state.project);

  // Fetch projects with filters
  const fetchProjects = useCallback((filters = {}) => {
    dispatch(getAllProjectsThunk(filters));
  }, [dispatch]);

  // Create project (as draft)
  const createProject = async (values) => {
    const result = await dispatch(createProjectThunk(values));
    return result;
  };

  // Submit project for approval
  const submitForApproval = async (id) => {
    const result = await dispatch(submitProjectForApprovalThunk(id));
    if (!result.error) {
      // Refresh the list after successful submission
      const filters = {
        search: search || undefined,
        projectType: projectType || undefined,
        studioId: studioId || undefined,
        approvalStatus: approvalStatus || undefined,
        sort,
        page,
        limit,
      };
      fetchProjects(filters);
    }
    return result;
  };

  // Get project by ID
  const fetchProjectById = async (id) => {
    const result = await dispatch(getProjectByIdThunk(id));
    return result;
  };

  // Update project (only for approved projects)
  const updateProject = async (id, values) => {
    const result = await dispatch(updateProjectThunk({ id, values }));
    if (!result.error) {
      // Refresh the list after successful update
      const filters = {
        search: search || undefined,
        projectType: projectType || undefined,
        studioId: studioId || undefined,
        approvalStatus: approvalStatus || undefined,
        sort,
        page,
        limit,
      };
      fetchProjects(filters);
    }
    return result;
  };

  // Delete project
  const deleteProject = async (id) => {
    const result = await dispatch(deleteProjectThunk(id));
    if (!result.error) {
      // Refresh the list after successful deletion
      const filters = {
        search: search || undefined,
        projectType: projectType || undefined,
        studioId: studioId || undefined,
        approvalStatus: approvalStatus || undefined,
        sort,
        page,
        limit,
      };
      fetchProjects(filters);
    }
    return result;
  };

  // Filter updates
  const updateSearch = (value) => {
    dispatch(setSearch(value));
  };

  const updateProjectType = (value) => {
    dispatch(setProjectType(value));
  };

  const updateStudioId = (value) => {
    dispatch(setStudioId(value));
  };

  const updateApprovalStatus = (value) => {
    dispatch(setApprovalStatus(value));
  };

  const updateSort = (value) => {
    dispatch(setSort(value));
  };

  const updatePage = (value) => {
    dispatch(setCurrentPage(value));
  };

  // State management
  const resetState = () => {
    dispatch(resetProjectState());
  };

  const clearCurrentProjectData = () => {
    dispatch(clearCurrentProject());
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  const clearSuccessMsg = () => {
    dispatch(clearSuccessMessage());
  };

  return {
    // State
    projects,
    currentProject,
    isCreating,
    isSubmitting,
    isFetching,
    isFetchingDetails,
    isUpdating,
    isDeleting,
    error,
    successMessage,
    search,
    projectType,
    studioId,
    approvalStatus,
    sort,
    page,
    pages,
    total,
    limit,

    // Actions
    createProject,
    submitForApproval,
    fetchProjects,
    fetchProjectById,
    updateProject,
    deleteProject,

    // Filters
    updateSearch,
    updateProjectType,
    updateStudioId,
    updateApprovalStatus,
    updateSort,
    updatePage,

    // State management
    resetState,
    clearCurrentProjectData,
    clearErrorMessage,
    clearSuccessMessage: clearSuccessMsg,
  };
};