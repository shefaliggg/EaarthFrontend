/**
 * offer.api.js
 *
 * All network calls for the offer feature.
 * Uses your existing axiosConfig instance (which already has baseURL,
 * withCredentials, token refresh interceptors, etc.)
 *
 * Place at: src/features/offers/api/offer.api.js
 */

import axiosConfig from "../../auth/config/axiosConfig"; // Adjust this import path to your actual axiosConfig location
// ↑ Adjust this import path to wherever your axios instance lives.
//   Common paths: "@/lib/axios", "@/config/axios", "@/shared/config/axiosConfig"

const BASE = "/offers"; // axiosConfig.baseURL is already "http://localhost:5000/api/v1"

// ─── Role header injector ─────────────────────────────────────────────────────
// Injects x-view-as-role on every request for demo role switching.
// In production, remove this and rely on the real JWT claims instead.

const roleHeaders = () => ({
  "x-view-as-role": localStorage.getItem("viewRole") || "PRODUCTION_ADMIN",
});

// ─── Response unwrapper ───────────────────────────────────────────────────────
// Your backend always returns { success, data } — unwrap to just data.
// Errors are thrown by axios automatically (non-2xx), caught in the slice.

const unwrap = (res) => res.data.data;

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export const createOffer = (data) =>
  axiosConfig.post(BASE, data, { headers: roleHeaders() }).then(unwrap);

export const getOffer = (id) =>
  axiosConfig.get(`${BASE}/${id}`, { headers: roleHeaders() }).then(unwrap);

export const getProjectOffers = (projectId, filters = {}) =>
  axiosConfig.get(`${BASE}/project/${projectId}`, {
    params: filters,
    headers: roleHeaders(),
  }).then(unwrap);

export const getMyOffers = () =>
  axiosConfig.get(`${BASE}/my-offers`, { headers: roleHeaders() }).then(unwrap);

export const deleteOffer = (id) =>
  axiosConfig.delete(`${BASE}/${id}`, { headers: roleHeaders() }).then(unwrap);

// ─── Workflow transitions ─────────────────────────────────────────────────────

export const sendToCrew = (id, notes) =>
  axiosConfig.patch(`${BASE}/${id}/send`, { notes }, { headers: roleHeaders() }).then(unwrap);

export const markViewed = (id) =>
  axiosConfig.patch(`${BASE}/${id}/view`, {}, { headers: roleHeaders() }).then(unwrap);

export const crewAccept = (id) =>
  axiosConfig.patch(`${BASE}/${id}/accept`, {}, { headers: roleHeaders() }).then(unwrap);

export const crewRequestChanges = (id, payload) =>
  axiosConfig.patch(`${BASE}/${id}/request-changes`, payload, { headers: roleHeaders() }).then(unwrap);

export const cancelOffer = (id, reason) =>
  axiosConfig.patch(`${BASE}/${id}/cancel`, { reason }, { headers: roleHeaders() }).then(unwrap);

// Phase 2 — add backend routes when ready
export const moveToProductionCheck = (id) =>
  axiosConfig.patch(`${BASE}/${id}/production-check`, {}, { headers: roleHeaders() }).then(unwrap);

export const moveToAccountsCheck = (id) =>
  axiosConfig.patch(`${BASE}/${id}/accounts-check`, {}, { headers: roleHeaders() }).then(unwrap);

export const moveToPendingCrewSignature = (id) =>
  axiosConfig.patch(`${BASE}/${id}/pending-crew-signature`, {}, { headers: roleHeaders() }).then(unwrap);

export const crewSign = (id) =>
  axiosConfig.patch(`${BASE}/${id}/crew-sign`, {}, { headers: roleHeaders() }).then(unwrap);

export const upmSign = (id) =>
  axiosConfig.patch(`${BASE}/${id}/upm-sign`, {}, { headers: roleHeaders() }).then(unwrap);

export const fcSign = (id) =>
  axiosConfig.patch(`${BASE}/${id}/fc-sign`, {}, { headers: roleHeaders() }).then(unwrap);

export const studioSign = (id) =>
  axiosConfig.patch(`${BASE}/${id}/studio-sign`, {}, { headers: roleHeaders() }).then(unwrap);

// ─── Change requests ──────────────────────────────────────────────────────────

export const getChangeRequests = (offerId) =>
  axiosConfig.get(`${BASE}/${offerId}/change-requests`, { headers: roleHeaders() }).then(unwrap);

export const resolveChangeRequest = (offerId, changeRequestId, status, notes) =>
  axiosConfig.patch(
    `${BASE}/${offerId}/change-requests/${changeRequestId}/resolve`,
    { status, notes },
    { headers: roleHeaders() }
  ).then(unwrap);