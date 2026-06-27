import { useNavigate, useParams } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import { Button, Card } from "@/components/ui";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <CustomerLayout>
      <section className="animate-fade-in flex flex-col gap-4 py-6">
        <h1 className="font-heading text-2xl font-semibold">
          Marketplace mahsulot sahifasi
        </h1>
        <p className="text-muted">
          Mahsulot id: <span className="font-medium text-ink">{id}</span>{" "}
          (Placeholder)
        </p>
        <Card className="bg-primary-container/20">
          <p className="text-sm text-ink">
            Kiyim sizda qanday turishini oldindan ko‘ring.
          </p>
          <Button className="mt-3" onClick={() => navigate("/upload-profile")}>
            Lookcha’da kiyib ko‘rish
          </Button>
        </Card>
        <Button variant="ghost" onClick={() => navigate("/")}>
          ← Asosiy sahifa
        </Button>
      </section>
    </CustomerLayout>
  );
}
