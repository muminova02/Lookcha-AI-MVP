import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Badge } from "@/components/ui";
import { buttons } from "@/data/uiCopy";

// ─────────────────────────────────────────────────────────────────────────────
// Static data for landing sections
// ─────────────────────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Integratsiya",
    body: "API yoki widget orqali 'Lookcha'da kiyib ko'rish' tugmasini mahsulot sahifangizga qo'shing.",
    icon: "⚡",
    color: "bg-primary-container/40 text-on-primary-container",
  },
  {
    n: "02",
    title: "Sinab ko'rish",
    body: "Xaridor to'liq gavda rasmini yuklaydi, AI esa kiyimni unga moslab ko'rsatadi — platformadan chiqmasdan.",
    icon: "✨",
    color: "bg-soft-pink/60 text-ink",
  },
  {
    n: "03",
    title: "Tahlil va lead",
    body: "Do'kon egasi try-on soni, qiziqgan mijozlar va trafik manbalarini real vaqtda ko'radi.",
    icon: "📊",
    color: "bg-beige text-ink",
  },
];

const STORE_BENEFITS = [
  { icon: "👗", text: "Kiyimni virtual sinab ko'rish imkoniyati" },
  { icon: "💬", text: "Xaridor bilan to'g'ridan-to'g'ri bog'lanish" },
  { icon: "📈", text: "Try-on → buyurtma konversiyasini kuzatish" },
  { icon: "🔗", text: "Instagram, Telegram va QR orqali trafik" },
];

const MARKETPLACE_BENEFITS = [
  { icon: "🛒", text: "Mahsulot sahifalarida AI try-on tajribasi" },
  { icon: "⏱️", text: "Xaridor platformadan chiqmaydi" },
  { icon: "📉", text: "Qaytarishlar kamayadi, ishonch ortadi" },
  { icon: "🤝", text: "Do'konlar uchun qo'shimcha qiymat" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hero mockup — purely CSS, no images needed
// ─────────────────────────────────────────────────────────────────────────────

function HeroMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary-container/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-36 w-36 rounded-full bg-soft-pink/30 blur-3xl" />

      {/* Browser frame */}
      <div className="relative overflow-hidden rounded-[20px] border border-border/40 bg-surface soft-shadow">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-border/30 bg-surface-container px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-error/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
          <div className="mx-auto rounded-full bg-surface px-6 py-1 text-[9px] text-muted">
            uz.marketplace.com/product/123
          </div>
        </div>

        {/* Marketplace product card */}
        <div className="p-4">
          <div className="flex gap-3">
            {/* Product image placeholder */}
            <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-[10px] bg-gradient-to-br from-primary-container/40 to-soft-pink/40">
              <div className="flex h-full w-full items-center justify-center text-3xl">
                👗
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-ink leading-snug mb-0.5">
                Premium ipak ko'ylak
              </p>
              <p className="text-[10px] text-muted mb-1.5">Moda UZ</p>
              <p className="text-xs font-bold text-primary">450 000 so'm</p>

              {/* Size chips */}
              <div className="mt-2 flex gap-1">
                {["S", "M", "L"].map((s) => (
                  <span
                    key={s}
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${
                      s === "M"
                        ? "border-primary bg-primary text-on-primary"
                        : "border-border text-muted"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Lookcha button — this is the hero of the mockup */}
          <div className="mt-3 overflow-hidden rounded-[10px] border border-primary/30 bg-gradient-to-r from-primary-container/40 to-soft-pink/20">
            <div className="flex items-center justify-between p-2.5">
              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary">
                  ✨
                </span>
                <span className="text-[10px] font-semibold text-ink">
                  Lookcha'da kiyib ko'rish
                </span>
              </div>
              <span className="text-[9px] font-bold text-primary">→</span>
            </div>
          </div>
        </div>

        {/* Floating result card */}
        <div className="mx-4 mb-4 overflow-hidden rounded-[12px] border border-border/40 bg-surface soft-shadow">
          <div className="flex items-center gap-1.5 border-b border-border/20 bg-primary-container/20 px-3 py-2">
            <span className="text-[10px]">✅</span>
            <span className="text-[10px] font-semibold text-on-primary-container">
              AI Natija tayyor
            </span>
          </div>
          <div className="flex gap-3 p-3">
            {/* Try-on preview placeholder */}
            <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-[8px] bg-gradient-to-b from-beige to-soft-pink/30">
              <div className="flex h-full w-full items-center justify-center text-xl">
                🧍‍♀️
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-1.5 flex items-center gap-1">
                <div className="h-1.5 flex-1 rounded-full bg-surface-container">
                  <div className="h-full w-[88%] rounded-full bg-primary" />
                </div>
                <span className="text-[9px] font-bold text-primary">88%</span>
              </div>
              <p className="text-[9px] text-muted leading-tight">
                AI moslik · M razmer · Rang: Juda yaxshi
              </p>
              <div className="mt-1.5 flex gap-1">
                <span className="rounded-full bg-primary px-2 py-0.5 text-[8px] font-semibold text-on-primary">
                  Buyurtma
                </span>
                <span className="rounded-full bg-surface-container px-2 py-0.5 text-[8px] font-semibold text-muted">
                  Saqlash
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Merchant analytics strip */}
        <div className="border-t border-border/30 bg-surface-container/60 px-4 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-semibold uppercase tracking-wide text-muted">
              Do'kon tahlili
            </span>
            <span className="text-[9px] text-muted">bugun</span>
          </div>
          <div className="mt-1.5 flex gap-3">
            {[
              { label: "Try-on", value: "24" },
              { label: "Leadlar", value: "7" },
              { label: "Konversiya", value: "5.7%" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[10px] font-bold text-ink">{stat.value}</p>
                <p className="text-[8px] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Landing page
// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="glass-header sticky top-0 z-40 border-b border-border/30">
        <div className="mx-auto flex max-w-app items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-btn bg-primary text-sm font-bold text-on-primary">
              L
            </span>
            <span className="font-heading text-lg font-semibold tracking-tight text-ink">
              Lookcha AI
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#how-it-works"
              className="text-sm text-muted transition-colors hover:text-primary"
            >
              Qanday ishlaydi
            </a>
            <a
              href="#benefits"
              className="text-sm text-muted transition-colors hover:text-primary"
            >
              Foyda
            </a>
          </nav>
          <Button size="sm" onClick={() => navigate("/merchant/dashboard")}>
            Boshlash
          </Button>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="mx-auto max-w-app px-5 pb-16 pt-12 lg:flex lg:items-center lg:gap-16 lg:pb-24 lg:pt-20">
          {/* Text */}
          <div className="mb-10 flex-1 lg:mb-0">
            <Badge tone="primary" className="mb-5">
              B2B Integratsiya · Uzbekistan
            </Badge>

            <h1 className="mb-5 font-heading text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Kiyim savdosi platformalari uchun{" "}
              <span className="text-primary">AI try-on</span> integratsiyasi
            </h1>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-muted">
              Marketplace, online do'kon va Instagram butiklarga{" "}
              <span className="font-medium text-ink">
                'Lookcha'da kiyib ko'rish'
              </span>{" "}
              tajribasini qo'shing. Xaridor platformadan chiqmasdan kiyimni virtual
              sinab ko'radi.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="floating-shadow"
                onClick={() => navigate("/product/premium-ipak-koylak")}
              >
                {buttons.viewDemo}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/merchant/dashboard")}
              >
                {buttons.startPartnership}
              </Button>
            </div>

            {/* Trust strip */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="text-success">✓</span> 1 200+ try-on bu oy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-success">✓</span> Instagram, Telegram, Marketplace
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-success">✓</span> 5 daqiqada integratsiya
              </span>
            </div>
          </div>

          {/* Mockup */}
          <div className="flex-1">
            <HeroMockup />
          </div>
        </section>

        {/* ── Qanday ishlaydi ── */}
        <section
          id="how-it-works"
          className="bg-surface-container/40 px-5 py-16"
        >
          <div className="mx-auto max-w-app">
            <div className="mb-10 text-center">
              <h2 className="mb-2 font-heading text-2xl font-semibold text-ink sm:text-3xl">
                Qanday ishlaydi?
              </h2>
              <p className="text-muted">
                Platformangizga Lookcha tajribasini qo'shish jarayoni.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {HOW_IT_WORKS.map((step) => (
                <div
                  key={step.n}
                  className="group rounded-card-lg border border-border/40 bg-surface p-6 soft-shadow transition-transform duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full text-xl ${step.color}`}
                  >
                    {step.icon}
                  </div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted">
                    {step.n}
                  </p>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section id="benefits" className="px-5 py-16">
          <div className="mx-auto max-w-app grid gap-5 md:grid-cols-2">
            {/* Do'konlar uchun */}
            <div className="rounded-card-lg border border-border/40 bg-surface p-7 soft-shadow">
              <Badge tone="primary" className="mb-4">
                Do'konlar va butiklar uchun
              </Badge>
              <h3 className="mb-5 font-heading text-xl font-semibold text-ink">
                Har bir kiyimga AI sinash imkoniyati
              </h3>
              <ul className="space-y-3">
                {STORE_BENEFITS.map((b) => (
                  <li key={b.text} className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-0.5 flex-shrink-0 text-base">{b.icon}</span>
                    {b.text}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => navigate("/merchant/dashboard")}
              >
                Do'kon panelini ko'rish →
              </Button>
            </div>

            {/* Marketplace uchun */}
            <div className="rounded-card-lg border border-primary/20 bg-gradient-to-br from-primary-container/20 to-soft-pink/10 p-7 soft-shadow">
              <Badge tone="pink" className="mb-4">
                Marketplace va online do'konlar uchun
              </Badge>
              <h3 className="mb-5 font-heading text-xl font-semibold text-ink">
                Xaridor platformadan chiqmaydi
              </h3>
              <ul className="space-y-3">
                {MARKETPLACE_BENEFITS.map((b) => (
                  <li key={b.text} className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-0.5 flex-shrink-0 text-base">{b.icon}</span>
                    {b.text}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 floating-shadow"
                onClick={() => navigate("/product/premium-ipak-koylak")}
              >
                Demo ko'rish →
              </Button>
            </div>
          </div>
        </section>

        {/* ── Integration code teaser ── */}
        <section className="bg-surface-container/40 px-5 py-12">
          <div className="mx-auto max-w-app text-center">
            <h2 className="mb-2 font-heading text-xl font-semibold text-ink">
              Integratsiya 5 daqiqa ichida
            </h2>
            <p className="mb-6 text-sm text-muted">
              Bitta kod qatori yoki widget bilan mahsulot sahifangizga qo'shing.
            </p>
            <div className="mx-auto max-w-lg overflow-hidden rounded-card border border-border/40 bg-surface text-left soft-shadow">
              <div className="flex items-center gap-2 border-b border-border/30 bg-surface-container/60 px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-error/50" />
                <span className="h-2 w-2 rounded-full bg-amber-400/60" />
                <span className="h-2 w-2 rounded-full bg-success/50" />
                <span className="ml-2 text-xs text-muted">product-page.html</span>
              </div>
              <pre className="overflow-x-auto px-4 py-4 text-xs leading-relaxed text-on-primary-container">
                <code className="text-muted">
                  {`<script src="https://cdn.lookcha.ai/widget.js"
        data-store="moda-uz">
</script>

<lookcha-button
  product-id="premium-ipak-koylak">
</lookcha-button>`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="px-5 py-20">
          <div className="mx-auto max-w-app flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl text-on-primary floating-shadow">
              ✨
            </div>
            <h2 className="mb-3 font-heading text-2xl font-semibold text-ink sm:text-3xl">
              Xaridor savdo platformangizda kiyimni sinab ko'rsin
            </h2>
            <p className="mb-8 max-w-md text-muted">
              Hamkorlikni boshlash uchun demo ko'ring yoki do'kon paneliga kiring.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="floating-shadow"
                onClick={() => navigate("/product/premium-ipak-koylak")}
              >
                {buttons.viewDemo}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/merchant/dashboard")}
              >
                {buttons.startPartnership}
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/30 bg-surface-container/30">
        <div className="mx-auto flex max-w-app flex-col items-start justify-between gap-4 px-5 py-8 md:flex-row md:items-center">
          <div>
            <p className="font-heading text-sm font-semibold text-ink">Lookcha AI</p>
            <p className="text-xs text-muted">
              © 2025 Lookcha AI. Uzbekiston moda savdosi uchun AI integratsiya.
            </p>
          </div>
          <div className="flex gap-5 text-xs text-muted">
            <Link to="/merchant/dashboard" className="hover:text-primary transition-colors">
              Hamkor paneli
            </Link>
            <Link to="/product/premium-ipak-koylak" className="hover:text-primary transition-colors">
              Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
