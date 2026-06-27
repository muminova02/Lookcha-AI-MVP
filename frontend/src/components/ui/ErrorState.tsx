import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import Button from "./Button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Xatolik yuz berdi",
  description = "Qayta urinib ko‘ring.",
  onRetry,
  retryLabel = "Qayta urinish",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card-lg border border-error/30 bg-error-container/40 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-2xl">
        ⚠️
      </div>
      <h3 className="font-heading text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>
      <div className="mt-5 flex gap-3">
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
        {action}
      </div>
    </div>
  );
}

export default ErrorState;
