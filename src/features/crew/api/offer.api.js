/**
 * offer.api.js
 *
 * NEW: extendContract      — PATCH /offers/:id/extend
 * NEW: cloneOffer          — POST  /offers/:id/clone
 * NEW: toggleContractLock  — PATCH /offers/:id/toggle-lock
 */

import axiosConfig from "../../auth/config/axiosConfig";

const BASE     = "/offers";
const SIG_BASE = "/signatures";
const CON_BASE = "/contracts";

const roleHeaders = () => ({
  "x-view-as-role": localStorage.getItem("viewRole") || "PRODUCTION_ADMIN",
});

const unwrap = (res) => res.data.data;

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export const createOffer = (data) =>
  axiosConfig.post(BASE, data, { headers: roleHeaders() }).then(unwrap);

export const getOffer = (id) =>
  axiosConfig.get(`${BASE}/${id}`, { headers: roleHeaders() }).then(unwrap);

export const getProjectOffers = (projectId, filters = {}) =>
  axiosConfig
    .get(`${BASE}/project/${projectId}`, { params: filters, headers: roleHeaders() })
    .then(unwrap);

export const getMyOffers = () =>
  axiosConfig.get(`${BASE}/my-offers`, { headers: roleHeaders() }).then(unwrap);

export const updateOffer = (id, data) =>
  axiosConfig.put(`${BASE}/${id}`, data, { headers: roleHeaders() }).then(unwrap);

export const deleteOffer = (id) =>
  axiosConfig.delete(`${BASE}/${id}`, { headers: roleHeaders() }).then(unwrap);

// ─── WORKFLOW ─────────────────────────────────────────────────────────────────

export const sendToCrew = (id) =>
  axiosConfig.patch(`${BASE}/${id}/send`, {}, { headers: roleHeaders() }).then(unwrap);

export const markViewed = (id) =>
  axiosConfig.patch(`${BASE}/${id}/view`, {}, { headers: roleHeaders() }).then(unwrap);

export const crewAccept = (id) =>
  axiosConfig.patch(`${BASE}/${id}/accept`, {}, { headers: roleHeaders() }).then(unwrap);

export const crewRequestChanges = (id, payload) =>
  axiosConfig
    .patch(`${BASE}/${id}/request-changes`, payload, { headers: roleHeaders() })
    .then(unwrap);

export const cancelOffer = (id) =>
  axiosConfig.patch(`${BASE}/${id}/cancel`, {}, { headers: roleHeaders() }).then(unwrap);

export const moveToProductionCheck = (id) =>
  axiosConfig
    .patch(`${BASE}/${id}/production-check`, {}, { headers: roleHeaders() })
    .then(unwrap);

export const moveToAccountsCheck = (id) =>
  axiosConfig
    .patch(`${BASE}/${id}/accounts-check`, {}, { headers: roleHeaders() })
    .then(unwrap);

export const moveToPendingCrewSignature = (id) =>
  axiosConfig
    .patch(`${BASE}/${id}/pending-crew-signature`, {}, { headers: roleHeaders() })
    .then(unwrap);

export const returnToProduction = (id, reason) =>
  axiosConfig
    .patch(`${BASE}/${id}/return-to-production`, { reason }, { headers: roleHeaders() })
    .then(unwrap);

// ─── EXTEND CONTRACT ──────────────────────────────────────────────────────────

export const extendContract = (id, { contractId, projectId, newEndDate, note }) =>
  axiosConfig
    .patch(`${BASE}/${id}/extend`, { contractId, projectId, newEndDate, note }, { headers: roleHeaders() })
    .then(unwrap);


// ─── TERMINATE CONTRACT ───────────────────────────────────────────────────────

export const terminateContract = (id, { noticePeriodDays, reason }) =>
  axiosConfig
    .patch(`${BASE}/${id}/terminate`, { noticePeriodDays, reason }, { headers: roleHeaders() })
    .then(unwrap);    
// ─── CLONE OFFER ──────────────────────────────────────────────────────────────


 
export const voidAndReplace = (id, { reason }) =>
  axiosConfig
    .post(`${BASE}/${id}/void-and-replace`, { reason }, { headers: roleHeaders() })
    .then(unwrap);
 

    
export const cloneOffer = (id) =>
  axiosConfig.post(`${BASE}/${id}/clone`, {}, { headers: roleHeaders() }).then(unwrap);

// ─── TOGGLE CONTRACT LOCK ─────────────────────────────────────────────────────

export const toggleContractLock = (id) =>
  axiosConfig
    .patch(`${BASE}/${id}/toggle-lock`, {}, { headers: roleHeaders() })
    .then(unwrap);

// ─── SIGNING ──────────────────────────────────────────────────────────────────

const signAs = (contractId, signature) =>
  axiosConfig
    .post(`${SIG_BASE}/${contractId}/sign`, { signature }, { headers: roleHeaders() })
    .then(unwrap);

export const crewSign   = (contractId, signature) => signAs(contractId, signature);
export const upmSign    = (contractId, signature) => signAs(contractId, signature);
export const fcSign     = (contractId, signature) => signAs(contractId, signature);
export const studioSign = (contractId, signature) => signAs(contractId, signature);

// ─── CONTRACT PREVIEW ─────────────────────────────────────────────────────────

export const getContractPreview = (contractId) =>
  axiosConfig
    .get(`${SIG_BASE}/${contractId}/preview`, {
      headers:      roleHeaders(),
      responseType: "text",
      params:       { _t: Date.now() },
    })
    .then((res) => res.data);

export const getSigningStatus = (contractId) =>
  axiosConfig
    .get(`${SIG_BASE}/${contractId}/status`, {
      headers: roleHeaders(),
      params:  { _t: Date.now() },
    })
    .then(unwrap);

// ─── CONTRACT PDF DOWNLOAD URL ────────────────────────────────────────────────

export const getContractPdfUrl = (contractId) =>
  axiosConfig
    .get(`${CON_BASE}/${contractId}/pdf-url`, { headers: roleHeaders() })
    .then(unwrap);

// ─── CHANGE REQUESTS ──────────────────────────────────────────────────────────

export const getChangeRequests = (offerId) =>
  axiosConfig
    .get(`${BASE}/${offerId}/change-requests`, { headers: roleHeaders() })
    .then(unwrap);

export const resolveChangeRequest = (offerId, changeRequestId, status, notes) =>
  axiosConfig
    .patch(
      `${BASE}/${offerId}/change-requests/${changeRequestId}/resolve`,
      { status, notes },
      { headers: roleHeaders() }
    )
    .then(unwrap);

// ─── CONTRACT INSTANCES ───────────────────────────────────────────────────────

export const getContractInstances = (offerId) =>
  axiosConfig
    .get(`${BASE}/${offerId}/contract-instances`, {
      params:  { activeOnly: "true" },
      headers: roleHeaders(),
    })
    .then((res) => res.data);

export const getContractInstanceHtml = (instanceId) =>
  axiosConfig
    .get(`/contract-instances/${instanceId}/html`, {
      headers:      roleHeaders(),
      responseType: "text",
    })
    .then((res) => res.data);

export const getContractInstance = (instanceId) =>
  axiosConfig
    .get(`/contract-instances/${instanceId}`, { headers: roleHeaders() })
    .then((res) => res.data.data);

export const updateContractInstanceStatus = (instanceId, status) =>
  axiosConfig
    .patch(
      `/contract-instances/${instanceId}/status`,
      { status },
      { headers: roleHeaders() }
    )
    .then((res) => res.data.data);

export const productionEditOffer = (id, data) =>
  axiosConfig
    .patch(`/offers/${id}/production-edit`, data, { headers: roleHeaders() })
    .then(unwrap);