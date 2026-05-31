"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUploadStore } from "@/store/upload-store"
import { DISPOSABLE_PRESETS } from "@/lib/canvas/filters"
import { drawDisposablePhoto } from "@/lib/canvas/draw"
import { cn } from "@/lib/utils"

interface DisposableConfigProps {
  onBack: () => void
}

export function DisposableConfig({ onBack }: DisposableConfigProps) {
  const { photos } = useUploadStore()
  const [presetId, setPresetId] = useState("kodak")
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const preset = DISPOSABLE_PRESETS.find((p) => p.id === presetId)!

  const handleGenerate = async () => {
    setIsGenerating(true)
    const urls: string[] = []
    for (const photo of photos) {
      const canvas = document.createElement("canvas")
      await drawDisposablePhoto(canvas, photo, preset.filter)
      urls.push(canvas.toDataURL("image/png"))
    }
    setGeneratedUrls(urls)
    setIsGenerating(false)
  }

  const handleDownloadAll = async () => {
    for (let i = 0; i < generatedUrls.length; i++) {
      const a = document.createElement("a")
      a.href = generatedUrls[i]
      a.download = `disposable-${presetId}-${i + 1}.png`
      a.style.display = "none"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      // Browsers block simultaneous programmatic downloads — stagger by 300ms
      if (i < generatedUrls.length - 1) {
        await new Promise<void>((resolve) => setTimeout(resolve, 300))
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← photos
        </button>
        <h1 className="text-xl font-bold text-gray-900">Disposable Camera</h1>
      </div>

      {/* Preset selector */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Camera preset</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DISPOSABLE_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setPresetId(p.id); setGeneratedUrls([]) }}
              className={cn(
                "p-3 rounded-2xl border text-left transition-all",
                presetId === p.id
                  ? "border-rose-400 bg-rose-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <p className={cn("text-sm font-medium", presetId === p.id ? "text-rose-700" : "text-gray-700")}>
                {p.name}
              </p>
              <p className="text-xs mt-0.5 text-gray-400">{p.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Live preview grid */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Preview</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={presetId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          >
            {photos.slice(0, 6).map((photo) => (
              <div key={photo.id} className="aspect-square rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.previewUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: preset.filter }}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        {photos.length > 6 && (
          <p className="text-xs text-center text-gray-400">
            + {photos.length - 6} more will be processed
          </p>
        )}
      </section>

      {/* Generated or generate */}
      {generatedUrls.length > 0 ? (
        <section className="space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Your photos ({generatedUrls.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {generatedUrls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={url} alt="" className="rounded-xl aspect-square object-cover w-full" />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadAll}
              className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              ↓ Download All ({generatedUrls.length})
            </button>
            <button
              onClick={() => setGeneratedUrls([])}
              className="px-5 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Re-generate
            </button>
          </div>
        </section>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={isGenerating || photos.length === 0}
          className="w-full py-3.5 rounded-2xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <><span className="animate-spin">⏳</span> Processing…</>
          ) : (
            `📸 Apply ${preset.name} to ${photos.length} photo${photos.length !== 1 ? "s" : ""}`
          )}
        </button>
      )}
    </div>
  )
}
