import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProjectContactsOptions,
  getProjectContactsSettings,
  getProjectDetailsSettings,
  lockProjectContactsSettings,
  lockProjectDetailsSettings,
} from "../service/settings.service";

export const loadDetailsSettingsThunk = createAsyncThunk(
  "settings/loadDetails",
  async (projectId) => {
    const data = await getProjectDetailsSettings(projectId);
    return data;
  },
);

export const loadContactsSettingsThunk = createAsyncThunk(
  "settings/loadContacts",
  async (projectId) => {
    const data = await getProjectContactsSettings(projectId);
    return data;
  },
);

export const loadContactsOptionsThunk = createAsyncThunk(
  "settings/loadContactsOptions",
  async (projectId) => {
    const data = await getProjectContactsOptions(projectId);
    return data;
  },
);

export const lockSettingsPageThunk = createAsyncThunk(
  "settings/lockPage",
  async ({ pageKey, projectId, payloadOverride }, { getState }) => {
    const state = getState();

    if (pageKey === "details") {
      const detailsPayload = payloadOverride || {
        projectName: state.settings.details.projectName,
      };

      const lockedDetails = await lockProjectDetailsSettings(projectId, {
        ...detailsPayload,
      });

      return {
        pageKey,
        data: lockedDetails,
      };
    }

    if (pageKey === "contacts") {
      const contactsPayload = payloadOverride || {
        ...state.settings.contacts.form,
      };

      const lockedContacts = await lockProjectContactsSettings(projectId, {
        ...contactsPayload,
      });

      return {
        pageKey,
        data: lockedContacts,
      };
    }

    return {
      pageKey,
      data: {},
    };
  },
);
