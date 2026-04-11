import { z } from "zod";

export const detailsSettingsSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters"),
});
