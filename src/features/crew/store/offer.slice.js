/**
 * offer.slice.js
 *
 * Redux slice for offer state.
 * All network calls go through offer.api.js — no fetch() here.
 *
 * Place at: src/features/offers/store/offer.slice.js
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as offerApi from "../api/offer.api";

// ─── Axios error normalizer ───────────────────────────────────────────────────
// Axios puts the response body in error.response.data, not error itself.
const normalizeError = (e) => ({
  message: e.response?.data?.message || e.message || "Something went wrong",
  errors:  e.response?.data?.errors  || [],
  code:    e.response?.data?.code    || e.response?.data?.errorCode || "UNKNOWN_ERROR",
  status:  e.response?.status,
});

// ─── Thunks ───────────────────────────────────────────────────────────────────

const makeThunk = (name, apiFn) =>
  createAsyncThunk(`offers/${name}`, async (arg, { rejectWithValue }) => {
    try {
      return await apiFn(arg);
    } catch (e) {
      return rejectWithValue(normalizeError(e));
    }
  });

// CRUD
export const createOfferThunk       = createAsyncThunk("offers/create",
  async (payload, { rejectWithValue }) => {
    try { return await offerApi.createOffer(payload); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const getOfferThunk          = createAsyncThunk("offers/getOne",
  async (id, { rejectWithValue }) => {
    try { return await offerApi.getOffer(id); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const getProjectOffersThunk  = createAsyncThunk("offers/getByProject",
  async ({ projectId, filters = {} }, { rejectWithValue }) => {
    try { return await offerApi.getProjectOffers(projectId, filters); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const getMyOffersThunk       = createAsyncThunk("offers/getMine",
  async (_, { rejectWithValue }) => {
    try { return await offerApi.getMyOffers(); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const deleteOfferThunk       = createAsyncThunk("offers/delete",
  async (id, { rejectWithValue }) => {
    try { await offerApi.deleteOffer(id); return id; }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

// Workflow
export const sendToCrewThunk        = createAsyncThunk("offers/sendToCrew",
  async ({ offerId, notes }, { rejectWithValue }) => {
    try { return await offerApi.sendToCrew(offerId, notes); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const markViewedThunk        = createAsyncThunk("offers/markViewed",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.markViewed(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const crewAcceptThunk        = createAsyncThunk("offers/crewAccept",
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

export const cancelOfferThunk       = createAsyncThunk("offers/cancel",
  async ({ offerId, reason }, { rejectWithValue }) => {
    try { return await offerApi.cancelOffer(offerId, reason); }
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

export const crewSignThunk          = createAsyncThunk("offers/crewSign",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.crewSign(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const upmSignThunk           = createAsyncThunk("offers/upmSign",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.upmSign(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const fcSignThunk            = createAsyncThunk("offers/fcSign",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.fcSign(offerId); }
    catch (e) { return rejectWithValue(normalizeError(e)); }
  }
);

export const studioSignThunk        = createAsyncThunk("offers/studioSign",
  async (offerId, { rejectWithValue }) => {
    try { return await offerApi.studioSign(offerId); }
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

/** Sync updated offer into all lists */
const syncOffer = (state, updatedOffer) => {
  state.currentOffer = updatedOffer;
  const sync = (list) => {
    const idx = list.findIndex((o) => o._id === updatedOffer._id);
    if (idx !== -1) list[idx] = updatedOffer;
  };
  sync(state.projectOffers);
  sync(state.myOffers);
};

const pending   = (loadingKey) => (state) => { state[loadingKey] = true;  state.error = null; };
const rejected  = (loadingKey) => (state, { payload }) => { state[loadingKey] = false; state.error = payload; };

// All thunks that return an updated offer
const workflowThunks = [
  sendToCrewThunk, markViewedThunk, crewAcceptThunk, crewRequestChangesThunk,
  cancelOfferThunk, moveToProductionCheckThunk, moveToAccountsCheckThunk,
  moveToPendingCrewSignatureThunk, crewSignThunk, upmSignThunk, fcSignThunk, studioSignThunk,
];

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState = {
  projectOffers:  [],
  myOffers:       [],
  currentOffer:   null,
  changeRequests: [],

  isLoadingList:  false,
  isLoadingOffer: false,
  isSubmitting:   false,

  error:          null,   // { message, errors, code }
  successMessage: null,

  statusFilter:   "ALL",
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const offerSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    clearOfferError(state)            { state.error = null; },
    clearOfferSuccess(state)          { state.successMessage = null; },
    clearCurrentOffer(state)          { state.currentOffer = null; },
    setStatusFilter(state, { payload }) { state.statusFilter = payload; },
  },

  extraReducers: (builder) => {

    // ── createOffer ──────────────────────────────────────────────────────────
    builder
      .addCase(createOfferThunk.pending,    pending("isSubmitting"))
      .addCase(createOfferThunk.fulfilled, (state, { payload }) => {
        state.isSubmitting  = false;
        state.currentOffer  = payload;
        state.projectOffers.unshift(payload);
        state.successMessage = "Offer created as draft";
      })
      .addCase(createOfferThunk.rejected,   rejected("isSubmitting"));

    // ── getOffer ─────────────────────────────────────────────────────────────
    builder
      .addCase(getOfferThunk.pending,    pending("isLoadingOffer"))
      .addCase(getOfferThunk.fulfilled, (state, { payload }) => {
        state.isLoadingOffer = false;
        state.currentOffer   = payload;
      })
      .addCase(getOfferThunk.rejected,   rejected("isLoadingOffer"));

    // ── getProjectOffers ─────────────────────────────────────────────────────
    builder
      .addCase(getProjectOffersThunk.pending,    pending("isLoadingList"))
      .addCase(getProjectOffersThunk.fulfilled, (state, { payload }) => {
        state.isLoadingList  = false;
        state.projectOffers  = payload;
      })
      .addCase(getProjectOffersThunk.rejected,   rejected("isLoadingList"));

    // ── getMyOffers ──────────────────────────────────────────────────────────
    builder
      .addCase(getMyOffersThunk.pending,    pending("isLoadingList"))
      .addCase(getMyOffersThunk.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.myOffers      = payload;
      })
      .addCase(getMyOffersThunk.rejected,   rejected("isLoadingList"));

    // ── deleteOffer ──────────────────────────────────────────────────────────
    builder
      .addCase(deleteOfferThunk.fulfilled, (state, { payload: id }) => {
        state.projectOffers = state.projectOffers.filter((o) => o._id !== id);
        if (state.currentOffer?._id === id) state.currentOffer = null;
        state.successMessage = "Offer deleted";
      })
      .addCase(deleteOfferThunk.rejected, (state, { payload }) => { state.error = payload; });

    // ── All workflow thunks ───────────────────────────────────────────────────
    workflowThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, pending("isSubmitting"))
        .addCase(thunk.fulfilled, (state, { payload }) => {
          state.isSubmitting = false;
          if (payload?._id) {
            // Offer returned
            syncOffer(state, payload);
            state.successMessage = `Status updated: ${payload.status}`;
          } else {
            // ChangeRequest or other doc returned
            state.successMessage = "Done";
          }
        })
        .addCase(thunk.rejected, (state, { payload }) => {
          state.isSubmitting = false;
          state.error = payload;
        });
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

export const { clearOfferError, clearOfferSuccess, clearCurrentOffer, setStatusFilter } = offerSlice.actions;
export default offerSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectProjectOffers  = (s) => s.offers.projectOffers;
export const selectMyOffers       = (s) => s.offers.myOffers;
export const selectCurrentOffer   = (s) => s.offers.currentOffer;
export const selectChangeRequests = (s) => s.offers.changeRequests;
export const selectOfferLoading   = (s) => s.offers.isLoadingOffer;
export const selectListLoading    = (s) => s.offers.isLoadingList;
export const selectSubmitting     = (s) => s.offers.isSubmitting;
export const selectOfferError     = (s) => s.offers.error;
export const selectOfferSuccess   = (s) => s.offers.successMessage;
export const selectStatusFilter   = (s) => s.offers.statusFilter;

export const selectFilteredOffers = (s) => {
  const { projectOffers, statusFilter } = s.offers;
  return statusFilter === "ALL" ? projectOffers : projectOffers.filter((o) => o.status === statusFilter);
};