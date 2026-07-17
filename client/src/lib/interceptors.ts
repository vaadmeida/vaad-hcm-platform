import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { api } from "./axios.api";

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

api.interceptors.response.use((response) => response,(error: AxiosError) => {
    
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);