import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import { Button, Input, Select } from "@/components/ui";
import { useProduct } from "@/hooks/useProducts";
import { useGenerateTryOn, useUploadProfile } from "@/hooks/useTryOn";
import { fallbackProduct } from "@/data/fallback";
import { formatPrice, cn } from "@/utils/format";
import {
  buildFallbackTryOnResult,
  saveTryOnResult,
} from "@/utils/session";
import { states } from "@/data/uiCopy";

const DEFAULT_PRODUCT_ID = "premium-ipak-koylak";

const AGE_OPTIONS = [
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45+", label: "45+" },
];
const BODY_OPTIONS = [
  { value: "Nozik", label: "Nozik" },
  { value: "O‘rtacha", label: "O‘rtacha" },
  { value: "To‘ladan kelgan", label: "To‘ladan kelgan" },
  { value: "Sportcha", label: "Sportcha" },
];
const STYLE_OPTIONS = [
  { value: "Klassik", label: "Klassik" },
  { value: "Casual", label: "Casual" },
  { value: "Zamonaviy", label: "Zamonaviy" },
  { value: "Milliy", label: "Milliy" },
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const OCCASIONS = ["Kundalik", "Ish", "Tadbir", "Bayram"];

const PHOTO_RULES = [
  "Boshdan oyoqqacha ko‘rining",
  "Rasm yorug‘ joyda tushirilgan bo‘lsin",
  "Gavda to‘liq ko‘rinsin",
  "Yarim rasm yuklamang",
];

export default function UploadProfilePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const productId = params.get("product_id") || DEFAULT_PRODUCT_ID;

  const { data } = useProduct(productId);
  const product = data ?? fallbackProduct;

  const uploadProfile = useUploadProfile();
  const generateTryOn = useGenerateTryOn();

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [height, setHeight] = useState("165");
  const [weight, setWeight] = useState("55");
  const [ageRange, setAgeRange] = useState("18-24");
  const [usualSize, setUsualSize] = useState("M");
  const [bodyType, setBodyType] = useState("O‘rtacha");
  const [style, setStyle] = useState("Klassik");
  const [occasion, setOccasion] = useState("Kundalik");

  function handleFile(selected: File | null) {
    if (!selected) return;
    setFile(selected);
    setPhotoError(null);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function goToResult() {
    navigate(`/tryon-result?product_id=${productId}`);
  }

  async function handleSubmit() {
    setSubmitError(null);

    if (!file) {
      setPhotoError(states.uploadError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsProcessing(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);
      fd.append("height_cm", height);
      fd.append("weight_kg", weight);
      fd.append("age_range", ageRange);
      fd.append("usual_size", usualSize);
      fd.append("body_type", bodyType);
      fd.append("style", style);
      fd.append("occasion", occasion);

      const { profile_id } = await uploadProfile.mutateAsync(fd);
      const result = await generateTryOn.mutateAsync({
        product_id: productId,
        profile_id,
      });

      saveTryOnResult(result);
      goToResult();
    } catch (err) {
      const status = (err as { status?: number | null })?.status ?? null;

      // Network / server unreachable → demo fallback so the prototype works offline.
      if (status === null) {
        await new Promise((r) => setTimeout(r, 1200));
        saveTryOnResult(buildFallbackTryOnResult());
        goToResult();
        return;
      }

      // Server responded with an error → show message, let user retry.
      setSubmitError(states.uploadError);
      setIsProcessing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

        {/* Selected product preview */}
        <div className="mb-6 flex items-center gap-3 rounded-card border border-border/40 bg-surface p-3 soft-shadow">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-16 w-16 flex-shrink-0 rounded-[10px] object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
            <p className="text-xs text-muted">{product.seller}</p>
            <p className="mt-0.5 text-sm font-bold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>
          <span className="ml-auto flex-shrink-0 rounded-full bg-primary-container/50 px-2.5 py-1 text-xs font-semibold text-on-primary-container">
            Tanlangan
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-1.5 font-heading text-2xl font-semibold text-ink">
          To‘liq gavda rasmini yuklang
        </h1>
        <p className="mb-5 text-sm leading-relaxed text-muted">
          Kiyim sizda qanday turishini yaxshiroq ko‘rsatish uchun rasmda boshdan
          oyoqqacha to‘liq ko‘rining.
        </p>

        {/* Validation warning (photo missing) */}
        {photoError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-card border border-error/30 bg-error-container/40 p-3.5 text-sm text-ink">
            <span className="mt-0.5 flex-shrink-0">⚠️</span>
            <p>
              Yarim rasm mos emas. AI kiyimni to‘liq ko‘rsatishi uchun boshdan
              oyoqqacha rasm yuklang.
            </p>
          </div>
        )}

        {submitError && (
          <div className="mb-5 flex items-start gap-2.5 rounded-card border border-error/30 bg-error-container/40 p-3.5 text-sm text-ink">
            <span className="mt-0.5 flex-shrink-0">⚠️</span>
            <p>{submitError}</p>
          </div>
        )}

        {/* Upload frame */}
        <label
          className={cn(
            "mb-5 flex cursor-pointer flex-col items-center justify-center rounded-card-lg border-2 border-dashed p-6 text-center transition-colors",
            photoError
              ? "border-error/50 bg-error-container/20"
              : "border-primary/40 bg-primary-container/10 hover:bg-primary-container/20",
          )}
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />

          {previewUrl ? (
            <div className="flex flex-col items-center">
              <img
                src={previewUrl}
                alt="Tanlangan rasm"
                className="mb-3 h-56 w-auto rounded-card object-contain"
              />
              <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                ✓ Rasm tanlandi
              </span>
              <span className="mt-1.5 text-xs text-muted">
                Boshqa rasm tanlash uchun bosing
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4">
              {/* Head-to-toe silhouette guide */}
              <div className="mb-3 flex h-32 w-20 items-center justify-center rounded-[16px] border-2 border-dashed border-primary/40 bg-surface">
                <span className="text-5xl">🧍</span>
              </div>
              <p className="text-sm font-semibold text-ink">
                Boshdan oyoqqacha rasm yuklang
              </p>
              <p className="mt-0.5 text-xs text-muted">PNG, JPG yoki WEBP · 10 MB gacha</p>
              <span className="mt-3 rounded-btn bg-primary px-4 py-2 text-xs font-semibold text-on-primary">
                Rasm tanlash
              </span>
            </div>
          )}
        </label>

        {/* Photo rules checklist */}
        <div className="mb-7 rounded-card border border-border/40 bg-surface-container/50 p-4">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted">
            Rasm qoidalari
          </p>
          <ul className="space-y-2">
            {PHOTO_RULES.map((rule) => (
              <li key={rule} className="flex items-center gap-2 text-sm text-ink">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-success/15 text-xs text-success">
                  ✓
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Profile form */}
        <h2 className="mb-3 font-heading text-lg font-semibold text-ink">
          O‘lcham va style ma’lumotlari
        </h2>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <Input
            label="Bo‘y (sm)"
            type="number"
            inputMode="numeric"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <Input
            label="Vazn (kg)"
            type="number"
            inputMode="numeric"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <Select
            label="Yosh oralig‘i"
            options={AGE_OPTIONS}
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
          />
          <Select
            label="Tana tuzilishi"
            options={BODY_OPTIONS}
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <Select
            label="Kiyim uslubi"
            options={STYLE_OPTIONS}
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          />
        </div>

        {/* Usual size chips */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-ink">Odatdagi razmer</p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setUsualSize(s)}
                className={cn(
                  "h-10 min-w-[2.75rem] rounded-btn border px-3.5 text-sm font-semibold transition-all",
                  usualSize === s
                    ? "border-primary bg-primary text-on-primary"
                    : "border-border bg-surface text-ink hover:border-primary",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion chips */}
        <div className="mb-7">
          <p className="mb-2 text-sm font-medium text-ink">
            Qaysi vaziyat uchun kiyim kerak?
          </p>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOccasion(o)}
                className={cn(
                  "h-10 rounded-btn border px-4 text-sm font-medium transition-all",
                  occasion === o
                    ? "border-primary bg-primary-container/40 text-on-primary-container"
                    : "border-border bg-surface text-ink hover:border-primary",
                )}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button
          fullWidth
          size="lg"
          className="floating-shadow"
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          AI natijani ko‘rish
        </Button>
      </div>

      {/* Processing overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="flex flex-col items-center px-8 text-center">
            <span className="mb-5 inline-block h-12 w-12 animate-spin rounded-full border-[4px] border-primary/25 border-t-primary" />
            <p className="font-heading text-lg font-semibold text-ink">
              {states.loadingTryOn}
            </p>
            <p className="mt-1.5 text-sm text-muted">
              Bu bir necha soniya davom etadi.
            </p>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
