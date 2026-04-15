import { z } from "zod";

export const personalDetailsSchema = z.object({
  title: z
    .enum(["MR", "MS", "MRS", "DR", "PROF"])
    .nullish()
    .refine((val) => val, {
      message: "Please select a title",
    }),

  legalFirstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "Max 100 characters"),

  legalLastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Max 100 characters"),

  middleNames: z.string().optional(),
  screenCreditName: z.string().optional(),

  displayNamePreference: z
    .enum(["FIRST_NAME", "LAST_NAME", "FULL_NAME", "SCREEN_NAME", "CUSTOM"])
    .nullish(),

  customDisplayName: z.string().optional(),

  pronouns: z
    .string()
    .nullish()
    .refine((val) => val, {
      message: "Please select your pronouns",
    }),

  sex: z
    .enum(["MALE", "FEMALE"])
    .nullish()
    .refine((val) => val, {
      message: "Please select your sex",
    }),

  dateOfBirth: z
    .string()
    .nullish()
    .refine((val) => val && val.trim() !== "", {
      message: "Date of birth is required",
    }),

  countryOfPermanentResidence: z
    .string()
    .min(1, "Country of residence is required"),

  countryOfLegalNationality: z.string().min(1, "Nationality is required"),
});

export const nationalityProofSchema = z
  .object({
    type: z.enum(
      ["PASSPORT", "BIRTH_CERTIFICATE", "CERTIFICATE_OF_NATURALISATION"],
      {
        errorMap: () => ({
          message: "Please select a proof of nationality",
        }),
      },
    ),

    passport: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        number: z.string().optional(),
        issuingCountry: z.string().optional(),
        expiryDate: z.string().nullish(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // 🛂 PASSPORT validation rules
    if (data.type === "PASSPORT") {
      const p = data.passport || {};

      if (!p.firstName || p.firstName.trim() === "") {
        ctx.addIssue({
          path: ["passport", "firstName"],
          message: "Passport first name is required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!p.lastName || p.lastName.trim() === "") {
        ctx.addIssue({
          path: ["passport", "lastName"],
          message: "Passport last name is required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!p.number || p.number.trim() === "") {
        ctx.addIssue({
          path: ["passport", "number"],
          message: "Passport number is required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!p.issuingCountry || p.issuingCountry.trim() === "") {
        ctx.addIssue({
          path: ["passport", "issuingCountry"],
          message: "Issuing country is required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!p.expiryDate) {
        ctx.addIssue({
          path: ["passport", "expiryDate"],
          message: "Passport expiry date is required",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
