// src/features/demo/store/viewRole.slice.js
/**
 * viewRole slice
 * 
 * For UI demo / testing only.
 * Stores the currently-selected "View As" role so any component can read it.
 * In production, this would come from the auth user's activeAffiliation.role.
 */
import { createSlice } from "@reduxjs/toolkit";

const VALID_ROLES = [
  "PRODUCTION_ADMIN",
  "CREW",
  "UPM",
  "FC",
  "STUDIO",
  "ACCOUNTS_ADMIN",
  "SUPER_ADMIN",
];

const getInitialRole = () => {
  const stored = localStorage.getItem("viewRole");
  return VALID_ROLES.includes(stored) ? stored : "PRODUCTION_ADMIN";
};

const viewRoleSlice = createSlice({
  name: "viewRole",
  initialState: {
    current: getInitialRole(),
    available: VALID_ROLES,
  },
  reducers: {
    setViewRole(state, action) {
      if (VALID_ROLES.includes(action.payload)) {
        state.current = action.payload;
        localStorage.setItem("viewRole", action.payload);
      }
    },
  },
});

export const { setViewRole } = viewRoleSlice.actions;
export default viewRoleSlice.reducer;

export const selectViewRole = (state) => state.viewRole.current;
export const selectAvailableRoles = (state) => state.viewRole.available;