import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format";

interface ProductCardProps {
  product: Product & { match_score?: number };
  onOpen: () => void;
  onTryOn: () => void;
}

export default function ProductCard({ product, onOpen, onTryOn }: ProductCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="group overflow-hidden rounded-product border border-border/40 bg-surface soft-shadow transition-transform duration-300 hover:-translate-y-1">
      {/* Image (single, clear — never a collage) */}
      <button onClick={onOpen} className="relative block w-full" aria-label={product.name}>
        <img
          src={product.image_url}
          alt={product.name}
          className="h-48 w-full object-cover sm:h-56"
        />
        {typeof product.match_score === "number" && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-soft-pink px-2.5 py-1 text-xs font-bold text-ink shadow-sm">
            {product.match_score}% mos
          </span>
        )}
        <span
          onClick={(e) => {
            e.stopPropagation();
            setSaved((s) => !s);
          }}
          className={cn(
            "absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-surface/85 text-base backdrop-blur-sm transition-colors",
            saved ? "text-error" : "text-muted hover:text-error",
          )}
          role="button"
          aria-label="Saqlash"
        >
          {saved ? "♥" : "♡"}
        </span>
      </button>

      {/* Body */}
      <div className="p-3">
        <button onClick={onOpen} className="block w-full text-left">
          <p className="line-clamp-1 text-sm font-semibold text-ink">{product.name}</p>
          <p className="text-xs text-muted">{product.seller}</p>
          <p className="mt-1 text-sm font-bold text-primary">
            {formatPrice(product.price)}
          </p>
        </button>

        <button
          onClick={onTryOn}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-btn bg-primary-container/40 py-2 text-xs font-semibold text-on-primary-container transition-colors hover:bg-primary-container/60"
        >
          ✨ Kiyib ko‘rish
        </button>
      </div>
    </div>
  );
}
