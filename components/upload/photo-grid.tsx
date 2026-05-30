"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useUploadStore } from "@/store/upload-store"
import type { UploadedPhoto } from "@/types"

interface PhotoGridProps {
  onContinue?: () => void
}

function PhotoCard({ photo, onRemove }: { photo: UploadedPhoto; onRemove: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.2 }}
      className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.previewUrl}
        alt="uploaded photo"
        className="w-full h-full object-cover"
      />
      <button
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
      >
        ✕
      </button>
    </motion.div>
  )
}

export function PhotoGrid({ onContinue }: PhotoGridProps) {
  const { photos, removePhoto, clearPhotos } = useUploadStore()

  if (photos.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {photos.length} photo{photos.length !== 1 ? "s" : ""} added
        </p>
        <button
          onClick={clearPhotos}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear all
        </button>
      </div>

      <motion.div
        layout
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2"
      >
        <AnimatePresence>
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onRemove={() => removePhoto(photo.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {onContinue && (
        <motion.button
          onClick={onContinue}
          className="w-full py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all"
          whileTap={{ scale: 0.98 }}
        >
          Continue with {photos.length} photo{photos.length !== 1 ? "s" : ""} →
        </motion.button>
      )}
    </div>
  )
}
