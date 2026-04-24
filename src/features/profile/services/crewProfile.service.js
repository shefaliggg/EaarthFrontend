import { axiosConfig } from "../../auth/config/axiosConfig";

export const getProfile = async () => {
  const res = await axiosConfig.get("/profile/crew");
  return res.data.data;
};

export const updatePersonalDetails = async (payload) => {
  const res = await axiosConfig.patch(
    "/profile/crew/identity/personal-details",
    payload,
  );
  return res.data.data;
};

export const updateNationalityProof = async (formData) => {
  const res = await axiosConfig.patch(
    "/profile/crew/identity/nationality-proof",
    formData,
  );
  return res.data.data;
};

export const updateHomeAddress = async (formData) => {
  const res = await axiosConfig.patch(
    "/profile/crew/contact/home-address",
    formData,
  );
  return res.data.data;
};

export const updateContactInfo = async (formData) => {
  const res = await axiosConfig.patch(
    "/profile/crew/contact/contact-info",
    formData,
  );
  return res.data.data;
};

export const updateEmergencyContact = async (formData) => {
  const res = await axiosConfig.patch(
    "/profile/crew/contact/emergency-contact",
    formData,
  );
  return res.data.data;
};

export const setupAgency = async (payload) => {
  const res = await axiosConfig.post("/profile/crew/agency/setup", payload);
  return res.data.data;
};

export const updateAgencyDetails = async (payload) => {
  const res = await axiosConfig.patch("/profile/crew/agency/details", payload);
  return res.data.data;
};

export const updateAgentContact = async (payload) => {
  const res = await axiosConfig.patch("/profile/crew/agency/contact", payload);
  return res.data.data;
};

export const updateAgentBank = async (payload) => {
  const res = await axiosConfig.patch("/profile/crew/agency/bank", payload);
  return res.data.data;
};

export const setupCompany = async (formData) => {
  const res = await axiosConfig.post("/profile/crew/company/setup", formData);
  return res.data.data;
};

export const updateCompanyDetails = async (formData) => {
  const res = await axiosConfig.patch("/profile/crew/company/details", formData);
  return res.data.data;
};

export const updateCompanyContact = async (payload) => {
  const res = await axiosConfig.patch("/profile/crew/company/contact", payload);
  return res.data.data;
};

export const updateCompanyTax = async (formData) => {
  const res = await axiosConfig.patch("/profile/crew/company/tax", formData);
  return res.data.data;
};

export const updateCompanyBank = async (payload) => {
  const res = await axiosConfig.patch("/profile/crew/company/bank", payload);
  return res.data.data;
};