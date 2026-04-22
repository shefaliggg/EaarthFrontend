import { configureStore } from "@reduxjs/toolkit";
import {
  projectReducer,
  calendarReducer,
  tmoReducer,
} from "../features/projects/store";
import { userReducer } from "../features/auth/store";
import offerReducer from "../features/crew/store/offer.slice";
import viewRoleReducer from "../features/crew/store/viewrole.slice";
import { notificationReducer } from "../features/notifications/store";
import contractInstancesReducer from "../features/crew/store/contractInstances.slice";
// import settingsReducer from "@/features/projects/settings/store/settingsSlice";
import { crewProfileReducer } from "../features/profile/store";
import { userDocumentsReducer } from "../features/user-documents/store";
import { signatureReducer } from "../features/signature/store";

export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    calendar: calendarReducer,
    // settings: settingsReducer,
    tmo: tmoReducer,
    contracts: (state = {}, action) => {
      return state;
    },
    offers: offerReducer, // key MUST be "offers" — selectors rely on state.offers
    viewRole: viewRoleReducer,
    notification: notificationReducer,
    contractInstances: contractInstancesReducer,
    crewProfile: crewProfileReducer,
    userDocuments: userDocumentsReducer,
    signature: signatureReducer,
  },
});
