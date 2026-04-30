import { createAsyncThunk } from "@reduxjs/toolkit";
import { archiveDocument, deleteDocument, getDocumentById, getDocuments, restoreDocument, unarchiveDocument } from "../services/document.service";

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

export const archiveDocumentThunk = createAsyncThunk(
  "documents/archive",
  async (id, { rejectWithValue }) => {
    try {
      return await archiveDocument(id); // returns updated doc
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? err.message);
    }
  },
);

export const unarchiveDocumentThunk = createAsyncThunk(
  "documents/unarchive",
  async (id, { rejectWithValue }) => {
    try {
      return await unarchiveDocument(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? err.message);
    }
  },
);

export const deleteDocumentThunk = createAsyncThunk(
  "documents/softDelete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDocument(id);
      return id; // just the id — we'll filter it out in the slice
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? err.message);
    }
  },
);

export const restoreDocumentThunk = createAsyncThunk(
  "documents/restore",
  async (id, { rejectWithValue }) => {
    try {
      return await restoreDocument(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? err.message);
    }
  },
);
