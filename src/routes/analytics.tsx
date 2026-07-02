import { createFileRoute } from "@tanstack/react-router";
import { useDataset } from "@/lib/data/context";
import { computeScores, dailyAggregates } from "@/lib/data/analytics";
import { GlassCard } from "@/components/glass-card";
import { PageHeader, PageShell, SimulationBadge } from "@/components/page-shell";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  component: Analytics,
});

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
} as const;

function ChartCard({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <GlassCard className={className}>
      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </div>
      <div className="h-56">{children}</div>
    </GlassCard>
  );
}

function Analytics() {
  const { dataset } = useDataset();
  const daily = dailyAggregates(dataset.rows).slice(-14);
  const scores = computeScores(dataset.rows);

  const radarData = [
    { metric: "Eye Health", value: scores.eyeHealth },
    { metric: "Focus", value: scores.focus },
    { metric: "Comfort", value: scores.comfort },
    { metric: "Blink", value: scores.blinkQuality },
    { metric: "Hydration", value: scores.hydration },
    { metric: "Strain", value: scores.digitalStrain },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Analytics"
        title="Full spectrum wellness trends"
        subtitle="14-day interactive analytics computed from the loaded dataset."
        right={<SimulationBadge />}
      />

      <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
        <ChartCard className="md:col-span-4" title="Weekly Eye Health" subtitle="Eye health & comfort area comparison">
          <ResponsiveContainer>
            <AreaChart data={daily}>
              <defs>
                <linearGradient id="a1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--glow)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--glow)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="a2" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.14 165)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="oklch(0.82 0.14 165)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="eye_health" stroke="var(--glow)" strokeWidth={2} fill="url(#a1)" />
              <Area type="monotone" dataKey="eye_comfort" stroke="oklch(0.82 0.14 165)" strokeWidth={2} fill="url(#a2)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard className="md:col-span-2" title="Wellness Balance" subtitle="Multi-metric radar">
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="value" stroke="var(--glow)" fill="var(--glow)" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard className="md:col-span-3" title="Blink Trend" subtitle="Average blinks per minute">
          <ResponsiveContainer>
            <LineChart data={daily}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="blink_rate" stroke="var(--glow)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--glow)" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard className="md:col-span-3" title="Screen Time Trend" subtitle="Peak daily minutes">
          <ResponsiveContainer>
            <BarChart data={daily}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="screen_time" fill="var(--glow)" radius={[8, 8, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard className="md:col-span-3" title="Digital Fatigue" subtitle="Composite strain index">
          <ResponsiveContainer>
            <AreaChart data={daily}>
              <defs>
                <linearGradient id="af" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.15 75)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.82 0.15 75)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="digital_fatigue" stroke="oklch(0.82 0.15 75)" strokeWidth={2} fill="url(#af)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard className="md:col-span-3" title="Focus Trend" subtitle="Cognitive attention score">
          <ResponsiveContainer>
            <LineChart data={daily}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="focus_level" stroke="oklch(0.82 0.14 165)" strokeWidth={2.5} dot={{ r: 3, fill: "oklch(0.82 0.14 165)" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard className="md:col-span-6" title="Eye Comfort Timeline" subtitle="Comfort and hydration correlation">
          <ResponsiveContainer>
            <AreaChart data={daily}>
              <defs>
                <linearGradient id="ac1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--glow)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--glow)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ac2" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.14 165)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.82 0.14 165)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="eye_comfort" stroke="var(--glow)" strokeWidth={2} fill="url(#ac1)" />
              <Area type="monotone" dataKey="hydration_score" stroke="oklch(0.82 0.14 165)" strokeWidth={2} fill="url(#ac2)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </PageShell>
  );
}
