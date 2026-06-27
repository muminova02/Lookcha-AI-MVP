import axios, { AxiosError } from "axios";
import type { ApiError } from "@/types";

const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8000";

/**
 * Shared Axios instance. All API modules import this.
 *
 * Note: we intentionally do NOT set a default `Content-Type`. Axios then sets
 * `application/json` for plain-object bodies and `multipart/form-data` with the
 * correct boundary for `FormData` bodies (needed by /tryon/upload-profile).
 */
export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
});

/** Pull a human-readable message out of a FastAPI error body. */
function extractMessage(error: AxiosError): string {
  const data = error.response?.data as
    | { detail?: unknown; message?: string }
    | undefined;

  if (data) {
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail) && data.detail.length > 0) {
      const first = data.detail[0] as { msg?: string };
      if (first?.msg) return first.msg;
    }
    if (typeof data.message === "string") return data.message;
  }

  if (error.code === "ECONNABORTED") return "So‘rov vaqti tugadi. Qayta urinib ko‘ring.";
  if (error.message === "Network Error")
    return "Serverga ulanib bo‘lmadi. Internet yoki backendni tekshiring.";

  return "Kutilmagan xatolik yuz berdi.";
}

// Normalize every rejected response into a consistent `ApiError`.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      status: error.response?.status ?? null,
      message: extractMessage(error),
      detail: (error.response?.data as { detail?: unknown } | undefined)?.detail,
    };
    return Promise.reject(apiError);
  },
);

export default apiClient;
