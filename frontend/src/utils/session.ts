/** Typed sessionStorage helpers for the try-on flow. */

import type { TryOnResult } from "@/types";
import {
  fallbackProduct,
  fallbackRecommendedProducts,
} from "@/data/fallback";

const KEY = "lookcha:tryon-result";

export function saveTryOnResult(result: TryOnResult): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(result));
  } catch {
    // sessionStorage may be unavailable (private mode); ignore.
  }
}

export function getTryOnResult(): TryOnResult | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TryOnResult) : null;
  } catch {
    return null;
  }
}

export function clearTryOnResult(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

/**
 * Build a demo try-on result from fallback data. Used when the backend is
 * unreachable or no stored result exists, so the prototype never dead-ends.
 */
export function buildFallbackTryOnResult(): TryOnResult {
  return {
    tryon_image_url: fallbackProduct.tryon_image_url,
    match_score: 88,
    size_recommendation: "M",
    color_match: "Juda yaxshi",
    advice:
      "Bu model sizning gavda tuzilishingizga mos tushadi. Uzunligi, bel qismi va umumiy silueti yaxshi ko‘rinmoqda.",
    product: fallbackProduct,
    recommended_products: fallbackRecommendedProducts,
  };
}
