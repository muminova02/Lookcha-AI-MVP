import { useNavigate, useParams } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import { Button } from "@/components/ui";

export default function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <CustomerLayout>
      <section className="animate-fade-in flex flex-col gap-4 py-6">
        <h1 className="font-heading text-2xl font-semibold">Mahsulot haqida</h1>
        <p className="text-muted">
          Mahsulot id: <span className="font-medium text-ink">{id}</span> — buyurtma,
          do‘kon va yetkazib berish ma’lumotlari shu yerda bo‘ladi. (Placeholder)
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/")}>Buyurtma berish</Button>
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
