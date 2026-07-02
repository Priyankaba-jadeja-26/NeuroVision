import { createFileRoute } from "@tanstack/react-router";
import { useDataset } from "@/lib/data/context";
import { computeScores, last } from "@/lib/data/analytics";
import { GlassCard } from "@/components/glass-card";
import { PageHeader, PageShell, SimulationBadge } from "@/components/page-shell";
import { motion } from "framer-motion";
import { Eye, Camera, Activity, Focus, Zap, Smile } from "lucide-react";

export const Route = createFileRoute("/live")({
  component: LiveMonitoring,
});

function LiveMonitoring() {
  const { dataset } = useDataset();
  const scores = computeScores(dataset.rows);
  const latest = last(dataset.rows);
  const status =
    scores.fatigue > 65 ? { label: "Rest recommended", tone: "amber" as const } :
    scores.comfort < 60 ? { label: "Reduce strain", tone: "amber" as const } :
    { label: "Optimal focus", tone: "mint" as const };

  const metrics = [
    { icon: Activity, label: "Blink Rate", value: latest ? `${latest.blink_rate.toFixed(0)}` : "—", suffix: "/min" },
    { icon: Eye, label: "Eye Closure", value: latest ? `${latest.eye_closure.toFixed(0)}%` : "—" },
    { icon: Focus, label: "PERCLOS", value: latest ? `${latest.perclos.toFixed(1)}%` : "—" },
    { icon: Focus, label: "Focus Level", value: Math.round(scores.focus).toString(), suffix: "/100" },
    { icon: Zap, label: "Digital Fatigue", value: Math.round(scores.fatigue).toString(), suffix: "/100" },
    { icon: Smile, label: "Eye Comfort", value: Math.round(scores.comfort).toString(), suffix: "/100" },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Live Monitoring"
        title="Real-time ocular telemetry"
        subtitle="Streamed from your NeuroVision Smart Spectacles. Values below are read from the active dataset in Prototype Mode."
        right={<SimulationBadge />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <GlassCard glow className="lg:col-span-2 min-h-[440px] relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_45%,var(--glow-soft),transparent_60%)]" />
          <div className="flex items-center justify-between relative">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Camera Preview
              </div>
              <div className="text-sm mt-1">Simulation feed · 30 fps</div>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] bg-primary/10 border border-primary/25 text-primary uppercase tracking-widest">
              ● Live
            </span>
          </div>

          {/* Eye visualization */}
          <div className="flex-1 grid place-items-center relative">
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <svg width="360" height="200" viewBox="0 0 360 200" fill="none" className="drop-shadow-[0_0_40px_var(--glow-soft)]">
                <defs>
                  <radialGradient id="iris" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--glow)" stopOpacity="0.9" />
                    <stop offset="60%" stopColor="var(--glow)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0.1" />
                  </radialGradient>
                </defs>
                <path
                  d="M20 100 Q 180 -20 340 100 Q 180 220 20 100 Z"
                  stroke="var(--glow)"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.7"
                />
                <circle cx="180" cy="100" r="55" fill="url(#iris)" />
                <circle cx="180" cy="100" r="20" fill="var(--background)" />
                <circle cx="172" cy="92" r="6" fill="var(--foreground)" opacity="0.6" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-4 w-4 text-primary/40 absolute top-2 left-2" />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-3 relative">
            <div className="rounded-xl bg-background/50 border border-border/60 p-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Eye Status</div>
              <div className="mt-1 text-sm font-medium text-primary">{status.label}</div>
            </div>
            <div className="rounded-xl bg-background/50 border border-border/60 p-3 col-span-2">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Recommendation</div>
              <div className="mt-1 text-sm">
                {scores.fatigue > 65
                  ? "Step away from your screen for 5 minutes and hydrate."
                  : scores.blinkQuality < 60
                    ? "Perform a slow blink set: 5 rounds of 10 blinks."
                    : "Maintain current posture and lighting. Signals are healthy."}
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-2 gap-4">
          {metrics.map((m) => (
            <GlassCard key={m.label} className="!p-5 flex flex-col justify-between min-h-[130px]">
              <div className="flex items-center gap-2">
                <m.icon className="h-3.5 w-3.5 text-primary" />
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {m.label}
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <div className="font-display text-3xl">{m.value}</div>
                {m.suffix && <span className="text-xs text-muted-foreground">{m.suffix}</span>}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
