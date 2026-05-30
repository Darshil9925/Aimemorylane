"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const modes = [
  {
    id: "photobooth",
    label: "Photobooth",
    emoji: "🎞️",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-200",
    activeBg: "bg-amber-500",
    description: "Iconic 4-panel strips with vintage, Korean, Y2K, and Tokyo styles.",
    tags: ["Vintage Booth", "Korean Booth", "Y2K", "Tokyo Booth"],
    preview: [
      { emoji: "🌅", label: "" },
      { emoji: "🎉", label: "" },
      { emoji: "🥂", label: "" },
      { emoji: "✨", label: "" },
    ],
    layout: "strip",
  },
  {
    id: "polaroid",
    label: "Polaroid",
    emoji: "📷",
    color: "from-sky-400 to-blue-500",
    bg: "bg-sky-50",
    border: "border-sky-200",
    activeBg: "bg-sky-500",
    description: "Dreamy polaroids with film grain, light leaks, and handwritten captions.",
    tags: ["Film Grain", "Light Leak", "Vintage Fade", "Dust & Scratches"],
    preview: [
      { emoji: "🌊", label: "beach day ☀️" },
      { emoji: "🌸", label: "in bloom 🌷" },
      { emoji: "🌙", label: "golden hour" },
    ],
    layout: "polaroids",
  },
  {
    id: "disposable",
    label: "Disposable",
    emoji: "📸",
    color: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
    activeBg: "bg-rose-500",
    description: "That authentic grainy, flash-lit look from a Kodak or Fujifilm disposable.",
    tags: ["Kodak", "Fujifilm", "Party Flash", "Digicam"],
    preview: [
      { emoji: "🎸", label: "" },
      { emoji: "🎤", label: "" },
      { emoji: "🔥", label: "" },
      { emoji: "🎊", label: "" },
    ],
    layout: "grid",
  },
  {
    id: "scrapbook",
    label: "Scrapbook",
    emoji: "📒",
    color: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    activeBg: "bg-emerald-500",
    description: "Handcrafted scrapbook pages with tape, stickers, doodles, and maps.",
    tags: ["Travel Journal", "Friend Book", "Love Journal", "Memory Collage"],
    preview: [
      { emoji: "🗺️", label: "day 1" },
      { emoji: "🏖️", label: "day 2" },
      { emoji: "🌄", label: "day 3" },
    ],
    layout: "scrapbook",
  },
  {
    id: "memory-pack",
    label: "Memory Pack",
    emoji: "✨",
    color: "from-purple-400 to-violet-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    activeBg: "bg-purple-500",
    description: "Upload a whole event — AI bundles polaroids, strips, stories, and wallpapers.",
    tags: ["Trips", "Birthdays", "Concerts", "Relationships"],
    preview: [
      { emoji: "🎞️", label: "strip" },
      { emoji: "📷", label: "polaroid" },
      { emoji: "📒", label: "scrapbook" },
      { emoji: "🖼️", label: "wallpaper" },
    ],
    layout: "pack",
  },
]

function ModePreview({ mode }: { mode: (typeof modes)[0] }) {
  if (mode.layout === "strip") {
    return (
      <div className="flex justify-center">
        <div className="w-28 bg-white rounded-2xl border border-gray-200 p-2 shadow-xl space-y-1.5">
          {mode.preview.map((p, i) => (
            <div
              key={i}
              className="w-full aspect-square rounded-lg bg-amber-50 flex items-center justify-center text-2xl"
            >
              {p.emoji}
            </div>
          ))}
          <p className="text-center text-[9px] text-gray-400 pt-0.5 font-medium">
            2025 · core memory
          </p>
        </div>
      </div>
    )
  }

  if (mode.layout === "polaroids") {
    return (
      <div className="flex justify-center gap-3 flex-wrap">
        {mode.preview.map((p, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl border border-gray-100 p-2 shadow-lg w-28"
            style={{ rotate: `${(i - 1) * 4}deg` }}
            whileHover={{ rotate: 0, scale: 1.05 }}
          >
            <div className="w-full aspect-square rounded-lg bg-sky-50 flex items-center justify-center text-2xl mb-2">
              {p.emoji}
            </div>
            <p className="text-center text-[9px] text-gray-400">{p.label}</p>
          </motion.div>
        ))}
      </div>
    )
  }

  if (mode.layout === "grid") {
    return (
      <div className="grid grid-cols-2 gap-2 max-w-[200px] mx-auto">
        {mode.preview.map((p, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl shadow"
            style={{ filter: "contrast(1.1) saturate(0.8)" }}
          >
            {p.emoji}
          </div>
        ))}
      </div>
    )
  }

  if (mode.layout === "scrapbook") {
    return (
      <div className="relative max-w-[220px] mx-auto h-48">
        {mode.preview.map((p, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-lg border border-gray-200 p-2 shadow-md w-24"
            style={{
              top: `${i * 28}px`,
              left: `${i * 30}px`,
              rotate: `${(i - 1) * 3}deg`,
              zIndex: i,
            }}
          >
            <div className="w-full aspect-square rounded bg-emerald-50 flex items-center justify-center text-2xl mb-1">
              {p.emoji}
            </div>
            <p className="text-center text-[8px] text-gray-400">{p.label}</p>
          </div>
        ))}
      </div>
    )
  }

  // pack
  return (
    <div className="grid grid-cols-2 gap-2 max-w-[200px] mx-auto">
      {mode.preview.map((p, i) => (
        <div
          key={i}
          className="aspect-square rounded-xl bg-purple-50 border border-purple-100 flex flex-col items-center justify-center gap-1 shadow"
        >
          <span className="text-2xl">{p.emoji}</span>
          <span className="text-[9px] text-gray-400">{p.label}</span>
        </div>
      ))}
    </div>
  )
}

export function ModeShowcase() {
  const [active, setActive] = useState(0)
  const mode = modes[active]

  return (
    <section id="showcase" className="py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Five ways to make a memory
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Pick a vibe and let the AI do the rest. No editing, no tools, just memories.
          </p>
        </motion.div>

        {/* Mode tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {modes.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === i
                  ? `${m.activeBg} text-white shadow-md`
                  : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <span>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* Mode panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="grid md:grid-cols-2">
              {/* Preview */}
              <div
                className={`${mode.bg} p-12 flex items-center justify-center min-h-64`}
              >
                <ModePreview mode={mode} />
              </div>

              {/* Info */}
              <div className="p-10 flex flex-col justify-center gap-6">
                <div>
                  <span className="text-3xl mb-3 block">{mode.emoji}</span>
                  <h3 className="text-2xl font-bold mb-2">{mode.label}</h3>
                  <p className="text-gray-500 leading-relaxed">{mode.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mode.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${mode.border} ${mode.bg} text-gray-600`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className={`self-start px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${mode.color} shadow-md hover:opacity-90 transition-opacity`}
                >
                  Try {mode.label} →
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
