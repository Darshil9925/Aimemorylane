"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUploadStore } from "@/store/upload-store"
import { useAIMemoryPack } from "@/hooks/use-ai"
import { useCredits } from "@/hooks/use-credits"
import { useProjectSave } from "@/hooks/use-project-save"
import { UpgradeModal } from "@/components/ui/upgrade-modal"
import { AnalysisResult } from "@/components/ai/analysis-result"
import { cn } from "@/lib/utils"

const EVENT_TYPES = [
  { id: "trip", label: "Trip / Travel", emoji: "✈️" },
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "concert", label: "Concert / Festival", emoji: "🎸" },
  { id: "graduation", label: "Graduation", emoji: "🎓" },
  { id: "relationship", label: "Couple / Relationship", emoji: "💑" },
  { id: "friends", label: "Friends Hangout", emoji: "🫂" },
]

const PACK_INCLUDES = [
  { emoji: "📷", label: "Polaroids" },
  { emoji: "🎞️", label: "Photobooth strip" },
  { emoji: "📒", label: "Scrapbook page" },
  { emoji: "📱", label: "IG Story card" },
]

const STAGE_LABELS: Record<string, string> = {
  analyzing: "Analysing your photos…",
  story: "Writing your memory story…",
  generating: "Generating your memory pack…",
  done: "Your memory pack is ready",
}

interface MemoryPackConfigProps {
  onBack: () => void
}

export function MemoryPackConfig({ onBack }: MemoryPackConfigProps) {
  const { photos } = useUploadStore()
  const [eventId, setEventId] = useState("trip")
  const [title, setTitle] = useState("")
  const { analyze, reset, isLoading: isAILoading, stage: aiStage, analyses, story, error: aiError } = useAIMemoryPack()
  const { consumeCredit, showUpgrade, upgradeResetAt, closeUpgrade } = useCredits()
  const { saveProject } = useProjectSave()

  const [isGenerating, setIsGenerating] = useState(false)
  const [packAssets, setPackAssets] = useState<{ label: string; url: string }[]>([])
  const [stage, setStage] = useState<"config" | "analyzing" | "results" | "pack">("config")

  const handleAnalyze = async () => {
    setStage("analyzing")
    await analyze(photos, Math.min(photos.length, 8))
    setStage("results")
  }

  const handleGeneratePack = async () => {
    const allowed = await consumeCredit()
    if (!allowed) return

    setIsGenerating(true)
    setStage("pack")
    const assets: { label: string; url: string }[] = []

    try {
      // 1. Photobooth strip (first 4 photos)
      const { drawPhotoboothStrip } = await import("@/lib/canvas/draw")
      const { PHOTOBOOTH_PRESETS } = await import("@/lib/canvas/filters")
      const template = PHOTOBOOTH_PRESETS[0]
      const stripCanvas = document.createElement("canvas")
      const caption = story?.suggestedCaption ?? title ?? "core memory ✦"
      await drawPhotoboothStrip(stripCanvas, photos.slice(0, 4), template, caption, new Date().toLocaleDateString())
      assets.push({ label: "🎞️ Photobooth Strip", url: stripCanvas.toDataURL("image/png") })

      // 2. Polaroids (first 4 photos)
      const { drawPolaroid } = await import("@/lib/canvas/draw")
      const { POLAROID_PRESETS } = await import("@/lib/canvas/filters")
      const polaroidPreset = POLAROID_PRESETS[0]
      for (let i = 0; i < Math.min(photos.length, 4); i++) {
        const pc = document.createElement("canvas")
        await drawPolaroid(pc, photos[i], polaroidPreset, analyses[i]?.captions?.genZ ?? "")
        assets.push({ label: `📷 Polaroid ${i + 1}`, url: pc.toDataURL("image/png") })
      }

      // 3. Scrapbook page (first 6 photos)
      const { drawScrapbookPage, SCRAPBOOK_STYLES } = await import("@/lib/canvas/scrapbook")
      const scrapStyle = SCRAPBOOK_STYLES[0]
      const scrapCanvas = document.createElement("canvas")
      await drawScrapbookPage(scrapCanvas, photos.slice(0, 6), scrapStyle, title || story?.title || "memories", 0)
      assets.push({ label: "📒 Scrapbook Page", url: scrapCanvas.toDataURL("image/png") })

      // 4. IG Story card (from the photobooth strip)
      const { drawSocialCard, SOCIAL_FORMATS } = await import("@/lib/canvas/social")
      const igFormat = SOCIAL_FORMATS[0]
      const igCanvas = document.createElement("canvas")
      await drawSocialCard(igCanvas, assets[0].url, igFormat, caption)
      assets.push({ label: "📱 IG Story Card", url: igCanvas.toDataURL("image/png") })

      setPackAssets(assets)

      // Save to database
      saveProject({
        mode: "memory-pack",
        title: title || story?.title || `Memory Pack · ${eventId}`,
        eventType: eventId,
        photoCount: photos.length,
        metadata: { analyses, story } as Record<string, unknown>,
        assets: assets.map((a) => a.url),
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPack = async () => {
    const { saveAllPhotos } = await import("@/lib/utils/download")
    await saveAllPhotos(
      packAssets.map((a, i) => ({
        dataUrl: a.url,
        filename: `memory-pack-${i + 1}-${a.label.replace(/[^\w]/g, "-")}.png`,
      })),
      "Your Memory Pack",
      `memory-pack-${Date.now()}.zip`
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← photos
        </button>
        <h1 className="text-xl font-bold text-gray-900">Memory Pack</h1>
      </div>

      {/* What's inside */}
      <section className="rounded-2xl bg-violet-50 border border-violet-100 p-5 space-y-3">
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest">What you&apos;ll get</p>
        <div className="grid grid-cols-4 gap-2">
          {PACK_INCLUDES.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 py-3 rounded-xl bg-white border border-violet-100">
              <span className="text-xl">{item.emoji}</span>
              <span className="text-[10px] text-gray-500 font-medium text-center leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Event type */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">What was this?</p>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((e) => (
            <button
              key={e.id}
              onClick={() => setEventId(e.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all",
                eventId === e.id
                  ? "bg-violet-600 text-white border-violet-600"
                  : "border-gray-200 text-gray-500 hover:border-gray-400"
              )}
            >
              <span>{e.emoji}</span>
              {e.label}
            </button>
          ))}
        </div>
      </section>

      {/* Title */}
      <section className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Memory title</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="NYC with the gang · Summer 2026"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
        />
      </section>

      {/* Photo count */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100">
        <span className="text-2xl">📂</span>
        <div>
          <p className="text-sm font-semibold text-gray-800">{photos.length} photos ready</p>
          <p className="text-xs text-gray-400">AI will analyse up to 8 to understand the event</p>
        </div>
      </div>

      {/* Stage-based UI */}
      <AnimatePresence mode="wait">
        {/* Step 1: Analyze button */}
        {stage === "config" && (
          <motion.button
            key="analyze"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={handleAnalyze}
            disabled={photos.length === 0}
            className="w-full py-3.5 rounded-2xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors"
          >
            ✨ Analyse photos &amp; generate memory story
          </motion.button>
        )}

        {/* Step 2: AI analyzing */}
        {stage === "analyzing" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-violet-50 border border-violet-100 p-6 text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl mx-auto animate-pulse">
              {aiStage === "story" ? "✍️" : "🔍"}
            </div>
            <p className="font-semibold text-gray-700">{STAGE_LABELS[aiStage] ?? "Processing…"}</p>
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-violet-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: AI results + generate pack button */}
        {stage === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <AnalysisResult analyses={analyses} story={story} />

            <button
              onClick={handleGeneratePack}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <><span className="animate-spin inline-block">⏳</span> Generating your pack…</>
              ) : (
                "📦 Generate Memory Pack"
              )}
            </button>

            <button onClick={() => { reset(); setStage("config") }} className="w-full text-xs text-gray-400 hover:text-gray-600">
              ← Re-analyse
            </button>
          </motion.div>
        )}

        {/* Step 4: Pack results */}
        {stage === "pack" && packAssets.length > 0 && (
          <motion.div
            key="pack"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Your memory pack ({packAssets.length} assets)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {packAssets.map((asset, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-1.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.url} alt={asset.label} className="rounded-xl shadow-md w-full" />
                  <p className="text-xs text-gray-500 text-center">{asset.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownloadPack}
                className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                ↓ Download Memory Pack ({packAssets.length} files)
              </button>
              <button
                onClick={() => { setPackAssets([]); setStage("results") }}
                className="px-5 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Re-generate
              </button>
            </div>

            {story && (
              <div className="rounded-2xl bg-violet-50 border border-violet-100 p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Your memory story</p>
                <p className="text-sm text-gray-700 italic">&ldquo;{story.story}&rdquo;</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state for pack generation */}
      {stage === "pack" && packAssets.length === 0 && isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-violet-50 border border-violet-100 p-6 text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl mx-auto animate-pulse">
            📦
          </div>
          <p className="font-semibold text-gray-700">Generating your memory pack…</p>
          <p className="text-xs text-gray-400">Creating photobooth strip, polaroids, scrapbook page, and IG story card</p>
        </motion.div>
      )}

      {aiError && (
        <p className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-500">✕ {aiError}</p>
      )}

      <UpgradeModal open={showUpgrade} onClose={closeUpgrade} resetAt={upgradeResetAt} />
    </div>
  )
}
