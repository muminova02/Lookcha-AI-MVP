import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import { Button, Spinner, ErrorState } from "@/components/ui";
import TryOnModal from "@/components/TryOnModal";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { formatPrice, formatRating, cn } from "@/utils/format";
import { fallbackProduct, fallbackProducts } from "@/data/fallback";
import { buttons } from "@/data/uiCopy";

export default function ProductPage() {
  const { id = "premium-ipak-koylak" } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useProduct(id);

  const { data: allProducts } = useProducts();

  // Use API data, fall back gracefully on error.
  const p = product ?? (isError ? fallbackProduct : undefined);
  const similar = (allProducts ?? fallbackProducts)
    .filter((x) => x.id !== id)
    .slice(0, 5);

  if (isLoading && !p) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center py-28">
          <Spinner size={36} label="Yuklanmoqda..." />
        </div>
      </CustomerLayout>
    );
  }

  if (!p) {
    return (
      <CustomerLayout>
        <ErrorState
          title="Mahsulot topilmadi"
          description="Bu mahsulot mavjud emas yoki o'chirilgan."
          onRetry={() => void refetch()}
          className="my-12"
        />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="animate-fade-in pb-4">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          ← Orqaga
        </button>

        {/* Product image */}
        <div className="relative mb-5 overflow-hidden rounded-product bg-surface-container">
          <img
            src={p.image_url}
            alt={p.name}
            className="h-72 w-full object-cover sm:h-96"
          />
          {/* Wishlist */}
          <button
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/80 text-lg text-muted backdrop-blur-sm transition-colors hover:text-primary"
            aria-label="Saqlash"
          >
            ♡
          </button>
          {/* Category chip */}
          <span className="absolute left-3 top-3 rounded-full bg-surface/80 px-2.5 py-1 text-xs font-semibold text-ink backdrop-blur-sm">
            {p.category}
          </span>
        </div>

        {/* Name + rating */}
        <div className="mb-1 flex items-start justify-between gap-2">
          <h1 className="font-heading text-2xl font-semibold leading-snug text-ink">
            {p.name}
          </h1>
          <div className="mt-1 flex flex-shrink-0 items-center gap-1 text-sm font-semibold text-amber-500">
            ★ {formatRating(p.rating)}
          </div>
        </div>

        {/* Seller */}
        <p className="mb-2 text-sm text-muted">{p.seller}</p>

        {/* Price */}
        <p className="mb-4 font-heading text-2xl font-bold text-primary">
          {formatPrice(p.price)}
        </p>

        {/* Delivery */}
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-success">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-xs">
            ✓
          </span>
          {p.delivery}
        </div>

        {/* Color */}
        <div className="mb-5">
          <p className="mb-2 text-sm font-medium text-ink">
            Rang:{" "}
            <span className="font-normal text-muted">{p.color}</span>
          </p>
          <span className="inline-flex h-8 items-center rounded-full border-2 border-primary px-3.5 text-xs font-semibold text-primary">
            {p.color}
          </span>
        </div>

        {/* Sizes */}
        <div className="mb-5">
          <p className="mb-2 text-sm font-medium text-ink">O'lcham tanlang:</p>
          <div className="flex flex-wrap gap-2">
            {p.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                className={cn(
                  "h-10 min-w-[2.75rem] rounded-btn border px-3.5 text-sm font-semibold transition-all duration-150",
                  selectedSize === size
                    ? "border-primary bg-primary text-on-primary shadow-sm"
                    : "border-border bg-surface text-ink hover:border-primary hover:text-primary",
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="mb-6 text-sm leading-relaxed text-muted">{p.description}</p>

        {/* ✨ Lookcha AI try-on card — must stand out */}
        <div className="mb-5 overflow-hidden rounded-card-lg border border-primary/25 bg-gradient-to-br from-primary-container/30 via-soft-pink/10 to-beige/20 soft-shadow">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg text-on-primary floating-shadow">
                ✨
              </span>
              <div className="flex-1">
                <p className="font-heading text-sm font-semibold text-ink">
                  Kiyim sizda qanday turishini oldindan ko'ring
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  AI yordamida virtual kiyib ko'ring — platformadan chiqmasdan.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="mt-3 w-full floating-shadow"
              onClick={() => setIsTryOnOpen(true)}
            >
              {buttons.tryOnLookcha}
            </Button>
          </div>

          {/* Mini social proof strip */}
          <div className="border-t border-primary/10 bg-primary-container/10 px-4 py-2">
            <p className="text-center text-xs text-on-primary-container/80">
              1 200+ xaridor bu mahsulotni virtual sinab ko'rdi
            </p>
          </div>
        </div>

        {/* Commerce buttons */}
        <div className="mb-8 flex gap-3">
          <Button variant="outline" fullWidth>
            {buttons.addToCart}
          </Button>
          <Button fullWidth>
            {buttons.buyNow}
          </Button>
        </div>

        {/* Similar products — horizontal scroll */}
        {similar.length > 0 && (
          <section>
            <h2 className="mb-3 font-heading text-lg font-semibold text-ink">
              O'xshash mahsulotlar
            </h2>
            <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
              {similar.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="w-36 flex-shrink-0 text-left"
                >
                  <div className="relative mb-2 overflow-hidden rounded-product">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-44 w-36 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <p className="line-clamp-2 text-xs font-medium leading-tight text-ink">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-primary">
                    {formatPrice(item.price)}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Try-on modal */}
      <TryOnModal
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        product={p}
      />
    </CustomerLayout>
  );
}
