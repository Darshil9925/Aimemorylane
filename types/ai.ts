export type AIProvider = "openai" | "gemini" | "claude" | "replicate" | "stability"

export interface PhotoAnalysis {
  faces: number
  location?: string
  mood: string
  dominantColors: string[]
  activities: string[]
  eventType: EventType
}

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

export interface GeneratedCaption {
  funny: string
  nostalgic: string
  romantic: string
  genZ: string
}

export interface AIGenerationRequest {
  provider: AIProvider
  photos: string[]
  mode: string
  template?: string
  options?: Record<string, unknown>
}
