import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),

  startTime: z.string().optional(),
  endTime: z.string().optional(),

  isAllDay: z.boolean().optional(),

  
  color: z.string().optional(),
  eventType: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  if (!data.isAllDay) {
    return !!data.startTime && !!data.endTime;
  }
  return true;
}, {
  message: "Start and end time are required",
  path: ["endTime"],
});
