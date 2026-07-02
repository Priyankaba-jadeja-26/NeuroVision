import type { SessionRow } from "./types";

// Deterministic pseudo-random using sin — no external deps.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

export function generateSampleRows(days = 30): SessionRow[] {
  const rnd = seeded(42);
  const rows: SessionRow[] = [];
  const now = new Date();
  now.setHours(23, 0, 0, 0);

  for (let d = days - 1; d >= 0; d--) {
    // 12 hourly-ish samples per day (waking hours)
    for (let h = 8; h <= 22; h += 2) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      date.setHours(h, Math.floor(rnd() * 59), 0, 0);

      const dayFactor = Math.sin((days - d) / 6) * 8;
      const fatigueBase = 30 + (h - 8) * 3 + dayFactor + rnd() * 12;
      const digital_fatigue = clamp(fatigueBase);
      const blink_rate = clamp(20 - digital_fatigue / 12 + rnd() * 5, 6, 28);
      const focus_level = clamp(90 - digital_fatigue * 0.7 + rnd() * 10);
      const eye_comfort = clamp(95 - digital_fatigue * 0.8 + rnd() * 8);
      const eye_health = clamp(88 - digital_fatigue * 0.25 + rnd() * 6);
      const stress_index = clamp(digital_fatigue * 0.6 + rnd() * 15);
      const perclos = clamp(digital_fatigue * 0.4 + rnd() * 6, 2, 40);
      const eye_closure = clamp(perclos + rnd() * 5, 2, 45);
      const screen_time = clamp(90 + (h - 8) * 22 + rnd() * 30, 0, 720);
      const hydration_score = clamp(80 - digital_fatigue * 0.2 + rnd() * 10);
      const breaks_taken = Math.max(0, Math.round((h - 8) / 3 + rnd() * 1.5));

      rows.push({
        timestamp: date.toISOString(),
        blink_rate: +blink_rate.toFixed(1),
        eye_health: +eye_health.toFixed(1),
        digital_fatigue: +digital_fatigue.toFixed(1),
        focus_level: +focus_level.toFixed(1),
        stress_index: +stress_index.toFixed(1),
        eye_comfort: +eye_comfort.toFixed(1),
        screen_time: +screen_time.toFixed(0),
        perclos: +perclos.toFixed(1),
        eye_closure: +eye_closure.toFixed(1),
        hydration_score: +hydration_score.toFixed(1),
        breaks_taken,
      });
    }
  }
  return rows;
}
