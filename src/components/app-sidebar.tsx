import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Activity,
  Sparkles,
  LineChart,
  Clock,
  Lightbulb,
  Settings as SettingsIcon,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/live", label: "Live Monitoring", icon: Activity },
  { to: "/insights", label: "AI Insights", icon: Sparkles },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/history", label: "History", icon: Clock },
  { to: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 border-r border-border/60 bg-sidebar/80 backdrop-blur-xl flex-col">
      <div className="px-6 pt-8 pb-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-primary/15 border border-primary/30 grid place-items-center pulse-glow">
            <Eye className="h-5 w-5 text-primary" strokeWidth={1.8} />
          </div>
          <div>
            <div className="font-display text-2xl leading-none">NeuroVision</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
              Eye + Cognitive
            </div>
          </div>
        </Link>
      </div>

      <nav className="px-3 flex-1 space-y-1">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all relative",
                active
                  ? "bg-primary/10 text-foreground border border-primary/25 shadow-[inset_0_0_20px_-10px_var(--glow-soft)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.7} />
              <span className="font-medium tracking-tight">{it.label}</span>
              {active && (
                <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--glow)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mx-3 mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
        <div className="flex items-center gap-2 text-xs text-primary/90 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Simulation Mode
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
          Representative dataset loaded. Ready for live NeuroVision Smart Spectacles telemetry.
        </p>
      </div>
    </aside>
  );
}
