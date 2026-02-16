import { configureStore } from '@reduxjs/toolkit';
import contractReducer from './contract.slice';

export const store = configureStore({
  reducer: {
    contracts: contractReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;