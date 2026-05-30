"use client"

import { useState } from "react"
import { UploadStep } from "@/components/upload/upload-step"

export default function CreateDisposablePage() {
  const [step, setStep] = useState<"upload" | "config">("upload")

  if (step === "upload") {
    return (
      <UploadStep
        emoji="📸"
        title="Disposable Camera"
        description="Upload photos and we'll make them look like they were shot on a disposable."
        maxPhotos={20}
        minPhotos={1}
        onContinue={() => setStep("config")}
      />
    )
  }

  return (
    <div className="max-w-xl mx-auto text-center py-20 space-y-4">
      <span className="text-4xl">📸</span>
      <h2 className="text-xl font-bold">Choose your preset</h2>
      <p className="text-gray-400 text-sm">Preset picker coming in Phase 3</p>
      <button onClick={() => setStep("upload")} className="text-sm text-violet-500 hover:underline">
        ← Back to photos
      </button>
    </div>
  )
}
