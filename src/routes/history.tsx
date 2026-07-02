import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useDataset } from "@/lib/data/context";
import { dailyAggregates } from "@/lib/data/analytics";
import { rowsToCsv } from "@/lib/data/parser";
import { GlassCard } from "@/components/glass-card";
import { PageHeader, PageShell, SimulationBadge } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({
  component: History,
});

type Range = "day" | "week" | "month";

function History() {
  const { dataset } = useDataset();
  const [range, setRange] = useState<Range>("week");
  const [q, setQ] = useState("");

  const daily = dailyAggregates(dataset.rows);
  const filtered = useMemo(() => {
    const days = range === "day" ? 1 : range === "week" ? 7 : 30;
    const sliced = daily.slice(-days);
    if (!q.trim()) return sliced;
    const needle = q.toLowerCase();
    return sliced.filter((d) => d.date.includes(needle) || d.label.toLowerCase().includes(needle));
  }, [daily, range, q]);

  const exportCsv = () => {
    const csv = rowsToCsv(dataset.rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neurovision-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const exportPdf = () => {
    const html = `<!doctype html><html><head><title>NeuroVision Report</title>
      <style>body{font-family:system-ui;padding:40px;color:#111}h1{font-size:28px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{padding:8px;border-bottom:1px solid #eee;text-align:left;font-size:12px}th{background:#f5f5f5}</style>
      </head><body><h1>NeuroVision Wellness Report</h1><p>Generated ${new Date().toLocaleString()}</p>
      <table><thead><tr><th>Date</th><th>Eye Health</th><th>Fatigue</th><th>Focus</th><th>Comfort</th><th>Blink</th><th>Screen (m)</th></tr></thead>
      <tbody>${filtered.map(d => `<tr><td>${d.date}</td><td>${d.eye_health}</td><td>${d.digital_fatigue}</td><td>${d.focus_level}</td><td>${d.eye_comfort}</td><td>${d.blink_rate}</td><td>${d.screen_time}</td></tr>`).join("")}</tbody></table></body></html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 300);
    toast.success("Opening print dialog for PDF export");
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="History"
        title="Session timeline"
        subtitle="Every record from the loaded dataset. Filter, search, and export for your care team."
        right={<SimulationBadge />}
      />

      <GlassCard className="mb-6 flex flex-col md:flex-row gap-3 items-center">
        <div className="flex items-center gap-1 p-1 rounded-full bg-background/60 border border-border/60">
          {(["day", "week", "month"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 text-xs rounded-full capitalize transition-colors ${
                range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search records by date or day"
            className="pl-9 bg-background/60 border-border/60"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportPdf} className="gap-2">
            <FileText className="h-4 w-4" /> Export PDF
          </Button>
          <Button onClick={exportCsv} className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </GlassCard>

      <GlassCard className="!p-0 overflow-hidden">
        <div className="grid grid-cols-7 gap-4 px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/60">
          <div className="col-span-2">Date</div>
          <div>Eye Health</div>
          <div>Fatigue</div>
          <div>Focus</div>
          <div>Comfort</div>
          <div className="text-right">Screen</div>
        </div>
        <div className="divide-y divide-border/60">
          {filtered.slice().reverse().map((d) => (
            <div key={d.date} className="grid grid-cols-7 gap-4 px-6 py-4 items-center text-sm hover:bg-primary/5 transition-colors">
              <div className="col-span-2">
                <div className="font-medium">{new Date(d.date).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{d.date}</div>
              </div>
              <MiniStat v={d.eye_health} />
              <MiniStat v={d.digital_fatigue} inverse />
              <MiniStat v={d.focus_level} />
              <MiniStat v={d.eye_comfort} />
              <div className="text-right font-display text-lg">{Math.floor(d.screen_time / 60)}h {d.screen_time % 60}m</div>
            </div>
          ))}
          {!filtered.length && (
            <div className="px-6 py-14 text-center text-sm text-muted-foreground">
              No records for this range.
            </div>
          )}
        </div>
      </GlassCard>
    </PageShell>
  );
}

function MiniStat({ v, inverse }: { v: number; inverse?: boolean }) {
  const good = inverse ? v < 50 : v >= 65;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-background/60 overflow-hidden">
        <div
          className={`h-full rounded-full ${good ? "bg-primary" : "bg-[oklch(0.82_0.15_75)]"}`}
          style={{ width: `${Math.min(100, v)}%` }}
        />
      </div>
      <div className="text-xs w-8 text-right font-medium">{Math.round(v)}</div>
    </div>
  );
}
