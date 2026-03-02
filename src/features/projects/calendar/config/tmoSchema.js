import { z } from "zod";

const travelDetailsSchema = z.object({
  date: z.string().min(1, "Date is required"),
  transportToAirport: z.string().optional(),
  airline: z.string().min(1, "Airline is required"),
  flightNumber: z.string().min(1, "Flight No. is required"),
  bookingRef: z.string().optional(),
  departTime: z.string().min(1, "Required"),
  departLocation: z.string().min(1, "Required"),
  arriveTime: z.string().min(1, "Required"),
  arriveLocation: z.string().min(1, "Required"),
  transportOnArrival: z.string().optional(),
});

const accommodationDetailsSchema = z.object({
  startDate: z.string().min(1, "Check-in is required"),
  endDate: z.string().min(1, "Check-out is required"),
  hotelName: z.string().min(1, "Hotel Name is required"),
  address: z.string().min(1, "Address is required"),
  checkIn: z.string().min(1, "Required"),
  checkOut: z.string().min(1, "Required"),
  roomType: z.string().optional(),
  notes: z.string().optional(),
});

export const tmoSchema = z.object({
  id: z.string().optional(),
  tmoNumber: z.string().min(1, "TMO Number is required"),
  name: z.string().min(1, "Traveler / Group Name is required"),
  department: z.string().optional(),
  status: z.enum(["DRAFT", "PENDING", "CONFIRMED", "CANCELLED"]),
  createdAt: z.string().min(1, "Date is required"),
  
  contacts: z.array(
    z.object({
      id: z.string(),
      role: z.string().min(1, "Role is required"),
      name: z.string().min(1, "Name is required"),
      phone: z.string().min(1, "Phone is required"),
    })
  ).optional(),

  sections: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["travel", "accommodation"]),
      title: z.string().min(1, "Section Title is required"),
      travelDetails: travelDetailsSchema.optional(),
      accommodationDetails: accommodationDetailsSchema.optional(),
    })
  ).superRefine((sections, ctx) => {
    sections.forEach((sec, index) => {
      if (sec.type === "travel" && (!sec.travelDetails || !sec.travelDetails.airline)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Flight details missing", path: [index, "travelDetails", "airline"] });
      }
      if (sec.type === "accommodation" && (!sec.accommodationDetails || !sec.accommodationDetails.hotelName)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Hotel details missing", path: [index, "accommodationDetails", "hotelName"] });
      }
    });
  }),
});