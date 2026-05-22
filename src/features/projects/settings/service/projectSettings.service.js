import axiosConfig from "@/features/auth/config/axiosConfig.js";

export const getProjectSettings = async (projectId) => {
  const res = await axiosConfig.get(`/settings/${projectId}`);
  return res.data.data;
};

export const updateProjectDetails = async (projectId, payload) => {
  const res = await axiosConfig.patch(
    `/settings/${projectId}/details`,
    payload,
  );

  return res.data.data;
};
