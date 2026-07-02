import type { ScoreBundle } from "./analytics";

export interface Insight {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warn" | "critical";
  metric: string;
  value: string;
}

export function generateInsights(s: ScoreBundle): Insight[] {
  const out: Insight[] = [];

  if (s.blinkQuality < 60) {
    const rate = Math.round(20 - (100 - s.blinkQuality) / 6);
    out.push({
      id: "blink-low",
      severity: "warn",
      metric: "Blink rate",
      value: `${rate}/min`,
      title: "Your blink rate is below the healthy range",
      body: `We measured a blink rate around ${rate} blinks/min. A relaxed range sits between 15–20. Take a short break and consciously blink 10 times to re-lubricate your eyes.`,
    });
  }

  if (s.screenTime > 120) {
    out.push({
      id: "screentime-high",
      severity: s.screenTime > 240 ? "critical" : "warn",
      metric: "Screen time",
      value: `${Math.round(s.screenTime)} min`,
      title: "Extended screen exposure detected",
      body: `You've logged ${Math.round(s.screenTime)} minutes of screen time today. Try the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds.`,
    });
  }

  if (s.fatigue > 55) {
    out.push({
      id: "fatigue-high",
      severity: s.fatigue > 75 ? "critical" : "warn",
      metric: "Digital fatigue",
      value: `${Math.round(s.fatigue)}/100`,
      title: "Digital fatigue is trending high",
      body: `Fatigue reads ${Math.round(s.fatigue)}. Reduce screen brightness by 20%, warm your display color temperature, and step away from your device for 5 minutes.`,
    });
  }

  if (s.comfort < 65) {
    out.push({
      id: "comfort-low",
      severity: "warn",
      metric: "Eye comfort",
      value: `${Math.round(s.comfort)}/100`,
      title: "Eye comfort is dropping",
      body: `Comfort scored ${Math.round(s.comfort)}. Try slow blinking exercises (5 sets of 10) and consider lubricating eye drops if dryness persists.`,
    });
  }

  if (s.focus < 60) {
    out.push({
      id: "focus-low",
      severity: "info",
      metric: "Focus level",
      value: `${Math.round(s.focus)}/100`,
      title: "Focus stability is reduced",
      body: `Your focus signal averages ${Math.round(s.focus)}. A 3-minute breathing pause and a glass of water often restores attention within minutes.`,
    });
  }

  if (s.hydration < 60) {
    out.push({
      id: "hydration",
      severity: "info",
      metric: "Hydration",
      value: `${Math.round(s.hydration)}/100`,
      title: "Ocular hydration signal is low",
      body: `Sip 200ml of water and blink softly. Dehydration reduces tear film stability and increases perceived fatigue.`,
    });
  }

  if (s.breaks < 2 && s.screenTime > 60) {
    out.push({
      id: "breaks",
      severity: "warn",
      metric: "Breaks",
      value: `${s.breaks}`,
      title: "Consider scheduling more micro-breaks",
      body: `Only ${s.breaks} break${s.breaks === 1 ? "" : "s"} logged today. Aim for a 60-second pause every 30 minutes to reset accommodation.`,
    });
  }

  if (!out.length) {
    out.push({
      id: "healthy",
      severity: "info",
      metric: "Overall",
      value: "Excellent",
      title: "Your visual system is well-balanced today",
      body: `Blink cadence, focus stability, and eye comfort are all within healthy bands. Keep the current routine — regular breaks, hydration, and warm lighting.`,
    });
  }

  return out;
}
