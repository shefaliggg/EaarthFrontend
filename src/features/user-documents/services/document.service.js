import axiosConfig from "../../auth/config/axiosConfig";

export const getDocuments = async (params = {}) => {
  const res = await axiosConfig.get("/user-documents", { params });
  return res.data.data;
};

export const getDocumentById = async (id) => {
  const res = await axiosConfig.get(`/user-documents/${id}`);
  return res.data.data;
};

export const archiveDocument = async (id) => {
  const res = await axiosConfig.patch(`/user-documents/${id}/archive`);
  return res.data.data; // returns updated document
};

export const unarchiveDocument = async (id) => {
  const res = await axiosConfig.patch(`/user-documents/${id}/unarchive`);
  return res.data.data;
};

export const deleteDocument = async (id) => {
  // Soft delete — requires ARCHIVED status server-side
  const res = await axiosConfig.delete(`/user-documents/${id}`);
  return res.data; // { success, message } — no data body on delete
};

export const restoreDocument = async (id) => {
  const res = await axiosConfig.patch(`/user-documents/${id}/restore`);
  return res.data.data;
};
