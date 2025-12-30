// src/features/auth/config/axiosConfig.js
import axios from "axios";
import { toast } from "sonner";
import { triggerGlobalLogout } from "./globalLogoutConfig";
import getApiUrl from "../../../shared/config/enviroment";
import { API_ROUTE } from "../../../constants/apiEndpoints";

export const baseURL = getApiUrl();

export const axiosConfig = axios.create({
  baseURL,
  withCredentials: true, // 🔐 required for cookies
  timeout: 20000,
});

/* -------------------------------------------------------------------------- */
/*                              Toast Handling                                */
/* -------------------------------------------------------------------------- */
const toastCache = new Map();
const TOAST_COOLDOWN = 5000;

const showToastOnce = (type, title, description, duration = 6000) => {
  const key = `${type}-${title}`;
  const now = Date.now();

  if (toastCache.has(key) && now - toastCache.get(key) < TOAST_COOLDOWN) return;
  toastCache.set(key, now);

  toast[type](title, { description, duration });
};

/* -------------------------------------------------------------------------- */
/*                          Refresh Token Handling                             */
/* -------------------------------------------------------------------------- */
let isRefreshing = false;
let refreshPromise = null;

/* -------------------------------------------------------------------------- */
/*                           RESPONSE INTERCEPTOR                              */
/* -------------------------------------------------------------------------- */
axiosConfig.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const errorCode = error.response?.data?.errorCode;

    /* ---------------------- SKIP AUTH ENDPOINTS ---------------------- */
    const skipRefreshRoutes = [
      API_ROUTE.AUTH.LOGIN,
      API_ROUTE.AUTH.TEMPORARY_LOGIN,
      API_ROUTE.AUTH.VERIFY_LOGIN_OTP,
      API_ROUTE.AUTH.SET_PASSWORD,
      API_ROUTE.AUTH.RESET_PASSWORD,
      API_ROUTE.AUTH.VERIFY_RESET_OTP,
      "/auth/refresh",
      "/auth/logout",
      "/auth/set-user-credential",
    ];

    const shouldSkip = skipRefreshRoutes.some((route) =>
      originalRequest.url?.includes(route)
    );

    if (shouldSkip) {
      return Promise.reject(error);
    }

    /* ---------------- ACCESS TOKEN EXPIRED → REFRESH ---------------- */
    if (
      status === 401 &&
      (errorCode === "ACCESS_TOKEN_EXPIRED" ||
        errorCode === "NO_ACCESS_TOKEN") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = axiosConfig
            .get("/auth/refresh")
            .finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
        }

        await refreshPromise;
        return axiosConfig(originalRequest);
      } catch (refreshError) {
        const refreshCode = refreshError.response?.data?.errorCode;

        if (
          refreshCode === "REFRESH_TOKEN_EXPIRED" ||
          refreshCode === "INVALID_REFRESH_TOKEN" ||
          refreshCode === "REFRESH_TOKEN_REVOKED"
        ) {
          triggerGlobalLogout();
          showToastOnce(
            "error",
            "Session Expired",
            "Please login again to continue."
          );
        }

        return Promise.reject(refreshError);
      }
    }

    /* --------------------- SERVER / NETWORK ERRORS -------------------- */
    if (!error.response || error.response.status >= 500) {
      showToastOnce(
        "error",
        "Server Error",
        "Something went wrong. Please try again later."
      );
    }

    return Promise.reject(error);
  }
);

export default axiosConfig;
