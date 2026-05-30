"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { useUploadStore } from "@/store/upload-store"
import { PHOTOBOOTH_PRESETS } from "@/lib/canvas/filters"
import { drawPhotoboothStrip } from "@/lib/canvas/draw"
import { downloadCanvas } from "@/lib/canvas/export"
import { cn } from "@/lib/utils"

interface PhotoboothConfigProps {
  onBack: () => void
}

export function PhotoboothConfig({ onBack }: PhotoboothConfigProps) {
  const { photos } = useUploadStore()
  const [templateId, setTemplateId] = useState("vintage")
  const [caption, setCaption] = useState("")
  const [dateStamp, setDateStamp] = useState(
    new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const template = PHOTOBOOTH_PRESETS.find((t) => t.id === templateId)!
  const displayPhotos = photos.slice(0, 4)

  const handleGenerate = async () => {
    if (!displayPhotos.length) return
    setIsGenerating(true)
    const canvas = document.createElement("canvas")
    await drawPhotoboothStrip(canvas, displayPhotos, template, caption, dateStamp)
    setPreviewUrl(canvas.toDataURL("image/png"))
    setIsGenerating(false)
  }

  const handleDownload = () => {
    if (!previewUrl) return
    const a = document.createElement("a")
    a.href = previewUrl
    a.download = `photobooth-${templateId}-${Date.now()}.png`
    a.click()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← photos
        </button>
        <h1 className="text-xl font-bold text-gray-900">Photobooth Strip</h1>
      </div>

      {/* Template selector */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Template</p>
        <div className="flex gap-2 flex-wrap">
          {PHOTOBOOTH_PRESETS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTemplateId(t.id); setPreviewUrl(null) }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                templateId === t.id
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-200 text-gray-500 hover:border-gray-400"
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      </section>

      {/* Live CSS preview */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Preview</p>
        <div className="flex justify-center">
          <motion.div
            key={templateId}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
            style={{ background: template.bg, border: `3px solid ${template.border}`, padding: 14, width: 180 }}
          >
            <div className="flex flex-col gap-1.5">
              {displayPhotos.length > 0 ? (
                displayPhotos.map((photo) => (
                  <div key={photo.id} className="rounded-md overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.previewUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ filter: template.filter }}
                    />
                  </div>
                ))
              ) : (
                [1, 2, 3, 4].map((n) => (
                  <div key={n} className="rounded-md bg-white/40" style={{ aspectRatio: "4/3" }} />
                ))
              )}
            </div>
            <div className="mt-2 text-center">
              <p className="font-bold truncate" style={{ fontSize: 9, color: template.textColor, fontFamily: template.font }}>
                {caption || "core memory ✦"}
              </p>
              <p style={{ fontSize: 8, color: template.accentColor, fontFamily: template.font }}>
                {dateStamp}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Customization */}
      <section className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Customize</p>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => { setCaption(e.target.value); setPreviewUrl(null) }}
              placeholder="core memory ✦"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Date stamp</label>
            <input
              type="text"
              value={dateStamp}
              onChange={(e) => { setDateStamp(e.target.value); setPreviewUrl(null) }}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Generated preview or generate CTA */}
      {previewUrl ? (
        <section className="space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Your strip</p>
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Generated photobooth strip" className="rounded-2xl shadow-xl max-h-[500px] w-auto" />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              ↓ Download PNG
            </button>
            <button
              onClick={() => setPreviewUrl(null)}
              className="px-5 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Re-generate
            </button>
          </div>
        </section>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={isGenerating || displayPhotos.length === 0}
          className="w-full py-3.5 rounded-2xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <><span className="animate-spin">⏳</span> Generating…</>
          ) : (
            "✨ Generate Strip"
          )}
        </button>
      )}
    </div>
  )
}
