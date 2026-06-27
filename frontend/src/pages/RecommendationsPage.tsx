import { useNavigate } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import { Button } from "@/components/ui";

export default function RecommendationsPage() {
  const navigate = useNavigate();
  return (
    <CustomerLayout>
      <section className="animate-fade-in flex flex-col gap-4 py-6">
        <h1 className="font-heading text-2xl font-semibold">Sizga mos tavsiyalar</h1>
        <p className="text-muted">
          Bu yerda AI stilist tavsiyalari va mahsulot kartalari bo‘ladi.
          (Placeholder)
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/product/klassik-bordo-koylak")}>
            Mahsulotni ko‘rish
          </Button>
          <Button variant="ghost" onClick={() => navigate("/tryon-result")}>
            ← Natijaga qaytish
          </Button>
        </div>
      </section>
    </CustomerLayout>
  );
}
