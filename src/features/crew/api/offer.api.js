/**
 * offer.api.js
 *
 * Root cause of preview not working:
 *   getContractPreview was using .then(unwrap) which does res.data.data
 *   But backend sends raw HTML — there is no .data wrapper.
 *   So unwrap() was returning undefined.
 *
 * Fix: use responseType: "text" + .then((res) => res.data) for preview
 *
 * Route:   GET /api/v1/signatures/:contractId/preview
 * Returns: text/html string — rendered Handlebars template with current sigs
 */

import axiosConfig from "../../auth/config/axiosConfig";

const BASE     = "/offers";
const SIG_BASE = "/signatures";
const CON_BASE = "/contracts";

const roleHeaders = () => ({
  "x-view-as-role": localStorage.getItem("viewRole") || "PRODUCTION_ADMIN",
});

// Standard JSON unwrap — for endpoints that return { success, data: {...} }
const unwrap = (res) => res.data.data;

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export const createOffer = (data) =>
  axiosConfig.post(BASE, data, { headers: roleHeaders() }).then(unwrap);

export const getOffer = (id) =>
  axiosConfig.get(`${BASE}/${id}`, { headers: roleHeaders() }).then(unwrap);

export const getProjectOffers = (projectId, filters = {}) =>
  axiosConfig.get(`${BASE}/project/${projectId}`, { params: filters, headers: roleHeaders() }).then(unwrap);

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
  axiosConfig.patch(`${BASE}/${id}/request-changes`, payload, { headers: roleHeaders() }).then(unwrap);

export const cancelOffer = (id) =>
  axiosConfig.patch(`${BASE}/${id}/cancel`, {}, { headers: roleHeaders() }).then(unwrap);

export const moveToProductionCheck = (id) =>
  axiosConfig.patch(`${BASE}/${id}/production-check`, {}, { headers: roleHeaders() }).then(unwrap);

export const moveToAccountsCheck = (id) =>
  axiosConfig.patch(`${BASE}/${id}/accounts-check`, {}, { headers: roleHeaders() }).then(unwrap);

export const moveToPendingCrewSignature = (id) =>
  axiosConfig.patch(`${BASE}/${id}/pending-crew-signature`, {}, { headers: roleHeaders() }).then(unwrap);

// ─── SIGNING ──────────────────────────────────────────────────────────────────

const signAs = (contractId, signature) =>
  axiosConfig
    .post(`${SIG_BASE}/${contractId}/sign`, { signature }, { headers: roleHeaders() })
    .then(unwrap);

export const crewSign   = (contractId, signature) => signAs(contractId, signature);
export const upmSign    = (contractId, signature) => signAs(contractId, signature);
export const fcSign     = (contractId, signature) => signAs(contractId, signature);
export const studioSign = (contractId, signature) => signAs(contractId, signature);

// ─── SIGNING STATUS ───────────────────────────────────────────────────────────

export const getSigningStatus = (contractId) =>
  axiosConfig
    .get(`${SIG_BASE}/${contractId}/status`, { headers: roleHeaders() })
    .then(unwrap);

// ─── CONTRACT PREVIEW ─────────────────────────────────────────────────────────
// ⚠️  CRITICAL — DO NOT USE unwrap() HERE
// Backend returns raw HTML text, not JSON. responseType: "text" prevents axios
// from trying to JSON-parse the response. .then((res) => res.data) returns
// the raw HTML string directly.

export const getContractPreview = (contractId) =>
  axiosConfig
    .get(`${SIG_BASE}/${contractId}/preview`, {
      headers:      roleHeaders(),
      responseType: "text",
    })
    .then((res) => res.data);

// ─── CONTRACT PDF DOWNLOAD URL ────────────────────────────────────────────────

export const getContractPdfUrl = (contractId) =>
  axiosConfig
    .get(`${CON_BASE}/${contractId}/pdf-url`, { headers: roleHeaders() })
    .then(unwrap);

// ─── CHANGE REQUESTS ──────────────────────────────────────────────────────────

export const getChangeRequests = (offerId) =>
  axiosConfig.get(`${BASE}/${offerId}/change-requests`, { headers: roleHeaders() }).then(unwrap);

export const resolveChangeRequest = (offerId, changeRequestId, status, notes) =>
  axiosConfig
    .patch(
      `${BASE}/${offerId}/change-requests/${changeRequestId}/resolve`,
      { status, notes },
      { headers: roleHeaders() }
    )
    .then(unwrap);

// ─── CONTRACT INSTANCES ───────────────────────────────────────────────────────
// FIX: was using undefined `api` — must use `axiosConfig` throughout this file.

// GET /offers/:offerId/contract-instances
// Returns list metadata (no htmlContent).
export const getContractInstances = (offerId) =>
  axiosConfig
    .get(`${BASE}/${offerId}/contract-instances`, {
      params:  { activeOnly: "true" },
      headers: roleHeaders(),
    })
    .then((res) => res.data);

// GET /contract-instances/:instanceId/html
// Returns raw HTML string — responseType: "text" is REQUIRED.


// GET /contract-instances/:instanceId/html
export const getContractInstanceHtml = (instanceId) =>
  axiosConfig
    .get(`/contract-instances/${instanceId}/html`, {
      headers: roleHeaders(),
      responseType: "text",
    })
    .then((res) => res.data);


// GET /contract-instances/:instanceId
export const getContractInstance = (instanceId) =>
  axiosConfig
    .get(`/contract-instances/${instanceId}`, {
      headers: roleHeaders(),
    })
    .then((res) => res.data.data);


// PATCH /contract-instances/:instanceId/status
export const updateContractInstanceStatus = (instanceId, status) =>
  axiosConfig
    .patch(
      `/contract-instances/${instanceId}/status`,
      { status },
      { headers: roleHeaders() }
    )
    .then((res) => res.data.data);