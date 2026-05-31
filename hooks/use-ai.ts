"use client"

import { useState, useCallback } from "react"
import type { PhotoAnalysis, MemoryStory, GeneratedCaption } from "@/types/ai"

// ── Single-photo caption (used in photobooth + polaroid) ────────────────────

export function useAICaption() {
  const [isLoading, setIsLoading] = useState(false)
  const [captions, setCaptions] = useState<GeneratedCaption | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateFromPhoto = useCallback(async (previewUrl: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { photoToBase64 } = await import("@/lib/canvas/resize")
      const photoData = await photoToBase64(previewUrl, 512)

      // Analyze with vision → get captions back
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: [photoData] }),
      })

      if (!res.ok) throw new Error(await res.text())
      const { analyses } = await res.json() as { analyses: PhotoAnalysis[] }
      const result = analyses[0]?.captions ?? null
      setCaptions(result)
      return result
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Caption generation failed"
      setError(msg)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { generateFromPhoto, captions, isLoading, error }
}

// ── Bulk caption for all photos in polaroid mode ─────────────────────────────

export function useAIBulkCaptions() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<Record<string, GeneratedCaption>>({})
  const [error, setError] = useState<string | null>(null)

  const generateForPhotos = useCallback(
    async (photos: { id: string; previewUrl: string }[]) => {
      setIsLoading(true)
      setError(null)
      setProgress(0)
      const newResults: Record<string, GeneratedCaption> = {}

      try {
        const { photoToBase64 } = await import("@/lib/canvas/resize")

        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i]
          const photoData = await photoToBase64(photo.previewUrl, 512)
          const res = await fetch("/api/ai/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ photos: [photoData] }),
          })
          if (res.ok) {
            const { analyses } = await res.json() as { analyses: PhotoAnalysis[] }
            if (analyses[0]?.captions) {
              newResults[photo.id] = analyses[0].captions
            }
          }
          setProgress(Math.round(((i + 1) / photos.length) * 100))
        }

        setResults(newResults)
        return newResults
      } catch (e) {
        setError(e instanceof Error ? e.message : "Bulk caption failed")
        return {}
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return { generateForPhotos, results, isLoading, progress, error }
}

// ── Full Memory Pack analysis ─────────────────────────────────────────────────

export function useAIMemoryPack() {
  const [isLoading, setIsLoading] = useState(false)
  const [stage, setStage] = useState<"idle" | "analyzing" | "story" | "done">("idle")
  const [analyses, setAnalyses] = useState<PhotoAnalysis[]>([])
  const [story, setStory] = useState<MemoryStory | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(
    async (photos: { id: string; previewUrl: string }[], limit = 8) => {
      setIsLoading(true)
      setStage("analyzing")
      setError(null)

      try {
        const { photosToBase64 } = await import("@/lib/canvas/resize")
        const photoData = await photosToBase64(
          photos.map((p) => p.previewUrl),
          limit,
          768
        )

        const analyzeRes = await fetch("/api/ai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photos: photoData }),
        })
        if (!analyzeRes.ok) throw new Error(await analyzeRes.text())
        const { analyses: newAnalyses } = await analyzeRes.json() as { analyses: PhotoAnalysis[] }
        setAnalyses(newAnalyses)

        // Generate story
        setStage("story")
        const storyRes = await fetch("/api/ai/story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analyses: newAnalyses }),
        })
        if (storyRes.ok) {
          const storyData = await storyRes.json() as MemoryStory
          setStory(storyData)
        }

        setStage("done")
        return { analyses: newAnalyses }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Analysis failed")
        setStage("idle")
        return null
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const reset = useCallback(() => {
    setStage("idle")
    setAnalyses([])
    setStory(null)
    setError(null)
  }, [])

  return { analyze, reset, isLoading, stage, analyses, story, error }
}
