import { axiosConfig } from "@/features/auth/config/axiosConfig";

export const getCalendarEventsAPI = async () => {
  const res = await axiosConfig.get("/calendar/events", {   
  })
  return res.data.data;
};
