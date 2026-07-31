import type { AxiosError } from "axios";
import { api } from "./axios.api";
import { useAuthStore } from "@/store/auth.store";

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use((response) => response,(error: AxiosError) => {
  
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();

      window.location.href = "/";
    }

     return Promise.reject(error);
  }
);