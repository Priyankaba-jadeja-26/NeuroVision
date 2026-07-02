import { createFileRoute } from "@tanstack/react-router";
import { useDataset } from "@/lib/data/context";
import { computeScores, dailyAggregates } from "@/lib/data/analytics";
import { generateInsights } from "@/lib/data/insights";
import { GlassCard } from "@/components/glass-card";
import { MetricCard } from "@/components/metric-card";
import { DataSourceCard } from "@/components/data-source-card";
import { PageHeader, PageShell, SimulationBadge } from "@/components/page-shell";
import {
  Eye,
  Activity,
  Zap,
  Focus,
  Smile,
  MonitorSmartphone,
  Sparkles,
  ArrowUpRight,
  Coffee,
  Droplet,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Home() {
  const { dataset } = useDataset();
  const scores = computeScores(dataset.rows);
  const daily = dailyAggregates(dataset.rows).slice(-14);
  const insights = generateInsights(scores);
  const top = insights[0];

  return (
    <PageShell>
      <PageHeader
        eyebrow="NeuroVision · Home"
        title={`${greet()}, Alex`}
        subtitle="Your visual system, cognitive load and screen habits — synthesized from your NeuroVision Smart Spectacles session data."
        right={<SimulationBadge />}
      />

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
        {/* Wellness hero */}
        <GlassCard glow className="md:col-span-3 md:row-span-2 min-h-[340px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Overall Wellness Score
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary">
              Today
            </span>
          </div>

          <div className="flex items-end justify-between gap-6 mt-6">
            <motion.div
              key={scores.wellness}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-[8rem] leading-none tracking-tight text-gradient"
            >
              {Math.round(scores.wellness)}
            </motion.div>
            <div className="text-right pb-3">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">of 100</div>
              <div className="mt-1 text-sm text-primary">
                {scores.wellness >= 75 ? "Balanced" : scores.wellness >= 55 ? "Steady" : "Recovering"}
              </div>
            </div>
          </div>

          <div className="mt-6 h-24 -mx-2">
            <ResponsiveContainer>
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="wg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--glow)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--glow)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="eye_health"
                  stroke="var(--glow)"
                  strokeWidth={2}
                  fill="url(#wg)"
                />
                <XAxis dataKey="label" hide />
                <YAxis hide domain={[0, 100]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { l: "Eye Health", v: scores.eyeHealth },
              { l: "Focus", v: scores.focus },
              { l: "Comfort", v: scores.comfort },
            ].map((x) => (
              <div key={x.l} className="rounded-xl bg-background/40 border border-border/60 p-3">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{x.l}</div>
                <div className="mt-1 text-xl font-display">{Math.round(x.v)}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <MetricCard
          className="md:col-span-2"
          icon={Eye}
          label="Eye Health"
          value={Math.round(scores.eyeHealth)}
          suffix="/100"
          tone="mint"
          progress={scores.eyeHealth}
          hint="14-day average trending stable"
        />
        <MetricCard
          className="md:col-span-1"
          icon={Zap}
          label="Digital Strain"
          value={Math.round(scores.fatigue)}
          suffix="/100"
          tone={scores.fatigue > 55 ? "amber" : "primary"}
          progress={scores.fatigue}
        />

        <MetricCard
          className="md:col-span-2"
          icon={Activity}
          label="Blink Quality"
          value={Math.round(scores.blinkQuality)}
          suffix="/100"
          tone="primary"
          progress={scores.blinkQuality}
          hint="Ideal range 15–20 blinks/min"
        />
        <MetricCard
          className="md:col-span-1"
          icon={Focus}
          label="Focus Level"
          value={Math.round(scores.focus)}
          tone="primary"
          progress={scores.focus}
        />

        {/* Today's AI Insight */}
        <GlassCard className="md:col-span-4 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/25 grid place-items-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Today's AI Insight
            </div>
          </div>
          <h3 className="font-display text-2xl md:text-3xl leading-tight text-gradient">
            {top.title}
          </h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {top.body}
          </p>
          <div className="mt-5 flex items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-background/50 border border-border/60">
              {top.metric}: <span className="text-foreground">{top.value}</span>
            </span>
            <Link
              to="/insights"
              className="ml-auto inline-flex items-center gap-1 text-primary hover:underline"
            >
              All insights <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </GlassCard>

        <MetricCard
          className="md:col-span-2"
          icon={Smile}
          label="Eye Comfort"
          value={Math.round(scores.comfort)}
          tone={scores.comfort < 65 ? "amber" : "mint"}
          progress={scores.comfort}
          hint="Ocular surface signal"
        />

        <MetricCard
          className="md:col-span-2"
          icon={MonitorSmartphone}
          label="Today's Screen Time"
          value={`${Math.floor(scores.screenTime / 60)}h ${scores.screenTime % 60}m`}
          tone={scores.screenTime > 240 ? "rose" : "primary"}
          hint="Peak session length today"
        />

        {/* Daily wellness summary */}
        <GlassCard className="md:col-span-2">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Daily Wellness Summary
          </div>
          <div className="space-y-3">
            {[
              { icon: Droplet, l: "Hydration", v: Math.round(scores.hydration) },
              { icon: Coffee, l: "Breaks taken", v: scores.breaks },
              { icon: Activity, l: "Blink cadence", v: Math.round(scores.blinkQuality) },
            ].map((x) => (
              <div key={x.l} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-background/50 border border-border/60 grid place-items-center">
                  <x.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 text-sm">{x.l}</div>
                <div className="font-display text-lg">{x.v}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Eye Health Trend */}
        <GlassCard className="md:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Eye Health Trend
              </div>
              <div className="text-sm mt-1">Last 14 days</div>
            </div>
            <Link
              to="/analytics"
              className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
            >
              Open analytics <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="h-52">
            <ResponsiveContainer>
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="eh" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--glow)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--glow)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="eye_health" stroke="var(--glow)" strokeWidth={2} fill="url(#eh)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Quick actions */}
        <GlassCard className="md:col-span-2">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Quick Actions
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { to: "/live", label: "Start monitor", icon: Activity },
              { to: "/insights", label: "See insights", icon: Sparkles },
              { to: "/analytics", label: "Analytics", icon: Eye },
              { to: "/history", label: "History", icon: Focus },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group rounded-2xl p-4 bg-background/40 border border-border/60 hover:border-primary/40 transition-colors"
              >
                <a.icon className="h-4 w-4 text-primary" />
                <div className="text-sm mt-3">{a.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest">
                  Open →
                </div>
              </Link>
            ))}
          </div>
        </GlassCard>

        {/* Data source */}
        <div className="md:col-span-4">
          <DataSourceCard />
        </div>
      </div>
    </PageShell>
  );
}
