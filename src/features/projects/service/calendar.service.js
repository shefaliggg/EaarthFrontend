import { axiosConfig } from "@/features/auth/config/axiosConfig";

// Get All Events
export const getCalendarEventsAPI = async () => {
  const res = await axiosConfig.get("/calendar/events");
  return res.data.data;
};

// Create Event
export const createCalendarEventAPI = async (eventData) => {
  const res = await axiosConfig.post("/calendar/create", eventData);
  return res.data.data;
};

// NEW: Get Crew Members
export const getCrewMembersAPI = async () => {
  const res = await axiosConfig.get("/calendar/crew");
  return res.data.data;
};