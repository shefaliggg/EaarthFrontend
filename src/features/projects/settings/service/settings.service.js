import { axiosConfig } from "@/features/auth/config/axiosConfig";
import { APP_CONFIG } from "../../../crew/config/appConfig";

export const getProjectSettings = async (projectId) => {
  const res = await axiosConfig.get(`/settings/${projectId}`);
  return res.data.data;
};


export const initProjectSettings = async (projectId) => {
  const res = await axiosConfig.post(`/settings/${projectId}/init`, {
    studioId: APP_CONFIG.STUDIO_ID,
  });
  return res.data.data;
};