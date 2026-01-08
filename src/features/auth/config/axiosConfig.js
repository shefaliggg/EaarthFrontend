import axios from "axios";
import { toast } from "sonner";
import getApiUrl from "@/shared/config/enviroment";
import { triggerGlobalLogout } from "./globalLogoutConfig";

export const isDevelopment = import.meta.env.VITE_APP_ENV === "development";

export const baseURL = getApiUrl();

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
  timeout: 20000,
});

const AUTH_EXCLUDED_ROUTES = [
  "/auth/login",
  "/auth/temp-login",
  "/auth/set-password",
  "/auth/upload-id",
  "/auth/live-photo",
  "/auth/identity-verification",
  "/auth/terms",
  "/auth/otp-verification",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/result",
  "/auth/refresh",
  "/auth/logout",
  "/invite/verify",
];

let isRefreshing = false;
let refreshPromise = null;

// ---- RESPONSE INTERCEPTOR ----
axiosConfig.interceptors.response.use(
  (response) => {
    // ✅ DEBUG: Log successful responses
    if (isDevelopment) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    const isAuthRoute = AUTH_EXCLUDED_ROUTES.some((route) =>
      originalRequest.url.includes(route)
    );

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const errorCode = error.response?.data?.errorCode;

    // ACCESS TOKEN EXPIRED → REFRESH
    if (
      status === 401 &&
      (errorCode === "ACCESS_TOKEN_EXPIRED" ||
        errorCode === "NO_ACCESS_TOKEN" ||
        errorCode === "INVALID_ACCESS_TOKEN") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      console.log('🔄 Attempting token refresh...');

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = axiosConfig.get("/auth/refresh").finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
        }

        await refreshPromise;

        // Retry original request after refresh
        return axiosConfig(originalRequest);
      } catch (err) {
        const refreshCode = err.response?.data?.errorCode;

        if (refreshCode === "REFRESH_TOKEN_MISSING") {
          console.info("[Auth] Refresh token missing → silent ignore");
          return Promise.reject(err);
        }

        if (
          refreshCode === "REFRESH_TOKEN_EXPIRED" ||
          refreshCode === "REFRESH_TOKEN_REVOKED" ||
          refreshCode === "INVALID_REFRESH_TOKEN"
        ) {
          triggerGlobalLogout();

          showDebouncedToast(
            "error",
            "Session expired",
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
