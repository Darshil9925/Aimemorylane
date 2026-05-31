import { NextRequest, NextResponse } from "next/server"
import type { GeneratedCaption } from "@/types/ai"

const MOCK_CAPTIONS: GeneratedCaption = {
  funny: "when the vibe is absolutely unmatched 😭",
  nostalgic: "some days you just want to live in forever",
  romantic: "stolen moments with my favourite people",
  genZ: "core memory unlocked 🔒",
}

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json() as { description: string }
    if (!description) {
      return NextResponse.json({ error: "No description provided" }, { status: 400 })
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ captions: MOCK_CAPTIONS, mock: true })
    }
    const { generateCaptionsWithClaude } = await import("@/lib/ai/providers/claude")
    const captions = await generateCaptionsWithClaude(description)
    return NextResponse.json({ captions })
  } catch (err) {
    console.error("[AI caption]", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Caption generation failed" },
      { status: 500 }
    )
  }
}
