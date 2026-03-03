/**
 * offer.api.js  (FINAL FIX)
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
// POST /signatures/:contractId/sign
// Returns { success, data: { contract, offer } }

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
// GET /signatures/:contractId/preview
//
// ⚠️  CRITICAL — DO NOT USE unwrap() HERE
//
// Backend returns raw HTML text (Content-Type: text/html), not JSON.
// unwrap() does res.data.data — which returns undefined on a text response.
// That's why the iframe was always empty / "preview not available".
//
// Fix: responseType: "text" prevents axios trying to JSON-parse the response.
//      .then((res) => res.data) returns the raw HTML string directly.

export const getContractPreview = (contractId) =>
  axiosConfig
    .get(`${SIG_BASE}/${contractId}/preview`, {
      headers:      roleHeaders(),
      responseType: "text",       // ← tells axios: keep response as plain string
    })
    .then((res) => res.data);     // ← raw HTML string  (NOT res.data.data)

// ─── CONTRACT PDF DOWNLOAD URL ────────────────────────────────────────────────
// GET /contracts/:contractId/pdf-url
// Returns { success, data: { url: "https://..." } } — temporary signed S3 URL

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