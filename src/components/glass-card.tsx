import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
}

export function GlassCard({ children, className, glow, ...rest }: GlassCardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "glass rounded-3xl p-6 relative overflow-hidden",
        glow && "glow-ring",
        className,
      )}
    >
      {children}
    </div>
  );
}
