import { getRefreshToken, getToken, setToken } from "@/app/config/config";
import axios from "axios";
import { refreshToken } from "./auth";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

// Interceptor untuk menambahkan Authorization token di setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk handle refresh token otomatis jika 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Cegah infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await refreshToken(getRefreshToken());
        const newAccessToken = res.data.access_token;
        setToken(newAccessToken);

        // Set header dan ulangi request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error("Gagal refresh token global:", refreshErr);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
