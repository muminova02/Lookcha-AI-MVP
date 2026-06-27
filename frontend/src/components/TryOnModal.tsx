import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format";
import { Button } from "@/components/ui";

interface TryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const STEPS = [
  { n: 1, label: "To'liq gavda rasmini yuklang" },
  { n: 2, label: "O'lcham va style ma'lumotlarini kiriting" },
  { n: 3, label: "AI natijani ko'ring" },
];

export default function TryOnModal({ isOpen, onClose, product }: TryOnModalProps) {
  const navigate = useNavigate();

  // Lock body scroll when modal is open.
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — bottom-sheet on mobile, centered card on sm+ */}
      <div
        className={cn(
          "relative w-full max-w-lg animate-fade-in",
          "rounded-t-[28px] bg-surface",
          "sm:m-4 sm:rounded-[24px]",
        )}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pb-1 pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        <div className="px-6 pb-8 pt-4">
          {/* Header row */}
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary-container/50 px-3 py-1 text-xs font-semibold text-on-primary-container">
                ✨ Lookcha AI
              </span>
              <h2 className="font-heading text-xl font-semibold text-ink">
                Lookcha'da kiyib ko'rish
              </h2>
              <p className="mt-0.5 text-sm text-muted">
                Platformadan chiqmasdan kiyib ko'ring
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-container text-muted transition-colors hover:text-ink"
              aria-label="Yopish"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M13 1L1 13M1 1l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Selected product preview */}
          <div className="mb-6 flex items-center gap-3 rounded-card bg-surface-container/70 p-3">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-16 w-16 flex-shrink-0 rounded-[10px] object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
              <p className="text-xs text-muted">{product.seller}</p>
              <p className="mt-1 text-sm font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>
            <span className="ml-auto flex-shrink-0 rounded-full bg-primary-container/50 px-2.5 py-1 text-xs font-semibold text-on-primary-container">
              Tanlangan
            </span>
          </div>

          {/* Stepper */}
          <div className="mb-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Qanday ishlaydi
            </p>
            {STEPS.map((step) => (
              <div key={step.n} className="flex items-center gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-container/60 text-xs font-bold text-on-primary-container">
                  {step.n}
                </span>
                <span className="text-sm text-ink">{step.label}</span>
              </div>
            ))}
          </div>

          {/* Privacy note */}
          <p className="mb-5 rounded-card bg-surface-container/60 px-4 py-3 text-xs text-muted">
            🔒 Rasmingiz faqat kiyib ko'rish natijasini yaratish uchun ishlatiladi va
            saqlanmaydi.
          </p>

          {/* CTA */}
          <Button
            fullWidth
            size="lg"
            className="floating-shadow"
            onClick={() =>
              navigate(`/upload-profile?product_id=${product.id}`)
            }
          >
            Kiyib ko'rishni boshlash
          </Button>
        </div>
      </div>
    </div>
  );
}
