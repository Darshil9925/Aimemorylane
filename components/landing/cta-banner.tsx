"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaBanner() {
  return (
    <section className="py-24 px-4">
      <motion.div
        className="max-w-4xl mx-auto rounded-3xl bg-gray-900 text-white text-center p-14 relative overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Background blobs */}
        <div className="absolute top-[-40%] left-[-10%] w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-40%] right-[-10%] w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-6">
          <p className="text-4xl">📸</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Your memories deserve better<br />than a camera roll
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Turn the photos you never look at into keepsakes you&apos;ll treasure. Start free today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/signup">
              <Button
                size="lg"
                className="rounded-full px-8 bg-white text-gray-900 hover:bg-gray-100 shadow-xl"
              >
                Create your first memory — free
              </Button>
            </Link>
          </div>
          <p className="text-white/30 text-sm">No credit card · 3 free memories per day forever</p>
        </div>
      </motion.div>
    </section>
  )
}
