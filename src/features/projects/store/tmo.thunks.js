import { createAsyncThunk } from "@reduxjs/toolkit";
import { createTmoAPI, getTmosAPI, updateTmoAPI, deleteTmoAPI } from "../service/tmo.service";

export const getTmos = createAsyncThunk(
  "tmo/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getTmosAPI();
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to get TMOs");
    }
  }
);

export const createTmo = createAsyncThunk(
  "tmo/create",
  async (formData, { rejectWithValue }) => {
    try {
      return await createTmoAPI(formData);
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to create TMO");
    }
  }
);

export const updateTmo = createAsyncThunk(
  "tmo/update",
  async ({ tmoId, formData }, { rejectWithValue }) => {
    try {
      return await updateTmoAPI(tmoId, formData);
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update TMO");
    }
  }
);

export const deleteTmo = createAsyncThunk(
  "tmo/delete",
  async (tmoId, { rejectWithValue }) => {
    try {
      await deleteTmoAPI(tmoId);
      return tmoId; 
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to delete TMO");
    }
  }
);