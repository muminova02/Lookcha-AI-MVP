import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: string;
  accent?: boolean;
}

export default function KpiCard({ label, value, hint, icon, accent }: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-card-lg border p-4 soft-shadow",
        accent
          ? "border-primary/20 bg-gradient-to-br from-primary-container/30 to-surface"
          : "border-border/40 bg-surface",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-muted">{label}</p>
        {icon && <span className="text-base">{icon}</span>}
      </div>
      <p className="font-heading text-2xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
