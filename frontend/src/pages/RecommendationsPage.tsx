import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import { Button, Spinner, EmptyState } from "@/components/ui";
import ProductCard from "@/components/ProductCard";
import { useRecommendations } from "@/hooks/useRecommendations";
import { fallbackRecommendations } from "@/data/fallback";
import { sectionTitles } from "@/data/uiCopy";
import type { RecommendationSection } from "@/types";

const DEFAULT_PRODUCT_ID = "premium-ipak-koylak";

const STYLE_CHIPS = [
  "Kundalik",
  "To‘y uchun",
  "Ofis style",
  "Menga mos ranglar",
  "Yana tavsiya ber",
];

const SECTION_ORDER: RecommendationSection[] = [
  "sizga_mos",
  "yoqishi_mumkin",
  "shu_dokondan",
  "oxshash",
];

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const productId = params.get("product_id") || DEFAULT_PRODUCT_ID;

  const { data, isLoading, isError, refetch } = useRecommendations(productId);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  // Use API data; fall back to demo so the page never breaks offline.
  const recs = data ?? (isError ? fallbackRecommendations : undefined);
  const usingFallback = !data && isError;

  if (isLoading && !recs) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-28">
          <Spinner size={36} label="Tavsiyalar tayyorlanmoqda..." />
        </div>
      </CustomerLayout>
    );
  }

  const products = recs?.products ?? [];

  function handleChip(chip: string) {
    setActiveChip((c) => (c === chip ? null : chip));
    if (chip === "Yana tavsiya ber") void refetch();
  }

  return (
    <CustomerLayout>
      <div className="animate-fade-in pb-4">
        {/* Back */}
        <button
          onClick={() => navigate(`/tryon-result?product_id=${productId}`)}
          className="mb-4 flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          ← Natijaga qaytish
        </button>

        <h1 className="mb-4 font-heading text-2xl font-semibold text-ink">
          Sizga mos tavsiyalar
        </h1>

        {usingFallback && (
          <div className="mb-4 rounded-card border border-border/40 bg-surface-container/60 px-4 py-2.5 text-xs text-muted">
            Demo tavsiyalar ko‘rsatilmoqda.
          </div>
        )}

        {/* AI stylist card */}
        <div className="mb-5 rounded-card-lg border border-primary/20 bg-gradient-to-br from-primary-container/25 to-soft-pink/10 p-5 soft-shadow">
          <div className="mb-2.5 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-on-primary">
              ✨
            </span>
            <h2 className="font-heading text-base font-semibold text-ink">
              AI stilist tavsiyasi
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-ink">
            {recs?.stylist_advice || fallbackRecommendations.stylist_advice}
          </p>
        </div>

        {/* Style chips */}
        <div className="no-scrollbar -mx-5 mb-6 flex gap-2 overflow-x-auto px-5">
          {STYLE_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChip(chip)}
              className={
                "flex-shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all " +
                (activeChip === chip
                  ? "border-primary bg-primary text-on-primary"
                  : "border-border bg-surface text-ink hover:border-primary")
              }
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Sections */}
        {products.length === 0 ? (
          <EmptyState
            title="Hozircha tavsiyalar yo‘q"
            description="Boshqa mahsulotni sinab ko‘ring."
            icon="🛍️"
            action={
              <Button onClick={() => navigate(`/product/${DEFAULT_PRODUCT_ID}`)}>
                Marketplace’ga qaytish
              </Button>
            }
          />
        ) : (
          SECTION_ORDER.map((section) => {
            const items = products.filter((p) => p.section === section);
            if (items.length === 0) return null;
            return (
              <section key={section} className="mb-7">
                <h3 className="mb-3 font-heading text-lg font-semibold text-ink">
                  {sectionTitles[section]}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {items.map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      onOpen={() => navigate(`/order/${item.id}`)}
                      onTryOn={() =>
                        navigate(`/upload-profile?product_id=${item.id}`)
                      }
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}

        {/* Back to marketplace */}
        <Button
          variant="outline"
          fullWidth
          className="mt-2"
          onClick={() => navigate(`/product/${DEFAULT_PRODUCT_ID}`)}
        >
          Marketplace’ga qaytish
        </Button>
      </div>
    </CustomerLayout>
  );
}
