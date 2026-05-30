"use client"

import { useState } from "react"
import { UploadStep } from "@/components/upload/upload-step"
import { MemoryPackConfig } from "@/components/modes/memory-pack/config"

export default function CreateMemoryPackPage() {
  const [step, setStep] = useState<"upload" | "config">("upload")

  return step === "upload" ? (
    <UploadStep
      emoji="✨"
      title="Create a Memory Pack"
      description="Upload all photos from an event. AI bundles everything into one memory pack."
      maxPhotos={100}
      minPhotos={5}
      onContinue={() => setStep("config")}
    />
  ) : (
    <MemoryPackConfig onBack={() => setStep("upload")} />
  )
}
