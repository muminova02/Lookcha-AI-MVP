import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MerchantLayout from "@/layouts/MerchantLayout";
import { Button, Spinner } from "@/components/ui";
import Toast from "@/components/Toast";
import { useQrLink } from "@/hooks/useMerchant";
import { fallbackQrLink } from "@/data/fallback";

const WIDGET_CODE = `<script src="https://lookcha.ai/widget.js" data-store="moda-uz" async></script>
<div class="lookcha-tryon"></div>`;

const SHARE_TARGETS = [
  { label: "Stories", icon: "📸" },
  { label: "Telegram", icon: "✈️" },
  { label: "Web", icon: "🌐" },
  { label: "Mahsulot", icon: "🛍️" },
];

export default function QrLinkPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQrLink();
  const [toast, setToast] = useState<string | null>(null);

  const q = data ?? (isError ? fallbackQrLink : undefined);
  const usingFallback = !data && isError;

  function copy(text: string, message: string) {
    void navigator.clipboard?.writeText(text).catch(() => undefined);
    setToast(message);
  }

  if (isLoading && !q) {
    return (
      <MerchantLayout>
        <div className="flex items-center justify-center py-28">
          <Spinner size={36} label="QR/link ma’lumotlari yuklanmoqda..." />
        </div>
      </MerchantLayout>
    );
  }

  if (!q) {
    return (
      <MerchantLayout>
        <div className="py-12">
          <Spinner size={36} label="QR/link ma’lumotlari yuklanmoqda..." />
        </div>
      </MerchantLayout>
    );
  }

  return (
    <MerchantLayout>
      <div className="animate-fade-in pb-6">
        <h1 className="mb-1 font-heading text-2xl font-semibold text-ink">
          QR kod va ulashish
        </h1>
        <p className="mb-5 text-sm text-muted">
          {q.store_name} · Mijozlarni try-on oqimiga yo‘naltiring
        </p>

        {usingFallback && (
          <div className="mb-4 rounded-card border border-border/40 bg-surface-container/60 px-4 py-2.5 text-xs text-muted">
            Demo QR/link ma’lumotlari ko‘rsatilmoqda.
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          {/* A. Store link */}
          <section className="rounded-card-lg border border-border/40 bg-surface p-5 soft-shadow">
            <h2 className="mb-3 font-heading text-base font-semibold text-ink">
              Do‘kon havolasi
            </h2>
            <div className="mb-3 flex items-center gap-2 rounded-btn border border-border bg-surface-container/50 px-3 py-2.5">
              <span className="truncate text-sm text-ink">{q.store_link}</span>
            </div>
            <div className="flex gap-2">
              <Button
                fullWidth
                onClick={() => copy(q.store_link, "Link nusxalandi")}
              >
                Linkni nusxalash
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => setToast("Ulashish oynasi ochilmoqda...")}
              >
                Ulashish
              </Button>
            </div>
          </section>

          {/* B. QR code */}
          <section className="rounded-card-lg border border-border/40 bg-surface p-5 soft-shadow">
            <h2 className="mb-3 font-heading text-base font-semibold text-ink">QR kod</h2>
            <div className="flex flex-col items-center">
              <div className="mb-3 rounded-card border border-border/40 bg-surface p-3">
                <img
                  src={q.qr_image_url}
                  alt="QR kod"
                  className="h-40 w-40 object-contain"
                />
              </div>
              <p className="mb-3 text-center text-xs text-muted">
                Mijozlar QR kod orqali kiyimlarni virtual kiyib ko‘rishi mumkin
              </p>
              <Button
                variant="outline"
                fullWidth
                onClick={() => setToast("QR kod yuklab olinmoqda...")}
              >
                QR kodni yuklab olish
              </Button>
            </div>
          </section>
        </div>

        {/* C. Quick share */}
        <section className="mt-5 rounded-card-lg border border-border/40 bg-surface p-5 soft-shadow">
          <h2 className="mb-4 font-heading text-base font-semibold text-ink">
            Tezkor ulashish
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SHARE_TARGETS.map((s) => (
              <button
                key={s.label}
                onClick={() => setToast("Ulashish oynasi ochilmoqda...")}
                className="flex flex-col items-center gap-2 rounded-card border border-border/40 bg-surface-container/40 py-4 transition-colors hover:border-primary hover:bg-primary-container/20"
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-sm font-medium text-ink">{s.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* D. Integration & code */}
        <section className="mt-5 rounded-card-lg border border-border/40 bg-surface p-5 soft-shadow">
          <h2 className="mb-4 font-heading text-base font-semibold text-ink">
            Integratsiya va Kod
          </h2>

          {/* Instagram bio link */}
          <div className="mb-4">
            <p className="mb-1.5 text-sm font-medium text-ink">Instagram bio uchun link</p>
            <div className="flex items-center gap-2 rounded-btn border border-border bg-surface-container/50 px-3 py-2.5">
              <span className="truncate text-sm text-muted">{q.instagram_bio_link}</span>
              <button
                onClick={() => copy(q.instagram_bio_link, "Link nusxalandi")}
                className="ml-auto flex-shrink-0 text-xs font-semibold text-primary hover:underline"
              >
                Nusxalash
              </button>
            </div>
          </div>

          {/* Widget embed code */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">
              Mahsulot sahifasiga qo‘shish kodi
            </p>
            <div className="overflow-hidden rounded-card border border-border/40 bg-ink/95">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                <span className="text-xs text-background/60">widget.html</span>
                <button
                  onClick={() => copy(WIDGET_CODE, "Kod nusxalandi")}
                  className="text-xs font-semibold text-primary-container hover:underline"
                >
                  Kodni nusxalash
                </button>
              </div>
              <pre className="overflow-x-auto px-4 py-3 text-xs leading-relaxed text-background/90">
                <code>{WIDGET_CODE}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* E. Traffic statistics */}
        <section className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-card-lg border border-border/40 bg-surface p-4 soft-shadow">
            <p className="text-xs text-muted">QR orqali kirgan mijozlar</p>
            <p className="mt-1 font-heading text-2xl font-bold text-ink">
              {q.stats.via_qr.toLocaleString("ru-RU").replace(/,/g, " ")}
            </p>
          </div>
          <div className="rounded-card-lg border border-border/40 bg-surface p-4 soft-shadow">
            <p className="text-xs text-muted">Link orqali try-on qilganlar</p>
            <p className="mt-1 font-heading text-2xl font-bold text-ink">
              {q.stats.via_link_tryon.toLocaleString("ru-RU").replace(/,/g, " ")}
            </p>
          </div>
        </section>

        {/* F. Main CTA */}
        <Button
          variant="outline"
          fullWidth
          className="mt-6"
          onClick={() => navigate("/merchant/dashboard")}
        >
          Do‘kon paneliga qaytish
        </Button>
      </div>

      <Toast message={toast} onDone={() => setToast(null)} />
    </MerchantLayout>
  );
}
