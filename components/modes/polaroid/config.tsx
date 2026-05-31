"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUploadStore } from "@/store/upload-store"
import { POLAROID_PRESETS, type PolaroidPreset } from "@/lib/canvas/filters"
import { drawPolaroid } from "@/lib/canvas/draw"
import { useAIBulkCaptions } from "@/hooks/use-ai"
import { useCredits } from "@/hooks/use-credits"
import { useProjectSave } from "@/hooks/use-project-save"
import { UpgradeModal } from "@/components/ui/upgrade-modal"
import { cn } from "@/lib/utils"

interface PolaroidConfigProps {
  onBack: () => void
}

function FrameCard({
  preset,
  photo,
  selected,
  onClick,
}: {
  preset: PolaroidPreset
  photo?: { previewUrl: string }
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl overflow-hidden transition-all ring-offset-2 p-0 text-left",
        selected ? "ring-2 ring-gray-900 scale-105 shadow-lg" : "hover:scale-102 hover:shadow-md opacity-75 hover:opacity-100"
      )}
      style={{ background: preset.frameColor, boxShadow: `0 4px 16px ${preset.frameShadow}` }}
    >
      {/* Mini polaroid */}
      <div className="p-1.5 pb-3">
        <div className="rounded-sm overflow-hidden mb-2" style={{ aspectRatio: "1", background: "#ddd" }}>
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.previewUrl}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: preset.filter }}
            />
          )}
        </div>
        <p className="text-center leading-none" style={{ fontSize: 6, color: preset.captionColor, fontFamily: "Georgia, serif" }}>
          {preset.name}
        </p>
      </div>
      {selected && (
        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gray-900 flex items-center justify-center">
          <span className="text-white text-[8px]">✓</span>
        </div>
      )}
    </button>
  )
}

export function PolaroidConfig({ onBack }: PolaroidConfigProps) {
  const { photos } = useUploadStore()
  const [presetId, setPresetId] = useState("classic-white")
  const [captions, setCaptions] = useState<Record<string, string>>({})
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const { generateForPhotos, isLoading: isAILoading, progress: aiProgress } = useAIBulkCaptions()
  const { consumeCredit, showUpgrade, upgradeResetAt, closeUpgrade } = useCredits()
  const { saveProject } = useProjectSave()

  const preset = POLAROID_PRESETS.find((p) => p.id === presetId)!

  const handleGenerate = async () => {
    const allowed = await consumeCredit()
    if (!allowed) return
    setIsGenerating(true)
    try {
      const urls: string[] = []
      for (const photo of photos) {
        const canvas = document.createElement("canvas")
        await drawPolaroid(canvas, photo, preset, captions[photo.id] ?? "")
        urls.push(canvas.toDataURL("image/png"))
      }
      setGeneratedUrls(urls)
      saveProject({
        mode: "polaroid",
        title: `Polaroids · ${preset.name}`,
        templateId: preset.id,
        photoCount: photos.length,
        assets: urls,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    import("@/lib/utils/download").then(({ isMobile }) => setMobile(isMobile()))
  }, [])

  const handleSaveAll = async () => {
    const { saveAllPhotos } = await import("@/lib/utils/download")
    await saveAllPhotos(
      generatedUrls.map((url, i) => ({ dataUrl: url, filename: `polaroid-${presetId}-${i + 1}.png` })),
      "Your Polaroids",
      `polaroids-${presetId}-${Date.now()}.zip`
    )
  }

  const handleSaveOne = async (url: string, index: number) => {
    const { saveSinglePhoto } = await import("@/lib/utils/download")
    await saveSinglePhoto(url, `polaroid-${presetId}-${index + 1}.png`)
  }

  const previewPhoto = photos[0]

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← photos
        </button>
        <h1 className="text-xl font-bold text-gray-900">Polaroids</h1>
      </div>

      {/* Frame / effect grid */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Frame & Effect</p>
          <p className="text-xs text-gray-300">{POLAROID_PRESETS.length} styles</p>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 relative">
          {POLAROID_PRESETS.map((p) => (
            <FrameCard
              key={p.id}
              preset={p}
              photo={previewPhoto}
              selected={presetId === p.id}
              onClick={() => { setPresetId(p.id); setGeneratedUrls([]) }}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={presetId}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p className="text-sm font-semibold text-gray-700">{preset.name}</p>
            <p className="text-xs text-gray-400">{preset.description}</p>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Live preview + per-photo captions */}
      {photos.length > 0 && (
        <section className="space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Captions ({photos.length} photo{photos.length !== 1 ? "s" : ""})
          </p>

          {/* Photo thumb row */}
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

          {/* Live polaroid preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedIdx}-${presetId}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <div
                className="rounded shadow-xl overflow-hidden"
                style={{
                  background: preset.frameColor,
                  padding: "12px 12px 40px 12px",
                  width: 190,
                  boxShadow: `0 12px 40px ${preset.frameShadow}`,
                }}
              >
                <div className="aspect-square overflow-hidden rounded-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photos[selectedIdx]?.previewUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: preset.filter }}
                  />
                </div>
                <p
                  className="text-center mt-2 italic text-xs min-h-[16px]"
                  style={{ color: preset.captionColor, fontFamily: "Georgia, serif" }}
                >
                  {captions[photos[selectedIdx]?.id] || ""}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* AI bulk captions */}
          <button
            onClick={async () => {
              const results = await generateForPhotos(photos)
              if (Object.keys(results).length > 0) {
                setCaptions((prev) => ({
                  ...prev,
                  ...Object.fromEntries(Object.entries(results).map(([id, c]) => [id, c.genZ])),
                }))
                setGeneratedUrls([])
              }
            }}
            disabled={isAILoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-violet-200 bg-violet-50 text-violet-600 text-sm font-medium hover:bg-violet-100 transition-colors disabled:opacity-50"
          >
            {isAILoading
              ? <><span className="animate-spin inline-block">⏳</span> Analysing… {aiProgress}%</>
              : "✨ AI caption all photos"}
          </button>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Caption for photo {selectedIdx + 1}</label>
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
        </section>
      )}

      {/* Output */}
      {generatedUrls.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Your polaroids ({generatedUrls.length})
            </p>
            {mobile && (
              <p className="text-xs text-gray-400">tap a photo to save individually</p>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {generatedUrls.map((url, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Polaroid ${i + 1}`} className="rounded-xl shadow-md w-full" />
                <button
                  onClick={() => handleSaveOne(url, i)}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 sm:opacity-0 transition-opacity active:opacity-100"
                  title={`Save polaroid ${i + 1}`}
                >
                  ↓
                </button>
                {/* Always-visible save button on mobile */}
                <button
                  onClick={() => handleSaveOne(url, i)}
                  className="sm:hidden absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white text-sm flex items-center justify-center"
                >
                  ↓
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSaveAll}
              className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              {mobile ? `📤 Share All / Save to Photos` : `↓ Download All as ZIP`} ({generatedUrls.length})
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
            <><span className="animate-spin inline-block">⏳</span> Generating {photos.length} polaroid{photos.length !== 1 ? "s" : ""}…</>
          ) : (
            `📷 Generate ${photos.length} Polaroid${photos.length !== 1 ? "s" : ""}`
          )}
        </button>
      )}
      <UpgradeModal open={showUpgrade} onClose={closeUpgrade} resetAt={upgradeResetAt} />
    </div>
  )
}
