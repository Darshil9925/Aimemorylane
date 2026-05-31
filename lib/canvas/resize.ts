import type { PhotoPayload } from "@/types/ai"

/**
 * Resize an image from an object URL to a target max dimension
 * and return it as a base64-encoded JPEG for the AI API.
 * Runs client-side only.
 */
export function photoToBase64(
  previewUrl: string,
  maxDimension = 1024,
  quality = 0.85
): Promise<PhotoPayload> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const ratio = Math.min(maxDimension / img.width, maxDimension / img.height, 1)
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)
      const ctx = canvas.getContext("2d")
      if (!ctx) { reject(new Error("Canvas 2D context unavailable")); return }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL("image/jpeg", quality)
      resolve({
        data: dataUrl.split(",")[1],
        mediaType: "image/jpeg",
      })
    }
    img.onerror = () => reject(new Error(`Failed to load image for resize: ${previewUrl.slice(0, 60)}`))
    img.src = previewUrl
  })
}

/** Convert multiple photos in parallel, capped at maxPhotos */
export async function photosToBase64(
  previewUrls: string[],
  maxPhotos = 10,
  maxDimension = 1024
): Promise<PhotoPayload[]> {
  return Promise.all(
    previewUrls.slice(0, maxPhotos).map((url) => photoToBase64(url, maxDimension))
  )
}
