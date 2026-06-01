import { z } from "zod";

export const projectDetailsSchema = z.object({
  productionName: z
    .string()
    .min(1, "Project name is required")
    .max(200, "Project name cannot exceed 200 characters"),

  country: z
    .string()
    .max(1000, "Locations is too long")
    .optional()
    .or(z.literal("")),

  codeName: z
    .string()
    .max(100, "Code name cannot exceed 100 characters")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional()
    .or(z.literal("")),

  additionalNotes: z
    .string()
    .max(5000, "Additional notes cannot exceed 5000 characters")
    .optional()
    .or(z.literal("")),
});
