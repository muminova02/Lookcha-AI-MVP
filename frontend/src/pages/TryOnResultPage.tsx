import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import { Button, Badge } from "@/components/ui";
import { formatPrice, formatPercent } from "@/utils/format";
import { getTryOnResult, buildFallbackTryOnResult } from "@/utils/session";
import { buttons, labels } from "@/data/uiCopy";
import type { TryOnResult } from "@/types";

const DEFAULT_PRODUCT_ID = "premium-ipak-koylak";

export default function TryOnResultPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const productId = params.get("product_id") || DEFAULT_PRODUCT_ID;

  // Load stored result; fall back to demo so the page never dead-ends.
  const result: TryOnResult = useMemo(
    () => getTryOnResult() ?? buildFallbackTryOnResult(),
    [],
  );

  const [imageFailed, setImageFailed] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const { product } = result;

  const analysis = [
    { label: labels.matchScore, value: formatPercent(result.match_score) },
    { label: labels.sizeRecommendation, value: result.size_recommendation },
    { label: labels.colorMatch, value: result.color_match },
  ];

  return (
    <CustomerLayout>
      <div className="animate-fade-in pb-4">
        {/* Back */}
        <button
          onClick={() => navigate(`/product/${productId}`)}
          className="mb-4 flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          ← {buttons.backToMarketplace}
        </button>

        <h1 className="mb-4 font-heading text-2xl font-semibold text-ink">
          Kiyib ko‘rish natijasi
        </h1>

        {/* ── Full-body try-on preview (the main value) ── */}
        <div className="relative mb-5 overflow-hidden rounded-product border border-border/40 bg-surface-container soft-shadow">
          <div className="absolute left-3 top-3 z-10">
            <Badge tone="primary">To‘liq obraz ko‘rinishi</Badge>
          </div>

          {imageFailed ? (
            <div className="flex h-[420px] w-full flex-col items-center justify-center bg-gradient-to-b from-beige/40 to-soft-pink/20 text-center">
              <span className="mb-3 text-6xl">🧍‍♀️</span>
              <p className="px-6 text-sm text-muted">
                Try-on rasmi yuklanmadi. Demo rasm ko‘rsatilmoqda.
              </p>
            </div>
          ) : (
            <img
              src={result.tryon_image_url}
              alt="To‘liq obraz ko‘rinishi"
              onError={() => setImageFailed(true)}
              className="mx-auto h-[420px] w-full bg-surface object-contain sm:h-[520px]"
            />
          )}

          {/* Small product overlay card */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-card bg-surface/90 p-2.5 backdrop-blur-md soft-shadow">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-12 w-12 flex-shrink-0 rounded-[8px] object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
              <p className="text-xs text-muted">
                {product.seller} · {product.color}
              </p>
            </div>
            <p className="flex-shrink-0 text-sm font-bold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>

        {/* ── AI analysis card ── */}
        <div className="mb-5 rounded-card-lg border border-primary/20 bg-gradient-to-br from-primary-container/20 to-surface p-5 soft-shadow">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-on-primary">
              ✨
            </span>
            <h2 className="font-heading text-lg font-semibold text-ink">
              AI moslik tahlili
            </h2>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2.5">
            {analysis.map((a) => (
              <div
                key={a.label}
                className="rounded-card border border-border/40 bg-surface p-3 text-center"
              >
                <p className="font-heading text-xl font-bold text-primary">{a.value}</p>
                <p className="mt-0.5 text-xs leading-tight text-muted">{a.label}</p>
              </div>
            ))}
          </div>

          {/* Match score bar */}
          <div className="mb-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${result.match_score}%` }}
              />
            </div>
          </div>

          {/* AI advice */}
          <div className="rounded-card bg-surface/70 p-3.5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
              {labels.aiAdvice}
            </p>
            <p className="text-sm leading-relaxed text-ink">{result.advice}</p>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            size="lg"
            className="col-span-2 floating-shadow"
            onClick={() => navigate(`/order/${product.id}`)}
          >
            {buttons.placeOrder}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(`/recommendations?product_id=${product.id}`)}
          >
            {buttons.tryAnother}
          </Button>
          <Button
            variant="outline"
            onClick={() => setSaved((s) => !s)}
            className={saved ? "border-success text-success" : undefined}
          >
            {saved ? "Saqlandi ✓" : buttons.save}
          </Button>
          <Button
            variant="ghost"
            className="col-span-2"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {buttons.backToMarketplace}
          </Button>
        </div>
      </div>
    </CustomerLayout>
  );
}
