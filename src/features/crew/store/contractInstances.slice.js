/**
 * contractInstances.slice.js
 *
 * FIXES APPLIED:
 *   1. signContractInstanceThunk now accepts { instanceId, signatureImage }
 *      instead of just instanceId — so the signature image is actually sent
 *      to the backend instead of being silently discarded.
 *   2. signContractInstanceThunk.fulfilled patches instance in-place (optimistic
 *      update) so the UI reflects the signed state immediately without a full refetch.
 *   3. getContractInstanceHtmlThunk.fulfilled always overwrites the cache entry
 *      so stale HTML (without the new signature) is never shown.
 *   4. All selectors exported cleanly.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../auth/config/axiosConfig";

const rh = () => ({
  "x-view-as-role": localStorage.getItem("viewRole") || "PRODUCTION_ADMIN",
});

// ── Thunks ────────────────────────────────────────────────────────────────────

export const getContractInstancesThunk = createAsyncThunk(
  "contractInstances/getAll",
  async (offerId, { rejectWithValue }) => {
    try {
      const res = await axiosConfig.get(`/offers/${offerId}/contract-instances`, {
        params:  { activeOnly: "true" },
        headers: rh(),
      });
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Failed to load contract instances" }
      );
    }
  }
);

export const getContractInstanceHtmlThunk = createAsyncThunk(
  "contractInstances/getHtml",
  async (instanceId, { rejectWithValue }) => {
    try {
      const res = await axiosConfig.get(`/contract-instances/${instanceId}/html`, {
        responseType: "text",
        headers: rh(),
        params: { _t: Date.now() },
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

// ── FIX 1: signContractInstanceThunk ─────────────────────────────────────────
// Previously received only `instanceId` (a plain string) so signatureImage
// passed by the caller was silently discarded and the backend received {}.
//
// Now receives { instanceId, signatureImage } so the base64 image is forwarded.
// signatureImage is optional — if absent the backend falls back to the user's
// stored IdentitySignature (same behaviour as before for the old dialog flow).

export const signContractInstanceThunk = createAsyncThunk(
  "contractInstances/sign",
  async ({ instanceId, signatureImage } = {}, { rejectWithValue }) => {
    if (!instanceId) {
      return rejectWithValue({ message: "instanceId is required" });
    }
    try {
      const body = signatureImage ? { signatureImage } : {};
      const res = await axiosConfig.patch(
        `/contract-instances/${instanceId}/sign`,
        body,
        { headers: rh() }
      );
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Failed to sign document" }
      );
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  instances:           [],
  htmlCache:           {},
  selectedInstanceId:  null,
  loading:             false,
  loadingHtml:         false,
  signing:             false,
  error:               null,
  htmlError:           null,
  signError:           null,
  currentOfferId:      null,
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
      state.signError          = null;
    },
    clearHtmlCache(state) {
      state.htmlCache = {};
      state.htmlError = null;
    },
  },

  extraReducers: (builder) => {
    // ── Get all instances ──────────────────────────────────────────────────
    builder
      .addCase(getContractInstancesThunk.pending, (state, action) => {
        state.loading        = true;
        state.error          = null;
        state.currentOfferId = action.meta.arg;
      })
      .addCase(getContractInstancesThunk.fulfilled, (state, action) => {
        state.loading   = false;
        state.instances = action.payload;

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

    // ── Get HTML ───────────────────────────────────────────────────────────
    builder
      .addCase(getContractInstanceHtmlThunk.pending, (state) => {
        state.loadingHtml = true;
        state.htmlError   = null;
      })
      .addCase(getContractInstanceHtmlThunk.fulfilled, (state, action) => {
        state.loadingHtml = false;
        const { instanceId, html } = action.payload;
        // Always overwrite — ensures fresh HTML with latest signatures
        state.htmlCache[instanceId] = html;
      })
      .addCase(getContractInstanceHtmlThunk.rejected, (state, action) => {
        state.loadingHtml = false;
        state.htmlError   = action.payload?.message || "Unknown error";
      });

    // ── Update status ──────────────────────────────────────────────────────
    builder
      .addCase(updateContractInstanceStatusThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated?._id) return;
        const idx = state.instances.findIndex((i) => i._id === updated._id);
        if (idx !== -1) state.instances[idx] = { ...state.instances[idx], ...updated };
      });

    // ── Sign instance ──────────────────────────────────────────────────────
    builder
      .addCase(signContractInstanceThunk.pending, (state) => {
        state.signing   = true;
        state.signError = null;
      })
      .addCase(signContractInstanceThunk.fulfilled, (state, action) => {
        state.signing = false;
        const updated = action.payload;
        if (!updated?._id) return;

        // Optimistic patch — update instance immediately in Redux so the UI
        // reflects the signed state without waiting for a full refetch
        const idx = state.instances.findIndex((i) => i._id === updated._id);
        if (idx !== -1) {
          state.instances[idx] = { ...state.instances[idx], ...updated };
        }

        // Evict stale HTML from cache so next render fetches fresh HTML
        // with the newly embedded signature image
        if (state.htmlCache[updated._id]) {
          delete state.htmlCache[updated._id];
        }
      })
      .addCase(signContractInstanceThunk.rejected, (state, action) => {
        state.signing   = false;
        state.signError = action.payload?.message || "Failed to sign";
      });
  },
});

export const {
  setSelectedInstance,
  clearInstances,
  clearHtmlCache,
} = contractInstancesSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectInstances          = (s) => s.contractInstances.instances;
export const selectInstancesLoading   = (s) => s.contractInstances.loading;
export const selectInstancesError     = (s) => s.contractInstances.error;
export const selectSelectedInstanceId = (s) => s.contractInstances.selectedInstanceId;
export const selectHtmlCache          = (s) => s.contractInstances.htmlCache;
export const selectLoadingHtml        = (s) => s.contractInstances.loadingHtml;
export const selectHtmlError          = (s) => s.contractInstances.htmlError;
export const selectCurrentOfferId     = (s) => s.contractInstances.currentOfferId;
export const selectInstancesSigning   = (s) => s.contractInstances.signing;
export const selectInstancesSignError = (s) => s.contractInstances.signError;

export const selectSelectedHtml = (s) => {
  const id = s.contractInstances.selectedInstanceId;
  return id ? s.contractInstances.htmlCache[id] ?? null : null;
};

export const selectActiveInstances = (s) =>
  s.contractInstances.instances.filter(
    (i) => i.status !== "SUPERSEDED" && i.status !== "VOIDED"
  );

export default contractInstancesSlice.reducer;