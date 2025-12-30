/**
 * @file environment.js
 * @description Handles environment-based API URL configuration for Vite
 */

export const currentEnv = import.meta.env.VITE_APP_ENV || "development";

// 🧭 Map each environment to its base API URL
const apiUrlMap = {
  development: import.meta.env.VITE_APP_API_DEV,
  staging: import.meta.env.VITE_APP_API_STAGING,
  production: import.meta.env.VITE_APP_API_PROD,
};

/**
 * Get the correct API base URL based on current environment.
 */
export default function getApiUrl() {
  const apiUrl =
    apiUrlMap[currentEnv] ||
    import.meta.env.VITE_APP_API_DEV ||
    "http://localhost:5000/api/v1";

  if (!apiUrl.startsWith("http")) {
    console.warn(
      `⚠️ Invalid API URL detected: "${apiUrl}". Falling back to localhost.`
    );
    return "http://localhost:5000/api/v1";
  }
  if (currentEnv === "development") {
    console.log(
      `%c🌍 EAARTH Environment: %c${currentEnv}%c → API: %c${apiUrl}`,
      "color: cyan; font-weight: bold;",
      "color: yellow; font-weight: bold;",
      "color: white;",
      "color: lightgreen; font-weight: bold;"
    );
  }

  return apiUrl;
}

// Environment flags
export const isDevelopment = () => currentEnv === "development";
export const isStaging = () => currentEnv === "staging";
export const isProduction = () => currentEnv === "production";
