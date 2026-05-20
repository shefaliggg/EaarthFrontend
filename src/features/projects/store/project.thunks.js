// src/features/projects/store/project.thunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProjectAPI,
  submitProjectForApprovalAPI,
  getAllProjectsAPI,
  getMyProjectsAPI,
  getProjectByIdAPI,
  updateProjectAPI,
  deleteProjectAPI,
  getProjectMembers,
  getProjectContactsAPI,
  upsertProjectContactAPI,
  removeProjectContactAPI,
  addCrewMemberAPI,
} from "../api/Project.api";

// ─── Role helper (mirrors backend + DashboardLayout) ─────────────────────────
//
// Source of truth: affiliations[] — NOT userType (deprecated)
//
// FIX: tries multiple Redux state paths so this works regardless of how your
// auth slice is registered in combineReducers:
//   store.auth.user       ← most common
//   store.user.user       ← if auth reducer registered as "user"
//   store.user.currentUser ← alternative naming
//   store.auth.currentUser ← alternative naming
//
// If none match, returns false (safe fallback — shows crew view).

function resolveUserFromState(getState) {
  const state = getState();
  return (
    state?.auth?.user ??
    state?.auth?.currentUser ??
    state?.user?.user ??
    state?.user?.currentUser ??
    null
  );
}

function isStudioAdminFromState(getState) {
  const user = resolveUserFromState(getState);
  if (!Array.isArray(user?.affiliations)) return false;
  return user.affiliations.some(
    (a) => a.orgType === "studio" && a.role === "studio_admin" && a.status === "active"
  );
}

// ─── Production CRUD ──────────────────────────────────────────────────────────

export const createProjectThunk = createAsyncThunk(
  "project/create",
  async (values, { rejectWithValue }) => {
    try {
      const payload = {
        productionName:  values.productionName,
        productionType:  values.productionType,
        studioId:        values.studioId,
        country:         values.country,
        prepStartDate:   values.prepStartDate,
        prepEndDate:     values.prepEndDate,
        shootStartDate:  values.shootStartDate,
        shootEndDate:    values.shootEndDate,
        wrapStartDate:   values.wrapStartDate,
        wrapEndDate:     values.wrapEndDate,
        applications:    values.applications    ?? [],
        packageTier:     values.packageTier     ?? "basic",
        projectContacts: values.projectContacts ?? [],
        // branding carries the persisted accentColor from ProjectDetails
        ...(values.branding ? { branding: values.branding } : {}),
      };
      const response = await createProjectAPI(payload);
      return response;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to create project");
    }
  }
);

export const submitProjectForApprovalThunk = createAsyncThunk(
  "project/submitForApproval",
  async (id, { rejectWithValue }) => {
    try {
      const response = await submitProjectForApprovalAPI(id);
      return response;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to submit project for approval"
      );
    }
  }
);

/**
 * GET ALL PROJECTS — role-aware
 *
 * Studio Admin → GET /productions      (all studio productions, any status)
 * Crew         → GET /my-projects      (only projects with completed contract)
 *
 * The role check reads affiliations[] from Redux state — same source of truth
 * as DashboardLayout and the backend.
 *
 * FIX: resolveUserFromState() tries multiple common Redux slice path variants
 * so the check works regardless of how your auth reducer is named.
 */
export const getAllProjectsThunk = createAsyncThunk(
  "project/getAllProjects",
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const studioAdmin = isStudioAdminFromState(getState);

      if (studioAdmin) {
        const response = await getAllProjectsAPI(filters);
        return {
          projects:   response.data             ?? [],
          total:      response.pagination?.total ?? 0,
          page:       response.pagination?.page  ?? 1,
          pages:      response.pagination?.pages ?? 1,
          limit:      response.pagination?.limit ?? 10,
          isCrewView: false,
        };
      } else {
        const response = await getMyProjectsAPI();
        const projects = response.data ?? [];
        return {
          projects,
          total:      projects.length,
          page:       1,
          pages:      1,
          limit:      projects.length || 10,
          isCrewView: true,
        };
      }
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch projects");
    }
  }
);

export const getProjectByIdThunk = createAsyncThunk(
  "project/getProjectById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProjectByIdAPI(id);
      return response;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch project details");
    }
  }
);

export const updateProjectThunk = createAsyncThunk(
  "project/update",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const payload = {
        productionName:  values.productionName,
        productionType:  values.productionType,
        studioId:        values.studioId,
        country:         values.country,
        prepStartDate:   values.prepStartDate,
        prepEndDate:     values.prepEndDate,
        shootStartDate:  values.shootStartDate,
        shootEndDate:    values.shootEndDate,
        wrapStartDate:   values.wrapStartDate,
        wrapEndDate:     values.wrapEndDate,
        applications:    values.applications,
        packageTier:     values.packageTier,
        projectContacts: values.projectContacts,
      };
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) delete payload[key];
      });
      const response = await updateProjectAPI(id, payload);
      return response;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update project");
    }
  }
);

export const deleteProjectThunk = createAsyncThunk(
  "project/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProjectAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to delete project");
    }
  }
);

// ─── Project Members ──────────────────────────────────────────────────────────

export const getProjectMembersThunk = createAsyncThunk(
  "project/getMembers",
  async ({ projectId, search }, { rejectWithValue }) => {
    try {
      const response = await getProjectMembers(projectId, search);
      return response;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch project members");
    }
  }
);

// ─── Project Contacts ─────────────────────────────────────────────────────────

export const getProjectContactsThunk = createAsyncThunk(
  "project/contacts/getAll",
  async (productionId, { rejectWithValue }) => {
    try {
      const response = await getProjectContactsAPI(productionId);
      return { productionId, contacts: response };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch project contacts");
    }
  }
);

export const upsertProjectContactThunk = createAsyncThunk(
  "project/contacts/upsert",
  async ({ productionId, contact }, { rejectWithValue }) => {
    try {
      const response = await upsertProjectContactAPI(productionId, contact);
      return response;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to save project contact");
    }
  }
);

export const removeProjectContactThunk = createAsyncThunk(
  "project/contacts/remove",
  async ({ productionId, contactId }, { rejectWithValue }) => {
    try {
      const response = await removeProjectContactAPI(productionId, contactId);
      return response;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to remove project contact");
    }
  }
);

// ─── Crew ─────────────────────────────────────────────────────────────────────

export const addCrewMemberThunk = createAsyncThunk(
  "project/crew/add",
  async ({ productionId, crewData }, { rejectWithValue }) => {
    try {
      const response = await addCrewMemberAPI(productionId, crewData);
      return response;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to add crew member");
    }
  }
);