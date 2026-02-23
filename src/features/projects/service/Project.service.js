// src/features/project/services/project.service.js
import { axiosConfig } from "@/features/auth/config/axiosConfig";

/**
 * CREATE PROJECT (User - Studio Admin)
 * Creates a new project in draft status
 */
export const createProjectAPI = async (payload) => {
  const res = await axiosConfig.post("/projects/create", payload);
  return res.data?.data;
};

/**
 * SUBMIT PROJECT FOR APPROVAL (User - Project Owner)
 * Submits a draft or rejected project for admin approval
 */
export const submitProjectForApprovalAPI = async (id) => {
  const res = await axiosConfig.post(`/projects/${id}/submit-approval`);
  return res.data?.data;
};

/**
 * GET ALL PROJECTS (User - Shows only user's projects)
 */
export const getAllProjectsAPI = async (params = {}) => {
  const res = await axiosConfig.get("/projects", { params });
  return res.data;
};

/**
 * GET PROJECT BY ID (User - Project Owner only)
 */
export const getProjectByIdAPI = async (id) => {
  const res = await axiosConfig.get(`/projects/${id}`);
  return res.data?.data;
};

/**
 * UPDATE PROJECT (User - Only for approved projects)
 */
export const updateProjectAPI = async (id, payload) => {
  const res = await axiosConfig.put(`/projects/${id}`, payload);
  return res.data?.data;
};

/**
 * DELETE PROJECT (User - Project Owner only)
 */
export const deleteProjectAPI = async (id) => {
  const res = await axiosConfig.delete(`/projects/${id}`);
  return res.data;
};

export const getProjectMembers = async (projectId, search = "") => {
  const res = await axiosConfig.get(
    `/projects/${projectId}/members`,
    {
      params: { search },
    }
  );

  return res.data?.data;
};