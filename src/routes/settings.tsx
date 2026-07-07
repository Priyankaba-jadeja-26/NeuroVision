import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/glass-card";
import { PageHeader, PageShell, SimulationBadge } from "@/components/page-shell";
import { DataSourceCard } from "@/components/data-source-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const [dark, setDark] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [breakReminders, setBreakReminders] = useState(true);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Settings"
        title="Preferences"
        subtitle="Configure your NeuroVision experience, notifications, and data source."
        right={<SimulationBadge />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Appearance
          </div>
          <Row label="Dark theme" hint="Optimized for low-light comfort">
            <Switch checked={dark} onCheckedChange={setDark} />
          </Row>
          <Row label="Language">
            <Select defaultValue="en">
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </GlassCard>

        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Notifications
          </div>
          <Row label="Push notifications" hint="Insight & fatigue alerts">
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </Row>
          <Row label="Break reminders" hint="Every 20 minutes">
            <Switch checked={breakReminders} onCheckedChange={setBreakReminders} />
          </Row>
          <Row label="Quiet hours">
            <Input defaultValue="22:00 – 07:00" className="w-40 bg-background/60" />
          </Row>
        </GlassCard>

        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Profile
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/15 border border-primary/25 grid place-items-center">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-display text-xl">Priyankaba Jadeja</div>
              <div className="text-xs text-muted-foreground">Member since May 2026</div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Display name</Label>
              <Input defaultValue="Priyankaba Jadeja" className="mt-1.5 bg-background/60" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input defaultValue="priyankaba@neurovision.ai" className="mt-1.5 bg-background/60" />
            </div>
          </div>
        </GlassCard>

        <div className="lg:col-span-2">
          <DataSourceCard />
        </div>

        <GlassCard>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
            About NeuroVision
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            NeuroVision is the companion platform for AI Smart Spectacles. It processes ocular and
            cognitive telemetry to help you build healthier screen habits.
          </p>
          <div className="mt-4 text-xs text-muted-foreground grid grid-cols-2 gap-2">
            <div>Version</div><div className="text-right">1.0.0 · Prototype</div>
            <div>Build</div><div className="text-right">2026.05.01</div>
            <div>Signal source</div><div className="text-right">CSV dataset</div>
          </div>
          <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">
            NeuroVision provides wellness insights and is not a medical device.
          </p>
        </GlassCard>
      </div>
    </PageShell>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/60 last:border-0">
      <div>
        <div className="text-sm">{label}</div>
        {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      {children}
    </div>
  );
}
