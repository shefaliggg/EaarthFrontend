import { getCountryCode } from "@/shared/config/countriesDataConfig";
import { normalizeDate } from "../../../../shared/config/utils";
/**
 * Maps AI-extracted field keys → nested form state paths.
 * Extend FIELD_MAPS to support additional document types.
 */
export const FIELD_MAPS = {
  PASSPORT: [
    {
      aiKey: "firstName",
      formPath: ["passport", "firstName"],
      label: "First Name",
    },
    {
      aiKey: "lastName",
      formPath: ["passport", "lastName"],
      label: "Last Name",
    },
    {
      aiKey: "placeOfBirth",
      formPath: ["passport", "placeOfBirth"],
      label: "Place of Birth",
    },
    {
      aiKey: "issuingCountry",
      formPath: ["passport", "issuingCountry"],
      label: "Issuing Country",
      isCountryField: true,
    },
    {
      aiKey: "passportNumber",
      formPath: ["passport", "number"],
      label: "Passport Number",
    },
    {
      aiKey: "expiryDate",
      formPath: ["passport", "expiryDate"],
      label: "Expiry Date",
      isDateField: true,
    },
  ],

  CERTIFICATE_OF_INCORPORATION: [
    { aiKey: "companyName", formPath: ["name"], label: "Company Name" },
    {
      aiKey: "registrationNumber",
      formPath: ["registrationNumber"],
      label: "Registration Number",
    },
    {
      aiKey: "countryOfIncorporation",
      formPath: ["countryOfIncorporation"],
      label: "Country of Incorporation",
      isCountryField: true,
    },
  ],

  FS4: [
    {
      aiKey: "employeeName",
      formPath: ["employeeName"],
      label: "Employee Name",
    },
    { aiKey: "ppsNumber", formPath: ["ppsNumber"], label: "PPS Number" },
    {
      aiKey: "employerName",
      formPath: ["employerName"],
      label: "Employer Name",
    },
    { aiKey: "payPeriod", formPath: ["payPeriod"], label: "Pay Period" },
    { aiKey: "taxYear", formPath: ["taxYear"], label: "Tax Year" },
    { aiKey: "grossPay", formPath: ["grossPay"], label: "Gross Pay" },
    { aiKey: "netPay", formPath: ["netPay"], label: "Net Pay" },
    { aiKey: "taxPaid", formPath: ["taxPaid"], label: "Tax Paid" },
  ],

  PAYSLIP: [
    {
      aiKey: "employeeName",
      formPath: ["employeeName"],
      label: "Employee Name",
    },
    {
      aiKey: "nationalInsuranceNumber",
      formPath: ["nationalInsuranceNumber"],
      label: "National Insurance Number",
    },
    {
      aiKey: "employerName",
      formPath: ["employerName"],
      label: "Employer Name",
    },
    {
      aiKey: "payDate",
      formPath: ["payDate"],
      label: "Pay Date",
      isDateField: true,
    },
    { aiKey: "payPeriod", formPath: ["payPeriod"], label: "Pay Period" },
    { aiKey: "grossPay", formPath: ["grossPay"], label: "Gross Pay" },
    { aiKey: "netPay", formPath: ["netPay"], label: "Net Pay" },
    { aiKey: "taxPaid", formPath: ["taxPaid"], label: "Tax Paid" },
  ],

  P45: [
    {
      aiKey: "employeeName",
      formPath: ["employeeName"],
      label: "Employee Name",
    },
    {
      aiKey: "nationalInsuranceNumber",
      formPath: ["nationalInsuranceNumber"],
      label: "National Insurance Number",
    },
    {
      aiKey: "employerName",
      formPath: ["employerName"],
      label: "Employer Name",
    },
    {
      aiKey: "leavingDate",
      formPath: ["leavingDate"],
      label: "Leaving Date",
      isDateField: true,
    },
    {
      aiKey: "payeReference",
      formPath: ["payeReference"],
      label: "PAYE Reference",
    },
    { aiKey: "totalPay", formPath: ["totalPay"], label: "Total Pay" },
    { aiKey: "taxPaid", formPath: ["taxPaid"], label: "Tax Paid" },
  ],

  VAT_CERTIFICATE: [
    { aiKey: "companyName", formPath: ["companyName"], label: "Company Name" },
    { aiKey: "vatNumber", formPath: ["vatNumber"], label: "VAT Number" },
    {
      aiKey: "country",
      formPath: ["country"],
      label: "Country",
      isCountryField: true,
    },
    {
      aiKey: "effectiveDate",
      formPath: ["effectiveDate"],
      label: "Effective Date",
      isDateField: true,
    },
    {
      aiKey: "registrationNumber",
      formPath: ["taxRegistrationNumberIreland"],
      label: "Tax Registration Number",
    },
  ],

  DRIVING_LICENCE: [
    { aiKey: "firstName", formPath: ["drivingLicence", "firstName"], label: "First Name" },
    { aiKey: "lastName", formPath: ["drivingLicence", "lastName"], label: "Last Name" },
    { aiKey: "dateOfBirth", formPath: ["drivingLicence", "dateOfBirth"], label: "Date of Birth", isDateField: true },
    { aiKey: "licenceNumber", formPath: ["drivingLicence", "number"], label: "Licence Number" },
    { aiKey: "expiryDate", formPath: ["drivingLicence", "expiryDate"], label: "Licence Expiry Date", isDateField: true },
    {
      aiKey: "issuingCountry",
      formPath: ["drivingLicence", "issuingCountry"],
      label: "Issuing Country",
      isCountryField: true,
    },
    { aiKey: "address", formPath: ["drivingLicence", "address"], label: "Address" },
  ],

  VEHICLE_INSURANCE: [
    { aiKey: "providerName", formPath: ["vehicleInsurance", "providerName"], label: "Insurance Provider" },
    { aiKey: "policyNumber", formPath: ["vehicleInsurance", "policyNumber"], label: "Policy Number" },
    { aiKey: "insuredName", formPath: ["vehicleInsurance", "insuredName"], label: "Insured Name" },
    { aiKey: "vehicleRegistration", formPath: ["vehicleInsurance", "registration"], label: "Vehicle Registration" },
    {
      aiKey: "effectiveDate",
      formPath: ["vehicleInsurance", "effectiveDate"],
      label: "Policy Effective Date",
      isDateField: true,
    },
    {
      aiKey: "expiryDate",
      formPath: ["vehicleInsurance", "expiryDate"],
      label: "Policy Expiry Date",
      isDateField: true,
    },
    { aiKey: "providerAddress", formPath: ["vehicleInsurance", "providerAddress"], label: "Provider Address" },
  ],

  BIRTH_CERTIFICATE: [],
  NI_PROOF: [],
  CERTIFICATE_OF_NATURALISATION: [],
};

export const getNestedValue = (obj, path) => {
  const keys = Array.isArray(path) ? path : path.split(".");
  return keys.reduce((acc, key) => acc?.[key], obj);
};

export function setNestedValue(obj, path, value) {
  const keys = Array.isArray(path) ? path : path.split(".");

  const result = { ...obj };

  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    current[key] = { ...(current[key] || {}) };

    current = current[key];
  }

  current[keys[keys.length - 1]] = value;

  return result;
}

export const mergeAIFields = ({ currentForm, aiFields, documentType }) => {
  const fieldMap = FIELD_MAPS[documentType] ?? [];
  const autoFilled = [];
  const conflicts = [];

  let updatedForm = currentForm || {};

  for (const mapping of fieldMap) {
    let aiValue = aiFields?.[mapping.aiKey];

    if (aiValue === null || aiValue === undefined || aiValue === "") {
      continue;
    }

    if (mapping.isCountryField) {
      aiValue = getCountryCode(aiValue) || aiValue;
    }

    const currentValue = getNestedValue(currentForm, mapping.formPath);

    if (
      currentValue === null ||
      currentValue === undefined ||
      currentValue === ""
    ) {
      updatedForm = setNestedValue(updatedForm, mapping.formPath, aiValue);

      autoFilled.push({
        ...mapping,
        aiValue,
      });
    } else {
      let curr = currentValue;
      let ai = aiValue;

      // Normalize date fields
      if (mapping.isDateField) {
        curr = normalizeDate(curr);
        ai = normalizeDate(ai);
      } else {
        curr = String(curr).trim().toLowerCase();
        ai = String(ai).trim().toLowerCase();
      }

      if (curr !== ai) {
        conflicts.push({
          ...mapping,
          currentValue,
          aiValue,
        });
      }
    }
  }

  return { updatedForm, autoFilled, conflicts };
};

export const normalizeAIFieldsForMerge = (rawFields) => {
  if (!rawFields) return null;

  return Object.fromEntries(
    Object.entries(rawFields).map(([key, val]) => {
      if (
        val &&
        typeof val === "object" &&
        ("aiValue" in val || "finalValue" in val)
      ) {
        return [key, val.finalValue ?? val.aiValue ?? null];
      }
      return [key, val]; // already flat — temp-scan format
    }),
  );
};

export const buildDocumentAiExtraction = (
  rawAiFields,
  formSection,
  documentType,
) => {
  if (!rawAiFields) return null;

  // console.log("form values in document extraction builder:", formSection);

  const fieldMap = FIELD_MAPS[documentType] ?? [];

  const fields = Object.fromEntries(
    fieldMap.map((mapping) => {
      const formKey = mapping.formPath[mapping.formPath.length - 1];
      return [
        mapping.aiKey,
        {
          aiValue: rawAiFields[mapping.aiKey] ?? null,
          finalValue: getNestedValue(formSection, mapping.formPath) ?? null,
        },
      ];
    }),
  );

  return {
    status: "COMPLETED",
    provider: "GEMINI",
    scannedAt: new Date().toISOString(),
    fields,
  };
};
