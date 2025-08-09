import axios from "axios";

// Prefer env on prod. Fallback to same-origin (useful if you proxy /api on Vercel).
export const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.replace(/\/+$/, "") ||
  (typeof window !== "undefined" ? window.location.origin : "");

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  timeout: 15000,
});

// Optional: interceptors for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    (config.headers ??= {})["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
