import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Dataset } from "./types";
import { parseCsv } from "./parser";
import { generateSampleRows } from "./sample";

interface DataCtx {
  dataset: Dataset;
  loadCsvText: (name: string, text: string) => void;
  reload: () => void;
  reset: () => void;
}

const defaultDataset = (): Dataset => ({
  name: "dataset_may2026.csv",
  loadedAt: Date.now(),
  rows: generateSampleRows(30),
});

const Ctx = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<Dataset>(() => defaultDataset());

  const loadCsvText = useCallback((name: string, text: string) => {
    const rows = parseCsv(text);
    if (!rows.length) return;
    setDataset({ name, loadedAt: Date.now(), rows });
  }, []);

  const reload = useCallback(() => {
    setDataset((d) => ({ ...d, loadedAt: Date.now() }));
  }, []);

  const reset = useCallback(() => setDataset(defaultDataset()), []);

  const value = useMemo(() => ({ dataset, loadCsvText, reload, reset }), [dataset, loadCsvText, reload, reset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDataset() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDataset must be used within DataProvider");
  return ctx;
}
