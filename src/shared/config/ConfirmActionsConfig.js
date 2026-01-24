// Import the reasons if they exist in your project
// If you don't have this file, you'll need to create it or define the reasons here
// import {
//   STUDIO_ADMIN_REMOVAL_REASONS,
//   STUDIO_DEACTIVATION_REASONS,
//   STUDIO_SUSPENSION_REASONS,
// } from "./studioStatusActionsReason";

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
  variant: "warning",
  title: "Would you like to Initialize Project Creation?",
  description: "An Official from Eaarth will contact you to finalize the project setup with the provided details.",
  confirmText: "Initialize Project",
  cancelText: "Cancel",
  allowNote: true,
  notesPlaceholder: "Add any specific details or requirements for the project...",
};

export const statusConfigMap = {
  suspend: SUSPEND_STUDIO_CONFIG,
  deactivate: DEACTIVATE_STUDIO_CONFIG,
  activate: REACTIVATE_STUDIO_CONFIG,
};