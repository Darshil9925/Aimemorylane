"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dropzone } from "./dropzone"
import { PhotoGrid } from "./photo-grid"
import { useUploadStore } from "@/store/upload-store"

interface UploadStepProps {
  title: string
  description: string
  emoji: string
  maxPhotos?: number
  minPhotos?: number
  onContinue: () => void
}

export function UploadStep({
  title,
  description,
  emoji,
  maxPhotos = 10,
  minPhotos = 1,
  onContinue,
}: UploadStepProps) {
  const { photos } = useUploadStore()
  const canContinue = photos.length >= minPhotos

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-4xl block">{emoji}</span>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>

      {/* Upload zone */}
      <Dropzone maxPhotos={maxPhotos} />

      {/* Photo grid */}
      <AnimatePresence>
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <PhotoGrid />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue */}
      <AnimatePresence>
        {canContinue && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={onContinue}
              className="w-full py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              Continue with {photos.length} photo{photos.length !== 1 ? "s" : ""} →
            </button>
            {photos.length < minPhotos && (
              <p className="text-center text-xs text-gray-400 mt-2">
                Add at least {minPhotos} photo{minPhotos !== 1 ? "s" : ""} to continue
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
