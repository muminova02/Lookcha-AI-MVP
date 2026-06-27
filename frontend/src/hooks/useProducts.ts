import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts } from "@/services/products.api";
import { queryKeys } from "./queryKeys";
import type { ApiError, Product } from "@/types";

export function useProducts() {
  return useQuery<Product[], ApiError>({
    queryKey: queryKeys.products,
    queryFn: getProducts,
  });
}

export function useProduct(id: string) {
  return useQuery<Product, ApiError>({
    queryKey: queryKeys.product(id),
    queryFn: () => getProduct(id),
    enabled: Boolean(id),
  });
}
