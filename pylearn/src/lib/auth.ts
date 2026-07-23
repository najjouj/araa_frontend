const TOKEN_KEY = "pylearn_token";

/**
 * Minimal client-side session handling: the JWT lives in localStorage and
 * is attached as a Bearer token on every API call. Good enough for an
 * MVP; if XSS resistance becomes a priority later, move to an httpOnly
 * cookie set by a Next.js route handler instead.
 */
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  return `${base}${path}`;
}

export async function authFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  return response;
}

export interface CurrentUser {
  id: string;
  email: string;
  display_name: string;
  role: "student" | "teacher" | "admin";
  preferred_locale: "en" | "ar";
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  if (!getToken()) return null;
  const response = await authFetch("/api/auth/me");
  if (!response.ok) return null;
  return response.json();
}
