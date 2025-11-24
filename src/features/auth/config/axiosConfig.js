import axios from "axios";
import { toast } from "sonner";
import { triggerGlobalLogout } from "./globalLogoutConfig";

export const baseURL = import.meta.env.VITE_API_URL;

const toastCache = new Map();
const TOAST_COOLDOWN = 5000;

function showDebouncedToast(type, title, description, duration = 6000) {
  const key = `${type}-${title}`;
  const now = Date.now();

  if (toastCache.has(key)) {
    const lastShown = toastCache.get(key);
    if (now - lastShown < TOAST_COOLDOWN) return;
  }

  toastCache.set(key, now);

  if (type === "error") {
    toast.error(title, { description, duration });
  } else if (type === "warning") {
    toast.warning(title, { description, duration });
  }
}

export const axiosConfig = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

// ---- RESPONSE INTERCEPTOR ----
axiosConfig.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // ACCESS TOKEN EXPIRED → REFRESH
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refreshtoken")
    ) {
      originalRequest._retry = true;

      try {
        await axiosConfig.post("/refreshtoken");
        return axiosConfig(originalRequest);
      } catch (err) {
        console.log("Refresh token failed", err);
        if (err.response?.status === 403) {
          triggerGlobalLogout();

          showDebouncedToast(
            "error",
            "You have Been Logged Out",
            "Your session has expired. Please log in again."
          );
        }

        return Promise.reject(err);
      }
    }

    // ---- SERVER ERRORS / NETWORK ----
    const isServerError = !error.response || error.response?.status >= 500;

    if (isServerError) {
      const errorData = error.response?.data;
      if (
        errorData?.error === "DATABASE_UNAVAILABLE" ||
        errorData?.error === "DATABASE_TIMEOUT"
      ) {
        showDebouncedToast(
          "warning",
          "Database Maintenance",
          "Our servers are temporarily down for maintenance. Please try again in a few minutes.",
          8000
        );
      } else if (errorData?.error === "DATABASE_CONNECTION_ERROR") {
        showDebouncedToast(
          "warning",
          "Connection Issue",
          "🌐 Database connection issue detected. Please try again in a moment.",
          8000
        );
      } else if (!error.response) {
        if (navigator.onLine) {
          showDebouncedToast(
            "error",
            "Network Error",
            "Unable to connect to server. Please check your internet connection."
          );
        }
      } else if (error.response.status >= 500) {
        showDebouncedToast(
          "error",
          "Server Error",
          "Server error occurred. Our team has been notified. Please try again later."
        );
      }
    }

    return Promise.reject(error);
  }
);
