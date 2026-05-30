"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useUploadStore } from "@/store/upload-store"
import { cn } from "@/lib/utils"

const SCRAPBOOK_STYLES = [
  { id: "travel", name: "Travel Journal", emoji: "🗺️", description: "Maps, tickets, adventure logs" },
  { id: "friends", name: "Friend Book", emoji: "👯", description: "Group photos, inside jokes, memories" },
  { id: "love", name: "Love Journal", emoji: "💌", description: "Couple moments, romantic layouts" },
  { id: "collage", name: "Memory Collage", emoji: "🎨", description: "Mixed layouts, stickers, doodles" },
]

interface ScrapbookConfigProps {
  onBack: () => void
}

export function ScrapbookConfig({ onBack }: ScrapbookConfigProps) {
  const { photos } = useUploadStore()
  const [styleId, setStyleId] = useState("travel")
  const [title, setTitle] = useState("")

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← photos
        </button>
        <h1 className="text-xl font-bold text-gray-900">Scrapbook</h1>
      </div>

      {/* Style selector */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Style</p>
        <div className="grid grid-cols-2 gap-3">
          {SCRAPBOOK_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyleId(s.id)}
              className={cn(
                "p-4 rounded-2xl border text-left transition-all",
                styleId === s.id
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <span className="text-2xl block mb-2">{s.emoji}</span>
              <p className={cn("text-sm font-semibold", styleId === s.id ? "text-emerald-700" : "text-gray-700")}>
                {s.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Customization */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Details</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Bali 2026 · the crew"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
        />
      </section>

      {/* Photo thumbnails */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {photos.length} photo{photos.length !== 1 ? "s" : ""} ready
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {photos.slice(0, 15).map((photo) => (
            <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.previewUrl} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          {photos.length > 15 && (
            <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
              +{photos.length - 15}
            </div>
          )}
        </div>
      </section>

      {/* AI generation placeholder */}
      <motion.div
        className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-6 text-center space-y-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-2xl">🤖</p>
        <p className="font-semibold text-gray-700 text-sm">AI scrapbook generation</p>
        <p className="text-xs text-gray-400 max-w-xs mx-auto">
          AI will analyze your photos, detect the event type, and arrange them into handcrafted scrapbook pages with tape, stickers, and doodles.
        </p>
        <button
          disabled
          className="w-full py-3 rounded-xl bg-emerald-500 text-white text-sm font-semibold opacity-60 cursor-not-allowed"
        >
          📒 Generate Scrapbook · Coming in Phase 4
        </button>
      </motion.div>
    </div>
  )
}
