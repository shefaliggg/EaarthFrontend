/**
 * Path: src/features/projects/settings/store/thunks/contactsSettings.thunks.js
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith }       from "./thunkHelpers.js";

export const fetchContactsSettingsThunk = createAsyncThunk(
  "projectSettings/contacts/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getContactsSettings(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const addCompanyThunk = createAsyncThunk(
  "projectSettings/contacts/companies/add",
  async ({ projectId, data }, { rejectWithValue }) => {
    try { return await api.addCompany(projectId, data); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateCompanyThunk = createAsyncThunk(
  "projectSettings/contacts/companies/update",
  async ({ projectId, companyId, data }, { rejectWithValue }) => {
    try { return await api.updateCompany(projectId, companyId, data); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const deleteCompanyThunk = createAsyncThunk(
  "projectSettings/contacts/companies/delete",
  async ({ projectId, companyId }, { rejectWithValue }) => {
    try { return await api.deleteCompany(projectId, companyId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateProductionBaseThunk = createAsyncThunk(
  "projectSettings/contacts/productionBase/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateContactsProductionBase(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateProjectCreatorThunk = createAsyncThunk(
  "projectSettings/contacts/projectCreator/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateContactsProjectCreator(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateBillingThunk = createAsyncThunk(
  "projectSettings/contacts/billing/update",
  async ({ projectId, updates }, { rejectWithValue }) => {
    try { return await api.updateContactsBilling(projectId, updates); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);