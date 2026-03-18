import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../auth/config/axiosConfig";

const rh = () => ({
  "x-view-as-role": localStorage.getItem("viewRole") || "PRODUCTION_ADMIN",
});

// ── Thunks ──────────────────────────────────────────────────────────────────

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

// ── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  instances:           [],
  htmlCache:           {},
  selectedInstanceId:  null,
  loading:             false,
  loadingHtml:         false,
  error:               null,
  htmlError:           null,
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
    },
    clearHtmlCache(state) {
      state.htmlCache = {};
      state.htmlError = null;
    },
  },

  extraReducers: (builder) => {
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

    builder
      .addCase(updateContractInstanceStatusThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated?._id) return;
        const idx = state.instances.findIndex((i) => i._id === updated._id);
        if (idx !== -1) state.instances[idx] = { ...state.instances[idx], ...updated };
      });
  },
});

export const {
  setSelectedInstance,
  clearInstances,
  clearHtmlCache,
} = contractInstancesSlice.actions;

export const selectInstances          = (s) => s.contractInstances.instances;
export const selectInstancesLoading   = (s) => s.contractInstances.loading;
export const selectInstancesError     = (s) => s.contractInstances.error;
export const selectSelectedInstanceId = (s) => s.contractInstances.selectedInstanceId;
export const selectHtmlCache          = (s) => s.contractInstances.htmlCache;
export const selectLoadingHtml        = (s) => s.contractInstances.loadingHtml;
export const selectHtmlError          = (s) => s.contractInstances.htmlError;
export const selectCurrentOfferId     = (s) => s.contractInstances.currentOfferId;

export const selectSelectedHtml = (s) => {
  const id = s.contractInstances.selectedInstanceId;
  return id ? s.contractInstances.htmlCache[id] ?? null : null;
};

export const selectActiveInstances = (s) =>
  s.contractInstances.instances.filter(
    (i) => i.status !== "SUPERSEDED" && i.status !== "VOIDED"
  );

export default contractInstancesSlice.reducer;