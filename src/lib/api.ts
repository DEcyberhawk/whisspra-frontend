// src/lib/api.ts
const BASE =
  (import.meta as any).env?.VITE_API_BASE?.replace(/\/+$/, "") ||
  (typeof window !== "undefined" ? window.location.origin : "");

type Options = RequestInit & { auth?: boolean };

export async function apiFetch<T = any>(path: string, opts: Options = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const headers = new Headers(opts.headers || {});
  headers.set("Content-Type", "application/json");

  if (opts.auth) {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  // Try JSON; fallback to text
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

// Convenience helpers
export const api = {
  get: <T = any>(p: string, o: Options = {}) => apiFetch<T>(p, { ...o, method: "GET" }),
  post: <T = any>(p: string, body?: any, o: Options = {}) =>
    apiFetch<T>(p, { ...o, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T = any>(p: string, body?: any, o: Options = {}) =>
    apiFetch<T>(p, { ...o, method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T = any>(p: string, body?: any, o: Options = {}) =>
    apiFetch<T>(p, { ...o, method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T = any>(p: string, o: Options = {}) => apiFetch<T>(p, { ...o, method: "DELETE" }),
};

export default api;
