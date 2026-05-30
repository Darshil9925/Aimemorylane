import type { TemplatePreset } from "./filters"
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

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

// Cover-crop: draws image filling the rect without stretching
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight
  const rectRatio = w / h
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
  if (imgRatio > rectRatio) {
    sw = img.naturalHeight * rectRatio
    sx = (img.naturalWidth - sw) / 2
  } else {
    sh = img.naturalWidth / rectRatio
    sy = (img.naturalHeight - sh) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

export async function drawPhotoboothStrip(
  canvas: HTMLCanvasElement,
  photos: UploadedPhoto[],
  template: TemplatePreset,
  caption: string,
  dateStamp: string
): Promise<void> {
  const count = Math.min(photos.length, 4)
  const W = 480
  const pad = 22
  const gap = 10
  const photoW = W - pad * 2
  const photoH = Math.round(photoW * 0.72) // ~4:3 landscape
  const captionH = 56
  const H = pad + count * photoH + (count - 1) * gap + captionH + pad

  canvas.width = W
  canvas.height = H

  const ctx = canvas.getContext("2d")!

  // Background card
  drawRoundedRect(ctx, 0, 0, W, H, 16)
  ctx.fillStyle = template.bg
  ctx.fill()

  // Border
  ctx.strokeStyle = template.border
  ctx.lineWidth = 3
  drawRoundedRect(ctx, 1.5, 1.5, W - 3, H - 3, 15)
  ctx.stroke()

  // Photos
  for (let i = 0; i < count; i++) {
    const img = await loadImg(photos[i].previewUrl)
    const y = pad + i * (photoH + gap)

    // Clip photo to rounded rect
    ctx.save()
    drawRoundedRect(ctx, pad, y, photoW, photoH, 8)
    ctx.clip()
    ctx.filter = template.filter
    drawCover(ctx, img, pad, y, photoW, photoH)
    ctx.filter = "none"
    ctx.restore()
  }

  // Caption strip
  const captionY = pad + count * photoH + (count - 1) * gap + 8
  ctx.fillStyle = template.textColor
  ctx.font = `bold 15px ${template.font}`
  ctx.textAlign = "center"
  ctx.fillText(caption || "core memory ✦", W / 2, captionY + 20)
  ctx.font = `12px ${template.font}`
  ctx.fillStyle = template.accentColor
  ctx.fillText(dateStamp || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), W / 2, captionY + 38)
}

export async function drawPolaroid(
  canvas: HTMLCanvasElement,
  photo: UploadedPhoto,
  filter: string,
  caption: string
): Promise<void> {
  const W = 420
  const sidePad = 20
  const topPad = 20
  const bottomPad = 80
  const photoSize = W - sidePad * 2
  const H = topPad + photoSize + bottomPad

  canvas.width = W
  canvas.height = H

  const ctx = canvas.getContext("2d")!

  // White polaroid background
  drawRoundedRect(ctx, 0, 0, W, H, 6)
  ctx.fillStyle = "#ffffff"
  ctx.fill()
  ctx.strokeStyle = "#e5e5e5"
  ctx.lineWidth = 1
  ctx.stroke()

  // Shadow
  ctx.shadowColor = "rgba(0,0,0,0.12)"
  ctx.shadowBlur = 20
  ctx.shadowOffsetY = 6
  drawRoundedRect(ctx, 0, 0, W, H, 6)
  ctx.fill()
  ctx.shadowColor = "transparent"
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  // Photo
  const img = await loadImg(photo.previewUrl)
  ctx.save()
  drawRoundedRect(ctx, sidePad, topPad, photoSize, photoSize, 4)
  ctx.clip()
  ctx.filter = filter
  drawCover(ctx, img, sidePad, topPad, photoSize, photoSize)
  ctx.filter = "none"
  ctx.restore()

  // Caption
  if (caption) {
    ctx.fillStyle = "#555"
    ctx.font = "italic 18px 'Patrick Hand', 'Caveat', Georgia, serif"
    ctx.textAlign = "center"
    ctx.fillText(caption, W / 2, topPad + photoSize + 48)
  }
}

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

  // Film grain overlay using noise
  addGrainOverlay(ctx, canvas.width, canvas.height, 0.04)
}

function addGrainOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opacity: number
) {
  const imageData = ctx.createImageData(w, h)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * opacity * 4
    imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + n))
    imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + n))
    imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + n))
    imageData.data[i + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
}
