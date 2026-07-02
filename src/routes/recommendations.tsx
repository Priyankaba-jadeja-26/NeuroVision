import { createFileRoute } from "@tanstack/react-router";
import { useDataset } from "@/lib/data/context";
import { computeScores } from "@/lib/data/analytics";
import { generateInsights } from "@/lib/data/insights";
import { GlassCard } from "@/components/glass-card";
import { PageHeader, PageShell, SimulationBadge } from "@/components/page-shell";
import { Check, Coffee, Droplet, Eye, Sun, Timer } from "lucide-react";

export const Route = createFileRoute("/recommendations")({
  component: Recommendations,
});

const routines = [
  { icon: Timer, title: "20-20-20 rule", body: "Every 20 minutes, focus on something 20 feet away for 20 seconds." },
  { icon: Eye, title: "Slow blink set", body: "5 rounds of 10 gentle blinks. Restores tear film and reduces dryness." },
  { icon: Droplet, title: "Hydration reset", body: "200ml of water and a 60-second pause. Stabilises ocular hydration." },
  { icon: Sun, title: "Warm your display", body: "Shift color temperature to 5000K and reduce brightness by 20% after sunset." },
  { icon: Coffee, title: "Micro-break", body: "Stand up, roll shoulders, and look out a window for 90 seconds." },
];

function Recommendations() {
  const { dataset } = useDataset();
  const scores = computeScores(dataset.rows);
  const insights = generateInsights(scores);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Recommendations"
        title="A gentler day for your eyes"
        subtitle="A personalized care plan derived from your current dataset — combining live insights with proven visual wellness routines."
        right={<SimulationBadge />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <GlassCard glow className="lg:col-span-2">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Care Plan for Today
          </div>
          <div className="space-y-4">
            {insights.map((i) => (
              <div key={i.id} className="flex gap-4 p-4 rounded-2xl bg-background/40 border border-border/60">
                <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/25 grid place-items-center shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">{i.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{i.body}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Signals summary
          </div>
          <div className="space-y-4">
            {[
              { l: "Wellness", v: scores.wellness },
              { l: "Eye health", v: scores.eyeHealth },
              { l: "Focus", v: scores.focus },
              { l: "Comfort", v: scores.comfort },
              { l: "Hydration", v: scores.hydration },
            ].map((s) => (
              <div key={s.l}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{s.l}</span>
                  <span className="font-medium">{Math.round(s.v)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-background/60 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${s.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {routines.map((r) => (
          <GlassCard key={r.title} className="hover:border-primary/40 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 grid place-items-center mb-4">
              <r.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="font-display text-xl leading-tight">{r.title}</div>
            <div className="text-xs text-muted-foreground mt-2 leading-relaxed">{r.body}</div>
          </GlassCard>
        ))}
      </div>
    </PageShell>
  );
}
