import { useNavigate } from "react-router-dom";
import MerchantLayout from "@/layouts/MerchantLayout";
import { Button, Badge, Spinner, EmptyState } from "@/components/ui";
import KpiCard from "@/components/KpiCard";
import TrafficBar from "@/components/TrafficBar";
import MerchantTable from "@/components/MerchantTable";
import { useMerchantDashboard } from "@/hooks/useMerchant";
import { fallbackDashboard } from "@/data/fallback";
import { formatPercent } from "@/utils/format";

function likelihoodStatus(score: number): { label: string; tone: "success" | "primary" | "neutral" } {
  if (score >= 90) return { label: "Yuqori qiziqish", tone: "success" };
  if (score >= 80) return { label: "Qiziqqan", tone: "primary" };
  return { label: "Ko‘rib chiqdi", tone: "neutral" };
}

export default function MerchantDashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useMerchantDashboard();

  const d = data ?? (isError ? fallbackDashboard : undefined);
  const usingFallback = !data && isError;

  if (isLoading && !d) {
    return (
      <MerchantLayout>
        <div className="flex items-center justify-center py-28">
          <Spinner size={36} label="Do‘kon ma’lumotlari yuklanmoqda..." />
        </div>
      </MerchantLayout>
    );
  }

  if (!d) {
    return (
      <MerchantLayout>
        <div className="py-12">
          <Spinner size={36} label="Do‘kon ma’lumotlari yuklanmoqda..." />
        </div>
      </MerchantLayout>
    );
  }

  const maxTryons = Math.max(...d.top_products.map((p) => p.tryons), 1);

  return (
    <MerchantLayout>
      <div className="animate-fade-in pb-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-ink">Do‘kon paneli</h1>
            <p className="text-sm text-muted">{d.store_name} · Lookcha AI hamkori</p>
          </div>
          <Button onClick={() => navigate("/merchant/qr-link")}>QR/Link yaratish</Button>
        </div>

        {usingFallback && (
          <div className="mb-4 rounded-card border border-border/40 bg-surface-container/60 px-4 py-2.5 text-xs text-muted">
            Demo dashboard ko‘rsatilmoqda.
          </div>
        )}

        {/* KPI cards */}
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard
            label="Bu oy try-on soni"
            value={d.kpis.tryon_count.toLocaleString("ru-RU").replace(/,/g, " ")}
            icon="✨"
            accent
          />
          <KpiCard label="Yangi leadlar" value={d.kpis.new_leads} icon="👥" />
          <KpiCard label="Oylik paket" value={d.kpis.plan} icon="📦" />
          <KpiCard
            label="Qolgan limit"
            value={d.kpis.remaining_limit.toLocaleString("ru-RU").replace(/,/g, " ")}
            hint="try-on"
            icon="⚡"
          />
        </div>

        {/* Integration status */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "API/Widget holati", value: d.integration.api_widget },
            { label: "QR/Link", value: d.integration.qr_link },
            { label: "Marketplace integratsiya", value: d.integration.marketplace },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-card border border-border/40 bg-surface px-4 py-3 soft-shadow"
            >
              <span className="text-sm text-muted">{row.label}</span>
              <Badge tone="success">● {row.value}</Badge>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* A. Traffic sources */}
          <section className="rounded-card-lg border border-border/40 bg-surface p-5 soft-shadow">
            <h2 className="mb-4 font-heading text-lg font-semibold text-ink">
              Trafik manbalari
            </h2>
            <div className="space-y-4">
              {d.traffic_sources.map((t) => (
                <TrafficBar
                  key={t.source}
                  label={t.source}
                  percent={t.percent}
                  value={t.visits}
                />
              ))}
            </div>
          </section>

          {/* B. Top products */}
          <section className="rounded-card-lg border border-border/40 bg-surface p-5 soft-shadow">
            <h2 className="mb-4 font-heading text-lg font-semibold text-ink">
              Eng ko‘p sinab ko‘rilgan mahsulotlar
            </h2>
            <div className="space-y-3">
              {d.top_products.map((p, i) => (
                <div key={p.product_id} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-container/40 text-xs font-bold text-on-primary-container">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-ink">
                        {p.name}
                      </span>
                      <span className="flex-shrink-0 text-xs text-muted">
                        {p.tryons} try-on
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(p.tryons / maxTryons) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* C. Interested customers */}
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Qiziqqan mijozlar
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/merchant/qr-link")}>
              Leadlarni ko‘rish
            </Button>
          </div>

          {d.interested_customers.length === 0 ? (
            <EmptyState
              title="Hali leadlar yo‘q"
              description="QR/link ulashib mijozlarni chaqiring."
              icon="👥"
              action={
                <Button onClick={() => navigate("/merchant/qr-link")}>
                  QR/Link yaratish
                </Button>
              }
            />
          ) : (
            <MerchantTable
              headers={["Mijoz", "Mahsulot", "Manba", "Xarid ehtimoli", "Status"]}
              rows={d.interested_customers.map((c) => {
                const st = likelihoodStatus(c.match_score);
                return [
                  <span className="font-medium">{c.name}</span>,
                  <span className="text-muted">{c.product}</span>,
                  <span className="text-muted">{c.source}</span>,
                  <span className="font-semibold text-primary">
                    {formatPercent(c.match_score)}
                  </span>,
                  <Badge tone={st.tone}>{st.label}</Badge>,
                ];
              })}
            />
          )}
        </section>

        {/* D + E: Conversion + AI advice */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-card-lg border border-border/40 bg-surface p-5 soft-shadow">
            <h2 className="mb-4 font-heading text-lg font-semibold text-ink">Conversion</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Try-on → Lead", value: d.conversion.tryon_to_lead },
                { label: "Lead → Buyurtma", value: d.conversion.lead_to_order },
                { label: "Umumiy", value: d.conversion.overall },
              ].map((c) => (
                <div key={c.label} className="rounded-card bg-surface-container/50 p-3">
                  <p className="font-heading text-xl font-bold text-primary">
                    {c.value}%
                  </p>
                  <p className="mt-0.5 text-xs leading-tight text-muted">{c.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-card-lg border border-primary/20 bg-gradient-to-br from-primary-container/25 to-soft-pink/10 p-5 soft-shadow">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-on-primary">
                ✨
              </span>
              <h2 className="font-heading text-base font-semibold text-ink">
                AI savdo tavsiyasi
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-ink">{d.ai_advice}</p>
          </section>
        </div>

        {/* Footer CTAs */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => navigate("/merchant/qr-link")}>QR/Link yaratish</Button>
          <Button variant="outline" onClick={() => navigate("/merchant/dashboard")}>
            Mahsulotlar
          </Button>
          <Button variant="outline" onClick={() => navigate("/merchant/dashboard")}>
            Leadlarni ko‘rish
          </Button>
        </div>
      </div>
    </MerchantLayout>
  );
}
