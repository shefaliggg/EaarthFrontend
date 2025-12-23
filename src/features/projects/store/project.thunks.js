import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProjectAPI,
  getAllProjectsAPI,
  getProjectByIdAPI,
  updateProjectAPI,
  deleteProjectAPI,
} from "../service/Project.service";

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
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create project"
      );
    }
  }
);

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
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch projects"
      );
    }
  }
);

export const getProjectByIdThunk = createAsyncThunk(
  "project/getProjectById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProjectByIdAPI(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch project details"
      );
    }
  }
);

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
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      const response = await updateProjectAPI(id, payload);
      return response;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update project"
      );
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
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete project"
      );
    }
  }
);