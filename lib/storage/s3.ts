import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner"

function getClient() {
  const region = process.env.AWS_REGION ?? "us-east-1"
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS credentials not set (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)")
  }

  return new S3Client({ region, credentials: { accessKeyId, secretAccessKey } })
}

function getBucket() {
  const bucket = process.env.S3_BUCKET
  if (!bucket) throw new Error("S3_BUCKET env var not set")
  return bucket
}

/**
 * Upload a buffer to S3 and return the public URL.
 * Assumes the bucket has public read access or CloudFront in front of it.
 */
export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const client = getClient()
  const bucket = getBucket()

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  )

  // Return the public URL
  const region = process.env.AWS_REGION ?? "us-east-1"
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}

/**
 * Generate a pre-signed URL for private objects (not currently used but available).
 */
export async function getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const client = getClient()
  const bucket = getBucket()

  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  return awsGetSignedUrl(client, command, { expiresIn })
}
