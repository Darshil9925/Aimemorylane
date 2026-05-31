"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  resetAt?: string
}

export function UpgradeModal({ open, onClose, resetAt }: UpgradeModalProps) {
  const resetTime = resetAt
    ? new Date(resetAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "midnight UTC"

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className="fixed inset-x-4 bottom-8 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-50 max-w-sm w-full mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-7 space-y-5">
              {/* Icon */}
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl mx-auto mb-4">
                  ✨
                </div>
                <h2 className="text-xl font-bold text-gray-900">You&apos;re out of free generations</h2>
                <p className="text-sm text-gray-400 mt-2">
                  You&apos;ve used all 3 free memories for today.
                  {resetAt && ` Resets at ${resetTime}.`}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <Link href="/pricing" onClick={onClose}>
                  <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    Upgrade to Premium — ₹167/month
                  </button>
                </Link>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Come back tomorrow (free resets daily)
                </button>
              </div>

              {/* Features reminder */}
              <div className="pt-1 border-t border-gray-100 space-y-1.5">
                {[
                  "Unlimited generations every day",
                  "No watermarks on exports",
                  "HD quality + all premium templates",
                  "Memory Pack full generation",
                ].map((f) => (
                  <p key={f} className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="text-violet-400">✓</span> {f}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
