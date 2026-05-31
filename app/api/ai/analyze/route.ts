import { NextRequest, NextResponse } from "next/server"
import type { PhotoAnalysis, PhotoPayload } from "@/types/ai"

function mockAnalysis(index: number): PhotoAnalysis {
  const moods = ["joyful", "nostalgic", "celebratory", "adventurous", "candid"] as const
  const events = ["friends", "travel", "concert", "birthday", "beach"] as const
  return {
    mood: moods[index % moods.length],
    eventType: events[index % events.length],
    activities: ["laughing", "hanging out", "making memories"],
    dominantColors: ["warm tones", "golden", "blue"],
    faces: 2,
    setting: "outdoor",
    quality: "good",
    captions: {
      funny: "when the vibe is absolutely unmatched 😭",
      nostalgic: "some days you just want to live in forever",
      romantic: "stolen moments with my favourite people",
      genZ: "core memory unlocked 🔒",
    },
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { photos: PhotoPayload[] }
    const { photos } = body
    if (!photos?.length) {
      return NextResponse.json({ error: "No photos provided" }, { status: 400 })
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      const analyses = photos.map((_, i) => mockAnalysis(i))
      return NextResponse.json({ analyses, mock: true })
    }
    const { analyzePhotosWithClaude } = await import("@/lib/ai/providers/claude")
    const analyses = await analyzePhotosWithClaude(photos)
    return NextResponse.json({ analyses })
  } catch (err) {
    console.error("[AI analyze]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    )
  }
}
