import { GlassCard } from "@/components/glass-card";
import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export function PageHeader({ eyebrow, title, subtitle, right }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
      <div>
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-[0.22em] text-primary/80 mb-3">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-tight text-gradient">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sm text-muted-foreground max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="px-6 md:px-12 py-10 md:py-14 max-w-[1500px] mx-auto">{children}</div>;
}

export function SimulationBadge() {
  return (
    <GlassCard className="!p-4 flex items-center gap-3 min-w-[280px]">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
      </span>
      <div className="flex flex-col">
        <span className="text-xs font-medium">Simulation Mode</span>
        <span className="text-[10px] text-muted-foreground">
          Representative data · Live-ready
        </span>
      </div>
    </GlassCard>
  );
}
