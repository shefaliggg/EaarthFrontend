// Import the reasons if they exist in your project
// If you don't have this file, you'll need to create it or define the reasons here

// Temporary placeholder arrays - replace with actual imports if available
const STUDIO_SUSPENSION_REASONS = [
  { value: "violation", label: "Policy Violation" },
  { value: "payment", label: "Payment Issues" },
  { value: "security", label: "Security Concerns" },
];

const STUDIO_DEACTIVATION_REASONS = [
  { value: "request", label: "Client Request" },
  { value: "inactive", label: "Inactive Account" },
  { value: "other", label: "Other" },
];

const STUDIO_ADMIN_REMOVAL_REASONS = [
  { value: "resigned", label: "Resigned" },
  { value: "violation", label: "Policy Violation" },
  { value: "reassignment", label: "Role Reassignment" },
];

export const SUSPEND_STUDIO_CONFIG = {
  variant: "danger",
  title: "Would you like to Suspend this studio?",
  description: "The studio will lose access immediately.",
  confirmText: "Suspend",
  cancelText: "Cancel",
  reasons: STUDIO_SUSPENSION_REASONS,
  requireReason: true,
  allowNote: true,
};

export const DEACTIVATE_STUDIO_CONFIG = {
  variant: "warning",
  title: "Would you like to Deactivate this studio?",
  description: "This action can be reversed later.",
  confirmText: "Deactivate",
  cancelText: "Cancel",
  reasons: STUDIO_DEACTIVATION_REASONS,
  allowNote: true,
};

export const REACTIVATE_STUDIO_CONFIG = {
  variant: "success",
  title: "Would you like to activate this studio?",
  description: "The studio will regain full access.",
  confirmText: "Activate",
  cancelText: "Cancel",
};

export const REMOVE_STUDIO_ADMIN_CONFIG = {
  variant: "danger",
  title: "Would you like to Remove this Studio Admin?",
  description: "The studio admin will lose all access to this studio.",
  confirmText: "Remove",
  cancelText: "Cancel",
  reasons: STUDIO_ADMIN_REMOVAL_REASONS,
  requireReason: true,
  allowNote: true,
};

export const INITIALIZE_PROJECT_CONFIG = {
  variant: "info",
  title: "Initialize Project Creation?",
  description:
    "This will start the project setup process. An Eaarth official will contact you to review and finalize the details.",
  confirmText: "Initialize Project",
  cancelText: "Cancel",
  allowNote: true,
  notesPlaceholder:
    "Add any specific requirements or notes for the project setup...",
  successMessage:
    "Project creation initialized successfully! Our team will contact you soon.",
};

export const signatureReplaceConfig = {
  title: "Replace Existing Signature?",
  description:
    "You already have an active digital signature. Proceeding will revoke your current signature and make it invalid for future use. This action will create a new version of your signature for audit and verification purposes.",
  confirmText: "Continue & Replace",
  cancelText: "Keep Current",
  variant: "warning",

  reasons: [
    { label: "Update signature style", value: "UPDATED_SIGNATURE_STYLE" },
    { label: "Legal name change", value: "LEGAL_NAME_CHANGE" },
    { label: "Security concern", value: "SECURITY_COMPROMISE" },
    { label: "Preference change", value: "PREFERENCE_CHANGE" },
    { label: "Other", value: "OTHER" },
  ],

  requireReason: true,
  allowNote: true,
  requireNotes: true,
  notesPlaceholder:
    "Add any relevant details to support this change (e.g., reason, context, or justification).",
};

export const removeAgencyDetailsConfig = {
  title: "Disable agent and remove details?",
  description:
    "Turning off agent representation will clear all associated agency details such as contact and bank information. You can add them again later if needed.",
  confirmText: "Disable & clear",
  cancelText: "Keep details",
  variant: "danger",
};

export const removeCompanyDetailsConfig = {
  title: "Disable loan company details and remove data?",
  description:
    "Turning this off will remove all loan company details, including financial and company-related information. You can add them again later if needed.",
  confirmText: "Disable & clear",
  cancelText: "Keep details",
  variant: "danger",
};

export const removeVehicleAllowanceConfig = {
  title: "Disable vehicle allowance and remove details?",
  description:
    "Turning this off will remove all vehicle allowance details, including vehicle and allowance-related information. You can add them again later if needed.",
  confirmText: "Disable & clear",
  cancelText: "Keep details",
  variant: "danger",
};

export const statusConfigMap = {
  suspend: SUSPEND_STUDIO_CONFIG,
  deactivate: DEACTIVATE_STUDIO_CONFIG,
  activate: REACTIVATE_STUDIO_CONFIG,
};
