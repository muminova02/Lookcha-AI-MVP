import { Button } from "@/components/ui";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonLabel?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Buyurtma qabul qilindi",
  message = "Tez orada siz bilan bog‘lanamiz.",
  buttonLabel = "Tushunarli",
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm animate-fade-in rounded-card-lg bg-surface p-7 text-center soft-shadow">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-3xl text-success">
          ✓
        </div>
        <h2 className="mb-1.5 font-heading text-xl font-semibold text-ink">{title}</h2>
        <p className="mb-6 text-sm text-muted">{message}</p>
        <Button fullWidth size="lg" onClick={onClose}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
