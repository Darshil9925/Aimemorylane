import Anthropic from "@anthropic-ai/sdk"
import type { PhotoAnalysis, MemoryStory, GeneratedCaption, PhotoPayload } from "@/types/ai"

const MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-4-5"
const FAST_MODEL = process.env.CLAUDE_FAST_MODEL ?? "claude-haiku-4-5"

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set")
  return new Anthropic({ apiKey })
}

function parseJSON<T>(text: string, fallback: T): T {
  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()
    return JSON.parse(cleaned) as T
  } catch {
    return fallback
  }
}

// ── Photo Analysis (vision) ──────────────────────────────────────────────────

export async function analyzePhotoWithClaude(photo: PhotoPayload): Promise<PhotoAnalysis> {
  const client = getClient()

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: photo.mediaType, data: photo.data },
          },
          {
            type: "text",
            text: `Analyze this photo and return ONLY a JSON object with these exact fields — no explanation, no markdown, just raw JSON:
{
  "mood": "joyful" | "nostalgic" | "romantic" | "adventurous" | "peaceful" | "celebratory" | "candid",
  "eventType": "beach" | "birthday" | "concert" | "road-trip" | "couple-date" | "graduation" | "travel" | "friends" | "festival" | "other",
  "activities": ["up to 3 short activity descriptions"],
  "dominantColors": ["up to 3 color names"],
  "faces": <number of visible faces, 0 if none>,
  "setting": "<brief setting like 'outdoor beach' or 'indoor party'>",
  "quality": "great" | "good" | "average" | "blurry",
  "captions": {
    "funny": "<witty, max 60 chars>",
    "nostalgic": "<emotional, max 60 chars>",
    "romantic": "<romantic, max 60 chars>",
    "genZ": "<Gen Z slang, e.g. 'core memory unlocked' or 'no cap this hit different', max 60 chars>"
  }
}`,
          },
        ],
      },
    ],
  })

  const text = response.content[0].type === "text" ? response.content[0].text : "{}"
  return parseJSON<PhotoAnalysis>(text, {
    mood: "joyful",
    eventType: "other",
    activities: [],
    dominantColors: [],
    faces: 0,
    setting: "unknown",
    quality: "good",
    captions: { funny: "", nostalgic: "", romantic: "", genZ: "" },
  })
}

// ── Batch Analysis ───────────────────────────────────────────────────────────

export async function analyzePhotosWithClaude(
  photos: PhotoPayload[]
): Promise<PhotoAnalysis[]> {
  return Promise.all(photos.map((p) => analyzePhotoWithClaude(p)))
}

// ── Caption Generator ────────────────────────────────────────────────────────

export async function generateCaptionsWithClaude(
  sceneDescription: string
): Promise<GeneratedCaption> {
  const client = getClient()

  const response = await client.messages.create({
    model: FAST_MODEL,
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `Generate 4 short photo captions for this scene: "${sceneDescription}"

Return ONLY raw JSON, no markdown:
{
  "funny": "<witty caption, max 60 chars>",
  "nostalgic": "<emotional nostalgic, max 60 chars>",
  "romantic": "<romantic, max 60 chars>",
  "genZ": "<Gen Z slang like 'core memory unlocked' or 'still not over this day', max 60 chars>"
}`,
      },
    ],
  })

  const text = response.content[0].type === "text" ? response.content[0].text : "{}"
  return parseJSON<GeneratedCaption>(text, {
    funny: "when the vibe is just right 😭",
    nostalgic: "some days you want to live in forever",
    romantic: "stolen moments with my favorite people",
    genZ: "core memory unlocked 🔒",
  })
}

// ── Memory Story Generator ───────────────────────────────────────────────────

export async function generateStoryWithClaude(
  analyses: PhotoAnalysis[]
): Promise<MemoryStory> {
  const client = getClient()

  const photoSummaries = analyses
    .slice(0, 10)
    .map(
      (a, i) =>
        `Photo ${i + 1}: ${a.eventType} vibe, ${a.mood} mood, ${a.activities.join(" + ")}, ${a.setting}`
    )
    .join("\n")

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Based on these ${analyses.length} photos from what looks like one event or outing, write a short memory story.

${photoSummaries}

Return ONLY raw JSON, no markdown:
{
  "title": "<short evocative title, max 40 chars>",
  "story": "<2-3 sentence narrative in second person starting with 'You'. Emotional, nostalgic, specific to the event type. Example: 'You started the day at the beach, felt the sun on your skin, and ended the night laughing with the people who matter most.'>",
  "suggestedCaption": "<one perfect Gen Z caption for the whole event, max 80 chars>"
}`,
      },
    ],
  })

  const text = response.content[0].type === "text" ? response.content[0].text : "{}"
  return parseJSON<MemoryStory>(text, {
    title: "a day worth remembering",
    story: "You captured moments that'll live forever in your camera roll. The kind of day that feels like a movie.",
    suggestedCaption: "core memory unlocked 🔒",
  })
}
