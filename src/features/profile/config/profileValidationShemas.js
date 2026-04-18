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

    _meta: z
      .object({
        legalFirstName: z.string().optional(),
        legalLastName: z.string().optional(),

        files: z.object({
          passport: z.any().optional(),
          birthCertificate: z.any().optional(),
          niProof: z.any().optional(),
          certificateNaturalisation: z.any().optional(),
        }),

        reuseDocIds: z.object({
          passport: z.string().nullable().optional(),
          birthCertificate: z.string().nullable().optional(),
          niProof: z.string().nullable().optional(),
          certificateNaturalisation: z.string().nullable().optional(),
        }),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "PASSPORT") {
      const p = data.passport || {};

      if (!p.firstName || p.firstName.trim() === "") {
        ctx.addIssue({
          path: ["passport", "firstName"],
          message: "Passport first name is required",
        });
      }

      if (!p.lastName || p.lastName.trim() === "") {
        ctx.addIssue({
          path: ["passport", "lastName"],
          message: "Passport last name is required",
        });
      }

      if (!p.number || p.number.trim() === "") {
        ctx.addIssue({
          path: ["passport", "number"],
          message: "Passport number is required",
        });
      }

      if (!p.issuingCountry || p.issuingCountry.trim() === "") {
        ctx.addIssue({
          path: ["passport", "issuingCountry"],
          message: "Issuing country is required",
        });
      }

      if (!p.expiryDate) {
        ctx.addIssue({
          path: ["passport", "expiryDate"],
          message: "Passport expiry date is required",
        });
      }

      const legalFirst = data._meta?.legalFirstName?.trim().toLowerCase();
      const legalLast = data._meta?.legalLastName?.trim().toLowerCase();

      const passFirst = p.firstName?.trim().toLowerCase();
      const passLast = p.lastName?.trim().toLowerCase();

      if (legalFirst && passFirst && legalFirst !== passFirst) {
        ctx.addIssue({
          path: ["passport", "firstName"],
          message: "Passport first name must match legal first name",
        });
      }

      if (legalLast && passLast && legalLast !== passLast) {
        ctx.addIssue({
          path: ["passport", "lastName"],
          message: "Passport last name must match legal last name",
        });
      }

      const hasPassportFile = data._meta?.files?.passport;
      const hasPassportId = data._meta?.reuseDocIds?.passport;

      if (!hasPassportFile && !hasPassportId) {
        ctx.addIssue({
          path: ["passportDocument"],
          message: "Passport document is required",
        });
      }
    }

    if (data.type === "BIRTH_CERTIFICATE") {
      const hasBirthFile = data._meta?.files?.birthCertificate;
      const hasBirthId = data._meta?.reuseDocIds?.birthCertificate;

      const hasNiFile = data._meta?.files?.niProof;
      const hasNiId = data._meta?.reuseDocIds?.niProof;

      if (!hasBirthFile && !hasBirthId) {
        ctx.addIssue({
          path: ["birthCertificate"],
          message: "Birth certificate is required",
        });
      }

      if (!hasNiFile && !hasNiId) {
        ctx.addIssue({
          path: ["niProofId"],
          message: "NI proof is required",
        });
      }
    }

    if (data.type === "CERTIFICATE_OF_NATURALISATION") {
      const hasCertFile = data._meta?.files?.certificateNaturalisation;
      const hasCertId = data._meta?.reuseDocIds?.certificateNaturalisation;

      const hasNiFile = data._meta?.files?.niProof;
      const hasNiId = data._meta?.reuseDocIds?.niProof;

      if (!hasCertFile && !hasCertId) {
        ctx.addIssue({
          path: ["certificateNaturalisation"],
          message: "Certificate of naturalisation is required",
        });
      }

      if (!hasNiFile && !hasNiId) {
        ctx.addIssue({
          path: ["niProof"],
          message: "NI proof is required",
        });
      }
    }
  });
