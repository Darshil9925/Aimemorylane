export interface TemplatePreset {
  id: string
  name: string
  filter: string
  bg: string
  border: string
  textColor: string
  accentColor: string
  font: string
}

export interface EffectPreset {
  id: string
  name: string
  filter: string
  description: string
}

export const PHOTOBOOTH_PRESETS: TemplatePreset[] = [
  {
    id: "vintage",
    name: "Vintage Booth",
    filter: "sepia(0.4) contrast(1.1) brightness(1.05) saturate(0.85)",
    bg: "#f5f0e8",
    border: "#d4b896",
    textColor: "#6b4c2a",
    accentColor: "#c9956a",
    font: "Georgia, serif",
  },
  {
    id: "korean",
    name: "Korean Booth",
    filter: "contrast(1.12) brightness(1.08) saturate(1.1)",
    bg: "#fff0f6",
    border: "#ffb3d1",
    textColor: "#cc4488",
    accentColor: "#ff69b4",
    font: "'Arial Rounded MT Bold', Arial, sans-serif",
  },
  {
    id: "y2k",
    name: "Y2K Booth",
    filter: "saturate(1.5) contrast(1.15) brightness(1.08)",
    bg: "#e8f4ff",
    border: "#7ec8e3",
    textColor: "#0066cc",
    accentColor: "#00bfff",
    font: "Impact, sans-serif",
  },
  {
    id: "bnw",
    name: "Black & White",
    filter: "grayscale(1) contrast(1.25) brightness(1.05)",
    bg: "#f8f8f8",
    border: "#333",
    textColor: "#222",
    accentColor: "#555",
    font: "Georgia, serif",
  },
  {
    id: "retro-mall",
    name: "Retro Mall",
    filter: "sepia(0.25) saturate(1.4) contrast(1.08) brightness(1.05)",
    bg: "#fff8e8",
    border: "#e8a020",
    textColor: "#8b4500",
    accentColor: "#e8a020",
    font: "Courier New, monospace",
  },
  {
    id: "tokyo",
    name: "Tokyo Booth",
    filter: "contrast(1.1) saturate(1.35) hue-rotate(-8deg) brightness(1.03)",
    bg: "#f0f0ff",
    border: "#9090ff",
    textColor: "#4444cc",
    accentColor: "#6666ff",
    font: "Arial, sans-serif",
  },
]

export const POLAROID_PRESETS: EffectPreset[] = [
  { id: "film-grain", name: "Film Grain", filter: "contrast(1.05) brightness(1.02) saturate(0.95)", description: "Subtle grain, true to analog" },
  { id: "dust", name: "Dust & Scratches", filter: "contrast(1.08) brightness(0.97) sepia(0.08)", description: "Aged with time" },
  { id: "fade", name: "Faded", filter: "contrast(0.88) brightness(1.12) saturate(0.75)", description: "Washed-out nostalgia" },
  { id: "light-leak", name: "Light Leak", filter: "contrast(1.05) brightness(1.18) saturate(1.15)", description: "Exposed to light" },
  { id: "vintage-shift", name: "Vintage Shift", filter: "sepia(0.32) contrast(1.05) saturate(0.88) brightness(1.05)", description: "Warm 70s tones" },
]

export const DISPOSABLE_PRESETS: EffectPreset[] = [
  { id: "kodak", name: "Kodak Disposable", filter: "contrast(1.2) saturate(1.35) brightness(1.05) sepia(0.08)", description: "Warm, punchy, punchy" },
  { id: "fujifilm", name: "Fujifilm Disposable", filter: "contrast(1.1) saturate(1.05) hue-rotate(6deg) brightness(1.02)", description: "Cool greens, soft tones" },
  { id: "early2000s", name: "Early 2000s", filter: "contrast(1.3) saturate(0.75) brightness(1.18)", description: "Low-res digital nostalgia" },
  { id: "digicam", name: "Digicam", filter: "contrast(1.25) saturate(0.85) brightness(1.12)", description: "2005 point-and-shoot" },
  { id: "party-flash", name: "Party Flash", filter: "contrast(1.4) brightness(1.28) saturate(0.65)", description: "High-contrast flash lit" },
]
