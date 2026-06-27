import { cn } from "@/lib/cn";

export interface SpinnerProps {
  className?: string;
  size?: number;
  label?: string;
}

export function Spinner({ className, size = 24, label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <span
        role="status"
        aria-label={label ?? "Yuklanmoqda"}
        className={cn(
          "inline-block animate-spin rounded-full border-[3px] border-primary/25 border-t-primary",
          className,
        )}
        style={{ width: size, height: size }}
      />
      {label && <p className="text-sm text-muted">{label}</p>}
    </div>
  );
}

export default Spinner;
