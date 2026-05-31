/**
 * Platform-aware download strategy.
 *
 * iOS Safari:  Web Share API → native share sheet → "Save Image" → Camera Roll.
 *              ZIP is useless here; users need Files app to extract, can't save to Camera Roll.
 * Android:     Web Share API where supported, Blob URL single download otherwise.
 * Desktop:     JSZip → one .zip containing all files (one click, one gesture, always works).
 *
 * Never use staggered a.click() — each await after the first drops the browser's
 * transient user-activation token, silently blocking all downloads after the first.
 */

/** Convert a data URL to a Blob (sync-friendly, no fetch needed) */
function dataUrlToBlob(dataUrl: string, mimeType = "image/png"): Blob {
  const base64 = dataUrl.split(",")[1]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mimeType })
}

/** Single-file download that also works on iOS via Web Share API */
export async function saveSinglePhoto(dataUrl: string, filename: string): Promise<void> {
  const blob = dataUrlToBlob(dataUrl)
  const file = new File([blob], filename, { type: "image/png" })

  // iOS / Android: use native share sheet → Save Image → Camera Roll
  if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename })
      return
    } catch (e) {
      if ((e as Error).name === "AbortError") return // user dismissed sheet — that's fine
      // Any other error → fall through to blob download
    }
  }

  // Desktop fallback: Blob URL download (single file, always within user activation)
  const blobUrl = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = blobUrl
  a.download = filename
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000)
}

/** Save all photos — Web Share API on mobile, ZIP on desktop */
export async function saveAllPhotos(
  files: { dataUrl: string; filename: string }[],
  shareTitle: string,
  zipName: string
): Promise<void> {
  if (!files.length) return

  // Build File objects for Web Share API
  const fileObjects = files.map(({ dataUrl, filename }) => {
    const blob = dataUrlToBlob(dataUrl)
    return new File([blob], filename, { type: "image/png" })
  })

  // iOS / Android — native share sheet
  if (typeof navigator.canShare === "function" && navigator.canShare({ files: fileObjects })) {
    try {
      await navigator.share({ files: fileObjects, title: shareTitle })
      return
    } catch (e) {
      if ((e as Error).name === "AbortError") return // user dismissed
      // Fall through to ZIP
    }
  }

  // Desktop — single ZIP download (one click, one activation, all files inside)
  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()
  for (const { dataUrl, filename } of files) {
    zip.file(filename, dataUrl.split(",")[1], { base64: true })
  }
  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  })
  const blobUrl = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = blobUrl
  a.download = zipName
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000)
}

/** Detect if we're on a mobile device (for label copy changes) */
export function isMobile(): boolean {
  return typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}
