import type { SessionRow } from "./types";

const NUMERIC_FIELDS: (keyof SessionRow)[] = [
  "blink_rate",
  "eye_health",
  "digital_fatigue",
  "focus_level",
  "stress_index",
  "eye_comfort",
  "screen_time",
  "perclos",
  "eye_closure",
  "hydration_score",
  "breaks_taken",
];

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export function parseCsv(text: string): SessionRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const rows: SessionRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = splitCsvLine(lines[i]);
    const record: Record<string, string> = {};
    headers.forEach((h, idx) => (record[h] = parts[idx] ?? ""));
    const row: SessionRow = {
      timestamp: record.timestamp || new Date().toISOString(),
      blink_rate: 0,
      eye_health: 0,
      digital_fatigue: 0,
      focus_level: 0,
      stress_index: 0,
      eye_comfort: 0,
      screen_time: 0,
      perclos: 0,
      eye_closure: 0,
      hydration_score: 0,
      breaks_taken: 0,
    };
    for (const f of NUMERIC_FIELDS) {
      const v = Number(record[f]);
      (row as unknown as Record<string, number>)[f] = Number.isFinite(v) ? v : 0;
    }
    rows.push(row);
  }
  return rows.sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp));
}

export function rowsToCsv(rows: SessionRow[]): string {
  const headers = [
    "timestamp",
    ...NUMERIC_FIELDS,
  ];
  const body = rows
    .map((r) => headers.map((h) => (r as unknown as Record<string, unknown>)[h]).join(","))
    .join("\n");
  return headers.join(",") + "\n" + body;
}
