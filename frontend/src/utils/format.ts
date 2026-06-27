/** Formatting helpers for Uzbek commerce UI. */

/** 450000 -> "450 000 so‘m" (space-grouped, never "UZS"). */
export function formatPrice(value: number): string {
  return `${groupThousands(value)} so‘m`;
}

/** 450000 -> "450 000" (no currency suffix). */
export function groupThousands(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** 88 -> "88%". */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** 4.8 -> "4.8" (one decimal). */
export function formatRating(value: number): string {
  return value.toFixed(1);
}

// Re-export the className helper so pages can import everything from utils.
export { cn } from "@/lib/cn";
