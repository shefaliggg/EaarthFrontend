import { axiosConfig } from "@/features/auth/config/axiosConfig";

export const getCalendarEventsAPI = async () => {
  const res = await axiosConfig.get("/calendar/events");
  return res.data.data;
};

export const createCalendarEventAPI = async (eventData) => {
  const res = await axiosConfig.post("/calendar/create", eventData);
  return res.data.data;
};

export const updateCalendarEventAPI = async (eventCode, eventData) => {

  const res = await axiosConfig.put(`/calendar/${eventCode}`, eventData);
  return res.data.data;
};


export const deleteCalendarEventAPI = async (eventCode) => {

  const res = await axiosConfig.delete(`/calendar/${eventCode}`);
  return res.data;
};

export const getCrewMembersAPI = async () => {
  const res = await axiosConfig.get("/calendar/crew");
  return res.data.data;
};

export const getDepartmentsAPI = async () => {
  const res = await axiosConfig.get("/calendar/departments");
  return res.data.data;
};
