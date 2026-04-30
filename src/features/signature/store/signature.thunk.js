import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createSignatureApi,
  sendOtpApi,
  verifyOtpApi,
  getSignatureHistoryApi,
  getCurrentSignatureApi,
} from "../services/signature.service";
import { AddOrUpdateDocument } from "../../user-documents/store/document.slice";

// GET CURRENT SIGNATURE
export const fetchCurrentSignatureThunk = createAsyncThunk(
  "signature/current",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📡 fetchCurrentSignatureThunk called");

      const response = await getCurrentSignatureApi();

      console.log("✅ fetchCurrentSignature success:", response);

      return response;
    } catch (err) {
      console.error(
        "❌ fetchCurrentSignature error:",
        err.response?.data?.message || err.message,
      );

      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: err.response?.data?.errors || null,
      });
    }
  },
);

// CREATE SIGNATURE
export const createSignatureThunk = createAsyncThunk(
  "signature/create",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      console.log("📡 createSignatureThunk called", formData);

      const response = await createSignatureApi(formData);

      console.log("✅ createSignature success:", response);
      const { signature, document } = response;

      if (response) {
        dispatch(
          AddOrUpdateDocument(signature?.signatureDocumentId ?? document),
        );
      }

      return signature;
    } catch (err) {
      console.error(
        "❌ createSignature error:",
        err.response?.data?.message || err.message,
      );

      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: err.response?.data?.errors || null,
      });
    }
  },
);

// SEND OTP
export const sendSignatureOtpThunk = createAsyncThunk(
  "signature/sendOtp",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📡 sendSignatureOtpThunk called");

      const response = await sendOtpApi();

      console.log("✅ sendOtp success:", response);

      return response;
    } catch (err) {
      console.error(
        "❌ sendOtp error:",
        err.response?.data?.message || err.message,
      );

      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: err.response?.data?.errors || null,
      });
    }
  },
);

// VERIFY OTP
export const verifySignatureOtpThunk = createAsyncThunk(
  "signature/verifyOtp",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      console.log("📡 verifySignatureOtpThunk called", payload);

      const response = await verifyOtpApi(payload);

      console.log("✅ verifyOtp success:", response);
      dispatch(
        AddOrUpdateDocument(
          response?.signature?.certificateDocumentId ?? response?.certificate,
        ),
      );

      return response;
    } catch (err) {
      console.error(
        "❌ verifyOtp error:",
        err.response?.data?.message || err.message,
      );

      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: err.response?.data?.errors || null,
      });
    }
  },
);

// HISTORY
export const fetchSignatureHistoryThunk = createAsyncThunk(
  "signature/history",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📡 fetchSignatureHistoryThunk called");

      const response = await getSignatureHistoryApi();

      console.log("✅ fetchHistory success:", response);

      return response;
    } catch (err) {
      console.error(
        "❌ fetchHistory error:",
        err.response?.data?.message || err.message,
      );

      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: err.response?.data?.errors || null,
      });
    }
  },
);
