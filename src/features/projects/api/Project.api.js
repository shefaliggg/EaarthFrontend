// src/features/projects/api/Project.api.js

import axiosConfig from "../../auth/config/axiosConfig";

// ─── Production CRUD ──────────────────────────────────────────────────────────

export const createProjectAPI = async (body) => {
  const response = await axiosConfig.post("/productions/create", body);
  return response.data.data;
};

export const submitProjectForApprovalAPI = async (id) => {
  const response = await axiosConfig.post(`/productions/${id}/submit-approval`);
  return response.data.data;
};

/**
 * Studio admin: GET /productions — sees all studio productions (any approval status)
 */
export const getAllProjectsAPI = async (params = {}) => {
  const response = await axiosConfig.get("/productions", { params });
  return response.data; // thunk reads .data[] and .pagination
};

/**
 * Crew: GET /user/my-projects — sees only projects where their contract is COMPLETED
 * Returns array shaped like production documents (populated via ProjectMember)
 */
export const getMyProjectsAPI = async () => {
  const response = await axiosConfig.get("/my-projects");
  return response.data; // { success, data: [...productions] }
};

export const getProjectByIdAPI = async (id) => {
  const response = await axiosConfig.get(`/productions/${id}`);
  return response.data.data;
};

export const updateProjectAPI = async (id, body) => {
  const response = await axiosConfig.put(`/productions/${id}`, body);
  return response.data.data;
};

export const deleteProjectAPI = async (id) => {
  await axiosConfig.delete(`/productions/${id}`);
};

// ─── Project Members ──────────────────────────────────────────────────────────

export const getProjectMembers = async (projectId, search = "") => {
  const response = await axiosConfig.get(`/productions/${projectId}/members`, {
    params: { search },
  });
  return response.data.data;
};

// ─── Project Contacts ─────────────────────────────────────────────────────────

export const getProjectContactsAPI = async (productionId) => {
  const response = await axiosConfig.get(`/productions/${productionId}/contacts`);
  return response.data.data;
};

export const upsertProjectContactAPI = async (productionId, contact) => {
  const response = await axiosConfig.put(
    `/productions/${productionId}/contacts`,
    contact,
  );
  return response.data.data;
};

export const removeProjectContactAPI = async (productionId, contactId) => {
  const response = await axiosConfig.delete(
    `/productions/${productionId}/contacts/${contactId}`,
  );
  return response.data.data;
};

// ─── Crew ─────────────────────────────────────────────────────────────────────

export const addCrewMemberAPI = async (productionId, crewData) => {
  const response = await axiosConfig.post(
    `/productions/${productionId}/crew`,
    crewData,
  );
  return response.data.data;
};