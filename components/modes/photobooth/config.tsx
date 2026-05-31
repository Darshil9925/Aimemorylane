"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUploadStore } from "@/store/upload-store"
import { PHOTOBOOTH_PRESETS, type TemplatePreset } from "@/lib/canvas/filters"
import { drawPhotoboothStrip } from "@/lib/canvas/draw"
import { useAICaption } from "@/hooks/use-ai"
import { useCredits } from "@/hooks/use-credits"
import { useProjectSave } from "@/hooks/use-project-save"
import { UpgradeModal } from "@/components/ui/upgrade-modal"
import { SocialExport } from "@/components/shared/social-export"
import { cn } from "@/lib/utils"

interface PhotoboothConfigProps {
  onBack: () => void
}

function MiniStripCard({
  template,
  photos,
  selected,
  onClick,
}: {
  template: TemplatePreset
  photos: { id: string; previewUrl: string }[]
  selected: boolean
  onClick: () => void
}) {
  const slots = [0, 1, 2, 3]
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-xl overflow-hidden transition-all ring-offset-2",
        selected ? "ring-2 ring-gray-900 scale-105 shadow-lg" : "hover:scale-102 hover:shadow-md opacity-80 hover:opacity-100"
      )}
      style={{ background: template.stripBg }}
    >
      {/* Mini strip */}
      <div className="p-1.5 flex flex-col gap-0.5">
        {slots.map((i) => (
          <div
            key={i}
            className="rounded-sm overflow-hidden"
            style={{ aspectRatio: "1", background: template.darkStrip ? "#333" : "#ddd" }}
          >
            {photos[i] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photos[i].previewUrl}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: template.filter }}
              />
            )}
          </div>
        ))}
        {/* Mini branding bar */}
        <div
          className="mt-0.5 text-center truncate"
          style={{ fontSize: 6, color: template.textColor, fontFamily: template.font, letterSpacing: 0 }}
        >
          {template.name}
        </div>
      </div>

      {/* Selected check */}
      {selected && (
        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center">
          <span className="text-white text-[8px]">✓</span>
        </div>
      )}
    </button>
  )
}

export function PhotoboothConfig({ onBack }: PhotoboothConfigProps) {
  const { photos } = useUploadStore()
  const [templateId, setTemplateId] = useState("warm-vintage")
  const [caption, setCaption] = useState("")
  const [dateStamp, setDateStamp] = useState(
    new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { generateFromPhoto, isLoading: isAILoading } = useAICaption()
  const { consumeCredit, showUpgrade, upgradeResetAt, closeUpgrade } = useCredits()
  const { saveProject } = useProjectSave()

  const template = PHOTOBOOTH_PRESETS.find((t) => t.id === templateId)!
  const displayPhotos = photos.slice(0, 4)

  const handleGenerate = async () => {
    if (!displayPhotos.length) return
    const allowed = await consumeCredit()
    if (!allowed) return
    setIsGenerating(true)
    try {
      const canvas = document.createElement("canvas")
      await drawPhotoboothStrip(canvas, displayPhotos, template, caption, dateStamp)
      const dataUrl = canvas.toDataURL("image/png")
      setPreviewUrl(dataUrl)

      // Auto-save to database (non-blocking, won't fail the UX)
      saveProject({
        mode: "photobooth",
        title: caption || `Photobooth · ${template.name}`,
        caption,
        dateStamp,
        templateId: template.id,
        photoCount: displayPhotos.length,
        assets: [dataUrl],
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!previewUrl) return
    const { saveSinglePhoto } = await import("@/lib/utils/download")
    await saveSinglePhoto(previewUrl, `photobooth-${templateId}-${Date.now()}.png`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← photos
        </button>
        <h1 className="text-xl font-bold text-gray-900">Photobooth Strip</h1>
      </div>

      {/* Template grid */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Template</p>
          <p className="text-xs text-gray-300">{PHOTOBOOTH_PRESETS.length} styles</p>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {PHOTOBOOTH_PRESETS.map((t) => (
            <MiniStripCard
              key={t.id}
              template={t}
              photos={displayPhotos}
              selected={templateId === t.id}
              onClick={() => { setTemplateId(t.id); setPreviewUrl(null) }}
            />
          ))}
        </div>
        {/* Selected template name */}
        <AnimatePresence mode="wait">
          <motion.p
            key={templateId}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm font-medium text-gray-600"
          >
            {template.emoji} {template.name}
          </motion.p>
        </AnimatePresence>
      </section>

      {/* Live full preview */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Live preview</p>
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={templateId}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              className="rounded-lg overflow-hidden shadow-2xl"
              style={{
                background: template.stripBg,
                borderLeft: `3px solid ${template.border}`,
                borderRight: `3px solid ${template.border}`,
                borderTop: `2px solid ${template.border}`,
                borderBottom: `2px solid ${template.border}`,
                padding: "12px 10px",
                width: 148,
              }}
            >
              <div className="flex flex-col gap-1">
                {displayPhotos.length > 0
                  ? displayPhotos.map((photo) => (
                      <div key={photo.id} className="overflow-hidden" style={{ aspectRatio: "1", borderRadius: 3 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.previewUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          style={{ filter: template.filter }}
                        />
                      </div>
                    ))
                  : [1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        style={{
                          aspectRatio: "1",
                          borderRadius: 3,
                          background: template.darkStrip ? "#2a2a2a" : "#e0d8d0",
                        }}
                      />
                    ))}
              </div>
              <div className="mt-1.5 text-center" style={{ borderTop: `1px solid ${template.border}44`, paddingTop: 4 }}>
                <p style={{ fontSize: 7, fontWeight: 700, color: template.textColor, fontFamily: template.font }}>
                  {caption || "memory booth ✦"}
                </p>
                <p style={{ fontSize: 6, color: template.accentColor, fontFamily: template.font, marginTop: 1 }}>
                  {dateStamp}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Customization */}
      <section className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Customize</p>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-600">Caption</label>
              {displayPhotos[0] && (
                <button
                  onClick={async () => {
                    const result = await generateFromPhoto(displayPhotos[0].previewUrl)
                    if (result?.genZ) { setCaption(result.genZ); setPreviewUrl(null) }
                  }}
                  disabled={isAILoading}
                  className="text-xs text-violet-500 hover:text-violet-700 font-medium flex items-center gap-1 disabled:opacity-50"
                >
                  {isAILoading ? <><span className="animate-spin inline-block text-[10px]">⏳</span> Generating…</> : "✨ AI caption"}
                </button>
              )}
            </div>
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

      {/* Output */}
      {previewUrl ? (
        <section className="space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Your strip</p>
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Generated photobooth strip" className="rounded-2xl shadow-2xl max-h-[520px] w-auto" />
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
          <SocialExport assetDataUrl={previewUrl} title={caption || "memory booth ✦"} />
        </section>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={isGenerating || displayPhotos.length === 0}
          className="w-full py-3.5 rounded-2xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <><span className="animate-spin inline-block">⏳</span> Generating your strip…</>
          ) : (
            "✨ Generate Strip"
          )}
        </button>
      )}
      <UpgradeModal open={showUpgrade} onClose={closeUpgrade} resetAt={upgradeResetAt} />
    </div>
  )
}
