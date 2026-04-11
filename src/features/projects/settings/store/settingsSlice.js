import { createSlice } from "@reduxjs/toolkit";
import {
  loadContactsOptionsThunk,
  loadContactsSettingsThunk,
  loadDetailsSettingsThunk,
  lockSettingsPageThunk,
} from "./settings.thunks";

const COMPLETED_DETAILS_PROGRESS = 100;
const getContactsRequiredFields = (contacts) => {
  const requiredFields = [
    "companies.0.name",
    "companies.0.email",
    "companies.0.country",
    "companies.0.currencies.0",
    "productionBase.addressLine1",
    "productionBase.city",
    "productionBase.postcode",
    "productionBase.country",
    "productionBase.telephone",
    "productionBase.email",
    "projectCreator.name",
    "projectCreator.email",
    "billing.contactName",
    "billing.contactEmails",
    "billing.spvVatNumber",
  ];

  if (contacts?.billing?.sameAsSpv === "no") {
    requiredFields.push(
      "billing.addressLine1",
      "billing.city",
      "billing.postcode",
      "billing.country",
    );
  }

  return requiredFields;
};

export const DEFAULT_CONTACTS_FORM = {
  companies: [],
  productionBase: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    country: "",
    telephone: "",
    email: "",
  },
  projectCreator: {
    name: "",
    email: "",
  },
  billing: {
    contactName: "",
    contactEmails: "",
    spvVatNumber: "",
    sameAsSpv: "yes",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    country: "",
  },
};

const DEFAULT_CONTACTS_OPTIONS = {
  countries: [],
  currencies: [],
  defaults: {
    country: "",
    currency: "",
  },
};

const initialState = {
  details: {
    projectName: "",
    isLoading: false,
    isSaving: false,
    isValid: true,
    isLocked: false,
    progressPercentage: 0,
  },
  contacts: {
    form: DEFAULT_CONTACTS_FORM,
    options: DEFAULT_CONTACTS_OPTIONS,
    hasLoaded: false,
    hasLoadedOptions: false,
    isLoading: false,
    isLoadingOptions: false,
    isSaving: false,
    isValid: false,
    isLocked: false,
    progressPercentage: 0,
  },
};

const getDetailsProgress = (projectName) => {
  return projectName.trim().length >= 3 ? COMPLETED_DETAILS_PROGRESS : 0;
};

const getValueByPath = (source, path) => {
  return path.split(".").reduce((value, key) => value?.[key], source);
};

const getContactsProgress = (contacts) => {
  const requiredFields = getContactsRequiredFields(contacts);
  const completedFields = requiredFields.filter((fieldPath) => {
    return String(getValueByPath(contacts, fieldPath) || "").trim().length > 0;
  });

  return Math.round((completedFields.length / requiredFields.length) * 100);
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setDetailsProjectName(state, action) {
      state.details.projectName = action.payload;
      state.details.progressPercentage = getDetailsProgress(action.payload);
    },
    setDetailsFormValidity(state, action) {
      state.details.isValid = action.payload;
    },
    setContactsForm(state, action) {
      state.contacts.form = action.payload;
      state.contacts.progressPercentage = getContactsProgress(action.payload);
    },
    setContactsFormValidity(state, action) {
      state.contacts.isValid = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDetailsSettingsThunk.pending, (state) => {
        state.details.isLoading = true;
      })
      .addCase(loadDetailsSettingsThunk.fulfilled, (state, action) => {
        const { projectName, completion, isLocked } = action.payload;
        state.details.projectName = projectName;
        state.details.isLoading = false;
        state.details.isValid = completion.isComplete;
        state.details.isLocked = isLocked;
        state.details.progressPercentage = completion.percentage;
      })
      .addCase(loadDetailsSettingsThunk.rejected, (state) => {
        state.details.isLoading = false;
      })
      .addCase(loadContactsSettingsThunk.pending, (state) => {
        state.contacts.isLoading = true;
      })
      .addCase(loadContactsSettingsThunk.fulfilled, (state, action) => {
        const { contacts, completion, isLocked } = action.payload;
        state.contacts.form = contacts;
        state.contacts.hasLoaded = true;
        state.contacts.isLoading = false;
        state.contacts.isValid = completion.isComplete;
        state.contacts.isLocked = isLocked;
        state.contacts.progressPercentage = completion.percentage;
      })
      .addCase(loadContactsSettingsThunk.rejected, (state) => {
        state.contacts.isLoading = false;
      })
      .addCase(loadContactsOptionsThunk.pending, (state) => {
        state.contacts.isLoadingOptions = true;
      })
      .addCase(loadContactsOptionsThunk.fulfilled, (state, action) => {
        state.contacts.options = action.payload;
        state.contacts.hasLoadedOptions = true;
        state.contacts.isLoadingOptions = false;
      })
      .addCase(loadContactsOptionsThunk.rejected, (state) => {
        state.contacts.isLoadingOptions = false;
      })

      .addCase(lockSettingsPageThunk.pending, (state, action) => {
        if (action.meta.arg.pageKey === "details") {
          state.details.isSaving = true;
        }
        if (action.meta.arg.pageKey === "contacts") {
          state.contacts.isSaving = true;
        }
      })
      .addCase(lockSettingsPageThunk.fulfilled, (state, action) => {
        if (action.payload.pageKey === "details") {
          const { projectName, completion, isLocked } = action.payload.data;
          state.details.projectName = projectName;
          state.details.isSaving = false;
          state.details.isValid = completion.isComplete;
          state.details.isLocked = isLocked;
          state.details.progressPercentage = completion.percentage;
        }
        if (action.payload.pageKey === "contacts") {
          const { contacts, completion, isLocked } = action.payload.data;
          state.contacts.form = contacts;
          state.contacts.isSaving = false;
          state.contacts.isValid = completion.isComplete;
          state.contacts.isLocked = isLocked;
          state.contacts.progressPercentage = completion.percentage;
        }
      })
      .addCase(lockSettingsPageThunk.rejected, (state, action) => {
        if (action.meta.arg.pageKey === "details") {
          state.details.isSaving = false;
        }
        if (action.meta.arg.pageKey === "contacts") {
          state.contacts.isSaving = false;
        }
      });
  },
});

export const {
  setContactsForm,
  setContactsFormValidity,
  setDetailsProjectName,
  setDetailsFormValidity,
} = settingsSlice.actions;

export const selectDetailsSettings = (state) => state.settings.details;
export const selectContactsSettings = (state) => state.settings.contacts;

export default settingsSlice.reducer;
