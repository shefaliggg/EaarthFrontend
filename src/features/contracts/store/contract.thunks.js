import { createAsyncThunk } from '@reduxjs/toolkit';
import contractApi from '../services/contractApi';

export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async (filters, { rejectWithValue }) => {
    try {
      return await contractApi.getContracts(filters);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchContractById = createAsyncThunk(
  'contracts/fetchContractById',
  async (id, { rejectWithValue }) => {
    try {
      return await contractApi.getContract(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createContract = createAsyncThunk(
  'contracts/createContract',
  async (data, { rejectWithValue }) => {
    try {
      return await contractApi.createContract(data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateContract = createAsyncThunk(
  'contracts/updateContract',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await contractApi.updateContract(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteContract = createAsyncThunk(
  'contracts/deleteContract',
  async (id, { rejectWithValue }) => {
    try {
      await contractApi.deleteContract(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const downloadContractPDF = createAsyncThunk(
  'contracts/downloadPDF',
  async (id, { rejectWithValue }) => {
    try {
      const pdfData = await contractApi.downloadPDF(id);
      return { id, pdfData };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const regenerateContractPDF = createAsyncThunk(
  'contracts/regeneratePDF',
  async (id, { rejectWithValue }) => {
    try {
      const pdfData = await contractApi.regeneratePDF(id);
      return { id, pdfData };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addSignature = createAsyncThunk(
  'contracts/addSignature',
  async ({ id, signatureData }, { rejectWithValue }) => {
    try {
      return await contractApi.addSignature(id, signatureData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchContractStats = createAsyncThunk(
  'contracts/fetchStats',
  async (filters, { rejectWithValue }) => {
    try {
      return await contractApi.getStats(filters);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);