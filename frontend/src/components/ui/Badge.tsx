import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "primary" | "pink" | "beige" | "success" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  primary: "bg-primary-container/50 text-on-primary-container",
  pink: "bg-soft-pink text-ink",
  beige: "bg-beige text-ink",
  success: "bg-success/15 text-success",
  neutral: "bg-surface-container text-muted",
};

export function Badge({ className, tone = "primary", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export default Badge;
