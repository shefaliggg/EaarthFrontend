// src/features/chat/utils/Chattypemapper.js
// ✅ Maps backend conversation types to frontend UI types

/**
 * Maps backend conversation types to frontend UI types
 * Backend: PROJECT_ALL, DEPARTMENT, DIRECT
 * Frontend: all, group, dm
 */
export const mapConversationType = (backendType) => {
  const typeMap = {
    PROJECT_ALL: "all",
    DEPARTMENT: "group",
    DIRECT: "dm",
  };

  return typeMap[backendType] || "all";
};

/**
 * Maps frontend UI types back to backend types
 * Used when creating/updating conversations
 */
export const mapToBackendType = (frontendType) => {
  const typeMap = {
    all: "PROJECT_ALL",
    group: "DEPARTMENT",
    dm: "DIRECT",
  };

  return typeMap[frontendType] || "PROJECT_ALL";
};

/**
 * Determines which tab should be active based on conversation type
 */
export const getTabForConversationType = (type) => {
  if (type === "all" || type === "group") {
    return "all";
  }
  if (type === "dm") {
    return "personal";
  }
  return "all";
};