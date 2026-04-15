import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDocumentsThunk, fetchDocumentByIdThunk } from "./document.thunk";

const documentSlice = createSlice({
  name: "documents",
  initialState: {
    userDocuments: null,
    isFetching: false,
    isFetchingById: false,
    error: null,
  },
  reducers: {
    AddOrUpdateDocument: (state, action) => {
      const doc = action.payload;

      if (!state.userDocuments) {
        state.userDocuments = [doc];
        return;
      }

      const index = state.userDocuments.findIndex((d) => d._id === doc._id);

      if (index !== -1) {
        state.userDocuments[index] = doc; // replace
      } else {
        state.userDocuments.unshift(doc); // add new
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentsThunk.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchDocumentsThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.userDocuments = action.payload;
      })
      .addCase(fetchDocumentsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })

      .addCase(fetchDocumentByIdThunk.pending, (state) => {
        state.isFetchingById = true;
      })
      .addCase(fetchDocumentByIdThunk.fulfilled, (state, action) => {
        state.isFetchingById = false;
        state.userDocuments = action.payload;
      })
      .addCase(fetchDocumentByIdThunk.rejected, (state, action) => {
        state.isFetchingById = false;
        state.error = action.payload;
      });
  },
});

export const { AddOrUpdateDocument } = documentSlice.actions;
export default documentSlice.reducer;
