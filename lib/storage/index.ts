/**
 * Storage abstraction — upload generated images to cloud storage.
 *
 * Provider selection (via STORAGE_PROVIDER env var):
 *   "vercel-blob" (default) — Vercel Blob, zero config on Vercel, free 1GB
 *   "s3"                    — AWS S3, needs IAM keys + bucket
 *
 * All functions return public URLs. The interface is provider-agnostic so
 * callers never import provider-specific code.
 */

export type StorageProvider = "vercel-blob" | "s3"

function getProvider(): StorageProvider {
  return (process.env.STORAGE_PROVIDER as StorageProvider) ?? "vercel-blob"
}

/** Convert a data URL to a Buffer + content type */
function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; contentType: string } {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/)
  if (!match) throw new Error("Invalid data URL")
  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  }
}

/**
 * Upload a generated image (data URL) to cloud storage.
 * Returns the public URL.
 */
export async function uploadImage(
  dataUrl: string,
  path: string
): Promise<string> {
  const provider = getProvider()
  const { buffer, contentType } = dataUrlToBuffer(dataUrl)

  if (provider === "s3") {
    const { uploadToS3 } = await import("./s3")
    return uploadToS3(buffer, path, contentType)
  }

  // Default: Vercel Blob
  const { uploadToVercelBlob } = await import("./vercel-blob")
  return uploadToVercelBlob(buffer, path, contentType)
}

/**
 * Upload multiple images in parallel. Returns array of public URLs.
 */
export async function uploadImages(
  images: { dataUrl: string; path: string }[]
): Promise<string[]> {
  return Promise.all(images.map(({ dataUrl, path }) => uploadImage(dataUrl, path)))
}

/**
 * Generate a storage path for a user's project asset.
 */
export function assetPath(userId: string, projectId: string, filename: string): string {
  return `memories/${userId}/${projectId}/${filename}`
}
