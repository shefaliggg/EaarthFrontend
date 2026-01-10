import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isMultiDay: z.boolean().optional(),
  eventType: z.string(),
  location: z.string().optional(),
  color: z.string().optional(),
  notes: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isAllDay: z.boolean().optional(),
});
