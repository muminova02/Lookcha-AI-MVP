import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  hoverable?: boolean;
}

export function Card({
  className,
  padded = true,
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card-lg border border-border/40 bg-surface soft-shadow",
        padded && "p-5",
        hoverable && "transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
      {...props}
    />
  );
}

export default Card;
