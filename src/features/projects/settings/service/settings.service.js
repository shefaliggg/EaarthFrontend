import { axiosConfig } from "@/features/auth/config/axiosConfig";

export const getProjectDetailsSettings = async (projectId) => {
  const res = await axiosConfig.get(`/settings/${projectId}/details`);
  return res.data.data;
};

export const updateProjectDetailsSettings = async (projectId, payload) => {
  const res = await axiosConfig.patch(`/settings/${projectId}/details`, payload);
  return res.data.data;
};

export const lockProjectDetailsSettings = async (projectId, payload) => {
  const res = await axiosConfig.post(`/settings/${projectId}/details/lock`, payload);
  return res.data.data;
};

export const getProjectContactsSettings = async (projectId) => {
  const res = await axiosConfig.get(`/settings/${projectId}/contacts`);
  return res.data.data;
};

export const getProjectContactsOptions = async (projectId) => {
  const res = await axiosConfig.get(`/settings/${projectId}/contacts/options`);
  return res.data.data;
};

export const updateProjectContactsSettings = async (projectId, payload) => {
  const res = await axiosConfig.patch(`/settings/${projectId}/contacts`, payload);
  return res.data.data;
};

export const lockProjectContactsSettings = async (projectId, payload) => {
  const res = await axiosConfig.post(`/settings/${projectId}/contacts/lock`, payload);
  return res.data.data;
};
