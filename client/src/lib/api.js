import axios from "axios";

const normalizeBaseUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
const defaultBaseUrl = `http://${host}:5001/api`;

export const API_BASE = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) || defaultBaseUrl;

export const api = axios.create({
  baseURL: API_BASE
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fit_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const checkBackendHealth = async () => {
  try {
    const { data } = await api.get("/health");
    return { connected: true, data };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};

