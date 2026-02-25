import { configureStore } from "@reduxjs/toolkit";
import { projectReducer, calendarReducer } from "../features/projects/store";
import { userReducer } from "../features/auth/store";
import offerReducer   from "../features/crew/store/offer.slice";
import viewRoleReducer from "../features/crew/store/viewrole.slice";


export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    calendar: calendarReducer,
    contracts: (state = {}, action) => {
      return state;
    },
        offers:   offerReducer,   // key MUST be "offers" — selectors rely on state.offers
    viewRole: viewRoleReducer,
  },
});
