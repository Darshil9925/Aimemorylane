"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUploadStore } from "@/store/upload-store"
import { POLAROID_PRESETS } from "@/lib/canvas/filters"
import { drawPolaroid } from "@/lib/canvas/draw"
import { cn } from "@/lib/utils"

interface PolaroidConfigProps {
  onBack: () => void
}

export function PolaroidConfig({ onBack }: PolaroidConfigProps) {
  const { photos } = useUploadStore()
  const [effectId, setEffectId] = useState("film-grain")
  const [captions, setCaptions] = useState<Record<string, string>>({})
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)

  const effect = POLAROID_PRESETS.find((e) => e.id === effectId)!

  const handleGenerate = async () => {
    setIsGenerating(true)
    const urls: string[] = []
    for (const photo of photos) {
      const canvas = document.createElement("canvas")
      await drawPolaroid(canvas, photo, effect.filter, captions[photo.id] ?? "")
      urls.push(canvas.toDataURL("image/png"))
    }
    setGeneratedUrls(urls)
    setIsGenerating(false)
  }

  const handleDownloadAll = () => {
    generatedUrls.forEach((url, i) => {
      const a = document.createElement("a")
      a.href = url
      a.download = `polaroid-${effectId}-${i + 1}.png`
      a.click()
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← photos
        </button>
        <h1 className="text-xl font-bold text-gray-900">Polaroids</h1>
      </div>

      {/* Effect selector */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Effect</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {POLAROID_PRESETS.map((e) => (
            <button
              key={e.id}
              onClick={() => { setEffectId(e.id); setGeneratedUrls([]) }}
              className={cn(
                "p-3 rounded-2xl border text-left transition-all",
                effectId === e.id
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 hover:border-gray-400"
              )}
            >
              <p className="text-sm font-medium">{e.name}</p>
              <p className={cn("text-xs mt-0.5", effectId === e.id ? "text-gray-400" : "text-gray-400")}>
                {e.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Live preview + captions */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Preview & captions ({photos.length} photo{photos.length !== 1 ? "s" : ""})
        </p>

        {photos.length > 0 && (
          <>
            {/* Photo tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {photos.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedIdx(i)}
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all",
                    selectedIdx === i ? "border-gray-900" : "border-transparent opacity-60"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.previewUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Active polaroid preview */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedIdx}-${effectId}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <div className="bg-white rounded-lg shadow-xl p-3 w-52" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}>
                  <div className="aspect-square overflow-hidden rounded">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photos[selectedIdx]?.previewUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ filter: effect.filter }}
                    />
                  </div>
                  <div className="pt-3 pb-1 text-center">
                    <p className="text-xs text-gray-500 italic min-h-[16px]">
                      {captions[photos[selectedIdx]?.id] || ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Caption input */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Caption for photo {selectedIdx + 1}
              </label>
              <input
                type="text"
                value={captions[photos[selectedIdx]?.id] ?? ""}
                onChange={(e) => {
                  const id = photos[selectedIdx]?.id
                  if (id) setCaptions((c) => ({ ...c, [id]: e.target.value }))
                  setGeneratedUrls([])
                }}
                placeholder="still not over this day…"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
          </>
        )}
      </section>

      {/* Generated results or generate button */}
      {generatedUrls.length > 0 ? (
        <section className="space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Your polaroids ({generatedUrls.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {generatedUrls.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={url} alt={`Polaroid ${i + 1}`} className="rounded-xl shadow-md w-full" />
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
          className="w-full py-3.5 rounded-2xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <><span className="animate-spin">⏳</span> Generating {photos.length} polaroid{photos.length !== 1 ? "s" : ""}…</>
          ) : (
            `📷 Generate ${photos.length} Polaroid${photos.length !== 1 ? "s" : ""}`
          )}
        </button>
      )}
    </div>
  )
}
