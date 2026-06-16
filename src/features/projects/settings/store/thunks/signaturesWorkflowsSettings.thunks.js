import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api             from "../../service/projectSettings.service.js";
import { rejectWith }       from "./thunkHelpers.js";

export const fetchSignaturesWorkflowsSettingsThunk = createAsyncThunk(
  "projectSettings/signaturesWorkflows/fetch",
  async (projectId, { rejectWithValue }) => {
    try { return await api.getSignaturesWorkflowsSettings(projectId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const addSignerThunk = createAsyncThunk(
  "projectSettings/signaturesWorkflows/signers/add",
  async ({ projectId, data }, { rejectWithValue }) => {
    try { return await api.addSigner(projectId, data); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateSignerThunk = createAsyncThunk(
  "projectSettings/signaturesWorkflows/signers/update",
  async ({ projectId, signerId, data }, { rejectWithValue }) => {
    try { return await api.updateSigner(projectId, signerId, data); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const deleteSignerThunk = createAsyncThunk(
  "projectSettings/signaturesWorkflows/signers/delete",
  async ({ projectId, signerId }, { rejectWithValue }) => {
    try { return await api.deleteSigner(projectId, signerId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const addWorkflowThunk = createAsyncThunk(
  "projectSettings/signaturesWorkflows/workflows/add",
  async ({ projectId, data }, { rejectWithValue }) => {
    try { return await api.addWorkflow(projectId, data); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const updateWorkflowThunk = createAsyncThunk(
  "projectSettings/signaturesWorkflows/workflows/update",
  async ({ projectId, workflowId, data }, { rejectWithValue }) => {
    try { return await api.updateWorkflow(projectId, workflowId, data); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);

export const deleteWorkflowThunk = createAsyncThunk(
  "projectSettings/signaturesWorkflows/workflows/delete",
  async ({ projectId, workflowId }, { rejectWithValue }) => {
    try { return await api.deleteWorkflow(projectId, workflowId); }
    catch (err) { return rejectWith(err, rejectWithValue); }
  }
);