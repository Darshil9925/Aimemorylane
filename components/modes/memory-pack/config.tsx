"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useUploadStore } from "@/store/upload-store"
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

interface MemoryPackConfigProps {
  onBack: () => void
}

export function MemoryPackConfig({ onBack }: MemoryPackConfigProps) {
  const { photos } = useUploadStore()
  const [eventId, setEventId] = useState("trip")
  const [title, setTitle] = useState("")

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
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest">What you'll get</p>
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
      <section className="space-y-3">
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
          <p className="text-xs text-gray-400">AI will pick the best ones for each format</p>
        </div>
      </div>

      {/* AI generation placeholder */}
      <motion.div
        className="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 p-6 text-center space-y-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-2xl">✨</p>
        <p className="font-semibold text-gray-700 text-sm">Full AI Memory Pack generation</p>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          AI will analyze every photo, detect faces and mood, classify the event, generate captions, and bundle everything into a downloadable memory pack.
        </p>
        <button
          disabled
          className="w-full py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold opacity-60 cursor-not-allowed"
        >
          ✨ Generate Memory Pack · Coming in Phase 4
        </button>
      </motion.div>
    </div>
  )
}
