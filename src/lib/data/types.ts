export interface SessionRow {
  timestamp: string; // ISO
  blink_rate: number; // blinks/min
  eye_health: number; // 0-100
  digital_fatigue: number; // 0-100 (higher = worse)
  focus_level: number; // 0-100
  stress_index: number; // 0-100
  eye_comfort: number; // 0-100
  screen_time: number; // minutes (cumulative for the record window)
  perclos: number; // 0-100 (% eye closure)
  eye_closure: number; // 0-100
  hydration_score: number; // 0-100
  breaks_taken: number; // count
}

export interface Dataset {
  name: string;
  loadedAt: number;
  rows: SessionRow[];
}
