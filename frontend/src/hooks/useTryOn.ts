import { useMutation } from "@tanstack/react-query";
import { generateTryOn, uploadProfile } from "@/services/tryon.api";
import type {
  ApiError,
  ProfileUploadResponse,
  TryOnGenerateRequest,
  TryOnResult,
} from "@/types";

export function useUploadProfile() {
  return useMutation<ProfileUploadResponse, ApiError, FormData>({
    mutationFn: uploadProfile,
  });
}

export function useGenerateTryOn() {
  return useMutation<TryOnResult, ApiError, TryOnGenerateRequest>({
    mutationFn: generateTryOn,
  });
}
