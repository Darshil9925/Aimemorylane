export type AIProvider = "openai" | "gemini" | "claude" | "replicate" | "stability"

export type EventType =
  | "beach"
  | "birthday"
  | "concert"
  | "road-trip"
  | "couple-date"
  | "graduation"
  | "travel"
  | "friends"
  | "festival"
  | "other"

export type PhotoMood =
  | "joyful"
  | "nostalgic"
  | "romantic"
  | "adventurous"
  | "peaceful"
  | "celebratory"
  | "candid"

export type PhotoQuality = "great" | "good" | "average" | "blurry"

export interface GeneratedCaption {
  funny: string
  nostalgic: string
  romantic: string
  genZ: string
}

export interface PhotoAnalysis {
  mood: PhotoMood
  eventType: EventType
  activities: string[]
  dominantColors: string[]
  faces: number
  setting: string
  quality: PhotoQuality
  captions: GeneratedCaption
}

export interface MemoryStory {
  title: string
  story: string
  suggestedCaption: string
}

export interface AIGenerationRequest {
  provider: AIProvider
  photos: string[]
  mode: string
  template?: string
  options?: Record<string, unknown>
}

// Shape sent to API routes
export interface PhotoPayload {
  data: string      // base64 encoded
  mediaType: "image/jpeg" | "image/png" | "image/webp"
}
