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

});