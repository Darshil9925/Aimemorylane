import type { PhotoboothTemplate, PolaroidEffect } from "@/types"

export const PHOTOBOOTH_TEMPLATES: PhotoboothTemplate[] = [
  { id: "vintage", name: "Vintage Booth", description: "Classic warm-toned strips", preview: "/images/examples/photobooth-vintage.jpg" },
  { id: "korean", name: "Korean Booth", description: "K-pop aesthetic strips", preview: "/images/examples/photobooth-korean.jpg" },
  { id: "y2k", name: "Y2K Booth", description: "Early 2000s nostalgia", preview: "/images/examples/photobooth-y2k.jpg" },
  { id: "bnw", name: "Black & White", description: "Timeless monochrome", preview: "/images/examples/photobooth-bnw.jpg" },
  { id: "retro-mall", name: "Retro Mall Booth", description: "90s mall photobooth energy", preview: "/images/examples/photobooth-retro.jpg" },
  { id: "tokyo", name: "Tokyo Booth", description: "Japanese sticker booth style", preview: "/images/examples/photobooth-tokyo.jpg" },
]

export const POLAROID_EFFECTS: PolaroidEffect[] = [
  { id: "film-grain", name: "Film Grain", cssClass: "effect-film-grain" },
  { id: "dust", name: "Dust & Scratches", cssClass: "effect-dust" },
  { id: "fade", name: "Faded", cssClass: "effect-fade" },
  { id: "light-leak", name: "Light Leak", cssClass: "effect-light-leak" },
  { id: "vintage-shift", name: "Vintage Color Shift", cssClass: "effect-vintage-shift" },
]

export const DISPOSABLE_PRESETS = [
  { id: "kodak", name: "Kodak Disposable", description: "Warm and punchy tones" },
  { id: "fujifilm", name: "Fujifilm Disposable", description: "Cool greens, soft tones" },
  { id: "early2000s", name: "Early 2000s Camera", description: "Low-res digital nostalgia" },
  { id: "digicam", name: "Digicam", description: "2005 point-and-shoot vibe" },
  { id: "party-flash", name: "Party Flash", description: "High-contrast flash lit" },
]
