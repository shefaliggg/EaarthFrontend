import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().optional(),

  startTime: z.string().optional(),
  endTime: z.string().optional(),

  isAllDay: z.boolean().optional(),
  
  eventType: z.string().min(1, "Event Type is required"),
  
  location: z.string().min(1, "Location is required"),
  
  notes: z.string().optional(),
  
  audienceType: z.enum(["ALL", "DEPARTMENT", "USERS"]),
  selectedDepartments: z.array(z.string()).optional(),
  selectedUsers: z.array(z.string()).optional(), 

}).refine((data) => {

  if (data.audienceType === "DEPARTMENT") {
    return data.selectedDepartments && data.selectedDepartments.length > 0;
  }
  if (data.audienceType === "USERS") {
    return data.selectedUsers && data.selectedUsers.length > 0;
  }
  return true;
}, {
  message: "Please select at least one item for your chosen audience",
  path: ["audienceType"]
});