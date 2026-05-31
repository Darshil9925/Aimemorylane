"use client"

import { motion } from "framer-motion"
import type { PhotoAnalysis, MemoryStory } from "@/types/ai"

const EVENT_EMOJI: Record<string, string> = {
  beach: "🏖️", birthday: "🎂", concert: "🎸", "road-trip": "🚗",
  "couple-date": "💑", graduation: "🎓", travel: "✈️",
  friends: "🫂", festival: "🎪", other: "✨",
}

const MOOD_EMOJI: Record<string, string> = {
  joyful: "😄", nostalgic: "🥹", romantic: "💕", adventurous: "🌄",
  peaceful: "🌿", celebratory: "🎉", candid: "📸",
}

interface AnalysisResultProps {
  analyses: PhotoAnalysis[]
  story: MemoryStory | null
  isMock?: boolean
}

export function AnalysisResult({ analyses, story, isMock }: AnalysisResultProps) {
  if (!analyses.length) return null

  // Aggregate across all analyses
  const eventCounts = analyses.reduce<Record<string, number>>((acc, a) => {
    acc[a.eventType] = (acc[a.eventType] ?? 0) + 1
    return acc
  }, {})
  const topEvent = Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0][0]
  const avgMood = analyses[Math.floor(analyses.length / 2)].mood
  const totalFaces = analyses.reduce((s, a) => s + a.faces, 0)
  const greatShots = analyses.filter((a) => a.quality === "great" || a.quality === "good").length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {isMock && (
        <p className="text-center text-xs text-amber-500 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
          ⚠️ Demo mode — add <code className="font-mono">ANTHROPIC_API_KEY</code> to .env.local for real AI
        </p>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Event", value: topEvent.replace("-", " "), emoji: EVENT_EMOJI[topEvent] ?? "✨" },
          { label: "Mood", value: avgMood, emoji: MOOD_EMOJI[avgMood] ?? "😊" },
          { label: "Best shots", value: `${greatShots}/${analyses.length}`, emoji: "⭐" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-gray-50 border border-gray-100 p-3 text-center">
            <p className="text-xl mb-1">{stat.emoji}</p>
            <p className="text-xs font-semibold text-gray-700 capitalize">{stat.value}</p>
            <p className="text-[10px] text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Story card */}
      {story && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 p-5 space-y-3"
        >
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Your memory story</p>
          <h3 className="font-bold text-gray-800">{story.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{story.story}</p>
          <div className="pt-1 border-t border-violet-100">
            <p className="text-xs text-gray-400 mb-1">Suggested caption</p>
            <p className="text-sm font-medium text-violet-700 italic">&ldquo;{story.suggestedCaption}&rdquo;</p>
          </div>
        </motion.div>
      )}

      {/* Per-photo captions sample */}
      {analyses[0]?.captions?.genZ && (
        <div className="rounded-2xl border border-gray-100 p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Caption suggestions</p>
          <div className="grid grid-cols-2 gap-2">
            {(["genZ", "funny", "nostalgic", "romantic"] as const).map((style) => (
              <div key={style} className="rounded-xl bg-gray-50 px-3 py-2">
                <p className="text-[10px] text-gray-400 capitalize mb-0.5">{style === "genZ" ? "Gen Z" : style}</p>
                <p className="text-xs text-gray-700 leading-snug">{analyses[0].captions[style]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
