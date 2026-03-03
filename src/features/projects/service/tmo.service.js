import { axiosConfig } from "@/features/auth/config/axiosConfig";

export const getTmosAPI = async () => {
  const res = await axiosConfig.get("/tmos");
  return res.data.data;
};

export const createTmoAPI = async (formData) => {
  const res = await axiosConfig.post("/tmos/create", formData);
  return res.data.data;
};

export const updateTmoAPI = async (tmoId, formData) => {
  const res = await axiosConfig.put(`/tmos/${tmoId}`, formData);
  return res.data.data;
};

export const deleteTmoAPI = async (tmoId) => {
  const res = await axiosConfig.delete(`/tmos/${tmoId}`);
  return res.data; 
};

export const downloadTmoAttachmentAPI = async (tmoId, attachmentId) => {
  const res = await axiosConfig.get(
    `/tmos/${tmoId}/attachments/${attachmentId}/download`,
    { responseType: "blob" }
  );
  return res;
};