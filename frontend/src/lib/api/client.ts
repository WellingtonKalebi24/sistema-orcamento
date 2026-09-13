import axios from "axios";

import { useAuthStore } from "../../store/auth.store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthRequest = /\/auth\/(login|refresh|logout)(?:[?#]|$)/.test(original?.url ?? "");
    if (error.response?.status === 401 && original && !original._retry && !isAuthRequest) {
      original._retry = true;
      try {
        const response = await api.post("/auth/refresh");
        useAuthStore.getState().setSession(response.data.data.accessToken, response.data.data.user);
        return api(original);
      } catch {
        useAuthStore.getState().clearSession();
      }
    }
    return Promise.reject(error);
  },
);
