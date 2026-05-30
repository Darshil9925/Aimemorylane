"use client"

import { useState } from "react"
import { UploadStep } from "@/components/upload/upload-step"

export default function CreatePhotoboothPage() {
  const [step, setStep] = useState<"upload" | "config">("upload")

  if (step === "upload") {
    return (
      <UploadStep
        emoji="🎞️"
        title="Create a Photobooth Strip"
        description="Upload 1–10 photos. We'll arrange them into a classic photobooth strip."
        maxPhotos={10}
        minPhotos={1}
        onContinue={() => setStep("config")}
      />
    )
  }

  return (
    <div className="max-w-xl mx-auto text-center py-20 space-y-4">
      <span className="text-4xl">🎞️</span>
      <h2 className="text-xl font-bold">Choose your template</h2>
      <p className="text-gray-400 text-sm">Template picker coming in Phase 3</p>
      <button onClick={() => setStep("upload")} className="text-sm text-violet-500 hover:underline">
        ← Back to photos
      </button>
    </div>
  )
}
