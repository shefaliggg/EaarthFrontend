import { axiosConfig } from "@/features/auth/config/axiosConfig";

export const getCurrentSignatureApi = async () => {
  const res = await axiosConfig.get("/identity-signature/current");
  return res.data.data;
};

export const createSignatureApi = async (formData) => {
  const res = await axiosConfig.post("/identity-signature", formData);
  return res.data.data;
};

export const sendOtpApi = async () => {
  const res = await axiosConfig.post("/identity-signature/send-otp");
  return res.data.data;
};

export const verifyOtpApi = async (payload) => {
  const res = await axiosConfig.post("/identity-signature/verify-otp", payload);
  return res.data.data;
};

export const getSignatureHistoryApi = async () => {
  const res = await axiosConfig.get("/identity-signature/history");
  return res.data.data;
};



