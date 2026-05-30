// AWS S3 upload/download helpers
export async function uploadToS3(file: Buffer, key: string, contentType: string): Promise<string> {
  throw new Error("S3 not yet configured — set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET")
}

export async function getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
  throw new Error("S3 not yet configured")
}

export function getS3Key(userId: string, projectId: string, filename: string) {
  return `users/${userId}/projects/${projectId}/${filename}`
}
