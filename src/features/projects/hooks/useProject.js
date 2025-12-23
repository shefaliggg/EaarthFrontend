import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  createProjectThunk,
  getAllProjectsThunk,
  getProjectByIdThunk,
  updateProjectThunk,
  deleteProjectThunk,
} from "../store/project.thunks";
import {
  resetProjectState,
  clearCurrentProject,
  clearAllProjects,
  setPageLimit,
  setCurrentPage,
  setSearch,
  setProjectType,
  setCountry,
  setStudioId,
  setSort,
  clearError,
  clearSuccessMessage,
} from "../store/project.slice";

export const useProject = () => {
  const dispatch = useDispatch();
  const projectState = useSelector((state) => state.project);

  // Fetch all projects with current filters
  const fetchProjects = useCallback(() => {
    const filters = {
      search: projectState.search,
      projectType: projectState.projectType,
      country: projectState.country,
      studioId: projectState.studioId, // Added studioId filter
      page: projectState.page,
      limit: projectState.limit,
      sort: projectState.sort,
    };

    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === "" || filters[key] === null || filters[key] === undefined) {
        delete filters[key];
      }
    });

    dispatch(getAllProjectsThunk(filters));
  }, [
    dispatch,
    projectState.search,
    projectState.projectType,
    projectState.country,
    projectState.studioId,
    projectState.page,
    projectState.limit,
    projectState.sort,
  ]);

  // Create a new project
  const createProject = useCallback(
    async (projectData) => {
      const result = await dispatch(createProjectThunk(projectData));
      return result;
    },
    [dispatch]
  );

  // Get project by ID
  const fetchProjectById = useCallback(
    (id) => {
      dispatch(getProjectByIdThunk(id));
    },
    [dispatch]
  );

  // Update project
  const updateProject = useCallback(
    async (id, projectData) => {
      const result = await dispatch(updateProjectThunk({ id, values: projectData }));
      return result;
    },
    [dispatch]
  );

  // Delete project
  const deleteProject = useCallback(
    async (id) => {
      const result = await dispatch(deleteProjectThunk(id));
      return result;
    },
    [dispatch]
  );

  // Reset state
  const resetState = useCallback(() => {
    dispatch(resetProjectState());
  }, [dispatch]);

  // Clear current project
  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentProject());
  }, [dispatch]);

  // Clear all projects
  const clearAll = useCallback(() => {
    dispatch(clearAllProjects());
  }, [dispatch]);

  // Set filters
  const updateSearch = useCallback(
    (search) => {
      dispatch(setSearch(search));
    },
    [dispatch]
  );

  const updateProjectType = useCallback(
    (type) => {
      dispatch(setProjectType(type));
    },
    [dispatch]
  );

  const updateCountry = useCallback(
    (country) => {
      dispatch(setCountry(country));
    },
    [dispatch]
  );

  const updateStudioId = useCallback(
    (studioId) => {
      dispatch(setStudioId(studioId));
    },
    [dispatch]
  );

  const updateSort = useCallback(
    (sort) => {
      dispatch(setSort(sort));
    },
    [dispatch]
  );

  const updatePage = useCallback(
    (page) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  const updateLimit = useCallback(
    (limit) => {
      dispatch(setPageLimit(limit));
    },
    [dispatch]
  );

  const clearErrorMessage = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearSuccess = useCallback(() => {
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  return {
    // State
    projects: projectState.projects,
    currentProject: projectState.currentProject,
    isCreating: projectState.isCreating,
    isFetching: projectState.isFetching,
    isFetchingDetails: projectState.isFetchingDetails,
    isUpdating: projectState.isUpdating,
    isDeleting: projectState.isDeleting,
    error: projectState.error,
    successMessage: projectState.successMessage,
    search: projectState.search,
    projectType: projectState.projectType,
    country: projectState.country,
    studioId: projectState.studioId, // Added studioId
    sort: projectState.sort,
    total: projectState.total,
    page: projectState.page,
    pages: projectState.pages,
    limit: projectState.limit,

    // Actions
    fetchProjects,
    createProject,
    fetchProjectById,
    updateProject,
    deleteProject,
    resetState,
    clearCurrent,
    clearAll,
    updateSearch,
    updateProjectType,
    updateCountry,
    updateStudioId, // Added updateStudioId
    updateSort,
    updatePage,
    updateLimit,
    clearErrorMessage,
    clearSuccess,
  };
};