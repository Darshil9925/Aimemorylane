"use client"

import { useState } from "react"
import { UploadStep } from "@/components/upload/upload-step"

export default function CreateMemoryPackPage() {
  const [step, setStep] = useState<"upload" | "config">("upload")

  if (step === "upload") {
    return (
      <UploadStep
        emoji="✨"
        title="Create a Memory Pack"
        description="Upload all your photos from an event. AI bundles everything into one beautiful memory pack."
        maxPhotos={100}
        minPhotos={5}
        onContinue={() => setStep("config")}
      />
    )
  }

  return (
    <div className="max-w-xl mx-auto text-center py-20 space-y-4">
      <span className="text-4xl">✨</span>
      <h2 className="text-xl font-bold">AI is analyzing your photos</h2>
      <p className="text-gray-400 text-sm">Generation coming in Phase 4</p>
      <button onClick={() => setStep("upload")} className="text-sm text-violet-500 hover:underline">
        ← Back to photos
      </button>
    </div>
  )
}
