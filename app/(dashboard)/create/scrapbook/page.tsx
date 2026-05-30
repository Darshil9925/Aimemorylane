"use client"

import { useState } from "react"
import { UploadStep } from "@/components/upload/upload-step"

export default function CreateScrapbookPage() {
  const [step, setStep] = useState<"upload" | "config">("upload")

  if (step === "upload") {
    return (
      <UploadStep
        emoji="📒"
        title="Create a Scrapbook"
        description="Upload 10–50 photos. AI will arrange them into handcrafted scrapbook pages."
        maxPhotos={50}
        minPhotos={10}
        onContinue={() => setStep("config")}
      />
    )
  }

  return (
    <div className="max-w-xl mx-auto text-center py-20 space-y-4">
      <span className="text-4xl">📒</span>
      <h2 className="text-xl font-bold">Choose your style</h2>
      <p className="text-gray-400 text-sm">Style picker coming in Phase 3</p>
      <button onClick={() => setStep("upload")} className="text-sm text-violet-500 hover:underline">
        ← Back to photos
      </button>
    </div>
  )
}
