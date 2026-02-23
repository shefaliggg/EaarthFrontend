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
} from "../service/Project.service";

/**
 * CREATE PROJECT (Draft status)
 */
export const createProjectThunk = createAsyncThunk(
  "project/create",
  async (values, { rejectWithValue }) => {
    try {
      const payload = {
        projectName: values.projectName,
        projectType: values.projectType,
        studioId: values.studioId,
        prepStartDate: values.prepStartDate,
        prepEndDate: values.prepEndDate,
        shootStartDate: values.shootStartDate,
        shootEndDate: values.shootEndDate,
        wrapStartDate: values.wrapStartDate,
        wrapEndDate: values.wrapEndDate,
        country: values.country,
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
 */
export const getAllProjectsThunk = createAsyncThunk(
  "project/getAllProjects",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await getAllProjectsAPI(filters);
      return {
        projects: response.data || [],
        total: response.pagination?.total || 0,
        page: response.pagination?.page || 1,
        pages: response.pagination?.pages || 1,
        limit: response.pagination?.limit || 10,
      };
    } catch (err) {
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
 * UPDATE PROJECT (Only for approved projects)
 */
export const updateProjectThunk = createAsyncThunk(
  "project/update",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const payload = {
        projectName: values.projectName,
        projectType: values.projectType,
        studioId: values.studioId,
        prepStartDate: values.prepStartDate,
        prepEndDate: values.prepEndDate,
        shootStartDate: values.shootStartDate,
        shootEndDate: values.shootEndDate,
        wrapStartDate: values.wrapStartDate,
        wrapEndDate: values.wrapEndDate,
        country: values.country,
      };

      // Remove undefined values
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
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

export const getProjectMembersThunk = createAsyncThunk(
  "project/getMembers",
  async ({ projectId, search }, { rejectWithValue }) => {
    try {
      const response = await getProjectMembers(projectId, search);
      return response;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch project members",
        console.error(
          "falied to fetch proejct members:",
          err?.response?.data?.message || err,
        ),
      );
    }
  },
);
