import { createSlice } from "@reduxjs/toolkit";
import {
  createSignatureThunk,
  sendSignatureOtpThunk,
  verifySignatureOtpThunk,
  fetchSignatureHistoryThunk,
  fetchCurrentSignatureThunk,
} from "./signature.thunk";

const initialState = {
  currentSignature: null,
  history: [],

  isFetching: false,
  isCreating: false,
  isSendingOtp: false,
  isVerifying: false,

  otpSent: false,
  verified: false,

  error: null,
};

const signatureSlice = createSlice({
  name: "signature",
  initialState,
  reducers: {
    clearSignatureError(state) {
      state.error = null;
    },
    resetSignatureState(state) {
      state.otpSent = false;
      state.verified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentSignatureThunk.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchCurrentSignatureThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentSignature = action.payload;
      })
      .addCase(fetchCurrentSignatureThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createSignatureThunk.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createSignatureThunk.fulfilled, (state, action) => {
        state.isCreating = false;
        state.currentSignature = action.payload;
      })
      .addCase(createSignatureThunk.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })

      // SEND OTP
      .addCase(sendSignatureOtpThunk.pending, (state) => {
        state.isSendingOtp = true;
      })
      .addCase(sendSignatureOtpThunk.fulfilled, (state) => {
        state.isSendingOtp = false;
        state.otpSent = true;
      })
      .addCase(sendSignatureOtpThunk.rejected, (state, action) => {
        state.isSendingOtp = false;
        state.error = action.payload;
      })

      // VERIFY OTP
      .addCase(verifySignatureOtpThunk.pending, (state) => {
        state.isVerifying = true;
      })
      .addCase(verifySignatureOtpThunk.fulfilled, (state, action) => {
        state.isVerifying = false;
        state.verified = true;
        state.currentSignature = action.payload.signature;
      })
      .addCase(verifySignatureOtpThunk.rejected, (state, action) => {
        state.isVerifying = false;
        state.error = action.payload;
      })

      // HISTORY
      .addCase(fetchSignatureHistoryThunk.fulfilled, (state, action) => {
        state.history = action.payload;
      });
  },
});

export const { clearSignatureError, resetSignatureState } =
  signatureSlice.actions;

export const selectProfileSignatureUrl = (state) =>
  state.signature.currentSignature?.signatureUrl ?? null;

export default signatureSlice.reducer;
