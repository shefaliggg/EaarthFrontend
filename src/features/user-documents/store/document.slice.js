import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDocumentsThunk, fetchDocumentByIdThunk, archiveDocumentThunk, unarchiveDocumentThunk, deleteDocumentThunk, restoreDocumentThunk } from "./document.thunk";
import { removeDoc, upsertDoc } from "./document.selector";

const documentSlice = createSlice({
  name: "documents",
  initialState: {
    userDocuments: null,
    isFetching: false,
    isFetchingById: false,

    archiving: {},
    unarchiving: {},
    deleting: {},
    restoring: {},

    error: null,
    actionError: null,
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

    clearActionError(state) {
      state.actionError = null;
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

    // ── Archive ────────────────────────────────────────────────────────────
    builder
      .addCase(archiveDocumentThunk.pending, (state, action) => {
        state.archiving[action.meta.arg] = true;
        state.actionError = null;
      })
      .addCase(archiveDocumentThunk.fulfilled, (state, action) => {
        delete state.archiving[action.meta.arg];
        // Server returns the updated doc — replace it in the list
        upsertDoc(state.userDocuments, action.payload);
      })
      .addCase(archiveDocumentThunk.rejected, (state, action) => {
        delete state.archiving[action.meta.arg];
        state.actionError = action.payload;
      });

    // ── Unarchive ──────────────────────────────────────────────────────────
    builder
      .addCase(unarchiveDocumentThunk.pending, (state, action) => {
        state.unarchiving[action.meta.arg] = true;
        state.actionError = null;
      })
      .addCase(unarchiveDocumentThunk.fulfilled, (state, action) => {
        delete state.unarchiving[action.meta.arg];
        upsertDoc(state.userDocuments, action.payload);
      })
      .addCase(unarchiveDocumentThunk.rejected, (state, action) => {
        delete state.unarchiving[action.meta.arg];
        state.actionError = action.payload;
      });

    // ── Soft Delete ────────────────────────────────────────────────────────
    builder
      .addCase(deleteDocumentThunk.pending, (state, action) => {
        state.deleting[action.meta.arg] = true;
        state.actionError = null;
      })
      .addCase(deleteDocumentThunk.fulfilled, (state, action) => {
        delete state.deleting[action.meta.arg];
        // Remove it from the visible list (it's now isDeleted:true server-side)
        state.userDocuments = removeDoc(state.userDocuments, action.payload);
      })
      .addCase(deleteDocumentThunk.rejected, (state, action) => {
        delete state.deleting[action.meta.arg];
        state.actionError = action.payload;
      });

    // ── Restore ────────────────────────────────────────────────────────────
    builder
      .addCase(restoreDocumentThunk.pending, (state, action) => {
        state.restoring[action.meta.arg] = true;
        state.actionError = null;
      })
      .addCase(restoreDocumentThunk.fulfilled, (state, action) => {
        delete state.restoring[action.meta.arg];
        upsertDoc(state.userDocuments, action.payload);
      })
      .addCase(restoreDocumentThunk.rejected, (state, action) => {
        delete state.restoring[action.meta.arg];
        state.actionError = action.payload;
      });
  },
});

export const { AddOrUpdateDocument, clearActionError } = documentSlice.actions;
export default documentSlice.reducer;
