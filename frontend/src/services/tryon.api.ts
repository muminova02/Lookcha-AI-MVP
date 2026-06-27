import apiClient from "./apiClient";
import type {
  ProfileUploadResponse,
  TryOnGenerateRequest,
  TryOnResult,
} from "@/types";

export async function uploadProfile(
  formData: FormData,
): Promise<ProfileUploadResponse> {
  // Do not set Content-Type manually: axios derives the multipart boundary
  // from the FormData body automatically.
  const { data } = await apiClient.post<ProfileUploadResponse>(
    "/tryon/upload-profile",
    formData,
  );
  return data;
}

export async function generateTryOn(
  payload: TryOnGenerateRequest,
): Promise<TryOnResult> {
  const { data } = await apiClient.post<TryOnResult>("/tryon/generate", payload);
  return data;
}
