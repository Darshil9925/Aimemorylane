import { NextRequest, NextResponse } from "next/server"
import type { PhotoAnalysis, MemoryStory } from "@/types/ai"

const MOCK_STORY: MemoryStory = {
  title: "a day worth remembering",
  story:
    "You captured moments that will live forever in your camera roll. The kind of day that feels like a movie — effortless, golden, and completely yours.",
  suggestedCaption: "core memory unlocked 🔒",
}

export async function POST(req: NextRequest) {
  try {
    const { analyses } = await req.json() as { analyses: PhotoAnalysis[] }
    if (!analyses?.length) {
      return NextResponse.json({ error: "No analyses provided" }, { status: 400 })
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ ...MOCK_STORY, mock: true })
    }
    const { generateStoryWithClaude } = await import("@/lib/ai/providers/claude")
    const story = await generateStoryWithClaude(analyses)
    return NextResponse.json(story)
  } catch (err) {
    console.error("[AI story]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Story generation failed" },
      { status: 500 }
    )
  }
}
