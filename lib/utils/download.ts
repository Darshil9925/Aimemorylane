/**
 * Download multiple data-URL images as a single ZIP file.
 *
 * Why ZIP instead of staggered a.click()?
 * Browsers grant one "transient user activation" per user gesture.
 * Any a.click() after the first `await` in the handler no longer has
 * an active gesture — the browser silently drops those downloads.
 * Bundling into a ZIP means a single synchronous a.click() inside the
 * original gesture window, so every file is always saved.
 */
export async function downloadAsZip(
  files: { dataUrl: string; filename: string }[],
  zipName: string
): Promise<void> {
  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()

  for (const { dataUrl, filename } of files) {
    // Strip the "data:<mime>;base64," prefix — JSZip wants raw base64
    const base64 = dataUrl.split(",")[1]
    zip.file(filename, base64, { base64: true })
  }

  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } })
  const blobUrl = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = blobUrl
  a.download = zipName
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  // Revoke after the browser has had time to start the download
  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000)
}
