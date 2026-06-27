import apiClient from "./apiClient";
import type { MerchantDashboard, QrLink } from "@/types";

export async function getMerchantDashboard(): Promise<MerchantDashboard> {
  const { data } = await apiClient.get<MerchantDashboard>("/merchant/dashboard");
  return data;
}

export async function getQrLink(): Promise<QrLink> {
  const { data } = await apiClient.get<QrLink>("/merchant/qr-link");
  return data;
}
