/**
 * offer.slice.js  (UPDATED)
 *
 * Changes from original:
 *  - crewSignThunk / upmSignThunk / fcSignThunk / studioSignThunk
 *    now accept { offerId, signature } so the canvas data URL is sent to backend.
 *  - moveToProductionCheckThunk / moveToAccountsCheckThunk /
 *    moveToPendingCrewSignatureThunk now call correct API functions.
 *  - signingStatus state added (tracks per-offer signing progress).
 *  - getSigningStatusThunk added.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as offerApi from "../api/offer.api";

// ─── Error normalizer ─────────────────────────────────────────────────────────
const normalizeError = (e) => ({
  message: e.response?.data?.message || e.message || "Something went wrong",
  errors:  e.response?.data?.errors  || [],
  code:    e.response?.data?.code    || "UNKNOWN_ERROR",
  status:  e.response?.status,
});

// ─── THUNKS ───────────────────────────────────────────────────────────────────

// CRUD
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

export const deleteOfferThunk = createAsyncThunk("offers/delete",
  async (id, { rejectWithValue }) => {
    try { await offerApi.deleteOffer(id); return id; }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

// Workflow
export const sendToCrewThunk = createAsyncThunk("offers/sendToCrew",
  async ({ offerId }, { rejectWithValue }) => {
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
  async ({ offerId }, { rejectWithValue }) => {
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

// ─── SIGNING THUNKS ───────────────────────────────────────────────────────────
// Each accepts { offerId, signature } where signature is the base64 canvas data URL.
// The backend role check is done via the X-View-As-Role header (demo)
// or the user's real JWT role (production).

export const crewSignThunk = createAsyncThunk("offers/crewSign",
  async ({ offerId, signature }, { rejectWithValue }) => {
    try { return await offerApi.crewSign(offerId, signature); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const upmSignThunk = createAsyncThunk("offers/upmSign",
  async ({ offerId, signature }, { rejectWithValue }) => {
    try { return await offerApi.upmSign(offerId, signature); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const fcSignThunk = createAsyncThunk("offers/fcSign",
  async ({ offerId, signature }, { rejectWithValue }) => {
    try { return await offerApi.fcSign(offerId, signature); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const studioSignThunk = createAsyncThunk("offers/studioSign",
  async ({ offerId, signature }, { rejectWithValue }) => {
    try { return await offerApi.studioSign(offerId, signature); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const getSigningStatusThunk = createAsyncThunk("offers/getSigningStatus",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.getSigningStatus(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

// Change requests
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const syncOffer = (state, updatedOffer) => {
  state.currentOffer = updatedOffer;
  [state.projectOffers, state.myOffers].forEach((list) => {
    const idx = list.findIndex((o) => o._id === updatedOffer._id);
    if (idx !== -1) list[idx] = updatedOffer;
  });
};

const setPending  = (loadingKey) => (state) => { state[loadingKey] = true;  state.error = null; };
const setRejected = (loadingKey) => (state, { payload }) => { state[loadingKey] = false; state.error = payload; };

const workflowThunks = [
  sendToCrewThunk, markViewedThunk, crewAcceptThunk, crewRequestChangesThunk,
  cancelOfferThunk, moveToProductionCheckThunk, moveToAccountsCheckThunk,
  moveToPendingCrewSignatureThunk,
  crewSignThunk, upmSignThunk, fcSignThunk, studioSignThunk,
];

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState = {
  projectOffers:  [],
  myOffers:       [],
  currentOffer:   null,
  changeRequests: [],
  signingStatus:  null,   // { offerId, currentStatus, signatories: [{role, signed, signedAt}] }

  isLoadingList:  false,
  isLoadingOffer: false,
  isSubmitting:   false,

  error:          null,
  successMessage: null,
  statusFilter:   "ALL",
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const offerSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    clearOfferError(state)               { state.error = null; },
    clearOfferSuccess(state)             { state.successMessage = null; },
    clearCurrentOffer(state)             { state.currentOffer = null; },
    setStatusFilter(state, { payload })  { state.statusFilter = payload; },
  },

  extraReducers: (builder) => {

    // ── createOffer ──────────────────────────────────────────────────────────
    builder
      .addCase(createOfferThunk.pending,   setPending("isSubmitting"))
      .addCase(createOfferThunk.fulfilled, (state, { payload }) => {
        state.isSubmitting   = false;
        state.currentOffer   = payload;
        state.projectOffers.unshift(payload);
        state.successMessage = "Offer created";
      })
      .addCase(createOfferThunk.rejected,  setRejected("isSubmitting"));

    // ── getOffer ─────────────────────────────────────────────────────────────
    builder
      .addCase(getOfferThunk.pending,   setPending("isLoadingOffer"))
      .addCase(getOfferThunk.fulfilled, (state, { payload }) => {
        state.isLoadingOffer = false;
        state.currentOffer   = payload;
      })
      .addCase(getOfferThunk.rejected,  setRejected("isLoadingOffer"));

    // ── getProjectOffers ─────────────────────────────────────────────────────
    builder
      .addCase(getProjectOffersThunk.pending,   setPending("isLoadingList"))
      .addCase(getProjectOffersThunk.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.projectOffers = payload;
      })
      .addCase(getProjectOffersThunk.rejected,  setRejected("isLoadingList"));

    // ── getMyOffers ──────────────────────────────────────────────────────────
    builder
      .addCase(getMyOffersThunk.pending,   setPending("isLoadingList"))
      .addCase(getMyOffersThunk.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.myOffers      = payload;
      })
      .addCase(getMyOffersThunk.rejected,  setRejected("isLoadingList"));

    // ── deleteOffer ──────────────────────────────────────────────────────────
    builder
      .addCase(deleteOfferThunk.fulfilled, (state, { payload: id }) => {
        state.projectOffers = state.projectOffers.filter((o) => o._id !== id);
        if (state.currentOffer?._id === id) state.currentOffer = null;
        state.successMessage = "Offer deleted";
      })
      .addCase(deleteOfferThunk.rejected, (state, { payload }) => { state.error = payload; });

    // ── All workflow thunks (all return updatedOffer) ─────────────────────────
    workflowThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending,   setPending("isSubmitting"))
        .addCase(thunk.fulfilled, (state, { payload }) => {
          state.isSubmitting = false;
          if (payload?._id) {
            syncOffer(state, payload);
            state.successMessage = `Status: ${payload.status}`;
          } else {
            // crewRequestChanges returns a ChangeRequest, not an Offer
            state.successMessage = "Done";
          }
        })
        .addCase(thunk.rejected, (state, { payload }) => {
          state.isSubmitting = false;
          state.error = payload;
        });
    });

    // ── getSigningStatus ──────────────────────────────────────────────────────
    builder
      .addCase(getSigningStatusThunk.fulfilled, (state, { payload }) => {
        state.signingStatus = payload;
      });

    // ── getChangeRequests ─────────────────────────────────────────────────────
    builder
      .addCase(getChangeRequestsThunk.fulfilled, (state, { payload }) => {
        state.changeRequests = payload;
      });

    // ── resolveChangeRequest ──────────────────────────────────────────────────
    builder
      .addCase(resolveChangeRequestThunk.fulfilled, (state, { payload }) => {
        const idx = state.changeRequests.findIndex((c) => c._id === payload._id);
        if (idx !== -1) state.changeRequests[idx] = payload;
        state.successMessage = `Change request ${payload.status.toLowerCase()}`;
      })
      .addCase(resolveChangeRequestThunk.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const {
  clearOfferError, clearOfferSuccess, clearCurrentOffer, setStatusFilter,
} = offerSlice.actions;

export default offerSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectProjectOffers  = (s) => s.offers.projectOffers;
export const selectMyOffers       = (s) => s.offers.myOffers;
export const selectCurrentOffer   = (s) => s.offers.currentOffer;
export const selectChangeRequests = (s) => s.offers.changeRequests;
export const selectSigningStatus  = (s) => s.offers.signingStatus;
export const selectOfferLoading   = (s) => s.offers.isLoadingOffer;
export const selectListLoading    = (s) => s.offers.isLoadingList;
export const selectSubmitting     = (s) => s.offers.isSubmitting;
export const selectOfferError     = (s) => s.offers.error;
export const selectOfferSuccess   = (s) => s.offers.successMessage;
export const selectStatusFilter   = (s) => s.offers.statusFilter;

export const selectFilteredOffers = (s) => {
  const { projectOffers, statusFilter } = s.offers;
  return statusFilter === "ALL"
    ? projectOffers
    : projectOffers.filter((o) => o.status === statusFilter);
};