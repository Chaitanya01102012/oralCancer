const ACCESS_KEY = "occ_access_token";
const REFRESH_KEY = "occ_refresh_token";

function getStore(remember: boolean): Storage {
  return remember ? localStorage : sessionStorage;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY) ?? sessionStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY) ?? sessionStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string, remember: boolean) {
  clearTokens();
  const store = getStore(remember);
  store.setItem(ACCESS_KEY, access);
  store.setItem(REFRESH_KEY, refresh);
  localStorage.setItem("occ_remember", remember ? "1" : "0");
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}

export function isRemembered(): boolean {
  return localStorage.getItem("occ_remember") === "1";
}
