"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const floatingCards = [
  {
    id: 1,
    label: "photobooth",
    bg: "bg-amber-50",
    border: "border-amber-200",
    rotate: "-6deg",
    delay: 0,
    top: "8%",
    left: "2%",
    photos: ["🌅", "🎉", "🥂", "✨"],
    strip: true,
  },
  {
    id: 2,
    label: "polaroid",
    bg: "bg-white",
    border: "border-gray-200",
    rotate: "5deg",
    delay: 0.4,
    top: "5%",
    right: "4%",
    emoji: "🌊",
    caption: "beach day ☀️",
  },
  {
    id: 3,
    label: "disposable",
    bg: "bg-rose-50",
    border: "border-rose-200",
    rotate: "-3deg",
    delay: 0.8,
    bottom: "12%",
    left: "3%",
    emoji: "🎸",
    grainy: true,
  },
  {
    id: 4,
    label: "memory pack",
    bg: "bg-purple-50",
    border: "border-purple-200",
    rotate: "4deg",
    delay: 1.2,
    bottom: "8%",
    right: "2%",
    emoji: "🗺️",
    caption: "trip of a lifetime",
  },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-20">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-rose-100/60 blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-100/60 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-indigo-100/50 blur-[120px]" />
      </div>

      {/* Floating memory cards — hidden on mobile, visible on lg */}
      <div className="hidden lg:block">
        {floatingCards.map((card) => (
          <motion.div
            key={card.id}
            className="absolute"
            style={{
              top: card.top,
              left: card.left,
              right: card.right,
              bottom: card.bottom,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay + 0.5, duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4 + card.delay,
                repeat: Infinity,
                ease: "easeInOut",
                delay: card.delay,
              }}
              style={{ rotate: card.rotate }}
            >
              {card.strip ? (
                <div
                  className={`w-20 rounded-xl border ${card.border} ${card.bg} p-1.5 shadow-lg space-y-1`}
                >
                  {card.photos!.map((emoji, i) => (
                    <div
                      key={i}
                      className="w-full aspect-square rounded-lg bg-white/70 flex items-center justify-center text-lg"
                    >
                      {emoji}
                    </div>
                  ))}
                  <p className="text-center text-[8px] text-gray-400 pt-0.5">photobooth</p>
                </div>
              ) : (
                <div
                  className={`w-28 rounded-2xl border ${card.border} ${card.bg} p-2 shadow-lg`}
                >
                  <div
                    className={`w-full aspect-square rounded-xl bg-white/60 flex items-center justify-center text-3xl mb-2 ${
                      card.grainy ? "opacity-80 saturate-150" : ""
                    }`}
                  >
                    {card.emoji}
                  </div>
                  {card.caption && (
                    <p className="text-center text-[9px] text-gray-500 font-medium px-1">
                      {card.caption}
                    </p>
                  )}
                  <p className="text-center text-[8px] text-gray-400 mt-0.5">{card.label}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Hero text */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium mb-4">
            ✦ AI-powered memory maker
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          Turn your camera roll{" "}
          <span className="gradient-text">into memories</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Create photobooth strips, polaroids, disposable camera photos, scrapbook pages, and memory
          packs in seconds. No editing skills needed.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Link href="/signup">
            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-gray-200">
              Upload photos — it&apos;s free
            </Button>
          </Link>
          <Link href="#showcase">
            <Button variant="ghost" size="lg" className="rounded-full text-gray-500">
              See examples ↓
            </Button>
          </Link>
        </motion.div>

        <motion.p
          className="text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Free to try · No credit card required · 3 memories/day on free plan
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-gray-300 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-gray-400" />
        </div>
      </motion.div>
    </section>
  )
}
