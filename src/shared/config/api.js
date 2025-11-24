// /**
//  * @file api.js
//  * @description Global Axios instance with token handling and error interceptors
//  */

// import axios from "axios";
// import { getApiUrl } from "../config/enviroment";
// import { getAccessToken, clearAuthData } from "../../features/auth/config/authUtilis";

// const api = axios.create({
//   baseURL: getApiUrl(),
//   withCredentials: true,
//   headers: { "Content-Type": "application/json" }
// });

// /** -------------------------------------
//  * PUBLIC ROUTES (no token required)
//  * ------------------------------------ */
// const PUBLIC_ENDPOINTS = [
//   "/invite/verify",
//   "/auth/login",
//   "/auth/login/temporary",
//   "/auth/login/verify-otp",
//   "/auth/password/set-password",
//   "/auth/password/reset-password",
//   "/auth/password/verify-otp",
//   "/auth/face/verify"
// ];

// /** Utility: check if a URL is public */
// const isPublicEndpoint = (url = "") =>
//   PUBLIC_ENDPOINTS.some((endpoint) => url.startsWith(endpoint));

// /** -------------------------------------
//  * REQUEST INTERCEPTOR
//  * ------------------------------------ */
// api.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken();

//     // Attach token only for non-public endpoints
//     if (token && !isPublicEndpoint(config.url)) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Let browser set FormData Content-Type
//     if (config.data instanceof FormData) {
//       delete config.headers["Content-Type"];
//     }

//     // Dev logs
//     if (process.env.NODE_ENV === "development") {
//       console.log(
//         `[API] ${config.method?.toUpperCase()} → ${config.url}`,
//         config.data instanceof FormData
//           ? { formDataKeys: Array.from(config.data.keys()) }
//           : config.data || ""
//       );
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /** -------------------------------------
//  * RESPONSE INTERCEPTOR
//  * ------------------------------------ */
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const status = error.response?.status;
//     const devMode = JSON.parse(localStorage.getItem("devMode") || "false");

//     // ------------------------------
//     // HANDLE 401 UNAUTHORIZED
//     // ------------------------------
//     if (status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (devMode) {
//         console.warn("[API] Dev mode → ignoring 401:", originalRequest.url);
//         return Promise.resolve({ data: null });
//       }

//       // ❗ If refresh token logic exists, add it here
//       // try {
//       //   await refreshAccessToken();
//       //   return api(originalRequest);
//       // } catch (_) { }

//       // Logout fallback
//       clearAuthData();
//       window.location.assign("/auth/login");

//       return Promise.reject(error);
//     }

//     // ------------------------------
//     // DEV LOGGING
//     // ------------------------------
//     if (process.env.NODE_ENV === "development") {
//       console.error(
//         `[API ERROR] ${status || ""} → ${
//           error.response?.data?.message || error.message
//         } (${originalRequest?.url})`
//       );
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;




