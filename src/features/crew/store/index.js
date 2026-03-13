/**
 * store/index.js
 *
 * Redux store. Add contractInstances reducer here.
 * Replace your existing store/index.js with this.
 */

import { configureStore } from "@reduxjs/toolkit";
import userReducer              from "../features/auth/store/user.slice";
import offersReducer            from "../features/offers/store/offer.slice";
import viewRoleReducer          from "../features/offers/store/viewrole.slice";
import contractInstancesReducer from "../features/offers/store/contractInstances.slice";

const store = configureStore({
  reducer: {
    user:              userReducer,
    offers:            offersReducer,
    viewRole:          viewRoleReducer,
    contractInstances: contractInstancesReducer,   // ← NEW
  },
});

export default store;