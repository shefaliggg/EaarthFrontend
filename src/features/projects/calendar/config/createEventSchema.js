import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().optional(),

  startTime: z.string().optional(),
  endTime: z.string().optional(),

  isAllDay: z.boolean().optional(),
  
  eventType: z.string().min(1, "Event Type is required"),
  location: z.string().optional(),
  notes: z.string().optional(),
  
  // New Array for Crew IDs
  attendees: z.array(z.string()).optional(), 

}).refine((data) => {
  if (!data.isAllDay) {
    return !!data.startTime && !!data.endTime;
  }
  return true;
}, {
  message: "Start and end time are required for non-all-day events",
  path: ["endTime"],
});