import type { UploadedPhoto } from "@/types"

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load: ${src.slice(0, 60)}`))
    img.src = src
  })
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number
) {
  const ir = img.naturalWidth / img.naturalHeight
  const rr = w / h
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
  if (ir > rr) { sw = sh * rr; sx = (img.naturalWidth - sw) / 2 }
  else { sh = sw / rr; sy = (img.naturalHeight - sh) / 2 }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

// ── Decorative elements ──────────────────────────────────────────────────────

function drawTapeStrip(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.fillStyle = "rgba(255, 240, 200, 0.7)"
  ctx.fillRect(-30, -6, 60, 12)
  // Tape texture lines
  ctx.strokeStyle = "rgba(200, 180, 140, 0.3)"
  ctx.lineWidth = 0.5
  for (let i = -28; i < 28; i += 4) {
    ctx.beginPath()
    ctx.moveTo(i, -5)
    ctx.lineTo(i + 2, 5)
    ctx.stroke()
  }
  ctx.restore()
}

function drawSticker(ctx: CanvasRenderingContext2D, emoji: string, x: number, y: number, size: number, angle: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.font = `${size}px serif`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(emoji, 0, 0)
  ctx.restore()
}

function drawDoodle(ctx: CanvasRenderingContext2D, x: number, y: number, type: "heart" | "star" | "arrow" | "circle", color: string) {
  ctx.save()
  ctx.translate(x, y)
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  if (type === "heart") {
    ctx.beginPath()
    ctx.moveTo(0, 4)
    ctx.bezierCurveTo(-8, -4, -14, 2, 0, 14)
    ctx.bezierCurveTo(14, 2, 8, -4, 0, 4)
    ctx.stroke()
  } else if (type === "star") {
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
      const r = i === 0 ? 0 : 10
      ctx[i === 0 ? "moveTo" : "lineTo"](Math.cos(angle) * r, Math.sin(angle) * r)
    }
    ctx.closePath()
    ctx.stroke()
  } else if (type === "arrow") {
    ctx.beginPath()
    ctx.moveTo(-10, 0)
    ctx.lineTo(10, 0)
    ctx.lineTo(5, -5)
    ctx.moveTo(10, 0)
    ctx.lineTo(5, 5)
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.arc(0, 0, 8, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()
}

function drawHandwrittenText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, angle = 0) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((angle * Math.PI) / 180)
  ctx.font = `italic ${size}px Georgia, serif`
  ctx.fillStyle = color
  ctx.textAlign = "center"
  ctx.fillText(text, 0, 0)
  ctx.restore()
}

// ── Scrapbook style configs ──────────────────────────────────────────────────

export interface ScrapbookStyle {
  id: string
  name: string
  bgColor: string
  paperColor: string
  accentColor: string
  textColor: string
  doodleColor: string
  stickers: string[]
  font: string
}

export const SCRAPBOOK_STYLES: ScrapbookStyle[] = [
  {
    id: "travel",
    name: "Travel Journal",
    bgColor: "#f5efe6",
    paperColor: "#fffdf5",
    accentColor: "#c49a6c",
    textColor: "#5c3a1e",
    doodleColor: "#8b6040",
    stickers: ["✈️", "🗺️", "📍", "🌅", "🏖️", "⛰️"],
    font: "Georgia, serif",
  },
  {
    id: "friends",
    name: "Friend Book",
    bgColor: "#fff0f5",
    paperColor: "#fff8fa",
    accentColor: "#ff69b4",
    textColor: "#8b2252",
    doodleColor: "#cc4488",
    stickers: ["💕", "🫶", "✨", "🌟", "😂", "🤳"],
    font: "'Arial Rounded MT Bold', Arial, sans-serif",
  },
  {
    id: "love",
    name: "Love Journal",
    bgColor: "#fff5f5",
    paperColor: "#fffafa",
    accentColor: "#e8384f",
    textColor: "#8b0000",
    doodleColor: "#cc2244",
    stickers: ["❤️", "💌", "🌹", "💑", "🥰", "💋"],
    font: "Georgia, serif",
  },
  {
    id: "collage",
    name: "Memory Collage",
    bgColor: "#f0f0ff",
    paperColor: "#f8f8ff",
    accentColor: "#6666cc",
    textColor: "#333366",
    doodleColor: "#4444aa",
    stickers: ["⭐", "🎨", "📸", "🎶", "🌈", "✨"],
    font: "Helvetica, Arial, sans-serif",
  },
]

// ── Main scrapbook page renderer ─────────────────────────────────────────────

export async function drawScrapbookPage(
  canvas: HTMLCanvasElement,
  photos: UploadedPhoto[],
  style: ScrapbookStyle,
  title: string,
  pageIndex: number
): Promise<void> {
  const W = 1080
  const H = 1440 // 3:4 portrait for print/share
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"

  // ── Background ──────────────────────────────────────────────────────────
  ctx.fillStyle = style.bgColor
  ctx.fillRect(0, 0, W, H)

  // Paper texture dots
  ctx.fillStyle = `${style.accentColor}11`
  for (let i = 0; i < 200; i++) {
    const px = Math.random() * W
    const py = Math.random() * H
    ctx.beginPath()
    ctx.arc(px, py, Math.random() * 2 + 0.5, 0, Math.PI * 2)
    ctx.fill()
  }

  // ── Title strip at top ──────────────────────────────────────────────────
  ctx.fillStyle = style.paperColor
  ctx.fillRect(60, 40, W - 120, 80)
  ctx.strokeStyle = style.accentColor + "44"
  ctx.lineWidth = 1
  ctx.strokeRect(60, 40, W - 120, 80)
  drawHandwrittenText(ctx, title || "memories ✦", W / 2, 88, 28, style.textColor)

  // Page number
  drawHandwrittenText(ctx, `page ${pageIndex + 1}`, W - 100, H - 40, 14, style.accentColor)

  // ── Photo layouts (varies by photo count) ───────────────────────────────
  const count = Math.min(photos.length, 6)
  const layouts = getLayout(count, W, H)

  for (let i = 0; i < count; i++) {
    const layout = layouts[i]
    const img = await loadImg(photos[i].previewUrl)

    ctx.save()
    ctx.translate(layout.x + layout.w / 2, layout.y + layout.h / 2)
    ctx.rotate((layout.rotation * Math.PI) / 180)

    // White photo border (like a printed photo)
    const border = 8
    ctx.fillStyle = style.paperColor
    ctx.shadowColor = "rgba(0,0,0,0.15)"
    ctx.shadowBlur = 12
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 4
    ctx.fillRect(-layout.w / 2 - border, -layout.h / 2 - border, layout.w + border * 2, layout.h + border * 2)
    ctx.shadowColor = "transparent"

    // Photo
    ctx.beginPath()
    ctx.rect(-layout.w / 2, -layout.h / 2, layout.w, layout.h)
    ctx.clip()
    drawCover(ctx, img, -layout.w / 2, -layout.h / 2, layout.w, layout.h)

    ctx.restore()

    // Tape strips on some photos
    if (i % 2 === 0) {
      drawTapeStrip(ctx, layout.x + layout.w / 2, layout.y - 2, layout.rotation + (Math.random() * 10 - 5))
    }
    if (i % 3 === 0) {
      drawTapeStrip(ctx, layout.x + layout.w / 2, layout.y + layout.h + 2, layout.rotation + (Math.random() * 10 - 5))
    }
  }

  // ── Decorations ─────────────────────────────────────────────────────────
  const doodleTypes: ("heart" | "star" | "arrow" | "circle")[] = ["heart", "star", "arrow", "circle"]
  for (let i = 0; i < 6; i++) {
    const dx = 80 + Math.random() * (W - 160)
    const dy = 160 + Math.random() * (H - 280)
    drawDoodle(ctx, dx, dy, doodleTypes[i % 4], style.doodleColor + "66")
  }

  // Stickers
  for (let i = 0; i < 4; i++) {
    const sx = 60 + Math.random() * (W - 120)
    const sy = 160 + Math.random() * (H - 280)
    drawSticker(ctx, style.stickers[i % style.stickers.length], sx, sy, 28 + Math.random() * 12, Math.random() * 20 - 10)
  }

  // ── Bottom handwritten note ─────────────────────────────────────────────
  const notes = [
    "this was the best day ever ♡",
    "never forget this feeling",
    "core memory unlocked ✦",
    "the good old days ☀",
  ]
  drawHandwrittenText(ctx, notes[pageIndex % notes.length], W / 2, H - 80, 18, style.accentColor, Math.random() * 4 - 2)
}

// ── Photo layout calculator ──────────────────────────────────────────────────

interface PhotoLayout {
  x: number
  y: number
  w: number
  h: number
  rotation: number
}

function getLayout(count: number, W: number, H: number): PhotoLayout[] {
  const margin = 80
  const usableW = W - margin * 2
  const usableH = H - 250 // leave room for title + footer
  const startY = 150

  if (count <= 2) {
    const size = Math.min(usableW * 0.65, usableH * 0.42)
    return Array.from({ length: count }, (_, i) => ({
      x: margin + (usableW - size) / 2 + (i === 0 ? -30 : 30),
      y: startY + i * (size + 30) + (i === 0 ? 0 : 20),
      w: size,
      h: size * 0.75,
      rotation: i === 0 ? -3 : 4,
    }))
  }

  if (count <= 4) {
    const cols = 2
    const gapX = 20
    const gapY = 24
    const cellW = (usableW - gapX) / cols
    const cellH = cellW * 0.72
    return Array.from({ length: count }, (_, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      return {
        x: margin + col * (cellW + gapX) + (Math.random() * 16 - 8),
        y: startY + row * (cellH + gapY) + (Math.random() * 12 - 6),
        w: cellW - 16,
        h: cellH - 12,
        rotation: (Math.random() * 8 - 4),
      }
    })
  }

  // 5-6 photos: mixed sizes
  const positions: PhotoLayout[] = []
  const cellW = (usableW - 20) / 3
  const cellH = cellW * 0.72

  for (let i = 0; i < count; i++) {
    const col = i % 3
    const row = Math.floor(i / 3)
    const isLarge = i === 0 || i === 3
    const w = isLarge ? cellW * 1.3 : cellW * 0.9
    const h = w * 0.72
    positions.push({
      x: margin + col * (cellW + 10) + (Math.random() * 10 - 5),
      y: startY + row * (cellH + 30) + (Math.random() * 10 - 5),
      w,
      h,
      rotation: Math.random() * 6 - 3,
    })
  }

  return positions
}
