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

export const homeAddressSchema = z.object({
  addressLine1: z.string().min(3, "Atleast 1 line Address is required"),

  addressLine2: z.string().optional(),
  addressLine3: z.string().optional(),

  postcode: z.string().min(3, "Postcode required").max(20),

  country: z.string().min(1, "Country is required"),
});

export const contactInfoSchema = z.object({
  mobileCountryCode: z.string().min(1, "Country code is required"),

  mobileNumber: z
    .string()
    .min(6, "Mobile number is too short")
    .max(15, "Mobile number is too long")
    .regex(/^[0-9]+$/, "Only digits allowed"),

  otherCountryCode: z.string().optional(),

  otherNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]+$/.test(val), "Only digits allowed")
    .refine((val) => !val || val.length >= 6, "Too short")
    .refine((val) => !val || val.length <= 15, "Too long"),

  email: z.string().email("Invalid email"),

  emailPayslip: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Invalid email",
    ),

  emailPension: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Invalid email",
    ),

  sendProjectEmailsToCrewMember: z.boolean(),
});

export const emergencyContactSchema = z.object({
  emergencyName: z
    .string()
    .min(2, "Name is required")
    .max(100, "Max 100 characters"),

  emergencyRelationship: z
    .string()
    .min(2, "Relationship is required")
    .max(50, "Max 50 characters"),

  emergencyCountryCode: z.string().min(1, "Country code required"),

  emergencyNumber: z
    .string()
    .min(6, "Number too short")
    .max(15, "Number too long")
    .regex(/^[0-9]+$/, "Only digits allowed"),
});

export const agencySetupSchema = z
  .object({
    hasAgent: z.boolean(),
    agencyName: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    addressLine3: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().optional(),
    agentCountryCode: z.string().optional(),
    agentNumber: z.string().optional(),
    agentCorrespondenceName: z.string().optional(),
    agentCorrespondenceEmail: z.string().optional(),
    sendEmailToCrewMember: z.boolean().default(false),
    agentSignatoryName: z.string().optional(),
    agentSignatoryEmail: z.string().optional(),
    bankName: z.string().optional(),
    branch: z.string().optional(),
    accountName: z.string().optional(),
    sortCode: z.string().optional(),
    accountNumber: z.string().optional(),
    iban: z.string().optional(),
    swiftBic: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasAgent) return;

    if (!data.agencyName?.trim())
      ctx.addIssue({
        path: ["agencyName"],
        message: "Agency name is required",
      });

    if (!data.addressLine1?.trim())
      ctx.addIssue({
        path: ["addressLine1"],
        message: "Address line 1 is required",
      });

    if (!data.postcode?.trim())
      ctx.addIssue({ path: ["postcode"], message: "Postcode is required" });

    if (!data.country?.trim())
      ctx.addIssue({ path: ["country"], message: "Country is required" });

    if (!data.agentCountryCode)
      ctx.addIssue({
        path: ["agentCountryCode"],
        message: "Country code required",
      });

    if (!data.agentNumber || data.agentNumber.length < 6)
      ctx.addIssue({
        path: ["agentNumber"],
        message: "Valid phone number required",
      });

    if (data.agentNumber && !/^[0-9]+$/.test(data.agentNumber))
      ctx.addIssue({ path: ["agentNumber"], message: "Only digits allowed" });

    if (!data.agentCorrespondenceName?.trim())
      ctx.addIssue({
        path: ["agentCorrespondenceName"],
        message: "Correspondence name required",
      });

    if (!data.agentCorrespondenceEmail?.trim())
      ctx.addIssue({
        path: ["agentCorrespondenceEmail"],
        message: "Correspondence email required",
      });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.agentCorrespondenceEmail))
      ctx.addIssue({
        path: ["agentCorrespondenceEmail"],
        message: "Invalid email",
      });

    if (!data.bankName?.trim())
      ctx.addIssue({ path: ["bankName"], message: "Bank name is required" });

    if (!data.accountName?.trim())
      ctx.addIssue({
        path: ["accountName"],
        message: "Account name is required",
      });

    if (!data.accountNumber?.trim())
      ctx.addIssue({
        path: ["accountNumber"],
        message: "Account number is required",
      });
  });

export const agencyDetailsSchema = z
  .object({
    hasAgent: z.boolean(),

    agencyName: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    addressLine3: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasAgent) return;

    if (!data.agencyName?.trim()) {
      ctx.addIssue({
        path: ["agencyName"],
        message: "Agency name is required",
      });
    }

    if (!data.addressLine1?.trim()) {
      ctx.addIssue({
        path: ["addressLine1"],
        message: "Address line 1 is required",
      });
    }

    if (!data.postcode?.trim()) {
      ctx.addIssue({
        path: ["postcode"],
        message: "Postcode is required",
      });
    }

    if (!data.country?.trim()) {
      ctx.addIssue({
        path: ["country"],
        message: "Country is required",
      });
    }
  });

export const agentContactSchema = z
  .object({
    hasAgent: z.boolean(), // 👈 IMPORTANT (pass this from UI)

    agentCountryCode: z.string().optional(),

    agentNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^[0-9]+$/.test(val), "Only digits allowed"),

    agentCorrespondenceName: z.string().optional(),

    agentCorrespondenceEmail: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Invalid email",
      ),

    sendEmailToCrewMember: z.boolean(),

    agentSignatoryName: z.string().optional(),

    agentSignatoryEmail: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Invalid email",
      ),
  })
  .superRefine((data, ctx) => {
    if (!data.hasAgent) return;

    if (!data.agentCountryCode) {
      ctx.addIssue({
        path: ["agentCountryCode"],
        message: "Country code required",
      });
    }

    if (!data.agentNumber || data.agentNumber.length < 6) {
      ctx.addIssue({
        path: ["agentNumber"],
        message: "Valid phone number required",
      });
    }

    if (!data.agentCorrespondenceName?.trim()) {
      ctx.addIssue({
        path: ["agentCorrespondenceName"],
        message: "Correspondence name required",
      });
    }

    if (!data.agentCorrespondenceEmail?.trim()) {
      ctx.addIssue({
        path: ["agentCorrespondenceEmail"],
        message: "Correspondence email required",
      });
    }
  });

export const agentBankSchema = z
  .object({
    hasAgent: z.boolean(), // 👈 IMPORTANT

    bankName: z.string().optional(),
    branch: z.string().optional(),
    accountName: z.string().optional(),
    sortCode: z.string().optional(),
    accountNumber: z.string().optional(),
    iban: z.string().optional(),
    swiftBic: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasAgent) return;

    if (!data.bankName?.trim()) {
      ctx.addIssue({
        path: ["bankName"],
        message: "Bank name is required",
      });
    }

    if (!data.accountName?.trim()) {
      ctx.addIssue({
        path: ["accountName"],
        message: "Account name is required",
      });
    }

    if (!data.accountNumber?.trim()) {
      ctx.addIssue({
        path: ["accountNumber"],
        message: "Account number is required",
      });
    }
  });

// ─── COMPANY SCHEMAS ─────────────────────────────────────────────────────────

export const companySetupSchema = z
  .object({
    usesLoanOutCompany: z.boolean(),

    // ── Details ──────────────────────────────────────────────────────────────
    name: z.string().optional(),
    registrationNumber: z.string().optional(),
    ktNumber: z.string().optional(),
    countryOfIncorporation: z.string().optional(),

    // ── Contact / Address ────────────────────────────────────────────────────
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    addressLine3: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().optional(),
    representativeName: z.string().optional(),
    representativeEmail: z.string().optional(),
    allowThirdPartyToSignContracts: z.boolean().default(false),

    // ── Tax ──────────────────────────────────────────────────────────────────
    isVATRegistered: z.boolean().default(false),
    taxRegistrationNumberIreland: z.string().optional(),
    taxClearanceAccessNumberIreland: z.string().optional(),

    // ── Bank ─────────────────────────────────────────────────────────────────
    bankName: z.string().optional(),
    branch: z.string().optional(),
    accountName: z.string().optional(),
    sortCode: z.string().optional(),
    accountNumber: z.string().optional(),
    iban: z.string().optional(),
    swiftBic: z.string().optional(),
    bankNumberIceland: z.string().optional(),
    bankHBIceland: z.string().optional(),

    _meta: z
      .object({
        files: z.object({
          certificateOfIncorporation: z.any().optional(),
          vatCertificate: z.any().optional(),
        }),
        reuseDocIds: z.object({
          certificateOfIncorporation: z.string().nullable().optional(),
          vatCertificate: z.string().nullable().optional(),
        }),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.usesLoanOutCompany) return;

    // ── Details ──────────────────────────────────────────────────────────────
    if (!data.name?.trim())
      ctx.addIssue({ path: ["name"], message: "Company name is required" });

    if (!data.registrationNumber?.trim())
      ctx.addIssue({
        path: ["registrationNumber"],
        message: "Registration number is required",
      });

    if (!data.countryOfIncorporation?.trim())
      ctx.addIssue({
        path: ["countryOfIncorporation"],
        message: "Country of incorporation is required",
      });

    const hasCertFile = data._meta?.files?.certificateOfIncorporation;
    const hasCertId = data._meta?.reuseDocIds?.certificateOfIncorporation;

    if (!hasCertFile && !hasCertId) {
      ctx.addIssue({
        path: ["certificateOfIncorporation"],
        message: "Certificate of incorporation is required",
      });
    }

    // ── Contact / Address ────────────────────────────────────────────────────
    if (!data.addressLine1?.trim())
      ctx.addIssue({
        path: ["addressLine1"],
        message: "Address line 1 is required",
      });

    if (!data.postcode?.trim())
      ctx.addIssue({ path: ["postcode"], message: "Postcode is required" });

    if (!data.country?.trim())
      ctx.addIssue({ path: ["country"], message: "Country is required" });

    if (!data.representativeName?.trim())
      ctx.addIssue({
        path: ["representativeName"],
        message: "Representative name is required",
      });

    if (!data.representativeEmail?.trim()) {
      ctx.addIssue({
        path: ["representativeEmail"],
        message: "Representative email is required",
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.representativeEmail)) {
      ctx.addIssue({
        path: ["representativeEmail"],
        message: "Invalid email",
      });
    }

    // 🔥 VAT certificate validation (only if VAT enabled)
    if (data.isVATRegistered) {
      const hasVatFile = data._meta?.files?.vatCertificate;
      const hasVatId = data._meta?.reuseDocIds?.vatCertificate;

      if (!hasVatFile && !hasVatId) {
        ctx.addIssue({
          path: ["vatCertificate"],
          message: "VAT certificate is required",
        });
      }
    }

    // ── Bank ─────────────────────────────────────────────────────────────────
    if (!data.bankName?.trim())
      ctx.addIssue({ path: ["bankName"], message: "Bank name is required" });

    if (!data.accountName?.trim())
      ctx.addIssue({
        path: ["accountName"],
        message: "Account name is required",
      });

    if (!data.accountNumber?.trim())
      ctx.addIssue({
        path: ["accountNumber"],
        message: "Account number is required",
      });
  });

export const companyDetailsSchema = z
  .object({
    usesLoanOutCompany: z.boolean(),
    name: z.string().optional(),
    registrationNumber: z.string().optional(),
    ktNumber: z.string().optional(),
    countryOfIncorporation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.usesLoanOutCompany) return;

    if (!data.name?.trim())
      ctx.addIssue({ path: ["name"], message: "Company name is required" });

    if (!data.registrationNumber?.trim())
      ctx.addIssue({
        path: ["registrationNumber"],
        message: "Registration number is required",
      });

    if (!data.countryOfIncorporation?.trim())
      ctx.addIssue({
        path: ["countryOfIncorporation"],
        message: "Country of incorporation is required",
      });
  });

export const companyContactSchema = z
  .object({
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    addressLine3: z.string().optional(),
    postcode: z.string().optional(),
    country: z.string().optional(),
    representativeName: z.string().optional(),
    representativeEmail: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Invalid email",
      ),
    allowThirdPartyToSignContracts: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.addressLine1?.trim())
      ctx.addIssue({
        path: ["addressLine1"],
        message: "Address line 1 is required",
      });

    if (!data.postcode?.trim())
      ctx.addIssue({ path: ["postcode"], message: "Postcode is required" });

    if (!data.country?.trim())
      ctx.addIssue({ path: ["country"], message: "Country is required" });

    if (!data.representativeName?.trim())
      ctx.addIssue({
        path: ["representativeName"],
        message: "Representative name is required",
      });

    if (!data.representativeEmail?.trim())
      ctx.addIssue({
        path: ["representativeEmail"],
        message: "Representative email is required",
      });
  });

export const companyTaxSchema = z.object({
  isVATRegistered: z.boolean(),
  taxRegistrationNumberIreland: z.string().optional(),
  taxClearanceAccessNumberIreland: z.string().optional(),
});

export const companyBankSchema = z
  .object({
    bankName: z.string().optional(),
    branch: z.string().optional(),
    accountName: z.string().optional(),
    sortCode: z.string().optional(),
    accountNumber: z.string().optional(),
    iban: z.string().optional(),
    swiftBic: z.string().optional(),
    bankNumberIceland: z.string().optional(),
    bankHBIceland: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.bankName?.trim())
      ctx.addIssue({ path: ["bankName"], message: "Bank name is required" });

    if (!data.accountName?.trim())
      ctx.addIssue({
        path: ["accountName"],
        message: "Account name is required",
      });

    if (!data.accountNumber?.trim())
      ctx.addIssue({
        path: ["accountNumber"],
        message: "Account number is required",
      });
  });

// ─── FINANCE ─────────────────────────────────────────────────────────────────

export const financeDetailsSchema = z
  .object({
    ppsNumber: z.string().optional(),
    taxClearanceAccessNumber: z.string().optional(),
    ktNumber: z.string().optional(),
    nationalInsuranceNumber: z.string().optional(),
    vatNumber: z.string().optional(),
    utrNumber: z.string().optional(),

    hasOngoingStudentLoan: z.boolean().nullable().optional(),

    payeStatus: z
      .enum([
        "first_job_since_april",
        "only_job_no_other_income",
        "has_other_job_or_pension",
      ])
      .nullable()
      .optional(),

    _meta: z
      .object({
        files: z.object({
          fs4: z.any().optional(),
          payslip: z.any().optional(),
          p45: z.any().optional(),
          vatCert: z.any().optional(),
        }),

        reuseDocIds: z.object({
          fs4: z.string().nullable().optional(),
          payslip: z.string().nullable().optional(),
          p45: z.string().nullable().optional(),
          vatCert: z.string().nullable().optional(),
        }),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const files = data._meta?.files || {};
    const ids = data._meta?.reuseDocIds || {};

    // 🟡 1. At least one financial field
    const hasAnyField =
      data.ppsNumber ||
      data.taxClearanceAccessNumber ||
      data.ktNumber ||
      data.nationalInsuranceNumber ||
      data.vatNumber;

    if (!hasAnyField) {
      ctx.addIssue({
        path: ["formFields"],
        message: "Please provide at least one financial detail",
      });
    }

    // 🟡 2. At least one document
    const hasAnyDocument =
      files.fs4 ||
      ids.fs4 ||
      files.payslip ||
      ids.payslip ||
      files.p45 ||
      ids.p45 ||
      files.vatCert ||
      ids.vatCert;

    if (!hasAnyDocument) {
      ctx.addIssue({
        path: ["documents"],
        message: "Please upload at least one financial document",
      });
    }

    // 🔴 3. VAT → requires VAT certificate
    if (data.vatNumber && data.vatNumber.trim() !== "") {
      const hasVatDoc = files.vatCert || ids.vatCert;

      if (!hasVatDoc) {
        ctx.addIssue({
          path: ["vatCert"],
          message: "VAT certificate is required when VAT number is provided",
        });
      }
    }

    // 🔴 4. PAYE → requires payslip OR P45
    if (data.payeStatus) {
      const hasPayeDoc = files.payslip || ids.payslip || files.p45 || ids.p45;

      if (!hasPayeDoc) {
        ctx.addIssue({
          path: ["payslip"], // you can also use "payeDocs"
          message: "Payslip or P45 is required for PAYE status",
        });
      }
    }
  });

export const personalBankSchema = z
  .object({
    bankName: z.string().optional(),
    branch: z.string().optional(),
    accountName: z.string().optional(),
    sortCode: z.string().optional(),
    accountNumber: z.string().optional(),
    iban: z.string().optional(),
    swiftBic: z.string().optional(),
    bankNumberIceland: z.string().optional(),
    bankHBIceland: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.bankName?.trim())
      ctx.addIssue({ path: ["bankName"], message: "Bank name is required" });

    if (!data.accountName?.trim())
      ctx.addIssue({
        path: ["accountName"],
        message: "Account name is required",
      });

    if (!data.accountNumber?.trim())
      ctx.addIssue({
        path: ["accountNumber"],
        message: "Account number is required",
      });
  });
