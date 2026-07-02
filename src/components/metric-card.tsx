import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  hint?: string;
  tone?: "primary" | "mint" | "amber" | "rose";
  className?: string;
  progress?: number; // 0-100
}

const toneMap: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  primary: "text-primary bg-primary/10 border-primary/25",
  mint: "text-[oklch(0.82_0.14_165)] bg-[oklch(0.82_0.14_165/0.10)] border-[oklch(0.82_0.14_165/0.25)]",
  amber: "text-[oklch(0.82_0.15_75)] bg-[oklch(0.82_0.15_75/0.10)] border-[oklch(0.82_0.15_75/0.25)]",
  rose: "text-[oklch(0.75_0.17_15)] bg-[oklch(0.75_0.17_15/0.10)] border-[oklch(0.75_0.17_15/0.25)]",
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  suffix,
  hint,
  tone = "primary",
  className,
  progress,
}: MetricCardProps) {
  return (
    <GlassCard className={cn("flex flex-col gap-4 justify-between", className)}>
      <div className="flex items-start justify-between">
        <div className={cn("h-10 w-10 rounded-xl border grid place-items-center", toneMap[tone])}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div>
        <div className="flex items-baseline gap-1.5">
          <motion.div
            key={String(value)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display leading-none tracking-tight"
          >
            {value}
          </motion.div>
          {suffix && (
            <span className="text-sm text-muted-foreground">{suffix}</span>
          )}
        </div>
        {hint && <div className="text-xs text-muted-foreground mt-2">{hint}</div>}
        {typeof progress === "number" && (
          <div className="mt-4 h-1.5 rounded-full bg-background/60 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn("h-full rounded-full", {
                "bg-primary": tone === "primary",
                "bg-[oklch(0.82_0.14_165)]": tone === "mint",
                "bg-[oklch(0.82_0.15_75)]": tone === "amber",
                "bg-[oklch(0.75_0.17_15)]": tone === "rose",
              })}
            />
          </div>
        )}
      </div>
    </GlassCard>
  );
}
