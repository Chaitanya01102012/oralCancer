import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isRemembered,
  setTokens,
} from "@/lib/auth-storage";
import { API_URL } from "@/lib/utils-app";
import type { ApiMessage, TokenData } from "@/types";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Let the browser set multipart/form-data with the correct boundary.
  // A default application/json Content-Type (or multipart without boundary) breaks uploads.
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    if (typeof config.headers.set === "function") {
      config.headers.set("Content-Type", false as unknown as string);
    } else {
      delete (config.headers as Record<string, unknown>)["Content-Type"];
    }
  }

  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const { data } = await axios.post<ApiMessage<TokenData>>(
      `${API_URL}/auth/refresh`,
      { refresh_token: refresh },
    );
    const tokens = data.data;
    if (!tokens?.access_token || !tokens.refresh_token) return null;
    setTokens(tokens.access_token, tokens.refresh_token, isRemembered());
    return tokens.access_token;
  } catch {
    clearTokens();
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      refreshing = refreshing ?? refreshAccessToken();
      const token = await refreshing;
      refreshing = null;

      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }

      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
