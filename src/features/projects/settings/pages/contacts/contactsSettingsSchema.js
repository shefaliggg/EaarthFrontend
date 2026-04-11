import { z } from "zod";

const companySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Company name is required"),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().trim().min(1, "Country is required"),
  telephone: z.string().optional(),
  email: z.string().trim().email("Company email is required"),
  currencies: z.array(z.string()).min(1, "Select at least one currency"),
  isPrimary: z.boolean(),
});

export const contactsSettingsSchema = z.object({
  companies: z.array(companySchema).min(1),
  productionBase: z.object({
    addressLine1: z.string().trim().min(1, "Production base address is required"),
    addressLine2: z.string().optional(),
    city: z.string().trim().min(1, "Production base city is required"),
    postcode: z.string().trim().min(1, "Production base postcode is required"),
    country: z.string().trim().min(1, "Production base country is required"),
    telephone: z.string().trim().min(1, "Production base telephone is required"),
    email: z.string().trim().email("Production base email is required"),
  }),
  projectCreator: z.object({
    name: z.string().trim().min(1, "Project creator name is required"),
    email: z.string().trim().email("Project creator email is required"),
  }),
  billing: z.object({
    contactName: z.string().trim().min(1, "Billing contact name is required"),
    contactEmails: z.string().trim().min(1, "Billing email is required"),
    spvVatNumber: z.string().trim().min(1, "SPV company VAT number is required"),
    sameAsSpv: z.enum(["yes", "no"]),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().optional(),
  }),
}).superRefine((values, ctx) => {
  if (values.billing.sameAsSpv === "yes") {
    return;
  }

  if (!values.billing.addressLine1?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["billing", "addressLine1"],
      message: "Billing address line 1 is required",
    });
  }

  if (!values.billing.city?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["billing", "city"],
      message: "Billing city is required",
    });
  }

  if (!values.billing.postcode?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["billing", "postcode"],
      message: "Billing postcode is required",
    });
  }

  if (!values.billing.country?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["billing", "country"],
      message: "Billing country is required",
    });
  }
});
