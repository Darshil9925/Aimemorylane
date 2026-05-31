"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUploadStore } from "@/store/upload-store"
import { useAIMemoryPack } from "@/hooks/use-ai"
import { AnalysisResult } from "@/components/ai/analysis-result"
import { cn } from "@/lib/utils"

const EVENT_TYPES = [
  { id: "trip", label: "Trip / Travel", emoji: "✈️" },
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "concert", label: "Concert / Festival", emoji: "🎸" },
  { id: "graduation", label: "Graduation", emoji: "🎓" },
  { id: "relationship", label: "Couple / Relationship", emoji: "💑" },
  { id: "friends", label: "Friends Hangout", emoji: "🫂" },
]

const PACK_INCLUDES = [
  { emoji: "📷", label: "Polaroids" },
  { emoji: "🎞️", label: "Photobooth strip" },
  { emoji: "📒", label: "Scrapbook pages" },
  { emoji: "💌", label: "Postcards" },
  { emoji: "📱", label: "Story slides" },
  { emoji: "🖼️", label: "Wallpapers" },
]

const STAGE_LABELS: Record<string, string> = {
  analyzing: "Analysing your photos…",
  story: "Writing your memory story…",
  done: "Your memory pack is ready",
}

interface MemoryPackConfigProps {
  onBack: () => void
}

export function MemoryPackConfig({ onBack }: MemoryPackConfigProps) {
  const { photos } = useUploadStore()
  const [eventId, setEventId] = useState("trip")
  const [title, setTitle] = useState("")
  const { analyze, reset, isLoading, stage, analyses, story, error } = useAIMemoryPack()

  const handleAnalyze = () => analyze(photos, Math.min(photos.length, 8))

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← photos
        </button>
        <h1 className="text-xl font-bold text-gray-900">Memory Pack</h1>
      </div>

      {/* What's inside */}
      <section className="rounded-2xl bg-violet-50 border border-violet-100 p-5 space-y-3">
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest">What you&apos;ll get</p>
        <div className="grid grid-cols-3 gap-2">
          {PACK_INCLUDES.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 py-3 rounded-xl bg-white border border-violet-100">
              <span className="text-xl">{item.emoji}</span>
              <span className="text-[10px] text-gray-500 font-medium text-center leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Event type */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">What was this?</p>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((e) => (
            <button
              key={e.id}
              onClick={() => setEventId(e.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all",
                eventId === e.id
                  ? "bg-violet-600 text-white border-violet-600"
                  : "border-gray-200 text-gray-500 hover:border-gray-400"
              )}
            >
              <span>{e.emoji}</span>
              {e.label}
            </button>
          ))}
        </div>
      </section>

      {/* Title */}
      <section className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Memory title</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="NYC with the gang · Summer 2026"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
        />
      </section>

      {/* Photo count */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100">
        <span className="text-2xl">📂</span>
        <div>
          <p className="text-sm font-semibold text-gray-800">{photos.length} photos ready</p>
          <p className="text-xs text-gray-400">AI will analyse up to 8 to understand the event</p>
        </div>
      </div>

      {/* AI Analysis section */}
      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.button
            key="analyze-btn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={handleAnalyze}
            disabled={photos.length === 0}
            className="w-full py-3.5 rounded-2xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            ✨ Analyse photos &amp; generate memory story
          </motion.button>
        )}

        {(stage === "analyzing" || stage === "story") && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-violet-50 border border-violet-100 p-6 text-center space-y-4"
          >
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl animate-pulse">
                {stage === "analyzing" ? "🔍" : "✍️"}
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-700">{STAGE_LABELS[stage]}</p>
              <p className="text-xs text-gray-400 mt-1">
                {stage === "analyzing"
                  ? `Sending ${Math.min(photos.length, 8)} photos to Claude…`
                  : "Crafting your memory narrative…"}
              </p>
            </div>
            {/* Progress dots */}
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-violet-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">AI Analysis</p>
              <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Re-analyse
              </button>
            </div>

            <AnalysisResult analyses={analyses} story={story} />

            {/* Generate pack CTA */}
            <div className="pt-2 space-y-2">
              <button
                disabled
                className="w-full py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold opacity-60 cursor-not-allowed"
              >
                📦 Generate &amp; Download Memory Pack · Coming in Phase 5
              </button>
              <p className="text-center text-xs text-gray-400">
                Full bundled export (zip with all formats) ships with the backend in Phase 5
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-500"
        >
          ✕ {error}
        </motion.div>
      )}
    </div>
  )
}
