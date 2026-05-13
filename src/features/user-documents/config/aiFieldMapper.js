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
  // BIRTH_CERTIFICATE and CERTIFICATE_OF_NATURALISATION upload documents only
  // (no inline form fields) so no mappings are needed in this section.
  BIRTH_CERTIFICATE: [],
  NI_PROOF: [],
  CERTIFICATE_OF_NATURALISATION: [],
};

// ─── Nested value helpers ─────────────────────────────────────────────────────

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

// ─── Core merge logic ─────────────────────────────────────────────────────────

/**
 * Merge AI-extracted fields into the current form state.
 *
 * Rules:
 *   - Empty fields   → auto-fill silently (logged in `autoFilled`)
 *   - Non-empty, different value → do NOT overwrite; surface in `conflicts`
 *   - Same value     → no action
 *
 * @param {{ currentForm: object, aiFields: object, documentType: string }}
 * @returns {{ updatedForm: object, autoFilled: Mapping[], conflicts: Conflict[] }}
 */
import { getCountryCode } from "@/shared/config/countriesDataConfig";
import { normalizeDate } from "../../../shared/config/utils";

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

/**
 * Normalise fields from a PERSISTED aiExtraction (structured { aiValue, finalValue })
 * into a flat format that mergeAIFields can consume, matching the temp-scan output.
 *
 * { firstName: { aiValue: "John", finalValue: "John" } }  →  { firstName: "John" }
 */
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

/**
 * Builds the aiExtraction payload to persist on UserDocument.
 * Maps AI field keys → { aiValue (original scan), finalValue (what user saved) }.
 *
 * @param {Record<string, any>} rawAiFields  — flat fields from the temp scan
 * @param {object}              formPassport — resolved form state at save time
 */
export const buildPassportAiExtraction = (rawAiFields, formPassport) => {
  if (!rawAiFields) return null;

  return {
    status: "COMPLETED",
    provider: "GEMINI",
    scannedAt: new Date().toISOString(),
    fields: {
      firstName: {
        aiValue: rawAiFields.firstName ?? null,
        finalValue: formPassport?.firstName ?? null,
      },
      lastName: {
        aiValue: rawAiFields.lastName ?? null,
        finalValue: formPassport?.lastName ?? null,
      },
      placeOfBirth: {
        aiValue: rawAiFields.placeOfBirth ?? null,
        finalValue: formPassport?.placeOfBirth ?? null,
      },
      issuingCountry: {
        aiValue: rawAiFields.issuingCountry ?? null,
        finalValue: formPassport?.issuingCountry ?? null,
      },
      passportNumber: {
        aiValue: rawAiFields.passportNumber ?? null,
        finalValue: formPassport?.number ?? null, // note: form uses "number"
      },
      expiryDate: {
        aiValue: rawAiFields.expiryDate ?? null,
        finalValue: formPassport?.expiryDate ?? null,
      },
      dateOfBirth: {
        aiValue: rawAiFields.dateOfBirth ?? null,
        finalValue: null, // not a passport form field
      },
      nationality: {
        aiValue: rawAiFields.nationality ?? null,
        finalValue: null,
      },
    },
  };
};
