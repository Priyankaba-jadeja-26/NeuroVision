import type { SessionRow } from "./types";

export function avg(rows: SessionRow[], key: keyof SessionRow): number {
  if (!rows.length) return 0;
  const nums = rows.map((r) => Number(r[key])).filter((n) => Number.isFinite(n));
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function rowsForToday(rows: SessionRow[]): SessionRow[] {
  if (!rows.length) return [];
  const latest = new Date(rows[rows.length - 1].timestamp);
  return rows.filter((r) => isSameDay(new Date(r.timestamp), latest));
}

export interface ScoreBundle {
  wellness: number;
  eyeHealth: number;
  digitalStrain: number;
  blinkQuality: number;
  focus: number;
  comfort: number;
  screenTime: number; // minutes today
  fatigue: number;
  hydration: number;
  breaks: number;
}

export function computeScores(rows: SessionRow[]): ScoreBundle {
  const today = rowsForToday(rows);
  const base = today.length ? today : rows.slice(-8);

  const eyeHealth = avg(base, "eye_health");
  const fatigue = avg(base, "digital_fatigue");
  const focus = avg(base, "focus_level");
  const comfort = avg(base, "eye_comfort");
  const blink = avg(base, "blink_rate");
  const hydration = avg(base, "hydration_score");
  const breaks = today.reduce((s, r) => s + r.breaks_taken, 0);
  const screenTime = today.length ? Math.max(...today.map((r) => r.screen_time)) : 0;

  // Blink quality: ideal 15-20 blinks/min
  const blinkQuality = Math.max(0, 100 - Math.abs(blink - 17.5) * 6);
  const digitalStrain = 100 - fatigue;

  const wellness =
    eyeHealth * 0.28 +
    digitalStrain * 0.22 +
    focus * 0.18 +
    comfort * 0.18 +
    blinkQuality * 0.14;

  return {
    wellness: +wellness.toFixed(1),
    eyeHealth: +eyeHealth.toFixed(1),
    digitalStrain: +digitalStrain.toFixed(1),
    blinkQuality: +blinkQuality.toFixed(1),
    focus: +focus.toFixed(1),
    comfort: +comfort.toFixed(1),
    screenTime: Math.round(screenTime),
    fatigue: +fatigue.toFixed(1),
    hydration: +hydration.toFixed(1),
    breaks,
  };
}

export interface DailyAgg {
  date: string; // YYYY-MM-DD
  label: string; // Mon
  eye_health: number;
  digital_fatigue: number;
  focus_level: number;
  eye_comfort: number;
  blink_rate: number;
  screen_time: number;
  stress_index: number;
  hydration_score: number;
}

export function dailyAggregates(rows: SessionRow[]): DailyAgg[] {
  const buckets = new Map<string, SessionRow[]>();
  for (const r of rows) {
    const d = new Date(r.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(r);
  }
  const out: DailyAgg[] = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (const [key, list] of buckets.entries()) {
    const d = new Date(key);
    out.push({
      date: key,
      label: dayNames[d.getDay()],
      eye_health: +avg(list, "eye_health").toFixed(1),
      digital_fatigue: +avg(list, "digital_fatigue").toFixed(1),
      focus_level: +avg(list, "focus_level").toFixed(1),
      eye_comfort: +avg(list, "eye_comfort").toFixed(1),
      blink_rate: +avg(list, "blink_rate").toFixed(1),
      screen_time: Math.round(Math.max(...list.map((r) => r.screen_time))),
      stress_index: +avg(list, "stress_index").toFixed(1),
      hydration_score: +avg(list, "hydration_score").toFixed(1),
    });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export function scoreBand(score: number): { label: string; tone: "good" | "warn" | "bad" } {
  if (score >= 80) return { label: "Excellent", tone: "good" };
  if (score >= 65) return { label: "Good", tone: "good" };
  if (score >= 45) return { label: "Fair", tone: "warn" };
  return { label: "Needs care", tone: "bad" };
}
