"use client"

import { useState } from "react"
import { UploadStep } from "@/components/upload/upload-step"

export default function CreatePolaroidPage() {
  const [step, setStep] = useState<"upload" | "config">("upload")

  if (step === "upload") {
    return (
      <UploadStep
        emoji="📷"
        title="Create Polaroids"
        description="Upload any number of photos. Each gets its own dreamy polaroid."
        maxPhotos={20}
        minPhotos={1}
        onContinue={() => setStep("config")}
      />
    )
  }

  return (
    <div className="max-w-xl mx-auto text-center py-20 space-y-4">
      <span className="text-4xl">📷</span>
      <h2 className="text-xl font-bold">Choose your effect</h2>
      <p className="text-gray-400 text-sm">Effect picker coming in Phase 3</p>
      <button onClick={() => setStep("upload")} className="text-sm text-violet-500 hover:underline">
        ← Back to photos
      </button>
    </div>
  )
}
