import { useRef } from "react";
import { GlassCard } from "./glass-card";
import { useDataset } from "@/lib/data/context";
import { Upload, RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function DataSourceCard() {
  const { dataset, loadCsvText, reload } = useDataset();
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    loadCsvText(file.name, text);
    toast.success("Dataset loaded", { description: file.name });
    e.target.value = "";
  };

  return (
    <GlassCard className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 grid place-items-center">
            <Database className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Data Source
            </div>
            <div className="text-sm font-medium mt-0.5">CSV Loaded</div>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[10px] rounded-full border border-primary/30 bg-primary/10 text-primary uppercase tracking-widest">
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-background/40 border border-border/60 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Filename
          </div>
          <div className="mt-1 font-medium truncate">{dataset.name}</div>
        </div>
        <div className="rounded-xl bg-background/40 border border-border/60 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Last Updated
          </div>
          <div className="mt-1 font-medium">{formatTime(dataset.loadedAt)}</div>
        </div>
        <div className="rounded-xl bg-background/40 border border-border/60 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Records
          </div>
          <div className="mt-1 font-medium">{dataset.rows.length.toLocaleString()}</div>
        </div>
        <div className="rounded-xl bg-background/40 border border-border/60 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Fields
          </div>
          <div className="mt-1 font-medium">12 metrics</div>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={onFile}
        />
        <Button
          onClick={() => inputRef.current?.click()}
          className="flex-1 gap-2"
          variant="default"
        >
          <Upload className="h-4 w-4" />
          Upload New CSV
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            reload();
            toast.success("Dataset reloaded");
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Reload
        </Button>
      </div>
    </GlassCard>
  );
}
