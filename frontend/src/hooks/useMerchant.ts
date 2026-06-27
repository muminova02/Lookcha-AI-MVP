import { useQuery } from "@tanstack/react-query";
import { getMerchantDashboard, getQrLink } from "@/services/merchant.api";
import { queryKeys } from "./queryKeys";
import type { ApiError, MerchantDashboard, QrLink } from "@/types";

export function useMerchantDashboard() {
  return useQuery<MerchantDashboard, ApiError>({
    queryKey: queryKeys.merchantDashboard,
    queryFn: getMerchantDashboard,
  });
}

export function useQrLink() {
  return useQuery<QrLink, ApiError>({
    queryKey: queryKeys.qrLink,
    queryFn: getQrLink,
  });
}
