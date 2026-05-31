"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUploadStore } from "@/store/upload-store"
import { SCRAPBOOK_STYLES, drawScrapbookPage, type ScrapbookStyle } from "@/lib/canvas/scrapbook"
import { useCredits } from "@/hooks/use-credits"
import { useProjectSave } from "@/hooks/use-project-save"
import { UpgradeModal } from "@/components/ui/upgrade-modal"
import { cn } from "@/lib/utils"

interface ScrapbookConfigProps {
  onBack: () => void
}

export function ScrapbookConfig({ onBack }: ScrapbookConfigProps) {
  const { photos } = useUploadStore()
  const [styleId, setStyleId] = useState("travel")
  const [title, setTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPages, setGeneratedPages] = useState<string[]>([])
  const { consumeCredit, showUpgrade, upgradeResetAt, closeUpgrade } = useCredits()
  const { saveProject } = useProjectSave()

  const style = SCRAPBOOK_STYLES.find((s) => s.id === styleId)!

  const handleGenerate = async () => {
    const allowed = await consumeCredit()
    if (!allowed) return
    setIsGenerating(true)

    try {
      const pages: string[] = []
      const photosPerPage = 6
      const pageCount = Math.ceil(photos.length / photosPerPage)

      for (let p = 0; p < pageCount; p++) {
        const pagePhotos = photos.slice(p * photosPerPage, (p + 1) * photosPerPage)
        const canvas = document.createElement("canvas")
        await drawScrapbookPage(canvas, pagePhotos, style, title, p)
        pages.push(canvas.toDataURL("image/png"))
      }

      setGeneratedPages(pages)
      saveProject({
        mode: "scrapbook",
        title: title || `Scrapbook · ${style.name}`,
        templateId: style.id,
        photoCount: photos.length,
        assets: pages,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    import("@/lib/utils/download").then(({ isMobile }) => setMobile(isMobile()))
  }, [])

  const handleDownload = async () => {
    if (generatedPages.length === 1) {
      // Single page → direct download, not ZIP
      const { saveSinglePhoto } = await import("@/lib/utils/download")
      await saveSinglePhoto(generatedPages[0], `scrapbook-${styleId}.png`)
    } else {
      const { saveAllPhotos } = await import("@/lib/utils/download")
      await saveAllPhotos(
        generatedPages.map((url, i) => ({ dataUrl: url, filename: `scrapbook-${styleId}-page-${i + 1}.png` })),
        "Your Scrapbook",
        `scrapbook-${styleId}-${Date.now()}.zip`
      )
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← photos
        </button>
        <h1 className="text-xl font-bold text-gray-900">Scrapbook</h1>
      </div>

      {/* Style selector */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Style</p>
        <div className="grid grid-cols-2 gap-3">
          {SCRAPBOOK_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => { setStyleId(s.id); setGeneratedPages([]) }}
              className={cn(
                "p-4 rounded-2xl border text-left transition-all",
                styleId === s.id
                  ? "border-emerald-400 bg-emerald-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex gap-1.5 mb-2">
                {s.stickers.slice(0, 3).map((e, i) => <span key={i} className="text-lg">{e}</span>)}
              </div>
              <p className={cn("text-sm font-semibold", styleId === s.id ? "text-emerald-700" : "text-gray-700")}>
                {s.name}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Title */}
      <section className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Title</p>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setGeneratedPages([]) }}
          placeholder="Bali 2026 · the crew"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
        />
      </section>

      {/* Photo count */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100">
        <span className="text-2xl">📂</span>
        <div>
          <p className="text-sm font-semibold text-gray-800">{photos.length} photos → {Math.ceil(photos.length / 6)} page{Math.ceil(photos.length / 6) !== 1 ? "s" : ""}</p>
          <p className="text-xs text-gray-400">6 photos per scrapbook page</p>
        </div>
      </div>

      {/* Generated pages or generate button */}
      <AnimatePresence mode="wait">
        {generatedPages.length > 0 ? (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Your scrapbook ({generatedPages.length} page{generatedPages.length !== 1 ? "s" : ""})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {generatedPages.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt={`Scrapbook page ${i + 1}`} className="rounded-2xl shadow-lg w-full" />
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                {mobile ? "📤 Save Scrapbook" : "↓ Download Scrapbook"} ({generatedPages.length} {generatedPages.length === 1 ? "page" : "pages"})
              </button>
              <button
                onClick={() => setGeneratedPages([])}
                className="px-5 py-3.5 rounded-2xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Re-generate
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.button
            key="generate-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleGenerate}
            disabled={isGenerating || photos.length === 0}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <><span className="animate-spin inline-block">⏳</span> Creating {Math.ceil(photos.length / 6)} page{Math.ceil(photos.length / 6) !== 1 ? "s" : ""}…</>
            ) : (
              `📒 Generate Scrapbook`
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <UpgradeModal open={showUpgrade} onClose={closeUpgrade} resetAt={upgradeResetAt} />
    </div>
  )
}
