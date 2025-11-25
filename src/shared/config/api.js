import axios from "axios";
import  getApiUrl  from "../config/enviroment";

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

// Request Interceptor (NO AUTH)
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    console.error("[API ERROR]", status, error.message);
    return Promise.reject(error);
  }
);

export default api;
