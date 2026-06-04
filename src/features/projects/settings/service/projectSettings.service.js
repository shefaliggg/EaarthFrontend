/**
 * projectSettings.service.js
 *
 * Path: src/features/projects/settings/service/projectSettings.service.js
 *
 * Thin Axios wrappers — one function per API endpoint.
 * All functions return the unwrapped `data.data` payload.
 */
import axiosConfig from "@/features/auth/config/axiosConfig.js";

const BASE = (projectId) => `/settings/${projectId}`;

// ─── Root ─────────────────────────────────────────────────────────────────────

export const initialiseProjectSettings = async (projectId, studioId) => {
  const res = await axiosConfig.post(`${BASE(projectId)}/initialise`, { studioId });
  return res.data.data;
};

export const getProjectSettings = async (projectId) => {
  const res = await axiosConfig.get(BASE(projectId));
  return res.data.data;
};

export const deleteProjectSettings = async (projectId) => {
  await axiosConfig.delete(BASE(projectId));
};

// ─── Details ─────────────────────────────────────────────────────────────────

export const updateProjectDetails = async (projectId, payload) => {
  const res = await axiosConfig.patch(`${BASE(projectId)}/details`, payload);
  return res.data.data;
};

// ─── Dates ───────────────────────────────────────────────────────────────────

export const updateProjectDates = async (projectId, payload) => {
  const res = await axiosConfig.patch(`${BASE(projectId)}/dates`, payload);
  return res.data.data;
};

// ─── Timecard settings ────────────────────────────────────────────────────────

export const getTimecardSettings = async (projectId) => {
  const res = await axiosConfig.get(`${BASE(projectId)}/timecard`);
  return res.data.data;
};

export const updateTimecardSettings = async (projectId, payload) => {
  const res = await axiosConfig.patch(`${BASE(projectId)}/timecard`, payload);
  return res.data.data;
};

// ─── Custom settings ──────────────────────────────────────────────────────────

export const getCustomSettings = async (projectId) => {
  const res = await axiosConfig.get(`${BASE(projectId)}/custom`);
  return res.data.data;
};

// Day Types
export const addDayType = async (projectId, payload) => {
  const res = await axiosConfig.post(`${BASE(projectId)}/custom/day-types`, payload);
  return res.data.data;
};

export const updateDayType = async (projectId, dayTypeId, payload) => {
  const res = await axiosConfig.patch(`${BASE(projectId)}/custom/day-types/${dayTypeId}`, payload);
  return res.data.data;
};

export const deleteDayType = async (projectId, dayTypeId) => {
  await axiosConfig.delete(`${BASE(projectId)}/custom/day-types/${dayTypeId}`);
};

// Upgrade Roles
export const addUpgradeRole = async (projectId, payload) => {
  const res = await axiosConfig.post(`${BASE(projectId)}/custom/upgrade-roles`, payload);
  return res.data.data;
};

export const updateUpgradeRole = async (projectId, roleId, payload) => {
  const res = await axiosConfig.patch(`${BASE(projectId)}/custom/upgrade-roles/${roleId}`, payload);
  return res.data.data;
};

export const deleteUpgradeRole = async (projectId, roleId) => {
  await axiosConfig.delete(`${BASE(projectId)}/custom/upgrade-roles/${roleId}`);
};

// Penny Contracts
export const getPennyContractCrew = async (projectId) => {
  const res = await axiosConfig.get(`${BASE(projectId)}/custom/penny-contracts`);
  return res.data.data;
};

export const setPennyContract = async (projectId, crewMemberId, enabled) => {
  const res = await axiosConfig.patch(
    `${BASE(projectId)}/custom/penny-contracts/${crewMemberId}`,
    { enabled }
  );
  return res.data.data;
};

// Allowance Overrides
export const addAllowanceOverride = async (projectId, payload) => {
  const res = await axiosConfig.post(`${BASE(projectId)}/custom/allowance-overrides`, payload);
  return res.data.data;
};

export const deleteAllowanceOverride = async (projectId, overrideId) => {
  await axiosConfig.delete(`${BASE(projectId)}/custom/allowance-overrides/${overrideId}`);
};