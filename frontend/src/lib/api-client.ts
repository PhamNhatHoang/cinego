// ═══════════════════════════════════════════════════════
//  CineGo API Client — Base HTTP wrapper
//  Auto-unwraps ApiResponse<T>.data, handles errors
// ═══════════════════════════════════════════════════════

import type { ApiResponse } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Get auth token from localStorage (if available) */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cinego_token");
}

/** Build headers with optional auth */
function buildHeaders(hasBody: boolean): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/** Core request function — unwraps ApiResponse<T> envelope */
async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const hasBody = body !== undefined && body !== null;

  const res = await fetch(url, {
    method,
    headers: buildHeaders(hasBody),
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  // Handle network / server errors
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const errorBody = (await res.json()) as ApiResponse<unknown>;
      if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, res.status);
  }

  // Parse response
  const json = (await res.json()) as ApiResponse<T>;

  if (!json.success) {
    throw new ApiError(json.message || "Unknown error", res.status);
  }

  return json.data;
}

// ── Public API ──────────────────────────────────────────

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),

  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),

  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),

  delete: <T>(path: string) => request<T>("DELETE", path),
};

export { ApiError };
export default apiClient;
