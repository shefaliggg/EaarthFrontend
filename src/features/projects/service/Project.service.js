import { axiosConfig } from "@/features/auth/config/axiosConfig";
import { API_ROUTE } from "../../../constants/apiEndpoints";

export const createProject = async (payload) => {
  const res = await axiosConfig.post(API_ROUTE.PROJECT.CREATE_PROJECT, payload);
  return res.data?.data;
};

export const getAllProjects = async (params = {}) => {
  const res = await axiosConfig.get(API_ROUTE.PROJECT.GET_PROJECTS, {
    params,
  });
  return res.data;
};

export const getProjectById = async (id) => {
  const res = await axiosConfig.get(`${API_ROUTE.PROJECT.GET_PROJECT_BY_ID}/${id}`);
  return res.data;
};

export const updateProject = async (id, payload) => {
  const res = await axiosConfig.put(`${API_ROUTE.PROJECT.UPDATE_PROJECT}/${id}`, payload);
  return res.data?.data;
};

export const deleteProject = async (id) => {
  const res = await axiosConfig.delete(`${API_ROUTE.PROJECT.DELETE_PROJECT}/${id}`);
  return res.data;
};