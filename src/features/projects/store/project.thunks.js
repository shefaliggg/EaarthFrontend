import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../service/Project.service";

export const createProjectThunk = createAsyncThunk(
  "project/create",
  async (values, { rejectWithValue }) => {
    try {
      const payload = {
        projectName: values.projectName,
        projectType: values.projectType,
        prepStartDate: values.prepStartDate,
        prepEndDate: values.prepEndDate,
        shootStartDate: values.shootStartDate,
        shootEndDate: values.shootEndDate,
        wrapStartDate: values.wrapStartDate,
        wrapEndDate: values.wrapEndDate,
        country: values.country,
        description: values.description || "",
      };

      const response = await createProject(payload);
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
      const response = await getAllProjects(filters);
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
      const response = await getProjectById(id);
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
        prepStartDate: values.prepStartDate,
        prepEndDate: values.prepEndDate,
        shootStartDate: values.shootStartDate,
        shootEndDate: values.shootEndDate,
        wrapStartDate: values.wrapStartDate,
        wrapEndDate: values.wrapEndDate,
        country: values.country,
        description: values.description,
      };

      const response = await updateProject(id, payload);
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
      await deleteProject(id);
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