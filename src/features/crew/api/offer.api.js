/**
 * offer.api.js
 *
 * All network calls for the offer feature.
 * Uses your existing axiosConfig instance (which already has baseURL,
 * withCredentials, token refresh interceptors, etc.)
 *
 * Place at: src/features/offers/api/offer.api.js
 */

import axiosConfig from "../../auth/config/axiosConfig";

const BASE     = "/offers";
const SIG_BASE = "/signatures"; // ← separate base for signature routes

// ─── Role header injector ─────────────────────────────────────────────────────
const roleHeaders = () => ({
  "x-view-as-role": localStorage.getItem("viewRole") || "PRODUCTION_ADMIN",
});

// ─── Response unwrapper ───────────────────────────────────────────────────────
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

export const moveToProductionCheck = (id) =>
  axiosConfig.patch(`${BASE}/${id}/production-check`, {}, { headers: roleHeaders() }).then(unwrap);

export const moveToAccountsCheck = (id) =>
  axiosConfig.patch(`${BASE}/${id}/accounts-check`, {}, { headers: roleHeaders() }).then(unwrap);

export const moveToPendingCrewSignature = (id) =>
  axiosConfig.patch(`${BASE}/${id}/pending-crew-signature`, {}, { headers: roleHeaders() }).then(unwrap);

// ─── SIGNING ─────────────────────────────────────────────────────────────────
// All four roles hit the SAME endpoint: POST /signatures/:offerId/sign
// The backend reads the role from x-view-as-role header (demo)
// or the real JWT (production) to determine which signing step this is.
// The canvas data URL is required in the body as { signature }.

export const crewSign = (offerId, signature) =>
  axiosConfig.post(`${SIG_BASE}/${offerId}/sign`, { signature }, { headers: roleHeaders() }).then(unwrap);

export const upmSign = (offerId, signature) =>
  axiosConfig.post(`${SIG_BASE}/${offerId}/sign`, { signature }, { headers: roleHeaders() }).then(unwrap);

export const fcSign = (offerId, signature) =>
  axiosConfig.post(`${SIG_BASE}/${offerId}/sign`, { signature }, { headers: roleHeaders() }).then(unwrap);

export const studioSign = (offerId, signature) =>
  axiosConfig.post(`${SIG_BASE}/${offerId}/sign`, { signature }, { headers: roleHeaders() }).then(unwrap);

export const getSigningStatus = (offerId) =>
  axiosConfig.get(`${SIG_BASE}/${offerId}/status`, { headers: roleHeaders() }).then(unwrap);

// ─── Change requests ──────────────────────────────────────────────────────────

export const getChangeRequests = (offerId) =>
  axiosConfig.get(`${BASE}/${offerId}/change-requests`, { headers: roleHeaders() }).then(unwrap);

export const resolveChangeRequest = (offerId, changeRequestId, status, notes) =>
  axiosConfig.patch(
    `${BASE}/${offerId}/change-requests/${changeRequestId}/resolve`,
    { status, notes },
    { headers: roleHeaders() }
  ).then(unwrap);