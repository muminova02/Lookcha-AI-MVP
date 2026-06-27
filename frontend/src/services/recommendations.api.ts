import apiClient from "./apiClient";
import type { RecommendationsResponse } from "@/types";

export async function getRecommendations(
  productId: string,
): Promise<RecommendationsResponse> {
  const { data } = await apiClient.get<RecommendationsResponse>(
    "/recommendations",
    { params: { product_id: productId } },
  );
  return data;
}
