import { configureStore } from "@reduxjs/toolkit";
import { projectReducer } from "../features/projects/store";

export const store = configureStore({
  reducer: {

    project: projectReducer,
  },
});