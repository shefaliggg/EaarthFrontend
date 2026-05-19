// src/features/project/store/project.thunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProjectAPI,
  submitProjectForApprovalAPI,
  getAllProjectsAPI,
  getProjectByIdAPI,
  updateProjectAPI,
  deleteProjectAPI,
  getProjectMembers,
  getProjectContactsAPI,
  upsertProjectContactAPI,
  removeProjectContactAPI,
  addCrewMemberAPI,
} from "../api/Project.api";

// ─── Production CRUD ──────────────────────────────────────────────────────────

/**
 * CREATE PROJECT (Draft status)
 * values: {
 *   productionName, productionType, studioId, country,
 *   prepStartDate, prepEndDate, shootStartDate, shootEndDate, wrapStartDate, wrapEndDate,
 *   applications, packageTier, projectContacts
 * }
 */
export const createProjectThunk = createAsyncThunk(
  "project/create",
  async (values, { rejectWithValue }) => {
    try {
      const payload = {
        productionName: values.productionName,
        productionType: values.productionType,
        studioId: values.studioId,
        country: values.country,
        prepStartDate: values.prepStartDate,
        prepEndDate: values.prepEndDate,
        shootStartDate: values.shootStartDate,
        shootEndDate: values.shootEndDate,
        wrapStartDate: values.wrapStartDate,
        wrapEndDate: values.wrapEndDate,
        applications: values.applications ?? [],
        packageTier: values.packageTier ?? "basic",
        projectContacts: values.projectContacts ?? [],
      };

      const response = await createProjectAPI(payload);
      return response;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to create project",
      );
    }
  },
);

/**
 * SUBMIT PROJECT FOR APPROVAL
 */
export const submitProjectForApprovalThunk = createAsyncThunk(
  "project/submitForApproval",
  async (id, { rejectWithValue }) => {
    try {
      const response = await submitProjectForApprovalAPI(id);
      return response;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to submit project for approval",
      );
    }
  },
);

/**
 * GET ALL PROJECTS (User's projects only)
 * filters: { search, productionType, country, studioId, approvalStatus, page, limit, sort }
 */
export const getAllProjectsThunk = createAsyncThunk(
  "project/getAllProjects",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await getAllProjectsAPI(filters);
      // console.log("getAllProjectsThunk response:", response);
      return {
        projects: response.data || [],
        total: response.pagination?.total || 0,
        page: response.pagination?.page || 1,
        pages: response.pagination?.pages || 1,
        limit: response.pagination?.limit || 10,
      };
    } catch (err) {
      console.error("getAllProjectsThunk error:", err);
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch projects",
      );
    }
  },
);

/**
 * GET PROJECT BY ID
 */
export const getProjectByIdThunk = createAsyncThunk(
  "project/getProjectById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProjectByIdAPI(id);
      return response;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch project details",
      );
    }
  },
);

/**
 * UPDATE PROJECT (draft / rejected / approved)
 * values: same shape as create — all fields optional except what changed
 */
export const updateProjectThunk = createAsyncThunk(
  "project/update",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const payload = {
        productionName: values.productionName,
        productionType: values.productionType,
        studioId: values.studioId,
        country: values.country,
        prepStartDate: values.prepStartDate,
        prepEndDate: values.prepEndDate,
        shootStartDate: values.shootStartDate,
        shootEndDate: values.shootEndDate,
        wrapStartDate: values.wrapStartDate,
        wrapEndDate: values.wrapEndDate,
        applications: values.applications,
        packageTier: values.packageTier,
        projectContacts: values.projectContacts,
      };

      // Remove undefined values so we don't accidentally clear fields
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) delete payload[key];
      });

      const response = await updateProjectAPI(id, payload);
      return response;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update project",
      );
    }
  },
);

/**
 * DELETE PROJECT
 */
export const deleteProjectThunk = createAsyncThunk(
  "project/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProjectAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete project",
      );
    }
  },
);

// ─── Project Members ──────────────────────────────────────────────────────────

export const getProjectMembersThunk = createAsyncThunk(
  "project/getMembers",
  async ({ projectId, search }, { rejectWithValue }) => {
    try {
      const response = await getProjectMembers(projectId, search);
      return response;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch project members",
      );
    }
  },
);

// ─── Project Contacts ─────────────────────────────────────────────────────────

/**
 * GET all invited contacts for a production.
 */
export const getProjectContactsThunk = createAsyncThunk(
  "project/contacts/getAll",
  async (productionId, { rejectWithValue }) => {
    try {
      const response = await getProjectContactsAPI(productionId);
      return { productionId, contacts: response };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch project contacts",
      );
    }
  },
);

/**
 * UPSERT a project contact (add or update by role).
 * { productionId, contact: { role, fullName, email } }
 */
export const upsertProjectContactThunk = createAsyncThunk(
  "project/contacts/upsert",
  async ({ productionId, contact }, { rejectWithValue }) => {
    try {
      const response = await upsertProjectContactAPI(productionId, contact);
      return response; // full updated production document
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to save project contact",
      );
    }
  },
);

/**
 * REMOVE a project contact by contactId.
 * { productionId, contactId }
 */
export const removeProjectContactThunk = createAsyncThunk(
  "project/contacts/remove",
  async ({ productionId, contactId }, { rejectWithValue }) => {
    try {
      const response = await removeProjectContactAPI(productionId, contactId);
      return response; // full updated production document
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to remove project contact",
      );
    }
  },
);

// ─── Crew ─────────────────────────────────────────────────────────────────────

/**
 * ADD CREW MEMBER to an approved production.
 * { productionId, crewData: { userId, role, department } }
 */
export const addCrewMemberThunk = createAsyncThunk(
  "project/crew/add",
  async ({ productionId, crewData }, { rejectWithValue }) => {
    try {
      const response = await addCrewMemberAPI(productionId, crewData);
      return response;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to add crew member",
      );
    }
  },
);
