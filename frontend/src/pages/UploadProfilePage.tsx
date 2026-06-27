import { useNavigate } from "react-router-dom";
import CustomerLayout from "@/layouts/CustomerLayout";
import { Button } from "@/components/ui";

export default function UploadProfilePage() {
  const navigate = useNavigate();
  return (
    <CustomerLayout>
      <section className="animate-fade-in flex flex-col gap-4 py-6">
        <h1 className="font-heading text-2xl font-semibold">
          To‘liq gavda rasmini yuklash
        </h1>
        <p className="text-muted">
          Bu yerda rasm yuklash va o‘lcham/style formasi bo‘ladi. (Placeholder)
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/tryon-result")}>
            AI natijani ko‘rish
          </Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Orqaga
          </Button>
        </div>
      </section>
    </CustomerLayout>
  );
}
