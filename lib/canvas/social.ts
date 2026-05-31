/**
 * Social share card generator — renders memory assets into
 * platform-optimized dimensions.
 *
 * Instagram Story: 1080 × 1920 (9:16)
 * TikTok:          1080 × 1920 (9:16)
 * Snapchat:        1080 × 1920 (9:16)
 * Instagram Post:  1080 × 1080 (1:1)
 * Twitter/X:       1200 × 675  (16:9)
 */

export interface SocialFormat {
  id: string
  name: string
  width: number
  height: number
  emoji: string
}

export const SOCIAL_FORMATS: SocialFormat[] = [
  { id: "ig-story", name: "Instagram Story", width: 1080, height: 1920, emoji: "📱" },
  { id: "ig-post", name: "Instagram Post", width: 1080, height: 1080, emoji: "📷" },
  { id: "tiktok", name: "TikTok", width: 1080, height: 1920, emoji: "🎵" },
  { id: "twitter", name: "Twitter / X", width: 1200, height: 675, emoji: "🐦" },
]

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

/**
 * Render a generated memory asset (data URL) into a social share card
 * with a branded background, the memory image centered, and a footer.
 */
export async function drawSocialCard(
  canvas: HTMLCanvasElement,
  assetDataUrl: string,
  format: SocialFormat,
  title?: string
): Promise<void> {
  const W = format.width
  const H = format.height
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"

  // ── Gradient background ─────────────────────────────────────────────────
  const isPortrait = H > W
  const grd = ctx.createLinearGradient(0, 0, W * 0.3, H)
  grd.addColorStop(0, "#1a1025")
  grd.addColorStop(0.5, "#0f0a1a")
  grd.addColorStop(1, "#160d22")
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, W, H)

  // Decorative gradient orbs
  const orb1 = ctx.createRadialGradient(W * 0.2, H * 0.3, 0, W * 0.2, H * 0.3, W * 0.5)
  orb1.addColorStop(0, "rgba(168, 85, 247, 0.12)")
  orb1.addColorStop(1, "rgba(168, 85, 247, 0)")
  ctx.fillStyle = orb1
  ctx.fillRect(0, 0, W, H)

  const orb2 = ctx.createRadialGradient(W * 0.8, H * 0.7, 0, W * 0.8, H * 0.7, W * 0.4)
  orb2.addColorStop(0, "rgba(244, 63, 94, 0.1)")
  orb2.addColorStop(1, "rgba(244, 63, 94, 0)")
  ctx.fillStyle = orb2
  ctx.fillRect(0, 0, W, H)

  // ── Memory image ────────────────────────────────────────────────────────
  const img = await loadImg(assetDataUrl)
  const padding = isPortrait ? 60 : 40
  const maxImgW = W - padding * 2
  const maxImgH = isPortrait ? H * 0.65 : H * 0.7
  const imgRatio = img.naturalWidth / img.naturalHeight
  let imgW = maxImgW
  let imgH = imgW / imgRatio
  if (imgH > maxImgH) { imgH = maxImgH; imgW = imgH * imgRatio }
  const imgX = (W - imgW) / 2
  const imgY = isPortrait ? H * 0.12 : (H - imgH) / 2 - 30

  // Shadow behind image
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)"
  ctx.shadowBlur = 40
  ctx.shadowOffsetY = 12
  ctx.fillStyle = "#000"
  ctx.fillRect(imgX, imgY, imgW, imgH)
  ctx.shadowColor = "transparent"

  // Draw the memory
  ctx.save()
  ctx.beginPath()
  const r = 16
  ctx.moveTo(imgX + r, imgY)
  ctx.lineTo(imgX + imgW - r, imgY)
  ctx.arcTo(imgX + imgW, imgY, imgX + imgW, imgY + r, r)
  ctx.lineTo(imgX + imgW, imgY + imgH - r)
  ctx.arcTo(imgX + imgW, imgY + imgH, imgX + imgW - r, imgY + imgH, r)
  ctx.lineTo(imgX + r, imgY + imgH)
  ctx.arcTo(imgX, imgY + imgH, imgX, imgY + imgH - r, r)
  ctx.lineTo(imgX, imgY + r)
  ctx.arcTo(imgX, imgY, imgX + r, imgY, r)
  ctx.clip()
  ctx.drawImage(img, imgX, imgY, imgW, imgH)
  ctx.restore()

  // ── Title ───────────────────────────────────────────────────────────────
  if (title) {
    const titleY = imgY + imgH + (isPortrait ? 60 : 40)
    ctx.textAlign = "center"
    ctx.fillStyle = "#ffffff"
    ctx.font = `bold ${isPortrait ? 32 : 24}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
    ctx.fillText(title, W / 2, titleY, W - 80)
  }

  // ── Branding footer ─────────────────────────────────────────────────────
  const footerY = H - (isPortrait ? 80 : 50)
  ctx.textAlign = "center"
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)"
  ctx.font = `${isPortrait ? 16 : 13}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
  ctx.fillText("made with memory booth ✦", W / 2, footerY)
}
