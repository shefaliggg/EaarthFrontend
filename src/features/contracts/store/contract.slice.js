import { createSlice } from '@reduxjs/toolkit';
import {
  fetchContracts,
  fetchContractById,
  createContract,
  updateContract,
  deleteContract,
  downloadContractPDF,
  addSignature,
} from './contract.thunks';

const initialState = {
  contracts: [],
  currentContract: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    type: '',
    filmTitle: '',
    page: 1,
    limit: 20,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
};

const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentContract: (state) => {
      state.currentContract = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Contracts
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload.contracts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Contract By ID
      .addCase(fetchContractById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContract = action.payload;
      })
      .addCase(fetchContractById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Contract
      .addCase(createContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts.unshift(action.payload);
      })
      .addCase(createContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Contract
      .addCase(updateContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contracts.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
        state.currentContract = action.payload;
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Contract
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.contracts = state.contracts.filter((c) => c._id !== action.payload);
      })

      // Add Signature
      .addCase(addSignature.fulfilled, (state, action) => {
        state.currentContract = action.payload;
      });
  },
});

export const { setFilters, clearCurrentContract, clearError } = contractSlice.actions;
export default contractSlice.reducer;