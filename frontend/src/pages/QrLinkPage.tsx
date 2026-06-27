import { useNavigate } from "react-router-dom";
import MerchantLayout from "@/layouts/MerchantLayout";
import { Button } from "@/components/ui";

export default function QrLinkPage() {
  const navigate = useNavigate();
  return (
    <MerchantLayout>
      <section className="animate-fade-in flex flex-col gap-4 py-6">
        <h1 className="font-heading text-2xl font-semibold">QR kod va ulashish</h1>
        <p className="text-muted">
          Do‘kon linki, QR kod, ulashish va integratsiya kodi shu yerda bo‘ladi.
          (Placeholder)
        </p>
        <Button variant="outline" onClick={() => navigate("/merchant/dashboard")}>
          Do‘kon paneliga qaytish
        </Button>
      </section>
    </MerchantLayout>
  );
}
