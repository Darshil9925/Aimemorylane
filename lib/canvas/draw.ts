import type { TemplatePreset, PolaroidPreset } from "./filters"
import type { UploadedPhoto } from "@/types"

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Cover-crop: fill rect without stretching
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number
) {
  const ir = img.naturalWidth / img.naturalHeight
  const rr = w / h
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
  if (ir > rr) { sw = img.naturalHeight * rr; sx = (img.naturalWidth - sw) / 2 }
  else { sh = img.naturalWidth / rr; sy = (img.naturalHeight - sh) / 2 }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

// Radial vignette over a photo rect
function drawVignette(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  strength: number
) {
  const grd = ctx.createRadialGradient(
    x + w / 2, y + h / 2, h * 0.18,
    x + w / 2, y + h / 2, h * 0.88
  )
  grd.addColorStop(0, "rgba(0,0,0,0)")
  grd.addColorStop(1, `rgba(0,0,0,${strength})`)
  ctx.fillStyle = grd
  ctx.fillRect(x, y, w, h)
}

// Film sprocket holes along left and right edges
function drawSprockets(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  darkStrip: boolean
) {
  const holeW = 10
  const holeH = 18
  const spacing = 38
  const offsetX = 4
  const color = darkStrip ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)"

  for (let y = 24; y < H - holeH; y += spacing) {
    // Left
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(offsetX, y, holeW, holeH, 2)
    ctx.fill()
    // Right
    ctx.beginPath()
    ctx.roundRect(W - offsetX - holeW, y, holeW, holeH, 2)
    ctx.fill()
  }
}

// Tiny corner sticker emojis for Korean / Tokyo
function drawDecorEmoji(
  ctx: CanvasRenderingContext2D,
  W: number,
  photoY: number,
  photoSize: number,
  pad: number,
  emojis: string[]
) {
  ctx.font = "18px serif"
  const positions = [
    [pad + 4, photoY + 20],
    [pad + photoSize - 24, photoY + 20],
    [pad + 4, photoY + photoSize - 8],
    [pad + photoSize - 24, photoY + photoSize - 8],
  ] as const
  emojis.slice(0, 4).forEach((emoji, i) => {
    if (!positions[i]) return
    ctx.fillText(emoji, positions[i][0], positions[i][1])
  })
}

// Add pixel-level film grain
function addGrain(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  amount: number
) {
  // Work on a small tile to avoid blowing memory on large canvases
  const tileSize = Math.min(w, h, 256)
  const offscreen = document.createElement("canvas")
  offscreen.width = tileSize
  offscreen.height = tileSize
  const oc = offscreen.getContext("2d")!
  const imageData = oc.createImageData(tileSize, tileSize)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * amount
    imageData.data[i] = 128 + n
    imageData.data[i + 1] = 128 + n
    imageData.data[i + 2] = 128 + n
    imageData.data[i + 3] = Math.abs(n) * 1.8 // alpha
  }
  oc.putImageData(imageData, 0, 0)
  ctx.globalCompositeOperation = "overlay"
  // Tile the grain
  for (let tx = 0; tx < w; tx += tileSize)
    for (let ty = 0; ty < h; ty += tileSize)
      ctx.drawImage(offscreen, tx, ty)
  ctx.globalCompositeOperation = "source-over"
}

// ─── Photobooth Strip ──────────────────────────────────────────────────────

export async function drawPhotoboothStrip(
  canvas: HTMLCanvasElement,
  photos: UploadedPhoto[],
  template: TemplatePreset,
  caption: string,
  dateStamp: string
): Promise<void> {
  const count = Math.min(photos.length, 4)
  const W = 400
  // Sprocket templates need left/right margin for holes
  const sidePad = template.sprockets ? 26 : 18
  const topPad = 18
  const gap = 8
  const photoSize = W - sidePad * 2   // square photos
  const brandH = 80
  const H = topPad + count * photoSize + (count - 1) * gap + brandH

  canvas.width = W
  canvas.height = H

  const ctx = canvas.getContext("2d")!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"

  // ── Background ──────────────────────────────────────────────────────────
  ctx.fillStyle = template.stripBg
  ctx.fillRect(0, 0, W, H)

  // Outer border line (subtle)
  ctx.strokeStyle = template.border
  ctx.lineWidth = template.darkStrip ? 0 : 2
  ctx.strokeRect(1, 1, W - 2, H - 2)

  // Sprocket holes
  if (template.sprockets) drawSprockets(ctx, W, H, template.darkStrip)

  // ── Photos ──────────────────────────────────────────────────────────────
  for (let i = 0; i < count; i++) {
    const img = await loadImg(photos[i].previewUrl)
    const x = sidePad
    const y = topPad + i * (photoSize + gap)

    // Clip to square
    ctx.save()
    ctx.beginPath()
    ctx.rect(x, y, photoSize, photoSize)
    ctx.clip()

    // Apply template filter + draw
    ctx.filter = template.filter
    drawCover(ctx, img, x, y, photoSize, photoSize)
    ctx.filter = "none"

    // Vignette
    if (template.vignette > 0) drawVignette(ctx, x, y, photoSize, photoSize, template.vignette)

    ctx.restore()

    // Corner sticker decorations (last photo only to avoid clutter)
    if (template.decorEmoji && i === 0) {
      drawDecorEmoji(ctx, W, y, photoSize, sidePad, template.decorEmoji)
    }
  }

  // ── Grain ───────────────────────────────────────────────────────────────
  if (template.vignette > 0.3) addGrain(ctx, W, H, 0.07)

  // ── Branding ────────────────────────────────────────────────────────────
  const brandY = topPad + count * photoSize + (count - 1) * gap

  // Separator line
  ctx.strokeStyle = template.darkStrip ? template.border + "55" : template.border + "44"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(sidePad, brandY + 14)
  ctx.lineTo(W - sidePad, brandY + 14)
  ctx.stroke()

  // Caption
  ctx.textAlign = "center"
  ctx.fillStyle = template.textColor
  ctx.font = `bold 17px ${template.font}`
  ctx.fillText(caption || "memory booth ✦", W / 2, brandY + 38)

  // Date
  ctx.fillStyle = template.accentColor
  ctx.font = `12px ${template.font}`
  ctx.fillText(
    dateStamp || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    W / 2,
    brandY + 56
  )

  // Serial number (very small, like a real machine)
  ctx.fillStyle = (template.darkStrip ? "#ffffff" : "#000000") + "33"
  ctx.font = "9px 'Courier New', monospace"
  ctx.fillText(
    `#MEM-${Date.now().toString(36).toUpperCase().slice(-8)}`,
    W / 2,
    brandY + 72
  )
}

// ─── Polaroid ──────────────────────────────────────────────────────────────

export async function drawPolaroid(
  canvas: HTMLCanvasElement,
  photo: UploadedPhoto,
  preset: PolaroidPreset,
  caption: string
): Promise<void> {
  const W = 440
  const sideL = 22   // left/right/top border
  const sideR = 22
  const topPad = 22
  const bottomPad = 88  // classic Instax thick bottom
  const photoSize = W - sideL - sideR
  const H = topPad + photoSize + bottomPad

  canvas.width = W
  canvas.height = H

  const ctx = canvas.getContext("2d")!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"

  // ── Drop shadow ─────────────────────────────────────────────────────────
  ctx.shadowColor = preset.frameShadow
  ctx.shadowBlur = 28
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 8
  ctx.fillStyle = preset.frameColor
  ctx.fillRect(0, 0, W, H)
  ctx.shadowColor = "transparent"
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  // ── Frame ───────────────────────────────────────────────────────────────
  ctx.fillStyle = preset.frameColor
  ctx.fillRect(0, 0, W, H)

  // Subtle inner shadow at photo edge
  ctx.strokeStyle = "rgba(0,0,0,0.06)"
  ctx.lineWidth = 1
  ctx.strokeRect(sideL, topPad, photoSize, photoSize)

  // ── Photo ───────────────────────────────────────────────────────────────
  const img = await loadImg(photo.previewUrl)
  ctx.save()
  ctx.beginPath()
  ctx.rect(sideL, topPad, photoSize, photoSize)
  ctx.clip()
  ctx.filter = preset.filter
  drawCover(ctx, img, sideL, topPad, photoSize, photoSize)
  ctx.filter = "none"
  ctx.restore()

  // ── Caption ─────────────────────────────────────────────────────────────
  ctx.textAlign = "center"
  ctx.fillStyle = preset.captionColor
  ctx.font = "italic 20px 'Georgia', serif"
  ctx.fillText(
    caption || "",
    W / 2,
    topPad + photoSize + 52
  )
}

// ─── Disposable Camera ─────────────────────────────────────────────────────

export async function drawDisposablePhoto(
  canvas: HTMLCanvasElement,
  photo: UploadedPhoto,
  filter: string
): Promise<void> {
  const img = await loadImg(photo.previewUrl)
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext("2d")!
  ctx.filter = filter
  ctx.drawImage(img, 0, 0)
  ctx.filter = "none"
  // Film grain
  addGrain(ctx, canvas.width, canvas.height, 0.09)
  // Slight vignette
  drawVignette(ctx, 0, 0, canvas.width, canvas.height, 0.35)
}
