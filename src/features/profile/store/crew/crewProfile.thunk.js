import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProfile,
  updatePersonalDetails,
  updateNationalityProof,
  updateAgencyDetails,
  updateAgentContact,
  updateAgentBank,
  setupAgency,
  setupCompany,
  updateCompanyDetails,
  updateCompanyContact,
  updateCompanyTax,
  updateCompanyBank,
  updateFinanceDetails,
  updatePersonalBank,
  updateVehicleAllowance,
  updateAllowanceEquipments,
  updateHealthDetails,
} from "../../services/crewProfile.service";
import { updateCurrentUser } from "../../../auth/store";
import { AddOrUpdateDocument } from "../../../user-documents/store/document.slice";
import { updateHomeAddress } from "../../services/crewProfile.service";
import { updateContactInfo } from "../../services/crewProfile.service";
import { updateEmergencyContact } from "../../services/crewProfile.service";

export const fetchProfileThunk = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfile();
      console.log("✅ fetchProfileThunk success:", response);
      return response;
    } catch (err) {
      console.error("❌ fetchProfileThunk error:", err.message);
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: "Failed to fetch profile data. Please try again later.",
      });
    }
  },
);

// 🔥 UPDATE PERSONAL
export const updatePersonalDetailsThunk = createAsyncThunk(
  "profile/updatePersonalDetails",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      console.log("called update profile personal detials thunk");
      const response = await updatePersonalDetails(payload);
      const { profile, user } = response;
      if (user) {
        dispatch(
          updateCurrentUser({
            displayName: user.displayName,
            legalFirstName: user.legalFirstName,
            legalLastName: user.legalLastName,
          }),
        );
      }

      console.log("✅ updatePersonalDetailsThunk success:", response);
      return profile;
    } catch (err) {
      console.error(
        "❌ updatePersonalDetailsThunk error:",
        err.response?.data?.message || err.message,
      );
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: err.response?.data?.errors || null,
      });
    }
  },
);

// 🔥 UPDATE NATIONALITY PROOF
export const updateNationalityProofThunk = createAsyncThunk(
  "profile/updateNationalityProof",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateNationalityProof(formData);
      const { nationalityProof, profileCompletionPercent, documents, user } =
        response;

      const docsArray = Array.isArray(documents)
        ? documents
        : documents
          ? [documents]
          : [];

      docsArray.forEach((doc) => {
        dispatch(AddOrUpdateDocument(doc));
      });

      dispatch(updateCurrentUser({ ...user }));

      console.log("✅ updateNationalityProofThunk success:", response);
      return { nationalityProof, profileCompletionPercent };
    } catch (err) {
      console.error("❌ updateNationalityProofThunk error:", err.message);
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
        errors: err.response?.data?.errors || null,
      });
    }
  },
);

export const updateHomeAddressThunk = createAsyncThunk(
  "contactDetails/updateHomeAddress",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateHomeAddress(payload);

      console.log("✅ updateHomeAddressThunk success:", response);
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateContactInfoThunk = createAsyncThunk(
  "contactDetails/updateContactInfo",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateContactInfo(payload);
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateEmergencyContactThunk = createAsyncThunk(
  "contactDetails/updateEmergencyContact",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateEmergencyContact(payload);
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const setupAgencyThunk = createAsyncThunk(
  "profile/setupAgency",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await setupAgency(payload);
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateAgencyDetailsThunk = createAsyncThunk(
  "profile/updateAgencyDetails",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateAgencyDetails(payload);
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateAgentContactThunk = createAsyncThunk(
  "profile/updateAgentContact",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateAgentContact(payload);
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateAgentBankThunk = createAsyncThunk(
  "profile/updateAgentBank",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateAgentBank(payload);
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const setupCompanyThunk = createAsyncThunk(
  "profile/setupCompany",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await setupCompany(formData);
      const docsArray = Array.isArray(response.documents)
        ? response.documents
        : response.documents
          ? [response.documents]
          : [];
      docsArray.forEach((doc) => dispatch(AddOrUpdateDocument(doc)));
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateCompanyDetailsThunk = createAsyncThunk(
  "profile/updateCompanyDetails",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateCompanyDetails(formData);
      const docsArray = Array.isArray(response.documents)
        ? response.documents
        : response.documents
          ? [response.documents]
          : [];
      docsArray.forEach((doc) => dispatch(AddOrUpdateDocument(doc)));
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateCompanyContactThunk = createAsyncThunk(
  "profile/updateCompanyContact",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateCompanyContact(payload);
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateCompanyTaxThunk = createAsyncThunk(
  "profile/updateCompanyTax",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateCompanyTax(formData);
      const docsArray = Array.isArray(response.documents)
        ? response.documents
        : response.documents
          ? [response.documents]
          : [];
      docsArray.forEach((doc) => dispatch(AddOrUpdateDocument(doc)));
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateCompanyBankThunk = createAsyncThunk(
  "profile/updateCompanyBank",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateCompanyBank(payload);
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateFinanceDetailsThunk = createAsyncThunk(
  "profile/updateFinanceDetails",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateFinanceDetails(formData);
      const { finance, profileCompletionPercent, documents } = response;

      const docsArray = Array.isArray(documents)
        ? documents
        : documents
          ? [documents]
          : [];
      docsArray.forEach((doc) => dispatch(AddOrUpdateDocument(doc)));

      return { finance, profileCompletionPercent };
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updatePersonalBankThunk = createAsyncThunk(
  "profile/updatePersonalBank",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updatePersonalBank(payload);
      return response; // { personalBank, profileCompletionPercent }
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateVehicleAllowanceThunk = createAsyncThunk(
  "profile/updateVehicleAllowance",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateVehicleAllowance(formData);
      const docsArray = Array.isArray(response.documents)
        ? response.documents
        : response.documents
          ? [response.documents]
          : [];
      docsArray.forEach((doc) => dispatch(AddOrUpdateDocument(doc)));
      return response; // { vehicle, profileCompletionPercent, documents }
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateAllowanceEquipmentsThunk = createAsyncThunk(
  "profile/updateAllowanceEquipments",
  async ({ type, formData }, { rejectWithValue }) => {
    try {
      const response = await updateAllowanceEquipments(type, formData);
      // response = { type, items, profileCompletionPercent }
      return response;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateHealthDetailsThunk = createAsyncThunk(
  "profile/updateHealthDetails",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await updateHealthDetails(payload);
      return response; // { health, profileCompletionPercent }
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export default {
  getProfile,
  updatePersonalDetails,
  updateNationalityProof,
  updateHomeAddressThunk,
  updateContactInfoThunk,
  updateEmergencyContactThunk,
  setupAgencyThunk,
  updateAgencyDetailsThunk,
  updateAgentContactThunk,
  updateAgentBankThunk,
  setupCompanyThunk,
  updateCompanyDetailsThunk,
  updateCompanyContactThunk,
  updateCompanyTaxThunk,
  updateCompanyBankThunk,
  updateFinanceDetailsThunk,
  updatePersonalBankThunk,
  updateVehicleAllowanceThunk,
  updateAllowanceEquipmentsThunk,
  updateHealthDetailsThunk,
};
