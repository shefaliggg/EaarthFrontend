// src/features/project/store/project.slice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createProjectThunk,
  submitProjectForApprovalThunk,
  getAllProjectsThunk,
  getProjectByIdThunk,
  updateProjectThunk,
  deleteProjectThunk,
  getProjectMembersThunk,
  getProjectContactsThunk,
  upsertProjectContactThunk,
  removeProjectContactThunk,
  addCrewMemberThunk,
} from "./project.thunks";

const initialState = {
  // ── List ──────────────────────────────────────────────────────────────────
  projects:        [],
  currentProject:  null,

  // ── Members ───────────────────────────────────────────────────────────────
  projectMembers:  [],

  // ── Contacts ──────────────────────────────────────────────────────────────
  projectContacts: [],

  // ── Loading flags ─────────────────────────────────────────────────────────
  isCreating:           false,
  isSubmitting:         false,
  isFetching:           false,
  isFetchingDetails:    false,
  isUpdating:           false,
  isDeleting:           false,
  isFetchingMembers:    false,
  isFetchingContacts:   false,
  isUpsertingContact:   false,
  isRemovingContact:    false,
  isAddingCrew:         false,

  // ── Feedback ──────────────────────────────────────────────────────────────
  error:          null,
  successMessage: null,

  // ── Filters / pagination ──────────────────────────────────────────────────
  search:         "",
  projectType:    "",
  country:        "",
  studioId:       "",
  approvalStatus: "",
  sort:           "newest",
  total:          0,
  page:           1,
  pages:          1,
  limit:          10,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    resetProjectState(state) {
      state.isCreating         = false;
      state.isSubmitting       = false;
      state.isUpdating         = false;
      state.isDeleting         = false;
      state.isUpsertingContact = false;
      state.isRemovingContact  = false;
      state.isAddingCrew       = false;
      state.error              = null;
      state.successMessage     = null;
    },
    clearCurrentProject(state) { state.currentProject = null; },
    clearAllProjects(state) {
      state.projects = [];
      state.total    = 0;
      state.pages    = 1;
    },
    setPageLimit(state, action)       { state.limit          = action.payload; },
    setCurrentPage(state, action)     { state.page           = action.payload; },
    setSearch(state, action)          { state.search         = action.payload; },
    setProjectType(state, action)     { state.projectType    = action.payload; },
    setCountry(state, action)         { state.country        = action.payload; },
    setStudioId(state, action)        { state.studioId       = action.payload; },
    setApprovalStatus(state, action)  { state.approvalStatus = action.payload; },
    setSort(state, action)            { state.sort           = action.payload; },
    setError(state, action)           { state.error          = action.payload; },
    clearError(state)                 { state.error          = null; },
    clearSuccessMessage(state)        { state.successMessage = null; },
  },

  extraReducers: (builder) => {
    builder

      // ── CREATE PROJECT ────────────────────────────────────────────────────
      .addCase(createProjectThunk.pending, (state) => {
        state.isCreating     = true;
        state.error          = null;
        state.successMessage = null;
      })
      .addCase(createProjectThunk.fulfilled, (state, action) => {
        state.isCreating = false;

        const newProduction = action.payload;

        // Set as currentProject immediately so the dashboard can render
        state.currentProject = newProduction;

        // Prepend to projects[] so the sidebar shows it right away.
        // Avoid duplicates in case the list was already fetched.
        const alreadyIn = state.projects.some((p) => p._id === newProduction._id);
        if (!alreadyIn) {
          state.projects = [newProduction, ...state.projects];
          state.total    = state.total + 1;
        }

        state.successMessage =
          "PROJECT CREATED AS DRAFT. SUBMIT FOR APPROVAL TO ACTIVATE.";
      })
      .addCase(createProjectThunk.rejected, (state, action) => {
        state.isCreating = false;
        state.error      = action.payload;
      })

      // ── SUBMIT FOR APPROVAL ───────────────────────────────────────────────
      .addCase(submitProjectForApprovalThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error        = null;
      })
      .addCase(submitProjectForApprovalThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const updated = action.payload;
        const idx = state.projects.findIndex((p) => p._id === updated._id);
        if (idx !== -1) state.projects[idx] = updated;
        if (state.currentProject?._id === updated._id) state.currentProject = updated;
        state.successMessage = "PROJECT SUBMITTED FOR ADMIN APPROVAL";
      })
      .addCase(submitProjectForApprovalThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error        = action.payload;
      })

      // ── GET ALL PROJECTS ──────────────────────────────────────────────────
      .addCase(getAllProjectsThunk.pending, (state) => {
        state.isFetching = true;
        state.error      = null;
      })
      .addCase(getAllProjectsThunk.fulfilled, (state, action) => {
        state.isFetching = false;

        const incoming = action.payload.projects || [];

        // Merge: keep any locally-created project that isn't in the API response
        // (e.g. a freshly created draft that isn't returned by this particular query).
        const incomingIds = new Set(incoming.map((p) => p._id));
        const localOnly   = state.projects.filter(
          (p) => !incomingIds.has(p._id),
        );

        state.projects = [...localOnly, ...incoming];
        state.total    = action.payload.total  || 0;
        state.page     = action.payload.page   || 1;
        state.pages    = action.payload.pages  || 1;
        state.limit    = action.payload.limit  || 10;
      })
      .addCase(getAllProjectsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error      = action.payload;
      })

      // ── GET PROJECT BY ID ─────────────────────────────────────────────────
      .addCase(getProjectByIdThunk.pending, (state) => {
        state.isFetchingDetails = true;
        state.error             = null;
      })
      .addCase(getProjectByIdThunk.fulfilled, (state, action) => {
        state.isFetchingDetails = false;
        state.currentProject    = action.payload || null;

        // Also update the project in the list so sidebar labels stay fresh
        if (action.payload) {
          const idx = state.projects.findIndex((p) => p._id === action.payload._id);
          if (idx !== -1) {
            state.projects[idx] = action.payload;
          } else {
            // Project wasn't in the list yet — add it
            state.projects = [action.payload, ...state.projects];
          }
        }
      })
      .addCase(getProjectByIdThunk.rejected, (state, action) => {
        state.isFetchingDetails = false;
        state.error             = action.payload;
      })

      // ── UPDATE PROJECT ────────────────────────────────────────────────────
      .addCase(updateProjectThunk.pending, (state) => {
        state.isUpdating     = true;
        state.error          = null;
        state.successMessage = null;
      })
      .addCase(updateProjectThunk.fulfilled, (state, action) => {
        state.isUpdating     = false;
        state.currentProject = action.payload;
        const idx = state.projects.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.projects[idx] = action.payload;
        state.successMessage = "PROJECT UPDATED SUCCESSFULLY";
      })
      .addCase(updateProjectThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.error      = action.payload;
      })

      // ── DELETE PROJECT ────────────────────────────────────────────────────
      .addCase(deleteProjectThunk.pending, (state) => {
        state.isDeleting     = true;
        state.error          = null;
        state.successMessage = null;
      })
      .addCase(deleteProjectThunk.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.projects   = state.projects.filter((p) => p._id !== action.payload);
        state.total      = Math.max(0, state.total - 1);
        if (state.currentProject?._id === action.payload) state.currentProject = null;
        state.successMessage = "PROJECT DELETED SUCCESSFULLY";
      })
      .addCase(deleteProjectThunk.rejected, (state, action) => {
        state.isDeleting = false;
        state.error      = action.payload;
      })

      // ── GET PROJECT MEMBERS ───────────────────────────────────────────────
      .addCase(getProjectMembersThunk.pending, (state) => {
        state.isFetchingMembers = true;
        state.error             = null;
      })
      .addCase(getProjectMembersThunk.fulfilled, (state, action) => {
        state.isFetchingMembers = false;
        state.projectMembers    = action.payload || [];
      })
      .addCase(getProjectMembersThunk.rejected, (state, action) => {
        state.isFetchingMembers = false;
        state.error             = action.payload;
      })

      // ── GET PROJECT CONTACTS ──────────────────────────────────────────────
      .addCase(getProjectContactsThunk.pending, (state) => {
        state.isFetchingContacts = true;
        state.error              = null;
      })
      .addCase(getProjectContactsThunk.fulfilled, (state, action) => {
        state.isFetchingContacts = false;
        state.projectContacts    = action.payload.contacts || [];
        if (state.currentProject?._id === action.payload.productionId) {
          state.currentProject.projectContacts = action.payload.contacts;
        }
      })
      .addCase(getProjectContactsThunk.rejected, (state, action) => {
        state.isFetchingContacts = false;
        state.error              = action.payload;
      })

      // ── UPSERT PROJECT CONTACT ────────────────────────────────────────────
      .addCase(upsertProjectContactThunk.pending, (state) => {
        state.isUpsertingContact = true;
        state.error              = null;
        state.successMessage     = null;
      })
      .addCase(upsertProjectContactThunk.fulfilled, (state, action) => {
        state.isUpsertingContact = false;
        const idx = state.projects.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.projects[idx] = action.payload;
        if (state.currentProject?._id === action.payload._id) state.currentProject = action.payload;
        state.projectContacts = action.payload.projectContacts || [];
        state.successMessage  = "PROJECT CONTACT SAVED SUCCESSFULLY";
      })
      .addCase(upsertProjectContactThunk.rejected, (state, action) => {
        state.isUpsertingContact = false;
        state.error              = action.payload;
      })

      // ── REMOVE PROJECT CONTACT ────────────────────────────────────────────
      .addCase(removeProjectContactThunk.pending, (state) => {
        state.isRemovingContact = true;
        state.error             = null;
        state.successMessage    = null;
      })
      .addCase(removeProjectContactThunk.fulfilled, (state, action) => {
        state.isRemovingContact = false;
        const idx = state.projects.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.projects[idx] = action.payload;
        if (state.currentProject?._id === action.payload._id) state.currentProject = action.payload;
        state.projectContacts = action.payload.projectContacts || [];
        state.successMessage  = "PROJECT CONTACT REMOVED SUCCESSFULLY";
      })
      .addCase(removeProjectContactThunk.rejected, (state, action) => {
        state.isRemovingContact = false;
        state.error             = action.payload;
      })

      // ── ADD CREW MEMBER ───────────────────────────────────────────────────
      .addCase(addCrewMemberThunk.pending, (state) => {
        state.isAddingCrew   = true;
        state.error          = null;
        state.successMessage = null;
      })
      .addCase(addCrewMemberThunk.fulfilled, (state, action) => {
        state.isAddingCrew = false;
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
        state.successMessage = "CREW MEMBER ADDED SUCCESSFULLY";
      })
      .addCase(addCrewMemberThunk.rejected, (state, action) => {
        state.isAddingCrew = false;
        state.error        = action.payload;
      });
  },
});

// ── Actions ───────────────────────────────────────────────────────────────────
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
  setApprovalStatus,
  setSort,
  setError,
  clearError,
  clearSuccessMessage,
} = projectSlice.actions;

export default projectSlice.reducer;