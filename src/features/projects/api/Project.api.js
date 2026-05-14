// src/features/projects/service/Project.service.js
//
import axiosConfig from "../../auth/config/axiosConfig"; // adjust if your path differs


// ─── Production CRUD ──────────────────────────────────────────────────────────

export const createProjectAPI = async (body) => {
  const response = await axiosConfig.post("/productions/create", body);
  return response.data.data;
};

export const submitProjectForApprovalAPI = async (id) => {
  const response = await axiosConfig.post(
    `/productions/${id}/submit-approval`,
  );
  return response.data.data;
};

export const getAllProjectsAPI = async (params = {}) => {
  const response = await axiosConfig.get("/productions", { params });
  return response.data; // thunk reads .data[] and .pagination off this
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
  const response = await axiosConfig.get(`/productions/${projectId}/crew`, {
    params: { search },
  });
  return response.data.data;
};

// ─── Project Contacts ─────────────────────────────────────────────────────────

export const getProjectContactsAPI = async (productionId) => {
  const response = await axiosConfig.get(
    `/productions/${productionId}/contacts`,
  );
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