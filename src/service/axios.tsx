import axios from "axios";
import { store } from "@/redux/store";
import { refreshToken } from "@/service/auth";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 ||
      (error.response?.status === 400 &&
        error?.response?.data?.message === "Invalid or expired token")
    ) {
      if (originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await refreshToken();
        if (newToken) {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return axios(originalRequest);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;