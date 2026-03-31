/**
 * offer.thunks.js
 *
 * NEW: extendContractThunk     — calls PATCH /offers/:id/extend
 * NEW: cloneOfferThunk         — calls POST  /offers/:id/clone
 * NEW: toggleContractLockThunk — calls PATCH /offers/:id/toggle-lock
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as offerApi from "../api/offer.api";

const normalizeError = (e) => ({
  message: e.response?.data?.message || e.message || "Something went wrong",
  errors:  e.response?.data?.errors  || [],
  code:    e.response?.data?.code    || "UNKNOWN_ERROR",
  status:  e.response?.status,
});

export const createOfferThunk = createAsyncThunk("offers/create",
  async (payload, { rejectWithValue }) => {
    try { return await offerApi.createOffer(payload); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const getOfferThunk = createAsyncThunk("offers/getOne",
  async (id, { rejectWithValue }) => {
    try { return await offerApi.getOffer(id); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const getProjectOffersThunk = createAsyncThunk("offers/getByProject",
  async ({ projectId, filters = {} }, { rejectWithValue }) => {
    try { return await offerApi.getProjectOffers(projectId, filters); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const getMyOffersThunk = createAsyncThunk("offers/getMine",
  async (_, { rejectWithValue }) => {
    try { return await offerApi.getMyOffers(); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const updateOfferThunk = createAsyncThunk("offers/update",
  async ({ id, data }, { rejectWithValue }) => {
    try { return await offerApi.updateOffer(id, data); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const deleteOfferThunk = createAsyncThunk("offers/delete",
  async (id, { rejectWithValue }) => {
    try { await offerApi.deleteOffer(id); return id; }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

// ─── Workflow ────────────────────────────────────────────────────────────────

export const sendToCrewThunk = createAsyncThunk("offers/sendToCrew",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.sendToCrew(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const markViewedThunk = createAsyncThunk("offers/markViewed",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.markViewed(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const crewAcceptThunk = createAsyncThunk("offers/crewAccept",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.crewAccept(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const crewRequestChangesThunk = createAsyncThunk("offers/requestChanges",
  async ({ offerId, ...payload }, { rejectWithValue }) => {
    try { return await offerApi.crewRequestChanges(offerId, payload); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const cancelOfferThunk = createAsyncThunk("offers/cancel",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.cancelOffer(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const moveToProductionCheckThunk = createAsyncThunk("offers/productionCheck",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.moveToProductionCheck(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const moveToAccountsCheckThunk = createAsyncThunk("offers/accountsCheck",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.moveToAccountsCheck(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const moveToPendingCrewSignatureThunk = createAsyncThunk("offers/pendingCrewSig",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.moveToPendingCrewSignature(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const returnToProductionThunk = createAsyncThunk("offers/returnToProduction",
  async ({ offerId, reason }, { rejectWithValue }) => {
    try { return await offerApi.returnToProduction(offerId, reason); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

// ─── Extend Contract ──────────────────────────────────────────────────────────

export const extendContractThunk = createAsyncThunk("offers/extend",
  async ({ offerId, newEndDate, note }, { rejectWithValue }) => {
    try { return await offerApi.extendContract(offerId, { newEndDate, note }); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

// ─── Clone Offer ──────────────────────────────────────────────────────────────

export const cloneOfferThunk = createAsyncThunk("offers/clone",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.cloneOffer(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

// ─── Toggle Contract Lock ─────────────────────────────────────────────────────
// Returns { isLocked: boolean } — NOT the full offer.
// The slice handles this separately via its own fulfilled case.

export const toggleContractLockThunk = createAsyncThunk("offers/toggleLock",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.toggleContractLock(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

// ─── Signing ─────────────────────────────────────────────────────────────────

const makeSignThunk = (name, apiFn) =>
  createAsyncThunk(`offers/${name}`,
    async ({ contractId, signature }, { rejectWithValue }) => {
      try { return await apiFn(contractId, signature); }
      catch (e) { return rejectWithValue(normalizeError(e)); }
    }
  );

export const crewSignThunk   = makeSignThunk("crewSign",   offerApi.crewSign);
export const upmSignThunk    = makeSignThunk("upmSign",    offerApi.upmSign);
export const fcSignThunk     = makeSignThunk("fcSign",     offerApi.fcSign);
export const studioSignThunk = makeSignThunk("studioSign", offerApi.studioSign);

// ─── Contract ────────────────────────────────────────────────────────────────

export const getSigningStatusThunk = createAsyncThunk("offers/getSigningStatus",
  async (contractId, { rejectWithValue }) => {
    try { return await offerApi.getSigningStatus(contractId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const getContractPreviewThunk = createAsyncThunk("offers/getContractPreview",
  async (contractId, { rejectWithValue }) => {
    try { return await offerApi.getContractPreview(contractId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const getContractPdfUrlThunk = createAsyncThunk("offers/getContractPdfUrl",
  async (contractId, { rejectWithValue }) => {
    try { return await offerApi.getContractPdfUrl(contractId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

// ─── Change Requests ─────────────────────────────────────────────────────────

export const getChangeRequestsThunk = createAsyncThunk("offers/getChangeRequests",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.getChangeRequests(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const resolveChangeRequestThunk = createAsyncThunk("offers/resolveChangeRequest",
  async ({ offerId, changeRequestId, status, notes }, { rejectWithValue }) => {
    try { return await offerApi.resolveChangeRequest(offerId, changeRequestId, status, notes); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

// ─── Grouped exports for slice builders ──────────────────────────────────────
// NOTE: toggleContractLockThunk is NOT in workflowThunks because it returns
// { isLocked } not a full offer — it has its own extraReducer case in the slice.

export const workflowThunks = [
  sendToCrewThunk,
  markViewedThunk,
  crewAcceptThunk,
  crewRequestChangesThunk,
  cancelOfferThunk,
  moveToProductionCheckThunk,
  moveToAccountsCheckThunk,
  moveToPendingCrewSignatureThunk,
  returnToProductionThunk,
  extendContractThunk,
  cloneOfferThunk,
];

export const signThunks = [
  crewSignThunk,
  upmSignThunk,
  fcSignThunk,
  studioSignThunk,
];