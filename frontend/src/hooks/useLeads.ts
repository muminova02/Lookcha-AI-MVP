import { useMutation } from "@tanstack/react-query";
import { createLead } from "@/services/leads.api";
import type { ApiError, Lead, LeadCreate } from "@/types";

export function useCreateLead() {
  return useMutation<Lead, ApiError, LeadCreate>({
    mutationFn: createLead,
  });
}
