import { put } from "@vercel/blob"

/**
 * Upload a buffer to Vercel Blob storage.
 * Returns the public URL.
 *
 * Requires BLOB_READ_WRITE_TOKEN env var (auto-set on Vercel when you
 * add a Blob store via the dashboard, or set manually for local dev).
 */
export async function uploadToVercelBlob(
  buffer: Buffer,
  pathname: string,
  contentType: string
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    // No blob token — return a placeholder so the app doesn't crash
    console.warn("[storage] BLOB_READ_WRITE_TOKEN not set — skipping upload")
    return ""
  }

  const blob = await put(pathname, buffer, {
    access: "public",
    contentType,
    token,
  })

  return blob.url
}
