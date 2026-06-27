/** Centralized React Query keys for cache consistency. */
export const queryKeys = {
  products: ["products"] as const,
  product: (id: string) => ["products", id] as const,
  recommendations: (productId: string) =>
    ["recommendations", productId] as const,
  merchantDashboard: ["merchant", "dashboard"] as const,
  qrLink: ["merchant", "qr-link"] as const,
};
