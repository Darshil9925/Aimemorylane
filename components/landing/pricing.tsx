"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const freeFeatures = [
  "3 memories per day",
  "5 photobooth templates",
  "Basic polaroid effects",
  "Standard export (JPG/PNG)",
  "Watermarked exports",
]

const premiumFeatures = [
  "Unlimited memories",
  "All 30+ templates",
  "All AI effects & filters",
  "HD exports — no watermark",
  "Memory Pack Generator",
  "AI captions & story generator",
  "Social share formats",
  "Priority generation",
]

export function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly")

  return (
    <section className="py-24 px-4" id="pricing">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Simple pricing
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Start free. Upgrade when you&apos;re obsessed.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-gray-100 border border-gray-200">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                billing === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Yearly
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">
                SAVE 44%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Free */}
          <motion.div
            className="rounded-3xl border border-gray-200 p-8 bg-white"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">₹0</span>
                <span className="text-gray-400">/forever</span>
              </div>
            </div>

            <Link href="/signup">
              <Button variant="outline" size="lg" className="w-full rounded-2xl mb-8">
                Get started free
              </Button>
            </Link>

            <ul className="space-y-3">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Premium */}
          <motion.div
            className="rounded-3xl border border-transparent p-8 bg-gray-900 text-white relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative mb-6">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">Premium</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold tracking-wide">
                  POPULAR
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">
                  {billing === "yearly" ? "₹167" : "₹299"}
                </span>
                <span className="text-white/50">/month</span>
              </div>
              {billing === "yearly" && (
                <p className="text-white/40 text-xs mt-1">Billed as ₹1,999/year</p>
              )}
            </div>

            <Link href="/signup">
              <Button
                size="lg"
                className="w-full rounded-2xl mb-8 bg-white text-gray-900 hover:bg-gray-100"
              >
                Start free trial
              </Button>
            </Link>

            <ul className="space-y-3 relative">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.p
          className="text-center text-sm text-gray-400 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          No credit card required to start · Cancel anytime · Physical prints coming soon
        </motion.p>
      </div>
    </section>
  )
}
