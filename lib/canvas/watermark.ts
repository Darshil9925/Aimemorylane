/**
 * Watermark for free tier exports.
 * Adds a subtle "memory booth ✦" text in the bottom-right corner.
 *
 * Only applied client-side before download. The stored asset in the DB
 * is always unwatermarked — if the user upgrades later they can re-download.
 */

export function applyWatermark(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const W = canvas.width
  const H = canvas.height

  // Semi-transparent white text with a slight shadow
  ctx.save()
  ctx.textAlign = "right"
  ctx.textBaseline = "bottom"

  // Shadow for readability on both light and dark images
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
  ctx.shadowBlur = 4
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1

  const fontSize = Math.max(12, Math.min(W * 0.025, 20))
  ctx.font = `${fontSize}px 'Helvetica Neue', Helvetica, Arial, sans-serif`
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)"
  ctx.fillText("memory booth ✦", W - fontSize * 0.8, H - fontSize * 0.6)

  ctx.restore()
}

/**
 * Apply watermark to a data URL and return the watermarked version.
 * The original data URL is not modified.
 */
export async function watermarkDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0)
      applyWatermark(canvas)
      resolve(canvas.toDataURL("image/png"))
    }
    img.onerror = () => reject(new Error("Failed to load image for watermark"))
    img.src = dataUrl
  })
}
