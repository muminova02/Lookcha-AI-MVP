import { useNavigate } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import { Button, Badge } from "@/components/ui";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <CustomerLayout>
      <section className="animate-fade-in flex flex-col items-start gap-5 py-6">
        <Badge tone="primary">B2B integratsiya</Badge>
        <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          Lookcha AI
        </h1>
        <p className="max-w-xl text-muted">
          Kiyim savdosi platformalari uchun AI try-on integratsiyasi. (Placeholder —
          to‘liq sahifa Stage 5 da quriladi.)
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate("/product/premium-ipak-koylak")}>
            Demo ko‘rish
          </Button>
          <Button variant="outline" onClick={() => navigate("/merchant/dashboard")}>
            Hamkorlikni boshlash
          </Button>
        </div>
      </section>
    </CustomerLayout>
  );
}
