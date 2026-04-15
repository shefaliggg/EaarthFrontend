import axiosConfig from "../../auth/config/axiosConfig";

export const getDocuments = async (params = {}) => {
  const res = await axiosConfig.get("/user-documents", { params });
  return res.data.data;
};

export const getDocumentById = async (id) => {
  const res = await axiosConfig.get(`/user-documents/${id}`);
  return res.data.data;
};
