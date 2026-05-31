/**
 * Platform-aware download strategy.
 *
 * Mobile (iOS/Android):
 *   Web Share API → native share sheet → "Save Image" → Camera Roll.
 *   This is the ONLY way to save photos to Camera Roll from a browser.
 *
 * Desktop (Mac/Windows/Linux):
 *   Single file  → Blob URL + a.click() → browser's native download.
 *   Multiple     → JSZip → one .zip → single a.click().
 *   NEVER use navigator.share() on desktop — macOS supports it but opens
 *   the share sheet instead of downloading, which is confusing UX.
 *
 * Never use staggered a.click() — each await after the first drops the
 * browser's transient user-activation token, silently blocking downloads.
 */

/** Detect actual mobile touch device (not just "supports share API") */
function isTouchMobile(): boolean {
  if (typeof navigator === "undefined") return false
  // Check for mobile UA patterns
  const mobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Opera Mini|IEMobile/i.test(
    navigator.userAgent
  )
  // Also check for touch + small screen (catches iPads in desktop mode)
  const touchSmallScreen =
    "ontouchstart" in window &&
    typeof screen !== "undefined" &&
    screen.width < 1024
  return mobileUA || touchSmallScreen
}

/** Convert a data URL to a Blob */
function dataUrlToBlob(dataUrl: string, mimeType = "image/png"): Blob {
  const base64 = dataUrl.split(",")[1]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mimeType })
}

/** Download a single file via Blob URL — works on all desktop browsers */
function blobDownload(blob: Blob, filename: string): void {
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

/** Try Web Share API — only on mobile, with file support */
async function tryMobileShare(files: File[], title: string): Promise<boolean> {
  if (!isTouchMobile()) return false
  if (typeof navigator.canShare !== "function") return false
  if (!navigator.canShare({ files })) return false

  try {
    await navigator.share({ files, title })
    return true
  } catch (e) {
    // AbortError = user dismissed the sheet — that's fine, we handled it
    if ((e as Error).name === "AbortError") return true
    // Any other error → fall through to download
    return false
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Save a single photo — share sheet on mobile, direct download on desktop */
export async function saveSinglePhoto(dataUrl: string, filename: string): Promise<void> {
  const blob = dataUrlToBlob(dataUrl)
  const file = new File([blob], filename, { type: "image/png" })

  const shared = await tryMobileShare([file], filename)
  if (shared) return

  // Desktop: direct blob download
  blobDownload(blob, filename)
}

/** Save multiple photos — share sheet on mobile, ZIP on desktop */
export async function saveAllPhotos(
  files: { dataUrl: string; filename: string }[],
  shareTitle: string,
  zipName: string
): Promise<void> {
  if (!files.length) return

  // Mobile: try share sheet with all files
  const fileObjects = files.map(({ dataUrl, filename }) => {
    const blob = dataUrlToBlob(dataUrl)
    return new File([blob], filename, { type: "image/png" })
  })

  const shared = await tryMobileShare(fileObjects, shareTitle)
  if (shared) return

  // Desktop: bundle into ZIP, single download
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
  blobDownload(blob, zipName)
}

/** Public mobile detection for UI label changes */
export function isMobile(): boolean {
  return isTouchMobile()
}
