import { useCallback } from "react"
import { useUploadStore } from "@/store/upload-store"
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from "@/constants/config"
import { generateId } from "@/lib/utils"
import type { UploadedPhoto } from "@/types"

export function useUpload() {
  const { addPhotos, setUploading, setProgress, photos } = useUploadStore()

  const processFiles = useCallback(async (files: File[]) => {
    const valid = files.filter((f) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(f.type)) return false
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) return false
      return true
    })

    setUploading(true)
    const processed: UploadedPhoto[] = []

    for (let i = 0; i < valid.length; i++) {
      const file = valid[i]
      const previewUrl = URL.createObjectURL(file)
      const img = await loadImage(previewUrl)
      processed.push({
        id: generateId(),
        url: previewUrl,
        previewUrl,
        file,
        width: img.width,
        height: img.height,
      })
      setProgress(Math.round(((i + 1) / valid.length) * 100))
    }

    addPhotos(processed)
    setUploading(false)
  }, [addPhotos, setUploading, setProgress])

  return { processFiles, photos }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
