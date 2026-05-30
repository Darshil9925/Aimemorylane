export const APP_NAME = "AI Memory Booth"
export const APP_TAGLINE = "Turn Your Camera Roll Into Memories"

export const FREE_TIER = {
  dailyProjects: 3,
  maxPhotosPerUpload: 10,
  watermark: true,
} as const

export const PREMIUM_TIER = {
  dailyProjects: Infinity,
  maxPhotosPerUpload: 100,
  watermark: false,
} as const

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/heic", "image/webp"]
export const MAX_FILE_SIZE_MB = 20

export const PRICING = {
  monthly: { amount: 299, currency: "INR", label: "₹299/month" },
  yearly: { amount: 1999, currency: "INR", label: "₹1,999/year" },
} as const
