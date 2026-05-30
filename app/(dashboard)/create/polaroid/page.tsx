"use client"

import { useState } from "react"
import { UploadStep } from "@/components/upload/upload-step"
import { PolaroidConfig } from "@/components/modes/polaroid/config"

export default function CreatePolaroidPage() {
  const [step, setStep] = useState<"upload" | "config">("upload")

  return step === "upload" ? (
    <UploadStep
      emoji="📷"
      title="Create Polaroids"
      description="Upload any photos — each gets its own dreamy polaroid."
      maxPhotos={20}
      minPhotos={1}
      onContinue={() => setStep("config")}
    />
  ) : (
    <PolaroidConfig onBack={() => setStep("upload")} />
  )
}
