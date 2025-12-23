import { axiosConfig } from "@/features/auth/config/axiosConfig";
import { API_ROUTE } from "../../../constants/apiEndpoints";

// Project API service functions
export const createProjectAPI = async (payload) => {
  const res = await axiosConfig.post(API_ROUTE.PROJECT.CREATE_PROJECT, payload);
  return res.data?.data;
};

export const getAllProjectsAPI = async (params = {}) => {
  const res = await axiosConfig.get(API_ROUTE.PROJECT.GET_PROJECTS, {
    params,
  });
  return res.data;
};

export const getProjectByIdAPI = async (id) => {
  const res = await axiosConfig.get(`${API_ROUTE.PROJECT.GET_PROJECT_BY_ID}/${id}`);
  return res.data;
};

export const updateProjectAPI = async (id, payload) => {
  const res = await axiosConfig.put(`${API_ROUTE.PROJECT.UPDATE_PROJECT}/${id}`, payload);
  return res.data?.data;
};

export const deleteProjectAPI = async (id) => {
  const res = await axiosConfig.delete(`${API_ROUTE.PROJECT.DELETE_PROJECT}/${id}`);
  return res.data;
};