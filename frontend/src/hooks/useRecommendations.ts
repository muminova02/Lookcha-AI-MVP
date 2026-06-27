import { useQuery } from "@tanstack/react-query";
import { getRecommendations } from "@/services/recommendations.api";
import { queryKeys } from "./queryKeys";
import type { ApiError, RecommendationsResponse } from "@/types";

export function useRecommendations(productId: string) {
  return useQuery<RecommendationsResponse, ApiError>({
    queryKey: queryKeys.recommendations(productId),
    queryFn: () => getRecommendations(productId),
    enabled: Boolean(productId),
  });
}
