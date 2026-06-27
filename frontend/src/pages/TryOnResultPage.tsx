import { useNavigate } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import { Button } from "@/components/ui";

export default function TryOnResultPage() {
  const navigate = useNavigate();
  return (
    <CustomerLayout>
      <section className="animate-fade-in flex flex-col gap-4 py-6">
        <h1 className="font-heading text-2xl font-semibold">
          Kiyib ko‘rish natijasi
        </h1>
        <p className="text-muted">
          Bu yerda to‘liq gavda AI natijasi va moslik bahosi ko‘rsatiladi.
          (Placeholder)
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/order/premium-ipak-koylak")}>
            Buyurtma berish
          </Button>
          <Button variant="secondary" onClick={() => navigate("/recommendations")}>
            Boshqa kiyim sinash
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/product/premium-ipak-koylak")}
          >
            Marketplace’ga qaytish
          </Button>
        </div>
      </section>
    </CustomerLayout>
  );
}
