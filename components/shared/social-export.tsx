"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SOCIAL_FORMATS, drawSocialCard, type SocialFormat } from "@/lib/canvas/social"
import { cn } from "@/lib/utils"

interface SocialExportProps {
  assetDataUrl: string
  title?: string
}

export function SocialExport({ assetDataUrl, title }: SocialExportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(SOCIAL_FORMATS[0])
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async (format: SocialFormat) => {
    setSelectedFormat(format)
    setIsGenerating(true)
    setGeneratedUrl(null)
    try {
      const canvas = document.createElement("canvas")
      await drawSocialCard(canvas, assetDataUrl, format, title)
      setGeneratedUrl(canvas.toDataURL("image/png"))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedUrl) return
    const { saveSinglePhoto } = await import("@/lib/utils/download")
    await saveSinglePhoto(generatedUrl, `${selectedFormat.id}-${Date.now()}.png`)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
      >
        📱 Share as social card
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="rounded-2xl border border-gray-200 p-4 space-y-4 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Social card</p>
        <button onClick={() => setIsOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
      </div>

      {/* Format selector */}
      <div className="flex gap-2 flex-wrap">
        {SOCIAL_FORMATS.map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => handleGenerate(fmt)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              selectedFormat.id === fmt.id && generatedUrl
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 text-gray-500 hover:border-gray-400"
            )}
          >
            <span>{fmt.emoji}</span>
            {fmt.name}
          </button>
        ))}
      </div>

      {/* Preview */}
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 text-gray-400 text-sm"
          >
            <span className="animate-spin inline-block mr-2">⏳</span> Rendering {selectedFormat.name}…
          </motion.div>
        )}

        {generatedUrl && !isGenerating && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedUrl}
                alt={`${selectedFormat.name} card`}
                className="rounded-xl shadow-lg"
                style={{ maxHeight: 300, width: "auto" }}
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
              >
                ↓ Save {selectedFormat.name} card ({selectedFormat.width}×{selectedFormat.height})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
