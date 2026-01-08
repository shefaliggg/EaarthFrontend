// src/crew/mocks/mockConfig.js

/**
 * Mock configuration for development and testing
 * Set USE_MOCK_DATA to false when connecting to real backend
 */

export const USE_MOCK_DATA = true;

export const MOCK_USER_ROLES = [
  "CREW",
  "PRODUCTION_ADMIN",
  "ACCOUNTS_ADMIN",
  "UPM",
  "FC",
  "STUDIO"
];

export const DEFAULT_MOCK_ROLE = "CREW";
export const DEFAULT_MOCK_STATUS = "SENT_TO_CREW";