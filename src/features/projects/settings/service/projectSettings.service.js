/**
 * projectSettings.service.js
 *
 * Path: src/features/projects/settings/service/projectSettings.service.js
 *
 * All API calls for projectSettings — one function per endpoint.
 */

import axiosInstance from "../../../auth/config/axiosConfig"; // adjust path to your axios wrapper

const BASE = (projectId) => `/settings/${projectId}`;

// ─── Root ─────────────────────────────────────────────────────────────────────

export const getProjectSettings       = (projectId)           => axiosInstance.get(BASE(projectId)).then((r) => r.data.data);
export const initialiseProjectSettings = (projectId, studioId) => axiosInstance.post(`${BASE(projectId)}/initialise`, { studioId }).then((r) => r.data.data);
export const deleteProjectSettings    = (projectId)           => axiosInstance.delete(BASE(projectId)).then((r) => r.data);

// ─── Timecard ─────────────────────────────────────────────────────────────────

export const getTimecardSettings    = (projectId)        => axiosInstance.get(`${BASE(projectId)}/timecard`).then((r) => r.data.data);
export const updateTimecardSettings = (projectId, body)  => axiosInstance.patch(`${BASE(projectId)}/timecard`, body).then((r) => r.data.data);

// ─── Custom ───────────────────────────────────────────────────────────────────

export const getCustomSettings        = (projectId)                       => axiosInstance.get(`${BASE(projectId)}/custom`).then((r) => r.data.data);
export const addDayType               = (projectId, body)                 => axiosInstance.post(`${BASE(projectId)}/custom/day-types`, body).then((r) => r.data.data);
export const updateDayType            = (projectId, dayTypeId, body)      => axiosInstance.patch(`${BASE(projectId)}/custom/day-types/${dayTypeId}`, body).then((r) => r.data.data);
export const deleteDayType            = (projectId, dayTypeId)            => axiosInstance.delete(`${BASE(projectId)}/custom/day-types/${dayTypeId}`).then((r) => r.data);
export const addUpgradeRole           = (projectId, body)                 => axiosInstance.post(`${BASE(projectId)}/custom/upgrade-roles`, body).then((r) => r.data.data);
export const updateUpgradeRole        = (projectId, roleId, body)         => axiosInstance.patch(`${BASE(projectId)}/custom/upgrade-roles/${roleId}`, body).then((r) => r.data.data);
export const deleteUpgradeRole        = (projectId, roleId)               => axiosInstance.delete(`${BASE(projectId)}/custom/upgrade-roles/${roleId}`).then((r) => r.data);
export const getPennyContractCrew     = (projectId)                       => axiosInstance.get(`${BASE(projectId)}/custom/penny-contracts`).then((r) => r.data.data);
export const setPennyContract         = (projectId, crewMemberId, body)   => axiosInstance.patch(`${BASE(projectId)}/custom/penny-contracts/${crewMemberId}`, body).then((r) => r.data.data);
export const addAllowanceOverride     = (projectId, body)                 => axiosInstance.post(`${BASE(projectId)}/custom/allowance-overrides`, body).then((r) => r.data.data);
export const deleteAllowanceOverride  = (projectId, overrideId)           => axiosInstance.delete(`${BASE(projectId)}/custom/allowance-overrides/${overrideId}`).then((r) => r.data);

// ─── Places ───────────────────────────────────────────────────────────────────

export const getPlacesSettings  = (projectId)                    => axiosInstance.get(`${BASE(projectId)}/places`).then((r) => r.data.data);
export const addUnit             = (projectId, body)              => axiosInstance.post(`${BASE(projectId)}/places/units`, body).then((r) => r.data.data);
export const updateUnit          = (projectId, unitId, body)      => axiosInstance.patch(`${BASE(projectId)}/places/units/${unitId}`, body).then((r) => r.data.data);
export const deleteUnit          = (projectId, unitId)            => axiosInstance.delete(`${BASE(projectId)}/places/units/${unitId}`).then((r) => r.data);
export const addWorkplace        = (projectId, body)              => axiosInstance.post(`${BASE(projectId)}/places/workplaces`, body).then((r) => r.data.data);
export const updateWorkplace     = (projectId, workplaceId, body) => axiosInstance.patch(`${BASE(projectId)}/places/workplaces/${workplaceId}`, body).then((r) => r.data.data);
export const deleteWorkplace     = (projectId, workplaceId)       => axiosInstance.delete(`${BASE(projectId)}/places/workplaces/${workplaceId}`).then((r) => r.data);

// ─── Construction ─────────────────────────────────────────────────────────────

export const getConstructionSettings = (projectId)       => axiosInstance.get(`${BASE(projectId)}/construction`).then((r) => r.data.data);
export const updateDailyRate         = (projectId, body) => axiosInstance.patch(`${BASE(projectId)}/construction/daily-rate`, body).then((r) => r.data.data);
export const updateBreaks            = (projectId, body) => axiosInstance.patch(`${BASE(projectId)}/construction/breaks`, body).then((r) => r.data.data);
export const updateSixthDay          = (projectId, body) => axiosInstance.patch(`${BASE(projectId)}/construction/sixth-day`, body).then((r) => r.data.data);
export const updateSeventhDay        = (projectId, body) => axiosInstance.patch(`${BASE(projectId)}/construction/seventh-day`, body).then((r) => r.data.data);
export const updateOvertime          = (projectId, body) => axiosInstance.patch(`${BASE(projectId)}/construction/overtime`, body).then((r) => r.data.data);
export const updateTravelTime        = (projectId, body) => axiosInstance.patch(`${BASE(projectId)}/construction/travel-time`, body).then((r) => r.data.data);
export const updateBrokenTurnaround  = (projectId, body) => axiosInstance.patch(`${BASE(projectId)}/construction/broken-turnaround`, body).then((r) => r.data.data);