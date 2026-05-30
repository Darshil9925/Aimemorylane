"use client"

import { useCallback, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUpload } from "@/hooks/use-upload"
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_MB, FREE_TIER } from "@/constants/config"

interface DropzoneProps {
  maxPhotos?: number
  onComplete?: () => void
}

export function Dropzone({ maxPhotos = FREE_TIER.maxPhotosPerUpload, onComplete }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const { processFiles, photos, isUploading, uploadProgress } = useUpload()

  const validate = (files: File[]) => {
    const errs: string[] = []
    const remaining = maxPhotos - photos.length
    if (files.length > remaining) {
      errs.push(`You can add ${remaining} more photo${remaining !== 1 ? "s" : ""} (limit: ${maxPhotos})`)
    }
    files.forEach((f) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(f.type)) {
        errs.push(`${f.name} — unsupported format`)
      } else if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errs.push(`${f.name} — exceeds ${MAX_FILE_SIZE_MB}MB limit`)
      }
    })
    return errs
  }

  const handle = useCallback(
    async (files: File[]) => {
      setErrors([])
      const errs = validate(files)
      if (errs.length) { setErrors(errs); return }
      await processFiles(files)
      onComplete?.()
    },
    [photos.length, maxPhotos, processFiles, onComplete]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      handle(files)
    },
    [handle]
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    handle(files)
    e.target.value = ""
  }

  const isFull = photos.length >= maxPhotos

  return (
    <div className="space-y-3">
      <motion.div
        className={`relative rounded-3xl border-2 border-dashed transition-colors cursor-pointer select-none ${
          isDragging
            ? "border-violet-400 bg-violet-50"
            : isFull
            ? "border-gray-100 bg-gray-50 cursor-not-allowed"
            : "border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/30"
        }`}
        onClick={() => !isFull && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        animate={{ scale: isDragging ? 1.01 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex flex-col items-center justify-center gap-4 py-14 px-6 text-center">
          {isUploading ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl animate-pulse">
                ⏳
              </div>
              <div className="w-48">
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className="h-full bg-violet-500 rounded-full"
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Processing {uploadProgress}%</p>
              </div>
            </>
          ) : isFull ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">
                ✓
              </div>
              <p className="text-sm text-gray-400">
                {maxPhotos} photos added — limit reached
              </p>
            </>
          ) : (
            <>
              <motion.div
                className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl"
                animate={isDragging ? { rotate: [0, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                📂
              </motion.div>
              <div>
                <p className="font-semibold text-gray-700">
                  {isDragging ? "Drop to add photos" : "Drop photos here"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  or <span className="text-violet-500 font-medium">click to browse</span>
                </p>
              </div>
              <p className="text-xs text-gray-300">
                JPG · PNG · HEIC · WEBP · max {MAX_FILE_SIZE_MB}MB each · up to {maxPhotos} photos
              </p>
            </>
          )}
        </div>

        {/* Hidden file inputs */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={onInputChange}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onInputChange}
        />
      </motion.div>

      {/* Camera button */}
      {!isFull && !isUploading && (
        <button
          onClick={() => cameraRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <span>📷</span> Take a photo with camera
        </button>
      )}

      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-red-50 border border-red-100 p-4 space-y-1"
          >
            {errors.map((e, i) => (
              <p key={i} className="text-sm text-red-500">
                ✕ {e}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
