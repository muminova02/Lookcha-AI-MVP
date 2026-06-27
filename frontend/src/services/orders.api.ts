import apiClient from "./apiClient";
import type { Order, OrderCreate } from "@/types";

export async function createOrder(payload: OrderCreate): Promise<Order> {
  const { data } = await apiClient.post<Order>("/orders", payload);
  return data;
}
