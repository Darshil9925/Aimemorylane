"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    emoji: "📂",
    title: "Upload your photos",
    description:
      "Drop photos from your camera roll — JPG, PNG, HEIC, or WEBP. Up to 100 photos at once on premium.",
    color: "bg-amber-50 border-amber-200",
    numberColor: "text-amber-400",
  },
  {
    number: "02",
    emoji: "🎨",
    title: "Choose a vibe",
    description:
      "Pick a memory mode and a template. Vintage booth? Kodak disposable? Tokyo photobooth? We got you.",
    color: "bg-purple-50 border-purple-200",
    numberColor: "text-purple-400",
  },
  {
    number: "03",
    emoji: "✨",
    title: "Generate your memory",
    description:
      "AI analyzes your photos, detects the mood and event, and generates a beautiful, shareable memory.",
    color: "bg-rose-50 border-rose-200",
    numberColor: "text-rose-400",
  },
  {
    number: "04",
    emoji: "🚀",
    title: "Share everywhere",
    description:
      "Download in HD or share directly to Instagram Stories, TikTok, and Snapchat — dimensions auto-optimized.",
    color: "bg-emerald-50 border-emerald-200",
    numberColor: "text-emerald-400",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            From camera roll to core memory
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Four steps. Zero editing. Pure nostalgia.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className={`relative rounded-3xl border p-6 ${step.color}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <span className={`text-xs font-bold tracking-widest ${step.numberColor} mb-4 block`}>
                {step.number}
              </span>
              <span className="text-3xl mb-4 block">{step.emoji}</span>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>

              {/* Connector arrow — hidden on last */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-gray-300 text-lg z-10">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
