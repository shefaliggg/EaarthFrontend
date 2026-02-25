// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/auth/store/user.slice";
import offerReducer from "../features/offers/store/offer.slice";
import viewRoleReducer from "../features/demo/store/viewRole.slice";

export const store = configureStore({
  reducer: {
    user:     userReducer,
    offers:   offerReducer,
    viewRole: viewRoleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types (they contain Date objects)
        ignoredActions: ["offers/advanceStatus/fulfilled"],
        ignoredPaths: ["offers.currentOffer.timeline"],
      },
    }),
});

export default store;