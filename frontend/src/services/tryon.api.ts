import apiClient from "./apiClient";
import type {
  ProfileUploadResponse,
  TryOnGenerateRequest,
  TryOnResult,
} from "@/types";

export async function uploadProfile(
  formData: FormData,
): Promise<ProfileUploadResponse> {
  const { data } = await apiClient.post<ProfileUploadResponse>(
    "/tryon/upload-profile",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function generateTryOn(
  payload: TryOnGenerateRequest,
): Promise<TryOnResult> {
  const { data } = await apiClient.post<TryOnResult>("/tryon/generate", payload);
  return data;
}
