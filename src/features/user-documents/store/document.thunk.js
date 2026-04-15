import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDocumentById, getDocuments } from "../services/document.service";

export const fetchDocumentsThunk = createAsyncThunk(
  "documents/fetchDocuments",
  async (params, { rejectWithValue }) => {
    try {
        const response = await getDocuments(params);
        console.log("✅ fetchDocumentsThunk success:", response);
        return response;
    } catch (err) {
      console.error("❌ fetchDocumentsThunk error:", err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchDocumentByIdThunk = createAsyncThunk(
  "documents/fetchDocumentById",
  async (id, { rejectWithValue }) => {
    try {
        const response = await getDocumentById(id);
        console.log("✅ fetchDocumentByIdThunk success:", response);
        return response;
    } catch (err) {
        console.error("❌ fetchDocumentByIdThunk error:", err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);
