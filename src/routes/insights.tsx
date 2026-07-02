import { createFileRoute } from "@tanstack/react-router";
import { useDataset } from "@/lib/data/context";
import { computeScores } from "@/lib/data/analytics";
import { generateInsights } from "@/lib/data/insights";
import { GlassCard } from "@/components/glass-card";
import { PageHeader, PageShell, SimulationBadge } from "@/components/page-shell";
import { Sparkles, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/insights")({
  component: Insights,
});

const iconFor = (sev: string) =>
  sev === "critical" ? AlertTriangle : sev === "warn" ? Sparkles : Info;

const toneClass = (sev: string) =>
  sev === "critical"
    ? "text-[oklch(0.75_0.17_15)] bg-[oklch(0.75_0.17_15/0.10)] border-[oklch(0.75_0.17_15/0.25)]"
    : sev === "warn"
      ? "text-[oklch(0.82_0.15_75)] bg-[oklch(0.82_0.15_75/0.10)] border-[oklch(0.82_0.15_75/0.25)]"
      : "text-primary bg-primary/10 border-primary/25";

function Insights() {
  const { dataset } = useDataset();
  const scores = computeScores(dataset.rows);
  const insights = generateInsights(scores);

  return (
    <PageShell>
      <PageHeader
        eyebrow="AI Insights"
        title="Recommendations tailored to your data"
        subtitle="Insights are generated from the parsed CSV. Rules run continuously — swap the dataset and the recommendations update instantly."
        right={<SimulationBadge />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {insights.map((i, idx) => {
          const Icon = iconFor(i.severity);
          return (
            <motion.div
              key={i.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard className="h-full flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className={`h-10 w-10 rounded-xl border grid place-items-center ${toneClass(i.severity)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {i.severity}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl leading-tight text-gradient">{i.title}</h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{i.body}</p>
                </div>
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/60">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {i.metric}
                  </span>
                  <span className="ml-auto text-sm font-medium">{i.value}</span>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </PageShell>
  );
}
