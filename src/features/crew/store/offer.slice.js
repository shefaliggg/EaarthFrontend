/**
 * offer.slice.js
 * Pure slice — state, reducers, and extra reducers only.
 * All thunks live in offer.thunks.js and are re-exported here for convenience.
 */

import { createSlice } from "@reduxjs/toolkit";

import {
  createOfferThunk,
  updateOfferThunk,
  getOfferThunk,
  getProjectOffersThunk,
  getMyOffersThunk,
  deleteOfferThunk,
  getSigningStatusThunk,
  getContractPreviewThunk,
  getContractPdfUrlThunk,
  getChangeRequestsThunk,
  resolveChangeRequestThunk,
  workflowThunks,
  signThunks,
} from "./offer.thunks";

// Re-export everything so consumers only need to import from this file
export * from "./offer.thunks";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const syncOffer = (state, updatedOffer) => {
  if (!updatedOffer?._id) return;
  state.currentOffer = updatedOffer;
  [state.projectOffers, state.myOffers].forEach((list) => {
    const idx = list.findIndex((o) => o._id === updatedOffer._id);
    if (idx !== -1) list[idx] = updatedOffer;
    else if (list === state.projectOffers) list.unshift(updatedOffer);
  });
};

const setPending  = (k) => (state) => { state[k] = true; state.error = null; };
const setRejected = (k) => (state, { payload }) => { state[k] = false; state.error = payload; };

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState = {
  projectOffers:        [],
  myOffers:             [],
  currentOffer:         null,
  changeRequests:       [],
  signingStatus:        null,
  contractPreviewHtml:  null,
  contractPdfUrl:       null,
  isLoadingPreview:     false,
  isLoadingPdfUrl:      false,
  isLoadingList:        false,
  isLoadingOffer:       false,
  isSubmitting:         false,
  error:                null,
  successMessage:       null,
  statusFilter:         "ALL",
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const offerSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    clearOfferError(state)               { state.error = null; },
    clearOfferSuccess(state)             { state.successMessage = null; },
    clearCurrentOffer(state)             { state.currentOffer = null; },
    clearContractPreview(state)          { state.contractPreviewHtml = null; },
    clearContractPdfUrl(state)           { state.contractPdfUrl = null; },
    setStatusFilter(state, { payload })  { state.statusFilter = payload; },
    localUpdateOffer(state, { payload }) { syncOffer(state, payload); },
  },

  extraReducers: (builder) => {

    // ── Create ──────────────────────────────────────────────────────────────
    builder
      .addCase(createOfferThunk.pending,   setPending("isSubmitting"))
      .addCase(createOfferThunk.fulfilled, (state, { payload }) => {
        state.isSubmitting   = false;
        state.currentOffer   = payload;
        state.projectOffers.unshift(payload);
        state.successMessage = "Offer created";
      })
      .addCase(createOfferThunk.rejected, setRejected("isSubmitting"));

    // ── Update ──────────────────────────────────────────────────────────────
    builder
      .addCase(updateOfferThunk.pending,   setPending("isSubmitting"))
      .addCase(updateOfferThunk.fulfilled, (state, { payload }) => {
        state.isSubmitting   = false;
        syncOffer(state, payload);
        state.successMessage = "Offer updated";
      })
      .addCase(updateOfferThunk.rejected, setRejected("isSubmitting"));

    // ── Get one ─────────────────────────────────────────────────────────────
    builder
      .addCase(getOfferThunk.pending,   setPending("isLoadingOffer"))
      .addCase(getOfferThunk.fulfilled, (state, { payload }) => {
        state.isLoadingOffer = false;
        state.currentOffer   = payload;
      })
      .addCase(getOfferThunk.rejected, setRejected("isLoadingOffer"));

    // ── Get project list ────────────────────────────────────────────────────
    builder
      .addCase(getProjectOffersThunk.pending,   setPending("isLoadingList"))
      .addCase(getProjectOffersThunk.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.projectOffers = payload;
      })
      .addCase(getProjectOffersThunk.rejected, setRejected("isLoadingList"));

    // ── Get my offers ───────────────────────────────────────────────────────
    builder
      .addCase(getMyOffersThunk.pending,   setPending("isLoadingList"))
      .addCase(getMyOffersThunk.fulfilled, (state, { payload }) => {
        state.isLoadingList = false;
        state.myOffers      = payload;
      })
      .addCase(getMyOffersThunk.rejected, setRejected("isLoadingList"));

    // ── Delete ──────────────────────────────────────────────────────────────
    builder
      .addCase(deleteOfferThunk.fulfilled, (state, { payload: id }) => {
        state.projectOffers = state.projectOffers.filter((o) => o._id !== id);
        if (state.currentOffer?._id === id) state.currentOffer = null;
        state.successMessage = "Offer deleted";
      })
      .addCase(deleteOfferThunk.rejected, (state, { payload }) => { state.error = payload; });

    // ── Workflow thunks (all share same pattern) ─────────────────────────────
    workflowThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending,   setPending("isSubmitting"))
        .addCase(thunk.fulfilled, (state, { payload }) => {
          state.isSubmitting = false;
          if (payload?._id) {
            syncOffer(state, payload);
            state.successMessage = `Status: ${payload.status}`;
          } else {
            state.successMessage = "Done";
          }
        })
        .addCase(thunk.rejected, (state, { payload }) => {
          state.isSubmitting = false;
          state.error = payload;
        });
    });

    // ── Sign thunks — backend returns { contract, offer } ───────────────────
    signThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, setPending("isSubmitting"))
        .addCase(thunk.fulfilled, (state, { payload }) => {
          state.isSubmitting = false;

          if (payload?.offer?._id) {
            syncOffer(state, payload.offer);
            state.successMessage = "Signature recorded";
          }

          if (payload?.contract?.status && state.currentOffer) {
            state.currentOffer = {
              ...state.currentOffer,
              status: payload.contract.status,
            };
          }

          if (payload?.contract && state.signingStatus) {
            state.signingStatus = {
              ...state.signingStatus,
              pdfS3Key:      payload.contract.pdfS3Key,
              currentStatus: payload.contract.status,
              isLocked:      payload.contract.isLocked,
            };
          }

          state.contractPreviewHtml = null;
          state.contractPdfUrl      = null;
        })
        .addCase(thunk.rejected, (state, { payload }) => {
          state.isSubmitting = false;
          state.error = payload;
        });
    });

    // ── Signing status ───────────────────────────────────────────────────────
    builder
      .addCase(getSigningStatusThunk.pending,   (state) => { state.error = null; })
      .addCase(getSigningStatusThunk.fulfilled, (state, { payload }) => {
        state.signingStatus = payload;
      })
      .addCase(getSigningStatusThunk.rejected,  (state, { payload }) => {
        state.error = payload;
      });

    // ── Contract preview ─────────────────────────────────────────────────────
    builder
      .addCase(getContractPreviewThunk.pending, (state) => {
        state.isLoadingPreview    = true;
        state.contractPreviewHtml = null;
      })
      .addCase(getContractPreviewThunk.fulfilled, (state, { payload }) => {
        state.isLoadingPreview    = false;
        state.contractPreviewHtml = payload;
      })
      .addCase(getContractPreviewThunk.rejected, (state, { payload }) => {
        state.isLoadingPreview = false;
        state.error            = payload;
      });

    // ── Contract PDF URL ─────────────────────────────────────────────────────
    builder
      .addCase(getContractPdfUrlThunk.pending, (state) => {
        state.isLoadingPdfUrl = true;
        state.contractPdfUrl  = null;
      })
      .addCase(getContractPdfUrlThunk.fulfilled, (state, { payload }) => {
        state.isLoadingPdfUrl = false;
        state.contractPdfUrl  = payload?.url ?? null;
      })
      .addCase(getContractPdfUrlThunk.rejected, (state, { payload }) => {
        state.isLoadingPdfUrl = false;
        state.error           = payload;
      });

    // ── Change requests ───────────────────────────────────────────────────────
    builder.addCase(getChangeRequestsThunk.fulfilled, (state, { payload }) => {
      state.changeRequests = payload;
    });

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

// ─── Actions ─────────────────────────────────────────────────────────────────

export const {
  clearOfferError,
  clearOfferSuccess,
  clearCurrentOffer,
  clearContractPreview,
  clearContractPdfUrl,
  setStatusFilter,
  localUpdateOffer,
} = offerSlice.actions;

export default offerSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectProjectOffers       = (s) => s.offers.projectOffers;
export const selectMyOffers            = (s) => s.offers.myOffers;
export const selectCurrentOffer        = (s) => s.offers.currentOffer;
export const selectChangeRequests      = (s) => s.offers.changeRequests;
export const selectSigningStatus       = (s) => s.offers.signingStatus;
export const selectContractPreviewHtml = (s) => s.offers.contractPreviewHtml;
export const selectContractPdfUrl      = (s) => s.offers.contractPdfUrl;
export const selectIsLoadingPreview    = (s) => s.offers.isLoadingPreview;
export const selectIsLoadingPdfUrl     = (s) => s.offers.isLoadingPdfUrl;
export const selectOfferLoading        = (s) => s.offers.isLoadingOffer;
export const selectListLoading         = (s) => s.offers.isLoadingList;
export const selectSubmitting          = (s) => s.offers.isSubmitting;
export const selectOfferError          = (s) => s.offers.error;
export const selectOfferSuccess        = (s) => s.offers.successMessage;
export const selectStatusFilter        = (s) => s.offers.statusFilter;

export const selectFilteredOffers = (s) => {
  const { projectOffers, statusFilter } = s.offers;
  return statusFilter === "ALL"
    ? projectOffers
    : projectOffers.filter((o) => o.status === statusFilter);
};

export const selectContractId = (s) => s.offers.currentOffer?.contractId ?? null;