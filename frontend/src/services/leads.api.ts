import apiClient from "./apiClient";
import type { Lead, LeadCreate } from "@/types";

export async function createLead(payload: LeadCreate): Promise<Lead> {
  const { data } = await apiClient.post<Lead>("/leads", payload);
  return data;
}
