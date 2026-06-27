import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/services/orders.api";
import type { ApiError, Order, OrderCreate } from "@/types";

export function useCreateOrder() {
  return useMutation<Order, ApiError, OrderCreate>({
    mutationFn: createOrder,
  });
}
