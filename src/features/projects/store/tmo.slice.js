import { createSlice } from "@reduxjs/toolkit";
import { createTmo, getTmos, updateTmo, deleteTmo } from "./tmo.thunks"; 

const initialState = {
  list: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false, 
  isDeleting: false, 
  error: null,
  successMessage: null,
};

const tmoSlice = createSlice({
  name: "tmo",
  initialState,
  reducers: {
    clearTmoMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get
      .addCase(getTmos.pending, (state) => { state.isLoading = true; })
      .addCase(getTmos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(getTmos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // create
      .addCase(createTmo.pending, (state) => { state.isCreating = true; })
      .addCase(createTmo.fulfilled, (state, action) => {
        state.isCreating = false;
        state.list.unshift(action.payload);
        state.successMessage = "TMO created successfully";
      })
      .addCase(createTmo.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })

      .addCase(updateTmo.pending, (state) => { state.isUpdating = true; })
      .addCase(updateTmo.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.successMessage = "TMO updated successfully";
      })
      .addCase(updateTmo.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })

      .addCase(deleteTmo.pending, (state) => { state.isDeleting = true; })
      .addCase(deleteTmo.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.list = state.list.filter((t) => t._id !== action.payload);
        state.successMessage = "TMO deleted successfully";
      })
      .addCase(deleteTmo.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearTmoMessages } = tmoSlice.actions;
export default tmoSlice.reducer;