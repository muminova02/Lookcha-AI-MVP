import { useNavigate } from "react-router-dom";
import MerchantLayout from "@/layouts/MerchantLayout";
import { Button } from "@/components/ui";

export default function MerchantDashboardPage() {
  const navigate = useNavigate();
  return (
    <MerchantLayout>
      <section className="animate-fade-in flex flex-col gap-4 py-6">
        <h1 className="font-heading text-2xl font-semibold">Do‘kon paneli</h1>
        <p className="text-muted">
          KPI kartalar, integratsiya holati va biznes bo‘limlari shu yerda bo‘ladi.
          (Placeholder)
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/merchant/qr-link")}>QR/Link</Button>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Mijoz ko‘rinishi
          </Button>
        </div>
      </section>
    </MerchantLayout>
  );
}
