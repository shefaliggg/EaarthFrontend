import { createSlice } from "@reduxjs/toolkit";
import {
  createProjectThunk,
  getAllProjectsThunk,
  getProjectByIdThunk,
  updateProjectThunk,
  deleteProjectThunk,
} from "./project.thunks";

const initialState = {
  projects: [],
  currentProject: null,
  isCreating: false,
  isFetching: false,
  isFetchingDetails: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  successMessage: null,
  search: "",
  projectType: "",
  country: "",
  studioId: "", // Added studioId filter
  sort: "newest",
  total: 0,
  page: 1,
  pages: 1,
  limit: 10,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    resetProjectState(state) {
      state.isCreating = false;
      state.isUpdating = false;
      state.isDeleting = false;
      state.error = null;
      state.successMessage = null;
    },

    clearCurrentProject(state) {
      state.currentProject = null;
    },

    clearAllProjects(state) {
      state.projects = [];
      state.total = 0;
      state.pages = 1;
    },

    setPageLimit(state, action) {
      state.limit = action.payload;
    },

    setCurrentPage(state, action) {
      state.page = action.payload;
    },

    setSearch(state, action) {
      state.search = action.payload;
    },

    setProjectType(state, action) {
      state.projectType = action.payload;
    },

    setCountry(state, action) {
      state.country = action.payload;
    },

    setStudioId(state, action) {
      state.studioId = action.payload;
    },

    setSort(state, action) {
      state.sort = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },

    clearError(state) {
      state.error = null;
    },

    clearSuccessMessage(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create project
      .addCase(createProjectThunk.pending, (state) => {
        state.isCreating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createProjectThunk.fulfilled, (state, action) => {
        state.isCreating = false;
        state.projects.unshift(action.payload);
        state.total += 1;
        state.successMessage = "Project created successfully";
      })
      .addCase(createProjectThunk.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })

      // Get all projects
      .addCase(getAllProjectsThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getAllProjectsThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.projects = action.payload.projects || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
        state.limit = action.payload.limit || 10;
      })
      .addCase(getAllProjectsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })

      // Get project by ID
      .addCase(getProjectByIdThunk.pending, (state) => {
        state.isFetchingDetails = true;
        state.error = null;
      })
      .addCase(getProjectByIdThunk.fulfilled, (state, action) => {
        state.isFetchingDetails = false;
        state.currentProject = action.payload || null;
      })
      .addCase(getProjectByIdThunk.rejected, (state, action) => {
        state.isFetchingDetails = false;
        state.error = action.payload;
      })

      // Update project
      .addCase(updateProjectThunk.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProjectThunk.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentProject = action.payload;
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.successMessage = "Project updated successfully";
      })
      .addCase(updateProjectThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })

      // Delete project
      .addCase(deleteProjectThunk.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteProjectThunk.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.projects = state.projects.filter(p => p._id !== action.payload);
        state.total -= 1;
        state.successMessage = "Project deleted successfully";
      })
      .addCase(deleteProjectThunk.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      });
  },
});

export const {
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
  setError,
  clearError,
  clearSuccessMessage,
} = projectSlice.actions;

export default projectSlice.reducer;