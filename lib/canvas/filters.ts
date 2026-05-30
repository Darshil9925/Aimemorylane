export interface TemplatePreset {
  id: string
  name: string
  emoji: string
  filter: string
  bg: string
  stripBg: string         // inner strip color (can differ from outer)
  border: string
  textColor: string
  accentColor: string
  font: string
  vignette: number        // 0 = none, 0.5 = medium, 1 = heavy
  darkStrip: boolean      // for dark-background templates
  sprockets: boolean      // film sprocket holes on sides
  decorEmoji?: string[]   // sticker overlays for Korean/Tokyo
}

export interface PolaroidPreset {
  id: string
  name: string
  description: string
  filter: string
  frameColor: string
  frameShadow: string
  captionColor: string
}

export interface EffectPreset {
  id: string
  name: string
  filter: string
  description: string
}

// ─── 12 Photobooth Templates ───────────────────────────────────────────────

export const PHOTOBOOTH_PRESETS: TemplatePreset[] = [
  {
    id: "warm-vintage",
    name: "Warm Vintage",
    emoji: "📜",
    filter: "sepia(0.55) contrast(1.15) brightness(1.08) saturate(0.8)",
    bg: "#f0e6d3",
    stripBg: "#f4ede0",
    border: "#c4966a",
    textColor: "#5c3a1e",
    accentColor: "#9b6840",
    font: "Georgia, 'Times New Roman', serif",
    vignette: 0.45,
    darkStrip: false,
    sprockets: true,
  },
  {
    id: "korean-purikura",
    name: "K-Purikura",
    emoji: "🌸",
    filter: "contrast(1.18) brightness(1.14) saturate(1.3)",
    bg: "#fff0f7",
    stripBg: "#fff5fa",
    border: "#ff85c0",
    textColor: "#cc2277",
    accentColor: "#ff4499",
    font: "'Arial Rounded MT Bold', Arial, sans-serif",
    vignette: 0,
    darkStrip: false,
    sprockets: false,
    decorEmoji: ["⭐", "💖", "🌟", "✨"],
  },
  {
    id: "y2k-chrome",
    name: "Y2K Chrome",
    emoji: "💿",
    filter: "saturate(1.7) contrast(1.22) brightness(1.12) hue-rotate(8deg)",
    bg: "#d0e8ff",
    stripBg: "#e0f0ff",
    border: "#2288ff",
    textColor: "#003399",
    accentColor: "#0055ff",
    font: "Impact, 'Arial Black', sans-serif",
    vignette: 0.2,
    darkStrip: false,
    sprockets: false,
  },
  {
    id: "film-noir",
    name: "Film Noir",
    emoji: "🎬",
    filter: "grayscale(1) contrast(1.5) brightness(0.92)",
    bg: "#0d0d0d",
    stripBg: "#111111",
    border: "#444444",
    textColor: "#eeeeee",
    accentColor: "#aaaaaa",
    font: "Georgia, serif",
    vignette: 0.7,
    darkStrip: true,
    sprockets: true,
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    emoji: "🌅",
    filter: "sepia(0.18) saturate(1.5) brightness(1.15) contrast(1.1) hue-rotate(-12deg)",
    bg: "#fff7e8",
    stripBg: "#fffbf0",
    border: "#f0a030",
    textColor: "#7a4a00",
    accentColor: "#e88000",
    font: "Georgia, serif",
    vignette: 0.3,
    darkStrip: false,
    sprockets: false,
  },
  {
    id: "instax-clean",
    name: "Instax Clean",
    emoji: "📸",
    filter: "contrast(1.1) brightness(1.06) saturate(1.08)",
    bg: "#ffffff",
    stripBg: "#ffffff",
    border: "#dddddd",
    textColor: "#333333",
    accentColor: "#888888",
    font: "Helvetica, Arial, sans-serif",
    vignette: 0.1,
    darkStrip: false,
    sprockets: false,
  },
  {
    id: "tokyo-nights",
    name: "Tokyo Nights",
    emoji: "🌃",
    filter: "contrast(1.25) saturate(1.5) hue-rotate(-20deg) brightness(1.0)",
    bg: "#0a0818",
    stripBg: "#0e0c20",
    border: "#7755ee",
    textColor: "#cc99ff",
    accentColor: "#9966ff",
    font: "Arial, sans-serif",
    vignette: 0.55,
    darkStrip: true,
    sprockets: false,
    decorEmoji: ["⭐", "🌙", "💫"],
  },
  {
    id: "lomography",
    name: "Lomography",
    emoji: "🔴",
    filter: "contrast(1.3) saturate(1.65) brightness(1.06) hue-rotate(-6deg)",
    bg: "#f5e8e0",
    stripBg: "#f8ede6",
    border: "#cc2200",
    textColor: "#660000",
    accentColor: "#cc3311",
    font: "Courier New, monospace",
    vignette: 0.65,
    darkStrip: false,
    sprockets: false,
  },
  {
    id: "sakura",
    name: "Cherry Blossom",
    emoji: "🌸",
    filter: "contrast(0.93) brightness(1.16) saturate(0.82) sepia(0.12)",
    bg: "#fff0f5",
    stripBg: "#fff5f8",
    border: "#ffaac8",
    textColor: "#994466",
    accentColor: "#ff88aa",
    font: "'Arial Rounded MT Bold', Arial, sans-serif",
    vignette: 0.15,
    darkStrip: false,
    sprockets: false,
    decorEmoji: ["🌸", "🌷", "🌸"],
  },
  {
    id: "arcade-neon",
    name: "Arcade Neon",
    emoji: "🕹️",
    filter: "contrast(1.35) saturate(1.8) brightness(1.08)",
    bg: "#050510",
    stripBg: "#080816",
    border: "#00ffcc",
    textColor: "#00ffcc",
    accentColor: "#ff00aa",
    font: "Courier New, 'Lucida Console', monospace",
    vignette: 0.6,
    darkStrip: true,
    sprockets: false,
  },
  {
    id: "summer-film",
    name: "Summer Film",
    emoji: "☀️",
    filter: "contrast(1.12) saturate(1.38) brightness(1.1) sepia(0.06)",
    bg: "#fffde0",
    stripBg: "#ffffe8",
    border: "#e8d040",
    textColor: "#6b5a00",
    accentColor: "#c8a800",
    font: "Georgia, serif",
    vignette: 0.25,
    darkStrip: false,
    sprockets: false,
  },
  {
    id: "soft-matte",
    name: "Soft Matte",
    emoji: "🤍",
    filter: "contrast(0.82) brightness(1.14) saturate(0.65)",
    bg: "#f5f2f0",
    stripBg: "#f8f5f3",
    border: "#ccc4bc",
    textColor: "#666058",
    accentColor: "#999090",
    font: "Helvetica, Arial, sans-serif",
    vignette: 0.2,
    darkStrip: false,
    sprockets: false,
  },
]

// ─── 10 Polaroid Presets ───────────────────────────────────────────────────

export const POLAROID_PRESETS: PolaroidPreset[] = [
  {
    id: "classic-white",
    name: "Classic White",
    description: "Clean and true — just like a real Instax",
    filter: "contrast(1.06) brightness(1.04) saturate(1.05)",
    frameColor: "#ffffff",
    frameShadow: "rgba(0,0,0,0.15)",
    captionColor: "#444444",
  },
  {
    id: "film-grain",
    name: "Film Grain",
    description: "Subtle 35mm grain and soft contrast",
    filter: "contrast(1.08) brightness(1.02) saturate(0.92)",
    frameColor: "#f8f6f0",
    frameShadow: "rgba(0,0,0,0.18)",
    captionColor: "#555544",
  },
  {
    id: "vintage-fade",
    name: "Vintage Fade",
    description: "Washed-out tones like a photo from a shoebox",
    filter: "contrast(0.82) brightness(1.18) saturate(0.62) sepia(0.12)",
    frameColor: "#f5f0e0",
    frameShadow: "rgba(100,80,40,0.2)",
    captionColor: "#7a6040",
  },
  {
    id: "light-leak",
    name: "Light Leak",
    description: "Warm light burned onto the frame edges",
    filter: "contrast(1.08) brightness(1.22) saturate(1.25) hue-rotate(-5deg)",
    frameColor: "#fff8f0",
    frameShadow: "rgba(200,100,0,0.2)",
    captionColor: "#8b5500",
  },
  {
    id: "golden-tones",
    name: "Golden Tones",
    description: "Amber warmth of an afternoon in summer",
    filter: "sepia(0.38) contrast(1.1) saturate(1.2) brightness(1.1)",
    frameColor: "#fff8e8",
    frameShadow: "rgba(180,120,0,0.15)",
    captionColor: "#7a5000",
  },
  {
    id: "cross-process",
    name: "Cross Process",
    description: "Slide film in a C-41 lab — vivid color shift",
    filter: "contrast(1.35) saturate(1.65) hue-rotate(20deg) brightness(1.05)",
    frameColor: "#ffffff",
    frameShadow: "rgba(0,50,100,0.2)",
    captionColor: "#002244",
  },
  {
    id: "faded-bw",
    name: "Faded B&W",
    description: "Soft monochrome, like a family photo from 1965",
    filter: "grayscale(1) contrast(0.88) brightness(1.16) sepia(0.08)",
    frameColor: "#f2f0ec",
    frameShadow: "rgba(0,0,0,0.18)",
    captionColor: "#444440",
  },
  {
    id: "punchy-bw",
    name: "Punchy B&W",
    description: "High-contrast black and white — editorial look",
    filter: "grayscale(1) contrast(1.55) brightness(0.96)",
    frameColor: "#ffffff",
    frameShadow: "rgba(0,0,0,0.25)",
    captionColor: "#111111",
  },
  {
    id: "cool-film",
    name: "Cool Film",
    description: "Blue-shifted, like shooting in overcast shade",
    filter: "contrast(1.1) saturate(1.05) hue-rotate(18deg) brightness(1.04)",
    frameColor: "#f0f4ff",
    frameShadow: "rgba(0,30,120,0.12)",
    captionColor: "#223366",
  },
  {
    id: "lomo-color",
    name: "Lomo Color",
    description: "Heavy saturation and rich shadows",
    filter: "contrast(1.38) saturate(1.7) brightness(1.02) hue-rotate(-5deg)",
    frameColor: "#fff0ee",
    frameShadow: "rgba(180,0,0,0.18)",
    captionColor: "#660000",
  },
]

// ─── Disposable Presets (unchanged) ────────────────────────────────────────

export const DISPOSABLE_PRESETS: EffectPreset[] = [
  { id: "kodak", name: "Kodak Gold 200", filter: "contrast(1.22) saturate(1.42) brightness(1.06) sepia(0.1)", description: "Warm, punchy reds and yellows" },
  { id: "fujifilm", name: "Fujifilm Superia", filter: "contrast(1.1) saturate(1.08) hue-rotate(7deg) brightness(1.03)", description: "Natural greens, soft tones" },
  { id: "early2000s", name: "Early 2000s Digital", filter: "contrast(1.32) saturate(0.72) brightness(1.2)", description: "Oversharpened low-res nostalgia" },
  { id: "digicam", name: "Digicam 2005", filter: "contrast(1.28) saturate(0.82) brightness(1.14)", description: "Sony Cybershot point-and-shoot" },
  { id: "party-flash", name: "Party Flash", filter: "contrast(1.45) brightness(1.32) saturate(0.6)", description: "Harsh flash, washed highlights" },
]
