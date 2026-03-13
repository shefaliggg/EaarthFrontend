/**
 * contractInstances.slice.js
 * store/contractInstances.slice.js
 *
 * Redux state for contract instances (one per form per offer).
 *
 * FIXES:
 *   1. getContractInstancesThunk — added params: { activeOnly: "true" } so
 *      SUPERSEDED/VOIDED docs are excluded at the API level.
 *   2. getContractInstanceHtmlThunk — always returns { instanceId, html }.
 *      ContractInstancesPanel.DocumentCard previously checked
 *      typeof payload === "string" which was always false. The correct check
 *      is payload?.html (see ContractInstancesPanel.jsx fix).
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../auth/config/axiosConfig";

// ── Role header helper ──────────────────────────────────────────────────────
const rh = () => ({
  "x-view-as-role": localStorage.getItem("viewRole") || "PRODUCTION_ADMIN",
});

// ── Thunks ──────────────────────────────────────────────────────────────────

/**
 * Fetch all contract instances for an offer.
 * Returns array of ContractInstance documents (no htmlContent).
 *
 * FIX: added activeOnly param — matches the offer.api.js helper and avoids
 *      sending SUPERSEDED/VOIDED instances to the frontend unnecessarily.
 */
export const getContractInstancesThunk = createAsyncThunk(
  "contractInstances/getAll",
  async (offerId, { rejectWithValue }) => {
    try {
      const res = await axiosConfig.get(`/offers/${offerId}/contract-instances`, {
        params:  { activeOnly: "true" }, // FIX: was missing
        headers: rh(),
      });
      // Response shape: { success, data: [...], grouped, totalCount }
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Failed to load contract instances" }
      );
    }
  }
);

/**
 * Fetch rendered HTML for a single contract instance.
 * Backend returns raw text/html (NOT JSON).
 *
 * Returns { instanceId, html } — this is the fulfillment payload shape.
 * Callers must check payload?.html (not typeof payload === "string").
 */
export const getContractInstanceHtmlThunk = createAsyncThunk(
  "contractInstances/getHtml",
  async (instanceId, { rejectWithValue }) => {
    try {
      const res = await axiosConfig.get(`/contract-instances/${instanceId}/html`, {
        responseType: "text", // CRITICAL — backend sends raw HTML, not JSON
        headers: rh(),
      });
      const html = typeof res.data === "string" ? res.data : "";
      return { instanceId, html };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Failed to load contract HTML" }
      );
    }
  }
);

/**
 * Update the status of a contract instance.
 * Used for manual status overrides (e.g. void, supersede).
 */
export const updateContractInstanceStatusThunk = createAsyncThunk(
  "contractInstances/updateStatus",
  async ({ instanceId, status }, { rejectWithValue }) => {
    try {
      const res = await axiosConfig.patch(
        `/contract-instances/${instanceId}/status`,
        { status },
        { headers: rh() }
      );
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Failed to update status" }
      );
    }
  }
);

// ── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  // All instances for the currently-viewed offer
  instances: [],

  // Map of instanceId → rendered HTML string
  // { [instanceId]: "<html>...</html>" }
  htmlCache: {},

  // Which instance is currently selected in the sidebar
  selectedInstanceId: null,

  // Loading / error flags
  loading:     false,
  loadingHtml: false,
  error:       null,
  htmlError:   null,

  // The offerId these instances belong to (used to avoid re-fetching)
  currentOfferId: null,
};

const contractInstancesSlice = createSlice({
  name: "contractInstances",
  initialState,

  reducers: {
    setSelectedInstance(state, action) {
      state.selectedInstanceId = action.payload;
    },
    clearInstances(state) {
      state.instances          = [];
      state.htmlCache          = {};
      state.selectedInstanceId = null;
      state.currentOfferId     = null;
      state.error              = null;
      state.htmlError          = null;
    },
    clearHtmlCache(state) {
      state.htmlCache = {};
      state.htmlError = null;
    },
  },

  extraReducers: (builder) => {
    // ── getContractInstancesThunk ──────────────────────────────────────────
    builder
      .addCase(getContractInstancesThunk.pending, (state, action) => {
        state.loading        = true;
        state.error          = null;
        state.currentOfferId = action.meta.arg; // offerId
      })
      .addCase(getContractInstancesThunk.fulfilled, (state, action) => {
        state.loading   = false;
        state.instances = action.payload;

        // Auto-select first active instance if nothing is selected
        if (!state.selectedInstanceId && action.payload.length > 0) {
          const first =
            action.payload.find(
              (i) => i.status !== "SUPERSEDED" && i.status !== "VOIDED"
            ) || action.payload[0];
          state.selectedInstanceId = first._id;
        }
      })
      .addCase(getContractInstancesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload?.message || "Unknown error";
      });

    // ── getContractInstanceHtmlThunk ───────────────────────────────────────
    builder
      .addCase(getContractInstanceHtmlThunk.pending, (state) => {
        state.loadingHtml = true;
        state.htmlError   = null;
      })
      .addCase(getContractInstanceHtmlThunk.fulfilled, (state, action) => {
        state.loadingHtml = false;
        const { instanceId, html } = action.payload;
        state.htmlCache[instanceId] = html;
      })
      .addCase(getContractInstanceHtmlThunk.rejected, (state, action) => {
        state.loadingHtml = false;
        state.htmlError   = action.payload?.message || "Unknown error";
      });

    // ── updateContractInstanceStatusThunk ─────────────────────────────────
    builder
      .addCase(updateContractInstanceStatusThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated?._id) return;
        const idx = state.instances.findIndex((i) => i._id === updated._id);
        if (idx !== -1) state.instances[idx] = { ...state.instances[idx], ...updated };
      });
  },
});

// ── Actions ──────────────────────────────────────────────────────────────────
export const {
  setSelectedInstance,
  clearInstances,
  clearHtmlCache,
} = contractInstancesSlice.actions;

// ── Selectors ────────────────────────────────────────────────────────────────
export const selectInstances          = (s) => s.contractInstances.instances;
export const selectInstancesLoading   = (s) => s.contractInstances.loading;
export const selectInstancesError     = (s) => s.contractInstances.error;
export const selectSelectedInstanceId = (s) => s.contractInstances.selectedInstanceId;
export const selectHtmlCache          = (s) => s.contractInstances.htmlCache;
export const selectLoadingHtml        = (s) => s.contractInstances.loadingHtml;
export const selectHtmlError          = (s) => s.contractInstances.htmlError;
export const selectCurrentOfferId     = (s) => s.contractInstances.currentOfferId;

/** Convenience: HTML for the currently-selected instance */
export const selectSelectedHtml = (s) => {
  const id = s.contractInstances.selectedInstanceId;
  return id ? s.contractInstances.htmlCache[id] ?? null : null;
};

/** Active (non-superseded, non-voided) instances */
export const selectActiveInstances = (s) =>
  s.contractInstances.instances.filter(
    (i) => i.status !== "SUPERSEDED" && i.status !== "VOIDED"
  );

export default contractInstancesSlice.reducer;