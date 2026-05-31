"use client"

import { useState, useCallback } from "react"

interface SaveOptions {
  mode: string
  title?: string
  caption?: string
  dateStamp?: string
  templateId?: string
  eventType?: string
  photoCount?: number
  metadata?: Record<string, unknown>
  assets?: string[]  // data URLs of generated images
}

export function useProjectSave() {
  const [isSaving, setIsSaving] = useState(false)
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const saveProject = useCallback(async (options: SaveOptions): Promise<string | null> => {
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      })

      if (res.status === 401) {
        // Not signed in — silently skip (don't block the UX)
        return null
      }

      const data = await res.json()
      if (data.projectId) {
        setSavedProjectId(data.projectId)
        return data.projectId
      }
      return null
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
      return null
    } finally {
      setIsSaving(false)
    }
  }, [])

  return { saveProject, isSaving, savedProjectId, error }
}
